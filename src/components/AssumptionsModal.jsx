import React from 'react';
import { X, ExternalLink, HelpCircle, ShieldAlert, CheckCircle2, Info, Users, Sparkles } from 'lucide-react';

export default function AssumptionsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleOpenNativeWindow = () => {
    const popupHtml = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <title>สมมุติฐานเพิ่มเติม - AI Tool Selection Advisor</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "TH Sarabun New", sans-serif;
            margin: 0;
            padding: 24px;
            background-color: #f8fafc;
            color: #0f172a;
            line-height: 1.6;
          }
          .card {
            background: #ffffff;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            padding: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
          }
          .badge {
            display: inline-block;
            background: #fef3c7;
            color: #92400e;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 12px;
          }
          h1 {
            font-size: 18px;
            margin: 0 0 16px 0;
            color: #1e293b;
          }
          .highlight {
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-size: 14px;
            font-weight: 600;
            color: #78350f;
          }
          .details {
            font-size: 13px;
            color: #334155;
          }
          ul {
            padding-left: 20px;
          }
          li {
            margin-bottom: 8px;
          }
          button {
            margin-top: 16px;
            background: #0f172a;
            color: #fff;
            border: none;
            padding: 10px 18px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">สมมุติฐานเพิ่มเติม (System Assumptions)</div>
          <h1>ข้อกำหนดและสมมุติฐานการประเมิน</h1>
          <div class="highlight">
            • เวอร์ชันนี้ ไม่ได้นำจำนวนผู้ใช้ที่แชร์เกิน 50 คนหรือไม่ มาเป็นเงื่อนไข (สัมพันธ์กับความสามารถในการดูแล UAM ในทางปฏิบัติ)
          </div>
          <div class="details">
            <p><strong>คำอธิบายบริบท:</strong></p>
            <ul>
              <li><strong>การกำกับดูแล UAM ในทางปฏิบัติ:</strong> เมื่อระบบ Agent มีการแชร์ให้ผู้ใช้งานตั้งแต่ 50 คนขึ้นไป ภาระงานด้านการตรวจสอบสิทธิ์ (Access Review) และการโอนย้ายสิทธิ์ความเป็นเจ้าของ Agent จะเพิ่มขึ้นอย่างมาก</li>
              <li><strong>เกณฑ์ในเวอร์ชันปัจจุบัน:</strong> ระบบยังไม่ได้กำหนดตัวเลข 50 คนเป็นเงื่อนไขบังคับตัดสิทธิ์ (Hard Override) โดยตรง แต่เปิดให้ผู้ประเมินตัดสินใจผ่าน<strong>คำถามข้อที่ 7 (ความพร้อมในการกำกับดูแลสิทธิ์ UAM)</strong></li>
              <li><strong>ข้อแนะนำ:</strong> หากมีผู้ใช้เกิน 50 คน และไม่มีทีมคอยดูแล UAM ประจำ แนะนำให้พิจารณาเลือก <strong>Athena Platform</strong> ที่มีระบบ UAM รวมศูนย์ขององค์กร</li>
            </ul>
          </div>
          <button onclick="window.close()">ปิดหน้าต่างนี้</button>
        </div>
      </body>
      </html>
    `;
    const popupWindow = window.open('', 'AssumptionsPopup', 'width=650,height=520,resizable=yes,scrollbars=yes');
    if (popupWindow) {
      popupWindow.document.open();
      popupWindow.document.write(popupHtml);
      popupWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Window Popup Shell */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-300 flex flex-col animate-scaleUp">
        {/* OS Window Style Title Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between select-none">
          <div className="flex items-center space-x-2.5">
            {/* macOS/Window-style window control dots */}
            <div className="flex items-center space-x-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            </div>
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-amber-400" />
              <span className="text-xs sm:text-sm font-bold tracking-tight">
                สมมุติฐานเพิ่มเติมของระบบ (System Assumptions Window)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={handleOpenNativeWindow}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="เปิดในหน้าต่างเบราว์เซอร์แยก (Open in new browser popup window)"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="ปิดหน้าต่าง (Close)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Primary Assumption Callout */}
          <div className="p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-300 text-amber-950 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm uppercase tracking-wide">
              <Users className="w-4 h-4 text-amber-600 shrink-0" />
              <span>สมมุติฐานหลักด้านขนาดผู้ใช้งานและการกำกับดูแล UAM</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-amber-950 leading-relaxed pl-1">
              • เวอร์ชันนี้ ไม่ได้นำจำนวนผู้ใช้ที่แชร์เกิน 50 คนหรือไม่ มาเป็นเงื่อนไข (สัมพันธ์กับความสามารถในการดูแล UAM ในทางปฏิบัติ)
            </p>
          </div>

          {/* Context & Rationale Breakdown */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                1. ความสัมพันธ์กับความสามารถในการดูแล UAM ในทางปฏิบัติ:
              </span>
              <p>
                ในระบบการทำงานจริง เมื่อมีจำนวนผู้ใช้งานร่วมกันหรือแชร์การใช้งาน Agent <strong>เกินกว่า 50 คนขึ้นไป</strong> ภาระงานในการบริหารจัดการสิทธิ์ (User Access Management: UAM) จะเพิ่มขึ้นอย่างมีนัยสำคัญ ไม่ว่าจะเป็น:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>การตรวจสอบความถูกต้องของสิทธิ์การเข้าถึงข้อมูลตามรอบระยะเวลา (Access Review)</li>
                <li>การโอนย้ายความเป็นเจ้าของ Agent (Ownership Transfer) เมื่อผู้พัฒนาโยกย้ายตำแหน่งหรือลาออก</li>
                <li>การควบคุมไม่ให้ Agent เข้าถึงข้อมูลความลับหรือส่งต่อข้อมูลข้ามฝ่ายงานโดยไม่ได้รับอนุญาต</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                2. ขอบเขตเงื่อนไขในเวอร์ชันปัจจุบัน:
              </span>
              <p>
                ในระบบประเมินเวอร์ชันปัจจุบัน <strong>ยังไม่ได้นำเกณฑ์ตัวเลขผู้ใช้ 50 คน มาเป็นเงื่อนไขบังคับตัดสิทธิ์ (Hard Override) แบบตายตัว</strong> แต่เปิดให้ผู้ใช้งานประเมินผ่าน <strong>คำถามข้อที่ 7 (ความพร้อมด้านบุคลากร กระบวนการ และเวลาในการกำกับดูแล UAM)</strong> ซึ่งหากทีมประเมินว่าไม่พร้อมดูแลสิทธิ์ด้วยตนเอง ระบบจะช่วยแนะนำโซลูชันที่มีระบบ UAM รวมศูนย์ขององค์กร (Athena) ให้โดยอัตโนมัติ
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 space-y-1 text-xs">
              <span className="font-bold flex items-center gap-1.5 text-blue-900">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>คำแนะนำเชิงสถาปัตยกรรมสำหรับโครงการ:</span>
              </span>
              <p>
                หากโครงการของคุณมีแนวโน้มจะมีผู้ใช้งานที่ต้องแชร์สิทธิ์มากกว่า 50 คนขึ้นไป และไม่มีบุคลากรดูแล UAM กระจายศูนย์โดยตรง แนะนำให้ปรึกษาทีม Enterprise Architecture และพิจารณาใช้งาน <strong>Athena Platform</strong> ที่มีการกำกับดูแลสิทธิ์รวมศูนย์ในระดับองค์กร
              </p>
            </div>
          </div>
        </div>

        {/* Window Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleOpenNativeWindow}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>เปิดเป็นหน้าต่างเบราว์เซอร์แยก (Pop-out Window)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-xs cursor-pointer"
          >
            รับทราบและปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
