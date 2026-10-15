import React from 'react';
import { ArrowLeft, ArrowRight, FolderSync, Check, X, Sparkles, FolderUp, Cloud, Info, AlertCircle } from 'lucide-react';

export default function QuestionFive({
  value, // 'yes' | 'no' | null
  onChange,
  onBack,
  onNext
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white p-6 sm:p-8 border-b border-slate-100">
        <div className="flex items-center space-x-2.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            5
          </span>
          <span>คำถามที่ 5 • การรวบรวมความรู้สู่ OneDrive / SharePoint (Knowledge Consolidation to OneDrive / SharePoint)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          หากคุณใช้เฉพาะฐานความรู้ Office 365 คุณสามารถรวบรวมความรู้สู่ OneDrive หรือ SharePoint ได้หรือไม่?
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          <em>If you use only Office 365 knowledge, can you move your knowledge into OneDrive/Sharepoint?</em> (โครงการที่ประสบความสำเร็จสามารถทำได้ / Successful project cases could do.)
        </p>

        {/* Notice for Knowledge outside Office 365 */}
        <div className="mt-3.5 p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-amber-900">ข้อควรระวังสำคัญ: </span>
            ถ้าคุณต้องการใช้ knowledge นอก Office 365, ให้ตอบว่า <strong>ไม่ได้</strong> และติดต่อ KBTG EA ก่อนกรอก เนื่องจากมีความเป็นไปได้โครงการ IT customized
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Architectural Explainer */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-slate-900">
            <FolderSync className="w-4 h-4 text-blue-600" />
            <span>บริบทสถาปัตยกรรมฐานความรู้ (Knowledge Architecture Context)</span>
          </div>
          <p className="leading-relaxed">
            การนำไฟล์ฐานความรู้ (เช่น คู่มือ, เอกสารอ้างอิง, รายงาน, นโยบาย) มารวบรวมจัดเก็บบน OneDrive หรือ SharePoint จะช่วยให้ระบบค้นคืนข้อมูล (RAG Ingestion) สามารถนำเข้าและทำดัชนีได้อย่างมีประสิทธิภาพ ทั้งนี้ หากโครงการของคุณ<strong>ไม่สามารถรวบรวมความรู้สู่ OneDrive หรือ SharePoint ได้</strong> โซลูชันของ Microsoft (Microsoft 365 Copilot / Copilot Studio) จะมีความจำเป็นอย่างยิ่ง เนื่องจากสามารถเข้าถึงและประมวลผลข้อมูลภายในระบบนิเวศ Office 365 ได้โดยตรงแบบ In-Place
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
                ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-bold ${value === 'yes' ? 'text-blue-900' : 'text-slate-900'}`}>
                  ใช่ (Yes)
                </span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  value === 'yes' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Check className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ใช่ ทีมสามารถรวบรวมความรู้สู่ <strong>OneDrive หรือ SharePoint</strong> ได้ (โครงการที่ประสบความสำเร็จสามารถทำได้ รองรับการเชื่อมต่อกับทั้ง Athena และ Microsoft)
              </p>
            </div>

            {value === 'yes' && (
              <div className="mt-3 pt-3 border-t border-blue-200 text-xs font-semibold text-blue-800 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span>เปิดกว้าง: สามารถเชื่อมต่อฐานความรู้กับทั้ง Athena หรือ Microsoft ได้</span>
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
                  ไม่ใช่ (ทำไม่ได้ / No)
                </span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  value === 'no' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {value === 'no' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ไม่ใช่ ไม่สามารถรวบรวมความรู้สู่ OneDrive หรือ SharePoint ได้ (หรือ<strong>ต้องการใช้ knowledge นอก Office 365</strong> ซึ่งให้ตอบว่า ไม่ได้ และติดต่อ KBTG EA ก่อนกรอก เนื่องจากมีความเป็นไปได้โครงการ IT customized)
              </p>
            </div>

            {value === 'no' && (
              <div className="mt-3 pt-3 border-t border-indigo-200 text-xs font-semibold text-indigo-800 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>แนะนำโซลูชัน Microsoft (หากเป็น O365) หรือติดต่อ KBTG EA (หากเป็น Knowledge นอก Office 365)</span>
              </div>
            )}
          </button>
        </div>

        {/* Dynamic Context Notice when NO */}
        {value === 'no' && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">คำแนะนำสำหรับกรณีไม่สามารถรวบรวมความรู้สู่ OneDrive/SharePoint: </span>
              เนื่องจากไม่สามารถรวบรวมฐานความรู้มายังที่จัดเก็บกลางได้ ระบบจึงแนะนำให้เลือก <strong>โซลูชันของ Microsoft (Microsoft 365 Copilot หรือ Copilot Studio)</strong> ซึ่งมีขีดความสามารถการเข้าถึงข้อมูลแบบ In-Place Access ข้ามระบบนิเวศ Office 365 ได้โดยตรง
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
            <span>ย้อนกลับไปคำถามที่ 4 (เชื่อมต่อระบบ KBank อื่น)</span>
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
            <span>ต่อไปยังคำถามที่ 6 (การกำกับดูแล UAM)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
