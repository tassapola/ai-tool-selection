import React from 'react';
import { ArrowLeft, ArrowRight, Cpu, Check, X, Sparkles, Shield, Cloud, Server, Info } from 'lucide-react';

export default function QuestionSix({
  value, // 'yes' | 'no' | null
  onChange,
  onBack,
  onComplete
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-50/80 via-emerald-50/50 to-white p-6 sm:p-8 border-b border-slate-100">
        <div className="flex items-center space-x-2.5 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
          <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
            6
          </span>
          <span>Question 6 • Model Hosting & Sovereign LLM Roadmap</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          Would you plan to use Local LLM or KBank/KBTG-hosted LLM in the future?
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          Evaluate whether your team or division requires on-premise private models, KBTG research LLMs, or sovereign AI infrastructure.
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Architectural Explainer */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-slate-900">
            <Server className="w-4 h-4 text-teal-600" />
            <span>Model Hosting Flexibility</span>
          </div>
          <p className="leading-relaxed">
            Microsoft 365 Copilot and Copilot Studio operate exclusively within Microsoft's hosted cloud endpoints. If your compliance roadmap requires hosting models on <strong>KBank/KBTG internal GPU clusters</strong> or routing through localized private LLMs, <strong>Athena</strong> is the designated architecture that supports internal endpoint configuration.
          </p>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* YES Option */}
          <button
            type="button"
            onClick={() => onChange('yes')}
            className={`p-5 rounded-xl border-2 text-left transition-all duration-200 relative flex flex-col justify-between ${
              value === 'yes'
                ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-bold ${value === 'yes' ? 'text-emerald-900' : 'text-slate-900'}`}>
                  Yes
                </span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  value === 'yes' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Check className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes, we anticipate using Local LLMs or internal KBank/KBTG-hosted models for privacy, cost control, or compliance.
              </p>
            </div>

            {value === 'yes' && (
              <div className="mt-3 pt-3 border-t border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Athena recommended: Supports custom private and KBTG model endpoints</span>
              </div>
            )}
          </button>

          {/* NO Option */}
          <button
            type="button"
            onClick={() => onChange('no')}
            className={`p-5 rounded-xl border-2 text-left transition-all duration-200 relative flex flex-col justify-between ${
              value === 'no'
                ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-bold ${value === 'no' ? 'text-indigo-900' : 'text-slate-900'}`}>
                  No
                </span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  value === 'no' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {value === 'no' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                No, standard cloud commercial LLMs (Microsoft Azure OpenAI or cloud API) meet all our current and future needs.
              </p>
            </div>

            {value === 'no' && (
              <div className="mt-3 pt-3 border-t border-indigo-200 text-xs font-semibold text-indigo-700 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                <span>Standard cloud endpoints are suitable</span>
              </div>
            )}
          </button>
        </div>

        {/* Dynamic Context Notice */}
        {value === 'yes' && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Model Roadmap Recommendation: </span>
              Because you intend to run localized or KBank/KBTG-hosted models, <strong>Athena</strong> is the necessary choice. Athena's modular routing layer connects seamlessly to internal model gateways.
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Question 5</span>
          </button>

          <button
            type="button"
            onClick={onComplete}
            disabled={!value}
            className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${
              value
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Complete Assessment & View Recommendation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
