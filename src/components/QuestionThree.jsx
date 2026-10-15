import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, FileText, Image as ImageIcon, Users, MessageSquare, Sparkles, Calculator, Check, Info, Layers, BookOpen } from 'lucide-react';

export default function QuestionThree({
  athenaInputs,
  onChange,
  onApplyExample,
  onBack,
  onComplete,
  onSkipToSummary,
  variables = {},
  evaluation
}) {
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'example'

  // Dynamic rates from database
  const costDlPage = Number(variables.COST_OF_1_DL_PAGE ?? 1.0);
  const costDmPage = Number(variables.COST_OF_1_DM_PAGE ?? 1.4);
  const costDhPage = Number(variables.COST_OF_1_DH_PAGE ?? 1.4);
  const costImage = Number(variables.COST_OF_1_IMAGE ?? 1.4);
  const costOther = Number(athenaInputs.COST_OF_1_OTHER ?? variables.COST_OF_1_OTHER ?? 1.4);
  const costEvalQ = Number(variables.COST_OF_1_EVAL_QUESTION ?? 1.0);
  const costProdQ = Number(variables.COST_OF_PROD_QUESTION ?? 1.0);
  const costCloudFixedPerMonth = Number(variables.COST_OF_CLOUD_FIXED_COST_PER_MONTH ?? 12000.0);
  const costAgentDoctorPerManday = Number(variables.COST_OF_AGENT_DOCTOR_PER_MANDAY ?? 16000.0);

  // Field values with defaults
  const DL = athenaInputs.DL ?? '';
  const DL_AVG_PAGES = athenaInputs.DL_AVG_PAGES ?? '';
  const DM = athenaInputs.DM ?? '';
  const DM_AVG_PAGES = athenaInputs.DM_AVG_PAGES ?? '';
  const DH = athenaInputs.DH ?? '';
  const DH_AVG_PAGES = athenaInputs.DH_AVG_PAGES ?? '';
  const IMG_COUNT = athenaInputs.IMG_COUNT ?? '';
  const NOD = athenaInputs.NOD ?? '';
  const AD = athenaInputs.AD ?? '';
  const EVAL_Q = athenaInputs.EVAL_Q ?? '';
  const EVAL_ATTEMPTS = athenaInputs.EVAL_ATTEMPTS ?? '';
  const DEV_POC_MONTHS = athenaInputs.DEV_POC_MONTHS !== undefined && athenaInputs.DEV_POC_MONTHS !== '' ? athenaInputs.DEV_POC_MONTHS : 2;
  const AGENT_DOCTOR_MANDAYS = athenaInputs.AGENT_DOCTOR_MANDAYS ?? '';
  const U = athenaInputs.U ?? '';
  const Q_PER_DAY = athenaInputs.Q_PER_DAY ?? '';
  const PROD_MONTHS = athenaInputs.PROD_MONTHS !== undefined && athenaInputs.PROD_MONTHS !== '' ? athenaInputs.PROD_MONTHS : 10;

  const [autoReducedNotice, setAutoReducedNotice] = useState(false);
  const totalMonths = (Number(DEV_POC_MONTHS) || 0) + (Number(PROD_MONTHS) || 0);
  const isMonthsExceeded = totalMonths > 12;

  const {
    athenaTotalCostThb = 0,
    athenaDevPocTotal = 0,
    athenaPilotProdTotal = 0,
    athenaBreakdown = {}
  } = evaluation;

  // Handle input update with validation: PROD_MONTHS + DEV_POC_MONTHS <= 12
  const handleFieldChange = (field, value) => {
    if (field === 'DEV_POC_MONTHS') {
      const parsedVal = value === '' ? '' : Math.max(0, parseFloat(value) || 0);
      const numericDevPoc = parsedVal === '' ? 0 : Math.min(12, parsedVal);
      const currentProd = athenaInputs.PROD_MONTHS !== undefined && athenaInputs.PROD_MONTHS !== ''
        ? parseFloat(athenaInputs.PROD_MONTHS) || 0
        : 10;

      let newProd = currentProd;
      let wasReduced = false;
      if (numericDevPoc + currentProd > 12) {
        newProd = Math.max(0, 12 - numericDevPoc);
        wasReduced = true;
      }
      if (wasReduced) {
        setAutoReducedNotice(true);
        setTimeout(() => setAutoReducedNotice(false), 4000);
      }

      onChange({
        ...athenaInputs,
        DEV_POC_MONTHS: parsedVal === '' ? '' : numericDevPoc,
        PROD_MONTHS: newProd
      });
      return;
    }

    if (field === 'PROD_MONTHS') {
      const parsedVal = value === '' ? '' : Math.max(0, parseFloat(value) || 0);
      const currentDevPoc = athenaInputs.DEV_POC_MONTHS !== undefined && athenaInputs.DEV_POC_MONTHS !== ''
        ? parseFloat(athenaInputs.DEV_POC_MONTHS) || 0
        : 2;

      let finalProd = parsedVal;
      let wasReduced = false;
      if (parsedVal !== '') {
        const maxAllowedProd = Math.max(0, 12 - currentDevPoc);
        if (parsedVal > maxAllowedProd) {
          finalProd = maxAllowedProd;
          wasReduced = true;
        }
      }
      if (wasReduced) {
        setAutoReducedNotice(true);
        setTimeout(() => setAutoReducedNotice(false), 4000);
      }

      onChange({
        ...athenaInputs,
        PROD_MONTHS: finalProd
      });
      return;
    }

    onChange({
      ...athenaInputs,
      [field]: value === '' ? '' : Math.max(0, parseFloat(value) || 0)
    });
  };

  const handleLoadExample = () => {
    onApplyExample();
    setActiveTab('form');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-white p-6 sm:p-8 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                4
              </span>
              <span>คำถามที่ 4 • สถาปัตยกรรมระบบภายใน (Internal System Architecture)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              การประเมินต้นทุน: Athena
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
              จำลองต้นทุนการประมวลผลเอกสารนำเข้า (Ingestion), การประเมินผลสำหรับนักพัฒนา (Evaluation) และค่าใช้จ่ายในการดำเนินงานช่วง Pilot และ Production สำหรับระบบภายใน Athena
            </p>
          </div>

          {/* Tab Button to view Example vs Form */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-center border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'form'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              แบบฟอร์มคำนวณ (Interactive Form)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('example')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'example'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>ตัวอย่างการคำนวณต้นทุน (Example)</span>
            </button>
          </div>
        </div>

        {/* Model Assumption Banner */}
        <div className="mt-5 p-3.5 bg-emerald-100/70 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              ✦
            </div>
            <div>
              <span className="font-extrabold text-emerald-900">สมมติฐานของโมเดล: </span>
              <span>การคำนวณทั้งหมดอ้างอิงตามโมเดล <strong>Gemini 3.1 Flash Lite</strong> (การประมวลผลโทเค็นรวดเร็ว, การสืบค้น Multimodal ความหน่วงต่ำ)</span>
            </div>
          </div>
          <span className="hidden md:inline-flex text-[11px] font-bold bg-white/80 px-2 py-0.5 rounded text-emerald-800 border border-emerald-200">
            Gemini 3.1 Flash Lite
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* ================= TAB 1: INTERACTIVE FORM ================= */}
        {activeTab === 'form' && (
          <div className="space-y-8">
            {/* Quick preset trigger */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">
                ต้องการกรอกค่าเริ่มต้นตามข้อมูลอ้างอิงมาตรฐานหรือไม่?
              </span>
              <button
                type="button"
                onClick={handleLoadExample}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 shadow-2xs transition"
              >
                โหลดชุดข้อมูลตัวอย่างอ้างอิง
              </button>
            </div>

            {/* SECTION 1: DEV & POC */}
            <div className="space-y-6 border border-slate-200 rounded-2xl p-5 sm:p-6 bg-slate-50/40">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <h3 className="text-base font-bold text-slate-900">
                    ส่วนที่ 1: Dev & PoC
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium bg-white px-2.5 py-0.5 rounded border border-slate-200">
                  การนำเข้าเอกสารและการประเมินผล (Ingestion & Evaluation)
                </span>
              </div>

              {/* Section 1.1: Documents */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  ส่วนที่ 1.1: เอกสาร (Documents)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* DL */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800">
                        จำนวนเอกสาร (docx, txt, md)
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        DL
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={DL}
                      onChange={(e) => handleFieldChange('DL', e.target.value)}
                      placeholder="เช่น 1000"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                    <div className="text-[11px] text-slate-400">อัตราต่อหน่วย: ฿{costDlPage} / หน้า</div>
                  </div>

                  {/* DL_AVG_PAGES */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800">
                        จำนวนหน้าเฉลี่ยต่อเอกสาร (docx, txt, md)
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        DL_AVG_PAGES
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={DL_AVG_PAGES}
                      onChange={(e) => handleFieldChange('DL_AVG_PAGES', e.target.value)}
                      placeholder="เช่น 10"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                    <div className="text-[11px] text-slate-400">จำนวนหน้าเฉลี่ยต่อไฟล์</div>
                  </div>

                  {/* DM */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800">
                        จำนวนเอกสาร (pdf, pptx ที่ไม่มีภาพ)
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                        DM
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={DM}
                      onChange={(e) => handleFieldChange('DM', e.target.value)}
                      placeholder="เช่น 100"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                    <div className="text-[11px] text-slate-400">อัตราต่อหน่วย: ฿{costDmPage} / หน้า</div>
                  </div>

                  {/* DM_AVG_PAGES */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800">
                        จำนวนหน้าเฉลี่ยต่อเอกสาร (pdf, pptx ที่ไม่มีภาพ)
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                        DM_AVG_PAGES
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={DM_AVG_PAGES}
                      onChange={(e) => handleFieldChange('DM_AVG_PAGES', e.target.value)}
                      placeholder="เช่น 10"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                    <div className="text-[11px] text-slate-400">จำนวนหน้าเฉลี่ยสำหรับไฟล์ PDF/PPT ข้อความล้วน</div>
                  </div>

                  {/* DH */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800">
                        จำนวนเอกสาร (pdf, pptx ที่มีภาพประกอบ)
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        DH
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={DH}
                      onChange={(e) => handleFieldChange('DH', e.target.value)}
                      placeholder="เช่น 10"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                    <div className="text-[11px] text-slate-400">อัตราต่อหน่วย: ฿{costDhPage} / หน้า</div>
                  </div>

                  {/* DH_AVG_PAGES */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800">
                        จำนวนหน้าเฉลี่ยต่อเอกสาร (pdf, pptx ที่มีภาพประกอบ)
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        DH_AVG_PAGES
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={DH_AVG_PAGES}
                      onChange={(e) => handleFieldChange('DH_AVG_PAGES', e.target.value)}
                      placeholder="เช่น 5"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                    <div className="text-[11px] text-slate-400">จำนวนหน้าเฉลี่ยสำหรับไฟล์ที่มีภาพประกอบจำนวนมาก</div>
                  </div>

                  {/* IMG_COUNT (Always appears, conditional on DH > 0) */}
                  <div className={`p-4 rounded-xl border shadow-2xs space-y-1.5 transition-all ${
                    DH > 0 ? 'bg-amber-50/50 border-amber-300' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                        <span>รวมจำนวนภาพประกอบภายในเอกสาร (pptx, รูปภาพ) รวมกันทุกไฟล์</span>
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        IMG_COUNT
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={IMG_COUNT}
                      onChange={(e) => handleFieldChange('IMG_COUNT', e.target.value)}
                      placeholder="เช่น 10"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold bg-white"
                    />
                    <div className="text-[11px] text-slate-500">
                      {DH > 0 ? `เปิดใช้งาน: DH > 0 (${DH} เอกสาร) อัตรา: ฿${costImage} / ภาพ` : 'หมายเหตุ: แสดงเมื่อระบุ DH > 0 สำหรับนับจำนวนรูปภาพ'}
                    </div>
                  </div>

                  {/* NOD */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800">
                        จำนวนเอกสารประเภทอื่นๆ (Other Documents)
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        NOD
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={NOD}
                      onChange={(e) => handleFieldChange('NOD', e.target.value)}
                      placeholder="เช่น 1"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                    <div className="text-[11px] text-slate-400">อัตราต่อหน่วย: ฿{costOther} / เอกสารอื่นๆ</div>
                  </div>
                </div>
              </div>

              {/* Section 1.2: Agent Developer */}
              <div className="space-y-4 pt-3 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  ส่วนที่ 1.2: นักพัฒนา Agent (Agent Developer)
                </h4>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5 max-w-md">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-800">
                      จำนวนนักพัฒนา Agent
                    </label>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      AD
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={AD}
                    onChange={(e) => handleFieldChange('AD', e.target.value)}
                    placeholder="เช่น 2"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                  />
                  <div className="text-[11px] text-slate-400">นักพัฒนาที่สร้างและดูแล Custom Athena Agents</div>
                </div>
              </div>

              {/* Section 1.3: Evaluation Questions */}
              <div className="space-y-4 pt-3 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  ส่วนที่ 1.3: จำนวนคำถามในการทดสอบและประเมินผล (Evaluation Questions)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* EVAL_Q */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800">
                        จำนวนคำถามประเมินผลที่ใช้ทดสอบ
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        EVAL_Q
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={EVAL_Q}
                      onChange={(e) => handleFieldChange('EVAL_Q', e.target.value)}
                      placeholder="เช่น 300"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                    <div className="text-[11px] text-slate-400">ขนาดชุดคำถามทดสอบมาตรฐาน (Benchmark Question Set)</div>
                  </div>

                  {/* EVAL_ATTEMPTS */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800">
                        จำนวนรอบที่ทำการทดสอบประเมินผล (Evaluation Attempts)
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        EVAL_ATTEMPTS
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={EVAL_ATTEMPTS}
                      onChange={(e) => handleFieldChange('EVAL_ATTEMPTS', e.target.value)}
                      placeholder="เช่น 10"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                    <div className="text-[11px] text-slate-400">จำนวนรอบการทดสอบ / ปรับแต่งทั้งหมด (อัตรา: ฿{costEvalQ} / คำถาม)</div>
                  </div>
                </div>
              </div>

              {/* Section 1.4: Duration of Dev & PoC */}
              <div className="space-y-4 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    ส่วนที่ 1.4: ระยะเวลาช่วง Dev & PoC (Duration of Dev & PoC)
                  </h4>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                    แนะนำ 2 เดือน (Hint: 2 months)
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5 max-w-md">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-800">
                      ระยะเวลาในช่วง Dev & PoC (เดือน)
                    </label>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      DEV_POC_MONTHS
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={DEV_POC_MONTHS}
                    onChange={(e) => handleFieldChange('DEV_POC_MONTHS', e.target.value)}
                    placeholder="เช่น 2 (แนะนำ 2 เดือน)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                  />
                  <div className="text-[11px] text-slate-400">
                    อัตราต้นทุนคงที่สำหรับ Cloud Compute: ฿{costCloudFixedPerMonth.toLocaleString()} บาท / เดือน
                  </div>
                </div>
              </div>

              {/* Section 1.5: Agent Doctor Help */}
              <div className="space-y-4 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    ส่วนที่ 1.5: [Optional] Do you need Agent Doctor help on implementation?
                  </h4>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                    แนะนำ 0 mandays (Hint: 0 mandays)
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5 max-w-md">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-800">
                      จำนวนวันทำงานของ Agent Doctor รวม (Agent doctors mandays (total))
                    </label>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      AGENT_DOCTOR_MANDAYS
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={AGENT_DOCTOR_MANDAYS}
                    onChange={(e) => handleFieldChange('AGENT_DOCTOR_MANDAYS', e.target.value)}
                    placeholder="เช่น 0 (แนะนำ 0 mandays)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                  />
                  <div className="text-[11px] text-slate-400">
                    หน่วย: mandays • อัตราค่าบริการ: ฿{costAgentDoctorPerManday.toLocaleString()} บาท / manday (กำหนดได้ใน DB)
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: PILOT & PRODUCTION */}
            <div className="space-y-6 border border-slate-200 rounded-2xl p-5 sm:p-6 bg-slate-50/40">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                  <h3 className="text-base font-bold text-slate-900">
                    ส่วนที่ 2: ช่วงนำร่องและใช้งานจริง (Pilot & Production)
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium bg-white px-2.5 py-0.5 rounded border border-slate-200">
                  อัตราต้นทุนการดำเนินงานต่อเนื่อง (Operational Run-Rate)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* U */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-800">
                      จำนวนผู้ใช้งานแชท (Chat Users)
                    </label>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                      U
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={U}
                    onChange={(e) => handleFieldChange('U', e.target.value)}
                    placeholder="เช่น 400"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                  />
                  <div className="text-[11px] text-slate-400">จำนวนผู้ใช้งานแชทจริงทั้งหมด</div>
                </div>

                {/* Q_PER_DAY */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-800">
                      จำนวนคำถามต่อคนต่อวัน
                    </label>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                      Q_PER_DAY
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={Q_PER_DAY}
                    onChange={(e) => handleFieldChange('Q_PER_DAY', e.target.value)}
                    placeholder="เช่น 2"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                  />
                  <div className="text-[11px] text-slate-400">จำนวนคำถามเฉลี่ยต่อผู้ใช้ต่อวัน</div>
                </div>

                {/* PROD_MONTHS */}
                <div className={`p-4 rounded-xl border shadow-2xs space-y-1.5 transition-all ${
                  isMonthsExceeded ? 'bg-amber-50/70 border-amber-300' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-800">
                      ระยะเวลาในการทดสอบ Pilot และ Production (เดือน)
                    </label>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                      PROD_MONTHS
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={Math.max(0, 12 - (Number(DEV_POC_MONTHS) || 0))}
                    value={PROD_MONTHS}
                    onChange={(e) => handleFieldChange('PROD_MONTHS', e.target.value)}
                    placeholder="เช่น 10 (ค่าเริ่มต้น)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold bg-white"
                  />
                  <div className="text-[11px] text-slate-500">
                    ค่าเริ่มต้น 10 เดือน (PROD_MONTHS + DEV_POC_MONTHS ต้องไม่เกิน 12 เดือน)
                  </div>
                </div>
              </div>

              {/* Auto-reduced notification */}
              {autoReducedNotice && (
                <div className="p-3 bg-teal-50 border border-teal-300 rounded-xl text-xs text-teal-900 flex items-start gap-2.5 shadow-2xs animate-fadeIn">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-teal-950">ระบบปรับลดค่าให้อัตโนมัติ: </span>
                    <span>
                      เนื่องจากระยะเวลารวมต้องไม่เกิน 12 เดือน ระบบจึงปรับลดระยะเวลาช่วง Pilot & Production (PROD_MONTHS) เหลือ <strong>{PROD_MONTHS} เดือน</strong> เพื่อให้รวมกับ Dev & PoC ({DEV_POC_MONTHS} เดือน) เท่ากับ <strong>{totalMonths} เดือน</strong> (กรอบ 1 ปี)
                    </span>
                  </div>
                </div>
              )}

              {/* Duration Summary Pill */}
              <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>เกณฑ์ระยะเวลารวม: Dev & PoC ({DEV_POC_MONTHS} เดือน) + Pilot & Production ({PROD_MONTHS} เดือน)</span>
                </span>
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
                  รวม {totalMonths} เดือน / สูงสุด 12 เดือน
                </span>
              </div>
            </div>

            {/* LIVE CALCULATION SUMMARY CARD */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white rounded-2xl border-2 border-emerald-300 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  สรุปต้นทุน Athena (Gemini 3.1 Flash Lite)
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                  ไม่มีต้นทุนค่าที่นั่งรายคนของ Microsoft (Zero Seat Tax)
                </span>
              </div>

              {/* Formula & Breakdown grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-white/90 p-4 rounded-xl border border-emerald-200">
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-700 font-sans uppercase tracking-wider text-[11px]">
                    1. ยอดรวม Dev & PoC:
                  </div>
                  <div className="text-slate-600">
                    DL ({DL || 0}×{DL_AVG_PAGES || 0}×฿{costDlPage}) = ฿{(athenaBreakdown.costDlTotal || 0).toLocaleString()}
                  </div>
                  <div className="text-slate-600">
                    DM ({DM || 0}×{DM_AVG_PAGES || 0}×฿{costDmPage}) = ฿{(athenaBreakdown.costDmTotal || 0).toLocaleString()}
                  </div>
                  <div className="text-slate-600">
                    DH ({DH || 0}×{DH_AVG_PAGES || 0}×฿{costDhPage}) = ฿{(athenaBreakdown.costDhTotal || 0).toLocaleString()}
                  </div>
                  <div className="text-slate-600">
                    รูปภาพ ({IMG_COUNT || 0}×฿{costImage}) = ฿{(athenaBreakdown.costImgTotal || 0).toLocaleString()}
                  </div>
                  <div className="text-slate-600">
                    เอกสารอื่นๆ ({NOD || 0}×฿{costOther}) = ฿{(athenaBreakdown.costNodTotal || 0).toLocaleString()}
                  </div>
                  <div className="text-slate-600">
                    การประเมินผล ({EVAL_Q || 0}×{EVAL_ATTEMPTS || 0}×฿{costEvalQ}) = ฿{(athenaBreakdown.evalCostTotal || 0).toLocaleString()}
                  </div>
                  <div className="text-slate-600">
                    Cloud Compute คงที่ ({DEV_POC_MONTHS || 0} เดือน × ฿{costCloudFixedPerMonth.toLocaleString()}) = ฿{(athenaBreakdown.costCloudFixedDevPoc ?? (Number(DEV_POC_MONTHS || 0) * costCloudFixedPerMonth)).toLocaleString()}
                  </div>
                  <div className="text-slate-600">
                    Agent Doctor ({AGENT_DOCTOR_MANDAYS || 0} mandays × ฿{costAgentDoctorPerManday.toLocaleString()}) = ฿{(athenaBreakdown.costAgentDoctorTotal || 0).toLocaleString()}
                  </div>
                  <div className="font-bold text-emerald-800 pt-1 border-t border-slate-100">
                    รวม Dev & PoC = ฿{(athenaDevPocTotal || 0).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold text-slate-700 font-sans uppercase tracking-wider text-[11px]">
                    2. ยอดรวม Pilot & Production:
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    สูตรคำถาม: U × Q_PER_DAY × 30 วัน × PROD_MONTHS × ฿{costProdQ}
                  </div>
                  <div className="text-slate-700">
                    • คำถาม Production: {U || 0} ผู้ใช้ × {Q_PER_DAY || 0} คำถาม/วัน × 30 × {PROD_MONTHS || 0} เดือน × ฿{costProdQ} = ฿{(athenaBreakdown.costProdUsageTotal || 0).toLocaleString()}
                  </div>
                  <div className="text-slate-700">
                    • Cloud Compute คงที่: {PROD_MONTHS || 0} เดือน × ฿{costCloudFixedPerMonth.toLocaleString()} = ฿{(athenaBreakdown.costCloudFixedProd ?? (Number(PROD_MONTHS || 0) * costCloudFixedPerMonth)).toLocaleString()}
                  </div>
                  <div className="font-bold text-teal-800 pt-1 border-t border-slate-100">
                    รวม Pilot & Production = ฿{(athenaPilotProdTotal || 0).toLocaleString()}
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 font-sans">
                    นักพัฒนา Agent (AD): <strong>{AD || 0} คน</strong>
                  </div>
                </div>
              </div>

              {/* Total Athena Cost Display */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pt-3 border-t border-emerald-200">
                <span className="text-sm font-bold text-slate-800">
                  รวมต้นทุนประเมินของ Athena ทั้งหมด:
                </span>
                <div className="text-right">
                  <div className="text-3xl font-black text-slate-900 tracking-tight">
                    ฿{athenaTotalCostThb.toLocaleString()}
                    <span className="text-sm font-normal text-slate-600 ml-1.5">บาท (THB)</span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                    ครอบคลุมทั้งการประมวลผลดัชนีเอกสาร Dev/PoC ({DEV_POC_MONTHS || 2} เดือน) และการสอบถามข้อมูล Production ต่อเนื่อง {PROD_MONTHS || 10} เดือน (รวม {totalMonths} เดือน)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: COST CALCULATION EXAMPLE ================= */}
        {activeTab === 'example' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-300 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-base font-bold text-emerald-950">
                    ตัวอย่างการคำนวณต้นทุนแบบละเอียด (Worked Cost Calculation Example)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleLoadExample}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>โหลดพารามิเตอร์เหล่านี้ลงในแบบฟอร์ม</span>
                </button>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                นี่คือตัวอย่างโมเดลต้นทุนอ้างอิงตามราคา <strong>Gemini 3.1 Flash Lite</strong> สำหรับการทำดัชนีเอกสาร การประเมินผลอัตโนมัติ และการรันคำถามในระบบจริง 12 เดือน
              </p>
            </div>

            {/* Example Parameter Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dev & PoC Parameter Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-slate-700 border-b border-slate-200 uppercase tracking-wider">
                  พารามิเตอร์ช่วง Dev & PoC
                </div>
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">DL</td>
                      <td className="px-4 py-2 text-slate-600">1,000 เอกสาร (docx, txt, md)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">DL_AVG_PAGES</td>
                      <td className="px-4 py-2 text-slate-600">10 หน้า / เอกสาร</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">COST_OF_1_DL_PAGE</td>
                      <td className="px-4 py-2 text-slate-600">1 THB / หน้า</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">DM</td>
                      <td className="px-4 py-2 text-slate-600">100 เอกสาร (pdf, pptx ไม่มีภาพ)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">DM_AVG_PAGES</td>
                      <td className="px-4 py-2 text-slate-600">10 หน้า / เอกสาร</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">COST_OF_1_DM_PAGE</td>
                      <td className="px-4 py-2 text-slate-600">1.4 THB / หน้า</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">DH</td>
                      <td className="px-4 py-2 text-slate-600">10 เอกสาร (pdf, pptx มีภาพ)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">DH_AVG_PAGES</td>
                      <td className="px-4 py-2 text-slate-600">5 หน้า / เอกสาร</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">COST_OF_1_DH_PAGE</td>
                      <td className="px-4 py-2 text-slate-600">1.4 THB / หน้า</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">IMG_COUNT</td>
                      <td className="px-4 py-2 text-slate-600">10 รูปภาพ (รวมกันทุกไฟล์)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">COST_OF_1_IMAGE</td>
                      <td className="px-4 py-2 text-slate-600">1.4 THB / รูปภาพ</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">NOD</td>
                      <td className="px-4 py-2 text-slate-600">1 เอกสารอื่นๆ</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">COST_OF_1_OTHER</td>
                      <td className="px-4 py-2 text-slate-600">1.1 THB / เอกสาร</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">EVAL_Q</td>
                      <td className="px-4 py-2 text-slate-600">300 คำถาม</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">EVAL_ATTEMPTS</td>
                      <td className="px-4 py-2 text-slate-600">10 รอบ</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">COST_OF_1_EVAL_QUESTION</td>
                      <td className="px-4 py-2 text-slate-600">1 THB / คำถาม</td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-emerald-50/40">
                      <td className="px-4 py-2 font-bold text-slate-800">DEV_POC_MONTHS</td>
                      <td className="px-4 py-2 text-slate-600">2 เดือน (ระยะเวลาช่วง Dev & PoC)</td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-emerald-50/40">
                      <td className="px-4 py-2 font-bold text-slate-800">COST_OF_CLOUD_FIXED_COST_PER_MONTH</td>
                      <td className="px-4 py-2 text-slate-600">12,000 THB / เดือน (ค่า Cloud Compute คงที่ช่วง Dev & PoC)</td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-emerald-50/40">
                      <td className="px-4 py-2 font-bold text-slate-800">AGENT_DOCTOR_MANDAYS</td>
                      <td className="px-4 py-2 text-slate-600">0 mandays (ความช่วยเหลือจาก Agent Doctor)</td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-emerald-50/40">
                      <td className="px-4 py-2 font-bold text-slate-800">COST_OF_AGENT_DOCTOR_PER_MANDAY</td>
                      <td className="px-4 py-2 text-slate-600">16,000 THB / manday (กำหนดได้ใน DB)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pilot & Production Parameters & Math Steps */}
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-slate-700 border-b border-slate-200 uppercase tracking-wider">
                    พารามิเตอร์ช่วง Pilot & Production
                  </div>
                  <table className="w-full text-left text-xs">
                    <tbody className="divide-y divide-slate-100 font-mono">
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-bold text-slate-800">U</td>
                        <td className="px-4 py-2 text-slate-600">400 ผู้ใช้งานแชท</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-bold text-slate-800">Q_PER_DAY</td>
                        <td className="px-4 py-2 text-slate-600">2 คำถาม / ผู้ใช้ / วัน</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-bold text-slate-800">PROD_MONTHS</td>
                        <td className="px-4 py-2 text-slate-600">10 เดือน (ค่าเริ่มต้นเพื่อให้รวมกับ Dev & PoC 2 เดือน ไม่เกิน 12 เดือน)</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-bold text-slate-800">COST_OF_PROD_QUESTION</td>
                        <td className="px-4 py-2 text-slate-600">1 THB / คำถาม</td>
                      </tr>
                      <tr className="hover:bg-slate-50 bg-teal-50/40">
                        <td className="px-4 py-2 font-bold text-slate-800">COST_OF_CLOUD_FIXED_COST_PER_MONTH</td>
                        <td className="px-4 py-2 text-slate-600">12,000 THB / เดือน (ค่า Cloud Compute คงที่ช่วง Pilot & Production)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Step-by-Step Math Breakdown */}
                <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs space-y-2 shadow-inner">
                  <div className="text-white font-bold pb-1 border-b border-slate-800">
                    ขั้นตอนการคำนวณทีละขั้น:
                  </div>
                  <div>• ค่าใช้จ่าย DL: 1,000 × 10 × 1 = <strong>฿10,000</strong></div>
                  <div>• ค่าใช้จ่าย DM: 100 × 10 × 1.4 = <strong>฿1,400</strong></div>
                  <div>• ค่าใช้จ่าย DH: 10 × 5 × 1.4 = <strong>฿70</strong></div>
                  <div>• ค่าใช้จ่ายรูปภาพ: 10 × 1.4 = <strong>฿14</strong></div>
                  <div>• ค่าใช้จ่ายอื่นๆ: 1 × 1.1 = <strong>฿1.10</strong></div>
                  <div>• การประเมินผล: 300 × 10 × 1 = <strong>฿3,000</strong></div>
                  <div>• ค่า Cloud Compute คงที่ (Dev & PoC): 2 × 12,000 = <strong>฿24,000</strong></div>
                  <div>• ค่าช่วยเหลือ Agent Doctor: 0 × 16,000 = <strong>฿0</strong></div>
                  <div className="text-white pt-1">
                    ➤ ยอดรวมช่วง Dev & PoC = 10,000 + 1,400 + 70 + 14 + 1.1 + 3,000 + 24,000 + 0 = <span className="text-emerald-300 font-bold">฿38,485.10</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-teal-300 space-y-1">
                    <div>• ค่าคำถาม Production: 400 × 2 × 30 × 10 × 1 = <strong>฿240,000</strong></div>
                    <div>• ค่า Cloud Compute คงที่ (Pilot & Prod): 10 × 12,000 = <strong>฿120,000</strong></div>
                    <div>➤ ยอดรวมช่วง Pilot & Production = 240,000 + 120,000 = <span className="text-teal-200 font-bold">฿360,000.00</span></div>
                  </div>
                  <div className="pt-2 border-t border-slate-700 text-white font-bold text-sm">
                    ★ รวมต้นทุน Athena ทั้งหมด = ฿38,485.10 + ฿360,000 = <span className="text-emerald-400 text-base">฿398,485.10 THB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ย้อนกลับไปคำถามที่ 3 (Microsoft)</span>
          </button>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
            {onSkipToSummary && (
              <button
                type="button"
                onClick={onSkipToSummary}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition"
                title="ข้ามไปยังสรุปผลคำแนะนำ 3 ทางเลือกสุดท้าย"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>ข้ามไปยังผลสรุปคำแนะนำสุดท้าย</span>
              </button>
            )}
            <button
              type="button"
              onClick={onComplete}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
            >
              <span>ต่อไปยังคำถามที่ 5 (เชื่อมต่อระบบ KBank อื่น)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
