import React, { useState, useEffect, useMemo } from 'react';
import { Maximize2, Monitor, X, Laptop, AlertCircle, ArrowRight, CheckCircle2, Smartphone, Copy, Check } from 'lucide-react';

export default function ScreenSizeAlert({
  isOpen,
  onClose,
  minWidthRequired = 1280
}) {
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });
  const [dontShowAgainSession, setDontShowAgainSession] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Detect whether user is on a smartphone
  const isPhone = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const isMobileUa = /iPhone|iPod|Android.*Mobile|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
    const isSmallTouch = typeof window !== 'undefined' && window.innerWidth < 768 && ('ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));
    return isMobileUa || isSmallTouch;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setWindowDimensions({ width: w, height: h });

      // Auto close when user on laptop/desktop expands the window to or above the required threshold
      if (!isPhone && w >= minWidthRequired && isOpen) {
        onClose();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [minWidthRequired, isOpen, onClose, isPhone]);

  if (!isOpen) return null;

  const currentWidth = windowDimensions.width;
  const currentHeight = windowDimensions.height;
  const progressPercent = Math.min(100, Math.round((currentWidth / minWidthRequired) * 100));
  const isWidthSufficient = currentWidth >= minWidthRequired;

  const handleDismiss = () => {
    if (dontShowAgainSession && typeof window !== 'undefined') {
      sessionStorage.setItem('dismiss_screen_size_alert', 'true');
    }
    onClose();
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2500);
        }).catch(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2500);
        });
      } else {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="screen-alert-title"
      >
        {/* Header with decorative top bar */}
        <div className={`h-2 w-full ${isPhone ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600' : 'bg-gradient-to-r from-amber-500 via-indigo-600 to-blue-600'}`} />
        
        <div className="p-6">
          {/* Top row: Icon, Title & Close */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                isPhone 
                  ? 'bg-indigo-50 border border-indigo-200 text-indigo-600' 
                  : 'bg-amber-50 border border-amber-200 text-amber-600'
              }`}>
                {isPhone ? (
                  <Smartphone className="w-6 h-6 animate-pulse" />
                ) : (
                  <Maximize2 className="w-6 h-6 animate-pulse" />
                )}
              </div>
              <div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold mb-1 border ${
                  isPhone
                    ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                    : 'bg-amber-100 text-amber-800 border-amber-200'
                }`}>
                  {isPhone ? '📱 ตรวจพบการใช้งานบนโทรศัพท์มือถือ' : 'แนะนำการแสดงผลหน้าจอ'}
                </span>
                <h3 id="screen-alert-title" className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {isPhone 
                    ? 'แนะนำให้เปิดใช้งานบนคอมพิวเตอร์หรือแล็ปท็อป' 
                    : 'กรุณาขยายหน้าต่างเบราว์เซอร์ให้กว้างขึ้น'}
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              aria-label="ปิดกล่องแจ้งเตือน"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conditional Content: PHONE vs DESKTOP/LAPTOP */}
          {isPhone ? (
            /* PHONE-SPECIFIC CONTENT */
            <div className="mt-4 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                ระบบนี้ถูกออกแบบสำหรับการเปรียบเทียบสถาปัตยกรรมเครื่องมือ AI, กราฟค่าน้ำหนัก, ตารางคำนวณต้นทุนเชิงลึก และแถบนำทาง 9 ขั้นตอน ซึ่งจะแสดงผลได้อย่างครบถ้วนและสะดวกสบายที่สุดบนหน้าจอ <strong className="text-slate-900 font-semibold">คอมพิวเตอร์หรือแล็ปท็อป (PC / Mac / Laptop)</strong>
              </p>

              {/* Copy Link to Laptop Box */}
              <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-2">
                <div className="text-xs font-bold text-indigo-950 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Laptop className="w-4 h-4 text-indigo-600" />
                    <span>ส่งต่อลิงก์เพื่อเปิดบนแล็ปท็อป:</span>
                  </span>
                  {isCopied && (
                    <span className="text-emerald-700 font-bold flex items-center space-x-1 text-[11px] animate-in fade-in">
                      <Check className="w-3.5 h-3.5" />
                      <span>คัดลอกสำเร็จ!</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? window.location.href : ''}
                    className="flex-1 bg-white border border-indigo-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-mono select-all focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition shadow-xs cursor-pointer shrink-0 ${
                      isCopied 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  ส่งลิงก์เข้า LINE, Teams, Slack หรือ Email เพื่อเปิดบนคอมพิวเตอร์ของคุณได้ทันที
                </p>
              </div>

              <div className="text-[12px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  หากต้องการทำแบบประเมินต่อบนโทรศัพท์เครื่องนี้ คุณสามารถกดปุ่ม <strong>"ดำเนินการต่อบนมือถือ"</strong> ด้านล่าง และใช้ปุ่ม <strong>"ถัดไป / ย้อนกลับ"</strong> ในการตอบคำถามได้ตามปกติ
                </span>
              </div>
            </div>
          ) : (
            /* DESKTOP/LAPTOP SMALL WINDOW CONTENT */
            <div className="mt-4 space-y-3">
              {/* Current Resolution vs Requirement Meter */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-600 flex items-center space-x-1.5">
                    <Monitor className="w-4 h-4 text-slate-500" />
                    <span>ขนาดหน้าต่างขณะนี้:</span>
                    <strong className={`font-mono ${isWidthSufficient ? 'text-emerald-700 font-bold' : 'text-amber-700'}`}>
                      {currentWidth} × {currentHeight} px
                    </strong>
                  </span>
                  <span className="text-slate-500 font-mono">
                    เป้าหมาย: ≥ {minWidthRequired} px
                  </span>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex shadow-inner">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      isWidthSufficient 
                        ? 'bg-emerald-500' 
                        : progressPercent > 80 
                        ? 'bg-amber-500' 
                        : 'bg-indigo-600'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
                  <span>{progressPercent}% ของความกว้างที่เหมาะสม</span>
                  {isWidthSufficient ? (
                    <span className="text-emerald-600 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ความกว้างเพียงพอแล้ว!</span>
                    </span>
                  ) : (
                    <span className="text-amber-700">ขาดอีกประมาณ {Math.max(0, minWidthRequired - currentWidth)} px</span>
                  )}
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  แถบขั้นตอนการนำทางด้านบน (Stage Navigation Bar 8 ขั้นตอน) ต้องการความกว้างหน้าต่างอย่างน้อย 
                  <strong className="text-slate-900 font-semibold"> {minWidthRequired} พิกเซล</strong> เพื่อแสดงผลชื่อขั้นตอนทั้งหมดได้อย่างชัดเจน
                </p>

                <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-blue-900 space-y-2 text-xs">
                  <div className="font-bold flex items-center space-x-1.5 text-blue-950">
                    <Laptop className="w-4 h-4 text-blue-600" />
                    <span>สำหรับผู้ใช้งาน MacBook Pro (เช่น 13" / 14" ความละเอียด 1512 × 982):</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                    <li>
                      แนะนำให้คลิกปุ่ม <strong className="text-emerald-700">สีเขียว (Full Screen)</strong> มุมซ้ายบนของเบราว์เซอร์ หรือกดคีย์ลัด <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-mono shadow-2xs font-semibold">Ctrl + Cmd + F</kbd>
                    </li>
                    <li>
                      หรือขยายหน้าต่างเบราว์เซอร์ให้กว้างเกือบเต็มจอ แถบนำทางด้านบนจะปรากฏขึ้นมาโดยอัตโนมัติ
                    </li>
                    <li>
                      หรือลดระดับการซูมของเบราว์เซอร์ลงเล็กน้อยโดยกด <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-mono shadow-2xs font-semibold">Cmd -</kbd> (Zoom Out เป็น 90% หรือ 80%)
                    </li>
                  </ul>
                </div>

                <div className="text-[12px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    หากใช้งานในโหมดแบ่งหน้าจอ (Split Screen) ท่านยังสามารถทำแบบประเมินต่อได้ตามปกติ โดยใช้ปุ่ม <strong>"ถัดไป"</strong> และ <strong>"ย้อนกลับ"</strong> ที่อยู่ด้านล่าง
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Don't show again checkbox */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgainSession}
                onChange={(e) => setDontShowAgainSession(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span>ไม่ต้องเตือนซ้ำในเซสชันนี้ (Don't show again this session)</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-end gap-2">
            {isPhone ? (
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>ดำเนินการต่อบนมือถือ (Continue on Phone)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>รับทราบ และดำเนินการต่อ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
