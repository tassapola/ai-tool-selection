// Default seed data for the SQLite database
export const DEFAULT_CONFIG_VARIABLES = [
  {
    key: 'usd_thb_rate',
    value: 35.0,
    data_type: 'number',
    unit: 'บาท/USD',
    label: 'อัตราแลกเปลี่ยน USD เป็น THB',
    category: 'pricing',
    description: 'อัตราแลกเปลี่ยนสกุลเงินปัจจุบันที่ใช้แปลงต้นทุน USD เป็นเงินบาทไทย'
  },
  {
    key: 'm365_license_monthly_usd',
    value: 20.0,
    data_type: 'number',
    unit: 'USD/ผู้ใช้/เดือน',
    label: 'ค่าไลเซนส์เพิ่มเติม Microsoft 365 ต่อเดือน',
    category: 'pricing',
    description: 'ต้นทุนต่อผู้ใช้งานเพิ่มเติมต่อเดือนสำหรับไลเซนส์ Microsoft 365 Copilot / Advanced'
  },
  {
    key: 'm365_months_per_year',
    value: 12.0,
    data_type: 'number',
    unit: 'เดือน',
    label: 'จำนวนเดือนต่อปี',
    category: 'pricing',
    description: 'ตัวคูณสำหรับแปลงค่าธรรมเนียมไลเซนส์รายเดือนเป็นต้นทุนรายปี'
  },
  // Scoring Weights: Cost = 60%, Features = 40%
  {
    key: 'weight_cost_percentage',
    value: 60.0,
    data_type: 'number',
    unit: '%',
    label: 'น้ำหนักการประเมินด้านต้นทุน (Cost)',
    category: 'weights',
    description: 'น้ำหนักที่กำหนดให้กับความคุ้มค่าด้านต้นทุนไลเซนส์และโครงสร้างพื้นฐาน (ค่าเริ่มต้น 60%)'
  },
  {
    key: 'weight_features_percentage',
    value: 40.0,
    data_type: 'number',
    unit: '%',
    label: 'น้ำหนักการประเมินด้านฟีเจอร์และสถาปัตยกรรม (Features)',
    category: 'weights',
    description: 'น้ำหนักที่กำหนดให้กับความพร้อมของทีม การเชื่อมต่อระบบองค์กร การกำกับดูแล UAM และการโฮสต์โมเดล (ค่าเริ่มต้น 40%)'
  },
  // Athena Cost Variables (Gemini 3.1 Flash Lite model)
  {
    key: 'COST_OF_1_DL_PAGE',
    value: 1.0,
    data_type: 'number',
    unit: 'บาท/หน้า',
    label: 'ต้นทุนต่อหน้า (docx, txt, md)',
    category: 'athena',
    description: 'ต้นทุนการประมวลผลต่อหน้าของเอกสาร docx, txt, md สำหรับการทำ Indexing และ Chunking บน Athena'
  },
  {
    key: 'COST_OF_1_DM_PAGE',
    value: 1.4,
    data_type: 'number',
    unit: 'บาท/หน้า',
    label: 'ต้นทุนต่อหน้า (pdf, pptx ไม่มีรูปภาพ)',
    category: 'athena',
    description: 'ต้นทุนการประมวลผลต่อหน้าของเอกสาร PDF และ PPTX ที่เป็นข้อความล้วน'
  },
  {
    key: 'COST_OF_1_DH_PAGE',
    value: 1.4,
    data_type: 'number',
    unit: 'บาท/หน้า',
    label: 'ต้นทุนต่อหน้า (pdf, pptx มีรูปภาพ)',
    category: 'athena',
    description: 'ต้นทุนการประมวลผลต่อหน้าของเอกสาร PDF และ PPTX ที่มีรูปภาพประกอบ'
  },
  {
    key: 'COST_OF_1_IMAGE',
    value: 1.4,
    data_type: 'number',
    unit: 'บาท/รูปภาพ',
    label: 'ต้นทุนต่อการสกัด 1 รูปภาพ',
    category: 'athena',
    description: 'ต้นทุน Multimodal Vision Embedding ต่อ 1 รูปภาพในเอกสาร'
  },
  {
    key: 'COST_OF_1_OTHER',
    value: 1.4,
    data_type: 'number',
    unit: 'บาท/ฉบับ',
    label: 'ต้นทุนต่อ 1 เอกสารรูปแบบอื่น',
    category: 'athena',
    description: 'ต้นทุนการประมวลผลสำหรับเอกสารรูปแบบอื่นๆ'
  },
  {
    key: 'COST_OF_1_EVAL_QUESTION',
    value: 1.0,
    data_type: 'number',
    unit: 'บาท/คำถามทดสอบ',
    label: 'ต้นทุนต่อ 1 คำถามทดสอบ (Evaluation)',
    category: 'athena',
    description: 'ต้นทุนการอนุมาน (Inference) สำหรับคำถามทดสอบและประเมินผลโมเดลอัตโนมัติ'
  },
  {
    key: 'COST_OF_PROD_QUESTION',
    value: 1.0,
    data_type: 'number',
    unit: 'บาท/คำถามแชท',
    label: 'ต้นทุนต่อ 1 คำถามแชทในระบบจริง (Production)',
    category: 'athena',
    description: 'ต้นทุนการดึงข้อมูล (Retrieval) และการอนุมานโมเดลต่อ 1 คำถามแชทของผู้ใช้ในระยะ Pilot & Production'
  },
  {
    key: 'COST_OF_CLOUD_FIXED_COST_PER_MONTH',
    value: 12000.0,
    data_type: 'number',
    unit: 'บาท/เดือน',
    label: 'ต้นทุนคงที่สำหรับ Cloud Compute ต่อเดือน (Fixed Cloud Compute Cost)',
    category: 'athena',
    description: 'ค่าบริการ Cloud Compute คงที่ต่อเดือนสำหรับ Athena (คิดทั้งช่วง Dev & PoC และช่วง Pilot & Production)'
  },
  {
    key: 'COST_OF_AGENT_DOCTOR_PER_MANDAY',
    value: 16000.0,
    data_type: 'number',
    unit: 'บาท/manday',
    label: 'ต้นทุน Agent Doctor ต่อ 1 Manday (Agent Doctor Support Rate)',
    category: 'athena',
    description: 'ต้นทุนค่าบริการผู้เชี่ยวชาญ Agent Doctor ในการช่วยสนับสนุนการ Implement ระบบ Athena ต่อ 1 Manday (ค่าเริ่มต้น 16,000 บาท/manday)'
  },
  // Thresholds & Weights
  {
    key: 'studio_readiness_weight',
    value: 40.0,
    data_type: 'number',
    unit: 'คะแนน',
    label: 'น้ำหนักความพร้อม Agentic ของ Copilot Studio',
    category: 'scoring',
    description: 'คะแนนที่เพิ่มให้ Copilot Studio หากทีมงานมีบุคลากรพร้อมสร้าง Agentic Workflow'
  },
  {
    key: 'athena_readiness_weight',
    value: 35.0,
    data_type: 'number',
    unit: 'คะแนน',
    label: 'น้ำหนักความพร้อม Agentic ของ Athena',
    category: 'scoring',
    description: 'คะแนนที่เพิ่มให้ Athena หากทีมงานมีบุคลากรพร้อมสร้าง Agentic Workflow'
  },
  {
    key: 'm365_easy_penalty_if_complex',
    value: 30.0,
    data_type: 'number',
    unit: 'คะแนน',
    label: 'คะแนนหักลด Easy Mode เมื่อต้องการความซับซ้อน',
    category: 'scoring',
    description: 'คะแนนที่หักลดสำหรับ Easy Mode เมื่อจำเป็นต้องใช้ Multi-Stage Agentic Workflow'
  },
  {
    key: 'athena_high_cost_threshold_thb',
    value: 210000.0,
    data_type: 'number',
    unit: 'บาท/ปี',
    label: 'เกณฑ์ต้นทุนสูงในการเปลี่ยนไปใช้ Athena',
    category: 'threshold',
    description: 'เมื่อต้นทุนไลเซนส์ Microsoft รายปีเกินกว่าเกณฑ์นี้ (~25+ คนขึ้นไป) แพลตฟอร์มภายใน Athena จะมีความคุ้มค่ามากกว่าอย่างเห็นได้ชัด'
  },
  {
    key: 'athena_min_user_scale',
    value: 30.0,
    data_type: 'number',
    unit: 'คน',
    label: 'เกณฑ์ขนาดผู้ใช้งานของ Athena',
    category: 'threshold',
    description: 'ปริมาณผู้ใช้งานขั้นต่ำที่ทำให้การใช้งานระบบภายในอย่าง Athena ให้ผลตอบแทนการลงทุน (ROI) สูงกว่า'
  },
  {
    key: 'COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD',
    value: 350000.0,
    data_type: 'number',
    unit: 'บาท',
    label: 'เกณฑ์ส่วนต่างต้นทุนเพื่อเปลี่ยนเป็น Athena แทน Easy Mode',
    category: 'threshold',
    description: 'เมื่อข้อ 1 (ความพร้อมในการสร้าง Agent ขั้นสูง) เลือก Easy Mode หากต้นทุนรายปีของ Microsoft สูงกว่าต้นทุนรวมของ Athena เกินกว่าจำนวนนี้ ระบบจะแนะนำ Athena แทน ถ้าเลือกเลขต่ำ โอกาสเลือก Microsoft จะสูงขึ้น'
  }
];

