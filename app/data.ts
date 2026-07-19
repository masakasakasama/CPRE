export type Unit = {
  id: number;
  title: string;
  level: "L1" | "L2" | "L3";
  duration: string;
  keywords: string[];
  summaryJa: string;
  source: string;
};

export type Question = {
  id: string;
  unit: number;
  eo: string;
  kind: "single" | "multiple" | "boolean";
  prompt: string;
  options: string[];
  correct: number[];
  points: 1 | 2 | 3;
  keyword: string;
  explanationJa: string;
  source: string;
};

export const units: Unit[] = [
  {
    id: 1,
    title: "Introduction and Overview of Requirements Engineering",
    level: "L2",
    duration: "1 h",
    keywords: ["requirement", "stakeholder", "system", "Requirements Engineering"],
    summaryJa: "REの目的、要求の種類、主要タスク、Requirements Engineerの役割を整理します。",
    source: "Syllabus 3.3.0 · Chapter 1",
  },
  {
    id: 2,
    title: "Fundamental Principles of Requirements Engineering",
    level: "L2",
    duration: "1 h 30 m",
    keywords: ["value-orientation", "shared understanding", "context", "validation"],
    summaryJa: "あらゆるRE活動を支える9つの原則と、その重要性を理解します。",
    source: "Syllabus 3.3.0 · Chapter 2",
  },
  {
    id: 3,
    title: "Work Products and Documentation Practices",
    level: "L3",
    duration: "4 h 30 m",
    keywords: ["work product", "requirements specification", "model", "prototype"],
    summaryJa: "自然言語、テンプレート、モデル、用語集、プロトタイプを使った要求の表現を学びます。",
    source: "Syllabus 3.3.0 · Chapter 3",
  },
  {
    id: 4,
    title: "Practices for Requirements Elaboration",
    level: "L3",
    duration: "4 h 30 m",
    keywords: ["requirements source", "elicitation", "conflict resolution", "validation"],
    summaryJa: "要求源の特定、引き出し、コンフリクト解決、妥当性確認を状況に応じて使い分けます。",
    source: "Syllabus 3.3.0 · Chapter 4",
  },
  {
    id: 5,
    title: "Process and Working Structure",
    level: "L3",
    duration: "1 h 45 m",
    keywords: ["RE process", "process facet", "tailoring", "feedback loop"],
    summaryJa: "開発状況に合わせてREプロセスを構成し、適切な作業構造を選ぶ考え方を学びます。",
    source: "Syllabus 3.3.0 · Chapter 5",
  },
  {
    id: 6,
    title: "Management Practices for Requirements",
    level: "L2",
    duration: "2 h 30 m",
    keywords: ["baseline", "traceability", "change request", "prioritization"],
    summaryJa: "要求のライフサイクル、版、構成、トレース、変更、優先順位を管理します。",
    source: "Syllabus 3.3.0 · Chapter 6",
  },
  {
    id: 7,
    title: "Tool Support",
    level: "L2",
    duration: "45 m",
    keywords: ["RE tool", "tool introduction", "configuration", "training"],
    summaryJa: "REツールの価値と限界を理解し、導入を組織的な変化として計画します。",
    source: "Syllabus 3.3.0 · Chapter 7",
  },
];

