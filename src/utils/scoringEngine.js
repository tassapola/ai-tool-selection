/**
 * Computes tool recommendation scores and cost breakdown based on user responses and database variables.
 */
export function calculateEvaluation({
  q1AgenticWorkflow, // 'yes' | 'no' | null
  hUsers = 0,        // Number of existing Advanced licenses
  uUsers = 0,        // Number of users needed
  variables = {},    // Values from SQLite config_variables table
  tools = []         // Tools from SQLite tools table
}) {
  // Read dynamic variables from DB with safe defaults
  const usdThbRate = Number(variables.usd_thb_rate ?? 35.0);
  const licenseMonthlyUsd = Number(variables.m365_license_monthly_usd ?? 20.0);
  const monthsPerYear = Number(variables.m365_months_per_year ?? 12.0);
  const athenaThresholdThb = Number(variables.athena_high_cost_threshold_thb ?? 210000.0);
  const athenaMinUsers = Number(variables.athena_min_user_scale ?? 30.0);

  // Parse H and U safely as non-negative integers
  const H = Math.max(0, parseInt(hUsers, 10) || 0);
  const U = Math.max(0, parseInt(uUsers, 10) || 0);

  // Question 2 Cost Calculation:
  // If U <= H, cost is 0
  // Otherwise, cost is (U - H) * $20 * 12 months * exchange_rate
  const additionalLicensesNeeded = Math.max(0, U - H);
  const annualCostUsd = additionalLicensesNeeded * licenseMonthlyUsd * monthsPerYear;
  const annualCostThb = annualCostUsd * usdThbRate;

  // Initial tool score containers
  let scores = {
    m365_copilot: 0,
    copilot_studio: 0,
    athena: 0
  };

  let primaryRecommendationId = 'm365_copilot';
  let reasoning = [];
  let isDecisive = false;

  // Unanswered state
  if (!q1AgenticWorkflow) {
    return {
      scores: { m365_copilot: 34, copilot_studio: 33, athena: 33 },
      recommendedToolId: null,
      recommendedTool: null,
      annualCostUsd,
      annualCostThb,
      additionalLicensesNeeded,
      usdThbRate,
      licenseMonthlyUsd,
      H,
      U,
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

    // Evaluate cost and user scale
    if (annualCostThb === 0) {
      // U <= H: Zero incremental license cost
      scores.copilot_studio = 65;
      scores.athena = 20;
      primaryRecommendationId = 'copilot_studio';
      reasoning.push('Your team has members ready to build multi-stage agentic workflows.');
      reasoning.push(`All ${U} users are already covered by existing Microsoft licenses (${H} available), resulting in ฿0 additional annual license fees.`);
      reasoning.push('Microsoft 365 Copilot Studio is strongly recommended for native workflow orchestration and connectors at zero incremental seat cost.');
    } else if (annualCostThb >= athenaThresholdThb || U >= athenaMinUsers) {
      // High additional license cost or large team scale -> Athena is favored
      scores.athena = 60;
      scores.copilot_studio = 25;
      primaryRecommendationId = 'athena';
      reasoning.push('Your team is technically equipped for multi-stage workflow engineering.');
      reasoning.push(`Additional Microsoft licensing would cost ฿${annualCostThb.toLocaleString()} / year (${additionalLicensesNeeded} extra users needed).`);
      reasoning.push('Athena (Internal System) is recommended to eliminate recurring per-seat Microsoft license fees while providing deep internal customization.');
    } else {
      // Moderate cost, team ready for workflows
      scores.copilot_studio = 55;
      scores.athena = 30;
      primaryRecommendationId = 'copilot_studio';
      reasoning.push('Your team has the capability to learn and construct multi-stage agentic workflows.');
      reasoning.push(`Additional Microsoft licensing is manageable at ฿${annualCostThb.toLocaleString()} / year for ${additionalLicensesNeeded} extra licenses.`);
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
    annualCostUsd,
    annualCostThb,
    additionalLicensesNeeded,
    usdThbRate,
    licenseMonthlyUsd,
    H,
    U,
    reasoning,
    isDecisive
  };
}
