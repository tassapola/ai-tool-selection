import React from 'react';
import { ArrowLeft, ArrowRight, ShieldAlert, Check, X, Sparkles, UserCheck, UserX, AlertCircle, Info } from 'lucide-react';

export default function QuestionSix({
  value, // 'yes' | 'no' | null
  onChange,
  onBack,
  onNext
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/50 to-white p-6 sm:p-8 border-b border-slate-100">
        <div className="flex items-center space-x-2.5 text-xs font-semibold text-purple-700 uppercase tracking-wider mb-2">
          <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
            7
          </span>
          <span>คำถามที่ 7 • การกำกับดูแลสิทธิ์ UAM และวงจรความเป็นเจ้าของ (UAM Governance & Ownership Lifecycle)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          คุณมีบุคลากร กระบวนการ และเวลาที่พร้อมในการกำกับดูแลสิทธิ์ UAM ให้อยู่ในการควบคุมหรือไม่?
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          ในแพลตฟอร์มแบบ Self-Service เช่น Microsoft Copilot Studio ทีมของคุณมีความรับผิดชอบโดยตรง (Accountable) ในการดูแลสิทธิ์การเข้าถึงและการส่งต่อความเป็นเจ้าของ Agent
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* The 2 Specific Governance Cases */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            ข้อกำหนดความรับผิดชอบเฉพาะเจาะจง 2 กรณี:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Case One */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </div>
                <h3 className="text-xs font-bold text-slate-900">
                  กรณีที่ 1: การตรวจสอบเมื่อมีการย้ายฝ่าย (Department Transfer Review)
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                หากบุคคลที่คุณแชร์ AI Agent ให้ย้ายไปอยู่ฝ่ายอื่นภายใน KBank <strong>คุณมีความรับผิดชอบโดยตรง (ACCOUNTABLE)</strong> ในการตรวจสอบและปรับปรุงหรือเพิกถอนสิทธิ์การเข้าถึง Agent นั้น
              </p>
            </div>

            {/* Case Two */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </div>
                <h3 className="text-xs font-bold text-slate-900">
                  กรณีที่ 2: การโอนย้ายความเป็นเจ้าของ Agent (Agent Owner Handover)
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                หากเจ้าของ Agent ย้ายไปอยู่ฝ่ายอื่นหรือลาออกจาก KBank <strong>คุณมีความรับผิดชอบโดยตรง (ACCOUNTABLE)</strong> ในการโอนย้ายสิทธิ์ความเป็นเจ้าของ Agent ให้แก่ผู้รับผิดชอบคนใหม่อย่างเป็นทางการ
              </p>
            </div>
          </div>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* YES Option */}
          <button
            type="button"
            onClick={() => onChange('yes')}
            className={`p-5 rounded-xl border-2 text-left transition-all duration-200 relative flex flex-col justify-between ${
              value === 'yes'
                ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-bold ${value === 'yes' ? 'text-indigo-900' : 'text-slate-900'}`}>
                  ใช่ (Yes)
                </span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  value === 'yes' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Check className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ใช่ ทีมของเรามีบุคลากร กระบวนการ และเวลาในการตรวจสอบสิทธิ์อย่างสม่ำเสมอ เพื่อจัดการสิทธิ์ของ Agent และการส่งต่องานอย่างต่อเนื่อง
              </p>
            </div>

            {value === 'yes' && (
              <div className="mt-3 pt-3 border-t border-indigo-200 text-xs font-semibold text-indigo-700 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                <span>มีความพร้อมด้านการกำกับดูแล สำหรับการบริหารวงจรชีวิต Agent บน Copilot Studio แบบ Self-Service</span>
              </div>
            )}
          </button>

          {/* NO Option */}
          <button
            type="button"
            onClick={() => onChange('no')}
            className={`p-5 rounded-xl border-2 text-left transition-all duration-200 relative flex flex-col justify-between ${
              value === 'no'
                ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-bold ${value === 'no' ? 'text-emerald-900' : 'text-slate-900'}`}>
                  ไม่ใช่ (No)
                </span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  value === 'no' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {value === 'no' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ไม่ใช่ ทีมไม่สามารถรับภาระในการตรวจสอบสิทธิ์ผู้ใช้หรือโอนย้ายความเป็นเจ้าของอย่างต่อเนื่องได้ เราต้องการการกำกับดูแลแบบรวมศูนย์ระดับองค์กร
              </p>
            </div>

            {value === 'no' && (
              <div className="mt-3 pt-3 border-t border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>แนะนำ Athena: มีระบบกำกับดูแลสิทธิ์ UAM แบบรวมศูนย์ระดับองค์กร</span>
              </div>
            )}
          </button>
        </div>

        {/* Dynamic Context Notice */}
        {value === 'no' && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">คำแนะนำด้านการกำกับดูแล (Governance): </span>
              เนื่องจากทีมของคุณไม่มีทรัพยากรเพียงพอสำหรับความรับผิดชอบในการตรวจสอบสิทธิ์ UAM แบบกระจายตัว จึงขอแนะนำ <strong>Athena</strong> ซึ่งเชื่อมโยงกับระบบจัดการสิทธิ์ตามบทบาท (Role-based Directory Management) ขององค์กร ช่วยป้องกันปัญหา Agent ไร้ผู้ดูแล และลดความเสี่ยงการรั่วไหลของข้อมูลข้ามฝ่าย
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
            <span>ย้อนกลับไปคำถามที่ 6 (การรวบรวมความรู้สู่ OneDrive)</span>
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
            <span>ต่อไปยังคำถามที่ 8 (แผนโมเดล Local LLM)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
