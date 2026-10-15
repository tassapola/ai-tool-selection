/**
 * Computes tool recommendation scores, Microsoft license cost, and Athena infrastructure cost
 * based on user inputs and SQLite database variables.
 *
 * Weighting: Cost = 60%, Features = 40%
 */
export function calculateEvaluation({
  q1AgenticWorkflow, // 'yes' | 'no' | null
  // Question 2 (Microsoft Solution)
  hUsers = 0,        // Number of existing Advanced licenses (H)
  uUsers = 0,        // Number of users needed (U)
  // Question 3 (Athena Solution)
  athenaInputs = {}, // DL, DL_AVG_PAGES, DM, DM_AVG_PAGES, DH, DH_AVG_PAGES, IMG_COUNT, NOD, AD, EVAL_Q, EVAL_ATTEMPTS, U, Q_PER_DAY, PROD_MONTHS
  // Question 4, 5, 6, 7 (Features & Governance)
  q4ConnectNonM365 = null,            // 'yes' | 'no' | null (KBank systems outside M365/MDP e.g. SmartServe)
  q5O365KnowledgeToSharepoint = null, // 'yes' | 'no' | null (Move O365 knowledge to OneDrive/SharePoint)
  q6UamGovernance = null,             // 'yes' | 'no' | null (UAM governance & ownership transfer accountability)
  q7LocalKbtgLlm = null,              // 'yes' | 'no' | null (Local LLM or KBank/KBTG-hosted LLM)
  // Backwards compatibility aliases
  q5UamGovernance = null,
  q6LocalKbtgLlm = null,
  // Assessment progress flag
  hasCompletedFirstThree = false,
  variables = {},
  tools = []
}) {
  const effectiveQ6Uam = q6UamGovernance !== null ? q6UamGovernance : q5UamGovernance;
  const effectiveQ7Llm = q7LocalKbtgLlm !== null ? q7LocalKbtgLlm : q6LocalKbtgLlm;
  // Read dynamic variables from DB with safe defaults
  const usdThbRate = Number(variables.usd_thb_rate ?? 35.0);
  const licenseMonthlyUsd = Number(variables.m365_license_monthly_usd ?? 20.0);
  const monthsPerYear = Number(variables.m365_months_per_year ?? 12.0);

  // Configurable weights (default 60% Cost, 40% Features)
  const weightCost = Number(variables.weight_cost_percentage ?? 60.0) / 100.0;
  const weightFeatures = Number(variables.weight_features_percentage ?? 40.0) / 100.0;

  // Athena rate constants from DB
  const costDlPage = Number(variables.COST_OF_1_DL_PAGE ?? 1.0);
  const costDmPage = Number(variables.COST_OF_1_DM_PAGE ?? 1.4);
  const costDhPage = Number(variables.COST_OF_1_DH_PAGE ?? 1.4);
  const costImage = Number(variables.COST_OF_1_IMAGE ?? 1.4);
  const costOther = Number(variables.COST_OF_1_OTHER ?? 1.4);
  const costEvalQ = Number(variables.COST_OF_1_EVAL_QUESTION ?? 1.0);
  const costProdQ = Number(variables.COST_OF_PROD_QUESTION ?? 1.0);
  const costCloudFixedPerMonth = Number(variables.COST_OF_CLOUD_FIXED_COST_PER_MONTH ?? 12000.0);
  const costAgentDoctorPerManday = Number(variables.COST_OF_AGENT_DOCTOR_PER_MANDAY ?? 16000.0);

  // Configurable cost threshold to override Easy Mode to Athena (default 350,000 THB)
  const costThresholdToPickAthena = Number(variables.COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD ?? 350000.0);

  // -------------------------------------------------------------
  // QUESTION 2: Microsoft Cost Calculation
  // -------------------------------------------------------------
  const H = Math.max(0, parseInt(hUsers, 10) || 0);
  const U = Math.max(0, parseInt(uUsers, 10) || 0);

  const additionalLicensesNeeded = Math.max(0, U - H);
  const m365AnnualCostUsd = additionalLicensesNeeded * licenseMonthlyUsd * monthsPerYear;
  const m365AnnualCostThb = m365AnnualCostUsd * usdThbRate;

  // -------------------------------------------------------------
  // QUESTION 3: Athena Cost Calculation (Gemini 3.1 Flash Lite)
  // -------------------------------------------------------------
  const DL = Math.max(0, parseFloat(athenaInputs.DL) || 0);
  const DL_AVG_PAGES = Math.max(0, parseFloat(athenaInputs.DL_AVG_PAGES) || 0);
  const DM = Math.max(0, parseFloat(athenaInputs.DM) || 0);
  const DM_AVG_PAGES = Math.max(0, parseFloat(athenaInputs.DM_AVG_PAGES) || 0);
  const DH = Math.max(0, parseFloat(athenaInputs.DH) || 0);
  const DH_AVG_PAGES = Math.max(0, parseFloat(athenaInputs.DH_AVG_PAGES) || 0);
  const IMG_COUNT = DH > 0 ? Math.max(0, parseFloat(athenaInputs.IMG_COUNT) || 0) : 0;
  const NOD = Math.max(0, parseFloat(athenaInputs.NOD) || 0);
  const AD = Math.max(0, parseInt(athenaInputs.AD, 10) || 0);
  const EVAL_Q = Math.max(0, parseFloat(athenaInputs.EVAL_Q) || 0);
  const EVAL_ATTEMPTS = Math.max(0, parseFloat(athenaInputs.EVAL_ATTEMPTS) || 0);
  // Section 1.4: Dev & PoC Duration
  const rawDevPoc = athenaInputs.DEV_POC_MONTHS !== undefined && athenaInputs.DEV_POC_MONTHS !== ''
    ? Math.max(0, parseFloat(athenaInputs.DEV_POC_MONTHS) || 0)
    : 2;
  const DEV_POC_MONTHS = Math.min(12, rawDevPoc);

  // Section 1.5: Agent Doctor Help on implementation
  const AGENT_DOCTOR_MANDAYS = Math.max(0, parseFloat(athenaInputs.AGENT_DOCTOR_MANDAYS) || 0);

  // Section 2: Pilot & Production
  const U_PROD = athenaInputs.U !== undefined && athenaInputs.U !== ''
    ? Math.max(0, parseInt(athenaInputs.U, 10) || 0)
    : U;
  const Q_PER_DAY = Math.max(0, parseFloat(athenaInputs.Q_PER_DAY) || 0);
  const rawProdMonths = athenaInputs.PROD_MONTHS !== undefined && athenaInputs.PROD_MONTHS !== ''
    ? Math.max(0, parseFloat(athenaInputs.PROD_MONTHS) || 0)
    : 10;
  // If PROD_MONTHS + DEV_POC_MONTHS exceeds 12, reduce PROD_MONTHS to make sure sum <= 12
  const PROD_MONTHS = Math.min(rawProdMonths, Math.max(0, 12 - DEV_POC_MONTHS));

  const effectiveCostOther = athenaInputs.COST_OF_1_OTHER !== undefined
    ? Number(athenaInputs.COST_OF_1_OTHER)
    : costOther;

  // Subtotals
  const costDlTotal = DL * DL_AVG_PAGES * costDlPage;
  const costDmTotal = DM * DM_AVG_PAGES * costDmPage;
  const costDhTotal = DH * DH_AVG_PAGES * costDhPage;
  const costImgTotal = IMG_COUNT * costImage;
  const costNodTotal = NOD * effectiveCostOther;
  const docsCostTotal = costDlTotal + costDmTotal + costDhTotal + costImgTotal + costNodTotal;

  const evalCostTotal = EVAL_Q * EVAL_ATTEMPTS * costEvalQ;
  const costCloudFixedDevPoc = DEV_POC_MONTHS * costCloudFixedPerMonth;
  const costAgentDoctorTotal = AGENT_DOCTOR_MANDAYS * costAgentDoctorPerManday;
  const athenaDevPocTotal = docsCostTotal + evalCostTotal + costCloudFixedDevPoc + costAgentDoctorTotal;

  const costProdUsageTotal = U_PROD * Q_PER_DAY * 30 * PROD_MONTHS * costProdQ;
  const costCloudFixedProd = PROD_MONTHS * costCloudFixedPerMonth;
  const athenaPilotProdTotal = costProdUsageTotal + costCloudFixedProd;
  const athenaTotalCostThb = athenaDevPocTotal + athenaPilotProdTotal;

  // -------------------------------------------------------------
  // Check if first 3 questions are completed
  // -------------------------------------------------------------
  // "Don't show tool recommendation until a user completes 3 first questions (readiness and cost)."
  const isQ1Answered = q1AgenticWorkflow !== null;
  const isQ2Answered = uUsers !== '' && uUsers !== null && !isNaN(uUsers);
  const isQ3Answered = (athenaInputs.DL !== '' && athenaInputs.DL !== undefined) || 
                       (athenaInputs.U !== '' && athenaInputs.U !== undefined) || 
                       athenaTotalCostThb > 0 || 
                       hasCompletedFirstThree;

  const isEligibleForRecommendation = hasCompletedFirstThree || (isQ1Answered && isQ2Answered && isQ3Answered);

  // If first 3 questions not yet completed, return pending state
  if (!isEligibleForRecommendation) {
    let completedCount = 0;
    if (isQ1Answered) completedCount++;
    if (isQ2Answered) completedCount++;
    if (isQ3Answered) completedCount++;

    return {
      scores: { m365_copilot: 34, copilot_studio: 33, athena: 33 },
      recommendedToolId: null,
      recommendedTool: null,
      m365AnnualCostUsd,
      m365AnnualCostThb,
      annualCostThb: m365AnnualCostThb,
      additionalLicensesNeeded,
      usdThbRate,
      licenseMonthlyUsd,
      H,
      U,
      athenaTotalCostThb,
      athenaDevPocTotal,
      athenaPilotProdTotal,
      athenaBreakdown: {
        DL,
        DL_AVG_PAGES,
        costDlTotal,
        DM,
        DM_AVG_PAGES,
        costDmTotal,
        DH,
        DH_AVG_PAGES,
        costDhTotal,
        IMG_COUNT,
        costImgTotal,
        NOD,
        costNodTotal,
        docsCostTotal,
        AD,
        EVAL_Q,
        EVAL_ATTEMPTS,
        evalCostTotal,
        DEV_POC_MONTHS,
        AGENT_DOCTOR_MANDAYS,
        costAgentDoctorPerManday,
        costAgentDoctorTotal,
        costCloudFixedPerMonth,
        costCloudFixedDevPoc,
        costCloudFixedProd,
        costCloudFixedTotal: costCloudFixedDevPoc + costCloudFixedProd,
        athenaDevPocTotal,
        U_PROD,
        Q_PER_DAY,
        PROD_MONTHS,
        costProdUsageTotal,
        athenaPilotProdTotal,
        athenaTotalCostThb,
        costDlPage,
        costDmPage,
        costDhPage,
        costImage,
        effectiveCostOther,
        costEvalQ,
        costProdQ
      },
      reasoning: [
        `การประเมินกำลังดำเนินการ (ตอบแล้ว ${completedCount} จาก 3 คำถามหลัก)`,
        'ระบบจะปลดล็อกผลการแนะนำเครื่องมือโดยอัตโนมัติเมื่อตอบข้อ 4 (ประมาณการค่าใช้จ่าย: Athena) เรียบร้อย'
      ],
      isDecisive: false,
      isPendingFirstThree: true,
      completedCoreCount: completedCount,
      costThresholdToPickAthena
    };
  }

  // -------------------------------------------------------------
  // Scoring Model: 60% Cost + 40% Features
  // -------------------------------------------------------------
  let costScores = { m365_copilot: 50, copilot_studio: 50, athena: 50 };
  let featureScores = { m365_copilot: 50, copilot_studio: 50, athena: 50 };
  let reasoning = [];

  // A. COST SCORING (60% Weight)
  if (m365AnnualCostThb === 0) {
    // All users covered by H -> Microsoft license is ฿0
    costScores.m365_copilot = 90;
    costScores.copilot_studio = 95;
    costScores.athena = 40;
  } else if (athenaTotalCostThb > 0 && athenaTotalCostThb < m365AnnualCostThb) {
    // Athena total cost is significantly less than Microsoft licenses
    const ratio = Math.min(3, m365AnnualCostThb / Math.max(1, athenaTotalCostThb));
    costScores.athena = Math.min(100, 70 + ratio * 10);
    costScores.copilot_studio = Math.max(15, 60 - ratio * 15);
    costScores.m365_copilot = Math.max(15, 50 - ratio * 15);
  } else if (athenaTotalCostThb > m365AnnualCostThb && m365AnnualCostThb > 0) {
    // Microsoft is cheaper than Athena
    costScores.copilot_studio = 80;
    costScores.m365_copilot = 75;
    costScores.athena = 45;
  }

  // B. FEATURES SCORING (40% Weight)
  // Question 1: Readiness
  if (q1AgenticWorkflow === 'no') {
    featureScores.m365_copilot += 80;
    featureScores.copilot_studio -= 60;
    featureScores.athena -= 60;
  } else if (q1AgenticWorkflow === 'yes') {
    featureScores.copilot_studio += 30;
    featureScores.athena += 30;
  }

  // Question 4: Non-M365/MDP Systems (e.g. SmartServe)
  // "If yes, recommend Athena."
  if (q4ConnectNonM365 === 'yes') {
    featureScores.athena += 70;
    featureScores.copilot_studio -= 40;
    featureScores.m365_copilot -= 40;
  }

  // Question 5: Move O365 Knowledge to OneDrive/SharePoint
  // "If no, recommend Microsoft solution."
  if (q5O365KnowledgeToSharepoint === 'no') {
    featureScores.m365_copilot += 65;
    featureScores.copilot_studio += 65;
    featureScores.athena -= 65;
  } else if (q5O365KnowledgeToSharepoint === 'yes') {
    featureScores.athena += 15;
    featureScores.copilot_studio += 15;
    featureScores.m365_copilot += 15;
  }

  // Question 6: UAM Governance & Ownership
  // "If no, recommend Athena."
  if (effectiveQ6Uam === 'no') {
    featureScores.athena += 60;
    featureScores.copilot_studio -= 35;
    featureScores.m365_copilot -= 30;
  }

  // Question 7: Local LLM or KBank/KBTG-hosted LLM
  // "If yes, recommend Athena."
  if (effectiveQ7Llm === 'yes') {
    featureScores.athena += 65;
    featureScores.copilot_studio -= 35;
    featureScores.m365_copilot -= 35;
  }

  // C. COMBINED WEIGHTED SCORE: (60% Cost + 40% Features)
  let rawWeightedScores = {
    m365_copilot: Math.max(5, (weightCost * costScores.m365_copilot) + (weightFeatures * featureScores.m365_copilot)),
    copilot_studio: Math.max(5, (weightCost * costScores.copilot_studio) + (weightFeatures * featureScores.copilot_studio)),
    athena: Math.max(5, (weightCost * costScores.athena) + (weightFeatures * featureScores.athena))
  };

  // D. CONFLICT DETECTION (Conflicting Requirements)
  const conflicts = [];

  // Conflict 1 (User Example 1): Q4 = 'yes' (Need non-M365/RQ/SmartServe -> Athena) AND Q5 = 'no' (Cannot move O365 knowledge -> Microsoft)
  if (q4ConnectNonM365 === 'yes' && q5O365KnowledgeToSharepoint === 'no') {
    conflicts.push({
      id: 'conflict_smartserve_vs_cannot_move_o365',
      title: 'ความขัดแย้งระหว่างการเชื่อมต่อระบบภายใน KBank อื่น กับข้อจำกัดการรวบรวมความรู้สู่ OneDrive',
      description: 'คำถามข้อ 5 ระบุว่าจำเป็นต้องเชื่อมต่อกับระบบภายใน KBank อื่นหรือใช้ UI ในระบบ KBank อื่น (เช่น ระบบ RQ, SmartServe) ซึ่งรองรับเฉพาะ Athena แต่คำถามข้อ 6 ระบุว่าไม่สามารถรวบรวมหรือจัดเก็บฐานความรู้ลงใน OneDrive/SharePoint ได้ (หรือต้องการใช้ Knowledge นอก Office 365 ซึ่งต้องติดต่อ KBTG EA ก่อนกรอกเนื่องจากเป็นโครงการ IT customized)',
      questionA: 'ข้อ 5 (ระบบภายใน KBank อื่น / ระบบ RQ / SmartServe) = ใช่ [แนะนำ Athena]',
      questionB: 'ข้อ 6 (รวบรวมความรู้สู่ OneDrive) = ทำไม่ได้ [แนะนำ Microsoft]'
    });
  }

  // Conflict 2 (User Example 2): Q4 = 'no' (M365 only -> Microsoft) AND Q6 = 'no' (No UAM governance ready -> Athena)
  if (q4ConnectNonM365 === 'no' && effectiveQ6Uam === 'no') {
    conflicts.push({
      id: 'conflict_m365_only_vs_no_uam_governance',
      title: 'ความขัดแย้งระหว่างระบบนิเวศ Microsoft ล้วน กับการไม่มีทีมกำกับดูแลสิทธิ์ UAM',
      description: 'คำถามข้อ 5 ระบุว่าไม่จำเป็นต้องเชื่อมต่อระบบภายนอก ใช้เฉพาะระบบนิเวศ Microsoft 365 / MDP ล้วน (เหมาะกับโซลูชัน Microsoft) แต่คำถามข้อ 7 ระบุว่าทีมงานไม่มีบุคลากร กระบวนการ และเวลาในการกำกับดูแลสิทธิ์ UAM และการส่งมอบ Agent แบบกระจายศูนย์ด้วยตนเอง (จำเป็นต้องใช้ระบบกำกับดูแล UAM รวมศูนย์ของ Athena)',
      questionA: 'ข้อ 5 (เชื่อมต่อระบบภายนอก M365) = ไม่ใช่ [แนะนำ Microsoft]',
      questionB: 'ข้อ 7 (ความพร้อมกำกับดูแลสิทธิ์ UAM) = ไม่มีความพร้อม [แนะนำ Athena]'
    });
  }

  // Conflict 3 (User Example 3): Q7 = 'yes' (Plan Local/KBTG LLM -> Athena) AND Q5 = 'no' (Cannot move O365 knowledge -> Microsoft)
  if (effectiveQ7Llm === 'yes' && q5O365KnowledgeToSharepoint === 'no') {
    conflicts.push({
      id: 'conflict_local_llm_vs_cannot_move_o365',
      title: 'ความขัดแย้งระหว่างแผนการใช้งาน Local LLM กับข้อจำกัดการรวบรวมความรู้สู่ OneDrive',
      description: 'คำถามข้อ 8 ระบุว่ามีแผนจะใช้งาน Local LLM หรือโมเดลที่โฮสต์บน KBank/KBTG ในอนาคต ซึ่งรองรับเฉพาะ Athena แต่คำถามข้อ 6 ระบุว่าไม่สามารถรวบรวมหรือจัดเก็บฐานความรู้ Office 365 ลงใน OneDrive/SharePoint ได้ ซึ่งจำเป็นต้องใช้โซลูชัน Microsoft เพื่อเข้าถึงข้อมูลได้โดยตรงแบบ In-Place Access',
      questionA: 'ข้อ 8 (แผนโมเดล Local / KBTG LLM) = มีแผนงาน [แนะนำ Athena]',
      questionB: 'ข้อ 6 (รวบรวมความรู้สู่ OneDrive) = ทำไม่ได้ [แนะนำ Microsoft]'
    });
  }

  // Conflict 4: Q5 = 'no' (Cannot move O365 knowledge -> Microsoft) AND Q6 = 'no' (No UAM governance -> Athena)
  if (q5O365KnowledgeToSharepoint === 'no' && effectiveQ6Uam === 'no') {
    conflicts.push({
      id: 'conflict_no_uam_vs_cannot_move_o365',
      title: 'ความขัดแย้งระหว่างข้อจำกัดการรวบรวมความรู้สู่ OneDrive กับการไม่มีทีมกำกับดูแลสิทธิ์ UAM',
      description: 'คำถามข้อ 6 ระบุว่าไม่สามารถรวบรวมฐานความรู้ลงใน OneDrive/SharePoint ได้ (จำเป็นต้องใช้โซลูชัน Microsoft เพื่อเข้าถึงข้อมูลใน Office 365) แต่คำถามข้อ 7 ระบุว่าไม่มีบุคลากรดูแลสิทธิ์ UAM และการโอนย้ายความเป็นเจ้าของ Agent แบบกระจายศูนย์ (ต้องการระบบกำกับดูแล UAM รวมศูนย์ของ Athena)',
      questionA: 'ข้อ 6 (รวบรวมความรู้สู่ OneDrive) = ทำไม่ได้ [แนะนำ Microsoft]',
      questionB: 'ข้อ 7 (ความพร้อมกำกับดูแลสิทธิ์ UAM) = ไม่มีความพร้อม [แนะนำ Athena]'
    });
  }

  // E. DECISIVE RULES & OVERRIDES
  let primaryRecommendationId = 'm365_copilot';
  let isCostThresholdOverride = false;
  const costDiffM365VsAthena = m365AnnualCostThb - athenaTotalCostThb;

  // Conflict Override: If conflicts exist, set tool to 'no_recommendation'
  if (conflicts.length > 0) {
    primaryRecommendationId = 'no_recommendation';
    rawWeightedScores = { m365_copilot: 34, copilot_studio: 33, athena: 33 };
    reasoning.push(
      `⚠️ ตรวจพบข้อกำหนดที่มีความขัดแย้งกันเชิงสถาปัตยกรรม (${conflicts.length} ประเด็น): ไม่สามารถสรุปเครื่องมือที่เหมาะสมได้ (ไม่มีคำตอบ) เนื่องจากคำตอบของท่านมีความต้องการที่ขัดแย้งกันระหว่างสองโซลูชัน`
    );
    conflicts.forEach(c => {
      reasoning.push(`[จุดขัดแย้ง] ${c.title}: ${c.description}`);
    });
    reasoning.push(
      'คำแนะนำในการแก้ไข: ควรจัดให้มีการทบทวนสถาปัตยกรรม (Architectural Review) ร่วมกับทีม Enterprise Architecture และทีมงานที่เกี่ยวข้อง เพื่อพิจารณาปรับเปลี่ยนข้อจำกัด เช่น การรวบรวมข้อมูลสู่ OneDrive/SharePoint เพื่อให้ใช้ Microsoft ได้ หรือการจัดตั้งกระบวนการ UAM รวมศูนย์เพื่อใช้ Athena'
    );
  }
  // Rule 0: Question 5 - If cannot move O365 knowledge into OneDrive/SharePoint,
  // Athena cannot ingest/access the files -> Must recommend Microsoft solution.
  // If team is ready for workflows (Q1 == 'yes'), recommend Copilot Studio;
  // If not ready (Q1 == 'no'), recommend Microsoft 365 Copilot.
  else if (q5O365KnowledgeToSharepoint === 'no') {
    if (q1AgenticWorkflow === 'yes') {
      primaryRecommendationId = 'copilot_studio';
      rawWeightedScores = { m365_copilot: 20, copilot_studio: 72, athena: 8 };
      reasoning.push(
        'ไม่สามารถรวบรวมฐานความรู้ Office 365 ลงใน OneDrive/SharePoint ได้ (คำถามข้อ 6: ไม่ใช่); แนะนำ Copilot Studio เพื่อสร้าง AI Agent ที่เชื่อมต่อและประมวลผลข้อมูลในระบบนิเวศ Office 365 ได้โดยตรงแบบ In-Place Access'
      );
    } else {
      primaryRecommendationId = 'm365_copilot';
      rawWeightedScores = { m365_copilot: 90, copilot_studio: 5, athena: 5 };
      reasoning.push(
        'ไม่สามารถรวบรวมฐานความรู้ Office 365 ลงใน OneDrive/SharePoint ได้ (คำถามข้อ 6: ไม่ใช่) และทีมงานยังไม่มีบุคลากรพร้อมสร้าง Workflow (คำถามข้อ 2: ไม่พร้อม); แนะนำ Microsoft 365 Copilot (Easy mode) Advanced license allow share ซึ่งเข้าถึงข้อมูล Office 365 ได้โดยตรงแบบสำเร็จรูป (Turnkey)'
      );
    }
  }
  // Rule 1: Q1 == 'no' -> Normally Microsoft 365 Copilot (Easy mode) Advanced license allow share
  // HOWEVER: Even though question 1 recommends Microsoft 365 Copilot (Easy mode) Advanced license allow share, if cost difference between
  // Microsoft and Athena is over 350,000 THB in the fashion of Microsoft is more expensive,
  // should recommend Athena. Configurable via COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD = 350000.
  else if (q1AgenticWorkflow === 'no') {
    if (costDiffM365VsAthena > costThresholdToPickAthena) {
      isCostThresholdOverride = true;
      primaryRecommendationId = 'athena';
      rawWeightedScores = { m365_copilot: 22, copilot_studio: 6, athena: 72 };
      reasoning.push(
        `การปรับเปลี่ยนตามเกณฑ์ต้นทุน (Cost Threshold Override): แม้ว่าคำถามข้อ 2 (Advanced Builder Readiness) จะแนะนำ Microsoft 365 Copilot (Easy mode) Advanced license allow share แต่เนื่องจากต้นทุนรายปีของ Microsoft (฿${m365AnnualCostThb.toLocaleString()}) สูงกว่าต้นทุน Athena (฿${athenaTotalCostThb.toLocaleString()}) ถึง ฿${costDiffM365VsAthena.toLocaleString()} บาท ซึ่งเกินกว่าเกณฑ์ที่กำหนดไว้ ฿${costThresholdToPickAthena.toLocaleString()} บาท (COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD = ${costThresholdToPickAthena.toLocaleString()}) จึงแนะนำให้เลือก Athena แทน เพื่อประหยัดต้นทุนองค์กรได้อย่างมีนัยสำคัญ`
      );
    } else {
      primaryRecommendationId = 'm365_copilot';
      rawWeightedScores = { m365_copilot: 92, copilot_studio: 4, athena: 4 };
      reasoning.push(
        'ทีมงานยังไม่มีบุคลากรพร้อมเรียนรู้ Multi-Stage Workflows (Advanced Builder Readiness: ไม่พร้อม); แนะนำให้ใช้ Microsoft 365 Copilot (Easy mode) Advanced license allow share ซึ่งเป็นโซลูชันสำเร็จรูปพร้อมใช้งานทันที (Turnkey)'
      );
      if (m365AnnualCostThb > 0) {
        reasoning.push(
          `ส่วนต่างต้นทุน ฿${Math.max(0, costDiffM365VsAthena).toLocaleString()} บาท ยังอยู่ในเกณฑ์ที่ยอมรับได้ ไม่เกิน ฿${costThresholdToPickAthena.toLocaleString()} บาท/ปี (COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD = ${costThresholdToPickAthena.toLocaleString()}); ระบบจึงยังคงแนะนำโซลูชัน Microsoft เพื่อให้มั่นใจว่าสนับสนุนระบบนิเวศ Microsoft (Favor Microsoft Solution) ด้านความพร้อมใช้งานทันที (Time-to-Market) และความสะดวกในการทำงานร่วมกับ Office 365 ได้ทันที`
        );
      }
    }
  }
  // Rule 2, 3, 4: Athena decisive criteria (Q4=yes, Q6=no, Q7=yes)
  else if (q4ConnectNonM365 === 'yes' || effectiveQ6Uam === 'no' || effectiveQ7Llm === 'yes') {
    primaryRecommendationId = 'athena';
    rawWeightedScores.athena = Math.max(68, rawWeightedScores.athena + 25);
    rawWeightedScores.copilot_studio = Math.min(22, rawWeightedScores.copilot_studio);
    rawWeightedScores.m365_copilot = Math.min(10, rawWeightedScores.m365_copilot);

    if (q4ConnectNonM365 === 'yes') {
      reasoning.push('จำเป็นต้องเชื่อมต่อกับระบบภายในของ KBank ภายนอก M365/MDP (เช่น SmartServe); มีเพียง Athena เท่านั้นที่รองรับการเชื่อมต่อนี้');
    }
    if (effectiveQ6Uam === 'no') {
      reasoning.push('ทีมงานยังไม่มีกระบวนการและบุคลากรสำหรับตรวจสอบสิทธิ์ Agent และส่งมอบความเป็นเจ้าของ; Athena มีระบบการกำกับดูแล UAM ระดับองค์กรแบบรวมศูนย์');
    }
    if (effectiveQ7Llm === 'yes') {
      reasoning.push('มีแผนการใช้งาน Local LLM หรือโมเดลที่โฮสต์บน KBank/KBTG ในอนาคต; มีเพียง Athena เท่านั้นที่รองรับ Internal Endpoint เหล่านี้');
    }
    if (q5O365KnowledgeToSharepoint === 'yes') {
      reasoning.push('สามารถรวบรวมหรือจัดเก็บฐานความรู้ลงใน OneDrive/SharePoint ได้ รองรับการเชื่อมต่อและการนำเข้าข้อมูลของ Athena ได้อย่างสมบูรณ์');
    }
  }
  // Rule 5: Team ready for workflows, no Athena-specific blocker
  else {
    if (m365AnnualCostThb === 0) {
      primaryRecommendationId = 'copilot_studio';
      rawWeightedScores.copilot_studio = Math.max(65, rawWeightedScores.copilot_studio);
      reasoning.push('ทีมงานมีผู้สร้าง Workflow และผู้ใช้งานทุกคนมีไลเซนส์ Microsoft ครอบคลุมอยู่แล้ว (ไม่มีต้นทุนไลเซนส์เพิ่มเติม ฿0)');
      reasoning.push('แนะนำ Copilot Studio เพื่อการทำงานร่วมกับระบบนิเวศ Power Platform และ Office 365 ได้อย่างราบรื่น');
    } else if (athenaTotalCostThb < m365AnnualCostThb) {
      primaryRecommendationId = 'athena';
      reasoning.push(`ต้นทุนดำเนินงานของ Athena (฿${athenaTotalCostThb.toLocaleString()}) ให้ความคุ้มค่าทางเศรษฐศาสตร์ด้านต้นทุน 60% ที่เหนือกว่าค่าไลเซนส์ Microsoft (฿${m365AnnualCostThb.toLocaleString()})`);
      reasoning.push('Athena ช่วยตัดค่าใช้จ่ายไลเซนส์รายบุคคล (Per-User Seat) พร้อมทั้งให้ขีดความสามารถ Agentic ขั้นสูงที่ปรับแต่งได้');
    } else {
      primaryRecommendationId = 'copilot_studio';
      reasoning.push(`ทีมงานมีศักยภาพในการสร้าง Agentic Workflow และต้นทุนไลเซนส์ (฿${m365AnnualCostThb.toLocaleString()}/ปี) สอดคล้องกับข้อกำหนดระบบนิเวศของ Microsoft`);
    }
  }

  // Normalize percentages to sum to 100%
  const totalRaw = rawWeightedScores.m365_copilot + rawWeightedScores.copilot_studio + rawWeightedScores.athena;
  const percentages = {
    m365_copilot: Math.round((rawWeightedScores.m365_copilot / totalRaw) * 100),
    copilot_studio: Math.round((rawWeightedScores.copilot_studio / totalRaw) * 100),
    athena: Math.max(0, 100 - (Math.round((rawWeightedScores.m365_copilot / totalRaw) * 100) + Math.round((rawWeightedScores.copilot_studio / totalRaw) * 100)))
  };

  const toolMap = {};
  tools.forEach(t => { toolMap[t.id] = t; });

  const fallbackNoRec = {
    id: 'no_recommendation',
    name: 'ไม่มีคำตอบ',
    mode_name: 'คำตอบมีความขัดแย้งกัน (Conflicting Requirements)',
    badge: 'ไม่สามารถสรุปเครื่องมือได้ • สถาปัตยกรรมขัดแย้ง',
    tagline: 'ข้อกำหนดทางเทคนิคและสถาปัตยกรรมมีความขัดแย้งกัน จำเป็นต้องทบทวนความต้องการ',
    description: 'ผลการประเมินพบข้อกำหนดที่มีความขัดแย้งกันระหว่างโซลูชัน เช่น สถาปัตยกรรมต้องการเชื่อมต่อระบบภายในเฉพาะของ Athena หรือ Local LLM แต่ไม่สามารถย้ายเอกสารออกจากระบบ Office 365 ได้ หรือระบบเน้น Microsoft ล้วนแต่ไม่มีทีมกำกับดูแล UAM แบบกระจายศูนย์ จึงไม่สามารถเลือกโซลูชันใดโซลูชันหนึ่งได้อย่างสมบูรณ์แบบ แนะนำให้ปรึกษาทีม Enterprise Architecture หรือทบทวนข้อกำหนดร่วมกัน',
    primary_color: '#E11D48',
    bg_color: 'bg-rose-50',
    border_color: 'border-rose-300',
    text_color: 'text-rose-700',
    ideal_for: 'กรณีที่คำตอบของผู้ประเมินมีข้อขัดแย้งเชิงโครงสร้างสถาปัตยกรรม (Architectural Conflicts)',
    pros: 'ช่วยตรวจจับความเสี่ยงและความขัดแย้งเชิงสถาปัตยกรรมได้ทันทีตั้งแต่ช่วงวางแผน ป้องกันการลงทุนในโซลูชันที่ไม่ตอบโจทย์',
    cons: 'ไม่สามารถตัดสินใจเลือกเครื่องมือได้ทันที จำเป็นต้องประสานงานฝ่ายที่เกี่ยวข้องเพื่อปรับเงื่อนไขข้อจำกัด',
    workflow_complexity: 'ต้องทบทวนเชิงสถาปัตยกรรม (Architectural Review)'
  };

  const recommendedTool = toolMap[primaryRecommendationId] || (primaryRecommendationId === 'no_recommendation' ? fallbackNoRec : null);

  return {
    scores: percentages,
    rawWeightedScores,
    costScores,
    featureScores,
    weightCost: weightCost * 100,
    weightFeatures: weightFeatures * 100,
    recommendedToolId: primaryRecommendationId,
    recommendedTool,
    m365AnnualCostUsd,
    m365AnnualCostThb,
    annualCostThb: m365AnnualCostThb,
    additionalLicensesNeeded,
    usdThbRate,
    licenseMonthlyUsd,
    H,
    U,
    athenaTotalCostThb,
    athenaDevPocTotal,
    athenaPilotProdTotal,
    athenaBreakdown: {
      DL,
      DL_AVG_PAGES,
      costDlTotal,
      DM,
      DM_AVG_PAGES,
      costDmTotal,
      DH,
      DH_AVG_PAGES,
      costDhTotal,
      IMG_COUNT,
      costImgTotal,
      NOD,
      costNodTotal,
      docsCostTotal,
      AD,
      EVAL_Q,
      EVAL_ATTEMPTS,
      evalCostTotal,
      DEV_POC_MONTHS,
      AGENT_DOCTOR_MANDAYS,
      costAgentDoctorPerManday,
      costAgentDoctorTotal,
      costCloudFixedPerMonth,
      costCloudFixedDevPoc,
      costCloudFixedProd,
      costCloudFixedTotal: costCloudFixedDevPoc + costCloudFixedProd,
      athenaDevPocTotal,
      U_PROD,
      Q_PER_DAY,
      PROD_MONTHS,
      costProdUsageTotal,
      athenaPilotProdTotal,
      athenaTotalCostThb,
      costDlPage,
      costDmPage,
      costDhPage,
      costImage,
      effectiveCostOther,
      costEvalQ,
      costProdQ
    },
    reasoning,
    isDecisive: true,
    isPendingFirstThree: false,
    isConflict: conflicts.length > 0,
    conflicts,
    isCostThresholdOverride,
    costDiffM365VsAthena,
    costThresholdToPickAthena,
    q4ConnectNonM365,
    q5O365KnowledgeToSharepoint,
    q6UamGovernance: effectiveQ6Uam,
    q7LocalKbtgLlm: effectiveQ7Llm
  };
}
