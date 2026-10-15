import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { dbService } from './db/database';
import { calculateEvaluation } from './utils/scoringEngine';
import Navbar from './components/Navbar';
import RecommendationPanel from './components/RecommendationPanel';
import QuestionOne from './components/QuestionOne';
import QuestionTwo from './components/QuestionTwo';
import QuestionThree from './components/QuestionThree';
import QuestionFour from './components/QuestionFour';
import QuestionFive from './components/QuestionFive';
import QuestionSix from './components/QuestionSix';
import QuestionSeven from './components/QuestionSeven';
import SummaryView from './components/SummaryView';
import DatabaseModal from './components/DatabaseModal';
import AssumptionsModal from './components/AssumptionsModal';
import ScreenSizeAlert from './components/ScreenSizeAlert';
import { Sparkles, Database, Laptop } from 'lucide-react';

const SESSION_STORAGE_KEY = 'antigravity_assessment_draft_v1';

const getSavedAssessment = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
};

export default function App() {
  const savedState = getSavedAssessment();

  const [isDbReady, setIsDbReady] = useState(false);
  const [variables, setVariables] = useState({});
  const [tools, setTools] = useState([]);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);
  const [isAssumptionsOpen, setIsAssumptionsOpen] = useState(false);
  const [isScreenAlertOpen, setIsScreenAlertOpen] = useState(false);

  // Questionnaire Steps:
  // 1 = Q1 (Advanced Builder Readiness)
  // 2 = Q2 (Cost: Microsoft)
  // 3 = Q3 (Cost: Athena)
  // 4 = Q4 (KBank Systems / SmartServe)
  // 5 = Q5 (O365 Knowledge to OneDrive/SharePoint)
  // 6 = Q6 (UAM Governance)
  // 7 = Q7 (Model Roadmap: Local/KBTG LLM)
  // 8 = Summary & 3-Way Comparison
  const [currentStep, setCurrentStep] = useState(savedState?.currentStep || 1);
  
  // Q1 State: Advanced Builder Readiness
  const [q1AgenticWorkflow, setQ1AgenticWorkflow] = useState(savedState?.q1AgenticWorkflow ?? null); // 'yes' | 'no' | null
  
  // Q2 State: Microsoft solution
  const [hUsers, setHUsers] = useState(savedState?.hUsers ?? 0); // Existing licenses (Variable H)
  const [uUsers, setUUsers] = useState(savedState?.uUsers ?? 0); // Users needed (Variable U)

  // Q3 State: Athena Dev/PoC & Pilot/Prod parameters
  const [athenaInputs, setAthenaInputs] = useState(savedState?.athenaInputs || {
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
    DEV_POC_MONTHS: 2,
    AGENT_DOCTOR_MANDAYS: '',
    U: '',
    Q_PER_DAY: '',
    PROD_MONTHS: 10
  });

  // Track if first 3 questions have been completed
  const [hasCompletedFirstThree, setHasCompletedFirstThree] = useState(savedState?.hasCompletedFirstThree ?? false);

  // Q4 State: Non-M365/MDP KBank systems (e.g. SmartServe)
  const [q4ConnectNonM365, setQ4ConnectNonM365] = useState(savedState?.q4ConnectNonM365 ?? null); // 'yes' | 'no' | null

  // Q5 State: Move O365 knowledge to OneDrive/SharePoint
  const [q5O365KnowledgeToSharepoint, setQ5O365KnowledgeToSharepoint] = useState(savedState?.q5O365KnowledgeToSharepoint ?? null); // 'yes' | 'no' | null

  // Q6 State: UAM governance & ownership accountability
  const [q6UamGovernance, setQ6UamGovernance] = useState(savedState?.q6UamGovernance ?? savedState?.q5UamGovernance ?? null); // 'yes' | 'no' | null

  // Q7 State: Local LLM or KBank/KBTG-hosted LLM
  const [q7LocalKbtgLlm, setQ7LocalKbtgLlm] = useState(savedState?.q7LocalKbtgLlm ?? savedState?.q6LocalKbtgLlm ?? null); // 'yes' | 'no' | null

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

  // Only auto-close if user explicitly opened the modal and then expanded the window >= 1280px
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth >= 1280) {
        setIsScreenAlertOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute live recommendation and costs
  const evaluation = useMemo(() => {
    return calculateEvaluation({
      q1AgenticWorkflow,
      hUsers,
      uUsers,
      athenaInputs,
      q4ConnectNonM365,
      q5O365KnowledgeToSharepoint,
      q6UamGovernance,
      q7LocalKbtgLlm,
      hasCompletedFirstThree,
      variables,
      tools
    });
  }, [
    q1AgenticWorkflow,
    hUsers,
    uUsers,
    athenaInputs,
    q4ConnectNonM365,
    q5O365KnowledgeToSharepoint,
    q6UamGovernance,
    q7LocalKbtgLlm,
    hasCompletedFirstThree,
    variables,
    tools
  ]);

  // Save assessment draft to sessionStorage whenever state changes
  useEffect(() => {
    try {
      const draft = {
        currentStep,
        q1AgenticWorkflow,
        hUsers,
        uUsers,
        athenaInputs,
        hasCompletedFirstThree,
        q4ConnectNonM365,
        q5O365KnowledgeToSharepoint,
        q6UamGovernance,
        q7LocalKbtgLlm
      };
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {}
  }, [
    currentStep,
    q1AgenticWorkflow,
    hUsers,
    uUsers,
    athenaInputs,
    hasCompletedFirstThree,
    q4ConnectNonM365,
    q5O365KnowledgeToSharepoint,
    q6UamGovernance,
    q7LocalKbtgLlm
  ]);

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
      DEV_POC_MONTHS: 2,
      AGENT_DOCTOR_MANDAYS: 0,
      U: 400,
      Q_PER_DAY: 2,
      PROD_MONTHS: 10
    });
  };

  // Reset assessment state
  const handleResetAssessment = () => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {}
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
      DEV_POC_MONTHS: 2,
      AGENT_DOCTOR_MANDAYS: '',
      U: '',
      Q_PER_DAY: '',
      PROD_MONTHS: 10
    });
    setHasCompletedFirstThree(false);
    setQ4ConnectNonM365(null);
    setQ5O365KnowledgeToSharepoint(null);
    setQ6UamGovernance(null);
    setQ7LocalKbtgLlm(null);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishQuestionThree = () => {
    setHasCompletedFirstThree(true);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteQuestionnaire = () => {
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
    setCurrentStep(8);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step descriptions map in Thai
  const stepTitles = {
    1: "ข้อที่ 1: ความพร้อมสร้าง Agent ขั้นสูง (Advanced Builder Readiness)",
    2: "ข้อที่ 2: ประมาณการค่าใช้จ่าย: โซลูชัน Microsoft (Cost estimation: Microsoft solution)",
    3: "ข้อที่ 3: ประมาณการค่าใช้จ่าย: Athena (Gemini 3.1 Flash Lite)",
    4: "ข้อที่ 4: การเชื่อมต่อระบบภายใน KBank อื่นหรือใช้ UI ในระบบ KBank อื่น (นอกเหนือจาก M365/MDP)",
    5: "ข้อที่ 5: การรวบรวมความรู้สู่ OneDrive / SharePoint (Knowledge Consolidation)",
    6: "ข้อที่ 6: การกำกับดูแลสิทธิ์ UAM และการโอนย้ายความเป็นเจ้าของ Agent",
    7: "ข้อที่ 7: แผนการใช้งานโมเดล Local LLM หรือ LLM ภายใน KBank/KBTG",
    8: "สรุปผลการประเมินและเปรียบเทียบทั้ง 3 โซลูชัน (Final Recommendation & Comparison)"
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* 1. Global Navigation */}
      <Navbar
        currentStep={currentStep}
        onSelectStep={(step) => {
          if (step > 3 && !hasCompletedFirstThree) return;
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDatabase={() => setIsDatabaseOpen(true)}
        onOpenAssumptions={() => setIsAssumptionsOpen(true)}
        onOpenScreenSizeAlert={() => setIsScreenAlertOpen(true)}
        onReset={handleResetAssessment}
        usdRate={variables.usd_thb_rate ?? 35}
        licenseMonthlyUsd={variables.m365_license_monthly_usd ?? 20}
        isDbReady={isDbReady}
      />

      {/* Mobile & Small Screen Suggestion Strip (Visible on screens < 1280px) */}
      <div className="block xl:hidden bg-amber-50/90 border-b border-amber-200/90 px-3 sm:px-4 py-1.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-amber-900 min-w-0">
            <Laptop className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="text-[11px] sm:text-xs truncate">
              <strong className="text-amber-950 font-bold">แนะนำเปิดบน Laptop:</strong> เพื่อดูแถบขั้นตอน 8 สเตจและตารางเปรียบเทียบเต็มรูปแบบ
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsScreenAlertOpen(true)}
            className="shrink-0 text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-white hover:bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300 shadow-2xs cursor-pointer transition whitespace-nowrap"
          >
            คัดลอกลิงก์ ↗
          </button>
        </div>
      </div>

      {/* 2. Top Sticky Tool Recommendation Panel (Holds off recommendation until first 3 questions are completed) */}
      <RecommendationPanel
        evaluation={evaluation}
        onNavigateToSummary={() => {
          setCurrentStep(8);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentStep={currentStep}
      />

      {/* 3. Main Interactive Questionnaire Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Step Progress Pill Indicator */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              ขั้นตอนที่ {currentStep} จาก 8:
            </span>
            <span className="text-sm font-bold text-slate-900">
              {stepTitles[currentStep]}
            </span>
          </div>

          {/* Step dots */}
          <div className="flex items-center space-x-1.5 self-start sm:self-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  if (num > 3 && !hasCompletedFirstThree) return;
                  setCurrentStep(num);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentStep === num
                    ? 'bg-indigo-600 scale-125'
                    : num === 1 && q1AgenticWorkflow
                    ? 'bg-emerald-500'
                    : num === 2 && (uUsers || hUsers)
                    ? 'bg-emerald-500'
                    : num === 3 && evaluation.athenaTotalCostThb > 0
                    ? 'bg-emerald-500'
                    : num === 4 && q4ConnectNonM365
                    ? 'bg-emerald-500'
                    : num === 5 && q5O365KnowledgeToSharepoint
                    ? 'bg-emerald-500'
                    : num === 6 && q6UamGovernance
                    ? 'bg-emerald-500'
                    : num === 7 && q7LocalKbtgLlm
                    ? 'bg-emerald-500'
                    : 'bg-slate-300'
                }`}
                title={`Step ${num}`}
              />
            ))}
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
            onComplete={handleFinishQuestionThree}
            onSkipToSummary={() => {
              setHasCompletedFirstThree(true);
              setCurrentStep(8);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            variables={variables}
            evaluation={evaluation}
          />
        )}

        {currentStep === 4 && (
          <QuestionFour
            value={q4ConnectNonM365}
            onChange={(val) => setQ4ConnectNonM365(val)}
            onBack={() => {
              setCurrentStep(3);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNext={() => {
              setCurrentStep(5);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentStep === 5 && (
          <QuestionFive
            value={q5O365KnowledgeToSharepoint}
            onChange={(val) => setQ5O365KnowledgeToSharepoint(val)}
            onBack={() => {
              setCurrentStep(4);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNext={() => {
              setCurrentStep(6);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentStep === 6 && (
          <QuestionSix
            value={q6UamGovernance}
            onChange={(val) => setQ6UamGovernance(val)}
            onBack={() => {
              setCurrentStep(5);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNext={() => {
              setCurrentStep(7);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentStep === 7 && (
          <QuestionSeven
            value={q7LocalKbtgLlm}
            onChange={(val) => setQ7LocalKbtgLlm(val)}
            onBack={() => {
              setCurrentStep(6);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onComplete={handleCompleteQuestionnaire}
          />
        )}

        {currentStep === 8 && (
          <SummaryView
            evaluation={evaluation}
            q1AgenticWorkflow={q1AgenticWorkflow}
            hUsers={hUsers}
            uUsers={uUsers}
            athenaInputs={athenaInputs}
            q4ConnectNonM365={q4ConnectNonM365}
            q5O365KnowledgeToSharepoint={q5O365KnowledgeToSharepoint}
            q6UamGovernance={q6UamGovernance}
            q7LocalKbtgLlm={q7LocalKbtgLlm}
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
            onBackToQ4={() => {
              setCurrentStep(4);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToQ5={() => {
              setCurrentStep(5);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToQ6={() => {
              setCurrentStep(6);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToQ7={() => {
              setCurrentStep(7);
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

      {/* 4.1 Assumptions Modal (Window Popup Style) */}
      <AssumptionsModal
        isOpen={isAssumptionsOpen}
        onClose={() => setIsAssumptionsOpen(false)}
      />

      {/* 4.2 Screen Size Alert Modal */}
      <ScreenSizeAlert
        isOpen={isScreenAlertOpen}
        onClose={() => setIsScreenAlertOpen(false)}
        minWidthRequired={1280}
      />

      {/* 5. Minimalist Public Deployment Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">ระบบช่วยประเมินและเลือกเครื่องมือ AI (AI Tool Selection Advisor)</span>
            <span>•</span>
            <span>Microsoft 365 Copilot vs Copilot Studio vs Athena</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsAssumptionsOpen(true)}
              className="text-amber-700 hover:text-amber-900 font-medium flex items-center space-x-1"
            >
              <span>สมมุติฐานเพิ่มเติม (UAM & ผู้ใช้)</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsDatabaseOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1"
            >
              <Database className="w-3.5 h-3.5" />
              <span>ตาราง SQLite, ค่าน้ำหนัก และกฎการตัดสินใจ</span>
            </button>
            <span>•</span>
            <span className="text-slate-400">เว็บแอปพลิเคชันแบบ Serverless Single-Page App</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
