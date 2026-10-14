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
  // Question 4, 5, 6 (Features & Governance)
  q4ConnectNonM365 = null, // 'yes' | 'no' | null (KBank systems outside M365/MDP e.g. SmartServe)
  q5UamGovernance = null,  // 'yes' | 'no' | null (UAM governance & ownership transfer accountability)
  q6LocalKbtgLlm = null,   // 'yes' | 'no' | null (Local LLM or KBank/KBTG-hosted LLM)
  // Assessment progress flag
  hasCompletedFirstThree = false,
  variables = {},
  tools = []
}) {
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

  // Configurable cost threshold to override Easy Mode to Athena (default 500,000 THB)
  const costThresholdToPickAthena = Number(variables.COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD ?? 500000.0);

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

  // Section 2: Pilot & Production
  const U_PROD = athenaInputs.U !== undefined && athenaInputs.U !== ''
    ? Math.max(0, parseInt(athenaInputs.U, 10) || 0)
    : U;
  const Q_PER_DAY = Math.max(0, parseFloat(athenaInputs.Q_PER_DAY) || 0);
  const PROD_MONTHS = Math.max(0, parseFloat(athenaInputs.PROD_MONTHS) || 0);

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
  const athenaDevPocTotal = docsCostTotal + evalCostTotal;
  const athenaPilotProdTotal = U_PROD * Q_PER_DAY * 30 * PROD_MONTHS * costProdQ;
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
        costDlTotal,
        costDmTotal,
        costDhTotal,
        costImgTotal,
        costNodTotal,
        docsCostTotal,
        evalCostTotal,
        athenaDevPocTotal,
        athenaPilotProdTotal,
        athenaTotalCostThb,
        U_PROD,
        Q_PER_DAY,
        PROD_MONTHS
      },
      reasoning: [
        `Assessment in progress (${completedCount} of 3 core questions answered).`,
        'Tool recommendation unlocks automatically once you complete Question 3 (Cost estimation: Athena).'
      ],
      isDecisive: false,
      isPendingFirstThree: true,
      completedCoreCount: completedCount
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

  // Question 5: UAM Governance & Ownership
  // "If no, recommend Athena."
  if (q5UamGovernance === 'no') {
    featureScores.athena += 60;
    featureScores.copilot_studio -= 35;
    featureScores.m365_copilot -= 30;
  }

  // Question 6: Local LLM or KBank/KBTG-hosted LLM
  // "If yes, recommend Athena."
  if (q6LocalKbtgLlm === 'yes') {
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

  // D. DECISIVE RULES & OVERRIDES
  let primaryRecommendationId = 'm365_copilot';

  // Rule 1: Q1 == 'no' -> Normally Microsoft 365 Copilot (Easy Mode)
  // HOWEVER: Even though question 1 recommends Microsoft copilot easy mode, if cost difference between
  // Microsoft and Athena is over 500,000 THB in the fashion of Microsoft is more expensive,
  // should recommend Athena. Configurable via COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD = 500000.
  let isCostThresholdOverride = false;
  const costDiffM365VsAthena = m365AnnualCostThb - athenaTotalCostThb;

  if (q1AgenticWorkflow === 'no') {
    if (costDiffM365VsAthena > costThresholdToPickAthena) {
      isCostThresholdOverride = true;
      primaryRecommendationId = 'athena';
      rawWeightedScores = { m365_copilot: 22, copilot_studio: 6, athena: 72 };
      reasoning.push(
        `Cost Threshold Override: Even though Question 1 (Advanced Builder Readiness) recommended Microsoft Copilot Easy Mode, Microsoft annual cost (฿${m365AnnualCostThb.toLocaleString()}) exceeds Athena cost (฿${athenaTotalCostThb.toLocaleString()}) by ฿${costDiffM365VsAthena.toLocaleString()} THB. Because this exceeds the configured threshold of ฿${costThresholdToPickAthena.toLocaleString()} THB (COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD = ${costThresholdToPickAthena.toLocaleString()}), Athena is recommended instead to capture substantial enterprise cost savings.`
      );
    } else {
      primaryRecommendationId = 'm365_copilot';
      rawWeightedScores = { m365_copilot: 92, copilot_studio: 4, athena: 4 };
      reasoning.push(
        'Team does not have a member to learn multi-stage workflows (Advanced Builder Readiness: No); Microsoft 365 Copilot (Easy Mode) is recommended as the turnkey solution.'
      );
      if (m365AnnualCostThb > 0) {
        reasoning.push(
          `Cost difference of ฿${Math.max(0, costDiffM365VsAthena).toLocaleString()} THB is within the allowed threshold of ฿${costThresholdToPickAthena.toLocaleString()} THB (COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD = ${costThresholdToPickAthena.toLocaleString()}); Easy Mode recommendation stands.`
        );
      }
    }
  }
  // Rule 2, 3, 4: Athena decisive criteria (Q4=yes, Q5=no, Q6=yes)
  else if (q4ConnectNonM365 === 'yes' || q5UamGovernance === 'no' || q6LocalKbtgLlm === 'yes') {
    primaryRecommendationId = 'athena';
    rawWeightedScores.athena = Math.max(68, rawWeightedScores.athena + 25);
    rawWeightedScores.copilot_studio = Math.min(22, rawWeightedScores.copilot_studio);
    rawWeightedScores.m365_copilot = Math.min(10, rawWeightedScores.m365_copilot);

    if (q4ConnectNonM365 === 'yes') {
      reasoning.push('Required connectivity to KBank internal systems outside M365/MDP (e.g. SmartServe); Athena is uniquely capable.');
    }
    if (q5UamGovernance === 'no') {
      reasoning.push('Team lacks resources for manual agent permission reviews and ownership transfer; Athena provides centralized enterprise UAM governance.');
    }
    if (q6LocalKbtgLlm === 'yes') {
      reasoning.push('Future roadmap includes Local LLMs or KBank/KBTG-hosted models; only Athena supports custom internal model endpoints.');
    }
  }
  // Rule 5: Team ready for workflows, no Athena-specific blocker
  else {
    if (m365AnnualCostThb === 0) {
      primaryRecommendationId = 'copilot_studio';
      rawWeightedScores.copilot_studio = Math.max(65, rawWeightedScores.copilot_studio);
      reasoning.push('Team has workflow builders and all users are covered by existing Microsoft licenses (฿0 incremental seat tax).');
      reasoning.push('Copilot Studio is recommended for seamless Power Platform and Office 365 ecosystem synergy.');
    } else if (athenaTotalCostThb < m365AnnualCostThb) {
      primaryRecommendationId = 'athena';
      reasoning.push(`Athena operational cost (฿${athenaTotalCostThb.toLocaleString()}) delivers superior 60% cost economics over Microsoft licensing (฿${m365AnnualCostThb.toLocaleString()}).`);
      reasoning.push('Athena eliminates recurring per-user seat licenses while providing custom agentic capabilities.');
    } else {
      primaryRecommendationId = 'copilot_studio';
      reasoning.push(`Team has agentic workflow capacity and licensing cost (฿${m365AnnualCostThb.toLocaleString()}/yr) aligns with Microsoft ecosystem requirements.`);
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
  const recommendedTool = toolMap[primaryRecommendationId] || null;

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
      costDlTotal,
      costDmTotal,
      costDhTotal,
      costImgTotal,
      costNodTotal,
      docsCostTotal,
      evalCostTotal,
      athenaDevPocTotal,
      athenaPilotProdTotal,
      athenaTotalCostThb,
      U_PROD,
      Q_PER_DAY,
      PROD_MONTHS
    },
    reasoning,
    isDecisive: true,
    isPendingFirstThree: false,
    isCostThresholdOverride,
    costDiffM365VsAthena,
    costThresholdToPickAthena
  };
}