export const questions: Question[] = [
  {
    id: "Q001", unit: 1, eo: "EO 1.1.1", kind: "single", points: 1,
    prompt: "Which term denotes a person or organization that influences a system's requirements or is affected by the system?",
    options: ["Stakeholder", "Component", "Baseline", "Attribute"], correct: [0], keyword: "stakeholder",
    explanationJa: "Stakeholderは、システムや要求に影響を与える、またはシステムから影響を受ける個人・組織です。",
    source: "Syllabus 3.3.0 · 1.1",
  },
  {
    id: "Q002", unit: 1, eo: "EO 1.1.2", kind: "single", points: 1,
    prompt: "A requirement limits the permitted database technology even though the user-visible behavior is unchanged. What kind of requirement is it?",
    options: ["Functional requirement", "Quality requirement", "Constraint", "Stakeholder requirement"], correct: [2], keyword: "constraint",
    explanationJa: "解決空間を制限する条件はconstraintです。機能や品質そのものではなく、実現方法の自由度を狭めます。",
    source: "Syllabus 3.3.0 · 1.1",
  },
  {
    id: "Q003", unit: 1, eo: "EO 1.2.1", kind: "multiple", points: 2,
    prompt: "Which TWO outcomes are typical benefits of adequate Requirements Engineering?",
    options: ["A better basis for effort estimation", "Guaranteed absence of defects", "Lower risk of building the wrong system", "No need for stakeholder feedback"], correct: [0, 2], keyword: "value of RE",
    explanationJa: "適切なREは見積りの土台を作り、誤ったシステムを作るリスクを下げます。欠陥ゼロやフィードバック不要を保証しません。",
    source: "Syllabus 3.3.0 · 1.2",
  },
  {
    id: "Q004", unit: 1, eo: "EO 1.2.2", kind: "boolean", points: 1,
    prompt: "True or False: Assuming that requirements are self-evident can be a symptom of inadequate Requirements Engineering.",
    options: ["True", "False"], correct: [0], keyword: "inadequate RE",
    explanationJa: "要求は自明だという思い込みは、確認や合意を省き、欠落や誤解を生みやすくします。",
    source: "Syllabus 3.3.0 · 1.2",
  },
  {
    id: "Q005", unit: 1, eo: "EO 1.4.1", kind: "multiple", points: 2,
    prompt: "Which TWO activities are major Requirements Engineering tasks?",
    options: ["Requirements validation", "Source-code compilation", "Requirements elicitation", "Production monitoring only"], correct: [0, 2], keyword: "RE tasks",
    explanationJa: "主要タスクにはelicitation、documentation、validation、managementがあります。",
    source: "Syllabus 3.3.0 · 1.4",
  },
  {
    id: "Q006", unit: 1, eo: "EO 1.5.1", kind: "single", points: 1,
    prompt: "Which statement best characterizes the role of a Requirements Engineer?",
    options: ["It is always a formal job title", "It bridges problem understanding and potential solutions", "It replaces every stakeholder", "It only writes specifications"], correct: [1], keyword: "Requirements Engineer",
    explanationJa: "Requirements Engineerは職名に限らず、問題と解決案の間を橋渡しする役割です。",
    source: "Syllabus 3.3.0 · 1.5",
  },
  {
    id: "Q007", unit: 2, eo: "EO 2.1.1", kind: "single", points: 1,
    prompt: "Which principle emphasizes that a requirement is useful only when its benefit justifies the effort around it?",
    options: ["Innovation", "Value-orientation", "Evolution", "Context"], correct: [1], keyword: "value-orientation",
    explanationJa: "Value-orientationは、要求を目的そのものではなく価値を生む手段として扱います。",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q008", unit: 2, eo: "EO 2.2.2", kind: "single", points: 2,
    prompt: "A team has a shared vocabulary but rarely records decisions. Which form of shared understanding mainly supports the team?",
    options: ["Explicit shared understanding", "Implicit shared understanding", "Formal verification", "Configuration control"], correct: [1], keyword: "implicit shared understanding",
    explanationJa: "共通知識や信頼に依存する理解はimplicitです。文書化・合意された要求に基づくものがexplicitです。",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q009", unit: 2, eo: "EO 2.2.2", kind: "multiple", points: 2,
    prompt: "Which TWO actions help clarify a system's context?",
    options: ["Identify external interfaces", "Define the system boundary", "Ignore environmental changes", "Treat every external fact as in scope"], correct: [0, 1], keyword: "context",
    explanationJa: "system boundaryと外部interfaceを明確にすることで、システムと関連環境の関係を整理できます。",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q010", unit: 2, eo: "EO 2.2.2", kind: "boolean", points: 1,
    prompt: "True or False: Requirements are expected to evolve, so change should be treated as a normal case.",
    options: ["True", "False"], correct: [0], keyword: "evolution",
    explanationJa: "Evolutionの原則では、要求変更は例外ではなく通常の現象として扱います。",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q011", unit: 2, eo: "EO 2.2.2", kind: "single", points: 1,
    prompt: "Why is validation a fundamental principle of Requirements Engineering?",
    options: ["It freezes all requirements", "It checks whether work products support the intended needs", "It removes the need for elicitation", "It selects a tool vendor"], correct: [1], keyword: "validation",
    explanationJa: "Validationは、要求や成果物が意図したニーズに適合しているかを確かめる活動です。",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q012", unit: 2, eo: "EO 2.2.2", kind: "single", points: 2,
    prompt: "A team repeatedly applies the same familiar solution without exploring alternatives. Which principle deserves more attention?",
    options: ["Innovation", "Baseline", "Traceability", "Version control"], correct: [0], keyword: "innovation",
    explanationJa: "Innovationの原則は、既存案の反復だけでなく、より良い可能性を探索する必要性を示します。",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q013", unit: 3, eo: "EO 3.1.1", kind: "single", points: 1,
    prompt: "Which term is the broadest label for an artifact created or used during Requirements Engineering?",
    options: ["Work product", "Persona", "Sprint", "Supplier"], correct: [0], keyword: "work product",
    explanationJa: "REで作成・利用される成果物を広くwork productと呼びます。文書だけに限定されません。",
    source: "Syllabus 3.3.0 · 3.1",
  },
  {
    id: "Q014", unit: 3, eo: "EO 3.1.2", kind: "single", points: 2,
    prompt: "A product goal and a detailed interface rule describe the same system at different heights. Which concept explains the difference?",
    options: ["Abstraction level", "Cardinality", "Priority", "Conflict type"], correct: [0], keyword: "abstraction level",
    explanationJa: "同じ対象でも、目的レベルと詳細仕様ではabstraction levelが異なります。",
    source: "Syllabus 3.3.0 · 3.1.2",
  },
  {
    id: "Q015", unit: 3, eo: "EO 3.2.1", kind: "multiple", points: 2,
    prompt: "Which TWO practices reduce ambiguity in natural-language requirements?",
    options: ["Use consistent terms", "Prefer vague qualifiers", "Review sentence structure", "Avoid all stakeholder review"], correct: [0, 2], keyword: "natural language",
    explanationJa: "用語の一貫性と文構造のレビューは曖昧さを減らします。曖昧な修飾語は避けます。",
    source: "Syllabus 3.3.0 · 3.2",
  },
  {
    id: "Q016", unit: 3, eo: "EO 3.3.1", kind: "single", points: 2,
    prompt: "What is a primary benefit of a phrase template?",
    options: ["It guarantees correctness", "It guides authors toward a consistent sentence structure", "It replaces validation", "It creates source code"], correct: [1], keyword: "phrase template",
    explanationJa: "phrase templateは文の構造を揃える支援です。内容の正しさを自動保証するものではありません。",
    source: "Syllabus 3.3.0 · 3.3",
  },
  {
    id: "Q017", unit: 3, eo: "EO 3.4.2", kind: "single", points: 2,
    prompt: "Which model is most suitable for showing a system and the external actors or systems around it?",
    options: ["Context model", "Version graph", "Priority matrix", "Change log"], correct: [0], keyword: "context model",
    explanationJa: "context modelはシステムと周辺のactorや外部systemとの関係を表します。",
    source: "Syllabus 3.3.0 · 3.4.2",
  },
  {
    id: "Q018", unit: 3, eo: "EO 3.5.1", kind: "boolean", points: 1,
    prompt: "True or False: A glossary can support shared understanding by giving project terms a consistent meaning.",
    options: ["True", "False"], correct: [0], keyword: "glossary",
    explanationJa: "glossaryは用語の意味を共有し、同義語・曖昧語による誤解を減らします。",
    source: "Syllabus 3.3.0 · 3.5",
  },
  {
    id: "Q019", unit: 3, eo: "EO 3.7.1", kind: "single", points: 1,
    prompt: "What is a useful purpose of a prototype in Requirements Engineering?",
    options: ["To make every requirement final", "To explore or communicate an idea", "To replace the product backlog", "To approve a baseline automatically"], correct: [1], keyword: "prototype",
    explanationJa: "prototypeは案の探索、理解、フィードバックに有効です。要求を自動的に確定するものではありません。",
    source: "Syllabus 3.3.0 · 3.7",
  },
  {
    id: "Q020", unit: 4, eo: "EO 4.1.1", kind: "multiple", points: 2,
    prompt: "Which TWO can be valid sources for requirements?",
    options: ["Stakeholders", "Existing documents", "Only the project manager", "Only the future system"], correct: [0, 1], keyword: "requirements source",
    explanationJa: "要求源にはstakeholder、既存文書、既存systemなど複数の種類があります。単一の役割に限定しません。",
    source: "Syllabus 3.3.0 · 4.1",
  },
  {
    id: "Q021", unit: 4, eo: "EO 4.1.2", kind: "single", points: 2,
    prompt: "A stakeholder group contains thousands of similar end users who cannot all be interviewed. What can represent that role?",
    options: ["A persona", "A baseline", "A configuration", "A state machine"], correct: [0], keyword: "persona",
    explanationJa: "多数または特定できない利用者群は、典型像を表すpersonaで補助的に扱えます。",
    source: "Syllabus 3.3.0 · 4.1",
  },
  {
    id: "Q022", unit: 4, eo: "EO 4.2.1", kind: "single", points: 2,
    prompt: "Which elicitation technique is especially useful when users perform work that is difficult to explain verbally?",
    options: ["Observation", "Version control", "Prioritization", "Configuration audit"], correct: [0], keyword: "observation",
    explanationJa: "言語化しにくい実務はobservationで実際の行動や環境を確認すると理解しやすくなります。",
    source: "Syllabus 3.3.0 · 4.2",
  },
  {
    id: "Q023", unit: 4, eo: "EO 4.2.1", kind: "multiple", points: 2,
    prompt: "Which TWO factors should influence the choice of an elicitation technique?",
    options: ["The type and availability of sources", "The information sought", "A rule to always use interviews", "The logo color of the tool"], correct: [0, 1], keyword: "elicitation technique",
    explanationJa: "techniqueは要求源の性質・利用可能性と、得たい情報に合わせて選択します。",
    source: "Syllabus 3.3.0 · 4.2",
  },
  {
    id: "Q024", unit: 4, eo: "EO 4.3.1", kind: "single", points: 2,
    prompt: "Two stakeholders request mutually exclusive behaviors. What should happen before choosing a resolution technique?",
    options: ["Analyze the conflict and the parties' interests", "Delete both requirements", "Freeze the baseline immediately", "Select the cheapest tool"], correct: [0], keyword: "requirements conflict",
    explanationJa: "解決策を選ぶ前に、conflictの種類、原因、関係者の利害を理解する必要があります。",
    source: "Syllabus 3.3.0 · 4.3",
  },
  {
    id: "Q025", unit: 4, eo: "EO 4.4.1", kind: "multiple", points: 2,
    prompt: "Which TWO are useful perspectives when validating requirements?",
    options: ["Whether they reflect stakeholder needs", "Whether they are understandable", "Whether they avoid all future change", "Whether they use the longest possible wording"], correct: [0, 1], keyword: "requirements validation",
    explanationJa: "妥当性確認ではニーズへの適合や理解可能性などを確認します。将来変更がないことは保証できません。",
    source: "Syllabus 3.3.0 · 4.4",
  },
  {
    id: "Q026", unit: 4, eo: "EO 4.4.1", kind: "boolean", points: 1,
    prompt: "True or False: Validation should wait until all requirements are completely documented.",
    options: ["True", "False"], correct: [1], keyword: "early validation",
    explanationJa: "validationは早期かつ反復的に行えます。完成まで待つと手戻りのコストが増えます。",
    source: "Syllabus 3.3.0 · 4.4",
  },
  {
    id: "Q027", unit: 5, eo: "EO 5.1.1", kind: "single", points: 2,
    prompt: "Why can the same Requirements Engineering process be unsuitable for two different projects?",
    options: ["Influencing factors differ", "RE has no repeatable practices", "Every project needs a proprietary tool", "Requirements never share patterns"], correct: [0], keyword: "influencing factors",
    explanationJa: "規模、リスク、契約、開発アプローチなどのinfluencing factorsに応じてprocessを調整します。",
    source: "Syllabus 3.3.0 · 5.1",
  },
  {
    id: "Q028", unit: 5, eo: "EO 5.2.1", kind: "single", points: 2,
    prompt: "Which process characteristic helps expose misunderstandings early?",
    options: ["Short feedback loops", "One final review", "No stakeholder access", "A permanent freeze"], correct: [0], keyword: "feedback loop",
    explanationJa: "短いfeedback loopは理解のずれを早期に検出し、修正コストを抑えます。",
    source: "Syllabus 3.3.0 · 5.2",
  },
  {
    id: "Q029", unit: 5, eo: "EO 5.2.1", kind: "boolean", points: 1,
    prompt: "True or False: A Requirements Engineering process can be iterative even when the surrounding development approach is plan-driven.",
    options: ["True", "False"], correct: [0], keyword: "iterative RE",
    explanationJa: "REの作業構造は周辺の開発アプローチと関連しますが、反復的な確認や精緻化を組み込めます。",
    source: "Syllabus 3.3.0 · 5.2",
  },
  {
    id: "Q030", unit: 5, eo: "EO 5.3.1", kind: "multiple", points: 3,
    prompt: "Which TWO actions belong to tailoring a Requirements Engineering process?",
    options: ["Select suitable practices", "Define when work products are produced", "Copy another project without analysis", "Ignore organizational constraints"], correct: [0, 1], keyword: "tailoring",
    explanationJa: "tailoringでは、状況に合うpractice、work product、役割、タイミングなどを構成します。",
    source: "Syllabus 3.3.0 · 5.3",
  },
  {
    id: "Q031", unit: 5, eo: "EO 5.3.1", kind: "single", points: 2,
    prompt: "A safety-critical project requires documented approvals. What is the best process response?",
    options: ["Include explicit review and approval steps", "Remove all documentation", "Rely only on informal conversation", "Postpone validation until release"], correct: [0], keyword: "process configuration",
    explanationJa: "高いリスクと規制がある場合、明示的なreview・approvalをprocessに組み込みます。",
    source: "Syllabus 3.3.0 · 5.3",
  },
  {
    id: "Q032", unit: 5, eo: "EO 5.1.1", kind: "single", points: 1,
    prompt: "Which item is an influencing factor for configuring an RE process?",
    options: ["Project risk", "The alphabetical order of stakeholder names", "The monitor brand", "The office wall color"], correct: [0], keyword: "risk",
    explanationJa: "project riskは必要な厳密さやreview頻度に影響する重要な要因です。",
    source: "Syllabus 3.3.0 · 5.1",
  },
  {
    id: "Q033", unit: 6, eo: "EO 6.1.1", kind: "single", points: 1,
    prompt: "What is the central purpose of requirements management?",
    options: ["Keep requirements usable through their life cycle", "Prevent every change", "Replace elicitation", "Manage source code only"], correct: [0], keyword: "requirements management",
    explanationJa: "requirements managementは、要求をライフサイクル全体で識別・維持・変更可能な状態に保ちます。",
    source: "Syllabus 3.3.0 · 6.1",
  },
  {
    id: "Q034", unit: 6, eo: "EO 6.3.1", kind: "single", points: 2,
    prompt: "A requirement is revised after a legal change. What enables the team to distinguish the old and new states?",
    options: ["Version control", "A persona", "Observation", "Brainstorming"], correct: [0], keyword: "version control",
    explanationJa: "version controlにより、要求の異なる状態と変更履歴を識別できます。",
    source: "Syllabus 3.3.0 · 6.3",
  },
  {
    id: "Q035", unit: 6, eo: "EO 6.4.1", kind: "single", points: 2,
    prompt: "What is a stable, change-controlled set of logically related work products called?",
    options: ["Baseline", "Interview", "Prototype", "Context boundary"], correct: [0], keyword: "baseline",
    explanationJa: "baselineは、安定し変更管理されたwork productの構成です。",
    source: "Syllabus 3.3.0 · 6.4",
  },
  {
    id: "Q036", unit: 6, eo: "EO 6.6.1", kind: "multiple", points: 2,
    prompt: "Which TWO relationships are examples of traceability?",
    options: ["Requirement to stakeholder need", "Requirement to test case", "Requirement to font preference", "Requirement to office seating"], correct: [0, 1], keyword: "traceability",
    explanationJa: "traceabilityは要求を根拠や下流成果物と結び、影響分析や検証を支援します。",
    source: "Syllabus 3.3.0 · 6.6",
  },
  {
    id: "Q037", unit: 6, eo: "EO 6.7.1", kind: "single", points: 2,
    prompt: "What should happen before an approved requirement is changed?",
    options: ["Assess the change request and its impact", "Edit it without recording", "Delete all linked tests", "Ignore affected stakeholders"], correct: [0], keyword: "change request",
    explanationJa: "change requestを評価し、価値・コスト・影響・関係者を確認してから変更を決定します。",
    source: "Syllabus 3.3.0 · 6.7",
  },
  {
    id: "Q038", unit: 6, eo: "EO 6.8.1", kind: "single", points: 2,
    prompt: "Why is a single priority value often insufficient?",
    options: ["Priorities may depend on several criteria and stakeholders", "Priorities are forbidden", "Every requirement has identical value", "Only tools can assign priorities"], correct: [0], keyword: "prioritization",
    explanationJa: "優先順位は価値、コスト、リスク、依存関係やstakeholder視点など複数基準に依存します。",
    source: "Syllabus 3.3.0 · 6.8",
  },
  {
    id: "Q039", unit: 6, eo: "EO 6.5.1", kind: "boolean", points: 1,
    prompt: "True or False: Requirement attributes can support filtering and stakeholder-specific views.",
    options: ["True", "False"], correct: [0], keyword: "attribute",
    explanationJa: "attributeを使うと、状態・優先度・担当などで要求を抽出し、目的別のviewを作れます。",
    source: "Syllabus 3.3.0 · 6.5",
  },
  {
    id: "Q040", unit: 7, eo: "EO 7.1.1", kind: "multiple", points: 2,
    prompt: "Which TWO capabilities can an RE tool support?",
    options: ["Traceability", "Version handling", "Automatic stakeholder agreement", "Guaranteed requirement quality"], correct: [0, 1], keyword: "RE tool",
    explanationJa: "toolはtraceabilityやversion管理を支援できますが、合意や品質を自動保証しません。",
    source: "Syllabus 3.3.0 · 7.1",
  },
  {
    id: "Q041", unit: 7, eo: "EO 7.1.1", kind: "single", points: 1,
    prompt: "Which statement about tool support is most accurate?",
    options: ["Tools support practices but do not replace sound RE", "A tool removes the need for a process", "The most feature-rich tool is always best", "Tool introduction has no organizational impact"], correct: [0], keyword: "tool support",
    explanationJa: "toolは適切なRE practiceを支援するもので、理解・合意・processそのものを置き換えません。",
    source: "Syllabus 3.3.0 · 7.1",
  },
  {
    id: "Q042", unit: 7, eo: "EO 7.2.1", kind: "multiple", points: 2,
    prompt: "Which TWO activities help introduce a Requirements Engineering tool successfully?",
    options: ["Train users", "Pilot the tool in a suitable scope", "Ignore existing workflows", "Configure every feature before learning needs"], correct: [0, 1], keyword: "tool introduction",
    explanationJa: "trainingと限定的なpilotは、利用方法と組織への影響を検証しながら導入する助けになります。",
    source: "Syllabus 3.3.0 · 7.2",
  },
  {
    id: "Q043", unit: 7, eo: "EO 7.2.1", kind: "single", points: 2,
    prompt: "A new RE tool is technically capable but users avoid it. Which missing factor is most likely?",
    options: ["Change management and user involvement", "More file formats", "A darker logo", "A longer product name"], correct: [0], keyword: "change management",
    explanationJa: "tool導入は組織変化です。user involvement、training、移行支援がないと定着しにくくなります。",
    source: "Syllabus 3.3.0 · 7.2",
  },
  {
    id: "Q044", unit: 7, eo: "EO 7.2.1", kind: "boolean", points: 1,
    prompt: "True or False: Tool selection should begin with the organization's RE needs and process context.",
    options: ["True", "False"], correct: [0], keyword: "tool selection",
    explanationJa: "必要なpracticeとprocess contextを先に理解し、それを支援できるtoolを選びます。",
    source: "Syllabus 3.3.0 · 7.2",
  },
  {
    id: "Q045", unit: 7, eo: "EO 7.1.1", kind: "single", points: 1,
    prompt: "Which risk can arise when a tool's default workflow is adopted without evaluation?",
    options: ["The process may no longer fit the project context", "All requirements become valid", "Stakeholder conflicts disappear", "Training becomes unnecessary"], correct: [0], keyword: "tool configuration",
    explanationJa: "toolのdefaultにprocessを無批判に合わせると、project contextに不適合な作業構造になり得ます。",
    source: "Syllabus 3.3.0 · 7.1–7.2",
  },
];

export const sources = [
  { id: "fl-syllabus-en", title: "CPRE Foundation Level Syllabus", version: "3.3.0", chapter: "EU 1–7", url: "https://cpre.ireb.org/en/downloads-and-resources/downloads#cpre-foundation-level-syllabus" },
  { id: "fl-handbook-en", title: "CPRE Foundation Level Handbook", version: "1.3.1", chapter: "Chapters 1–7", url: "https://cpre.ireb.org/en/downloads-and-resources/downloads#cpre-foundation-level-handbook" },
  { id: "cpre-glossary-en", title: "CPRE Glossary", version: "2.2.0", chapter: "Definitions of Terms", url: "https://cpre.ireb.org/en/downloads-and-resources/downloads#cpre-glossary" },
  { id: "fl-exam-regulations-en", title: "Foundation Level Examination Regulations", version: "5.6.2", chapter: "Sections 1–2", url: "https://cpre.ireb.org/en/downloads-and-resources/downloads#cpre-foundation-level-and-agile-primer-examination-regulations" },
];
