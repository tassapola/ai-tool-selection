import React from 'react';
import { ArrowLeft, ArrowRight, ShieldAlert, Check, X, Sparkles, UserCheck, UserX, AlertCircle, Info } from 'lucide-react';

export default function QuestionFive({
  value, // 'yes' | 'no' | null
  onChange,
  onBack,
  onNext
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/50 to-white p-6 sm:p-8 border-b border-slate-100">
        <div className="flex items-center space-x-2.5 text-xs font-semibold text-purple-700 uppercase tracking-wider mb-2">
          <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
            5
          </span>
          <span>Question 5 • UAM Governance & Ownership Lifecycle</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          Do you have people, process, and time prepared to make sure UAM governance is in control?
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          In self-service platforms like Microsoft Copilot Studio, your team holds operational accountability for maintaining access rights and agent handoffs.
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* The 2 Specific Governance Cases */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Specific Accountability Requirements:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Case One */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </div>
                <h3 className="text-xs font-bold text-slate-900">
                  Department Transfer Review
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                If a person with whom you share an AI agent moves to another department within KBank, <strong>you ARE ACCOUNTABLE</strong> to review and update/revoke their permissions to your agent.
              </p>
            </div>

            {/* Case Two */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </div>
                <h3 className="text-xs font-bold text-slate-900">
                  Agent Owner Handover
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an agent owner moves to another department or resigns from KBank, <strong>you ARE ACCOUNTABLE</strong> to formally transfer agent ownership to a designated new owner.
              </p>
            </div>
          </div>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* YES Option */}
          <button
            type="button"
            onClick={() => onChange('yes')}
            className={`p-5 rounded-xl border-2 text-left transition-all duration-200 relative flex flex-col justify-between ${
              value === 'yes'
                ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-bold ${value === 'yes' ? 'text-indigo-900' : 'text-slate-900'}`}>
                  Yes
                </span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  value === 'yes' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Check className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes, our team has established staff, processes, and regular audit time to actively manage agent permissions and ownership transitions.
              </p>
            </div>

            {value === 'yes' && (
              <div className="mt-3 pt-3 border-t border-indigo-200 text-xs font-semibold text-indigo-700 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                <span>Governance ready for self-service Copilot Studio agent lifecycle</span>
              </div>
            )}
          </button>

          {/* NO Option */}
          <button
            type="button"
            onClick={() => onChange('no')}
            className={`p-5 rounded-xl border-2 text-left transition-all duration-200 relative flex flex-col justify-between ${
              value === 'no'
                ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-bold ${value === 'no' ? 'text-emerald-900' : 'text-slate-900'}`}>
                  No
                </span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  value === 'no' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {value === 'no' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                No, our team cannot take on ongoing manual user access reviews or ownership transfers. We need centralized enterprise governance.
              </p>
            </div>

            {value === 'no' && (
              <div className="mt-3 pt-3 border-t border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Athena recommended: Centralized enterprise UAM governance</span>
              </div>
            )}
          </button>
        </div>

        {/* Dynamic Context Notice */}
        {value === 'no' && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Governance Recommendation: </span>
              Because your team does not have the capacity for decentralized UAM audit accountability, <strong>Athena</strong> is recommended. Athena ties into enterprise role-based directory management, preventing orphaned agents and unauthorized cross-department data exposure.
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
            <span>Back to Question 4</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!value}
            className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${
              value
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Continue to Question 6 (Model Roadmap)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
