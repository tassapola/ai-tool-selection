import initSqlJs from 'sql.js';
import { DEFAULT_CONFIG_VARIABLES, DEFAULT_TOOLS, DEFAULT_SCORING_RULES } from './defaultData';

const LOCAL_STORAGE_KEY = 'antigravity_sqlite_db_v1';

class DatabaseService {
  constructor() {
    this.db = null;
    this.SQL = null;
    this.isInitialized = false;
    this.initPromise = null;
    this.listeners = new Set();
  }

  // Subscribe to DB changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try {
        cb();
      } catch (e) {
        console.error('Error in DB listener:', e);
      }
    });
  }

  async init() {
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        // Resolve wasm file relative to base url for public deployments (e.g. GitHub Pages or Vercel)
        const baseUrl = import.meta.env.BASE_URL || '/';
        const wasmUrl = baseUrl.endsWith('/') ? `${baseUrl}sql-wasm.wasm` : `${baseUrl}/sql-wasm.wasm`;

        this.SQL = await initSqlJs({
          locateFile: () => wasmUrl
        });

        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
          try {
            const binary = this._base64ToUint8Array(savedData);
            this.db = new this.SQL.Database(binary);
            this.isInitialized = true;
            return this.db;
          } catch (err) {
            console.warn('Failed to load saved SQLite DB from localStorage, creating fresh instance:', err);
          }
        }

        // Create new Database
        this.db = new this.SQL.Database();
        this._bootstrapSchema();
        this._seedDefaults();
        this.persist();
        this.isInitialized = true;
        return this.db;
      } catch (err) {
        console.error('Critical failure initializing SQLite WASM:', err);
        throw err;
      }
    })();

    return this.initPromise;
  }

  _bootstrapSchema() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS config_variables (
        key TEXT PRIMARY KEY,
        value REAL NOT NULL,
        data_type TEXT DEFAULT 'number',
        unit TEXT DEFAULT '',
        label TEXT NOT NULL,
        category TEXT DEFAULT 'general',
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS tools (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        mode_name TEXT NOT NULL,
        badge TEXT NOT NULL,
        tagline TEXT NOT NULL,
        description TEXT NOT NULL,
        primary_color TEXT NOT NULL,
        bg_color TEXT NOT NULL,
        border_color TEXT NOT NULL,
        text_color TEXT NOT NULL,
        ideal_for TEXT NOT NULL,
        pros TEXT NOT NULL,
        cons TEXT NOT NULL,
        workflow_complexity TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS scoring_rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rule_name TEXT NOT NULL,
        condition TEXT NOT NULL,
        target_tool TEXT NOT NULL,
        score_delta REAL NOT NULL,
        is_hard_override INTEGER DEFAULT 0,
        reason TEXT
      );

      CREATE TABLE IF NOT EXISTS evaluation_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        evaluated_at TEXT NOT NULL,
        q1_workflow_ready INTEGER NOT NULL,
        h_users INTEGER NOT NULL,
        u_users INTEGER NOT NULL,
        cost_usd REAL NOT NULL,
        cost_thb REAL NOT NULL,
        recommended_tool TEXT NOT NULL
      );
    `);
  }

  _seedDefaults() {
    // Seed config variables
    const stmtVar = this.db.prepare(`
      INSERT OR REPLACE INTO config_variables (key, value, data_type, unit, label, category, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const v of DEFAULT_CONFIG_VARIABLES) {
      stmtVar.run([v.key, v.value, v.data_type, v.unit, v.label, v.category, v.description]);
    }
    stmtVar.free();

    // Seed tools
    const stmtTool = this.db.prepare(`
      INSERT OR REPLACE INTO tools (id, name, mode_name, badge, tagline, description, primary_color, bg_color, border_color, text_color, ideal_for, pros, cons, workflow_complexity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const t of DEFAULT_TOOLS) {
      stmtTool.run([
        t.id, t.name, t.mode_name, t.badge, t.tagline, t.description,
        t.primary_color, t.bg_color, t.border_color, t.text_color,
        t.ideal_for, t.pros, t.cons, t.workflow_complexity
      ]);
    }
    stmtTool.free();

    // Seed scoring rules
    const stmtRule = this.db.prepare(`
      INSERT OR REPLACE INTO scoring_rules (id, rule_name, condition, target_tool, score_delta, is_hard_override, reason)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const r of DEFAULT_SCORING_RULES) {
      stmtRule.run([r.id, r.rule_name, r.condition, r.target_tool, r.score_delta, r.is_hard_override, r.reason]);
    }
    stmtRule.free();
  }

  persist() {
    if (!this.db) return;
    try {
      const data = this.db.export();
      const base64 = this._uint8ArrayToBase64(data);
      localStorage.setItem(LOCAL_STORAGE_KEY, base64);
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to persist SQLite DB to localStorage:', e);
    }
  }

  getVariables() {
    if (!this.db) return {};
    const res = this.db.exec("SELECT key, value, data_type, unit, label, category, description FROM config_variables");
    if (!res || !res[0]) return {};
    
    const map = {};
    const list = [];
    const cols = res[0].columns;
    res[0].values.forEach(row => {
      const item = {};
      cols.forEach((col, idx) => { item[col] = row[idx]; });
      map[item.key] = item.value;
      list.push(item);
    });
    return { map, list };
  }

  getVariable(key, fallback = null) {
    if (!this.db) return fallback;
    const stmt = this.db.prepare("SELECT value FROM config_variables WHERE key = ?");
    stmt.bind([key]);
    let val = fallback;
    if (stmt.step()) {
      val = stmt.get()[0];
    }
    stmt.free();
    return val;
  }

  updateVariable(key, value) {
    if (!this.db) return false;
    const numValue = Number(value);
    this.db.run("UPDATE config_variables SET value = ? WHERE key = ?", [numValue, key]);
    this.persist();
    return true;
  }

  getTools() {
    if (!this.db) return DEFAULT_TOOLS;
    const res = this.db.exec("SELECT * FROM tools ORDER BY id ASC");
    if (!res || !res[0]) return DEFAULT_TOOLS;
    const cols = res[0].columns;
    return res[0].values.map(row => {
      const item = {};
      cols.forEach((col, idx) => { item[col] = row[idx]; });
      return item;
    });
  }

  getScoringRules() {
    if (!this.db) return DEFAULT_SCORING_RULES;
    const res = this.db.exec("SELECT * FROM scoring_rules ORDER BY id ASC");
    if (!res || !res[0]) return DEFAULT_SCORING_RULES;
    const cols = res[0].columns;
    return res[0].values.map(row => {
      const item = {};
      cols.forEach((col, idx) => { item[col] = row[idx]; });
      return item;
    });
  }

  runQuery(sqlString) {
    if (!this.db) throw new Error("Database not initialized");
    try {
      const results = this.db.exec(sqlString);
      // Persist in case of INSERT/UPDATE/DELETE
      if (/^\s*(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i.test(sqlString)) {
        this.persist();
      }
      return { success: true, results };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  logEvaluation({ q1WorkflowReady, hUsers, uUsers, costUsd, costThb, recommendedTool }) {
    if (!this.db) return;
    try {
      this.db.run(`
        INSERT INTO evaluation_logs (evaluated_at, q1_workflow_ready, h_users, u_users, cost_usd, cost_thb, recommended_tool)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        new Date().toISOString(),
        q1WorkflowReady ? 1 : 0,
        hUsers,
        uUsers,
        costUsd,
        costThb,
        recommendedTool
      ]);
      this.persist();
    } catch (e) {
      console.error('Error logging evaluation:', e);
    }
  }

  getEvaluationLogs() {
    if (!this.db) return [];
    const res = this.db.exec("SELECT * FROM evaluation_logs ORDER BY id DESC LIMIT 20");
    if (!res || !res[0]) return [];
    const cols = res[0].columns;
    return res[0].values.map(row => {
      const item = {};
      cols.forEach((col, idx) => { item[col] = row[idx]; });
      return item;
    });
  }

  resetToDefaults() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    this.db = new this.SQL.Database();
    this._bootstrapSchema();
    this._seedDefaults();
    this.persist();
    this.notifyListeners();
  }

  exportDatabaseBlob() {
    if (!this.db) return null;
    const binary = this.db.export();
    return new Blob([binary], { type: 'application/x-sqlite3' });
  }

  async importDatabaseFile(file) {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    this.db = new this.SQL.Database(uint8Array);
    this.persist();
    this.notifyListeners();
  }

  _uint8ArrayToBase64(uint8Array) {
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return window.btoa(binary);
  }

  _base64ToUint8Array(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}

export const dbService = new DatabaseService();
