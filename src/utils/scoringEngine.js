/**
 * Computes tool recommendation scores, Microsoft license cost, and Athena infrastructure cost
 * based on user inputs and SQLite database variables.
 */
export function calculateEvaluation({
  q1AgenticWorkflow, // 'yes' | 'no' | null
  // Question 2 (Microsoft Solution)
  hUsers = 0,        // Number of existing Advanced licenses (H)
  uUsers = 0,        // Number of users needed (U)
  // Question 3 (Athena Solution)
  athenaInputs = {}, // DL, DL_AVG_PAGES, DM, DM_AVG_PAGES, DH, DH_AVG_PAGES, IMG_COUNT, NOD, AD, EVAL_Q, EVAL_ATTEMPTS, U_ATHENA, Q_PER_DAY, PROD_MONTHS
  variables = {},    // Values from SQLite config_variables table
  tools = []         // Tools from SQLite tools table
}) {
  // Read dynamic variables from DB with safe defaults
  const usdThbRate = Number(variables.usd_thb_rate ?? 35.0);
  const licenseMonthlyUsd = Number(variables.m365_license_monthly_usd ?? 20.0);
  const monthsPerYear = Number(variables.m365_months_per_year ?? 12.0);

  // Athena rate constants from DB
  const costDlPage = Number(variables.COST_OF_1_DL_PAGE ?? 1.0);
  const costDmPage = Number(variables.COST_OF_1_DM_PAGE ?? 1.4);
  const costDhPage = Number(variables.COST_OF_1_DH_PAGE ?? 1.4);
  const costImage = Number(variables.COST_OF_1_IMAGE ?? 1.4);
  const costOther = Number(variables.COST_OF_1_OTHER ?? 1.4);
  const costEvalQ = Number(variables.COST_OF_1_EVAL_QUESTION ?? 1.0);
  const costProdQ = Number(variables.COST_OF_PROD_QUESTION ?? 1.0);

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
  // Use either dedicated Athena user input or fallback to general U
  const U_PROD = athenaInputs.U !== undefined && athenaInputs.U !== ''
    ? Math.max(0, parseInt(athenaInputs.U, 10) || 0)
    : U;
  const Q_PER_DAY = Math.max(0, parseFloat(athenaInputs.Q_PER_DAY) || 0);
  const PROD_MONTHS = Math.max(0, parseFloat(athenaInputs.PROD_MONTHS) || 0);

  // Custom unit override if provided in example mode
  const effectiveCostOther = athenaInputs.COST_OF_1_OTHER !== undefined
    ? Number(athenaInputs.COST_OF_1_OTHER)
    : costOther;

  // Section 1.1 Breakdown
  const costDlTotal = DL * DL_AVG_PAGES * costDlPage;
  const costDmTotal = DM * DM_AVG_PAGES * costDmPage;
  const costDhTotal = DH * DH_AVG_PAGES * costDhPage;
  const costImgTotal = IMG_COUNT * costImage;
  const costNodTotal = NOD * effectiveCostOther;
  const docsCostTotal = costDlTotal + costDmTotal + costDhTotal + costImgTotal + costNodTotal;

  // Section 1.3 Breakdown
  const evalCostTotal = EVAL_Q * EVAL_ATTEMPTS * costEvalQ;

  // Section 1: Dev & PoC Total
  const athenaDevPocTotal = docsCostTotal + evalCostTotal;

  // Section 2: Pilot & Production Total
  // Formula: U x Q_PER_DAY x 30 x PROD_MONTHS x COST_OF_PROD_QUESTION
  const athenaPilotProdTotal = U_PROD * Q_PER_DAY * 30 * PROD_MONTHS * costProdQ;

  // Athena Total Cost
  const athenaTotalCostThb = athenaDevPocTotal + athenaPilotProdTotal;

  // -------------------------------------------------------------
  // Tool Scoring Logic
  // -------------------------------------------------------------
  let scores = {
    m365_copilot: 0,
    copilot_studio: 0,
    athena: 0
  };

  let primaryRecommendationId = 'm365_copilot';
  let reasoning = [];
  let isDecisive = false;

  // Unanswered Q1 state
  if (!q1AgenticWorkflow) {
    return {
      scores: { m365_copilot: 34, copilot_studio: 33, athena: 33 },
      recommendedToolId: null,
      recommendedTool: null,
      m365AnnualCostUsd,
      m365AnnualCostThb,
      annualCostThb: m365AnnualCostThb, // Alias for backward compatibility
      additionalLicensesNeeded,
      usdThbRate,
      licenseMonthlyUsd,
      H,
      U,
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
      reasoning: ['Please answer Question 1 to begin personalized tool scoring.'],
      isDecisive: false
    };
  }

  // --- RULE 1: Question 1 is 'no' ---
  // "If the answer is no, tool recommendation is Microsoft 365 (easy mode)."
  if (q1AgenticWorkflow === 'no') {
    scores.m365_copilot = 92;
    scores.copilot_studio = 4;
    scores.athena = 4;
    primaryRecommendationId = 'm365_copilot';
    isDecisive = true;
    reasoning.push('Your team does not have a dedicated builder to learn multi-stage agentic workflows.');
    reasoning.push('Microsoft 365 Copilot (Easy Mode) is recommended because it provides immediate out-of-the-box productivity directly in Word, Excel, Teams, and Outlook with zero workflow designer learning curve.');
  } 
  // --- RULE 2: Question 1 is 'yes' ---
  else if (q1AgenticWorkflow === 'yes') {
    isDecisive = true;
    scores.m365_copilot = 15; // Easy mode is suboptimal for teams needing multi-stage workflows

    // When U <= H: Microsoft has 0 additional license fees!
    if (m365AnnualCostThb === 0) {
      scores.copilot_studio = 65;
      scores.athena = 20;
      primaryRecommendationId = 'copilot_studio';
      reasoning.push('Your team has members ready to build multi-stage agentic workflows.');
      reasoning.push(`All ${U} users are already covered by existing Microsoft licenses (${H} available), resulting in ฿0 additional annual license fees.`);
      reasoning.push('Microsoft 365 Copilot Studio is strongly recommended for native workflow orchestration and connectors at zero incremental seat cost.');
    } 
    // When Microsoft has license cost, compare with Athena economics
    else if (athenaTotalCostThb > 0 && athenaTotalCostThb < m365AnnualCostThb) {
      // Athena is cheaper overall than Microsoft licenses!
      scores.athena = 65;
      scores.copilot_studio = 20;
      primaryRecommendationId = 'athena';
      reasoning.push('Your team is technically equipped for multi-stage workflow engineering.');
      reasoning.push(`Athena deployment cost (฿${athenaTotalCostThb.toLocaleString()}) provides superior ROI over Microsoft additional licensing (฿${m365AnnualCostThb.toLocaleString()}).`);
      reasoning.push('Athena (Internal System) powered by Gemini 3.1 Flash Lite eliminates recurring per-seat Microsoft license fees with full customization.');
    } 
    else if (m365AnnualCostThb >= 210000 || U >= 30) {
      // High annual Microsoft license cost (>฿210k / 25+ users)
      scores.athena = 58;
      scores.copilot_studio = 27;
      primaryRecommendationId = 'athena';
      reasoning.push('Your team is technically equipped for multi-stage workflow engineering.');
      reasoning.push(`Additional Microsoft licensing would cost ฿${m365AnnualCostThb.toLocaleString()} / year (${additionalLicensesNeeded} extra users needed).`);
      reasoning.push('Athena (Internal System) is recommended to scale across enterprise documents without per-user seat tax.');
    } 
    else {
      // Moderate cost, team ready for workflows
      scores.copilot_studio = 55;
      scores.athena = 30;
      primaryRecommendationId = 'copilot_studio';
      reasoning.push('Your team has the capability to learn and construct multi-stage agentic workflows.');
      reasoning.push(`Additional Microsoft licensing is manageable at ฿${m365AnnualCostThb.toLocaleString()} / year for ${additionalLicensesNeeded} extra licenses.`);
      reasoning.push('Microsoft 365 Copilot Studio is recommended for seamless Microsoft 365 ecosystem synergy.');
    }
  }

  // Calculate percentage distribution for the left-to-right bar
  const totalScore = scores.m365_copilot + scores.copilot_studio + scores.athena;
  const percentages = {
    m365_copilot: Math.round((scores.m365_copilot / totalScore) * 100),
    copilot_studio: Math.round((scores.copilot_studio / totalScore) * 100),
    athena: Math.max(0, 100 - (Math.round((scores.m365_copilot / totalScore) * 100) + Math.round((scores.copilot_studio / totalScore) * 100)))
  };

  const toolMap = {};
  tools.forEach(t => { toolMap[t.id] = t; });
  const recommendedTool = toolMap[primaryRecommendationId] || null;

  return {
    scores: percentages,
    rawScores: scores,
    recommendedToolId: primaryRecommendationId,
    recommendedTool,
    // Microsoft figures
    m365AnnualCostUsd,
    m365AnnualCostThb,
    annualCostThb: m365AnnualCostThb, // Alias
    additionalLicensesNeeded,
    usdThbRate,
    licenseMonthlyUsd,
    H,
    U,
    // Athena figures
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
    isDecisive
  };
}
