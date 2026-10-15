import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel
} from 'docx';

/**
 * Generates and downloads a formal .docx assessment report.
 * Includes assessment date, all questionnaire inputs, active SQLite DB parameters,
 * scoring breakdown, final decision, and a dedicated Human Override & Official Stamp section.
 * Formatted in professional Thai language suitable for KBank IT Governance reviews,
 * retaining English only for proper tool names and technical terms.
 */
export async function exportAssessmentToDocx({
  evaluation,
  useCaseName = '',
  departmentName = '',
  q1AgenticWorkflow,
  hUsers,
  uUsers,
  athenaInputs = {},
  q4ConnectNonM365,
  q5O365KnowledgeToSharepoint,
  q6UamGovernance,
  q7LocalKbtgLlm,
  // backwards compatibility
  q5UamGovernance,
  q6LocalKbtgLlm,
  variables = {},
  tools = []
}) {
  const effectiveQ6Uam = q6UamGovernance !== undefined && q6UamGovernance !== null ? q6UamGovernance : q5UamGovernance;
  const effectiveQ7Llm = q7LocalKbtgLlm !== undefined && q7LocalKbtgLlm !== null ? q7LocalKbtgLlm : q6LocalKbtgLlm;

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = currentDate.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const {
    scores = {},
    recommendedTool,
    recommendedToolId,
    m365AnnualCostThb = 0,
    annualCostThb = 0,
    additionalLicensesNeeded = 0,
    athenaTotalCostThb = 0,
    athenaDevPocTotal = 0,
    athenaPilotProdTotal = 0,
    athenaBreakdown = {},
    weightCost = 60,
    weightFeatures = 40,
    H = 0,
    U = 0,
    reasoning = []
  } = evaluation;

  // Helper for table borders
  const thinBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' }
  };

  const headerBorder = {
    top: { style: BorderStyle.SINGLE, size: 2, color: '1E293B' },
    bottom: { style: BorderStyle.SINGLE, size: 2, color: '1E293B' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' }
  };

  const stampBorder = {
    top: { style: BorderStyle.DASHED, size: 2, color: '64748B' },
    bottom: { style: BorderStyle.DASHED, size: 2, color: '64748B' },
    left: { style: BorderStyle.DASHED, size: 2, color: '64748B' },
    right: { style: BorderStyle.DASHED, size: 2, color: '64748B' }
  };

  // Build document sections
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'TH Sarabun New',
            size: 24, // 12pt
            color: '1E293B'
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440
            }
          }
        },
        children: [
          // Document Header
          new Paragraph({
            text: 'รายงานผลการประเมินและคัดเลือกเครื่องมือ AI',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 360 },
            children: [
              new TextRun({
                text: 'Microsoft 365 Copilot  เทียบกับ  Microsoft 365 Copilot Studio  เทียบกับ  Athena',
                bold: true,
                color: '475569',
                size: 24
              })
            ]
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: thinBorder,
                    shading: { fill: 'F8FAFC' },
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'ชื่อ Use-case:', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: `${useCaseName || 'ไม่ระบุ'}`, bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    shading: { fill: 'F8FAFC' },
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'ฝ่ายงาน / ส่วนงาน:', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: `${departmentName || 'ไม่ระบุ'}`, bold: true, size: 22 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: thinBorder,
                    shading: { fill: 'F8FAFC' },
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'วันที่ทำการประเมิน:', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: `${formattedDate}`, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    shading: { fill: 'F8FAFC' },
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'เวลาที่ประเมิน:', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: `${formattedTime} น.`, size: 22 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: thinBorder,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'สัดส่วนน้ำหนักคะแนน:', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: `ต้นทุน ${weightCost}% / ฟีเจอร์ ${weightFeatures}%`, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'สถานะเอกสาร:', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: 'บันทึกผลการตัดสินใจอย่างเป็นทางการ', size: 22 })] })]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 240 } }),

          // Section 1: Executive Summary & Recommendation Decision
          new Paragraph({
            text: '1. บทสรุปสำหรับผู้บริหารและผลการตัดสินใจ',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 }
          }),

          // Advisory Notice Box
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 3, color: 'D97706' },
                      bottom: { style: BorderStyle.SINGLE, size: 3, color: 'D97706' },
                      left: { style: BorderStyle.SINGLE, size: 6, color: 'D97706' },
                      right: { style: BorderStyle.SINGLE, size: 3, color: 'D97706' }
                    },
                    shading: { fill: 'FFFBEB' },
                    children: [
                      new Paragraph({
                        spacing: { before: 80, after: 60 },
                        children: [
                          new TextRun({
                            text: 'ข้อความระบุสิทธิ์และคำแนะนำสำคัญ (ข้อเสนอแนะเบื้องต้น ไม่ใช่ผลสิ้นสุด):',
                            bold: true,
                            color: '92400E',
                            size: 22
                          })
                        ]
                      }),
                      new Paragraph({
                        spacing: { after: 80 },
                        children: [
                          new TextRun({
                            text: 'คำแนะนำเครื่องมืออัตโนมัตินี้เป็นเพียงข้อเสนอแนะเชิงที่ปรึกษาที่ประมวลผลจากเกณฑ์ทางเทคนิคและสูตรประมาณการต้นทุนเท่านั้น ยังไม่ใช่ผลการตัดสินใจขั้นสุดท้าย ผู้ประเมินและคณะกรรมการโครงการจำเป็นต้องพิจารณาปัจจัยด้านระยะเวลาในการส่งมอบสู่ตลาด (Time-to-Market), ความพร้อมของบุคลากรและทักษะในทีม (People & Skills Readiness), ขีดความสามารถในการดูแลรักษาระบบ (Maintenance Capacity) ตลอดจนกระบวนการกำกับดูแลด้านสถาปัตยกรรมและธรรมาภิบาลของ KBank ควบคู่ไปด้วยเสมอ ก่อนดำเนินการตัดสินใจขั้นเด็ดขาด',
                            color: '78350F',
                            size: 21
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 140 } }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: headerBorder,
                    shading: { fill: recommendedToolId === 'no_recommendation' ? 'FFE4E6' : 'EEF2FF' },
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: recommendedToolId === 'no_recommendation' ? 'สถานะผลการประเมิน:' : 'เครื่องมือที่แนะนำ:', bold: true, size: 24 })] })]
                  }),
                  new TableCell({
                    borders: headerBorder,
                    shading: { fill: recommendedToolId === 'no_recommendation' ? 'FFE4E6' : 'EEF2FF' },
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: recommendedTool ? recommendedTool.name : 'อยู่ระหว่างการประเมิน',
                            bold: true,
                            size: 26,
                            color: recommendedToolId === 'no_recommendation' ? 'BE123C' : '1E3A8A'
                          }),
                          new TextRun({
                            text: recommendedTool && recommendedTool.mode_name ? ` (${recommendedTool.mode_name})` : '',
                            italics: true,
                            size: 22
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: thinBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: 'คะแนนความเหมาะสมโดยรวม:', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [new Paragraph({ children: [new TextRun({
                      text: recommendedToolId === 'no_recommendation'
                        ? `ไม่สามารถสรุปเครื่องมือได้เนื่องจากพบข้อกำหนดขัดแย้งกัน (${evaluation.conflicts?.length || 1} จุด)`
                        : `${scores[recommendedToolId] || 0}% (คำนวณจาก ต้นทุน ${weightCost}% / ฟีเจอร์ ${weightFeatures}%)`,
                      size: 22
                    })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: thinBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: 'ข้อมูลเศรษฐศาสตร์ด้านต้นทุน:', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `ค่าไลเซนส์รายปี Microsoft: ฿${annualCostThb.toLocaleString()} บาท/ปี  |  ต้นทุนดำเนินการ Athena: ฿${athenaTotalCostThb.toLocaleString()} บาท (Dev/PoC + Pilot/Production)`,
                            size: 22
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 180 } }),

          new Paragraph({
            text: 'เหตุผลประกอบการตัดสินใจและปัจจัยขับเคลื่อนหลัก:',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 120, after: 100 }
          }),
          ...reasoning.map(r => new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [new TextRun({ text: r, size: 22 })]
          })),

          new Paragraph({ text: '', spacing: { after: 240 } }),

          // Section 2: Active Parameters in SQLite Database
          new Paragraph({
            text: '2. พารามิเตอร์และเกณฑ์คะแนนที่กำหนดในฐานข้อมูล',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 }
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: headerBorder,
                    shading: { fill: 'F1F5F9' },
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'ชื่อพารามิเตอร์ (Parameter Key)', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: headerBorder,
                    shading: { fill: 'F1F5F9' },
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'ค่าที่กำหนด', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: headerBorder,
                    shading: { fill: 'F1F5F9' },
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'หน่วย / คำอธิบายบริบท', bold: true, size: 22 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'weight_cost_percentage', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: `${weightCost}%`, size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'สัดส่วนน้ำหนักการประเมินด้านต้นทุน', size: 21 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'weight_features_percentage', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: `${weightFeatures}%`, size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'สัดส่วนน้ำหนักการประเมินด้านฟีเจอร์และสถาปัตยกรรม', size: 21 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'usd_thb_rate', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: `฿${variables.usd_thb_rate ?? 35.0}`, size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'อัตราแลกเปลี่ยน THB/USD', size: 21 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'm365_license_monthly_usd', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: `$${variables.m365_license_monthly_usd ?? 20.0}`, size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'USD / ผู้ใช้ / เดือน', size: 21 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'athena_foundation_model', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Gemini 3.1 Flash Lite', bold: true, size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'โมเดลภาษาหลักที่ใช้เป็นฐานคิดต้นทุน', size: 21 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'COST_OF_1_DL_PAGE', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: `฿${variables.COST_OF_1_DL_PAGE ?? 1.0}`, size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'บาท ต่อหน้า (docx, txt, md)', size: 21 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'COST_OF_1_DM_PAGE / DH_PAGE', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: `฿${variables.COST_OF_1_DM_PAGE ?? 1.4}`, size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'บาท ต่อหน้า (pdf, pptx)', size: 21 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'COST_OF_PROD_QUESTION', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: `฿${variables.COST_OF_PROD_QUESTION ?? 1.0}`, size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'บาท ต่อคำถามแชทในระบบจริง (Production Query)', size: 21 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'COST_OF_CLOUD_FIXED_COST_PER_MONTH', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: `฿${(variables.COST_OF_CLOUD_FIXED_COST_PER_MONTH ?? 12000.0).toLocaleString()}`, size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'บาท ต่อเดือน (ต้นทุนทรัพยากร Cloud Compute คงที่ ทั้งช่วง Dev & PoC และช่วง Pilot & Production)', size: 21 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'COST_OF_AGENT_DOCTOR_PER_MANDAY', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: `฿${(variables.COST_OF_AGENT_DOCTOR_PER_MANDAY ?? 16000.0).toLocaleString()}`, size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'บาท ต่อ manday (อัตราค่าบริการ Agent Doctor ในการ Implement)', size: 21 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: `฿${(variables.COST_THRESHOLD_THB_TO_PICK_ATHENA_INSTEAD ?? 350000.0).toLocaleString()}`, bold: true, size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'เกณฑ์ส่วนต่างต้นทุนเพื่อแนะนำ Athena แทน Microsoft 365 Copilot (Easy mode) Advanced license allow share (ถ้าเลือกเลขต่ำ โอกาสเลือก Microsoft จะสูงขึ้น)', size: 21 })] })] })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 240 } }),

          // Section 3: Detailed Questionnaire Inputs
          new Paragraph({
            text: '3. ข้อมูลคำตอบและแบบฟอร์มการประเมิน',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 }
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: headerBorder,
                    shading: { fill: 'F1F5F9' },
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'ข้อคำถาม', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: headerBorder,
                    shading: { fill: 'F1F5F9' },
                    width: { size: 45, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'เกณฑ์การประเมิน / คำอธิบาย', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: headerBorder,
                    shading: { fill: 'F1F5F9' },
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'คำตอบที่บันทึกไว้', bold: true, size: 22 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'ข้อมูล Use-case (Use-case info)', bold: true, size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'ข้อมูลพื้นฐานของ Use-case และฝ่ายงานที่รับผิดชอบ', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: `ชื่อ Use-case: ${useCaseName || 'ไม่ระบุ'}\nฝ่ายงาน: ${departmentName || 'ไม่ระบุ'}`, bold: true, size: 21 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'ข้อที่ 1: ความพร้อมของทีมในการสร้าง Agent ขั้นสูง (Advanced Builder Readiness)', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'ขีดความสามารถของทีมในการเรียนรู้และตั้งค่า Multi-Stage Agentic Workflow', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: q1AgenticWorkflow === 'yes' ? 'พร้อม (มีผู้พร้อมเรียนรู้ Workflow)' : 'ไม่พร้อม (ต้องการ Microsoft 365 Copilot (Easy mode) Advanced license allow share สำเร็จรูป)', bold: true, size: 21 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'ข้อที่ 2: ประมาณการไลเซนส์ Microsoft', size: 21 })] })] }),
                  new TableCell({
                    borders: thinBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: 'การประมาณการค่าไลเซนส์โซลูชัน Microsoft:\nตัวแปร H (มีไลเซนส์อยู่แล้ว) เทียบกับ ตัวแปร U (ผู้ใช้ทั้งหมดที่ต้องการ)', size: 21 })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `H = ${H} คน | U = ${U} คน\nต้องจัดซื้อเพิ่ม: ${additionalLicensesNeeded} สิทธิ์\nต้นทุนคำนวณได้: ฿${annualCostThb.toLocaleString()} บาท/ปี`,
                            size: 21
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'ข้อที่ 3: ประมาณการต้นทุน Athena (Dev/PoC และ Pilot/Production)', size: 21, bold: true })] })] }),
                  new TableCell({
                    borders: thinBorder,
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'แบบฟอร์มการจำลองต้นทุน Athena อย่างละเอียด (Gemini 3.1 Flash Lite):\n• ส่วนที่ 1: Dev & PoC (เอกสาร Ingestion, นักพัฒนา AD, คำถามประเมินผล, Cloud Compute คงที่, Agent Doctor)\n• ส่วนที่ 2: Pilot & Production (ผู้ใช้งานจริง, คำถามต่อวัน, ระยะเวลาใช้งาน, Cloud Compute คงที่)', size: 20 })]
                      })
                    ]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [
                      new Paragraph({ children: [new TextRun({ text: '【ส่วนที่ 1: Dev & PoC】', bold: true, size: 21, color: '065F46' })] }),
                      new Paragraph({ children: [new TextRun({ text: `• 1.1 เอกสาร DL (docx/txt/md): ${athenaBreakdown.DL ?? athenaInputs.DL ?? 0} ฉบับ (เฉลี่ย ${athenaBreakdown.DL_AVG_PAGES ?? athenaInputs.DL_AVG_PAGES ?? 0} หน้า) = ฿${(athenaBreakdown.costDlTotal || 0).toLocaleString()}`, size: 20 })] }),
                      new Paragraph({ children: [new TextRun({ text: `• 1.1 เอกสาร DM (pdf/pptx ไม่มีภาพ): ${athenaBreakdown.DM ?? athenaInputs.DM ?? 0} ฉบับ (เฉลี่ย ${athenaBreakdown.DM_AVG_PAGES ?? athenaInputs.DM_AVG_PAGES ?? 0} หน้า) = ฿${(athenaBreakdown.costDmTotal || 0).toLocaleString()}`, size: 20 })] }),
                      new Paragraph({ children: [new TextRun({ text: `• 1.1 เอกสาร DH (pdf/pptx มีภาพ): ${athenaBreakdown.DH ?? athenaInputs.DH ?? 0} ฉบับ (เฉลี่ย ${athenaBreakdown.DH_AVG_PAGES ?? athenaInputs.DH_AVG_PAGES ?? 0} หน้า) = ฿${(athenaBreakdown.costDhTotal || 0).toLocaleString()}`, size: 20 })] }),
                      new Paragraph({ children: [new TextRun({ text: `• 1.1 รูปภาพ (pptx/images): ${athenaBreakdown.IMG_COUNT ?? athenaInputs.IMG_COUNT ?? 0} ภาพ = ฿${(athenaBreakdown.costImgTotal || 0).toLocaleString()}`, size: 20 })] }),
                      new Paragraph({ children: [new TextRun({ text: `• 1.1 เอกสารอื่นๆ (NOD): ${athenaBreakdown.NOD ?? athenaInputs.NOD ?? 0} ฉบับ = ฿${(athenaBreakdown.costNodTotal || 0).toLocaleString()}`, size: 20 })] }),
                      new Paragraph({ children: [new TextRun({ text: `• 1.2 นักพัฒนา Agent (AD): ${athenaBreakdown.AD ?? athenaInputs.AD ?? 0} คน`, size: 20 })] }),
                      new Paragraph({ children: [new TextRun({ text: `• 1.3 คำถามประเมินผล (EVAL_Q): ${athenaBreakdown.EVAL_Q ?? athenaInputs.EVAL_Q ?? 0} ข้อ × ${athenaBreakdown.EVAL_ATTEMPTS ?? athenaInputs.EVAL_ATTEMPTS ?? 0} รอบ = ฿${(athenaBreakdown.evalCostTotal || 0).toLocaleString()}`, size: 20 })] }),
                      new Paragraph({ children: [new TextRun({ text: `• 1.4 ระยะเวลา Dev & PoC: ${athenaBreakdown.DEV_POC_MONTHS ?? athenaInputs.DEV_POC_MONTHS ?? 2} เดือน (Cloud Compute: ฿${(athenaBreakdown.costCloudFixedDevPoc ?? (Number(athenaInputs.DEV_POC_MONTHS || 2) * 12000)).toLocaleString()})`, size: 20 })] }),
                      new Paragraph({ children: [new TextRun({ text: `• 1.5 Agent Doctor Help: ${athenaBreakdown.AGENT_DOCTOR_MANDAYS ?? athenaInputs.AGENT_DOCTOR_MANDAYS ?? 0} mandays = ฿${(athenaBreakdown.costAgentDoctorTotal || 0).toLocaleString()}`, size: 20 })] }),
                      new Paragraph({ children: [new TextRun({ text: `➤ รวม Dev & PoC = ฿${athenaDevPocTotal.toLocaleString()} บาท`, bold: true, size: 21, color: '065F46' })] }),
                      new Paragraph({ children: [new TextRun({ text: '【ส่วนที่ 2: Pilot & Production】', bold: true, size: 21, color: '0F766E' })] }),
                      new Paragraph({ children: [new TextRun({ text: `• ผู้ใช้งานแชท (U): ${athenaBreakdown.U_PROD ?? athenaInputs.U ?? U ?? 0} คน | คำถามต่อวัน (Q_PER_DAY): ${athenaBreakdown.Q_PER_DAY ?? athenaInputs.Q_PER_DAY ?? 0} คำถาม`, size: 20 })] }),
                      new Paragraph({ children: [new TextRun({ text: `• ระยะเวลา Production: ${athenaBreakdown.PROD_MONTHS ?? athenaInputs.PROD_MONTHS ?? 10} เดือน`, size: 20 })] }),
                      new Paragraph({ children: [new TextRun({ text: `• ค่าคำถาม Production: ฿${(athenaBreakdown.costProdUsageTotal || 0).toLocaleString()} บาท`, size: 20 })] }),
                      new Paragraph({ children: [new TextRun({ text: `• Cloud Compute คงที่ (Pilot & Prod): ฿${(athenaBreakdown.costCloudFixedProd ?? (Number(athenaInputs.PROD_MONTHS || 10) * 12000)).toLocaleString()} บาท`, size: 20 })] }),
                      new Paragraph({ children: [new TextRun({ text: `➤ รวม Pilot & Production = ฿${athenaPilotProdTotal.toLocaleString()} บาท`, bold: true, size: 21, color: '0F766E' })] }),
                      new Paragraph({ children: [new TextRun({ text: `★ รวมต้นทุน Athena ทั้งหมด = ฿${athenaTotalCostThb.toLocaleString()} บาท`, bold: true, size: 22, color: '047857' })] })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'ข้อที่ 4: การเชื่อมต่อระบบภายใน KBank อื่นหรือใช้งานผ่าน UI ในระบบ KBank อื่น', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'คุณหรือ users จำเป็นต้องเชื่อมต่อกับระบบภายใน KBank อื่นหรือใช้ UI ในระบบ KBank อื่น ที่นอกเหนือจาก Microsoft 365 หรือ MDP หรือไม่? (ตัวอย่าง: ถ้า user มีความจำเป็นต้องใช้งานผ่านระบบ RQ ให้ตอบว่า ใช่ (มี))', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: q4ConnectNonM365 === 'yes' ? 'ใช่ (มี) - จำเป็นต้องเชื่อมต่อระบบ RQ / SmartServe / ระบบภายใน KBank' : 'ไม่ใช่ - ใช้งานเฉพาะ Microsoft 365 / MDP', bold: true, size: 21 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'ข้อที่ 5: การรวบรวมความรู้สู่ OneDrive / SharePoint', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'หากคุณใช้เฉพาะฐานความรู้ Office 365 คุณสามารถรวบรวมความรู้สู่ OneDrive หรือ SharePoint ได้หรือไม่ (ถ้าต้องการใช้ knowledge นอก Office 365 ให้ตอบว่า ไม่ได้ และติดต่อ KBTG EA ก่อนกรอก เนื่องจากมีความเป็นไปได้โครงการ IT customized)', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: q5O365KnowledgeToSharepoint === 'yes' ? 'สามารถรวบรวมได้ (จัดเก็บลง OneDrive/SharePoint ได้)' : 'ไม่สามารถรวบรวมได้ (หรือต้องการใช้ Knowledge นอก Office 365 - แนะนำโซลูชัน Microsoft หรือติดต่อ KBTG EA)', bold: true, size: 21 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'ข้อที่ 6: การกำกับดูแล UAM และการโอนย้ายสิทธิ์', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'มีความพร้อมในการรับผิดชอบทบทวนสิทธิ์ UAM และส่งมอบความเป็นเจ้าของ Agent', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: effectiveQ6Uam === 'yes' ? 'พร้อม (ทีมงานสามารถดูแล UAM เองได้)' : 'ไม่พร้อม (ต้องการ UAM รวมศูนย์ขององค์กร)', bold: true, size: 21 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'ข้อที่ 7: แผนโมเดล Local LLM', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'มีแผนจะใช้งาน Local LLM หรือโมเดลที่โฮสต์บน KBank/KBTG ในอนาคต', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: effectiveQ7Llm === 'yes' ? 'มีแผน (ต้องการใช้ Private / KBTG Model)' : 'ไม่มีแผน (ใช้ Cloud LLM มาตรฐาน)', bold: true, size: 21 })] })] })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 240 } }),

          // Section 4: Scoring Matrix Breakdown
          new Paragraph({
            text: '4. รายละเอียดคะแนนการประเมิน',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 }
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: headerBorder,
                    shading: { fill: 'F1F5F9' },
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'เครื่องมือที่พิจารณา', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: headerBorder,
                    shading: { fill: 'F1F5F9' },
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'คะแนนถ่วงน้ำหนัก', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: headerBorder,
                    shading: { fill: 'F1F5F9' },
                    width: { size: 45, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'สรุปความคุ้มค่าและความเหมาะสม', bold: true, size: 22 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Microsoft 365 Copilot (Easy mode) Advanced license allow share', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: `${scores.m365_copilot}%`, bold: true, size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: `ค่าไลเซนส์รายปี: ฿${annualCostThb.toLocaleString()} บาท/ปี เพิ่มประสิทธิภาพการทำงานทันทีบนแอปพลิเคชัน Office 365`, size: 21 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Microsoft 365 Copilot Studio', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: `${scores.copilot_studio}%`, bold: true, size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: `ค่าไลเซนส์รายปี: ฿${annualCostThb.toLocaleString()} บาท/ปี เครื่องมือ Visual Low-Code สำหรับสร้าง Multi-Stage Agentic Workflow`, size: 21 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Athena (ระบบภายในองค์กร)', size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: `${scores.athena}%`, bold: true, size: 21 })] })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ children: [new TextRun({ text: `ต้นทุนดำเนินการ: ฿${athenaTotalCostThb.toLocaleString()} บาท (Gemini 3.1 Flash Lite) รองรับ SmartServe, UAM รวมศูนย์, ไม่มีค่าไลเซนส์รายคน`, size: 21 })] })] })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 360 } }),

          // Section 5: Human Override, Sign-off & Official Stamp Section
          new Paragraph({
            text: '5. การพิจารณาอนุมัติโดยผู้มีอำนาจ การปรับเปลี่ยนผล และการประทับตราทางการ',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'ส่วนนี้จัดทำขึ้นสำหรับการพิจารณาของผู้บริหาร การปรับเปลี่ยนผลโดยเจ้าหน้าที่ (Manual Override) การลงนามรับรองความเสี่ยง และการประทับตราแผนก/ฝ่ายงานอย่างเป็นทางการ',
                italics: true,
                size: 21
              })
            ],
            spacing: { after: 180 }
          }),

          // Override Decision Box
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: thinBorder,
                    shading: { fill: 'F8FAFC' },
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'การตัดสินใจของผู้มีอำนาจ:', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: '[   ] ยอมรับผลการแนะนำของระบบอัตโนมัติ', size: 22 }),
                          new TextRun({ text: '\n[   ] ขอปรับเปลี่ยนผลเป็นเครื่องมืออื่น (Override)', size: 22 })
                        ]
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: thinBorder,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'เครื่องมือที่เลือกใช้แทน (กรณีขอปรับเปลี่ยน):', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: '[   ] Microsoft 365 Copilot (Easy mode) Advanced license allow share     [   ] Microsoft 365 Copilot Studio     [   ] Athena',
                            size: 21
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: thinBorder,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'เหตุผลความจำเป็นในการปรับเปลี่ยน / ความเห็นของผู้บริหาร:', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: '\n_________________________________________________________________________________\n\n_________________________________________________________________________________\n\n_________________________________________________________________________________\n',
                            size: 20
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 240 } }),

          // Sign-off & Stamp Box Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: thinBorder,
                    width: { size: 60, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'ข้อมูลผู้ลงนามอนุมัติและรายละเอียดผู้ตรวจสอบ', bold: true, size: 23 })] }),
                      new Paragraph({ children: [new TextRun({ text: '\nชื่อ-นามสกุล ผู้ประเมิน: ____________________________________________', size: 21 })] }),
                      new Paragraph({ children: [new TextRun({ text: '\nบทบาท / ตำแหน่ง: ________________________________________________', size: 21 })] }),
                      new Paragraph({ children: [new TextRun({ text: `\nฝ่ายงาน / ส่วนงาน: ${departmentName ? departmentName : '______________________________________________'}`, size: 21 })] }),
                      new Paragraph({ children: [new TextRun({ text: '\nลายมือชื่อ: ____________________________________________________', size: 21 })] }),
                      new Paragraph({ children: [new TextRun({ text: '\nวันที่ลงนาม: ____________________________________________________\n', size: 21 })] })
                    ]
                  }),
                  new TableCell({
                    borders: stampBorder,
                    shading: { fill: 'F8FAFC' },
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: 'ตราประทับทางการของหน่วยงาน',
                            bold: true,
                            size: 21,
                            color: '64748B'
                          })
                        ]
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 400, after: 400 },
                        children: [
                          new TextRun({
                            text: '[ ประทับตราหน่วยงาน / ส่วนงานที่นี่ ]',
                            italics: true,
                            size: 20,
                            color: '94A3B8'
                          })
                        ]
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: 'ตรวจสอบความถูกต้องของตราประทับแล้ว',
                            size: 18,
                            color: '94A3B8'
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }
    ]
  });

  // Pack to Blob and trigger browser download
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileDateStr = currentDate.toISOString().slice(0, 10);
  a.download = `AI_Tool_Selection_Report_${fileDateStr}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
