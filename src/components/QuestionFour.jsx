import React from 'react';
import { ArrowLeft, ArrowRight, Server, Check, X, Sparkles, Building2, Link2, Info } from 'lucide-react';

export default function QuestionFour({
  value, // 'yes' | 'no' | null
  onChange,
  onBack,
  onNext
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-white p-6 sm:p-8 border-b border-slate-100">
        <div className="flex items-center space-x-2.5 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
            5
          </span>
          <span>คำถามที่ 5 • การเชื่อมต่อระบบ KBank อื่น (Internal System Integration)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          คุณหรือ users จำเป็นต้องเชื่อมต่อกับระบบภายใน KBank อื่นหรือใช้ UI ในระบบ KBank อื่น ที่นอกเหนือจาก Microsoft 365 หรือ MDP หรือไม่?
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          ตัวอย่าง: ถ้า user มีความจำเป็นต้องใช้งานผ่านระบบ RQ ให้ตอบว่า ใช่ (มี)
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Context Explainer Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-slate-900">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>ขอบเขตระบบงานและ UI ภายใน KBank (KBank Ecosystem & UI Boundary)</span>
          </div>
          <p className="leading-relaxed">
            Microsoft Copilot และ Copilot Studio โดดเด่นอย่างมากกับบริการของ Microsoft 365 (SharePoint, Outlook, Teams, OneDrive) และ Azure/MDP หากคุณหรือ users จำเป็นต้องเรียกใช้งานระบบภายใน KBank อื่น หรือต้องใช้งานผ่าน UI ในระบบ KBank อื่น เช่น <strong>ระบบ RQ</strong>, <strong>SmartServe</strong>, Private Microservices หรือระบบ Banking Backend เดิม แพลตฟอร์มภายในอย่าง <strong>Athena</strong> จะมีเส้นทางเครือข่ายภายในองค์กรโดยตรง โดยไม่ต้องผ่าน Cloud Gateway Egress ที่ซับซ้อน
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
                ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-bold ${value === 'yes' ? 'text-emerald-900' : 'text-slate-900'}`}>
                  ใช่ (มี) / Yes
                </span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  value === 'yes' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Check className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ใช่ คุณหรือ users จำเป็นต้องเชื่อมต่อกับระบบภายใน KBank อื่น หรือใช้ UI ในระบบ KBank อื่น เช่น <strong>ระบบ RQ</strong>, <strong>SmartServe</strong>, ฐานข้อมูลภายใน หรือบริการของธนาคาร
              </p>
            </div>

            {value === 'yes' && (
              <div className="mt-3 pt-3 border-t border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>แนะนำ Athena: สร้างขึ้นเพื่อเชื่อมต่อระบบภายในและ UI ของ KBank โดยเฉพาะ</span>
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
                ไม่ใช่ Agent และ users จะเข้าถึงเฉพาะเอกสารและข้อมูลภายใน Microsoft 365, SharePoint, OneDrive หรือ MDP เท่านั้น
              </p>
            </div>

            {value === 'no' && (
              <div className="mt-3 pt-3 border-t border-indigo-200 text-xs font-semibold text-indigo-700 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                <span>ระบบนิเวศ Microsoft 365 / Copilot Studio ยังคงเป็นตัวเลือกที่เหมาะสมอย่างยิ่ง</span>
              </div>
            )}
          </button>
        </div>

        {/* Dynamic Context Notice */}
        {value === 'yes' && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">คำแนะนำเชิงสถาปัตยกรรม: </span>
              เนื่องจากคุณหรือ users ต้องการใช้งานผ่าน <strong>ระบบ RQ</strong>, <strong>SmartServe</strong> หรือ UI/ระบบภายในของ KBank จึงขอแนะนำ <strong>Athena</strong> อย่างยิ่ง เพื่อหลีกเลี่ยงข้อจำกัดการส่งข้อมูลออกนอกเครือข่ายองค์กร (Network Egress) และความซับซ้อนของ Custom Connectors
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ย้อนกลับไปคำถามที่ 4 (Athena)</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!value}
            className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${
              value
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>ต่อไปยังคำถามที่ 6 (การรวบรวมความรู้สู่ OneDrive)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
