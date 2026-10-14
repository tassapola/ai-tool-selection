import React from 'react';
import { Database, Sparkles, RefreshCw, SlidersHorizontal, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Navbar({
  currentStep,
  onSelectStep,
  onOpenDatabase,
  onReset,
  usdRate,
  licenseMonthlyUsd,
  isDbReady
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-100 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                  AI Tool Selection Advisor
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                  M365 vs Studio vs Athena
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Dynamic scoring & cost optimization powered by in-browser SQLite
              </p>
            </div>
          </div>

          {/* Step Wizard Breadcrumbs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => onSelectStep(1)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
                currentStep === 1
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">1</span>
              <span>Agentic Readiness</span>
            </button>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <button
              onClick={() => onSelectStep(2)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
                currentStep === 2
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">2</span>
              <span>Cost Estimation</span>
            </button>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <button
              onClick={() => onSelectStep(3)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
                currentStep === 3
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">3</span>
              <span>Full Comparison</span>
            </button>
          </nav>

          {/* Right Action Buttons & Database Status */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Database Variables Pill */}
            <div className="hidden sm:flex items-center space-x-1 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium text-slate-700">Rate:</span>
              <span>฿{usdRate}/$</span>
              <span className="text-slate-300">|</span>
              <span>${licenseMonthlyUsd}/mo</span>
            </div>

            {/* SQLite Database Button */}
            <button
              type="button"
              onClick={onOpenDatabase}
              className="relative inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition shadow-sm"
              title="Open SQLite Database & Variables Manager"
            >
              <Database className="w-3.5 h-3.5 text-indigo-300" />
              <span>Database & Variables</span>
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
