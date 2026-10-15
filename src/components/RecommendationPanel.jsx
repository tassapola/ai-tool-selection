import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronDown, ChevronUp, Bot, Workflow, Cpu, Lock, HelpCircle, Info, AlertTriangle } from 'lucide-react';

export default function RecommendationPanel({
  evaluation,
  onNavigateToSummary,
  currentStep
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    scores = { m365_copilot: 34, copilot_studio: 33, athena: 33 },
    recommendedToolId,
    recommendedTool,
    annualCostThb = 0,
    m365AnnualCostThb = 0,
    athenaTotalCostThb = 0,
    H = 0,
    U = 0,
    reasoning = [],
    isDecisive,
    isPendingFirstThree = false,
    completedCoreCount = 0,
    weightCost = 60,
    weightFeatures = 40,
    isCostThresholdOverride = false,
    costDiffM365VsAthena = 0,
    costThresholdToPickAthena = 350000
  } = evaluation;

  // Icon mapping for tools
  const getToolIcon = (id) => {
    switch (id) {
      case 'm365_copilot':
        return <Bot className="w-5 h-5 text-blue-600" />;
      case 'copilot_studio':
        return <Workflow className="w-5 h-5 text-purple-600" />;
      case 'athena':
        return <Cpu className="w-5 h-5 text-emerald-600" />;
      case 'no_recommendation':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getToolTheme = (id) => {
    switch (id) {
      case 'm365_copilot':
        return {
          pillBg: 'bg-blue-100 text-blue-800 border-blue-200',
          badgeBg: 'bg-blue-600 text-white',
          accentBorder: 'border-l-4 border-blue-600',
          gradient: 'from-blue-500/10 to-indigo-500/5'
        };
      case 'copilot_studio':
        return {
          pillBg: 'bg-purple-100 text-purple-800 border-purple-200',
          badgeBg: 'bg-purple-600 text-white',
          accentBorder: 'border-l-4 border-purple-600',
          gradient: 'from-purple-500/10 to-indigo-500/5'
        };
      case 'athena':
        return {
          pillBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          badgeBg: 'bg-emerald-600 text-white',
          accentBorder: 'border-l-4 border-emerald-600',
          gradient: 'from-emerald-500/10 to-teal-500/5'
        };
      case 'no_recommendation':
        return {
          pillBg: 'bg-rose-100 text-rose-800 border-rose-300',
          badgeBg: 'bg-rose-600 text-white',
          accentBorder: 'border-l-4 border-rose-600',
          gradient: 'from-rose-500/10 to-red-500/5'
        };
      default:
        return {
          pillBg: 'bg-slate-100 text-slate-800 border-slate-200',
          badgeBg: 'bg-slate-700 text-white',
          accentBorder: 'border-l-4 border-slate-400',
          gradient: 'from-slate-500/5 to-slate-500/5'
        };
    }
  };

  const currentTheme = getToolTheme(recommendedToolId);

  return (
    <section 
      aria-label="Tool Recommendation" 
      className="sticky top-16 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Top Header Row of the Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
          <div className="flex items-center space-x-2">
            <span className={`text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded border ${
              isPendingFirstThree
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-indigo-50 text-indigo-700 border-indigo-100'
            }`}>
              {isPendingFirstThree ? 'การประเมินอยู่ระหว่างดำเนินการ' : 'ผลคำแนะนำแบบเรียลไทม์'}
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>คำแนะนำเครื่องมือที่เหมาะสม:</span>
              {!isPendingFirstThree && recommendedTool ? (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-semibold border ${currentTheme.pillBg}`}>
                  {getToolIcon(recommendedToolId)}
                  <span>{recommendedTool.name}</span>
                  {recommendedTool.mode_name ? (
                    <span className="text-[11px] opacity-80 font-normal">({recommendedTool.mode_name})</span>
                  ) : null}
                </span>
              ) : (
                <span className="text-amber-700 font-medium text-xs sm:text-sm flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>ปลดล็อกเมื่อตอบคำถาม 3 ข้อแรกเสร็จสิ้น (ความพร้อมและค่าใช้จ่าย)</span>
                </span>
              )}
            </h2>
          </div>

          {/* Quick Metrics & Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
            <div className="hidden sm:flex items-center space-x-1.5 bg-blue-50/80 border border-blue-200 px-2.5 py-1 rounded-md">
              <span className="text-blue-700 font-medium">M365:</span>
              <span className="font-bold text-slate-900">
                {m365AnnualCostThb === 0 ? '฿0/ปี' : `฿${m365AnnualCostThb.toLocaleString()}/ปี`}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 bg-emerald-50/80 border border-emerald-200 px-2.5 py-1 rounded-md">
              <span className="text-emerald-700 font-medium">Athena:</span>
              <span className="font-bold text-emerald-900">
                {athenaTotalCostThb === 0 ? '฿0' : `฿${athenaTotalCostThb.toLocaleString()}`}
              </span>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center space-x-1 text-slate-600 hover:text-slate-900 font-medium px-2 py-1 rounded hover:bg-slate-100 transition"
              aria-label="สลับดูเหตุผลการแนะนำ"
            >
              <span>{isExpanded ? 'ซ่อนรายละเอียด' : 'ดูเหตุผล'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* The Bar which spans left to right */}
        <div className="space-y-1.5">
          {isPendingFirstThree ? (
            /* Pending State: Progress bar indicating steps 1–3 */
            <div className="space-y-1">
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex shadow-inner border border-slate-200/80">
                <div
                  style={{ width: `${Math.round((completedCoreCount / 3) * 100)}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>ตอบคำถามหลักแล้ว: <strong>{completedCoreCount} จาก 3 ข้อ</strong></span>
                <span className="font-medium text-amber-700">
                  คำแนะนำเครื่องมือจะแสดงขึ้นเมื่อตอบคำถามข้อ 2, 3 และ 4 เสร็จสิ้น
                </span>
              </div>
            </div>
          ) : (
            /* Decisive State: Left to Right Tool Fit Distribution Bar */
            <>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex shadow-inner border border-slate-200/80">
                {/* Microsoft 365 Copilot Segment (Blue) */}
                <div
                  style={{ width: `${scores.m365_copilot}%` }}
                  className={`h-full transition-all duration-500 ease-out flex items-center justify-center ${
                    recommendedToolId === 'm365_copilot'
                      ? 'bg-blue-600'
                      : 'bg-blue-400/80'
                  }`}
                  title={`Microsoft 365 Copilot (Easy mode) Advanced license allow share: ${scores.m365_copilot}%`}
                />

                {/* Copilot Studio Segment (Purple) */}
                <div
                  style={{ width: `${scores.copilot_studio}%` }}
                  className={`h-full transition-all duration-500 ease-out flex items-center justify-center ${
                    recommendedToolId === 'copilot_studio'
                      ? 'bg-purple-600'
                      : 'bg-purple-400/80'
                  }`}
                  title={`Copilot Studio: ${scores.copilot_studio}%`}
                />

                {/* Athena Segment (Emerald) */}
                <div
                  style={{ width: `${scores.athena}%` }}
                  className={`h-full transition-all duration-500 ease-out flex items-center justify-center ${
                    recommendedToolId === 'athena'
                      ? 'bg-emerald-600'
                      : 'bg-emerald-400/80'
                  }`}
                  title={`Athena: ${scores.athena}%`}
                />
              </div>

              {/* Bar Legend / Distribution labels */}
              <div className="flex flex-wrap items-center justify-between text-[11px] sm:text-xs text-slate-600 font-medium px-1 gap-1">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                  <span className={recommendedToolId === 'm365_copilot' ? 'font-bold text-blue-900' : ''}>
                    M365 Copilot (Easy mode - Adv Share): <span className="font-semibold">{scores.m365_copilot}%</span>
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"></span>
                  <span className={recommendedToolId === 'copilot_studio' ? 'font-bold text-purple-900' : ''}>
                    Copilot Studio: <span className="font-semibold">{scores.copilot_studio}%</span>
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                  <span className={recommendedToolId === 'athena' ? 'font-bold text-emerald-900' : ''}>
                    Athena (ระบบภายใน): <span className="font-semibold">{scores.athena}%</span>
                  </span>
                </div>

                <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                  (ค่าน้ำหนัก: ต้นทุน {weightCost}% • ฟีเจอร์ {weightFeatures}%)
                </span>
              </div>

              {/* Conflict Notification Banner if no_recommendation */}
              {recommendedToolId === 'no_recommendation' && (
                <div className="mt-2 p-2 sm:p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-900">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>คำตอบมีความขัดแย้งกันทางสถาปัตยกรรม ({evaluation.conflicts?.length || 1} จุด) • ไม่สามารถสรุปเครื่องมือได้</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    className="text-[11px] underline text-rose-700 font-bold hover:text-rose-900 ml-2 shrink-0 cursor-pointer"
                  >
                    ดูรายละเอียดข้อขัดแย้ง
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Microsoft Solution Favoring Policy (Appears on every screen) */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-200 shrink-0 mt-0.5">
            <Info className="w-3 h-3 text-blue-600" />
            เกณฑ์แนะนำ
          </span>
          <p className="text-slate-600">
            ถ้า Microsoft solution มีฟังก์ชันเหมาะสมกับการทำงาน และค่าใช้จ่ายแพงกว่า Athena เล็กน้อย หรือไม่เกิน <strong className="text-slate-900 font-bold">฿{Number(costThresholdToPickAthena).toLocaleString()} / ปี</strong> ระบบจะแนะนำ Microsoft solution ทั้งนี้ เพื่อให้มั่นใจว่าระบบสนับสนุนโซลูชันของ Microsoft เช่นกัน (Favor Microsoft Solution) ซึ่งมีความได้เปรียบด้านความพร้อมใช้งานทันที (Time-to-Market), การทำงานร่วมกับแอปพลิเคชัน Office 365 ได้อย่างไร้รอยต่อ และลดภาระการพัฒนาหรือดูแลรักษาโครงสร้างพื้นฐานภายในองค์กร
          </p>
        </div>

        {/* Expandable Rationale Drawer */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 animate-fadeIn">
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  เหตุผลประกอบการตัดสินใจและค่าน้ำหนัก
                </h3>
                {isCostThresholdOverride && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
                    เกณฑ์สลับเลือก Athena ทำงาน (฿{costThresholdToPickAthena.toLocaleString()} THB)
                  </span>
                )}
                {recommendedToolId === 'no_recommendation' && (
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full">
                    พบข้อกำหนดขัดแย้งกัน ({evaluation.conflicts?.length || 1} จุด)
                  </span>
                )}
              </div>
              <ul className="space-y-1.5">
                {reasoning.map((r, i) => {
                  const isConflictItem = r.startsWith('⚠️') || r.startsWith('[จุดขัดแย้ง]');
                  return (
                    <li key={i} className={`flex items-start space-x-2 text-xs ${isConflictItem ? 'text-rose-900 font-medium' : 'text-slate-600'}`}>
                      {isConflictItem ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      )}
                      <span>{r}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="font-semibold text-slate-800 flex items-center justify-between">
                <span>เปรียบเทียบค่าใช้จ่าย</span>
                <span className="text-[10px] text-slate-500 font-normal">ค่าน้ำหนัก: {weightCost}%</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ค่าลิขสิทธิ์ Microsoft:</span>
                <span className="font-bold text-blue-700">
                  {m365AnnualCostThb === 0 ? '฿0 / ปี' : `฿${m365AnnualCostThb.toLocaleString()} / ปี`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ค่าใช้จ่ายรันระบบ Athena:</span>
                <span className="font-bold text-emerald-700">
                  ฿{athenaTotalCostThb.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 border-t border-slate-200 pt-1 text-[11px]">
                <span>ส่วนต่างค่าใช้จ่าย:</span>
                <span className={`font-bold ${costDiffM365VsAthena > costThresholdToPickAthena ? 'text-amber-700' : 'text-slate-700'}`}>
                  {costDiffM365VsAthena > 0 ? `+฿${costDiffM365VsAthena.toLocaleString()}` : `฿${costDiffM365VsAthena.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 text-[10px]">
                <span>เกณฑ์สลับเลือก Athena:</span>
                <span className="font-mono text-slate-700">฿{costThresholdToPickAthena.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[10px] pt-1 border-t border-slate-200">
                <span>ค่าน้ำหนักฟีเจอร์:</span>
                <span className="font-medium text-slate-700">{weightFeatures}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
