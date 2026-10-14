import React from 'react';
import { Database, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';

export default function Navbar({
  currentStep,
  onSelectStep,
  onOpenDatabase,
  onReset,
  usdRate,
  licenseMonthlyUsd,
  isDbReady
}) {
  const steps = [
    { num: 1, label: 'Readiness' },
    { num: 2, label: 'Cost: M365' },
    { num: 3, label: 'Cost: Athena' },
    { num: 4, label: 'KBank Systems' },
    { num: 5, label: 'UAM Governance' },
    { num: 6, label: 'Model Roadmap' },
    { num: 7, label: 'Summary' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-100 text-white shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">
                  AI Tool Selection Advisor
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  M365 vs Studio vs Athena
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                60% Cost • 40% Features weighted scoring powered by in-browser SQLite
              </p>
            </div>
          </div>

          {/* Step Selector Pills */}
          <div className="hidden xl:flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
            {steps.map((s, idx) => (
              <React.Fragment key={s.num}>
                <button
                  onClick={() => onSelectStep(s.num)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center space-x-1.5 ${
                    currentStep === s.num
                      ? 'bg-white text-indigo-600 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    currentStep === s.num ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {s.num}
                  </span>
                  <span>{s.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <span className="text-slate-300 text-[10px]">•</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Right Action Buttons & Database Status */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Database Variables Pill */}
            <div className="hidden sm:flex items-center space-x-1 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium text-slate-700">60% Cost / 40% Feat</span>
              <span className="text-slate-300">|</span>
              <span>฿{usdRate}/$</span>
            </div>

            {/* SQLite Database Button */}
            <button
              type="button"
              onClick={onOpenDatabase}
              className="relative inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition shadow-sm"
              title="Open SQLite Database & Variables Manager"
            >
              <Database className="w-3.5 h-3.5 text-indigo-300" />
              <span className="hidden sm:inline">Database & Weights</span>
              <span className="sm:hidden">DB</span>
              {isDbReady && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              )}
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={onReset}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title="Reset Assessment"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
