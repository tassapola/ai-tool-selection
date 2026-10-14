import React from 'react';
import { ArrowLeft, ArrowRight, Users, Calculator, Sparkles, Check, DollarSign } from 'lucide-react';

export default function QuestionTwo({
  hUsers,
  uUsers,
  onHChange,
  onUChange,
  onBack,
  onNext,
  variables = {}
}) {
  const usdRate = Number(variables.usd_thb_rate ?? 35.0);
  const licenseMonthlyUsd = Number(variables.m365_license_monthly_usd ?? 20.0);
  const monthsPerYear = Number(variables.m365_months_per_year ?? 12.0);

  const H = Math.max(0, parseInt(hUsers, 10) || 0);
  const U = Math.max(0, parseInt(uUsers, 10) || 0);

  // Exact formula specified:
  // If U <= H, cost is 0.
  // Otherwise, cost is (U-H) users * $20 * 12 months. Convert USD to THB with 35 as USD/THB.
  const isCovered = U <= H;
  const extraUsers = Math.max(0, U - H);
  const annualCostUsd = isCovered ? 0 : extraUsers * licenseMonthlyUsd * monthsPerYear;
  const annualCostThb = isCovered ? 0 : annualCostUsd * usdRate;

  // Preset chips
  const presets = [
    { label: 'Pilot (5 users, 10 licensed)', u: 5, h: 10 },
    { label: 'Department (25 users, 5 licensed)', u: 25, h: 5 },
    { label: 'Division (80 users, 20 licensed)', u: 80, h: 20 },
    { label: 'Enterprise (250 users, 50 licensed)', u: 250, h: 50 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md max-w-3xl mx-auto">
      {/* Question Header */}
      <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white p-6 sm:p-8 border-b border-slate-100">
        <div className="flex items-center space-x-2.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            2
          </span>
          <span>Question 2 • Licensing Economics</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          Cost estimation: Microsoft solution
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          Estimate the annual additional licensing cost required to equip your team with Microsoft 365 Copilot or Copilot Studio.
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Quick Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onUChange(p.u);
                onHChange(p.h);
              }}
              className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 transition"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input 1: H Variable */}
        <div className="space-y-2 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label 
              htmlFor="h-variable-input"
              className="text-sm font-semibold text-slate-900 flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-blue-600" />
              <span>1. Number of users who already have Microsoft 365 Advanced license</span>
            </label>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-200 self-start sm:self-auto">
              Variable H
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Active licenses currently assigned or available within your Microsoft 365 tenant.
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
        <div className="space-y-2 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label 
              htmlFor="u-variable-input"
              className="text-sm font-semibold text-slate-900 flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>2. Number of users who need to use this AI agent</span>
            </label>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200 self-start sm:self-auto">
              Variable U
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Total team members or staff who need to interact with the AI assistant or workflows.
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
        <div className={`p-6 rounded-xl border-2 transition-all ${
          isCovered 
            ? 'bg-emerald-50/80 border-emerald-300' 
            : 'bg-blue-50/80 border-blue-300'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-blue-600" />
              Microsoft License Cost Calculation
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
              isCovered 
                ? 'bg-emerald-200 text-emerald-800' 
                : 'bg-blue-200 text-blue-800'
            }`}>
              {isCovered ? 'U ≤ H (0 Cost)' : `${extraUsers} Additional Licenses Needed`}
            </span>
          </div>

          {/* Detailed Formula Display */}
          <div className="text-xs text-slate-600 space-y-1 font-mono bg-white p-3 rounded-lg border border-slate-200 mb-4">
            {isCovered ? (
              <div className="text-emerald-700 font-semibold">
                Condition: U ({U}) ≤ H ({H}) → Incremental License Cost = 0 THB
              </div>
            ) : (
              <div>
                <div className="text-slate-500 text-[11px]">
                  Formula: (U - H) users × ${licenseMonthlyUsd}/month × {monthsPerYear} months × {usdRate} THB/USD
                </div>
                <div className="text-blue-900 font-semibold pt-1">
                  = ({U} - {H}) × ${licenseMonthlyUsd} × {monthsPerYear} × ฿{usdRate}
                </div>
                <div className="text-slate-700 text-[11px] pt-0.5">
                  = {extraUsers} extra licenses × ${extraUsers * licenseMonthlyUsd * monthsPerYear} USD × ฿{usdRate}
                </div>
              </div>
            )}
          </div>

          {/* Total Display in Thai Baht with explicit annual mention */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pt-2 border-t border-slate-200">
            <span className="text-sm font-semibold text-slate-700">
              Calculated Microsoft Cost:
            </span>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {annualCostThb === 0 ? '฿0' : `฿${annualCostThb.toLocaleString()}`}
                <span className="text-sm font-normal text-slate-600 ml-1.5">Thai Baht (THB)</span>
              </div>
              {/* Explicit requirement: Mention this cost is for per year */}
              <div className="text-xs font-bold text-blue-700 mt-1 uppercase tracking-wider">
                📌 Mention: This cost is for per year.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Question 1 (Advanced Builder Readiness)</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
          >
            <span>Continue to Question 3 (Cost estimation: Athena)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
