import React from 'react';
import { ArrowLeft, ArrowRight, Cpu, Check, X, Sparkles, Shield, Cloud, Server, Info } from 'lucide-react';

export default function QuestionSeven({
  value, // 'yes' | 'no' | null
  onChange,
  onBack,
  onComplete
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-50/80 via-emerald-50/50 to-white p-6 sm:p-8 border-b border-slate-100">
        <div className="flex items-center space-x-2.5 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
          <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
            8
          </span>
          <span>คำถามที่ 8 • แผนโมเดล Local LLM ภายในองค์กร (Model Hosting & Sovereign LLM Roadmap)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          คุณมีแผนจะใช้ Local LLM หรือ LLM ที่โฮสต์ภายใน KBank/KBTG ในอนาคตหรือไม่?
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          ประเมินว่าทีมหรือสายงานของคุณจำเป็นต้องใช้งานโมเดลส่วนตัวแบบ On-Premise, โมเดลวิจัยจาก KBTG หรือโครงสร้างพื้นฐาน Sovereign AI หรือไม่
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Architectural Explainer */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-slate-900">
            <Server className="w-4 h-4 text-teal-600" />
            <span>ความเข้ากันได้ของสถาปัตยกรรมโฮสติ้งโมเดล (Model Hosting Architecture)</span>
          </div>
          <p className="leading-relaxed">
            Microsoft Copilot และ Copilot Studio ถูกสร้างขึ้นเพื่อเชื่อมต่อกับโมเดลพื้นฐานของ OpenAI / Azure AI ที่โฮสต์บน Public Cloud ของ Microsoft เท่านั้น ไม่สามารถกำหนดค่าให้เรียกใช้ Private Inference Endpoints หรือ Local Weights ภายในองค์กรได้ หากต้องการใช้งาน Local LLM หรือ KBTG Foundation Models แพลตฟอร์ม <strong>Athena</strong> มีความยืดหยุ่นระดับสถาปัตยกรรมในการชี้ Model Adapter ไปยังโมเดลภายในใดๆ ได้ทันที
          </p>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* YES Option */}
          <button
            type="button"
            onClick={() => onChange('yes')}
            className={`p-5 rounded-xl border-2 text-left transition-all duration-200 relative flex flex-col justify-between ${
              value === 'yes'
                ? 'border-teal-600 bg-teal-50/80 ring-2 ring-teal-500/20 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-bold ${value === 'yes' ? 'text-teal-900' : 'text-slate-900'}`}>
                  ใช่ (Yes)
                </span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  value === 'yes' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Check className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ใช่ เรามีแผนงานหรือข้อกำหนดการปฏิบัติตามกฎเกณฑ์ที่ต้องใช้งานโมเดลภาษาขนาดใหญ่ที่โฮสต์ภายใน KBank/KBTG หรือเซิร์ฟเวอร์แบบ Local
              </p>
            </div>

            {value === 'yes' && (
              <div className="mt-3 pt-3 border-t border-teal-200 text-xs font-semibold text-teal-800 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>แนะนำ Athena: รองรับ Private Endpoints และ Local KBTG Weights</span>
              </div>
            )}
          </button>

          {/* NO Option */}
          <button
            type="button"
            onClick={() => onChange('no')}
            className={`p-5 rounded-xl border-2 text-left transition-all duration-200 relative flex flex-col justify-between ${
              value === 'no'
                ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-bold ${value === 'no' ? 'text-indigo-900' : 'text-slate-900'}`}>
                  ไม่ใช่ (No)
                </span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  value === 'no' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {value === 'no' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ไม่ใช่ เรายินดีใช้งานโมเดล Cloud LLM สำเร็จรูปเชิงพาณิชย์ เช่น OpenAI GPT-4o หรือ Azure OpenAI Service
              </p>
            </div>

            {value === 'no' && (
              <div className="mt-3 pt-3 border-t border-indigo-200 text-xs font-semibold text-indigo-800 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                <span>เปิดกว้าง: โซลูชัน Microsoft 365 หรือ Athena สามารถใช้งานได้ทั้งคู่</span>
              </div>
            )}
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ย้อนกลับไปคำถามที่ 7 (การกำกับดูแล UAM)</span>
          </button>

          <button
            type="button"
            onClick={onComplete}
            disabled={!value}
            className={`inline-flex items-center space-x-2 px-7 py-2.5 rounded-xl text-sm font-semibold transition shadow-md ${
              value
                ? 'bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white shadow-indigo-100'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>ดูผลสรุปและคำแนะนำสุดท้าย</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
