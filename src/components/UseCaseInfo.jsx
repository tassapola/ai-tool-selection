import React from 'react';
import { ArrowRight, FileText, Building2, Sparkles, Info, CheckCircle2 } from 'lucide-react';

export default function UseCaseInfo({
  useCaseName,
  departmentName,
  onUseCaseNameChange,
  onDepartmentNameChange,
  onNext
}) {
  const isFilled = (useCaseName && useCaseName.trim()) || (departmentName && departmentName.trim());

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md max-w-3xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white p-6 sm:p-8 border-b border-slate-100">
        <div className="flex items-center space-x-2.5 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
            1
          </span>
          <span>ข้อมูลเริ่มต้น • Use-case Info</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          Use-case info
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          กรุณาระบุชื่อ Use-case และฝ่ายงานที่รับผิดชอบ เพื่อนำไปแสดงในรายงานสรุปผลการประเมินและการส่งออกเอกสารอย่างเป็นทางการ (.docx และ PDF)
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Context Explainer Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-slate-900">
            <Info className="w-4 h-4 text-indigo-600" />
            <span>วัตถุประสงค์ของการระบุข้อมูล (Use-case Documentation)</span>
          </div>
          <p className="leading-relaxed">
            ข้อมูลนี้จะถูกบันทึกร่วมกับผลการประเมินความพร้อมและต้นทุนเปรียบเทียบระหว่าง <strong>Microsoft 365 Copilot</strong>, <strong>Copilot Studio</strong> และ <strong>Athena</strong> เพื่อใช้เป็นเอกสารประกอบการตัดสินใจของสถาปัตยกรรมองค์กร (Enterprise Architecture) และผู้บริหาร
          </p>
        </div>

        {/* Form Inputs: 2 Free Text Boxes */}
        <div className="space-y-5">
          {/* Field 1: Use-case ชื่ออะไร */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="usecase-name-input"
                className="text-sm font-bold text-slate-800 flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Use-case ชื่ออะไร</span>
              </label>
              <span className="text-[11px] font-semibold text-slate-400">
                (Free text)
              </span>
            </div>
            <input
              id="usecase-name-input"
              type="text"
              value={useCaseName || ''}
              onChange={(e) => onUseCaseNameChange(e.target.value)}
              placeholder="เช่น AI ช่วยสืบค้นและสรุปนโยบายสินเชื่อ, ผู้ช่วยตรวจสอบเอกสารสัญญา, Bot ตอบคำถามบริการ ฯลฯ"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm font-medium text-slate-900 placeholder:text-slate-400"
            />
            <p className="text-xs text-slate-500">
              ระบุชื่อหรือคำอธิบายสั้นๆ ของงาน AI ที่ต้องการพัฒนา
            </p>
          </div>

          {/* Field 2: ของฝ่ายงานไหน */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="dept-name-input"
                className="text-sm font-bold text-slate-800 flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>ของฝ่ายงานไหน</span>
              </label>
              <span className="text-[11px] font-semibold text-slate-400">
                (Free text)
              </span>
            </div>
            <input
              id="dept-name-input"
              type="text"
              value={departmentName || ''}
              onChange={(e) => onDepartmentNameChange(e.target.value)}
              placeholder="เช่น ฝ่ายบริหารความเสี่ยง, ฝ่ายการตลาดดิจิทัล, ทีมสินเชื่อธุรกิจ KBank, KBTG ฯลฯ"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm font-medium text-slate-900 placeholder:text-slate-400"
            />
            <p className="text-xs text-slate-500">
              ระบุชื่อฝ่ายงาน แผนก หรือกลุ่มงานที่เป็นเจ้าของ Use-case นี้
            </p>
          </div>
        </div>

        {/* Live Preview Pill */}
        {isFilled && (
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Use-case:</strong> {useCaseName || '(ยังไม่ระบุ)'} • <strong>ฝ่ายงาน:</strong> {departmentName || '(ยังไม่ระบุ)'}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 hidden sm:inline">
              พร้อมส่งออกในรายงาน
            </span>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            {isFilled ? (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> บันทึกข้อมูลเรียบร้อยแล้ว
              </span>
            ) : (
              'สามารถกรอกข้อมูลหรือกดถัดไปเพื่อเริ่มตอบคำถาม'
            )}
          </div>

          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition cursor-pointer"
          >
            <span>ต่อไปยังคำถามที่ 1 (ความพร้อมสร้าง Agent ขั้นสูง)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
