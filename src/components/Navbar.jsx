import React from 'react';
import { Database, Sparkles, RefreshCw, ArrowRight, Info, Maximize2, Laptop } from 'lucide-react';

export default function Navbar({
  currentStep,
  onSelectStep,
  onOpenDatabase,
  onOpenAssumptions,
  onOpenScreenSizeAlert,
  onReset,
  usdRate,
  licenseMonthlyUsd,
  isDbReady
}) {
  const steps = [
    { num: 1, label: 'ความพร้อมทีม', title: 'ข้อที่ 1: ความพร้อมสร้าง Agent ขั้นสูง (Advanced Builder Readiness)' },
    { num: 2, label: 'ค่าใช้จ่าย M365', title: 'ข้อที่ 2: ประมาณการค่าใช้จ่าย: โซลูชัน Microsoft' },
    { num: 3, label: 'ค่าใช้จ่าย Athena', title: 'ข้อที่ 3: ประมาณการค่าใช้จ่าย: Athena' },
    { num: 4, label: 'เชื่อมต่อ KBank อื่น', title: 'ข้อที่ 4: การเชื่อมต่อระบบ KBank อื่น ที่ไม่ใช่ M365/MDP (SmartServe)' },
    { num: 5, label: 'รวบรวมสู่ OneDrive', title: 'ข้อที่ 5: การรวบรวมความรู้สู่ OneDrive/SharePoint' },
    { num: 6, label: 'การดูแล UAM', title: 'ข้อที่ 6: การกำกับดูแลสิทธิ์ UAM และการโอนย้ายความเป็นเจ้าของ Agent' },
    { num: 7, label: 'แผน Local LLM', title: 'ข้อที่ 7: แผนการใช้งานโมเดล Local LLM หรือ LLM ภายใน KBank/KBTG' },
    { num: 8, label: 'สรุปผล', title: 'สรุปผลการประเมินและเปรียบเทียบทั้ง 3 โซลูชัน' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/90 w-full">
      <div className="w-full max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-1 sm:gap-2">
          {/* Logo & Narrow Title */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-xs text-white shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-xs sm:text-sm leading-tight whitespace-nowrap">
                  เครื่องมือ AI
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap">
                  M365 vs Studio vs Athena
                </span>
              </div>
              <span className="hidden sm:inline text-[10px] text-slate-500 font-medium leading-tight whitespace-nowrap">
                (AI Tool Selection Advisor)
              </span>
            </div>
          </div>

          {/* Stage Button Navigation (Visible on xl screens >= 1280px) */}
          <div className="hidden xl:flex items-center space-x-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 shrink-0">
            {steps.map((s) => (
              <button
                key={s.num}
                type="button"
                title={s.title}
                onClick={() => onSelectStep(s.num)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 cursor-pointer shrink-0 ${
                  currentStep === s.num
                    ? 'bg-indigo-600 text-white shadow-xs ring-1 ring-indigo-500'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  currentStep === s.num ? 'bg-white text-indigo-700' : 'bg-slate-200 text-slate-700'
                }`}>
                  {s.num}
                </span>
                <span className="whitespace-nowrap">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Compact Stage Indicator with Laptop Hint (Visible on screens < 1280px, guaranteed to fit on mobile) */}
          <div className="flex xl:hidden items-center space-x-1.5 shrink-0">
            <button
              type="button"
              onClick={onOpenScreenSizeAlert}
              className="inline-flex items-center space-x-1 text-[11px] font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg border border-amber-300 transition cursor-pointer shadow-2xs whitespace-nowrap"
              title="แนะนำเปิดบน Laptop เพื่อการแสดงผลที่สมบูรณ์"
            >
              <Laptop className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden md:inline">แนะนำเปิดบน Laptop / ขยายจอ</span>
              <span className="md:hidden">แนะนำเปิดบน Laptop</span>
            </button>
          </div>

          {/* Right Action Buttons & Database Status */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {/* Live Database Variables Pill */}
            <div className="hidden 2xl:flex items-center space-x-1 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-700">60:40</span>
              <span className="text-slate-300">|</span>
              <span className="font-medium text-slate-600">฿{usdRate}/$</span>
            </div>

            {/* Additional Assumptions Button */}
            <button
              type="button"
              onClick={onOpenAssumptions}
              className="relative inline-flex items-center space-x-1 px-2 py-1.5 sm:px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer whitespace-nowrap"
              title="ดูสมมุติฐานเพิ่มเติมของระบบ (UAM & User Scale)"
            >
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden lg:inline">สมมุติฐานเพิ่มเติม</span>
              <span className="hidden md:inline lg:hidden">สมมุติฐาน</span>
            </button>

            {/* SQLite Database Button */}
            <button
              type="button"
              onClick={onOpenDatabase}
              className="relative inline-flex items-center space-x-1 px-2 py-1.5 sm:px-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition shadow-xs cursor-pointer whitespace-nowrap"
              title="เปิดจัดการฐานข้อมูล SQLite และค่าน้ำหนัก"
            >
              <Database className="w-3.5 h-3.5 text-indigo-300" />
              <span className="hidden lg:inline">ฐานข้อมูล SQLite</span>
              <span className="hidden md:inline lg:hidden">DB</span>
              {isDbReady && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              )}
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={onReset}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="รีเซ็ตการประเมิน (Reset Assessment)"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
