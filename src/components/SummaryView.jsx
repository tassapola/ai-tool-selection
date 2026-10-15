import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Bot, Workflow, Cpu, Printer, Sparkles, Check, X, Sliders, FileDown, Stamp, AlertTriangle } from 'lucide-react';
import { exportAssessmentToDocx } from '../utils/docxExport';

export default function SummaryView({
  evaluation,
  q1AgenticWorkflow,
  hUsers,
  uUsers,
  athenaInputs = {},
  q4ConnectNonM365,
  q5O365KnowledgeToSharepoint,
  q6UamGovernance,
  q7LocalKbtgLlm,
  // backwards compatibility
  q5UamGovernance,
  q6LocalKbtgLlm,
  tools = [],
  variables = {},
  onBackToQ1,
  onBackToQ2,
  onBackToQ3,
  onBackToQ4,
  onBackToQ5,
  onBackToQ6,
  onBackToQ7,
  onOpenDatabase
}) {
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const effectiveQ6Uam = q6UamGovernance !== undefined && q6UamGovernance !== null ? q6UamGovernance : q5UamGovernance;
  const effectiveQ7Llm = q7LocalKbtgLlm !== undefined && q7LocalKbtgLlm !== null ? q7LocalKbtgLlm : q6LocalKbtgLlm;

  const {
    scores = {},
    recommendedToolId,
    recommendedTool,
    m365AnnualCostThb = 0,
    annualCostThb = 0,
    additionalLicensesNeeded = 0,
    athenaTotalCostThb = 0,
    athenaDevPocTotal = 0,
    athenaPilotProdTotal = 0,
    athenaBreakdown = {},
    weightCost = 60,
    weightFeatures = 40,
    isCostThresholdOverride = false,
    costDiffM365VsAthena = 0,
    costThresholdToPickAthena = 350000,
    H = 0,
    U = 0,
    reasoning = []
  } = evaluation;

  const handleExportDocx = async () => {
    setIsExportingDocx(true);
    try {
      await exportAssessmentToDocx({
        evaluation,
        q1AgenticWorkflow,
        hUsers,
        uUsers,
        athenaInputs,
        q4ConnectNonM365,
        q5O365KnowledgeToSharepoint,
        q6UamGovernance: effectiveQ6Uam,
        q7LocalKbtgLlm: effectiveQ7Llm,
        variables,
        tools
      });
    } catch (err) {
      console.error('Error exporting DOCX report:', err);
      alert('Failed to generate .docx report: ' + err.message);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const getToolIcon = (id) => {
    switch (id) {
      case 'm365_copilot':
        return <Bot className="w-6 h-6 text-blue-600" />;
      case 'copilot_studio':
        return <Workflow className="w-6 h-6 text-purple-600" />;
      case 'athena':
        return <Cpu className="w-6 h-6 text-emerald-600" />;
      case 'no_recommendation':
        return <AlertTriangle className="w-6 h-6 text-rose-600" />;
      default:
        return <Sparkles className="w-6 h-6 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Prominent Non-Final Advisory Disclaimer Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-300 text-amber-950 shadow-xs space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>ข้อสังเกตและคำแนะนำสำคัญ • ข้อเสนอแนะเบื้องต้น (ยังไม่ใช่ผลสรุปสุดท้าย)</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
          คำแนะนำนี้เป็นข้อเสนอแนะเพื่อสนับสนุนการตัดสินใจอัตโนมัติ โดยอิงตามเกณฑ์ทางเทคนิคและสูตรประเมินต้นทุน <strong>ไม่ใช่ผลสรุปสุดท้าย</strong> ผู้ใช้งานและผู้มีส่วนได้ส่วนเสียจำเป็นต้องประเมิน <strong>ระยะเวลาในการส่งมอบสู่ตลาด (Time-to-Market)</strong>, <strong>ความพร้อมของบุคลากรและทักษะ (People & Skills Readiness)</strong>, <strong>ความสามารถในการดูแลระบบต่อเนื่อง (Operational Maintenance Capacity)</strong> ตลอดจน <strong>กระบวนการกำกับดูแลและการปฏิบัติตามกฎเกณฑ์ที่เกี่ยวข้องของ KBank</strong> ควบคู่ไปกับคำแนะนำนี้
        </p>
      </div>

      {/* Top Banner: Primary Recommended Tool */}
      {recommendedTool && (
        <div className={`rounded-2xl border-2 p-6 sm:p-8 shadow-sm transition-all ${
          recommendedToolId === 'm365_copilot'
            ? 'bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-white border-blue-300'
            : recommendedToolId === 'copilot_studio'
            ? 'bg-gradient-to-r from-purple-50/90 via-indigo-50/40 to-white border-purple-300'
            : recommendedToolId === 'athena'
            ? 'bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-white border-emerald-300'
            : 'bg-gradient-to-r from-rose-50/90 via-red-50/40 to-white border-rose-300'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded bg-white shadow-2xs border border-slate-200 text-slate-800">
                  {recommendedToolId === 'no_recommendation' ? 'สถานะการประเมิน (Assessment Status)' : 'ทางเลือกที่แนะนำ (Recommended Choice)'}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  recommendedToolId === 'no_recommendation' ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {recommendedToolId === 'no_recommendation' ? 'ไม่สามารถสรุปเครื่องมือได้' : `ความสอดคล้อง ${scores[recommendedToolId]}%`}
                </span>
                <span className="text-[11px] font-mono text-slate-500 bg-white/70 px-2 py-0.5 rounded border border-slate-200">
                  สัดส่วนน้ำหนัก: ต้นทุน {weightCost}% / คุณสมบัติ {weightFeatures}%
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-200">
                  {getToolIcon(recommendedToolId)}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {recommendedTool.name}
                  </h1>
                  <p className={`text-sm font-semibold ${recommendedToolId === 'no_recommendation' ? 'text-rose-600' : 'text-indigo-600'}`}>
                    {recommendedTool.mode_name} • {recommendedTool.badge}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 max-w-2xl mt-1">
                {recommendedTool.description}
              </p>
            </div>

            {/* Cost Snapshot Pill */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-right shrink-0 space-y-1">
              <div className="text-xs text-slate-500 font-medium">
                {recommendedToolId === 'no_recommendation' ? 'สถานะผลลัพธ์' : 'ประมาณการต้นทุนโซลูชัน'}
              </div>
              <div className="text-2xl font-black text-slate-900">
                {recommendedToolId === 'no_recommendation' ? (
                  <span className="text-rose-600 text-xl font-bold">ขัดแย้งเชิงสถาปัตยกรรม</span>
                ) : recommendedToolId === 'athena' ? (
                  <>
                    <span>฿{athenaTotalCostThb.toLocaleString()}</span>
                    <span className="text-xs font-normal text-slate-500 ml-1">บาท (THB)</span>
                  </>
                ) : (
                  <>
                    <span>{annualCostThb === 0 ? '฿0' : `฿${annualCostThb.toLocaleString()}`}</span>
                    <span className="text-xs font-normal text-slate-500 ml-1">บาท (THB)</span>
                  </>
                )}
              </div>
              <span className="text-[11px] font-bold text-indigo-600 block uppercase">
                {recommendedToolId === 'no_recommendation' ? 'ต้องทบทวนความต้องการ' : recommendedToolId === 'athena' ? 'Dev + Production (Gemini 3.1 Flash Lite)' : 'ค่าสิทธิ์ Microsoft / ปี'}
              </span>
            </div>
          </div>

          {/* Rationale Bullet Points */}
          <div className="mt-6 pt-5 border-t border-slate-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              {recommendedToolId === 'no_recommendation' ? 'รายละเอียดเหตุผลและความขัดแย้ง:' : 'เหตุผลที่เลือกเครื่องมือนี้:'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {reasoning.map((r, i) => {
                const isConflictItem = r.startsWith('⚠️') || r.startsWith('[จุดขัดแย้ง]');
                return (
                  <div key={i} className={`flex items-start space-x-2 text-xs sm:text-sm ${
                    isConflictItem ? 'text-rose-950 bg-rose-50/80 border-rose-200 font-medium' : 'text-slate-700 bg-white/70 border-slate-200/60'
                  } p-2.5 rounded-lg border`}>
                    {isConflictItem ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    <span>{r}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Architectural Conflict Warning & Resolution Box */}
      {recommendedToolId === 'no_recommendation' && evaluation.conflicts && evaluation.conflicts.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl bg-rose-50/90 border-2 border-rose-300 text-rose-950 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-base text-rose-900 pb-2 border-b border-rose-200">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>ตรวจพบความขัดแย้งในคำตอบ ({evaluation.conflicts.length} ประเด็น) • คำอธิบายเชิงสถาปัตยกรรม</span>
          </div>
          <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
            ระบบพบว่าคำตอบที่ท่านระบุมีข้อกำหนดที่ต้องการคุณสมบัติเฉพาะของโซลูชันคนละฝั่งพร้อมกัน ซึ่งในทางปฏิบัติไม่สามารถใช้เครื่องมือใดเครื่องมือหนึ่งเพื่อตอบสนองเงื่อนไขทั้งหมดได้โดยตรง จำเป็นต้องทบทวนข้อกำหนดหรือจัดการประชุมเชิงสถาปัตยกรรมร่วมกับทีม Enterprise Architecture:
          </p>
          <div className="space-y-3">
            {evaluation.conflicts.map((c, idx) => (
              <div key={idx} className="bg-white/95 p-4 rounded-xl border border-rose-200 shadow-2xs space-y-2">
                <div className="font-bold text-sm text-rose-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <span>{c.title}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-7">
                  {c.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-7 text-xs font-semibold">
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <span className="text-[10px] text-emerald-700 block font-normal uppercase">เงื่อนไขฝั่ง Athena:</span>
                    {c.questionA.includes('Athena') ? c.questionA : c.questionB}
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
                    <span className="text-[10px] text-blue-700 block font-normal uppercase">เงื่อนไขฝั่ง Microsoft:</span>
                    {c.questionA.includes('Microsoft') ? c.questionA : c.questionB}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white/90 rounded-xl border border-rose-300 text-xs text-rose-950 leading-relaxed space-y-1.5">
            <span className="font-bold block text-rose-900 text-sm">💡 แนวทางแก้ไขข้อขัดแย้งเพื่อเลือกเครื่องมือที่เหมาะสม:</span>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li><strong>หากต้องการเลือกโซลูชัน Microsoft:</strong> ต้องเปิดให้สามารถรวบรวมหรือจัดเก็บเอกสาร/ฐานความรู้สู่ OneDrive หรือ SharePoint ได้ (คำถามข้อ 5) และเตรียมทีมงานให้พร้อมดูแลสิทธิ์ UAM และส่งมอบ Agent (คำถามข้อ 6) รวมถึงใช้ Cloud LLM ที่รองรับบน Azure/M365</li>
              <li><strong>หากต้องการเลือกโซลูชัน Athena:</strong> หากจำเป็นต้องเชื่อมต่อระบบภายใน (SmartServe) หรือต้องการรัน Local LLM ต้องวางแผนกระบวนการ ETL เอกสารจาก Office 365 เข้าสู่ระบบ Athena และใช้ระบบการกำกับดูแล UAM แบบรวมศูนย์ของ Athena</li>
            </ul>
          </div>
        </div>
      )}

      {/* Cost Threshold Override Notice */}
      {isCostThresholdOverride && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <span className="font-bold text-amber-900 block uppercase tracking-wide text-xs">
              เงื่อนไขข้ามโหมดเนื่องจากผลต่างต้นทุนทำงาน (COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD = ฿{costThresholdToPickAthena.toLocaleString()} THB)
            </span>
            <p className="leading-relaxed">
              แม้ว่าคำถามที่ 1 (ความพร้อมของทีมในการสร้าง Agent ขั้นสูง) จะระบุว่าไม่มีผู้เรียนรู้การสร้าง Workflow แบบหลายขั้นตอน (ซึ่งโดยปกติจะแนะนำ Microsoft Copilot โหมดใช้งานง่าย) แต่ต้นทุนค่าสิทธิ์รายปีของโซลูชัน Microsoft (<strong>฿{m365AnnualCostThb.toLocaleString()} บาท/ปี</strong>) สูงกว่าต้นทุนการติดตั้งและดำเนินงานของ Athena (<strong>฿{athenaTotalCostThb.toLocaleString()} บาท</strong>) ถึง <strong>฿{costDiffM365VsAthena.toLocaleString()} บาท</strong> เนื่องจากส่วนต่างนี้เกินเกณฑ์ที่กำหนดไว้ที่ <strong>฿{costThresholdToPickAthena.toLocaleString()} บาท</strong> ระบบการประเมินจึงจัดลำดับความสำคัญให้ <strong>Athena</strong> เพื่อช่วยประหยัดต้นทุนระดับองค์กรอย่างมีนัยสำคัญ
            </p>
          </div>
        </div>
      )}

      {/* 3-Tool Side-by-Side Comparison Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              ตารางเปรียบเทียบเชิงลึกทั้ง 3 เครื่องมือ (Comprehensive 3-Way Comparison)
            </h2>
            <p className="text-xs text-slate-500">
              ประเมินโดยใช้น้ำหนักต้นทุน {weightCost}% และคุณสมบัติ {weightFeatures}% (ความพร้อมทีม, การเชื่อมต่อระบบ KBank อื่น, การกำกับดูแล UAM, แผนโมเดล Local LLM)
            </p>
          </div>
          
          {/* Action Buttons: Export to DOCX & Print */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              disabled={isExportingDocx}
              onClick={handleExportDocx}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 active:scale-95 px-3.5 py-2 rounded-lg shadow-sm transition cursor-pointer"
              title="ดาวน์โหลดรายงานเอกสารทางการ Word (.docx) พร้อมส่วนลงนามและประทับตรา"
            >
              <FileDown className="w-4 h-4" />
              <span>{isExportingDocx ? 'กำลังสร้างรายงาน Word...' : 'ส่งออกรายงาน (.docx)'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition"
              title="พิมพ์หรือบันทึกสรุปผลเป็น PDF"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์ / บันทึก PDF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Card 1: Microsoft 365 Copilot (Easy Mode) */}
          <div className={`p-6 space-y-4 ${recommendedToolId === 'm365_copilot' ? 'bg-blue-50/30' : ''}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded">
                โหมดใช้งานง่าย (Easy Mode)
              </span>
              <span className="text-sm font-black text-blue-900">{scores.m365_copilot}% คะแนน</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Microsoft 365 Copilot</h3>
              <p className="text-xs text-slate-500 mt-1">
                ผู้ช่วย AI สำเร็จรูปสำหรับ Office 365 พร้อมใช้งานทันทีโดยไม่ต้องเรียนรู้การตั้งค่า
              </p>
            </div>
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Workflow Designer:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <X className="w-3.5 h-3.5 text-slate-400" /> ไม่จำเป็นต้องใช้
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">APIs ภายใน KBank:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <X className="w-3.5 h-3.5 text-slate-400" /> เฉพาะคลาวด์ M365 เท่านั้น
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">การกำกับดูแล UAM:</span>
                <span className="font-semibold text-slate-800">มาตรฐาน Microsoft 365 Native</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ต้นทุนประเมินรายปี:</span>
                <span className="font-bold text-slate-900">฿{annualCostThb.toLocaleString()} / ปี</span>
              </div>
            </div>
            <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">เหมาะสำหรับ:</span>
              <span>เพิ่มผลิตภาพการทำงานทั่วไป สรุปข้อมูลใน Teams/Word โดยไม่ต้องสร้างกระบวนการตัดสินใจหลายขั้นตอน หรือเชื่อมต่อระบบงานภายใน</span>
            </div>
          </div>

          {/* Card 2: Microsoft 365 Copilot Studio */}
          <div className={`p-6 space-y-4 ${recommendedToolId === 'copilot_studio' ? 'bg-purple-50/30' : ''}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded">
                สร้าง Workflow หลายขั้นตอน
              </span>
              <span className="text-sm font-black text-purple-900">{scores.copilot_studio}% คะแนน</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Copilot Studio</h3>
              <p className="text-xs text-slate-500 mt-1">
                Visual Low-code Designer สำหรับสร้างระบบอัตโนมัติแบบ Multi-Stage Agentic
              </p>
            </div>
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Workflow Designer:</span>
                <span className="font-semibold text-purple-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-purple-600" /> จำเป็นต้องมีผู้สร้าง
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ระบบภายนอก M365:</span>
                <span className="font-semibold text-slate-800">ต้องสร้าง Custom Gateways</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">การกำกับดูแล UAM:</span>
                <span className="font-semibold text-purple-700">ทีมจัดการเอง (Decentralized / Manual)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ต้นทุนประเมินรายปี:</span>
                <span className="font-bold text-slate-900">฿{annualCostThb.toLocaleString()} / ปี</span>
              </div>
            </div>
            <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">เหมาะสำหรับ:</span>
              <span>โฟลว์งานหลายขั้นตอนในระบบนิเวศ Microsoft 365/MDP ซึ่งทีมมีความพร้อมรับผิดชอบการตรวจสอบสิทธิ์ UAM และการส่งต่องานด้วยตนเอง</span>
            </div>
          </div>

          {/* Card 3: Athena */}
          <div className={`p-6 space-y-4 ${recommendedToolId === 'athena' ? 'bg-emerald-50/30' : ''}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded">
                ระบบภายในองค์กร
              </span>
              <span className="text-sm font-black text-emerald-900">{scores.athena}% คะแนน</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-base font-bold text-slate-900">Athena Platform</h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-semibold">
                  Gemini 3.1 Flash Lite
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                แพลตฟอร์ม Agent ภายในองค์กร ไม่มีต้นทุนค่าสิทธิ์ต่อผู้ใช้งาน (Zero Seat Tax)
              </p>
            </div>
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500">การเชื่อมต่อ SmartServe:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> รองรับระบบภายในโดยตรง
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">การกำกับดูแล UAM:</span>
                <span className="font-semibold text-emerald-700">กำกับดูแลแบบรวมศูนย์ระดับองค์กร</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Local / KBTG LLM:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> รองรับ (Supported)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ต้นทุนประเมินรวม:</span>
                <span className="font-bold text-emerald-800">฿{athenaTotalCostThb.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">เหมาะสำหรับ:</span>
              <span>เชื่อมต่อระบบงานภายใน KBank (SmartServe), การกำกับดูแล UAM รวมศูนย์, รองรับโมเดล Local/KBTG LLM และประหยัดค่าสิทธิ์รายคน</span>
            </div>
          </div>
        </div>
      </div>

      {/* Human Override & Stamp Preview Section */}
      <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                ส่วนลงนามอนุมัติและปรับเปลี่ยนผลการตัดสินใจโดยผู้บริหาร (Human Override & Official Stamp)
              </h3>
              <p className="text-xs text-slate-500">
                เอกสาร Word (.docx) ที่ส่งออกจะมีส่วนลงนามรับรองของผู้ประเมิน การปรับเปลี่ยนผลการตัดสินใจของผู้บริหาร และช่องประทับตราทางการของฝ่ายงาน
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isExportingDocx}
            onClick={handleExportDocx}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3.5 py-2 rounded-lg transition shrink-0"
          >
            <FileDown className="w-4 h-4" />
            <span>ดาวน์โหลดรายงาน .docx</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
              ทางเลือกในการปรับเปลี่ยนผลการตัดสินใจ (Management Override Options):
            </span>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border border-slate-400 rounded-sm inline-block"></span>
                <span>ยอมรับผลคำแนะนำอัตโนมัติของระบบ ({recommendedTool ? recommendedTool.name : 'เครื่องมือที่เลือก'})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border border-slate-400 rounded-sm inline-block"></span>
                <span>ปรับเปลี่ยนผลไปยังเครื่องมืออื่น: [ ] M365 Copilot  [ ] Studio  [ ] Athena</span>
              </div>
              <div className="pt-1 text-[11px] text-slate-400 italic">
                * มีพื้นที่เขียนเหตุผลความจำเป็นในการปรับเปลี่ยน 3 บรรทัด
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
              ช่องลงนามและประทับตราทางการ (Official Stamp & Signature Box):
            </span>
            <div className="flex justify-between items-center text-slate-600 pt-1">
              <div className="space-y-1">
                <div>• ชื่อและตำแหน่งผู้ประเมิน</div>
                <div>• ฝ่าย / สายงาน</div>
                <div>• ลายมือชื่อและวันที่ลงนาม</div>
              </div>
              <div className="w-28 h-20 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-center p-1 bg-slate-50 text-[10px] text-slate-400 font-semibold">
                ประทับตราทางการ / ตราสัญลักษณ์หน่วยงาน
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inputs Review of all 7 Questions */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-700 tracking-wider">
            สรุปคำตอบแบบประเมินทั้ง 7 ข้อ
          </span>
          <span className="text-xs text-slate-500 font-mono">
            สัดส่วนน้ำหนัก: ต้นทุน {weightCost}% • คุณสมบัติ {weightFeatures}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 text-xs">
          {/* Q1 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">1. ความพร้อมสร้าง Agent ขั้นสูง</span>
              <button onClick={onBackToQ1} className="text-indigo-600 hover:underline text-[11px]">แก้ไข</button>
            </div>
            <div className="text-slate-600">
              {q1AgenticWorkflow === 'yes' ? '✅ ใช่ (พร้อมเรียนรู้สร้าง Workflow)' : '❌ ไม่ใช่ (ต้องการแบบพร้อมใช้ทันที)'}
            </div>
          </div>

          {/* Q2 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">2. ต้นทุนโซลูชัน Microsoft</span>
              <button onClick={onBackToQ2} className="text-blue-600 hover:underline text-[11px]">แก้ไข</button>
            </div>
            <div className="text-slate-600">
              H: {H} • U: {U} (ซื้อเพิ่ม {additionalLicensesNeeded} สิทธิ์) → <strong>฿{annualCostThb.toLocaleString()} / ปี</strong>
            </div>
          </div>

          {/* Q3 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">3. ต้นทุนระบบ Athena</span>
              <button onClick={onBackToQ3} className="text-emerald-600 hover:underline text-[11px] print:hidden">แก้ไข</button>
            </div>
            <div className="text-slate-600">
              รวม: <strong>฿{athenaTotalCostThb.toLocaleString()}</strong> (Dev: ฿{athenaDevPocTotal.toLocaleString()} + Prod: ฿{athenaPilotProdTotal.toLocaleString()})
            </div>
          </div>

          {/* Q4 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">4. เชื่อมต่อระบบ KBank อื่น / UI อื่น</span>
              <button onClick={onBackToQ4} className="text-emerald-600 hover:underline text-[11px] print:hidden">แก้ไข</button>
            </div>
            <div className="text-slate-600">
              {q4ConnectNonM365 === 'yes' ? '✅ ใช่ (มี) - จำเป็นต้องต่อระบบ RQ / SmartServe / ภายใน' : '❌ ไม่ใช่ (ใช้เฉพาะ M365/MDP)'}
            </div>
          </div>

          {/* Q5 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">5. รวมความรู้สู่ OneDrive</span>
              <button onClick={onBackToQ5} className="text-blue-600 hover:underline text-[11px] print:hidden">แก้ไข</button>
            </div>
            <div className="text-slate-600">
              {q5O365KnowledgeToSharepoint === 'yes' ? '✅ ใช่ (รวบรวมสู่ OneDrive/SharePoint ได้)' : '❌ ไม่ได้ (ไม่สามารถรวบรวมได้ หรือใช้ Knowledge นอก O365 ซึ่งต้องติดต่อ KBTG EA)'}
            </div>
          </div>

          {/* Q6 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">6. การกำกับดูแลสิทธิ์ UAM</span>
              <button onClick={onBackToQ6} className="text-purple-600 hover:underline text-[11px] print:hidden">แก้ไข</button>
            </div>
            <div className="text-slate-600">
              {effectiveQ6Uam === 'yes' ? '✅ ใช่ (ทีมพร้อมตรวจสอบสิทธิ์ UAM)' : '❌ ไม่ใช่ (ต้องการ UAM รวมศูนย์)'}
            </div>
          </div>

          {/* Q7 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">7. แผนโมเดล Local / KBTG LLM</span>
              <button onClick={onBackToQ7} className="text-teal-600 hover:underline text-[11px] print:hidden">แก้ไข</button>
            </div>
            <div className="text-slate-600">
              {effectiveQ7Llm === 'yes' ? '✅ ใช่ (มีแผนใช้โมเดลภายใน)' : '❌ ไม่ใช่ (ใช้ Cloud LLM เชิงพาณิชย์)'}
            </div>
          </div>
        </div>

        {/* Detailed Athena Questionnaire Form Inputs Table (All forms filled) */}
        <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              <span>รายละเอียดแบบฟอร์มคำนวณต้นทุน Athena ทั้งหมด (All Athena Form Inputs & Breakdown):</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-mono">
              โมเดล: Gemini 3.1 Flash Lite
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Dev & PoC Box */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 font-bold text-slate-800">
                <span className="text-emerald-800">ส่วนที่ 1: Dev & PoC (นำเข้าเอกสาร & ประเมินผล)</span>
                <span className="text-emerald-700 font-mono font-bold">฿{athenaDevPocTotal.toLocaleString()}</span>
              </div>
              <div className="space-y-1 text-slate-600 text-[11px] font-mono">
                <div>• DL (docx, txt, md): {athenaBreakdown.DL ?? athenaInputs.DL ?? 0} ฉบับ × {athenaBreakdown.DL_AVG_PAGES ?? athenaInputs.DL_AVG_PAGES ?? 0} หน้า = ฿{(athenaBreakdown.costDlTotal || 0).toLocaleString()}</div>
                <div>• DM (pdf, pptx ไม่มีภาพ): {athenaBreakdown.DM ?? athenaInputs.DM ?? 0} ฉบับ × {athenaBreakdown.DM_AVG_PAGES ?? athenaInputs.DM_AVG_PAGES ?? 0} หน้า = ฿{(athenaBreakdown.costDmTotal || 0).toLocaleString()}</div>
                <div>• DH (pdf, pptx มีภาพ): {athenaBreakdown.DH ?? athenaInputs.DH ?? 0} ฉบับ × {athenaBreakdown.DH_AVG_PAGES ?? athenaInputs.DH_AVG_PAGES ?? 0} หน้า = ฿{(athenaBreakdown.costDhTotal || 0).toLocaleString()}</div>
                <div>• IMG_COUNT (ภาพประกอบ): {athenaBreakdown.IMG_COUNT ?? athenaInputs.IMG_COUNT ?? 0} ภาพ = ฿{(athenaBreakdown.costImgTotal || 0).toLocaleString()}</div>
                <div>• NOD (เอกสารอื่นๆ): {athenaBreakdown.NOD ?? athenaInputs.NOD ?? 0} ฉบับ = ฿{(athenaBreakdown.costNodTotal || 0).toLocaleString()}</div>
                <div>• AD (นักพัฒนา Agent): {athenaBreakdown.AD ?? athenaInputs.AD ?? 0} คน</div>
                <div>• การประเมินผล (EVAL_Q): {athenaBreakdown.EVAL_Q ?? athenaInputs.EVAL_Q ?? 0} คำถาม × {athenaBreakdown.EVAL_ATTEMPTS ?? athenaInputs.EVAL_ATTEMPTS ?? 0} รอบ = ฿{(athenaBreakdown.evalCostTotal || 0).toLocaleString()}</div>
                <div>• ระยะเวลา Dev & PoC: {athenaBreakdown.DEV_POC_MONTHS ?? athenaInputs.DEV_POC_MONTHS ?? 2} เดือน (Cloud Compute: ฿{(athenaBreakdown.costCloudFixedDevPoc ?? 24000).toLocaleString()})</div>
                <div>• ความช่วยเหลือ Agent Doctor: {athenaBreakdown.AGENT_DOCTOR_MANDAYS ?? athenaInputs.AGENT_DOCTOR_MANDAYS ?? 0} mandays = ฿{(athenaBreakdown.costAgentDoctorTotal || 0).toLocaleString()}</div>
              </div>
            </div>

            {/* Pilot & Production Box */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 font-bold text-slate-800">
                <span className="text-teal-800">ส่วนที่ 2: ช่วงนำร่องและใช้งานจริง (Pilot & Production)</span>
                <span className="text-teal-700 font-mono font-bold">฿{athenaPilotProdTotal.toLocaleString()}</span>
              </div>
              <div className="space-y-1 text-slate-600 text-[11px] font-mono">
                <div>• ผู้ใช้งานแชทจริง (U): {athenaBreakdown.U_PROD ?? athenaInputs.U ?? U ?? 0} คน</div>
                <div>• คำถามเฉลี่ยต่อวัน (Q_PER_DAY): {athenaBreakdown.Q_PER_DAY ?? athenaInputs.Q_PER_DAY ?? 0} คำถาม / คน / วัน</div>
                <div>• ระยะเวลาใช้งานจริง (PROD_MONTHS): {athenaBreakdown.PROD_MONTHS ?? athenaInputs.PROD_MONTHS ?? 10} เดือน</div>
                <div>• ต้นทุนคำถาม Production: ฿{(athenaBreakdown.costProdUsageTotal || 0).toLocaleString()} บาท</div>
                <div>• Cloud Compute คงที่ Pilot & Prod: ฿{(athenaBreakdown.costCloudFixedProd ?? 120000).toLocaleString()} บาท</div>
                <div className="pt-2 text-slate-900 font-sans font-bold text-xs border-t border-slate-100 flex justify-between">
                  <span>รวมต้นทุนประเมิน Athena ทั้งหมด:</span>
                  <span className="text-emerald-700 font-mono text-sm">฿{athenaTotalCostThb.toLocaleString()} บาท</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBackToQ7}
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ย้อนกลับไปคำถามที่ 7 (แผนโมเดล Local LLM)</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            disabled={isExportingDocx}
            onClick={handleExportDocx}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition"
          >
            <FileDown className="w-4 h-4" />
            <span>ส่งออกรายงาน (.docx)</span>
          </button>

          <button
            type="button"
            onClick={onOpenDatabase}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition"
          >
            <Sliders className="w-4 h-4 text-indigo-300" />
            <span>ปรับแต่งน้ำหนักคะแนน & ตัวแปร SQLite</span>
          </button>
        </div>
      </div>
    </div>
  );
}
