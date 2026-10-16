import React, { useState } from 'react';
import { Check, X, ZoomIn, ExternalLink, ArrowRight, ArrowLeft, Info, Sparkles, Users, Wrench, GitBranch, Database, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function QuestionOne({
  value, // 'yes' | 'no' | null
  onChange,
  subQuestions = { sub1: null, sub2: null, sub3: null },
  onSubQuestionsChange,
  onBack,
  onNext
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const imageUrl = "https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/media/flow-designer/workflow-designer.png";

  const sub1 = subQuestions?.sub1 ?? null;
  const sub2 = subQuestions?.sub2 ?? null;
  const sub3 = subQuestions?.sub3 ?? null;

  const anySubYes = sub1 === 'yes' || sub2 === 'yes' || sub3 === 'yes';
  const allSubAnswered = sub1 !== null && sub2 !== null && sub3 !== null;
  const anySubAnswered = sub1 !== null || sub2 !== null || sub3 !== null;

  const handleSubChange = (key, answer) => {
    const updated = {
      sub1,
      sub2,
      sub3,
      [key]: answer
    };
    if (onSubQuestionsChange) {
      onSubQuestionsChange(updated);
    }
    // Auto-select Multi-Stage Agent decision based on sub-questions:
    // If any of the 3 sub-questions is 'yes', Multi-Stage Agent (Copilot Studio / Athena) is needed -> 'yes'
    // Otherwise if all answered are 'no', Easy Agent Builder is sufficient -> 'no'
    const nextAnyYes = updated.sub1 === 'yes' || updated.sub2 === 'yes' || updated.sub3 === 'yes';
    if (nextAnyYes) {
      onChange('yes');
    } else if (updated.sub1 === 'no' && updated.sub2 === 'no' && updated.sub3 === 'no') {
      onChange('no');
    } else if (!value) {
      onChange('no');
    }
  };

  const multiStageQuestions = [
    {
      key: 'sub1',
      num: '1',
      icon: GitBranch,
      badge: 'Sub-Agent แยกตาม Knowledge Domain',
      question: '1. ท่านมีแผนจะสร้าง sub-agent ให้แต่ละ knowledge domain มี sub-agent knowledge แยกกัน เพื่อป้องกัน AI ทำงานผิดพลาด และต้องการทำให้ AI แม่นยำมากขึ้นหรือไม่?',
      val: sub1
    },
    {
      key: 'sub2',
      num: '2',
      icon: Database,
      badge: 'Sub-Agent อ่าน FAQ ใน Vector Database',
      question: '2. ท่านมีแผนจะสร้าง sub-agent ให้อ่าน FAQ ใน vector database ก่อนไปถาม LLM เพื่อให้ AI แม่นยำขึ้น ประหยัดค่าใช้จ่ายมากขึ้นหรือไม่?',
      val: sub2
    },
    {
      key: 'sub3',
      num: '3',
      icon: ShieldAlert,
      badge: 'Functional Guardrail ป้องกันความเสี่ยง',
      question: '3. ท่านมีแผนที่จะต้องทำ Functional guardrail เช่นคำถามที่มีความเสี่ยงทางกฎหมาย เช่นคำถามเกี่ยวกับบัญชีผู้วายชนม์ โดยตั้งให้ guardrail ดังกล่าว บอกให้ AI ไม่ตอบคำถามสุ่มเสี่ยง ท่านมีแผนหรือไม่?',
      val: sub3
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Question Header Banner */}
      <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white p-6 sm:p-8 border-b border-slate-100">
        <div className="flex items-center space-x-2.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            2
          </span>
          <span>คำถามที่ 2 • ประเมินความจำเป็นในการทำ Multi-Stage Agent และความพร้อมของบุคลากร (People & Builder Readiness)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          ความต้องการ Multi-Stage Agent และความพร้อมของทีม: โครงการของท่านต้องทำ Multi-Stage Agent หรือไม่ และมีบุคลากรพร้อมเรียนรู้หรือไม่?
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          ตอบคำถามย่อย 3 ข้อด้านล่างเพื่อช่วยวิเคราะห์ว่า Use-case ของท่านจำเป็นต้องใช้โครงสร้างแบบ <strong>Multi-Stage Agent (Microsoft Copilot Studio หรือ Athena)</strong> หรือสามารถใช้ <strong>Microsoft M365 Copilot Easy mode Advanced license</strong> ได้ พร้อมประเมินความพร้อมของบุคลากรในทีม
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* SECTION A: 3 Sub-Questions to determine if Multi-Stage Agent is needed */}
        <div className="p-5 sm:p-6 rounded-2xl bg-indigo-50/50 border-2 border-indigo-200/90 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-200/80">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-white px-2.5 py-0.5 rounded border border-indigo-200">
                ส่วนที่ 1 • เช็คลิสต์ประเมินความจำเป็น (Multi-Stage Agent Checklist)
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1.5">
                คำถามช่วยประเมินว่าต้องทำ Multi-Stage Agent หรือไม่ (3 ข้อ)
              </h3>
            </div>
            <span className="text-xs font-semibold text-indigo-800 bg-white px-3 py-1 rounded-full border border-indigo-200 self-start sm:self-center shrink-0">
              หากตอบ "ใช่" อย่างน้อย 1 ข้อ → ต้องทำ Multi-Stage Agent
            </span>
          </div>

          <div className="space-y-4">
            {multiStageQuestions.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.key}
                  className={`p-4 sm:p-5 rounded-xl border transition-all bg-white shadow-2xs space-y-3 ${
                    item.val === 'yes'
                      ? 'border-purple-400 ring-2 ring-purple-500/10'
                      : item.val === 'no'
                      ? 'border-blue-400 ring-2 ring-blue-500/10'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          คำถามย่อยข้อ 2.{item.num} • {item.badge}
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                          {item.question}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Yes / No Choice Buttons for each Sub-Question */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* YES Button */}
                    <button
                      type="button"
                      onClick={() => handleSubChange(item.key, 'yes')}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                        item.val === 'yes'
                          ? 'border-purple-600 bg-purple-50/90 shadow-2xs'
                          : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 bg-slate-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs sm:text-sm font-bold ${item.val === 'yes' ? 'text-purple-950' : 'text-slate-800'}`}>
                          ใช่ (มีแผน)
                        </span>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          item.val === 'yes' ? 'bg-purple-600 text-white' : 'bg-white border border-slate-300 text-slate-400'
                        }`}>
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className={`text-[11px] leading-relaxed font-semibold flex items-center gap-1 ${
                        item.val === 'yes' ? 'text-purple-800' : 'text-slate-500'
                      }`}>
                        <Sparkles className="w-3 h-3 shrink-0 text-purple-600" />
                        <span>ให้เลือกเป็น Microsoft Copilot Studio หรือ Athena</span>
                      </div>
                    </button>

                    {/* NO Button */}
                    <button
                      type="button"
                      onClick={() => handleSubChange(item.key, 'no')}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                        item.val === 'no'
                          ? 'border-blue-600 bg-blue-50/90 shadow-2xs'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 bg-slate-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs sm:text-sm font-bold ${item.val === 'no' ? 'text-blue-950' : 'text-slate-800'}`}>
                          ไม่ใช่ (ไม่มีแผน)
                        </span>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          item.val === 'no' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-300 text-slate-400'
                        }`}>
                          {item.val === 'no' ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        </span>
                      </div>
                      <div className={`text-[11px] leading-relaxed font-semibold flex items-center gap-1 ${
                        item.val === 'no' ? 'text-blue-800' : 'text-slate-500'
                      }`}>
                        <Sparkles className="w-3 h-3 shrink-0 text-blue-600" />
                        <span>ให้เลือกเป็น Microsoft M365 Copilot Easy mode Advanced license</span>
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Callout of the 3 Sub-Questions */}
          {anySubAnswered && (
            <div className={`p-4 rounded-xl border-2 flex items-start gap-3 transition-all ${
              anySubYes
                ? 'bg-purple-100/80 border-purple-400 text-purple-950'
                : 'bg-blue-100/80 border-blue-400 text-blue-950'
            }`}>
              <Sparkles className={`w-5 h-5 shrink-0 mt-0.5 ${anySubYes ? 'text-purple-700' : 'text-blue-700'}`} />
              <div className="text-xs sm:text-sm space-y-1">
                <div className="font-extrabold">
                  {anySubYes
                    ? 'สรุปผลการประเมิน Use-case: จำเป็นต้องทำ Multi-Stage Agent → แนะนำ Microsoft Copilot Studio หรือ Athena'
                    : allSubAnswered
                    ? 'สรุปผลการประเมิน Use-case: ไม่จำเป็นต้องทำ Multi-Stage Agent → แนะนำ Microsoft M365 Copilot Easy mode Advanced license'
                    : 'ผลเบื้องต้น: ยังไม่มีข้อใดต้องการ Multi-Stage Agent (แนะนำตอบครบทั้ง 3 ข้อเพื่อความแม่นยำ)'}
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {anySubYes
                    ? 'เนื่องจากท่านมีแผนทำ Sub-agent แยกตาม Knowledge Domain, ดึง FAQ จาก Vector Database ก่อนถาม LLM หรือตั้งค่า Functional Guardrail ซึ่งต้องอาศัยการควบคุมโฟลว์หลายขั้นตอน (Multi-Stage Agentic Workflow) ระบบจึงกำหนดคำแนะนำเบื้องต้นไปยัง Microsoft Copilot Studio หรือ Athena'
                    : 'หากไม่มีแผนสร้าง Sub-agent แยกโดเมน, ไม่ต้องคิวรี FAQ ใน Vector DB แยกขั้นตอน และไม่มี Functional Guardrail เฉพาะทาง ท่านสามารถใช้ Microsoft M365 Copilot Easy mode Advanced license ได้ทันที'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* People Readiness Context & Role Breakdown */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div className="font-bold text-xs sm:text-sm flex items-center gap-2 text-slate-900">
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
              <span>ส่วนที่ 2 • รายละเอียดความพร้อมของบุคลากรและบทบาทหน้าที่ (People Readiness & Role Expectations)</span>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 shrink-0 hidden sm:inline-block">
              เกณฑ์ประเมินทักษะทีม
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            การเลือกเครื่องมือสร้าง AI Agent มีความสัมพันธ์โดยตรงกับ<strong>ทักษะของบุคลากร เวลาที่สามารถจัดสรรได้ และรูปแบบการดูแลรักษาระบบของทีมคุณ</strong> โดยแบ่งความต้องการด้านบุคลากรออกเป็น 2 รูปแบบหลัก และ 4 ภารกิจสำคัญสำหรับผู้สร้าง Agent ขั้นสูง ดังนี้:
          </p>

          {/* 2 Role Profiles Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Profile 1: Ready-to-use / General User */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  รูปแบบที่ 1: ผู้ใช้งานทั่วไป (Easy mode)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  กรณีตอบ "ไม่ใช่"
                </span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li><strong>คุณสมบัติบุคลากร:</strong> พนักงานทั่วไป ไม่จำเป็นต้องมีพื้นฐานการเขียนโปรแกรมหรือการออกแบบ Logic Flow</li>
                <li><strong>ลักษณะการสร้าง:</strong> กรอกเพียงคำสั่ง Prompt ภาพรวม (Instructions) และเลือกแหล่งเอกสารอ้างอิงจาก SharePoint/OneDrive</li>
                <li><strong>เวลาที่ใช้เรียนรู้:</strong> พร้อมใช้งานทันที (ต่ำกว่า 1–2 ชั่วโมง) ไม่ต้องดูแลโครงสร้าง Workflow ซับซ้อน</li>
                <li><strong>เครื่องมือที่รองรับ:</strong> <strong className="text-blue-700">Microsoft M365 Copilot Easy mode Advanced license</strong></li>
              </ul>
            </div>

            {/* Profile 2: Builder / Citizen Dev / Developer */}
            <div className="bg-white p-4 rounded-xl border border-purple-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  รูปแบบที่ 2: ผู้พัฒนาโฟลว์ (Multi-Stage Agent Builder)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  กรณีตอบ "ใช่"
                </span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li><strong>คุณสมบัติบุคลากร:</strong> มี <strong>Business Analyst (BA), Citizen Developer, Data Analyst หรือ Developer</strong> อย่างน้อย 1–2 คนในทีม</li>
                <li><strong>ลักษณะการสร้าง:</strong> ออกแบบ Sub-agents แยกตาม Knowledge Domain, เชื่อมต่อ FAQ Vector DB, และตั้งค่า Functional Guardrails</li>
                <li><strong>เวลาที่ใช้เรียนรู้และพัฒนา:</strong> มีการจัดสรรเวลาสำหรับเรียนรู้เครื่องมือ ทดสอบความแม่นยำ และดูแลปรับปรุงอย่างต่อเนื่อง</li>
                <li><strong>เครื่องมือที่รองรับ:</strong> <strong className="text-purple-700">Microsoft Copilot Studio</strong> หรือ <strong className="text-emerald-700">Athena</strong></li>
              </ul>
            </div>
          </div>

          {/* 4 Key Responsibilities of Advanced Builders */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 space-y-2.5">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-indigo-600" />
              <span>4 ภารกิจหลักที่บุคลากรในทีมต้องรับผิดชอบเมื่อสร้าง Multi-Stage Agentic Workflow:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">1</span>
                <div>
                  <span className="font-bold text-slate-800 block">การออกแบบ Sub-Agent และลำดับงาน (Sub-Agents & Flow Design)</span>
                  <span className="text-slate-600 leading-relaxed">แยก Sub-agent ตาม Knowledge Domain, กำหนดลำดับการค้นหา FAQ ใน Vector DB ก่อนเรียก LLM และวางเงื่อนไขการส่งต่องาน</span>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">2</span>
                <div>
                  <span className="font-bold text-slate-800 block">การตั้งค่า Functional Guardrail และ Prompt (Guardrails & Prompt Tuning)</span>
                  <span className="text-slate-600 leading-relaxed">กำหนดกฎคัดกรองคำถามสุ่มเสี่ยง (เช่น ประเด็นทางกฎหมายหรือบัญชีผู้วายชนม์) เพื่อสั่งให้ AI ปฏิเสธการตอบอย่างปลอดภัย</span>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">3</span>
                <div>
                  <span className="font-bold text-slate-800 block">การวัดผลและทดสอบความแม่นยำ (Evaluation & Testing)</span>
                  <span className="text-slate-600 leading-relaxed">สร้างชุดคำถามมาตรฐาน (Test Cases) เพื่อทดสอบทั้งความถูกต้องของคำตอบและประสิทธิภาพของ Guardrail ก่อนใช้งานจริง</span>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">4</span>
                <div>
                  <span className="font-bold text-slate-800 block">การดูแลรักษาหลังใช้งานจริง (Ongoing Maintenance)</span>
                  <span className="text-slate-600 leading-relaxed">คอยอัปเดตเอกสารฐานความรู้ ปรับปรุง FAQ Vector DB และปรับเงื่อนไข Guardrail เมื่อเกณฑ์ธุรกิจหรือกฎหมายเปลี่ยน</span>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
              <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                <strong>หมายเหตุสำหรับ Athena:</strong> หากทีมมีผู้รับผิดชอบหลักแล้วแต่ต้องการผู้เชี่ยวชาญช่วยตั้งต้นและให้คำปรึกษาเชิงเทคนิคในช่วง Dev & PoC สามารถเลือกใช้บริการ <strong>Agent Doctor</strong> ช่วยสนับสนุนได้ในคำถามที่ 4
              </span>
            </div>
          </div>
        </div>

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

        {/* Final Answer Selection for Question 2: Yes or No */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            สรุปคำตอบข้อที่ 2: โครงการของท่านต้องสร้าง Multi-Stage Agentic Workflow และทีมพร้อมเรียนรู้หรือไม่?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* NO Option */}
            <button
              type="button"
              onClick={() => onChange('no')}
              className={`p-5 rounded-xl border-2 text-left transition-all duration-200 relative flex flex-col justify-between cursor-pointer ${
                value === 'no'
                  ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-lg font-bold ${value === 'no' ? 'text-blue-900' : 'text-slate-900'}`}>
                    ไม่ใช่ (No — ใช้ Microsoft M365 Copilot Easy mode Advanced license)
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    value === 'no' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {value === 'no' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ไม่จำเป็นต้องทำ Multi-Stage Agent (ตอบ &quot;ไม่ใช่&quot; ทั้ง 3 ข้อข้างต้น) หรือทีมไม่มีกำลังคนและต้องการ AI แบบพร้อมใช้งานทันที (Ready-to-use)
                </p>
              </div>

              {value === 'no' && (
                <div className="mt-3 pt-3 border-t border-blue-200/80 text-xs font-semibold text-blue-700 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>คำแนะนำตรง: Microsoft M365 Copilot Easy mode Advanced license</span>
                </div>
              )}
            </button>

            {/* YES Option */}
            <button
              type="button"
              onClick={() => onChange('yes')}
              className={`p-5 rounded-xl border-2 text-left transition-all duration-200 relative flex flex-col justify-between cursor-pointer ${
                value === 'yes'
                  ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-lg font-bold ${value === 'yes' ? 'text-purple-900' : 'text-slate-900'}`}>
                    ใช่ (Yes — ทำ Multi-Stage Agent)
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    value === 'yes' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Check className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ใช่ มีแผนทำ Sub-agent แยกตาม Knowledge Domain / อ่าน FAQ ใน Vector DB / ทำ Functional Guardrail และทีมมีบุคลากรพร้อมเรียนรู้และตั้งค่า Multi-Stage Agentic Workflows
                </p>
              </div>

              {value === 'yes' && (
                <div className="mt-3 pt-3 border-t border-purple-200/80 text-xs font-semibold text-purple-700 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>แนะนำ: Microsoft Copilot Studio หรือ Athena (เปรียบเทียบต้นทุนและสถาปัตยกรรมในขั้นตอนถัดไป)</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Warning if Sub-questions need Multi-Stage ('yes') but user manually clicked 'no' on readiness */}
        {anySubYes && value === 'no' && (
          <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-xs text-amber-950 flex items-start space-x-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <span className="font-bold text-amber-900 block">
                ⚠️ ข้อควรระวัง: ความต้องการของท่านต้องใช้ Multi-Stage Agent (Microsoft Copilot Studio หรือ Athena)
              </span>
              <p>
                ท่านระบุในคำถามย่อยด้านบนว่ามีแผนทำ Sub-agent แยกตาม Knowledge Domain, อ่าน FAQ จาก Vector DB หรือทำ Functional Guardrail ซึ่ง <strong>Microsoft M365 Copilot Easy mode Advanced license ไม่รองรับ</strong> แนะนำให้เลือก <strong>&quot;ใช่ (Yes)&quot;</strong> เพื่อพิจารณา <strong>Microsoft Copilot Studio หรือ Athena</strong> (หรือขอรับการสนับสนุนจาก Agent Doctor ในคำถามข้อที่ 4)
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Context Feedback */}
        {value === 'no' && !anySubYes && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start space-x-3">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">เงื่อนไขการประเมินทำงาน: </span>
              เนื่องจากไม่จำเป็นต้องสร้าง Multi-Stage Agentic Workflow ซับซ้อน <strong>Microsoft M365 Copilot Easy mode Advanced license</strong> จึงถูกเลือกเป็นโซลูชันที่เหมาะสมที่สุดโดยอัตโนมัติ ทั้งนี้คุณยังสามารถระบุจำนวนผู้ใช้ในคำถามที่ 3 เพื่อประเมินค่าใช้จ่ายได้!
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
