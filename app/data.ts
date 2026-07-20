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
    summaryJa: "要求工学（RE）の目的、要求の種類、主な活動、Requirements Engineerの役割を学びます。",
    source: "Syllabus 3.3.0 · Chapter 1",
  },
  {
    id: 2,
    title: "Fundamental Principles of Requirements Engineering",
    level: "L2",
    duration: "1 h 30 m",
    keywords: ["value-orientation", "shared understanding", "context", "validation"],
    summaryJa: "要求工学の判断の土台となる9つの原則と、それぞれが必要な理由を学びます。",
    source: "Syllabus 3.3.0 · Chapter 2",
  },
  {
    id: 3,
    title: "Work Products and Documentation Practices",
    level: "L3",
    duration: "4 h 30 m",
    keywords: ["work product", "requirements specification", "model", "prototype"],
    summaryJa: "文章、テンプレート、モデル、用語集、プロトタイプを使って要求を表す方法を学びます。",
    source: "Syllabus 3.3.0 · Chapter 3",
  },
  {
    id: 4,
    title: "Practices for Requirements Elaboration",
    level: "L3",
    duration: "4 h 30 m",
    keywords: ["requirements source", "elicitation", "conflict resolution", "validation"],
    summaryJa: "要求の情報源を見つけ、必要な情報を聞き出し、意見の衝突を解決し、要求がニーズに合っているかを確かめる方法を学びます。",
    source: "Syllabus 3.3.0 · Chapter 4",
  },
  {
    id: 5,
    title: "Process and Working Structure",
    level: "L3",
    duration: "1 h 45 m",
    keywords: ["RE process", "process facet", "tailoring", "feedback loop"],
    summaryJa: "プロジェクトの状況に合わせて、要求工学の進め方や作業の順序を決める考え方を学びます。",
    source: "Syllabus 3.3.0 · Chapter 5",
  },
  {
    id: 6,
    title: "Management Practices for Requirements",
    level: "L2",
    duration: "2 h 30 m",
    keywords: ["baseline", "traceability", "change request", "prioritization"],
    summaryJa: "要求を識別し、版と変更履歴、関連する成果物、変更、優先順位を管理する方法を学びます。",
    source: "Syllabus 3.3.0 · Chapter 6",
  },
  {
    id: 7,
    title: "Tool Support",
    level: "L2",
    duration: "45 m",
    keywords: ["RE tool", "tool introduction", "configuration", "training"],
    summaryJa: "要求工学ツールで支援できることと限界を理解し、現場へ無理なく導入する方法を学びます。",
    source: "Syllabus 3.3.0 · Chapter 7",
  },
];

