import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronDown, ChevronUp, Bot, Workflow, Cpu, AlertCircle, HelpCircle } from 'lucide-react';

export default function RecommendationPanel({
  evaluation,
  onNavigateToSummary,
  currentStep
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    scores = { m365_copilot: 34, copilot_studio: 33, athena: 33 },
    recommendedToolId,
    recommendedTool,
    annualCostThb = 0,
    H = 0,
    U = 0,
    reasoning = [],
    isDecisive
  } = evaluation;

  // Icon mapping for tools
  const getToolIcon = (id) => {
    switch (id) {
      case 'm365_copilot':
        return <Bot className="w-5 h-5 text-blue-600" />;
      case 'copilot_studio':
        return <Workflow className="w-5 h-5 text-purple-600" />;
      case 'athena':
        return <Cpu className="w-5 h-5 text-emerald-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getToolTheme = (id) => {
    switch (id) {
      case 'm365_copilot':
        return {
          pillBg: 'bg-blue-100 text-blue-800 border-blue-200',
          badgeBg: 'bg-blue-600 text-white',
          accentBorder: 'border-l-4 border-blue-600',
          gradient: 'from-blue-500/10 to-indigo-500/5'
        };
      case 'copilot_studio':
        return {
          pillBg: 'bg-purple-100 text-purple-800 border-purple-200',
          badgeBg: 'bg-purple-600 text-white',
          accentBorder: 'border-l-4 border-purple-600',
          gradient: 'from-purple-500/10 to-indigo-500/5'
        };
      case 'athena':
        return {
          pillBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          badgeBg: 'bg-emerald-600 text-white',
          accentBorder: 'border-l-4 border-emerald-600',
          gradient: 'from-emerald-500/10 to-teal-500/5'
        };
      default:
        return {
          pillBg: 'bg-slate-100 text-slate-800 border-slate-200',
          badgeBg: 'bg-slate-700 text-white',
          accentBorder: 'border-l-4 border-slate-400',
          gradient: 'from-slate-500/5 to-slate-500/5'
        };
    }
  };

  const currentTheme = getToolTheme(recommendedToolId);

  return (
    <section 
      aria-label="Tool Recommendation" 
      className="sticky top-16 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Top Header Row of the Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Live Recommendation
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Tool Recommendation:</span>
              {isDecisive && recommendedTool ? (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-semibold border ${currentTheme.pillBg}`}>
                  {getToolIcon(recommendedToolId)}
                  <span>{recommendedTool.name}</span>
                  <span className="text-[11px] opacity-80 font-normal">({recommendedTool.mode_name})</span>
                </span>
              ) : (
                <span className="text-slate-400 font-normal italic text-xs sm:text-sm">
                  (Awaiting answers to questions below)
                </span>
              )}
            </h2>
          </div>

          {/* Quick Metrics & Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
            <div className="hidden sm:flex items-center space-x-1.5 bg-blue-50/80 border border-blue-200 px-2.5 py-1 rounded-md">
              <span className="text-blue-700 font-medium">M365:</span>
              <span className="font-bold text-slate-900">
                {annualCostThb === 0 ? '฿0/yr' : `฿${annualCostThb.toLocaleString()}/yr`}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 bg-emerald-50/80 border border-emerald-200 px-2.5 py-1 rounded-md">
              <span className="text-emerald-700 font-medium">Athena:</span>
              <span className="font-bold text-emerald-900">
                {(evaluation.athenaTotalCostThb || 0) === 0 ? '฿0' : `฿${(evaluation.athenaTotalCostThb || 0).toLocaleString()}`}
              </span>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center space-x-1 text-slate-600 hover:text-slate-900 font-medium px-2 py-1 rounded hover:bg-slate-100 transition"
              aria-label="Toggle recommendation rationale"
            >
              <span>{isExpanded ? 'Hide' : 'Details'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* The Bar which spans left to right */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex shadow-inner border border-slate-200/80">
            {/* Microsoft 365 Copilot Segment (Blue) */}
            <div
              style={{ width: `${scores.m365_copilot}%` }}
              className={`h-full transition-all duration-500 ease-out flex items-center justify-center ${
                recommendedToolId === 'm365_copilot'
                  ? 'bg-blue-600'
                  : 'bg-blue-400/80'
              }`}
              title={`Microsoft 365 Copilot: ${scores.m365_copilot}%`}
            />

            {/* Copilot Studio Segment (Purple) */}
            <div
              style={{ width: `${scores.copilot_studio}%` }}
              className={`h-full transition-all duration-500 ease-out flex items-center justify-center ${
                recommendedToolId === 'copilot_studio'
                  ? 'bg-purple-600'
                  : 'bg-purple-400/80'
              }`}
              title={`Copilot Studio: ${scores.copilot_studio}%`}
            />

            {/* Athena Segment (Emerald) */}
            <div
              style={{ width: `${scores.athena}%` }}
              className={`h-full transition-all duration-500 ease-out flex items-center justify-center ${
                recommendedToolId === 'athena'
                  ? 'bg-emerald-600'
                  : 'bg-emerald-400/80'
              }`}
              title={`Athena: ${scores.athena}%`}
            />
          </div>

          {/* Bar Legend / Distribution labels */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-600 font-medium px-1">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
              <span className={recommendedToolId === 'm365_copilot' ? 'font-bold text-blue-900' : ''}>
                M365 Copilot (Easy): <span className="font-semibold">{scores.m365_copilot}%</span>
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"></span>
              <span className={recommendedToolId === 'copilot_studio' ? 'font-bold text-purple-900' : ''}>
                Copilot Studio: <span className="font-semibold">{scores.copilot_studio}%</span>
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
              <span className={recommendedToolId === 'athena' ? 'font-bold text-emerald-900' : ''}>
                Athena (Internal): <span className="font-semibold">{scores.athena}%</span>
              </span>
            </div>
          </div>
        </div>

        {/* Expandable Rationale Drawer */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 animate-fadeIn">
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Decision Rationale
              </h3>
              <ul className="space-y-1.5">
                {reasoning.map((r, i) => (
                  <li key={i} className="flex items-start space-x-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="font-semibold text-slate-800 flex items-center justify-between">
                <span>Cost Comparison</span>
                <span className="text-[10px] text-slate-500 font-normal">Annual / Operational</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>M365 License Cost:</span>
                <span className="font-bold text-blue-700">
                  {annualCostThb === 0 ? '฿0 / yr' : `฿${annualCostThb.toLocaleString()} / yr`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Athena Run Cost:</span>
                <span className="font-bold text-emerald-700">
                  ฿{(evaluation.athenaTotalCostThb || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 text-[10px] pt-1 border-t border-slate-200">
                <span>Model Base:</span>
                <span className="font-medium text-slate-700">Gemini 3.1 Flash Lite</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