export const DEFAULT_TOOLS = [
  {
    id: 'm365_copilot',
    name: 'Microsoft 365 Copilot',
    mode_name: 'Easy Mode',
    badge: 'Turnkey • ไม่ต้องใช้เวลาเรียนรู้',
    tagline: 'เพิ่มผลผลิตและแชทระดับองค์กรได้ทันทีแบบสำเร็จรูป',
    description: 'ระบบ AI ที่ผสานการทำงานโดยตรงกับ Microsoft 365 บน Word, Excel, Teams และ Outlook เหมาะอย่างยิ่งสำหรับการเริ่มใช้งานทันทีโดยไม่จำเป็นต้องมีทีมพัฒนา Workflow',
    primary_color: '#2563EB', // Blue-600
    bg_color: 'bg-blue-50',
    border_color: 'border-blue-300',
    text_color: 'text-blue-700',
    ideal_for: 'ทีมงานที่ต้องการผลลัพธ์รวดเร็วทันทีโดยไม่ต้องเขียนขั้นตอนการทำงานที่ซับซ้อน',
    pros: 'พร้อมใช้งานทันทีโดยไม่ต้องติดตั้ง, ทำงานร่วมกับ Office 365 ได้อย่างสมบูรณ์แบบ, เป็นไปตามมาตรฐานความปลอดภัยระดับองค์กร',
    cons: 'ความยืดหยุ่นในการเชื่อมโยงหลายขั้นตอนจำกัด, หน้าจอ Prompt ฟิกซ์ตายตัว, มีค่าไลเซนส์รายเดือนต่อผู้ใช้งาน',
    workflow_complexity: 'ต่ำ (สร้างไว้ให้สำเร็จรูป)'
  },
  {
    id: 'copilot_studio',
    name: 'Microsoft 365 Copilot Studio',
    mode_name: 'Builder Multi-Step Workflow',
    badge: 'เครื่องมือสร้าง Multi-Step Agentic',
    tagline: 'ออกแบบโฟลว์การทำงานอัตโนมัติหลายขั้นตอน ตัวเชื่อมต่อ และทริกเกอร์',
    description: 'เครื่องมือ Visual Low-Code สำหรับออกแบบ Multi-Stage Agentic Workflow, การต่อยอด Prompt ต่อเนื่อง, ตัวเชื่อมต่อ Power Automate และการประสานงาน Multi-Agent ตามสั่ง',
    primary_color: '#7C3AED', // Violet-600
    bg_color: 'bg-purple-50',
    border_color: 'border-purple-300',
    text_color: 'text-purple-700',
    ideal_for: 'ทีมงานที่มีบุคลากรอย่างน้อยหนึ่งคนพร้อมเรียนรู้ Flow Designer และสร้างตรรกะ Agent หลายขั้นตอนภายในระบบนิเวศ Microsoft 365/MDP',
    pros: 'หน้าจอออกแบบโฟลว์แบบภาพ (Visual Flow Designer), มี Enterprise Connectors พร้อมใช้, รองรับ Agentic Triggers, ทำงานร่วมกับระบบนิเวศ Microsoft ได้อย่างไร้รอยต่อ',
    cons: 'ทีมงานต้องใช้เวลาเรียนรู้, ต้องบริหารจัดการกำกับดูแลสิทธิ์ UAM แบบกระจายศูนย์ด้วยตนเอง, ต้องบริหารจัดการไลเซนส์เพิ่มเติม',
    workflow_complexity: 'สูง (Visual Builder)'
  },
  {
    id: 'athena',
    name: 'Athena',
    mode_name: 'Internal Agentic Platform',
    badge: 'ระบบปรับแต่งระดับองค์กร (Gemini 3.1 Flash Lite)',
    tagline: 'Agent ภายในองค์กรสำหรับสเกลสูง โดยไม่มีภาระค่าไลเซนส์รายบุคคล',
    description: 'แพลตฟอร์ม Agent ภายในองค์กรที่พัฒนาขึ้นโดยเฉพาะเพื่อการประมวลผลเอกสารเชิงลึก, การเลือกใช้ LLM ด้วย Gemini 3.1 Flash Lite, การเชื่อมต่อกับระบบภายในของ KBank (เช่น SmartServe), ระบบกำกับดูแล UAM รวมศูนย์ และรองรับการใช้ KBTG/Local LLM ในอนาคต',
    primary_color: '#059669', // Emerald-600
    bg_color: 'bg-emerald-50',
    border_color: 'border-emerald-300',
    text_color: 'text-emerald-700',
    ideal_for: 'การเชื่อมต่อระบบนอก M365/MDP (SmartServe), การกำกับดูแล UAM แบบรวมศูนย์, แผนงานการใช้ Local/KBTG LLM และการตัดภาระค่าไลเซนส์รายคน',
    pros: 'ไม่มีค่าไลเซนส์รายบุคคลของ Microsoft, เชื่อมต่อกับระบบภายใน KBank ได้ (SmartServe), ระบบ UAM ควบคุมโดยองค์กร, รองรับแผนงาน Local/KBTG LLM',
    cons: 'ต้องมีทีมงานภายในคอยดูแลรักษาระบบ, หน้าจอแยกต่างหากจากโปรแกรมมาตรฐาน Office',
    workflow_complexity: 'ปรับแต่งได้ระดับสูง / ขั้นสูง'
  },
  {
    id: 'no_recommendation',
    name: 'ไม่มีคำตอบ',
    mode_name: 'คำตอบมีความขัดแย้งกัน (Conflicting Requirements)',
    badge: 'ไม่สามารถสรุปเครื่องมือได้ • สถาปัตยกรรมขัดแย้ง',
    tagline: 'ข้อกำหนดทางเทคนิคและสถาปัตยกรรมมีความขัดแย้งกัน จำเป็นต้องทบทวนความต้องการ',
    description: 'ผลการประเมินพบข้อกำหนดที่มีความขัดแย้งกันระหว่างโซลูชัน เช่น สถาปัตยกรรมต้องการเชื่อมต่อระบบภายในเฉพาะของ Athena หรือ Local LLM แต่ไม่สามารถย้ายเอกสารออกจากระบบ Office 365 ได้ หรือระบบเน้น Microsoft ล้วนแต่ไม่มีทีมกำกับดูแล UAM แบบกระจายศูนย์ จึงไม่สามารถเลือกโซลูชันใดโซลูชันหนึ่งได้อย่างสมบูรณ์แบบ แนะนำให้ปรึกษาทีม Enterprise Architecture หรือทบทวนข้อกำหนดร่วมกัน',
    primary_color: '#E11D48', // Rose-600
    bg_color: 'bg-rose-50',
    border_color: 'border-rose-300',
    text_color: 'text-rose-700',
    ideal_for: 'กรณีที่คำตอบของผู้ประเมินมีข้อขัดแย้งเชิงโครงสร้างสถาปัตยกรรม (Architectural Conflicts)',
    pros: 'ช่วยตรวจจับความเสี่ยงและความขัดแย้งเชิงสถาปัตยกรรมได้ทันทีตั้งแต่ช่วงวางแผน ป้องกันการลงทุนในโซลูชันที่ไม่ตอบโจทย์',
    cons: 'ไม่สามารถตัดสินใจเลือกเครื่องมือได้ทันที จำเป็นต้องประสานงานฝ่ายที่เกี่ยวข้องเพื่อปรับเงื่อนไขข้อจำกัด',
    workflow_complexity: 'ต้องทบทวนเชิงสถาปัตยกรรม (Architectural Review)'
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
    reason: 'ทีมงานยังไม่มีบุคลากรพร้อมเรียนรู้ Multi-Stage Workflows; Easy Mode คือโซลูชันสำเร็จรูปที่จำเป็น (Turnkey)'
  },
  {
    id: 2,
    rule_name: 'need_non_m365_kbank_systems',
    condition: 'q4_need_non_m365_systems == 1',
    target_tool: 'athena',
    score_delta: 60,
    is_hard_override: 1,
    reason: 'จำเป็นต้องเชื่อมต่อกับระบบภายในของ KBank ภายนอก M365/MDP (เช่น SmartServe); มีเพียง Athena เท่านั้นที่รองรับ'
  },
  {
    id: 3,
    rule_name: 'no_uam_governance_prepared',
    condition: 'q5_uam_governance_ready == 0',
    target_tool: 'athena',
    score_delta: 50,
    is_hard_override: 1,
    reason: 'ทีมงานยังไม่มีกระบวนการและบุคลากรสำหรับตรวจสอบสิทธิ์ Agent และส่งมอบความเป็นเจ้าของ; Athena มีระบบการกำกับดูแล UAM ระดับองค์กรแบบรวมศูนย์'
  },
  {
    id: 4,
    rule_name: 'plan_local_or_kbtg_llm',
    condition: 'q6_plan_local_kbtg_llm == 1',
    target_tool: 'athena',
    score_delta: 50,
    is_hard_override: 1,
    reason: 'มีแผนการใช้งาน Local LLM หรือโมเดลที่โฮสต์บน KBank/KBTG ในอนาคต; มีเพียง Athena เท่านั้นที่รองรับ Internal Endpoint เหล่านี้'
  },
  {
    id: 5,
    rule_name: 'zero_additional_cost_advantage',
    condition: 'q2_extra_cost == 0',
    target_tool: 'copilot_studio',
    score_delta: 25,
    is_hard_override: 0,
    reason: 'ผู้ใช้งานทุกคนมีไลเซนส์แบบ Advanced อยู่แล้ว (U <= H) ทำให้ Microsoft 365 Copilot Studio ไม่มีค่าใช้จ่ายไลเซนส์เพิ่มเติม'
  },
  {
    id: 6,
    rule_name: 'athena_cost_efficiency',
    condition: 'athena_cost < m365_extra_cost',
    target_tool: 'athena',
    score_delta: 35,
    is_hard_override: 0,
    reason: 'ต้นทุนดำเนินงานของ Athena ให้ความคุ้มค่าทางเศรษฐศาสตร์ด้านต้นทุนที่เหนือกว่าค่าไลเซนส์รายคนของ Microsoft'
  },
  {
    id: 7,
    rule_name: 'cannot_move_o365_knowledge_to_sharepoint',
    condition: 'q5_cannot_move_o365_knowledge == 1',
    target_tool: 'm365_copilot',
    score_delta: 65,
    is_hard_override: 1,
    reason: 'ไม่สามารถรวบรวมฐานความรู้ Office 365 ลงใน OneDrive/SharePoint ได้; แนะนำโซลูชัน Microsoft ซึ่งเข้าถึงข้อมูลในระบบนิเวศ Office 365 ได้โดยตรงแบบ In-Place'
  },
  {
    id: 8,
    rule_name: 'conflict_smartserve_vs_cannot_move_o365',
    condition: 'q4_need_non_m365 == 1 && q5_cannot_move_o365 == 1',
    target_tool: 'no_recommendation',
    score_delta: 100,
    is_hard_override: 1,
    reason: 'จำเป็นต้องเชื่อมต่อระบบภายใน KBank ที่ไม่ใช่ M365 (SmartServe) ซึ่งรองรับเฉพาะ Athena แต่ไม่สามารถรวบรวมฐานความรู้ Office 365 ลงใน OneDrive/SharePoint ได้ ซึ่งต้องใช้ Microsoft -> ความต้องการขัดแย้งกัน (ไม่มีคำตอบ)'
  },
  {
    id: 9,
    rule_name: 'conflict_m365_only_vs_no_uam_governance',
    condition: 'q4_need_non_m365 == 0 && q6_uam_governance == 0',
    target_tool: 'no_recommendation',
    score_delta: 100,
    is_hard_override: 1,
    reason: 'ใช้เฉพาะระบบนิเวศ M365 ล้วน (เหมาะกับ Microsoft) แต่ไม่มีบุคลากรดูแลสิทธิ์ UAM กระจายศูนย์ (ต้องการ Athena รวมศูนย์) -> ความต้องการขัดแย้งกัน (ไม่มีคำตอบ)'
  },
  {
    id: 10,
    rule_name: 'conflict_local_llm_vs_cannot_move_o365',
    condition: 'q7_plan_local_kbtg_llm == 1 && q5_cannot_move_o365 == 1',
    target_tool: 'no_recommendation',
    score_delta: 100,
    is_hard_override: 1,
    reason: 'มีแผนจะใช้ Local LLM หรือ LLM ภายใน KBank/KBTG ซึ่งรองรับเฉพาะ Athena แต่ไม่สามารถรวบรวมฐานความรู้ลงใน OneDrive/SharePoint ได้ ซึ่งต้องใช้ Microsoft -> ความต้องการขัดแย้งกัน (ไม่มีคำตอบ)'
  },
  {
    id: 11,
    rule_name: 'conflict_no_uam_vs_cannot_move_o365',
    condition: 'q6_uam_governance == 0 && q5_cannot_move_o365 == 1',
    target_tool: 'no_recommendation',
    score_delta: 100,
    is_hard_override: 1,
    reason: 'ไม่สามารถรวบรวมฐานความรู้ Office 365 ลงใน OneDrive/SharePoint ได้ (ต้องใช้ Microsoft) แต่ไม่มีบุคลากรดูแลสิทธิ์ UAM กระจายศูนย์ (ต้องการ Athena รวมศูนย์) -> ความต้องการขัดแย้งกัน (ไม่มีคำตอบ)'
  }
];
