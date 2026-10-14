import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { dbService } from './db/database';
import { calculateEvaluation } from './utils/scoringEngine';
import Navbar from './components/Navbar';
import RecommendationPanel from './components/RecommendationPanel';
import QuestionOne from './components/QuestionOne';
import QuestionTwo from './components/QuestionTwo';
import QuestionThree from './components/QuestionThree';
import SummaryView from './components/SummaryView';
import DatabaseModal from './components/DatabaseModal';
import { Sparkles, Database } from 'lucide-react';

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [variables, setVariables] = useState({});
  const [tools, setTools] = useState([]);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);

  // Questionnaire Steps: 1 = Q1, 2 = Q2 (Microsoft), 3 = Q3 (Athena), 4 = Summary
  const [currentStep, setCurrentStep] = useState(1);
  
  // Q1 State
  const [q1AgenticWorkflow, setQ1AgenticWorkflow] = useState(null); // 'yes' | 'no' | null
  
  // Q2 State (Microsoft)
  const [hUsers, setHUsers] = useState(0); // Existing licenses (Variable H)
  const [uUsers, setUUsers] = useState(0); // Users needed (Variable U)

  // Q3 State (Athena)
  const [athenaInputs, setAthenaInputs] = useState({
    DL: '',
    DL_AVG_PAGES: '',
    DM: '',
    DM_AVG_PAGES: '',
    DH: '',
    DH_AVG_PAGES: '',
    IMG_COUNT: '',
    NOD: '',
    AD: '',
    EVAL_Q: '',
    EVAL_ATTEMPTS: '',
    U: '',
    Q_PER_DAY: '',
    PROD_MONTHS: ''
  });

  // Reload data from SQLite database
  const refreshDbState = useCallback(() => {
    try {
      const vars = dbService.getVariables();
      setVariables(vars.map || {});
      setTools(dbService.getTools());
    } catch (err) {
      console.error('Error refreshing DB state:', err);
    }
  }, []);

  // Initialize SQLite WASM on component mount
  useEffect(() => {
    let unsubscribe = null;
    dbService.init()
      .then(() => {
        setIsDbReady(true);
        refreshDbState();
        unsubscribe = dbService.subscribe(() => {
          refreshDbState();
        });
      })
      .catch((err) => {
        console.error('Failed to initialize in-browser SQLite:', err);
      });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [refreshDbState]);

  // Compute live recommendation and costs
  const evaluation = useMemo(() => {
    return calculateEvaluation({
      q1AgenticWorkflow,
      hUsers,
      uUsers,
      athenaInputs,
      variables,
      tools
    });
  }, [q1AgenticWorkflow, hUsers, uUsers, athenaInputs, variables, tools]);

  // Apply the specified example parameters for Question 3
  const handleApplyAthenaExample = () => {
    setAthenaInputs({
      DL: 1000,
      DL_AVG_PAGES: 10,
      DM: 100,
      DM_AVG_PAGES: 10,
      DH: 10,
      DH_AVG_PAGES: 5,
      IMG_COUNT: 10,
      NOD: 1,
      COST_OF_1_OTHER: 1.1,
      AD: 2,
      EVAL_Q: 300,
      EVAL_ATTEMPTS: 10,
      U: 400,
      Q_PER_DAY: 2,
      PROD_MONTHS: 12
    });
  };

  // Reset assessment state
  const handleResetAssessment = () => {
    setQ1AgenticWorkflow(null);
    setHUsers(0);
    setUUsers(0);
    setAthenaInputs({
      DL: '',
      DL_AVG_PAGES: '',
      DM: '',
      DM_AVG_PAGES: '',
      DH: '',
      DH_AVG_PAGES: '',
      IMG_COUNT: '',
      NOD: '',
      AD: '',
      EVAL_Q: '',
      EVAL_ATTEMPTS: '',
      U: '',
      Q_PER_DAY: '',
      PROD_MONTHS: ''
    });
    setCurrentStep(1);
  };

  const handleCompleteQuestionnaire = () => {
    // Log evaluation in SQLite
    if (isDbReady && q1AgenticWorkflow) {
      dbService.logEvaluation({
        q1WorkflowReady: q1AgenticWorkflow === 'yes',
        hUsers: parseInt(hUsers, 10) || 0,
        uUsers: parseInt(uUsers, 10) || 0,
        costUsd: evaluation.m365AnnualCostUsd,
        costThb: evaluation.m365AnnualCostThb,
        recommendedTool: evaluation.recommendedToolId
      });
    }
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* 1. Global Navigation */}
      <Navbar
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        onOpenDatabase={() => setIsDatabaseOpen(true)}
        onReset={handleResetAssessment}
        usdRate={variables.usd_thb_rate ?? 35}
        licenseMonthlyUsd={variables.m365_license_monthly_usd ?? 20}
        isDbReady={isDbReady}
      />

      {/* 2. Top Sticky Tool Recommendation Panel (Always visible when scrolling) */}
      <RecommendationPanel
        evaluation={evaluation}
        onNavigateToSummary={() => setCurrentStep(4)}
        currentStep={currentStep}
      />

      {/* 3. Main Interactive Questionnaire Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Step Progress Pill Indicator */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Step {currentStep} of 4:
            </span>
            <span className="text-sm font-bold text-slate-800">
              {currentStep === 1 && "Agentic Workflow Capacity"}
              {currentStep === 2 && "Cost estimation: Microsoft solution"}
              {currentStep === 3 && "Cost estimation: Athena (Gemini 3.1 Flash Lite)"}
              {currentStep === 4 && "Final Recommendation & Comparison"}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentStep(1)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentStep === 1 ? 'bg-indigo-600 scale-125' : q1AgenticWorkflow ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
              title="Question 1: Agentic Readiness"
            />
            <button
              onClick={() => q1AgenticWorkflow && setCurrentStep(2)}
              disabled={!q1AgenticWorkflow}
              className={`w-3 h-3 rounded-full transition-all ${
                currentStep === 2 ? 'bg-blue-600 scale-125' : uUsers || hUsers ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
              title="Question 2: Cost: Microsoft"
            />
            <button
              onClick={() => q1AgenticWorkflow && setCurrentStep(3)}
              disabled={!q1AgenticWorkflow}
              className={`w-3 h-3 rounded-full transition-all ${
                currentStep === 3 ? 'bg-emerald-600 scale-125' : evaluation.athenaTotalCostThb > 0 ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
              title="Question 3: Cost: Athena"
            />
            <button
              onClick={() => setCurrentStep(4)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentStep === 4 ? 'bg-indigo-600 scale-125' : 'bg-slate-300'
              }`}
              title="Step 4: Summary"
            />
          </div>
        </div>

        {/* View Switching */}
        {currentStep === 1 && (
          <QuestionOne
            value={q1AgenticWorkflow}
            onChange={(val) => setQ1AgenticWorkflow(val)}
            onNext={() => {
              setCurrentStep(2);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentStep === 2 && (
          <QuestionTwo
            hUsers={hUsers}
            uUsers={uUsers}
            onHChange={(val) => setHUsers(val)}
            onUChange={(val) => setUUsers(val)}
            onBack={() => {
              setCurrentStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNext={() => {
              setCurrentStep(3);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            variables={variables}
          />
        )}

        {currentStep === 3 && (
          <QuestionThree
            athenaInputs={athenaInputs}
            onChange={(val) => setAthenaInputs(val)}
            onApplyExample={handleApplyAthenaExample}
            onBack={() => {
              setCurrentStep(2);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onComplete={handleCompleteQuestionnaire}
            variables={variables}
            evaluation={evaluation}
          />
        )}

        {currentStep === 4 && (
          <SummaryView
            evaluation={evaluation}
            q1AgenticWorkflow={q1AgenticWorkflow}
            hUsers={hUsers}
            uUsers={uUsers}
            athenaInputs={athenaInputs}
            tools={tools}
            variables={variables}
            onBackToQ1={() => {
              setCurrentStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToQ2={() => {
              setCurrentStep(2);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToQ3={() => {
              setCurrentStep(3);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenDatabase={() => setIsDatabaseOpen(true)}
          />
        )}
      </main>

      {/* 4. SQLite Database Modal Drawer */}
      <DatabaseModal
        isOpen={isDatabaseOpen}
        onClose={() => setIsDatabaseOpen(false)}
        onDatabaseUpdated={refreshDbState}
      />

      {/* 5. Minimalist Public Deployment Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">AI Tool Selection Advisor</span>
            <span>•</span>
            <span>Microsoft 365 Copilot vs Copilot Studio vs Athena</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDatabaseOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1"
            >
              <Database className="w-3.5 h-3.5" />
              <span>SQLite Tables & Rules</span>
            </button>
            <span>•</span>
            <span className="text-slate-400">Zero-backend serverless SPA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
