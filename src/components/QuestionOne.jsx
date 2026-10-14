import React, { useState } from 'react';
import { Check, X, ZoomIn, ExternalLink, ArrowRight, Info, Sparkles, AlertCircle } from 'lucide-react';

export default function QuestionOne({
  value, // 'yes' | 'no' | null
  onChange,
  onNext
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const imageUrl = "https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/media/flow-designer/workflow-designer.png";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Question Header Banner */}
      <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white p-6 sm:p-8 border-b border-slate-100">
        <div className="flex items-center space-x-2.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            1
          </span>
          <span>Question 1 of 2 • Agentic Workflow Readiness</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          Would your team have a person to learn multi-stage agentic workflow?
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Multi-stage agentic workflows require someone on your team to design visual decision trees, configure system prompts, chain API triggers, and manage condition branches.
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Visual Reference Section (The requested image) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-200">
                Visual Reference
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">
                Microsoft Copilot Studio Workflow Designer Interface
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                className="inline-flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-800 bg-white px-2.5 py-1 rounded border border-indigo-200 shadow-2xs transition"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Zoom Image</span>
              </button>
              <a
                href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/workflow-designer"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs transition"
                title="View Microsoft Learn documentation"
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
                <span>Click to expand workflow designer</span>
              </span>
            </div>
          </div>

          <p className="mt-2 text-xs text-slate-500 italic text-center">
            Pictured: The multi-step visual canvas used to orchestrate triggers, conditional paths, generative responses, and tool calls.
          </p>
        </div>

        {/* Answer Selection: Yes or No */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            Select Your Team's Readiness
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* NO Option */}
            <button
              type="button"
              onClick={() => onChange('no')}
              className={`p-5 rounded-xl border-2 text-left transition-all duration-200 relative flex flex-col justify-between ${
                value === 'no'
                  ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-lg font-bold ${value === 'no' ? 'text-blue-900' : 'text-slate-900'}`}>
                    No
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    value === 'no' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {value === 'no' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We want ready-to-use AI. Our team does not have the capacity, developer bandwidth, or desire to learn node-based workflow authoring.
                </p>
              </div>

              {value === 'no' && (
                <div className="mt-3 pt-3 border-t border-blue-200/80 text-xs font-semibold text-blue-700 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Direct recommendation: Microsoft 365 Copilot (Easy Mode)</span>
                </div>
              )}
            </button>

            {/* YES Option */}
            <button
              type="button"
              onClick={() => onChange('yes')}
              className={`p-5 rounded-xl border-2 text-left transition-all duration-200 relative flex flex-col justify-between ${
                value === 'yes'
                  ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-lg font-bold ${value === 'yes' ? 'text-purple-900' : 'text-slate-900'}`}>
                    Yes
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    value === 'yes' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Check className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Yes, we have at least one team member, business analyst, or developer willing to learn and configure multi-stage agentic workflows.
                </p>
              </div>

              {value === 'yes' && (
                <div className="mt-3 pt-3 border-t border-purple-200/80 text-xs font-semibold text-purple-700 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Unlocks Copilot Studio & Athena based on user volume and licensing cost</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Context Feedback */}
        {value === 'no' && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start space-x-3">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Scoring Rule Triggered: </span>
              Since no one will maintain multi-step workflows, <strong>Microsoft 365 Copilot (easy mode)</strong> is automatically chosen as your optimal solution. You can still input user numbers in Question 2 to estimate licensing costs!
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            {value ? (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Answer recorded
              </span>
            ) : (
              'Please choose Yes or No to proceed'
            )}
          </div>

          <button
            type="button"
            onClick={onNext}
            disabled={!value}
            className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${
              value
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Continue to Question 2 (Cost Estimation)</span>
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
                Microsoft Copilot Studio — Workflow Designer (Multi-Stage Agentic Architecture)
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
