import type { Question } from "./data.ts";

export const calibratedCoreUnit7Questions: Question[] = [
  {
    id: "Q040", unit: 7, eo: "EO 7.1.1", kind: "multiple", points: 2,
    prompt: "Which TWO capabilities can Requirements Engineering tools directly support?",
    options: ["Maintaining trace links", "Handling versions and configurations", "Resolving stakeholder value conflicts without human judgment", "Determining objectively which requirement has the highest business value"], correct: [0, 1], keyword: "RE tool",
    explanationJa: "RE toolはtraceabilityやversion、configuration管理を支援できるが、利害調整やbusiness value判断を人に代わって正解として決定するものではない",
    source: "Syllabus 3.3.0 · 7.1",
  },
  {
    id: "Q041", unit: 7, eo: "EO 7.1.1", kind: "single", points: 1,
    prompt: "Which statement about Requirements Engineering tool support is most accurate?",
    options: ["A tool can support RE practices but does not replace sound RE judgment and process design", "The tool's built-in workflow should normally define the organization's RE process", "The tool with the largest feature set is generally the best choice", "Tool introduction is mainly a technical installation task once the license is purchased"], correct: [0], keyword: "tool support",
    explanationJa: "ツールは適切なRE practiceを支援する手段。要求の理解、判断、合意やprocess設計そのものを置き換えるわけではない",
    source: "Syllabus 3.3.0 · 7.1",
  },
  {
    id: "Q042", unit: 7, eo: "EO 7.2.1", kind: "multiple", points: 2,
    prompt: "Which TWO actions support a controlled introduction of a new Requirements Engineering tool?",
    options: ["Train the people who will use the tool", "Pilot the tool in a limited, representative scope", "Configure every available feature before evaluating actual needs", "Migrate all existing requirements before defining evaluation criteria"], correct: [0, 1], keyword: "tool introduction",
    explanationJa: "trainingとpilotにより、利用方法、適合性、導入上の問題を限定範囲で確認してから展開できる",
    source: "Syllabus 3.3.0 · 7.2",
  },
  {
    id: "Q043", unit: 7, eo: "EO 7.2.1", kind: "single", points: 2,
    prompt: "A new RE tool provides all required technical capabilities, but users keep returning to spreadsheets. Which missing factor is most likely to explain the failure?",
    options: ["Change management and user involvement", "Support for additional modeling notations", "A larger set of configurable attributes", "A more advanced versioning mechanism"], correct: [0], keyword: "change management",
    explanationJa: "技術要件を満たしていても、利用者参加、training、移行支援などのchange managementが不足すると定着しにくい",
    source: "Syllabus 3.3.0 · 7.2",
  },
  {
    id: "Q044", unit: 7, eo: "EO 7.2.1", kind: "boolean", points: 1,
    prompt: "True or False: Selecting an RE tool should start from the organization's RE goals, process context, and support needs rather than from a feature list alone.",
    options: ["True", "False"], correct: [0], keyword: "tool selection",
    explanationJa: "ツールは、自組織で必要な要求工学の活動とprocess contextを明確にしたうえで、それを支援できるかで評価する",
    source: "Syllabus 3.3.0 · 7.2",
  },
  {
    id: "Q045", unit: 7, eo: "EO 7.1.1", kind: "single", points: 1,
    prompt: "What is a key risk of adopting an RE tool's default workflow without evaluating it against the project context?",
    options: ["The resulting RE process may not fit the project's needs and constraints", "Traceability becomes impossible even if the tool supports links", "All stakeholders automatically receive the same access rights", "Requirements can no longer be versioned by the organization"], correct: [0], keyword: "tool configuration",
    explanationJa: "ツールのdefault workflowを無条件に採用すると、プロジェクトの規模、risk、組織ルールなどに合わないRE processになる可能性がある",
    source: "Syllabus 3.3.0 · 7.1–7.2",
  },
];
