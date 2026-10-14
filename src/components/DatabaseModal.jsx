import React, { useState, useEffect } from 'react';
import { X, Database, Terminal, Download, Upload, RotateCcw, Save, Check, AlertTriangle, Table as TableIcon, Sliders, Shield } from 'lucide-react';
import { dbService } from '../db/database';

export default function DatabaseModal({
  isOpen,
  onClose,
  onDatabaseUpdated
}) {
  const [activeTab, setActiveTab] = useState('variables'); // 'variables' | 'tools' | 'rules' | 'sql'
  const [variablesList, setVariablesList] = useState([]);
  const [editedVars, setEditedVars] = useState({});
  const [toolsList, setToolsList] = useState([]);
  const [rulesList, setRulesList] = useState([]);
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM config_variables;");
  const [sqlResult, setSqlResult] = useState(null);
  const [sqlError, setSqlError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    try {
      const vars = dbService.getVariables();
      setVariablesList(vars.list || []);
      const initialMap = {};
      (vars.list || []).forEach(v => {
        initialMap[v.key] = v.value;
      });
      setEditedVars(initialMap);

      setToolsList(dbService.getTools());
      setRulesList(dbService.getScoringRules());
    } catch (e) {
      console.error('Error loading DB data:', e);
    }
  };

  if (!isOpen) return null;

  const handleVarChange = (key, val) => {
    setEditedVars(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleSaveVariable = (key) => {
    const newVal = editedVars[key];
    dbService.updateVariable(key, newVal);
    loadData();
    if (onDatabaseUpdated) onDatabaseUpdated();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSaveAll = () => {
    Object.keys(editedVars).forEach(key => {
      dbService.updateVariable(key, editedVars[key]);
    });
    loadData();
    if (onDatabaseUpdated) onDatabaseUpdated();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleRunSql = () => {
    setSqlError(null);
    setSqlResult(null);
    try {
      const out = dbService.runQuery(sqlQuery);
      if (out.success) {
        setSqlResult(out.results);
        loadData();
        if (onDatabaseUpdated) onDatabaseUpdated();
      } else {
        setSqlError(out.error);
      }
    } catch (e) {
      setSqlError(e.message);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all variables and tables to factory default seed data?")) {
      dbService.resetToDefaults();
      loadData();
      if (onDatabaseUpdated) onDatabaseUpdated();
    }
  };

  const handleExport = () => {
    const blob = dbService.exportDatabaseBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `antigravity_scoring_rules_${new Date().toISOString().slice(0, 10)}.db`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await dbService.importDatabaseFile(file);
      loadData();
      if (onDatabaseUpdated) onDatabaseUpdated();
      alert("SQLite database imported successfully!");
    } catch (err) {
      alert("Error importing database file: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>In-Browser SQLite Database Manager</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-medium">
                  sql.js WASM Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Variables and thresholds stored in SQLite tables with persistent browser storage
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {saveSuccess && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" /> Saved & Recalculated!
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation & Database Utility Buttons */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('variables')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                activeTab === 'variables'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Config Variables & Thresholds</span>
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                activeTab === 'rules'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Scoring Rules Table</span>
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                activeTab === 'tools'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tools Metadata</span>
            </button>

            <button
              onClick={() => setActiveTab('sql')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                activeTab === 'sql'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>SQL Query Console</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center space-x-1 text-xs text-slate-700 bg-white hover:bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200 shadow-2xs transition"
              title="Export SQLite database as .db file"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Export .db</span>
            </button>

            <label className="inline-flex items-center space-x-1 text-xs text-slate-700 bg-white hover:bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200 shadow-2xs transition cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-indigo-600" />
              <span>Import .db</span>
              <input
                type="file"
                accept=".db,.sqlite,.sqlite3"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            <button
              onClick={handleReset}
              className="inline-flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-md border border-rose-200 transition"
              title="Reset all tables and values to default seed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-auto p-6">
          {/* TAB 1: Config Variables & Thresholds */}
          {activeTab === 'variables' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Live Database Variables (`config_variables` table)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Modify exchange rates, monthly seat costs, and scoring threshold variables below. Changes instantly recalculate all scoring formulas.
                  </p>
                </div>
                <button
                  onClick={handleSaveAll}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save All Changes</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Variable Key</th>
                      <th className="px-4 py-3">Label / Description</th>
                      <th className="px-4 py-3 w-40">Value in SQLite</th>
                      <th className="px-4 py-3">Unit</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {variablesList.map((v) => (
                      <tr key={v.key} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3 font-mono font-semibold text-indigo-700">
                          {v.key}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{v.label}</div>
                          <div className="text-[11px] text-slate-500 max-w-md">{v.description}</div>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            step="any"
                            value={editedVars[v.key] ?? v.value}
                            onChange={(e) => handleVarChange(v.key, e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold bg-white font-mono"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-500">
                          {v.unit}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleSaveVariable(v.key)}
                            className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium rounded border border-slate-200 transition"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Scoring Rules */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Scoring & Recommendation Rules (`scoring_rules` table)
                </h3>
                <p className="text-xs text-slate-500">
                  Rules evaluating agentic readiness, user volumes, and pricing triggers.
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Rule Name</th>
                      <th className="px-4 py-3">Condition</th>
                      <th className="px-4 py-3">Target Tool</th>
                      <th className="px-4 py-3">Score Delta</th>
                      <th className="px-4 py-3">Explanation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {rulesList.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3 font-mono text-slate-500">{r.id}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{r.rule_name}</td>
                        <td className="px-4 py-3 font-mono text-xs text-purple-700 bg-purple-50/50 rounded">
                          {r.condition}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-800">{r.target_tool}</td>
                        <td className="px-4 py-3 font-bold text-indigo-600">+{r.score_delta}</td>
                        <td className="px-4 py-3 text-slate-600 text-[11px] max-w-sm">{r.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Tools Table */}
          {activeTab === 'tools' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Registered Selection Tools (`tools` table)
                </h3>
                <p className="text-xs text-slate-500">
                  Available tools compared in the scoring system.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {toolsList.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{t.name}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white border border-slate-200">
                        {t.mode_name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{t.description}</p>
                    <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200 space-y-1">
                      <div><strong className="text-slate-700">Badge:</strong> {t.badge}</div>
                      <div><strong className="text-slate-700">Complexity:</strong> {t.workflow_complexity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SQL Query Console */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  <span>Execute Arbitrary SQL against in-browser SQLite WASM</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Try running queries like <code className="bg-slate-100 px-1 py-0.5 rounded">SELECT * FROM config_variables;</code> or <code className="bg-slate-100 px-1 py-0.5 rounded">UPDATE config_variables SET value = 36 WHERE key = 'usd_thb_rate';</code>
                </p>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  className="w-full p-3 font-mono text-xs rounded-lg border border-slate-300 bg-slate-900 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                  placeholder="Enter SQL statement here..."
                />

                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Tables: <span className="font-mono text-slate-700 font-semibold">config_variables, tools, scoring_rules, evaluation_logs</span>
                  </div>
                  <button
                    onClick={handleRunSql}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
                  >
                    <Terminal className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Run Query</span>
                  </button>
                </div>
              </div>

              {sqlError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
                  <strong>SQL Error:</strong> {sqlError}
                </div>
              )}

              {sqlResult && sqlResult.length > 0 && (
                <div className="space-y-4 pt-2">
                  {sqlResult.map((res, rIdx) => (
                    <div key={rIdx} className="overflow-x-auto border border-slate-200 rounded-lg">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                          <tr>
                            {res.columns.map((c, cIdx) => (
                              <th key={cIdx} className="px-3 py-2 font-bold">{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {res.values.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-slate-50">
                              {row.map((val, cellIdx) => (
                                <td key={cellIdx} className="px-3 py-2 text-slate-800">
                                  {String(val ?? 'NULL')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}

              {sqlResult && sqlResult.length === 0 && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  Statement executed successfully (0 rows returned or DDL/DML update completed).
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Close */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Persistent storage: <span className="font-mono text-slate-700">localStorage.antigravity_sqlite_db_v1</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
