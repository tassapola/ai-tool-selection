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
 */
export async function exportAssessmentToDocx({
  evaluation,
  q1AgenticWorkflow,
  hUsers,
  uUsers,
  athenaInputs = {},
  q4ConnectNonM365,
  q5UamGovernance,
  q6LocalKbtgLlm,
  variables = {},
  tools = []
}) {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = currentDate.toLocaleTimeString('en-GB', {
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
            text: 'AI TOOL SELECTION ASSESSMENT REPORT',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 360 },
            children: [
              new TextRun({
                text: 'Microsoft 365 Copilot vs Microsoft 365 Copilot Studio vs Athena',
                bold: true,
                color: '475569',
                size: 22
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'Assessment Date:', bold: true })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ text: `${formattedDate}` })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    shading: { fill: 'F8FAFC' },
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Evaluation Time:', bold: true })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ text: `${formattedTime} (Local)` })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: thinBorder,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Active Weighting:', bold: true })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [new Paragraph({ text: `${weightCost}% Cost / ${weightFeatures}% Features` })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Document Status:', bold: true })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [new Paragraph({ text: 'Formal Decision Record' })]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 240 } }),

          // Section 1: Executive Summary & Recommendation Decision
          new Paragraph({
            text: '1. EXECUTIVE SUMMARY & DECISION',
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
                    shading: { fill: 'EEF2FF' },
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Recommended Tool:', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    borders: headerBorder,
                    shading: { fill: 'EEF2FF' },
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: recommendedTool ? recommendedTool.name : 'Assessment in progress',
                            bold: true,
                            size: 24,
                            color: '1E3A8A'
                          }),
                          new TextRun({
                            text: recommendedTool ? ` (${recommendedTool.mode_name})` : '',
                            italics: true,
                            size: 20
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'Overall Match Score:', bold: true })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [new Paragraph({ text: `${scores[recommendedToolId] || 0}% Fit (based on 60% Cost / 40% Features)` })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: thinBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Financial Economics:', bold: true })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [
                      new Paragraph({
                        text: `Microsoft Annual License: ฿${annualCostThb.toLocaleString()} THB/year  |  Athena Run Cost: ฿${athenaTotalCostThb.toLocaleString()} THB (Dev + Pilot/Prod)`
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 180 } }),

          new Paragraph({
            text: 'Decision Rationale & Key Drivers:',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 120, after: 100 }
          }),
          ...reasoning.map(r => new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [new TextRun({ text: r })]
          })),

          new Paragraph({ text: '', spacing: { after: 240 } }),

          // Section 2: Active Parameters in SQLite Database
          new Paragraph({
            text: '2. PARAMETERS & THRESHOLDS CONFIGURED IN DATABASE',
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'Parameter Key', bold: true })] })]
                  }),
                  new TableCell({
                    borders: headerBorder,
                    shading: { fill: 'F1F5F9' },
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Configured Value', bold: true })] })]
                  }),
                  new TableCell({
                    borders: headerBorder,
                    shading: { fill: 'F1F5F9' },
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Unit / Context', bold: true })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'weight_cost_percentage' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: `${weightCost}%` })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'Weight for cost economics' })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'weight_features_percentage' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: `${weightFeatures}%` })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'Weight for architecture & features' })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'usd_thb_rate' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: `฿${variables.usd_thb_rate ?? 35.0}` })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'THB/USD exchange rate' })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'm365_license_monthly_usd' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: `$${variables.m365_license_monthly_usd ?? 20.0}` })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'USD / user / month' })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'athena_foundation_model' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'Gemini 3.1 Flash Lite', bold: true })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'Cost baseline model assumption' })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'COST_OF_1_DL_PAGE' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: `฿${variables.COST_OF_1_DL_PAGE ?? 1.0}` })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'THB per page (docx, txt, md)' })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'COST_OF_1_DM_PAGE / DH_PAGE' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: `฿${variables.COST_OF_1_DM_PAGE ?? 1.4}` })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'THB per page (pdf, pptx)' })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'COST_OF_PROD_QUESTION' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: `฿${variables.COST_OF_PROD_QUESTION ?? 1.0}` })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'THB per production chat query' })] })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 240 } }),

          // Section 3: Detailed Questionnaire Inputs
          new Paragraph({
            text: '3. QUESTIONNAIRE FORMS & RECORDED INPUTS',
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
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Question', bold: true })] })]
                  }),
                  new TableCell({
                    borders: headerBorder,
                    shading: { fill: 'F1F5F9' },
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Description / Criteria', bold: true })] })]
                  }),
                  new TableCell({
                    borders: headerBorder,
                    shading: { fill: 'F1F5F9' },
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Recorded User Response', bold: true })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'Question 1' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'Team capacity to learn multi-stage agentic workflow' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: q1AgenticWorkflow === 'yes' ? 'Yes (Workflow Capable)' : 'No (Easy Mode Required)', bold: true })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'Question 2' })] }),
                  new TableCell({
                    borders: thinBorder,
                    children: [new Paragraph({ text: 'Microsoft Solution License Estimation:\nVariable H (Existing Licenses) vs Variable U (Users Needed)' })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [
                      new Paragraph({
                        text: `H = ${H} users | U = ${U} users\nAdditional Needed: ${additionalLicensesNeeded} seats\nCalculated Cost: ฿${annualCostThb.toLocaleString()} THB/year`
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'Question 3' })] }),
                  new TableCell({
                    borders: thinBorder,
                    children: [new Paragraph({ text: 'Athena Cost Modeling (Dev/PoC Ingestion + Pilot/Production Run-Rate)' })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [
                      new Paragraph({
                        text: `DL: ${athenaInputs.DL || 0} docs (${athenaInputs.DL_AVG_PAGES || 0} pgs) | DM: ${athenaInputs.DM || 0} | DH: ${athenaInputs.DH || 0}\nEval Q: ${athenaInputs.EVAL_Q || 0} | Prod Users: ${athenaInputs.U || U}\nDev/PoC: ฿${athenaDevPocTotal.toLocaleString()} | Prod: ฿${athenaPilotProdTotal.toLocaleString()}\nTotal Athena: ฿${athenaTotalCostThb.toLocaleString()} THB`
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'Question 4' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'Need to connect to systems within KBank NOT M365/MDP (e.g. SmartServe)' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: q4ConnectNonM365 === 'yes' ? 'Yes (Requires SmartServe)' : 'No (M365 only)', bold: true })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'Question 5' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'Accountable for decentralized UAM review and agent owner handover' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: q5UamGovernance === 'yes' ? 'Yes (Team can audit UAM)' : 'No (Need centralized UAM)', bold: true })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'Question 6' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'Plan to use Local LLM or KBank/KBTG-hosted LLM in future' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: q6LocalKbtgLlm === 'yes' ? 'Yes (Private/KBTG model roadmap)' : 'No (Standard Cloud LLM)', bold: true })] })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 240 } }),

          // Section 4: Scoring Matrix Breakdown
          new Paragraph({
            text: '4. SCORING MATRIX BREAKDOWN',
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'Tool Candidate', bold: true })] })]
                  }),
                  new TableCell({
                    borders: headerBorder,
                    shading: { fill: 'F1F5F9' },
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Weighted Score', bold: true })] })]
                  }),
                  new TableCell({
                    borders: headerBorder,
                    shading: { fill: 'F1F5F9' },
                    width: { size: 45, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Economics & Fit Summary', bold: true })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'Microsoft 365 Copilot (Easy Mode)' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: `${scores.m365_copilot}%`, bold: true })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: `Annual License: ฿${annualCostThb.toLocaleString()} THB/yr. Out-of-the-box productivity in Office 365 apps.` })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'Microsoft 365 Copilot Studio' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: `${scores.copilot_studio}%`, bold: true })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: `Annual License: ฿${annualCostThb.toLocaleString()} THB/yr. Visual low-code multi-stage agentic builder.` })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: 'Athena (Internal System)' })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: `${scores.athena}%`, bold: true })] }),
                  new TableCell({ borders: thinBorder, children: [new Paragraph({ text: `Run Cost: ฿${athenaTotalCostThb.toLocaleString()} THB (Gemini 3.1 Flash Lite). Connects SmartServe, centralized UAM, zero seat tax.` })] })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 360 } }),

          // Section 5: Human Override, Sign-off & Official Stamp Section
          new Paragraph({
            text: '5. HUMAN OVERRIDE, APPROVAL SIGN-OFF & OFFICIAL STAMP',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 }
          }),

          new Paragraph({
            text: 'This section is designated for executive review, formal manual overrides, risk sign-offs, and department stamp validation.',
            spacing: { after: 180 },
            italics: true
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'Management Action:', bold: true })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: '[   ] ACCEPT AUTOMATED RECOMMENDATION' }),
                          new TextRun({ text: '\n[   ] OVERRIDE WITH ALTERNATE TOOL' })
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'Overridden Tool (if applicable):', bold: true })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [
                      new Paragraph({
                        text: '[   ] Microsoft 365 Copilot (Easy)    [   ] Copilot Studio    [   ] Athena'
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'Justification for Override / Management Remarks:', bold: true })] })]
                  }),
                  new TableCell({
                    borders: thinBorder,
                    children: [
                      new Paragraph({
                        text: '\n_________________________________________________________________________________\n\n_________________________________________________________________________________\n\n_________________________________________________________________________________\n'
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
                      new Paragraph({ children: [new TextRun({ text: 'Authorized Sign-off & Reviewer Details', bold: true, size: 22 })] }),
                      new Paragraph({ text: '\nAssessor Name: ________________________________________________' }),
                      new Paragraph({ text: '\nRole / Position: ________________________________________________' }),
                      new Paragraph({ text: '\nDepartment / Division: _________________________________________' }),
                      new Paragraph({ text: '\nSignature: _____________________________________________________' }),
                      new Paragraph({ text: '\nSign-off Date: _________________________________________________\n' })
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
                            text: 'OFFICIAL DEPARTMENT STAMP',
                            bold: true,
                            size: 18,
                            color: '64748B'
                          })
                        ]
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 400, after: 400 },
                        children: [
                          new TextRun({
                            text: '[ AFFIX OFFICIAL STAMP / SEAL HERE ]',
                            italics: true,
                            size: 16,
                            color: '94A3B8'
                          })
                        ]
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: 'Verification Stamp Validated',
                            size: 14,
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
