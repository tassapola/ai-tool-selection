import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, FileText, Image as ImageIcon, Users, MessageSquare, Sparkles, Calculator, Check, Info, FileSpreadsheet, Layers, BookOpen, AlertCircle } from 'lucide-react';

export default function QuestionThree({
  athenaInputs,
  onChange,
  onApplyExample,
  onBack,
  onComplete,
  variables = {},
  evaluation
}) {
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'example'

  // Dynamic rates from database
  const costDlPage = Number(variables.COST_OF_1_DL_PAGE ?? 1.0);
  const costDmPage = Number(variables.COST_OF_1_DM_PAGE ?? 1.4);
  const costDhPage = Number(variables.COST_OF_1_DH_PAGE ?? 1.4);
  const costImage = Number(variables.COST_OF_1_IMAGE ?? 1.4);
  const costOther = Number(athenaInputs.COST_OF_1_OTHER ?? variables.COST_OF_1_OTHER ?? 1.4);
  const costEvalQ = Number(variables.COST_OF_1_EVAL_QUESTION ?? 1.0);
  const costProdQ = Number(variables.COST_OF_PROD_QUESTION ?? 1.0);

  // Field values with defaults
  const DL = athenaInputs.DL ?? '';
  const DL_AVG_PAGES = athenaInputs.DL_AVG_PAGES ?? '';
  const DM = athenaInputs.DM ?? '';
  const DM_AVG_PAGES = athenaInputs.DM_AVG_PAGES ?? '';
  const DH = athenaInputs.DH ?? '';
  const DH_AVG_PAGES = athenaInputs.DH_AVG_PAGES ?? '';
  const IMG_COUNT = athenaInputs.IMG_COUNT ?? '';
  const NOD = athenaInputs.NOD ?? '';
  const AD = athenaInputs.AD ?? '';
  const EVAL_Q = athenaInputs.EVAL_Q ?? '';
  const EVAL_ATTEMPTS = athenaInputs.EVAL_ATTEMPTS ?? '';
  const U = athenaInputs.U ?? '';
  const Q_PER_DAY = athenaInputs.Q_PER_DAY ?? '';
  const PROD_MONTHS = athenaInputs.PROD_MONTHS ?? '';

  const {
    athenaTotalCostThb = 0,
    athenaDevPocTotal = 0,
    athenaPilotProdTotal = 0,
    athenaBreakdown = {}
  } = evaluation;

  // Handle input update
  const handleFieldChange = (field, value) => {
    onChange({
      ...athenaInputs,
      [field]: value === '' ? '' : Math.max(0, parseFloat(value) || 0)
    });
  };

  const handleLoadExample = () => {
    onApplyExample();
    setActiveTab('form');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-white p-6 sm:p-8 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>Question 3 • Internal System Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              Cost estimation: Athena
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
              Model the ingestion, developer evaluation, and pilot/production operational costs for the internal Athena system.
            </p>
          </div>

          {/* Tab Button to view Example vs Form */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-center border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'form'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interactive Form
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('example')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'example'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Cost Calculation Example</span>
            </button>
          </div>
        </div>

        {/* Model Assumption Banner */}
        <div className="mt-5 p-3.5 bg-emerald-100/70 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              ✦
            </div>
            <div>
              <span className="font-extrabold text-emerald-900">Model Assumption: </span>
              <span>All calculations are based on the <strong>Gemini 3.1 Flash Lite</strong> model (fast token processing, low-latency multimodal retrieval).</span>
            </div>
          </div>
          <span className="hidden md:inline-flex text-[11px] font-bold bg-white/80 px-2 py-0.5 rounded text-emerald-800 border border-emerald-200">
            Gemini 3.1 Flash Lite
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* ================= TAB 1: INTERACTIVE FORM ================= */}
        {activeTab === 'form' && (
          <div className="space-y-8">
            {/* Quick preset trigger */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">
                Want to pre-fill with the reference baseline parameters?
              </span>
              <button
                type="button"
                onClick={handleLoadExample}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 shadow-2xs transition"
              >
                Load Preset Example Data
              </button>
            </div>

            {/* SECTION 1: DEV & POC */}
            <div className="space-y-6 border border-slate-200 rounded-2xl p-5 sm:p-6 bg-slate-50/40">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <h3 className="text-base font-bold text-slate-900">
                    Section 1: Dev & PoC
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium bg-white px-2.5 py-0.5 rounded border border-slate-200">
                  Ingestion & Evaluation
                </span>
              </div>

              {/* Section 1.1: Documents */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  Section 1.1: Documents
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* DL */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800">
                        Number of documents (docx, txt, md)
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        DL
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={DL}
                      onChange={(e) => handleFieldChange('DL', e.target.value)}
                      placeholder="e.g. 1000"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                    <div className="text-[11px] text-slate-400">Unit rate: ฿{costDlPage} / page</div>
                  </div>

                  {/* DL_AVG_PAGES */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800">
                        Average pages in documents (docx, txt, md)
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        DL_AVG_PAGES
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={DL_AVG_PAGES}
                      onChange={(e) => handleFieldChange('DL_AVG_PAGES', e.target.value)}
                      placeholder="e.g. 10"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                    <div className="text-[11px] text-slate-400">Average page count per file</div>
                  </div>

                  {/* DM */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800">
                        Number of documents (pdf, pptx without images)
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                        DM
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={DM}
                      onChange={(e) => handleFieldChange('DM', e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                    <div className="text-[11px] text-slate-400">Unit rate: ฿{costDmPage} / page</div>
                  </div>

                  {/* DM_AVG_PAGES */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800">
                        Average pages in documents (pdf, pptx without images)
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                        DM_AVG_PAGES
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={DM_AVG_PAGES}
                      onChange={(e) => handleFieldChange('DM_AVG_PAGES', e.target.value)}
                      placeholder="e.g. 10"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                    <div className="text-[11px] text-slate-400">Average pages for text-only PDFs/PPTs</div>
                  </div>

                  {/* DH */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800">
                        Number of documents (pdf, pptx with images)
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        DH
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={DH}
                      onChange={(e) => handleFieldChange('DH', e.target.value)}
                      placeholder="e.g. 10"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                    <div className="text-[11px] text-slate-400">Unit rate: ฿{costDhPage} / page</div>
                  </div>

                  {/* DH_AVG_PAGES */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800">
                        Average pages in documents (pdf, pptx with images)
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        DH_AVG_PAGES
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={DH_AVG_PAGES}
                      onChange={(e) => handleFieldChange('DH_AVG_PAGES', e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                    <div className="text-[11px] text-slate-400">Average pages for image-heavy files</div>
                  </div>

                  {/* IMG_COUNT (Always appears, conditional on DH > 0) */}
                  <div className={`p-4 rounded-xl border shadow-2xs space-y-1.5 transition-all ${
                    DH > 0 ? 'bg-amber-50/50 border-amber-300' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                        <span>Number of images within (pptx, images)</span>
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        IMG_COUNT
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={IMG_COUNT}
                      onChange={(e) => handleFieldChange('IMG_COUNT', e.target.value)}
                      placeholder="e.g. 10"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold bg-white"
                    />
                    <div className="text-[11px] text-slate-500">
                      {DH > 0 ? `Active: DH > 0 (${DH} documents). Rate: ฿${costImage} / image` : 'Note: Appears for DH > 0 image counting.'}
                    </div>
                  </div>

                  {/* NOD */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800">
                        Number of other documents
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        NOD
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={NOD}
                      onChange={(e) => handleFieldChange('NOD', e.target.value)}
                      placeholder="e.g. 1"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                    <div className="text-[11px] text-slate-400">Unit rate: ฿{costOther} / other document</div>
                  </div>
                </div>
              </div>

              {/* Section 1.2: Agent Developer */}
              <div className="space-y-4 pt-3 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  Section 1.2: Agent Developer
                </h4>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5 max-w-md">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-800">
                      Number of agent developers
                    </label>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      AD
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={AD}
                    onChange={(e) => handleFieldChange('AD', e.target.value)}
                    placeholder="e.g. 2"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                  />
                  <div className="text-[11px] text-slate-400">Developers building & maintaining custom Athena agents</div>
                </div>
              </div>

              {/* Section 1.3: Evaluation Questions */}
              <div className="space-y-4 pt-3 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  Section 1.3: Number of Evaluation Questions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* EVAL_Q */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800">
                        Number of evaluation questions asked
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        EVAL_Q
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={EVAL_Q}
                      onChange={(e) => handleFieldChange('EVAL_Q', e.target.value)}
                      placeholder="e.g. 300"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                    <div className="text-[11px] text-slate-400">Benchmark question set size</div>
                  </div>

                  {/* EVAL_ATTEMPTS */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-800">
                        Number of evaluation attempts you would make
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        EVAL_ATTEMPTS
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={EVAL_ATTEMPTS}
                      onChange={(e) => handleFieldChange('EVAL_ATTEMPTS', e.target.value)}
                      placeholder="e.g. 10"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                    />
                    <div className="text-[11px] text-slate-400">Total test runs / tuning iterations. Rate: ฿{costEvalQ} / question</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: PILOT & PRODUCTION */}
            <div className="space-y-6 border border-slate-200 rounded-2xl p-5 sm:p-6 bg-slate-50/40">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                  <h3 className="text-base font-bold text-slate-900">
                    Section 2: Pilot & Production
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium bg-white px-2.5 py-0.5 rounded border border-slate-200">
                  Operational Run-Rate
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* U */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-800">
                      Number of chat users
                    </label>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                      U
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={U}
                    onChange={(e) => handleFieldChange('U', e.target.value)}
                    placeholder="e.g. 400"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                  />
                  <div className="text-[11px] text-slate-400">Total active chat end-users</div>
                </div>

                {/* Q_PER_DAY */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-800">
                      Questions asked per day
                    </label>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                      Q_PER_DAY
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={Q_PER_DAY}
                    onChange={(e) => handleFieldChange('Q_PER_DAY', e.target.value)}
                    placeholder="e.g. 2"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                  />
                  <div className="text-[11px] text-slate-400">Average queries per user / day</div>
                </div>

                {/* PROD_MONTHS */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-800">
                      Months in pilot & production
                    </label>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                      PROD_MONTHS
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={PROD_MONTHS}
                    onChange={(e) => handleFieldChange('PROD_MONTHS', e.target.value)}
                    placeholder="e.g. 12"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                  />
                  <div className="text-[11px] text-slate-400">Operational timeframe (months). Rate: ฿{costProdQ}/query</div>
                </div>
              </div>
            </div>

            {/* LIVE CALCULATION SUMMARY CARD */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white rounded-2xl border-2 border-emerald-300 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  Athena Cost Summary (Gemini 3.1 Flash Lite)
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                  Zero Microsoft Seat Tax
                </span>
              </div>

              {/* Formula & Breakdown grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-white/90 p-4 rounded-xl border border-emerald-200">
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-700 font-sans uppercase tracking-wider text-[11px]">
                    1. Dev & PoC Subtotal:
                  </div>
                  <div className="text-slate-600">
                    DL ({DL || 0}×{DL_AVG_PAGES || 0}×฿{costDlPage}) = ฿{(athenaBreakdown.costDlTotal || 0).toLocaleString()}
                  </div>
                  <div className="text-slate-600">
                    DM ({DM || 0}×{DM_AVG_PAGES || 0}×฿{costDmPage}) = ฿{(athenaBreakdown.costDmTotal || 0).toLocaleString()}
                  </div>
                  <div className="text-slate-600">
                    DH ({DH || 0}×{DH_AVG_PAGES || 0}×฿{costDhPage}) = ฿{(athenaBreakdown.costDhTotal || 0).toLocaleString()}
                  </div>
                  <div className="text-slate-600">
                    Images ({IMG_COUNT || 0}×฿{costImage}) = ฿{(athenaBreakdown.costImgTotal || 0).toLocaleString()}
                  </div>
                  <div className="text-slate-600">
                    NOD ({NOD || 0}×฿{costOther}) = ฿{(athenaBreakdown.costNodTotal || 0).toLocaleString()}
                  </div>
                  <div className="text-slate-600">
                    Evaluation ({EVAL_Q || 0}×{EVAL_ATTEMPTS || 0}×฿{costEvalQ}) = ฿{(athenaBreakdown.evalCostTotal || 0).toLocaleString()}
                  </div>
                  <div className="font-bold text-emerald-800 pt-1 border-t border-slate-100">
                    Dev & PoC Total = ฿{(athenaDevPocTotal || 0).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold text-slate-700 font-sans uppercase tracking-wider text-[11px]">
                    2. Pilot & Production Subtotal:
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Formula: U × Q_PER_DAY × 30 days × PROD_MONTHS × ฿{costProdQ}
                  </div>
                  <div className="text-slate-700">
                    = {U || 0} users × {Q_PER_DAY || 0} q/day × 30 × {PROD_MONTHS || 0} mo × ฿{costProdQ}
                  </div>
                  <div className="font-bold text-teal-800 pt-1 border-t border-slate-100">
                    Production Run-Rate = ฿{(athenaPilotProdTotal || 0).toLocaleString()}
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 font-sans">
                    Agent Developers (AD): <strong>{AD || 0}</strong>
                  </div>
                </div>
              </div>

              {/* Total Athena Cost Display */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pt-3 border-t border-emerald-200">
                <span className="text-sm font-bold text-slate-800">
                  Total Athena Estimated Cost:
                </span>
                <div className="text-right">
                  <div className="text-3xl font-black text-slate-900 tracking-tight">
                    ฿{athenaTotalCostThb.toLocaleString()}
                    <span className="text-sm font-normal text-slate-600 ml-1.5">Thai Baht (THB)</span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                    Includes both Dev/PoC document indexing and {PROD_MONTHS || 12} months of production queries.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: COST CALCULATION EXAMPLE ================= */}
        {activeTab === 'example' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-300 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-base font-bold text-emerald-950">
                    Worked Cost Calculation Example
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleLoadExample}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load These Parameters into Form</span>
                </button>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Here is the reference cost model based on <strong>Gemini 3.1 Flash Lite</strong> pricing with document indexing, automated evaluation, and 12-month pilot & production query execution.
              </p>
            </div>

            {/* Example Parameter Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dev & PoC Parameter Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-slate-700 border-b border-slate-200 uppercase tracking-wider">
                  Dev & PoC Parameters
                </div>
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">DL</td>
                      <td className="px-4 py-2 text-slate-600">1,000 documents (docx, txt, md)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">DL_AVG_PAGES</td>
                      <td className="px-4 py-2 text-slate-600">10 pages / doc</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">COST_OF_1_DL_PAGE</td>
                      <td className="px-4 py-2 text-slate-600">1 THB / page</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">DM</td>
                      <td className="px-4 py-2 text-slate-600">100 documents (pdf, pptx without img)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">DM_AVG_PAGES</td>
                      <td className="px-4 py-2 text-slate-600">10 pages / doc</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">COST_OF_1_DM_PAGE</td>
                      <td className="px-4 py-2 text-slate-600">1.4 THB / page</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">DH</td>
                      <td className="px-4 py-2 text-slate-600">10 documents (pdf, pptx with img)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">DH_AVG_PAGES</td>
                      <td className="px-4 py-2 text-slate-600">5 pages / doc</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">COST_OF_1_DH_PAGE</td>
                      <td className="px-4 py-2 text-slate-600">1.4 THB / page</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">IMG_COUNT</td>
                      <td className="px-4 py-2 text-slate-600">10 images</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">COST_OF_1_IMAGE</td>
                      <td className="px-4 py-2 text-slate-600">1.4 THB / image</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">NOD</td>
                      <td className="px-4 py-2 text-slate-600">1 other document</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">COST_OF_1_OTHER</td>
                      <td className="px-4 py-2 text-slate-600">1.1 THB / doc</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">EVAL_Q</td>
                      <td className="px-4 py-2 text-slate-600">300 questions</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">EVAL_ATTEMPTS</td>
                      <td className="px-4 py-2 text-slate-600">10 attempts</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-800">COST_OF_1_EVAL_QUESTION</td>
                      <td className="px-4 py-2 text-slate-600">1 THB / question</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pilot & Production Parameters & Math Steps */}
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-slate-700 border-b border-slate-200 uppercase tracking-wider">
                    Pilot & Production Parameters
                  </div>
                  <table className="w-full text-left text-xs">
                    <tbody className="divide-y divide-slate-100 font-mono">
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-bold text-slate-800">U</td>
                        <td className="px-4 py-2 text-slate-600">400 chat users</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-bold text-slate-800">Q_PER_DAY</td>
                        <td className="px-4 py-2 text-slate-600">2 questions / user / day</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-bold text-slate-800">PROD_MONTHS</td>
                        <td className="px-4 py-2 text-slate-600">12 months</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-bold text-slate-800">COST_OF_PROD_QUESTION</td>
                        <td className="px-4 py-2 text-slate-600">1 THB / question</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Step-by-Step Math Breakdown */}
                <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs space-y-2 shadow-inner">
                  <div className="text-white font-bold pb-1 border-b border-slate-800">
                    Step-by-Step Calculation:
                  </div>
                  <div>• DL Cost: 1,000 × 10 × 1 = <strong>฿10,000</strong></div>
                  <div>• DM Cost: 100 × 10 × 1.4 = <strong>฿1,400</strong></div>
                  <div>• DH Cost: 10 × 5 × 1.4 = <strong>฿70</strong></div>
                  <div>• Image Cost: 10 × 1.4 = <strong>฿14</strong></div>
                  <div>• Other Cost: 1 × 1.1 = <strong>฿1.10</strong></div>
                  <div>• Evaluation: 300 × 10 × 1 = <strong>฿3,000</strong></div>
                  <div className="text-white pt-1">
                    ➤ Dev & PoC Subtotal = 10,000 + 1,400 + 70 + 14 + 1.1 + 3,000 = <span className="text-emerald-300 font-bold">฿14,485.10</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-teal-300">
                    ➤ Pilot & Production Subtotal = 400 × 2 × 30 × 12 × 1 = <span className="text-teal-200 font-bold">฿288,000.00</span>
                  </div>
                  <div className="pt-2 border-t border-slate-700 text-white font-bold text-sm">
                    ★ Total Athena Cost = ฿14,485.10 + ฿288,000 = <span className="text-emerald-400 text-base">฿302,485.10 THB</span>
                  </div>
                </div>
              </div>
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
            <span>Back to Question 2 (Microsoft)</span>
          </button>

          <button
            type="button"
            onClick={onComplete}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
          >
            <span>View Full 3-Way Recommendation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
