import React, { useState } from 'react';
import { Check, X, ZoomIn, ExternalLink, ArrowRight, ArrowLeft, Info, Sparkles, AlertCircle } from 'lucide-react';

export default function QuestionOne({
  value, // 'yes' | 'no' | null
  onChange,
  onBack,
  onNext
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const imageUrl = "https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/media/flow-designer/workflow-designer.png";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Question Header Banner */}
      <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white p-6 sm:p-8 border-b border-slate-100">
        <div className="flex items-center space-x-2.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            2
          </span>
          <span>คำถามที่ 2 • ความพร้อมของทีมในการสร้าง Agent ขั้นสูง (Advanced Builder Readiness)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          ความพร้อมของทีม: ทีมของคุณมีบุคลากรที่พร้อมเรียนรู้การสร้าง Multi-Stage Agentic Workflow หรือไม่?
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          โฟลว์การทำงานอัตโนมัติแบบ Multi-Stage Agentic จำเป็นต้องมีผู้รับผิดชอบในทีมเพื่อออกแบบ Visual Decision Trees, กำหนดค่า System Prompts, เชื่อมโยง API Triggers และจัดการเงื่อนไขการแยกสาขา (Condition Branches)
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Visual Reference Section (The requested image) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-200">
                ภาพตัวอย่างอ้างอิง (Visual Reference)
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">
                หน้าจอ Workflow Designer ของ Microsoft Copilot Studio
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                className="inline-flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-800 bg-white px-2.5 py-1 rounded border border-indigo-200 shadow-2xs transition"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>ขยายภาพ</span>
              </button>
              <a
                href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/workflow-designer"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs transition"
                title="ดูเอกสารประกอบบน Microsoft Learn"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Image container */}
          <div 
            onClick={() => setIsZoomed(true)}
            className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-300 bg-white shadow-inner max-h-[360px] flex items-center justify-center"
          >
            <img
              src={imageUrl}
              alt="Microsoft Copilot Studio Workflow Designer showing multi-stage nodes and triggers"
              className="w-full object-contain object-top group-hover:scale-[1.01] transition-transform duration-200"
              loading="eager"
            />
            <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-slate-900/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm shadow flex items-center space-x-1.5">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>คลิกเพื่อขยายดูตัวอย่าง Workflow Designer</span>
              </span>
            </div>
          </div>

          <p className="mt-2 text-xs text-slate-500 italic text-center">
            ภาพแสดง: ผืนผ้าใบ (Visual Canvas) แบบหลายขั้นตอนสำหรับจัดลำดับ Triggers, เส้นทางตามเงื่อนไข, Generative Responses และการเรียกใช้ Tools
          </p>
        </div>

        {/* Answer Selection: Yes or No */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            เลือกระดับความพร้อมของทีมคุณ
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* NO Option */}
            <button
              type="button"
              onClick={() => onChange('no')}
              className={`p-5 rounded-xl border-2 text-left transition-all duration-200 relative flex flex-col justify-between ${
                value === 'no'
                  ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-lg font-bold ${value === 'no' ? 'text-blue-900' : 'text-slate-900'}`}>
                    ไม่ใช่ (No)
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    value === 'no' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {value === 'no' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  เราต้องการ AI แบบพร้อมใช้งานทันที (Ready-to-use) ทีมไม่มีกำลังคน ทรัพยากรนักพัฒนา หรือความประสงค์ที่จะเรียนรู้การสร้าง Workflow แบบ Node-based
                </p>
              </div>

              {value === 'no' && (
                <div className="mt-3 pt-3 border-t border-blue-200/80 text-xs font-semibold text-blue-700 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>คำแนะนำตรง: Microsoft 365 Copilot (Easy mode) Advanced license allow share</span>
                </div>
              )}
            </button>

            {/* YES Option */}
            <button
              type="button"
              onClick={() => onChange('yes')}
              className={`p-5 rounded-xl border-2 text-left transition-all duration-200 relative flex flex-col justify-between ${
                value === 'yes'
                  ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-lg font-bold ${value === 'yes' ? 'text-purple-900' : 'text-slate-900'}`}>
                    ใช่ (Yes)
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    value === 'yes' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Check className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ใช่ ทีมของเรามีสมาชิกอย่างน้อยหนึ่งคน ไม่ว่าจะเป็น Business Analyst หรือ Developer ที่พร้อมเรียนรู้และตั้งค่า Multi-Stage Agentic Workflows
                </p>
              </div>

              {value === 'yes' && (
                <div className="mt-3 pt-3 border-t border-purple-200/80 text-xs font-semibold text-purple-700 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>เปิดพิจารณา Copilot Studio และ Athena โดยคำนวณตามจำนวนผู้ใช้งานและต้นทุนค่าสิทธิ์ (Licensing Cost)</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Context Feedback */}
        {value === 'no' && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start space-x-3">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">เงื่อนไขการประเมินทำงาน: </span>
              เนื่องจากไม่มีผู้ดูแลระบบ Workflow แบบหลายขั้นตอน <strong>Microsoft 365 Copilot (โหมดใช้งานง่าย)</strong> จึงถูกเลือกเป็นโซลูชันที่เหมาะสมที่สุดโดยอัตโนมัติ ทั้งนี้คุณยังสามารถระบุจำนวนผู้ใช้ในคำถามที่ 3 เพื่อประเมินค่าใช้จ่ายได้!
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ย้อนกลับไป Use-case info</span>
            </button>
          ) : (
            <div className="text-xs text-slate-500">
              {value ? (
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> บันทึกคำตอบแล้ว
                </span>
              ) : (
                'โปรดเลือก ใช่ หรือ ไม่ใช่ เพื่อดำเนินการต่อ'
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onNext}
            disabled={!value}
            className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${
              value
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>ต่อไปยังคำถามที่ 3 (การประเมินต้นทุน: โซลูชัน Microsoft)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-2" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900">
                Microsoft Copilot Studio — Workflow Designer (สถาปัตยกรรม Multi-Stage Agentic)
              </span>
              <button
                onClick={() => setIsZoomed(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 max-h-[80vh] overflow-auto">
              <img
                src={imageUrl}
                alt="Copilot Studio Workflow Designer Full View"
                className="w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
