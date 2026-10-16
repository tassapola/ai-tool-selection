import React from 'react';
import { ArrowRight, Info, Layers, Users, UserCheck, Sparkles, Play } from 'lucide-react';

export default function BeforeStart({ onStart }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md max-w-3xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-blue-50/60 to-white p-6 sm:p-8 border-b border-slate-100">
        <div className="flex items-center space-x-2.5 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold">
            ก่อนเริ่ม
          </span>
          <span>ข้อควรทราบและขอบเขตของเครื่องมือ (Before You Begin)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          ก่อนเริ่มทำแบบประเมินการเลือกเครื่องมือ AI (AI Tool Selection)
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          โปรดอ่านทำความเข้าใจขอบเขตและแนวทางการนำผลลัพธ์ไปใช้งานทั้ง 3 ข้อด้านล่างก่อนเข้าสู่คำถามที่ 1
        </p>
      </div>

      {/* Main Content: 3 Key Notices */}
      <div className="p-6 sm:p-8 space-y-5">
        {/* Item 1 */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3.5">
          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 shadow-2xs">
              1
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  ขอบเขตเฉพาะเครื่องมือ No-Code Self-Service
                </h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                เครื่องมือนี้ใช้สำหรับแนะนำการเลือก tool ประเภท <strong>no-code self-service</strong> (ไม่ครอบคลุมชุดคำถามที่ใช้เลือก customized IT project แบบ high-code ที่มีความสลับซับซ้อน)
              </p>
            </div>
          </div>

          {/* Separated Additional Info Box */}
          <div className="ml-0 sm:ml-11 p-3.5 rounded-lg bg-amber-50/90 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center gap-2.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-amber-200/80 text-amber-950 border border-amber-300 shrink-0 self-start">
              <Info className="w-3.5 h-3.5 text-amber-800" />
              Additional Info
            </span>
            <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
              การรวมชุดคำถามในหลายกรณีเข้ามา จะทำให้คำถามซับซ้อน และผู้ใช้ใช้งานยากเกินไป
            </p>
          </div>
        </div>

        {/* Item 2 */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start space-x-3.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 shadow-2xs">
            2
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                ใช้ประกอบกระบวนการและคณะทำงาน AI อื่นๆ
              </h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              เครื่องมือนี้ใช้ประกอบกระบวนการ AI อื่นๆ เช่น <strong>คณะ DAWG</strong> สำหรับการตรวจสอบ accuracy, <strong>คณะ AI enabler</strong> และ <strong>process license</strong> สำหรับดูความคุ้มค่า
            </p>
          </div>
        </div>

        {/* Item 3 */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start space-x-3.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 shadow-2xs">
            3
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                การทบทวนและตัดสินใจโดยมนุษย์ (Human-in-the-Loop)
              </h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              คำแนะนำจากเครื่องมือนี้ <strong>ควรจะใช้มนุษย์อ่านผล และพิจารณาอีกครั้ง</strong>
            </p>
          </div>
        </div>

        {/* Start Action Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>พร้อมแล้ว คลิกปุ่มด้านขวาเพื่อเข้าสู่คำถามที่ 1 (Use-case info)</span>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-3 rounded-xl text-sm sm:text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>เริ่มทำแบบประเมิน</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
