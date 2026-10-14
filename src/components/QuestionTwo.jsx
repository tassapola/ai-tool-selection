import React from 'react';
import { ArrowLeft, ArrowRight, DollarSign, Users, ShieldCheck, Calculator, Sparkles, Building2, HelpCircle, Layers, Check } from 'lucide-react';

export default function QuestionTwo({
  hUsers,
  uUsers,
  onHChange,
  onUChange,
  onBack,
  onComplete,
  variables = {}
}) {
  const usdRate = Number(variables.usd_thb_rate ?? 35.0);
  const licenseMonthlyUsd = Number(variables.m365_license_monthly_usd ?? 20.0);
  const monthsPerYear = Number(variables.m365_months_per_year ?? 12.0);

  const H = Math.max(0, parseInt(hUsers, 10) || 0);
  const U = Math.max(0, parseInt(uUsers, 10) || 0);

  // Exact formula specified by user:
  // If U <= H, cost is 0.
  // Otherwise, cost is (U - H) users * $20 * 12 months. Convert USD to THB with 35 as USD/THB.
  const isCovered = U <= H;
  const extraUsers = Math.max(0, U - H);
  const annualCostUsd = isCovered ? 0 : extraUsers * licenseMonthlyUsd * monthsPerYear;
  const annualCostThb = isCovered ? 0 : annualCostUsd * usdRate;

  // Preset quick chips for easy testing
  const presets = [
    { label: 'Pilot (5 users, 10 licensed)', u: 5, h: 10 },
    { label: 'Department (25 users, 5 licensed)', u: 25, h: 5 },
    { label: 'Division (80 users, 20 licensed)', u: 80, h: 20 },
    { label: 'Enterprise (250 users, 50 licensed)', u: 250, h: 50 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Question Header */}
      <div className="bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-white p-6 sm:p-8 border-b border-slate-100">
        <div className="flex items-center space-x-2.5 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
            2
          </span>
          <span>Question 2 of 2 • Cost Estimation & Scale</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          Cost Estimation & License Assessment
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Calculate the annual incremental licensing expense for Microsoft 365 AI agents and compare with internal system capabilities.
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Quick Scenarios:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onUChange(p.u);
                onHChange(p.h);
              }}
              className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 transition"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* 2-Column Layout: Left = Microsoft Form, Right = Comparison Details & Future Questions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT-HANDED SIDE: MICROSOFT ================= */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                <h3 className="text-base font-bold text-slate-900">
                  Microsoft Cost Estimation
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-0.5 rounded">
                Left-Hand Side Form
              </span>
            </div>

            {/* Input 1: H Variable */}
            <div className="space-y-2 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="h-variable-input"
                  className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5"
                >
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>1. Number of users who already have Microsoft 365 Advanced license</span>
                </label>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                  Variable H
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Existing active licenses available within your organization.
              </p>
              <div className="relative mt-2">
                <input
                  id="h-variable-input"
                  type="number"
                  min="0"
                  step="1"
                  value={hUsers === '' ? '' : hUsers}
                  onChange={(e) => onHChange(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10) || 0))}
                  placeholder="e.g. 10"
                  className="w-full pl-4 pr-16 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-semibold text-base bg-white shadow-2xs"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                  users (H)
                </span>
              </div>
            </div>

            {/* Input 2: U Variable */}
            <div className="space-y-2 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="u-variable-input"
                  className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5"
                >
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>2. Number of users who need to use this AI agent</span>
                </label>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Variable U
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Target user cohort who will invoke or access the agent workflows.
              </p>
              <div className="relative mt-2">
                <input
                  id="u-variable-input"
                  type="number"
                  min="0"
                  step="1"
                  value={uUsers === '' ? '' : uUsers}
                  onChange={(e) => onUChange(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10) || 0))}
                  placeholder="e.g. 25"
                  className="w-full pl-4 pr-16 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-semibold text-base bg-white shadow-2xs"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                  users (U)
                </span>
              </div>
            </div>

            {/* Calculation Result Card */}
            <div className={`p-5 rounded-xl border-2 transition-all ${
              isCovered 
                ? 'bg-emerald-50/70 border-emerald-300' 
                : 'bg-indigo-50/70 border-indigo-300'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-indigo-600" />
                  Cost Calculation
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  isCovered 
                    ? 'bg-emerald-200 text-emerald-800' 
                    : 'bg-indigo-200 text-indigo-800'
                }`}>
                  {isCovered ? 'U ≤ H (0 Cost)' : `${extraUsers} Additional Licenses Needed`}
                </span>
              </div>

              {/* Formula Breakdown */}
              <div className="text-xs text-slate-600 space-y-1 font-mono bg-white/80 p-3 rounded-lg border border-slate-200/80 mb-3">
                {isCovered ? (
                  <div className="text-emerald-700 font-semibold">
                    Condition: U ({U}) ≤ H ({H}) → Incremental License Cost = 0
                  </div>
                ) : (
                  <div>
                    <div>Formula: (U - H) users × ${licenseMonthlyUsd}/mo × {monthsPerYear} months × {usdRate} THB/USD</div>
                    <div className="text-indigo-800 font-semibold pt-1">
                      = ({U} - {H}) × ${licenseMonthlyUsd} × {monthsPerYear} × ฿{usdRate}
                    </div>
                    <div className="text-slate-500 text-[11px] font-sans pt-0.5">
                      = {extraUsers} users × ${extraUsers * licenseMonthlyUsd * monthsPerYear} USD × ฿{usdRate}
                    </div>
                  </div>
                )}
              </div>

              {/* Total Display in Thai Baht */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pt-2 border-t border-slate-200/70">
                <span className="text-xs sm:text-sm font-semibold text-slate-700">
                  Calculated Cost:
                </span>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {annualCostThb === 0 ? '฿0' : `฿${annualCostThb.toLocaleString()}`}
                    <span className="text-xs sm:text-sm font-normal text-slate-600 ml-1.5">Thai Baht (THB)</span>
                  </div>
                  {/* Explicit user requirement: Mention this cost is for per year */}
                  <div className="text-xs font-bold text-indigo-700 mt-0.5 uppercase tracking-wide">
                    ⚠️ Mention: This cost is for per year.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT-HANDED SIDE: COMPARISON DETAILS & FUTURE QUESTIONS ================= */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                <h3 className="text-base font-bold text-slate-900">
                  Comparison Details & Athena
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-0.5 rounded">
                Right-Hand Side
              </span>
            </div>

            {/* Athena Value Card */}
            <div className="p-5 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    A
                  </div>
                  <span className="font-bold text-slate-900 text-sm">Athena (Internal System)</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  Zero Per-User Seat Tax
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Athena is an internal enterprise platform. Unlike Microsoft 365 add-ons, Athena does not incur recurring per-user license fees (${licenseMonthlyUsd}/user/mo).
              </p>

              <div className="bg-white p-3 rounded-lg border border-emerald-100 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Target Users (U):</span>
                  <span className="font-bold text-slate-900">{U} users</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Microsoft Seat Cost:</span>
                  <span className="font-bold text-red-600">฿{annualCostThb.toLocaleString()} / year</span>
                </div>
                <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-100">
                  <span>Athena Seat Fee:</span>
                  <span className="font-bold text-emerald-700">฿0 / user seat</span>
                </div>
              </div>

              {!isCovered && annualCostThb > 0 && (
                <div className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 p-2.5 rounded-lg flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Potential annual license savings with Athena: ฿{annualCostThb.toLocaleString()} / year!</span>
                </div>
              )}
            </div>

            {/* Future Questions & Scoring Slot (As requested) */}
            <div className="p-5 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-700">
                  <Layers className="w-4 h-4 text-slate-500" />
                  <span className="font-bold text-xs uppercase tracking-wider">
                    Future Question / Criteria Slot
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                  Extensible DB
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                This space is reserved for organizational questions (e.g. data sovereignty, ERP connector requirements, latency constraints) which can be added dynamically to the SQLite database.
              </p>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">Dynamic DB Variables in Effect:</div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Exchange Rate (USD/THB):</span>
                  <span className="font-mono font-medium text-slate-700">฿{usdRate}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>M365 Add-on Fee:</span>
                  <span className="font-mono font-medium text-slate-700">${licenseMonthlyUsd}/mo</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Months Per Year:</span>
                  <span className="font-mono font-medium text-slate-700">{monthsPerYear} months</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Question 1</span>
          </button>

          <button
            type="button"
            onClick={onComplete}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
          >
            <span>View Full Recommendation & Comparison</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