export const questions: Question[] = [
  {
    id: "Q001", unit: 1, eo: "EO 1.1.1", kind: "single", points: 1,
    prompt: "Which term denotes a person or organization that influences a system's requirements or is affected by the system?",
    options: ["Stakeholder", "Component", "Baseline", "Attribute"], correct: [0], keyword: "stakeholder",
    explanationJa: "stakeholder（ステークホルダー）とは、システムや要求に影響を与える人・組織、またはシステムから影響を受ける人・組織です。",
    source: "Syllabus 3.3.0 · 1.1",
  },
  {
    id: "Q002", unit: 1, eo: "EO 1.1.2", kind: "single", points: 1,
    prompt: "A requirement limits the permitted database technology even though the user-visible behavior is unchanged. What kind of requirement is it?",
    options: ["Functional requirement", "Quality requirement", "Constraint", "Stakeholder requirement"], correct: [2], keyword: "constraint",
    explanationJa: "これはconstraint（制約）です。利用者に見える機能ではなく、使用できるデータベース技術という実現方法を限定しています。",
    source: "Syllabus 3.3.0 · 1.1",
  },
  {
    id: "Q003", unit: 1, eo: "EO 1.2.1", kind: "multiple", points: 2,
    prompt: "Which TWO outcomes are typical benefits of adequate Requirements Engineering?",
    options: ["A better basis for effort estimation", "Guaranteed absence of defects", "Lower risk of building the wrong system", "No need for stakeholder feedback"], correct: [0, 2], keyword: "value of RE",
    explanationJa: "適切な要求工学は、作業量を見積もる根拠を作り、必要とされていないシステムを作るリスクを下げます。ただし、欠陥がゼロになることや、関係者からの確認が不要になることは保証しません。",
    source: "Syllabus 3.3.0 · 1.2",
  },
  {
    id: "Q004", unit: 1, eo: "EO 1.2.2", kind: "boolean", points: 1,
    prompt: "True or False: Assuming that requirements are self-evident can be a symptom of inadequate Requirements Engineering.",
    options: ["True", "False"], correct: [0], keyword: "inadequate RE",
    explanationJa: "「要求は言わなくても明らかだ」と思い込むと、確認や合意が省かれ、要求の抜けや誤解が起きやすくなります。",
    source: "Syllabus 3.3.0 · 1.2",
  },
  {
    id: "Q005", unit: 1, eo: "EO 1.4.1", kind: "multiple", points: 2,
    prompt: "Which TWO activities are major Requirements Engineering tasks?",
    options: ["Requirements validation", "Source-code compilation", "Requirements elicitation", "Production monitoring only"], correct: [0, 2], keyword: "RE tasks",
    explanationJa: "要求工学の主な活動には、要求の引き出し（elicitation）、文書化、妥当性確認（validation）、管理があります。",
    source: "Syllabus 3.3.0 · 1.4",
  },
  {
    id: "Q006", unit: 1, eo: "EO 1.5.1", kind: "single", points: 1,
    prompt: "Which statement best characterizes the role of a Requirements Engineer?",
    options: ["It is always a formal job title", "It bridges problem understanding and potential solutions", "It replaces every stakeholder", "It only writes specifications"], correct: [1], keyword: "Requirements Engineer",
    explanationJa: "Requirements Engineerは特定の職名だけを指すのではありません。関係者が抱える問題を理解し、実現できる解決案へつなぐ役割を指します。",
    source: "Syllabus 3.3.0 · 1.5",
  },
  {
    id: "Q007", unit: 2, eo: "EO 2.1.1", kind: "single", points: 1,
    prompt: "Which principle emphasizes that a requirement is useful only when its benefit justifies the effort around it?",
    options: ["Innovation", "Value-orientation", "Evolution", "Context"], correct: [1], keyword: "value-orientation",
    explanationJa: "value-orientation（価値志向）では、要求を作ること自体を目的にせず、要求によって得られる価値と必要な労力の釣り合いを考えます。",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q008", unit: 2, eo: "EO 2.2.2", kind: "single", points: 2,
    prompt: "A team has a shared vocabulary but rarely records decisions. Which form of shared understanding mainly supports the team?",
    options: ["Explicit shared understanding", "Implicit shared understanding", "Formal verification", "Configuration control"], correct: [1], keyword: "implicit shared understanding",
    explanationJa: "会話の積み重ねや信頼関係の中で共有され、文書に明記されていない理解がimplicit shared understanding（暗黙の共通理解）です。文書や合意で明確にしたものはexplicitです。",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q009", unit: 2, eo: "EO 2.2.2", kind: "multiple", points: 2,
    prompt: "Which TWO actions help clarify a system's context?",
    options: ["Identify external interfaces", "Define the system boundary", "Ignore environmental changes", "Treat every external fact as in scope"], correct: [0, 1], keyword: "context",
    explanationJa: "system boundary（システム境界）と外部とのinterface（接点）を明確にすると、システムに含める範囲と周囲との関係を整理できます。",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q010", unit: 2, eo: "EO 2.2.2", kind: "boolean", points: 1,
    prompt: "True or False: Requirements are expected to evolve, so change should be treated as a normal case.",
    options: ["True", "False"], correct: [0], keyword: "evolution",
    explanationJa: "evolution（進化）の原則では、要求は時間とともに変わるものと考えます。変更を例外扱いせず、通常の活動として管理します。",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q011", unit: 2, eo: "EO 2.2.2", kind: "single", points: 1,
    prompt: "Why is validation a fundamental principle of Requirements Engineering?",
    options: ["It freezes all requirements", "It checks whether work products support the intended needs", "It removes the need for elicitation", "It selects a tool vendor"], correct: [1], keyword: "validation",
    explanationJa: "validation（妥当性確認）は、まとめた要求や成果物が、関係者の本来のニーズに合っているかを確かめる活動です。",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q012", unit: 2, eo: "EO 2.2.2", kind: "single", points: 2,
    prompt: "A team repeatedly applies the same familiar solution without exploring alternatives. Which principle deserves more attention?",
    options: ["Innovation", "Baseline", "Traceability", "Version control"], correct: [0], keyword: "innovation",
    explanationJa: "innovation（革新）の原則は、いつもの解決案を繰り返すだけでなく、より良い別の方法がないか検討することを求めます。",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q013", unit: 3, eo: "EO 3.1.1", kind: "single", points: 1,
    prompt: "Which term is the broadest label for an artifact created or used during Requirements Engineering?",
    options: ["Work product", "Persona", "Sprint", "Supplier"], correct: [0], keyword: "work product",
    explanationJa: "work product（作業成果物）は、要求工学で作成または利用するものの総称です。仕様書などの文書だけでなく、モデルやプロトタイプも含みます。",
    source: "Syllabus 3.3.0 · 3.1",
  },
  {
    id: "Q014", unit: 3, eo: "EO 3.1.2", kind: "single", points: 2,
    prompt: "A product goal and a detailed interface rule describe the same system at different heights. Which concept explains the difference?",
    options: ["Abstraction level", "Cardinality", "Priority", "Conflict type"], correct: [0], keyword: "abstraction level",
    explanationJa: "製品の目的と画面の細かな規則では、同じシステムを説明していても詳しさが違います。この違いをabstraction level（抽象度）と呼びます。",
    source: "Syllabus 3.3.0 · 3.1.2",
  },
  {
    id: "Q015", unit: 3, eo: "EO 3.2.1", kind: "multiple", points: 2,
    prompt: "Which TWO practices reduce ambiguity in natural-language requirements?",
    options: ["Use consistent terms", "Prefer vague qualifiers", "Review sentence structure", "Avoid all stakeholder review"], correct: [0, 2], keyword: "natural language",
    explanationJa: "同じ意味には同じ用語を使い、文の構造を見直すと、読み手による解釈の違いを減らせます。「すぐに」「適切に」など基準が不明な表現は避けます。",
    source: "Syllabus 3.3.0 · 3.2",
  },
  {
    id: "Q016", unit: 3, eo: "EO 3.3.1", kind: "single", points: 2,
    prompt: "What is a primary benefit of a phrase template?",
    options: ["It guarantees correctness", "It guides authors toward a consistent sentence structure", "It replaces validation", "It creates source code"], correct: [1], keyword: "phrase template",
    explanationJa: "phrase template（定型文）は、要求文の書き方と構造をそろえるための補助です。書かれた内容が正しいかどうかまで自動で保証するものではありません。",
    source: "Syllabus 3.3.0 · 3.3",
  },
  {
    id: "Q017", unit: 3, eo: "EO 3.4.2", kind: "single", points: 2,
    prompt: "Which model is most suitable for showing a system and the external actors or systems around it?",
    options: ["Context model", "Version graph", "Priority matrix", "Change log"], correct: [0], keyword: "context model",
    explanationJa: "context model（コンテキストモデル）は、対象システムと、その周囲にいる利用者や外部システムとの関係を表します。",
    source: "Syllabus 3.3.0 · 3.4.2",
  },
  {
    id: "Q018", unit: 3, eo: "EO 3.5.1", kind: "boolean", points: 1,
    prompt: "True or False: A glossary can support shared understanding by giving project terms a consistent meaning.",
    options: ["True", "False"], correct: [0], keyword: "glossary",
    explanationJa: "glossary（用語集）でプロジェクト内の用語と意味をそろえると、同じものを別の名前で呼んだり、同じ言葉を別の意味で使ったりすることによる誤解を減らせます。",
    source: "Syllabus 3.3.0 · 3.5",
  },
  {
    id: "Q019", unit: 3, eo: "EO 3.7.1", kind: "single", points: 1,
    prompt: "What is a useful purpose of a prototype in Requirements Engineering?",
    options: ["To make every requirement final", "To explore or communicate an idea", "To replace the product backlog", "To approve a baseline automatically"], correct: [1], keyword: "prototype",
    explanationJa: "prototype（プロトタイプ）は、案を試し、関係者の理解や意見を得るために役立ちます。作っただけで要求が確定するわけではありません。",
    source: "Syllabus 3.3.0 · 3.7",
  },
  {
    id: "Q020", unit: 4, eo: "EO 4.1.1", kind: "multiple", points: 2,
    prompt: "Which TWO can be valid sources for requirements?",
    options: ["Stakeholders", "Existing documents", "Only the project manager", "Only the future system"], correct: [0, 1], keyword: "requirements source",
    explanationJa: "requirements source（要求の情報源）には、ステークホルダー、既存の文書、現在使っているシステムなどがあります。情報源は一人の担当者だけとは限りません。",
    source: "Syllabus 3.3.0 · 4.1",
  },
  {
    id: "Q021", unit: 4, eo: "EO 4.1.2", kind: "single", points: 2,
    prompt: "A stakeholder group contains thousands of similar end users who cannot all be interviewed. What can represent that role?",
    options: ["A persona", "A baseline", "A configuration", "A state machine"], correct: [0], keyword: "persona",
    explanationJa: "利用者が多すぎて全員に話を聞けない場合は、典型的な利用者像を表すpersona（ペルソナ）を使って、その立場やニーズを検討できます。",
    source: "Syllabus 3.3.0 · 4.1",
  },
  {
    id: "Q022", unit: 4, eo: "EO 4.2.1", kind: "single", points: 2,
    prompt: "Which elicitation technique is especially useful when users perform work that is difficult to explain verbally?",
    options: ["Observation", "Version control", "Prioritization", "Configuration audit"], correct: [0], keyword: "observation",
    explanationJa: "利用者が言葉で説明しにくい作業は、observation（観察）で実際の行動や作業環境を見ると理解しやすくなります。",
    source: "Syllabus 3.3.0 · 4.2",
  },
  {
    id: "Q023", unit: 4, eo: "EO 4.2.1", kind: "multiple", points: 2,
    prompt: "Which TWO factors should influence the choice of an elicitation technique?",
    options: ["The type and availability of sources", "The information sought", "A rule to always use interviews", "The logo color of the tool"], correct: [0, 1], keyword: "elicitation technique",
    explanationJa: "要求を引き出す手法は、誰や何から情報を得るのか、相手に話を聞けるか、どのような情報が必要かに合わせて選びます。いつもインタビューを選ぶとは限りません。",
    source: "Syllabus 3.3.0 · 4.2",
  },
  {
    id: "Q024", unit: 4, eo: "EO 4.3.1", kind: "single", points: 2,
    prompt: "Two stakeholders request mutually exclusive behaviors. What should happen before choosing a resolution technique?",
    options: ["Analyze the conflict and the parties' interests", "Delete both requirements", "Freeze the baseline immediately", "Select the cheapest tool"], correct: [0], keyword: "requirements conflict",
    explanationJa: "要求の衝突を解決する方法を選ぶ前に、何が対立しているのか、なぜ起きたのか、各関係者が何を重視しているのかを整理します。",
    source: "Syllabus 3.3.0 · 4.3",
  },
  {
    id: "Q025", unit: 4, eo: "EO 4.4.1", kind: "multiple", points: 2,
    prompt: "Which TWO are useful perspectives when validating requirements?",
    options: ["Whether they reflect stakeholder needs", "Whether they are understandable", "Whether they avoid all future change", "Whether they use the longest possible wording"], correct: [0, 1], keyword: "requirements validation",
    explanationJa: "requirements validation（要求の妥当性確認）では、要求が関係者のニーズを表しているか、読み手が理解できるかなどを確かめます。将来まったく変更されないことを保証する活動ではありません。",
    source: "Syllabus 3.3.0 · 4.4",
  },
  {
    id: "Q026", unit: 4, eo: "EO 4.4.1", kind: "boolean", points: 1,
    prompt: "True or False: Validation should wait until all requirements are completely documented.",
    options: ["True", "False"], correct: [1], keyword: "early validation",
    explanationJa: "validation（妥当性確認）は、要求がすべて完成する前から繰り返し行えます。最後まで待ってから誤りに気づくと、修正に必要な時間や費用が増えます。",
    source: "Syllabus 3.3.0 · 4.4",
  },
  {
    id: "Q027", unit: 5, eo: "EO 5.1.1", kind: "single", points: 2,
    prompt: "Why can the same Requirements Engineering process be unsuitable for two different projects?",
    options: ["Influencing factors differ", "RE has no repeatable practices", "Every project needs a proprietary tool", "Requirements never share patterns"], correct: [0], keyword: "influencing factors",
    explanationJa: "プロジェクトの規模、リスク、契約、開発方法などのinfluencing factors（影響要因）に応じて、要求工学の進め方を調整します。",
    source: "Syllabus 3.3.0 · 5.1",
  },
  {
    id: "Q028", unit: 5, eo: "EO 5.2.1", kind: "single", points: 2,
    prompt: "Which process characteristic helps expose misunderstandings early?",
    options: ["Short feedback loops", "One final review", "No stakeholder access", "A permanent freeze"], correct: [0], keyword: "feedback loop",
    explanationJa: "短いfeedback loop（フィードバックの循環）を設けると、理解のずれに早く気づき、修正に必要な時間や費用を抑えられます。",
    source: "Syllabus 3.3.0 · 5.2",
  },
  {
    id: "Q029", unit: 5, eo: "EO 5.2.1", kind: "boolean", points: 1,
    prompt: "True or False: A Requirements Engineering process can be iterative even when the surrounding development approach is plan-driven.",
    options: ["True", "False"], correct: [0], keyword: "iterative RE",
    explanationJa: "計画を重視する開発方法でも、要求工学の中で確認と見直しを繰り返すことはできます。開発全体が順番どおりでも、要求を一度で確定する必要はありません。",
    source: "Syllabus 3.3.0 · 5.2",
  },
  {
    id: "Q030", unit: 5, eo: "EO 5.3.1", kind: "multiple", points: 3,
    prompt: "Which TWO actions belong to tailoring a Requirements Engineering process?",
    options: ["Select suitable practices", "Define when work products are produced", "Copy another project without analysis", "Ignore organizational constraints"], correct: [0, 1], keyword: "tailoring",
    explanationJa: "tailoring（調整）では、プロジェクトの状況に合う活動、作成する成果物、担当する役割、実施する時期を選び、進め方を組み立てます。",
    source: "Syllabus 3.3.0 · 5.3",
  },
  {
    id: "Q031", unit: 5, eo: "EO 5.3.1", kind: "single", points: 2,
    prompt: "A safety-critical project requires documented approvals. What is the best process response?",
    options: ["Include explicit review and approval steps", "Remove all documentation", "Rely only on informal conversation", "Postpone validation until release"], correct: [0], keyword: "process configuration",
    explanationJa: "安全性への高いリスクや法規制があるプロジェクトでは、誰が確認し、誰が承認したかを記録できる手順を、進め方の中に明確に組み込みます。",
    source: "Syllabus 3.3.0 · 5.3",
  },
  {
    id: "Q032", unit: 5, eo: "EO 5.1.1", kind: "single", points: 1,
    prompt: "Which item is an influencing factor for configuring an RE process?",
    options: ["Project risk", "The alphabetical order of stakeholder names", "The monitor brand", "The office wall color"], correct: [0], keyword: "risk",
    explanationJa: "project risk（プロジェクトのリスク）は、要求をどの程度厳密に扱うか、どのくらいの頻度で確認するかを決める重要な要因です。",
    source: "Syllabus 3.3.0 · 5.1",
  },
  {
    id: "Q033", unit: 6, eo: "EO 6.1.1", kind: "single", points: 1,
    prompt: "What is the central purpose of requirements management?",
    options: ["Keep requirements usable through their life cycle", "Prevent every change", "Replace elicitation", "Manage source code only"], correct: [0], keyword: "requirements management",
    explanationJa: "requirements management（要求管理）は、要求を識別できる状態にし、作成から廃止まで内容と履歴を維持し、変更を適切に扱えるようにする活動です。",
    source: "Syllabus 3.3.0 · 6.1",
  },
  {
    id: "Q034", unit: 6, eo: "EO 6.3.1", kind: "single", points: 2,
    prompt: "A requirement is revised after a legal change. What enables the team to distinguish the old and new states?",
    options: ["Version control", "A persona", "Observation", "Brainstorming"], correct: [0], keyword: "version control",
    explanationJa: "version control（版管理）を行うと、変更前と変更後の要求を区別し、いつ何が変わったかを追跡できます。",
    source: "Syllabus 3.3.0 · 6.3",
  },
  {
    id: "Q035", unit: 6, eo: "EO 6.4.1", kind: "single", points: 2,
    prompt: "What is a stable, change-controlled set of logically related work products called?",
    options: ["Baseline", "Interview", "Prototype", "Context boundary"], correct: [0], keyword: "baseline",
    explanationJa: "baseline（ベースライン）は、正式な変更手続きを経なければ変えられない、互いに関連する成果物の確定済みの一式です。",
    source: "Syllabus 3.3.0 · 6.4",
  },
  {
    id: "Q036", unit: 6, eo: "EO 6.6.1", kind: "multiple", points: 2,
    prompt: "Which TWO relationships are examples of traceability?",
    options: ["Requirement to stakeholder need", "Requirement to test case", "Requirement to font preference", "Requirement to office seating"], correct: [0, 1], keyword: "traceability",
    explanationJa: "traceability（追跡可能性）は、要求をその根拠となるニーズや、後で作られる設計・テストなどと関連付けることです。変更の影響調査や確認に役立ちます。",
    source: "Syllabus 3.3.0 · 6.6",
  },
  {
    id: "Q037", unit: 6, eo: "EO 6.7.1", kind: "single", points: 2,
    prompt: "What should happen before an approved requirement is changed?",
    options: ["Assess the change request and its impact", "Edit it without recording", "Delete all linked tests", "Ignore affected stakeholders"], correct: [0], keyword: "change request",
    explanationJa: "承認済みの要求を変える前に、change request（変更要求）について、得られる価値、必要な費用、影響を受ける成果物や関係者を調べてから判断します。",
    source: "Syllabus 3.3.0 · 6.7",
  },
  {
    id: "Q038", unit: 6, eo: "EO 6.8.1", kind: "single", points: 2,
    prompt: "Why is a single priority value often insufficient?",
    options: ["Priorities may depend on several criteria and stakeholders", "Priorities are forbidden", "Every requirement has identical value", "Only tools can assign priorities"], correct: [0], keyword: "prioritization",
    explanationJa: "要求の優先順位は、価値、費用、リスク、ほかの要求との依存関係、ステークホルダーごとの立場など、複数の基準で変わります。一つの数値だけでは理由を表せない場合があります。",
    source: "Syllabus 3.3.0 · 6.8",
  },
  {
    id: "Q039", unit: 6, eo: "EO 6.5.1", kind: "boolean", points: 1,
    prompt: "True or False: Requirement attributes can support filtering and stakeholder-specific views.",
    options: ["True", "False"], correct: [0], keyword: "attribute",
    explanationJa: "attribute（属性）として状態、優先度、担当者などを記録すると、条件に合う要求だけを絞り込み、関係者や目的に応じた一覧を作れます。",
    source: "Syllabus 3.3.0 · 6.5",
  },
  {
    id: "Q040", unit: 7, eo: "EO 7.1.1", kind: "multiple", points: 2,
    prompt: "Which TWO capabilities can an RE tool support?",
    options: ["Traceability", "Version handling", "Automatic stakeholder agreement", "Guaranteed requirement quality"], correct: [0, 1], keyword: "RE tool",
    explanationJa: "要求工学ツールは、要求同士の関連付けや版管理を支援できます。ただし、関係者の合意や要求の品質を自動で保証することはできません。",
    source: "Syllabus 3.3.0 · 7.1",
  },
  {
    id: "Q041", unit: 7, eo: "EO 7.1.1", kind: "single", points: 1,
    prompt: "Which statement about tool support is most accurate?",
    options: ["Tools support practices but do not replace sound RE", "A tool removes the need for a process", "The most feature-rich tool is always best", "Tool introduction has no organizational impact"], correct: [0], keyword: "tool support",
    explanationJa: "ツールは要求工学の活動を支援するものです。関係者が内容を理解して合意することや、適切な進め方を考えることの代わりにはなりません。",
    source: "Syllabus 3.3.0 · 7.1",
  },
  {
    id: "Q042", unit: 7, eo: "EO 7.2.1", kind: "multiple", points: 2,
    prompt: "Which TWO activities help introduce a Requirements Engineering tool successfully?",
    options: ["Train users", "Pilot the tool in a suitable scope", "Ignore existing workflows", "Configure every feature before learning needs"], correct: [0, 1], keyword: "tool introduction",
    explanationJa: "利用者へのtraining（研修）を行い、適切な範囲でpilot（試験導入）をすると、使い方や現場への影響を確かめながら導入できます。",
    source: "Syllabus 3.3.0 · 7.2",
  },
  {
    id: "Q043", unit: 7, eo: "EO 7.2.1", kind: "single", points: 2,
    prompt: "A new RE tool is technically capable but users avoid it. Which missing factor is most likely?",
    options: ["Change management and user involvement", "More file formats", "A darker logo", "A longer product name"], correct: [0], keyword: "change management",
    explanationJa: "新しいツールの導入は、現場の仕事の進め方を変える取り組みです。利用者を検討に参加させ、研修や移行支援を行わないと、機能が十分でも使われなくなることがあります。",
    source: "Syllabus 3.3.0 · 7.2",
  },
  {
    id: "Q044", unit: 7, eo: "EO 7.2.1", kind: "boolean", points: 1,
    prompt: "True or False: Tool selection should begin with the organization's RE needs and process context.",
    options: ["True", "False"], correct: [0], keyword: "tool selection",
    explanationJa: "ツールを選ぶ前に、自組織で必要な要求工学の活動と、現在の仕事の進め方を理解します。そのうえで、それらを支援できるツールを選びます。",
    source: "Syllabus 3.3.0 · 7.2",
  },
  {
    id: "Q045", unit: 7, eo: "EO 7.1.1", kind: "single", points: 1,
    prompt: "Which risk can arise when a tool's default workflow is adopted without evaluation?",
    options: ["The process may no longer fit the project context", "All requirements become valid", "Stakeholder conflicts disappear", "Training becomes unnecessary"], correct: [0], keyword: "tool configuration",
    explanationJa: "ツールの初期設定どおりに仕事の流れを決めると、そのプロジェクトの規模、リスク、組織の事情に合わない進め方になるおそれがあります。",
    source: "Syllabus 3.3.0 · 7.1–7.2",
  },
];

export const sources = [
  { id: "fl-syllabus-en", title: "CPRE Foundation Level Syllabus", version: "3.3.0", chapter: "EU 1–7", url: "https://cpre.ireb.org/en/downloads-and-resources/downloads#cpre-foundation-level-syllabus" },
  { id: "fl-handbook-en", title: "CPRE Foundation Level Handbook", version: "1.3.1", chapter: "Chapters 1–7", url: "https://cpre.ireb.org/en/downloads-and-resources/downloads#cpre-foundation-level-handbook" },
  { id: "cpre-glossary-en", title: "CPRE Glossary", version: "2.2.0", chapter: "Definitions of Terms", url: "https://cpre.ireb.org/en/downloads-and-resources/downloads#cpre-glossary" },
  { id: "fl-exam-regulations-en", title: "Foundation Level Examination Regulations", version: "5.6.2", chapter: "Sections 1–2", url: "https://cpre.ireb.org/en/downloads-and-resources/downloads#cpre-foundation-level-and-agile-primer-examination-regulations" },
];
