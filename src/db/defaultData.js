// Default seed data for the SQLite database
export const DEFAULT_CONFIG_VARIABLES = [
  {
    key: 'usd_thb_rate',
    value: 35.0,
    data_type: 'number',
    unit: 'THB/USD',
    label: 'USD to THB Exchange Rate',
    category: 'pricing',
    description: 'Current currency exchange rate used to convert USD costs into Thai Baht.'
  },
  {
    key: 'm365_license_monthly_usd',
    value: 20.0,
    data_type: 'number',
    unit: 'USD/user/month',
    label: 'Microsoft 365 Add-on License Cost',
    category: 'pricing',
    description: 'Cost per additional user per month for Microsoft 365 Copilot / Advanced license.'
  },
  {
    key: 'm365_months_per_year',
    value: 12.0,
    data_type: 'number',
    unit: 'months',
    label: 'Months per Year',
    category: 'pricing',
    description: 'Multiplier for annualizing recurring monthly license fees.'
  },
  // Scoring Weights: Cost = 60%, Features = 40%
  {
    key: 'weight_cost_percentage',
    value: 60.0,
    data_type: 'number',
    unit: '%',
    label: 'Cost Evaluation Weight',
    category: 'weights',
    description: 'Weight assigned to licensing & infrastructure cost economics (default 60%).'
  },
  {
    key: 'weight_features_percentage',
    value: 40.0,
    data_type: 'number',
    unit: '%',
    label: 'Features & Architecture Weight',
    category: 'weights',
    description: 'Weight assigned to readiness, enterprise integration, governance, and model hosting (default 40%).'
  },
  // Athena Cost Variables (Gemini 3.1 Flash Lite model)
  {
    key: 'COST_OF_1_DL_PAGE',
    value: 1.0,
    data_type: 'number',
    unit: 'THB/page',
    label: 'Cost per page (docx, txt, md)',
    category: 'athena',
    description: 'Processing cost per page of docx, txt, md documents for Athena indexing/chunking.'
  },
  {
    key: 'COST_OF_1_DM_PAGE',
    value: 1.4,
    data_type: 'number',
    unit: 'THB/page',
    label: 'Cost per page (pdf, pptx without images)',
    category: 'athena',
    description: 'Processing cost per page of text-only PDF and PPTX documents.'
  },
  {
    key: 'COST_OF_1_DH_PAGE',
    value: 1.4,
    data_type: 'number',
    unit: 'THB/page',
    label: 'Cost per page (pdf, pptx with images)',
    category: 'athena',
    description: 'Processing cost per page of image-heavy PDF and PPTX documents.'
  },
  {
    key: 'COST_OF_1_IMAGE',
    value: 1.4,
    data_type: 'number',
    unit: 'THB/image',
    label: 'Cost per 1 image extraction',
    category: 'athena',
    description: 'Multimodal vision embedding cost per image in documents.'
  },
  {
    key: 'COST_OF_1_OTHER',
    value: 1.4,
    data_type: 'number',
    unit: 'THB/doc',
    label: 'Cost per 1 other document',
    category: 'athena',
    description: 'Handling cost for other miscellaneous document formats.'
  },
  {
    key: 'COST_OF_1_EVAL_QUESTION',
    value: 1.0,
    data_type: 'number',
    unit: 'THB/eval question',
    label: 'Cost per 1 evaluation question',
    category: 'athena',
    description: 'Cost for automated model evaluation question inference.'
  },
  {
    key: 'COST_OF_PROD_QUESTION',
    value: 1.0,
    data_type: 'number',
    unit: 'THB/chat bubble',
    label: 'Cost per 1 production chat question',
    category: 'athena',
    description: 'Inference and retrieval cost per user chat bubble in pilot & production.'
  },
  // Thresholds & Weights
  {
    key: 'studio_readiness_weight',
    value: 40.0,
    data_type: 'number',
    unit: 'points',
    label: 'Copilot Studio Agentic Weight',
    category: 'scoring',
    description: 'Points awarded to Copilot Studio if team has an agentic workflow builder.'
  },
  {
    key: 'athena_readiness_weight',
    value: 35.0,
    data_type: 'number',
    unit: 'points',
    label: 'Athena Agentic Readiness Weight',
    category: 'scoring',
    description: 'Points awarded to Athena if team has an agentic workflow builder.'
  },
  {
    key: 'm365_easy_penalty_if_complex',
    value: 30.0,
    data_type: 'number',
    unit: 'points',
    label: 'Easy Mode Penalty for Complex Needs',
    category: 'scoring',
    description: 'Deduction for Easy Mode when multi-stage agentic workflow is required.'
  },
  {
    key: 'athena_high_cost_threshold_thb',
    value: 210000.0,
    data_type: 'number',
    unit: 'THB/year',
    label: 'Athena High-Cost Pivot Threshold',
    category: 'threshold',
    description: 'When annual Microsoft licensing costs exceed this threshold (~25+ extra users), Athena internal platform becomes heavily favored.'
  },
  {
    key: 'athena_min_user_scale',
    value: 30.0,
    data_type: 'number',
    unit: 'users',
    label: 'Athena Scale Threshold',
    category: 'threshold',
    description: 'Minimum user volume where internal system Athena delivers superior ROI.'
  }
];

