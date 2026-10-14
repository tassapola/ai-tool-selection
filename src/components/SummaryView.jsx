import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Bot, Workflow, Cpu, Printer, Sparkles, ExternalLink, HelpCircle, FileText, Check, X, Shield, Server, Building2, Sliders, FileDown, Stamp, AlertTriangle } from 'lucide-react';
import { exportAssessmentToDocx } from '../utils/docxExport';

export default function SummaryView({
  evaluation,
  q1AgenticWorkflow,
  hUsers,
  uUsers,
  athenaInputs = {},
  q4ConnectNonM365,
  q5UamGovernance,
  q6LocalKbtgLlm,
  tools = [],
  variables = {},
  onBackToQ1,
  onBackToQ2,
  onBackToQ3,
  onBackToQ4,
  onBackToQ5,
  onBackToQ6,
  onOpenDatabase
}) {
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const {
    scores = {},
    recommendedToolId,
    recommendedTool,
    m365AnnualCostThb = 0,
    annualCostThb = 0,
    additionalLicensesNeeded = 0,
    athenaTotalCostThb = 0,
    athenaDevPocTotal = 0,
    athenaPilotProdTotal = 0,
    weightCost = 60,
    weightFeatures = 40,
    isCostThresholdOverride = false,
    costDiffM365VsAthena = 0,
    costThresholdToPickAthena = 500000,
    H = 0,
    U = 0,
    reasoning = []
  } = evaluation;

  const handleExportDocx = async () => {
    setIsExportingDocx(true);
    try {
      await exportAssessmentToDocx({
        evaluation,
        q1AgenticWorkflow,
        hUsers,
        uUsers,
        athenaInputs,
        q4ConnectNonM365,
        q5UamGovernance,
        q6LocalKbtgLlm,
        variables,
        tools
      });
    } catch (err) {
      console.error('Error exporting DOCX report:', err);
      alert('Failed to generate .docx report: ' + err.message);
    } finally {
      setIsExportingDocx(false);
    }
  };

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
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Prominent Non-Final Advisory Disclaimer Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-300 text-amber-950 shadow-xs space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Important Advisory Notice • Suggestion Only (Not Final)</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
          This recommendation is an automated decision-support suggestion based on technical criteria and cost estimation formulas. <strong>It is not final.</strong> Users and stakeholders must also evaluate <strong>time-to-market</strong>, <strong>people & skills readiness</strong>, <strong>operational maintenance capacity</strong>, and <strong>other relevant KBank enterprise governance and compliance processes</strong> together with this suggestion.
        </p>
      </div>

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
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded bg-white shadow-2xs border border-slate-200 text-slate-800">
                  Recommended Choice
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  {scores[recommendedToolId]}% Match Score
                </span>
                <span className="text-[11px] font-mono text-slate-500 bg-white/70 px-2 py-0.5 rounded border border-slate-200">
                  {weightCost}% Cost / {weightFeatures}% Features Weighting
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
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-right shrink-0 space-y-1">
              <div className="text-xs text-slate-500 font-medium">Estimated Solution Cost</div>
              <div className="text-2xl font-black text-slate-900">
                {recommendedToolId === 'athena' ? (
                  <span>฿{athenaTotalCostThb.toLocaleString()}</span>
                ) : (
                  <span>{annualCostThb === 0 ? '฿0' : `฿${annualCostThb.toLocaleString()}`}</span>
                )}
                <span className="text-xs font-normal text-slate-500 ml-1">THB</span>
              </div>
              <span className="text-[11px] font-bold text-indigo-600 block uppercase">
                {recommendedToolId === 'athena' ? 'Dev + Production (Gemini 3.1 Flash Lite)' : 'Microsoft License / Year'}
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

      {/* Cost Threshold Override Notice */}
      {isCostThresholdOverride && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <span className="font-bold text-amber-900 block uppercase tracking-wide text-xs">
              Configurable Cost Threshold Override Triggered (COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD = ฿{costThresholdToPickAthena.toLocaleString()} THB)
            </span>
            <p className="leading-relaxed">
              Although Question 1 (Advanced Builder Readiness) indicated no team members to learn multi-stage workflows (normally favoring Microsoft Copilot Easy Mode), the Microsoft solution annual licensing cost (<strong>฿{m365AnnualCostThb.toLocaleString()} THB/yr</strong>) exceeds the Athena deployment & operational cost (<strong>฿{athenaTotalCostThb.toLocaleString()} THB</strong>) by <strong>฿{costDiffM365VsAthena.toLocaleString()} THB</strong>. Because this difference surpasses the configured threshold of <strong>฿{costThresholdToPickAthena.toLocaleString()} THB</strong>, the scoring engine has prioritized <strong>Athena</strong> to deliver substantial enterprise cost savings.
            </p>
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
              Evaluated against {weightCost}% Cost and {weightFeatures}% Features (readiness, KBank systems, UAM governance, LLM hosting).
            </p>
          </div>
          
          {/* Action Buttons: Export to DOCX & Print */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              disabled={isExportingDocx}
              onClick={handleExportDocx}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 active:scale-95 px-3.5 py-2 rounded-lg shadow-sm transition cursor-pointer"
              title="Download formal Word Document (.docx) report with override & stamp sections"
            >
              <FileDown className="w-4 h-4" />
              <span>{isExportingDocx ? 'Generating Word Doc...' : 'Export Report (.docx)'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition"
              title="Print assessment summary"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
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
                <span className="text-slate-500">KBank Internal APIs:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <X className="w-3.5 h-3.5 text-slate-400" /> Cloud M365 Only
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">UAM Governance:</span>
                <span className="font-semibold text-slate-800">Microsoft 365 Native</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Annual Est. Cost:</span>
                <span className="font-bold text-slate-900">฿{annualCostThb.toLocaleString()} / yr</span>
              </div>
            </div>
            <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Best For:</span>
              <span>General productivity, summarization in Teams/Word without multi-step chaining or internal core integrations.</span>
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
                <span className="text-slate-500">Non-M365 Systems:</span>
                <span className="font-semibold text-slate-800">Requires Custom Gateways</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">UAM Governance:</span>
                <span className="font-semibold text-purple-700">Decentralized / Manual</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Annual Est. Cost:</span>
                <span className="font-bold text-slate-900">฿{annualCostThb.toLocaleString()} / yr</span>
              </div>
            </div>
            <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Best For:</span>
              <span>Multi-step flows confined to Microsoft 365/MDP where your team actively owns UAM audit lifecycle.</span>
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
              <div className="flex items-center space-x-1.5">
                <h3 className="text-base font-bold text-slate-900">Athena Platform</h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-semibold">
                  Gemini 3.1 Flash Lite
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Internal enterprise agent platform with zero per-user seat tax.
              </p>
            </div>
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500">SmartServe Integration:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Native Internal
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">UAM Governance:</span>
                <span className="font-semibold text-emerald-700">Centralized Enterprise</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Local / KBTG LLM:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Supported
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Cost:</span>
                <span className="font-bold text-emerald-800">฿{athenaTotalCostThb.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Best For:</span>
              <span>Non-M365 KBank systems (SmartServe), centralized UAM governance, KBTG/local LLM roadmap, and avoiding per-user seat tax.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Human Override & Stamp Preview Section */}
      <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Formal Sign-off & Human Override Section (Included in .docx)
              </h3>
              <p className="text-xs text-slate-500">
                The exported Word document includes dedicated sections for human assessor verification, management override, and official department stamps.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isExportingDocx}
            onClick={handleExportDocx}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3.5 py-2 rounded-lg transition shrink-0"
          >
            <FileDown className="w-4 h-4" />
            <span>Download .docx Report</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
              Management Override Options:
            </span>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border border-slate-400 rounded-sm inline-block"></span>
                <span>Accept automated recommendation ({recommendedTool ? recommendedTool.name : 'Selected'})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border border-slate-400 rounded-sm inline-block"></span>
                <span>Override with alternate tool: [ ] M365 Copilot  [ ] Studio  [ ] Athena</span>
              </div>
              <div className="pt-1 text-[11px] text-slate-400 italic">
                * Includes 3 multi-line rows for written management justification.
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
              Official Stamp & Signature Box:
            </span>
            <div className="flex justify-between items-center text-slate-600 pt-1">
              <div className="space-y-1">
                <div>• Assessor Name & Title</div>
                <div>• Department / Division</div>
                <div>• Physical Signature & Date</div>
              </div>
              <div className="w-28 h-20 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-center p-1 bg-slate-50 text-[10px] text-slate-400 font-semibold">
                AFFIX OFFICIAL STAMP / SEAL
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inputs Review of all 6 Questions */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-xs font-bold uppercase text-slate-700 tracking-wider">
            All 6 Assessment Answers
          </span>
          <span className="text-xs text-slate-500 font-mono">
            Weighting: {weightCost}% Cost • {weightFeatures}% Features
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {/* Q1 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">1. Advanced Builder Readiness</span>
              <button onClick={onBackToQ1} className="text-indigo-600 hover:underline text-[11px]">Edit</button>
            </div>
            <div className="text-slate-600">
              {q1AgenticWorkflow === 'yes' ? '✅ Yes (Ready to build)' : '❌ No (Turnkey needed)'}
            </div>
          </div>

          {/* Q2 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">2. Microsoft Cost</span>
              <button onClick={onBackToQ2} className="text-blue-600 hover:underline text-[11px]">Edit</button>
            </div>
            <div className="text-slate-600">
              H: {H} • U: {U} → <strong>฿{annualCostThb.toLocaleString()} / yr</strong>
            </div>
          </div>

          {/* Q3 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">3. Athena Cost</span>
              <button onClick={onBackToQ3} className="text-emerald-600 hover:underline text-[11px]">Edit</button>
            </div>
            <div className="text-slate-600">
              Total: <strong>฿{athenaTotalCostThb.toLocaleString()}</strong> (Gemini 3.1 Flash Lite)
            </div>
          </div>

          {/* Q4 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">4. KBank Systems (SmartServe)</span>
              <button onClick={onBackToQ4} className="text-emerald-600 hover:underline text-[11px]">Edit</button>
            </div>
            <div className="text-slate-600">
              {q4ConnectNonM365 === 'yes' ? '✅ Yes (Need SmartServe integration)' : '❌ No (M365/MDP only)'}
            </div>
          </div>

          {/* Q5 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">5. UAM Governance Control</span>
              <button onClick={onBackToQ5} className="text-purple-600 hover:underline text-[11px]">Edit</button>
            </div>
            <div className="text-slate-600">
              {q5UamGovernance === 'yes' ? '✅ Yes (Team can audit UAM)' : '❌ No (Need centralized UAM)'}
            </div>
          </div>

          {/* Q6 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">6. Local / KBTG LLM</span>
              <button onClick={onBackToQ6} className="text-teal-600 hover:underline text-[11px]">Edit</button>
            </div>
            <div className="text-slate-600">
              {q6LocalKbtgLlm === 'yes' ? '✅ Yes (Plan internal models)' : '❌ No (Cloud commercial LLMs)'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBackToQ6}
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Question 6 (Model Roadmap)</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            disabled={isExportingDocx}
            onClick={handleExportDocx}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Report (.docx)</span>
          </button>

          <button
            type="button"
            onClick={onOpenDatabase}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition"
          >
            <Sliders className="w-4 h-4 text-indigo-300" />
            <span>Tweak Weights & SQLite Variables</span>
          </button>
        </div>
      </div>
    </div>
  );
}
