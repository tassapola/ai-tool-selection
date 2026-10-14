import React from 'react';
import { ArrowLeft, CheckCircle2, Bot, Workflow, Cpu, Printer, Sparkles, AlertCircle, ExternalLink, HelpCircle, FileText, Check, X } from 'lucide-react';

export default function SummaryView({
  evaluation,
  q1AgenticWorkflow,
  hUsers,
  uUsers,
  tools = [],
  variables = {},
  onBackToQ1,
  onBackToQ2,
  onOpenDatabase
}) {
  const {
    scores = {},
    recommendedToolId,
    recommendedTool,
    annualCostThb = 0,
    annualCostUsd = 0,
    additionalLicensesNeeded = 0,
    H = 0,
    U = 0,
    reasoning = []
  } = evaluation;

  const getToolIcon = (id) => {
    switch (id) {
      case 'm365_copilot':
        return <Bot className="w-6 h-6 text-blue-600" />;
      case 'copilot_studio':
        return <Workflow className="w-6 h-6 text-purple-600" />;
      case 'athena':
        return <Cpu className="w-6 h-6 text-emerald-600" />;
      default:
        return <Sparkles className="w-6 h-6 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner: Primary Recommended Tool */}
      {recommendedTool && (
        <div className={`rounded-2xl border-2 p-6 sm:p-8 shadow-sm transition-all ${
          recommendedToolId === 'm365_copilot'
            ? 'bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-white border-blue-300'
            : recommendedToolId === 'copilot_studio'
            ? 'bg-gradient-to-r from-purple-50/90 via-indigo-50/40 to-white border-purple-300'
            : 'bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-white border-emerald-300'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded bg-white shadow-2xs border border-slate-200 text-slate-800">
                  Optimal Match Selected
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  {scores[recommendedToolId]}% Match Score
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-200">
                  {getToolIcon(recommendedToolId)}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {recommendedTool.name}
                  </h1>
                  <p className="text-sm font-semibold text-indigo-600">
                    {recommendedTool.mode_name} • {recommendedTool.badge}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 max-w-2xl mt-1">
                {recommendedTool.description}
              </p>
            </div>

            {/* Cost Snapshot Pill */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-right shrink-0">
              <span className="text-xs font-medium text-slate-500 block">
                Estimated Microsoft License Cost
              </span>
              <span className="text-2xl font-black text-slate-900">
                {annualCostThb === 0 ? '฿0' : `฿${annualCostThb.toLocaleString()}`}
              </span>
              <span className="text-xs font-bold text-indigo-600 block uppercase">
                Per Year ({additionalLicensesNeeded} extra seats)
              </span>
            </div>
          </div>

          {/* Rationale Bullet Points */}
          <div className="mt-6 pt-5 border-t border-slate-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Why this tool is chosen:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {reasoning.map((r, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700 bg-white/70 p-2.5 rounded-lg border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3-Tool Side-by-Side Comparison Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Comprehensive 3-Way Tool Comparison
            </h2>
            <p className="text-xs text-slate-500">
              Evaluated against team agentic skills, licensing economics, and enterprise architecture.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Card 1: Microsoft 365 Copilot (Easy Mode) */}
          <div className={`p-6 space-y-4 ${recommendedToolId === 'm365_copilot' ? 'bg-blue-50/30' : ''}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded">
                Easy Mode
              </span>
              <span className="text-sm font-black text-blue-900">{scores.m365_copilot}% Score</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Microsoft 365 Copilot</h3>
              <p className="text-xs text-slate-500 mt-1">
                Turnkey Office 365 assistant with zero learning curve.
              </p>
            </div>
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Workflow Designer:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <X className="w-3.5 h-3.5 text-slate-400" /> Not Required
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">License Fee:</span>
                <span className="font-semibold text-slate-800">${variables.m365_license_monthly_usd || 20}/mo/seat</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Annual Est. Cost:</span>
                <span className="font-bold text-slate-900">฿{annualCostThb.toLocaleString()} / yr</span>
              </div>
            </div>
            <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Best For:</span>
              <span>General productivity, document drafting, summarization in Teams/Word without multi-step chaining.</span>
            </div>
          </div>

          {/* Card 2: Microsoft 365 Copilot Studio */}
          <div className={`p-6 space-y-4 ${recommendedToolId === 'copilot_studio' ? 'bg-purple-50/30' : ''}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded">
                Multi-Step Workflow
              </span>
              <span className="text-sm font-black text-purple-900">{scores.copilot_studio}% Score</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Copilot Studio</h3>
              <p className="text-xs text-slate-500 mt-1">
                Visual low-code designer for multi-stage agentic automation.
              </p>
            </div>
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Workflow Designer:</span>
                <span className="font-semibold text-purple-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-purple-600" /> Required
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">License Fee:</span>
                <span className="font-semibold text-slate-800">${variables.m365_license_monthly_usd || 20}/mo/seat</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Annual Est. Cost:</span>
                <span className="font-bold text-slate-900">฿{annualCostThb.toLocaleString()} / yr</span>
              </div>
            </div>
            <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Best For:</span>
              <span>Custom multi-stage triggers, CRM/ERP connectors, prompt chaining where existing M365 licenses cover seats.</span>
            </div>
          </div>

          {/* Card 3: Athena */}
          <div className={`p-6 space-y-4 ${recommendedToolId === 'athena' ? 'bg-emerald-50/30' : ''}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded">
                Internal System
              </span>
              <span className="text-sm font-black text-emerald-900">{scores.athena}% Score</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Athena Platform</h3>
              <p className="text-xs text-slate-500 mt-1">
                Internal enterprise agent platform with zero per-user seat tax.
              </p>
            </div>
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Workflow Designer:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Custom / Code
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">License Fee:</span>
                <span className="font-semibold text-emerald-700">฿0 / user seat</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Annual Seat Tax:</span>
                <span className="font-bold text-emerald-600">฿0 (Save ฿{annualCostThb.toLocaleString()})</span>
              </div>
            </div>
            <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Best For:</span>
              <span>Large user counts (50+ users), proprietary data security, tailored LLM routing, avoiding recurring Microsoft license overhead.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Your Evaluation Inputs Review */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase text-slate-700 tracking-wider">
            Evaluation Inputs Recorded
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onBackToQ1}
              className="text-xs text-indigo-600 hover:underline font-medium"
            >
              Edit Question 1
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={onBackToQ2}
              className="text-xs text-indigo-600 hover:underline font-medium"
            >
              Edit Question 2
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Q1 Agentic Learner Available:</span>
            <span className="font-bold text-slate-900 capitalize text-sm">
              {q1AgenticWorkflow === 'yes' ? 'Yes (Workflow Capable)' : 'No (Requires Easy Mode)'}
            </span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Variable H (Existing Licenses):</span>
            <span className="font-bold text-slate-900 text-sm">{H} licenses</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Variable U (Users Needed):</span>
            <span className="font-bold text-slate-900 text-sm">{U} users</span>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBackToQ2}
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cost Estimation (Q2)</span>
        </button>

        <button
          type="button"
          onClick={onOpenDatabase}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition"
        >
          <Sparkles className="w-4 h-4 text-indigo-300" />
          <span>Tweak Variables in SQLite Database</span>
        </button>
      </div>
    </div>
  );
}