export const DEFAULT_TOOLS = [
  {
    id: 'm365_copilot',
    name: 'Microsoft 365 Copilot',
    mode_name: 'Easy Mode',
    badge: 'Turnkey • Zero Learning Curve',
    tagline: 'Instant out-of-the-box productivity & enterprise chat',
    description: 'Pre-built Microsoft 365 AI integration embedded directly in Word, Excel, Teams, and Outlook. Perfect for immediate adoption without needing dedicated workflow builders.',
    primary_color: '#2563EB', // Blue-600
    bg_color: 'bg-blue-50',
    border_color: 'border-blue-300',
    text_color: 'text-blue-700',
    ideal_for: 'Teams wanting rapid time-to-value without multi-step workflow engineering.',
    pros: 'Zero setup time, native Office 365 integration, seamless security compliance',
    cons: 'Limited custom multi-stage chaining, fixed prompt interface, per-user monthly license',
    workflow_complexity: 'Low (Pre-built)'
  },
  {
    id: 'copilot_studio',
    name: 'Microsoft 365 Copilot Studio',
    mode_name: 'Builder Multi-Step Workflow',
    badge: 'Multi-Step Agentic Builder',
    tagline: 'Design autonomous multi-stage flows, connectors & triggers',
    description: 'Visual low-code canvas to engineer multi-stage agentic workflows, dynamic prompt chaining, Power Automate connectors, and custom multi-agent orchestration.',
    primary_color: '#7C3AED', // Violet-600
    bg_color: 'bg-purple-50',
    border_color: 'border-purple-300',
    text_color: 'text-purple-700',
    ideal_for: 'Teams with at least one member ready to learn flow designer and build multi-stage agentic logic within Microsoft 365/MDP ecosystem.',
    pros: 'Visual flow designer, enterprise connectors, agentic multi-stage triggers, Microsoft ecosystem synergy',
    cons: 'Requires builder learning curve, requires decentralized UAM governance management, additional licensing governance',
    workflow_complexity: 'High (Visual Builder)'
  },
  {
    id: 'athena',
    name: 'Athena',
    mode_name: 'Internal Agentic Platform',
    badge: 'Custom Enterprise System (Gemini 3.1 Flash Lite)',
    tagline: 'High-scale internal agent with zero per-user seat license overhead',
    description: 'Proprietary internal agent platform engineered for deep internal document processing, customized LLM routing with Gemini 3.1 Flash Lite, KBank internal system integrations (e.g. SmartServe), centralized UAM governance, and future KBTG/local LLM support.',
    primary_color: '#059669', // Emerald-600
    bg_color: 'bg-emerald-50',
    border_color: 'border-emerald-300',
    text_color: 'text-emerald-700',
    ideal_for: 'Non-M365/MDP integrations (SmartServe), centralized UAM governance, KBTG/local LLM roadmap, and eliminating per-user seat licenses.',
    pros: 'Zero per-user Microsoft tax, connects to KBank systems (SmartServe), enterprise-managed UAM, local/KBTG LLM roadmap support',
    cons: 'Internal team maintenance required, separate UI from standard Office apps',
    workflow_complexity: 'Customizable / Advanced'
  }
];

export const DEFAULT_SCORING_RULES = [
  {
    id: 1,
    rule_name: 'no_workflow_builder',
    condition: 'q1_has_agentic_person == 0',
    target_tool: 'm365_copilot',
    score_delta: 100,
    is_hard_override: 1,
    reason: 'Team does not have a member to learn multi-stage workflows; Easy Mode is the required turnkey solution.'
  },
  {
    id: 2,
    rule_name: 'need_non_m365_kbank_systems',
    condition: 'q4_need_non_m365_systems == 1',
    target_tool: 'athena',
    score_delta: 60,
    is_hard_override: 1,
    reason: 'Requirement to connect to KBank internal systems outside M365/MDP (e.g. SmartServe); Athena is uniquely capable.'
  },
  {
    id: 3,
    rule_name: 'no_uam_governance_prepared',
    condition: 'q5_uam_governance_ready == 0',
    target_tool: 'athena',
    score_delta: 50,
    is_hard_override: 1,
    reason: 'Team lacks people/processes for manual agent permission reviews and ownership transfers; Athena provides centralized enterprise UAM.'
  },
  {
    id: 4,
    rule_name: 'plan_local_or_kbtg_llm',
    condition: 'q6_plan_local_kbtg_llm == 1',
    target_tool: 'athena',
    score_delta: 50,
    is_hard_override: 1,
    reason: 'Future roadmap includes Local LLMs or KBank/KBTG-hosted models; only Athena supports custom internal model endpoints.'
  },
  {
    id: 5,
    rule_name: 'zero_additional_cost_advantage',
    condition: 'q2_extra_cost == 0',
    target_tool: 'copilot_studio',
    score_delta: 25,
    is_hard_override: 0,
    reason: 'All users already possess Advanced licenses (U <= H), making Microsoft 365 Copilot Studio free of additional license fees.'
  },
  {
    id: 6,
    rule_name: 'athena_cost_efficiency',
    condition: 'athena_cost < m365_extra_cost',
    target_tool: 'athena',
    score_delta: 35,
    is_hard_override: 0,
    reason: 'Athena operational cost delivers superior economics over Microsoft additional seat licensing.'
  }
];
