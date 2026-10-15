import React, { useState, useEffect } from 'react';
import { X, Database, Terminal, Download, Upload, RotateCcw, Save, Check, AlertTriangle, Table as TableIcon, Sliders, Shield, Sparkles } from 'lucide-react';
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
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตตัวแปรและตารางทั้งหมดกลับเป็นค่าเริ่มต้นมาตรฐาน?")) {
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
      alert("นำเข้าฐานข้อมูล SQLite สำเร็จแล้ว!");
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการนำเข้าไฟล์ฐานข้อมูล: " + err.message);
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
                <span>ระบบจัดการฐานข้อมูล SQLite ในเบราว์เซอร์</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-medium">
                  sql.js WASM พร้อมทำงาน
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                ตัวแปรและเกณฑ์คะแนนถูกจัดเก็บในตาราง SQLite พร้อมบันทึกลงหน่วยความจำเบราว์เซอร์อย่างถาวร
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {saveSuccess && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" /> บันทึกและคำนวณคะแนนใหม่สำเร็จ!
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="ปิดหน้าต่าง"
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
              <span>ตัวแปรคอนฟิกและเกณฑ์คะแนน</span>
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
              <span>ตารางกฎการคิดคะแนน</span>
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
              <span>ข้อมูลเมทาดาตาของเครื่องมือ</span>
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
              <span>คอนโซลคำสั่ง SQL</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center space-x-1 text-xs text-slate-700 bg-white hover:bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200 shadow-2xs transition"
              title="ส่งออกฐานข้อมูล SQLite เป็นไฟล์ .db"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>ส่งออก .db</span>
            </button>

            <label className="inline-flex items-center space-x-1 text-xs text-slate-700 bg-white hover:bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200 shadow-2xs transition cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-indigo-600" />
              <span>นำเข้า .db</span>
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
              title="รีเซ็ตตารางและค่าทั้งหมดกลับเป็นค่าเริ่มต้นมาตรฐาน"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>รีเซ็ตค่าเริ่มต้น</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-auto p-6">
          {/* TAB 1: Config Variables & Thresholds */}
          {activeTab === 'variables' && (
            <div className="space-y-6">
              {/* Dedicated Scoring Weights Tuner Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-white border-2 border-indigo-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        การกำหนดสัดส่วนน้ำหนักคะแนน (จัดเก็บใน SQLite ตาราง `config_variables`)
                      </h4>
                      <p className="text-xs text-slate-500">
                        กำหนดสัดส่วนน้ำหนักระหว่างความคุ้มค่าด้านต้นทุนทางการเงิน (Cost Economics) กับความสามารถด้านฟีเจอร์และสถาปัตยกรรม (Features & Architecture)
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-full border border-indigo-200 shadow-2xs">
                    ปัจจุบัน: ต้นทุน {editedVars.weight_cost_percentage ?? 60}% / ฟีเจอร์ {editedVars.weight_features_percentage ?? 40}%
                  </span>
                </div>

                {/* Weight Sliders / Quick Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3.5 rounded-xl border border-indigo-100 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">1. น้ำหนักด้านต้นทุน (weight_cost_percentage):</span>
                      <span className="font-mono font-bold text-indigo-700 text-sm">{editedVars.weight_cost_percentage ?? 60}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={editedVars.weight_cost_percentage ?? 60}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        handleVarChange('weight_cost_percentage', val);
                        handleVarChange('weight_features_percentage', 100 - val);
                      }}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <div className="text-[11px] text-slate-400">ประเมินค่าไลเซนส์ M365 เทียบกับต้นทุนดำเนินการของ Athena</div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-indigo-100 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">2. น้ำหนักด้านฟีเจอร์ (weight_features_percentage):</span>
                      <span className="font-mono font-bold text-purple-700 text-sm">{editedVars.weight_features_percentage ?? 40}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={editedVars.weight_features_percentage ?? 40}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        handleVarChange('weight_features_percentage', val);
                        handleVarChange('weight_cost_percentage', 100 - val);
                      }}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                    <div className="text-[11px] text-slate-400">ประเมินความพร้อมทีม, SmartServe, การดูแล UAM และ Local LLM</div>
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-indigo-100/80">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-slate-500 font-medium text-[11px]">พรีเซ็ตน้ำหนักด่วน:</span>
                    <button
                      type="button"
                      onClick={() => {
                        handleVarChange('weight_cost_percentage', 60);
                        handleVarChange('weight_features_percentage', 40);
                      }}
                      className="px-2.5 py-1 rounded bg-white hover:bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 text-xs transition"
                    >
                      ต้นทุน 60% / ฟีเจอร์ 40% (ค่าเริ่มต้น)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleVarChange('weight_cost_percentage', 70);
                        handleVarChange('weight_features_percentage', 30);
                      }}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 text-xs transition"
                    >
                      ต้นทุน 70% / ฟีเจอร์ 30%
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleVarChange('weight_cost_percentage', 50);
                        handleVarChange('weight_features_percentage', 50);
                      }}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 text-xs transition"
                    >
                      สมดุล 50% / 50%
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleVarChange('weight_cost_percentage', 40);
                        handleVarChange('weight_features_percentage', 60);
                      }}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 text-xs transition"
                    >
                      ต้นทุน 40% / ฟีเจอร์ 60%
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      dbService.updateVariable('weight_cost_percentage', editedVars.weight_cost_percentage ?? 60);
                      dbService.updateVariable('weight_features_percentage', editedVars.weight_features_percentage ?? 40);
                      loadData();
                      if (onDatabaseUpdated) onDatabaseUpdated();
                      setSaveSuccess(true);
                      setTimeout(() => setSaveSuccess(false), 2000);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
                  >
                    บันทึกน้ำหนักลง SQLite
                  </button>
                </div>
              </div>

              {/* Dedicated Cost Threshold Override Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50/90 via-emerald-50/40 to-white border-2 border-amber-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        เกณฑ์ส่วนต่างต้นทุนเพื่อเปลี่ยนเป็น Athena (`COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD`)
                      </h4>
                      <p className="text-xs text-slate-500">
                        เมื่อคำถามข้อ 1 เลือก Microsoft 365 Copilot (Easy mode) Advanced license allow share หากต้นทุนรายปีของ Microsoft สูงกว่า Athena เกินจำนวนนี้ ระบบจะแนะนำ Athena แทน ถ้าเลือกเลขต่ำ โอกาสเลือก Microsoft จะสูงขึ้น
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-white px-2.5 py-1 rounded-full border border-amber-200 shadow-2xs font-mono">
                    ปัจจุบัน: ฿{Number(editedVars.COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD ?? 350000).toLocaleString()} บาท
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full sm:w-64">
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">฿</span>
                      <input
                        type="number"
                        step="10000"
                        value={editedVars.COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD ?? 350000}
                        onChange={(e) => handleVarChange('COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD', e.target.value)}
                        className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => handleVarChange('COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD', 350000)}
                      className="px-2.5 py-1 rounded bg-white hover:bg-amber-50 text-amber-800 font-semibold border border-amber-200 text-xs transition"
                    >
                      ฿350,000 บาท (ค่าเริ่มต้น)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVarChange('COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD', 500000)}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs transition"
                    >
                      ฿500,000 บาท
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVarChange('COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD', 250000)}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs transition"
                    >
                      ฿250,000 บาท (เชิงรุก)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVarChange('COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD', 1000000)}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs transition"
                    >
                      ฿1,000,000 บาท (อนุรักษนิยม)
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      dbService.updateVariable('COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD', editedVars.COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD ?? 350000);
                      loadData();
                      if (onDatabaseUpdated) onDatabaseUpdated();
                      setSaveSuccess(true);
                      setTimeout(() => setSaveSuccess(false), 2000);
                    }}
                    className="ml-auto px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition"
                  >
                    บันทึกเกณฑ์ส่วนต่างต้นทุน
                  </button>
                </div>
              </div>

              {/* All Database Variables Table Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    ตัวแปรในฐานข้อมูลแบบเรียลไทม์ (ตาราง `config_variables`)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ปรับเปลี่ยนอัตราแลกเปลี่ยน, ค่าไลเซนส์รายเดือน และราคาต่อหน่วยของ Athena ด้านล่าง เมื่อบันทึกระบบจะคำนวณสูตรคะแนนใหม่ทันที
                  </p>
                </div>
                <button
                  onClick={handleSaveAll}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>บันทึกการเปลี่ยนแปลงทั้งหมด</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3">คีย์ตัวแปร (Key)</th>
                      <th className="px-4 py-3">ป้ายกำกับ / คำอธิบาย</th>
                      <th className="px-4 py-3 w-40">ค่าใน SQLite</th>
                      <th className="px-4 py-3">หน่วย</th>
                      <th className="px-4 py-3 text-right">การจัดการ</th>
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
                            อัปเดต
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
                  กฎการคำนวณคะแนนและผลแนะนำ (ตาราง `scoring_rules`)
                </h3>
                <p className="text-xs text-slate-500">
                  กฎประเมินความพร้อมของทีม, ปริมาณผู้ใช้งาน และเงื่อนไขราคา
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3">ลำดับ (ID)</th>
                      <th className="px-4 py-3">ชื่อกฎ (Rule Name)</th>
                      <th className="px-4 py-3">เงื่อนไข (Condition)</th>
                      <th className="px-4 py-3">เครื่องมือเป้าหมาย</th>
                      <th className="px-4 py-3">คะแนนที่เพิ่ม</th>
                      <th className="px-4 py-3">คำอธิบายเหตุผล</th>
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
                  เครื่องมือที่ลงทะเบียนในระบบ (ตาราง `tools`)
                </h3>
                <p className="text-xs text-slate-500">
                  เครื่องมือทั้งหมดที่นำมาเปรียบเทียบในระบบประเมินคะแนน
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {toolsList.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{t.name}</span>
                      {t.mode_name ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white border border-slate-200">
                          {t.mode_name}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-slate-600">{t.description}</p>
                    <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200 space-y-1">
                      <div><strong className="text-slate-700">ป้ายสถานะ (Badge):</strong> {t.badge}</div>
                      <div><strong className="text-slate-700">ระดับความซับซ้อน (Complexity):</strong> {t.workflow_complexity}</div>
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
                  <span>รันคำสั่ง SQL บน SQLite WASM ในเบราว์เซอร์</span>
                </h3>
                <p className="text-xs text-slate-500">
                  ทดลองรันคำสั่ง เช่น <code className="bg-slate-100 px-1 py-0.5 rounded">SELECT * FROM config_variables;</code> หรือ <code className="bg-slate-100 px-1 py-0.5 rounded">UPDATE config_variables SET value = 36 WHERE key = 'usd_thb_rate';</code>
                </p>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  className="w-full p-3 font-mono text-xs rounded-lg border border-slate-300 bg-slate-900 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                  placeholder="พิมพ์คำสั่ง SQL ที่นี่..."
                />

                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    ตารางในระบบ: <span className="font-mono text-slate-700 font-semibold">config_variables, tools, scoring_rules, evaluation_logs</span>
                  </div>
                  <button
                    onClick={handleRunSql}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
                  >
                    <Terminal className="w-3.5 h-3.5 text-indigo-300" />
                    <span>รันคำสั่ง SQL</span>
                  </button>
                </div>
              </div>

              {sqlError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
                  <strong>ข้อผิดพลาด SQL:</strong> {sqlError}
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
                  ประมวลผลคำสั่งสำเร็จแล้ว (ส่งกลับ 0 แถว หรือดำเนินการคำสั่ง DDL/DML เรียบร้อย)
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Close */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            พื้นที่จัดเก็บถาวร: <span className="font-mono text-slate-700">localStorage.antigravity_sqlite_db_v1</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
          >
            เสร็จสิ้น
          </button>
        </div>
      </div>
    </div>
  );
}
