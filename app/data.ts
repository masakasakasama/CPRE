import { additionalQuestions } from "./additional-questions.ts";
import { calibratedCoreQuestions } from "./calibrated-core-questions.ts";
import { calibratedQuestions } from "./calibrated-questions.ts";

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
    summaryJa: "要求工学（RE）の目的、要求の種類、主な活動、Requirements Engineerの役割",
    source: "Syllabus 3.3.0 · Chapter 1",
  },
  {
    id: 2,
    title: "Fundamental Principles of Requirements Engineering",
    level: "L2",
    duration: "1 h 30 m",
    keywords: ["value-orientation", "shared understanding", "context", "validation"],
    summaryJa: "要求工学の判断を支える9つの原則と、それぞれが必要な理由",
    source: "Syllabus 3.3.0 · Chapter 2",
  },
  {
    id: 3,
    title: "Work Products and Documentation Practices",
    level: "L3",
    duration: "7 h",
    keywords: ["work product", "requirements specification", "model", "prototype"],
    summaryJa: "文章、テンプレート、モデル、用語集、プロトタイプによる要求の表現",
    source: "Syllabus 3.3.0 · Chapter 3",
  },
  {
    id: 4,
    title: "Practices for Requirements Elaboration",
    level: "L3",
    duration: "4 h 30 m",
    keywords: ["requirements source", "elicitation", "conflict resolution", "validation"],
    summaryJa: "情報源の特定、要求の引き出し、衝突の解決、ニーズとの一致確認",
    source: "Syllabus 3.3.0 · Chapter 4",
  },
  {
    id: 5,
    title: "Process and Working Structure",
    level: "L3",
    duration: "1 h 15 m",
    keywords: ["RE process", "process facet", "tailoring", "feedback loop"],
    summaryJa: "プロジェクトの状況に合わせた要求工学の進め方と作業順序",
    source: "Syllabus 3.3.0 · Chapter 5",
  },
  {
    id: 6,
    title: "Management Practices for Requirements",
    level: "L2",
    duration: "2 h",
    keywords: ["baseline", "traceability", "change request", "prioritization"],
    summaryJa: "要求の識別、版と変更履歴、関連成果物、変更、優先順位の管理",
    source: "Syllabus 3.3.0 · Chapter 6",
  },
  {
    id: 7,
    title: "Tool Support",
    level: "L2",
    duration: "30 m",
    keywords: ["RE tool", "tool introduction", "configuration", "training"],
    summaryJa: "要求工学ツールで支援できる範囲と限界、現場への導入方法",
    source: "Syllabus 3.3.0 · Chapter 7",
  },
];

const coreQuestions: Question[] = [
  {
    id: "Q001", unit: 1, eo: "EO 1.1.1", kind: "single", points: 1,
    prompt: "Which term denotes a person or organization that influences a system's requirements or is affected by the system?",
    options: ["Stakeholder", "Component", "Baseline", "Attribute"], correct: [0], keyword: "stakeholder",
    explanationJa: "stakeholder（ステークホルダー）は、システムや要求に影響を与える人・組織、またはシステムから影響を受ける人・組織",
    source: "Syllabus 3.3.0 · 1.1",
  },
  {
    id: "Q002", unit: 1, eo: "EO 1.1.2", kind: "single", points: 1,
    prompt: "A requirement limits the permitted database technology even though the user-visible behavior is unchanged. What kind of requirement is it?",
    options: ["Functional requirement", "Quality requirement", "Constraint", "Stakeholder requirement"], correct: [2], keyword: "constraint",
    explanationJa: "constraint（制約）に該当。利用者に見える機能ではなく、使用できるデータベース技術という実現方法の限定",
    source: "Syllabus 3.3.0 · 1.1",
  },
  {
    id: "Q003", unit: 1, eo: "EO 1.2.1", kind: "multiple", points: 2,
    prompt: "Which TWO outcomes are typical benefits of adequate Requirements Engineering?",
    options: ["A better basis for effort estimation", "Guaranteed absence of defects", "Lower risk of building the wrong system", "No need for stakeholder feedback"], correct: [0, 2], keyword: "value of RE",
    explanationJa: "適切な要求工学による、作業量を見積もる根拠の確保と不要なシステムを作るリスクの低減。ただし、欠陥ゼロや関係者による確認の省略を保証するものではない",
    source: "Syllabus 3.3.0 · 1.2",
  },
  {
    id: "Q004", unit: 1, eo: "EO 1.2.2", kind: "boolean", points: 1,
    prompt: "True or False: Assuming that requirements are self-evident can be a symptom of inadequate Requirements Engineering.",
    options: ["True", "False"], correct: [0], keyword: "inadequate RE",
    explanationJa: "「要求は言わなくても明らか」という思い込みによる、確認・合意の不足と要求の抜け・誤解の増加",
    source: "Syllabus 3.3.0 · 1.2",
  },
  {
    id: "Q005", unit: 1, eo: "EO 1.4.1", kind: "multiple", points: 2,
    prompt: "Which TWO activities are major Requirements Engineering tasks?",
    options: ["Requirements validation", "Source-code compilation", "Requirements elicitation", "Production monitoring only"], correct: [0, 2], keyword: "RE tasks",
    explanationJa: "要求工学の主な活動は、要求の引き出し（elicitation）、文書化、妥当性確認（validation）、管理",
    source: "Syllabus 3.3.0 · 1.4",
  },
  {
    id: "Q006", unit: 1, eo: "EO 1.5.1", kind: "single", points: 1,
    prompt: "Which statement best characterizes the role of a Requirements Engineer?",
    options: ["It is always a formal job title", "It bridges problem understanding and potential solutions", "It replaces every stakeholder", "It only writes specifications"], correct: [1], keyword: "Requirements Engineer",
    explanationJa: "Requirements Engineerは特定の職名ではなく、関係者が抱える問題を理解し、実現可能な解決案へつなぐ役割",
    source: "Syllabus 3.3.0 · 1.5",
  },
  {
    id: "Q007", unit: 2, eo: "EO 2.1.1", kind: "single", points: 1,
    prompt: "Which principle emphasizes that a requirement is useful only when its benefit justifies the effort around it?",
    options: ["Innovation", "Value-orientation", "Evolution", "Context"], correct: [1], keyword: "value-orientation",
    explanationJa: "value-orientation（価値志向）は、要求の作成自体ではなく、得られる価値と必要な労力の釣り合いを重視",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q008", unit: 2, eo: "EO 2.2.2", kind: "single", points: 2,
    prompt: "A team has a shared vocabulary but rarely records decisions. Which form of shared understanding mainly supports the team?",
    options: ["Explicit shared understanding", "Implicit shared understanding", "Formal verification", "Configuration control"], correct: [1], keyword: "implicit shared understanding",
    explanationJa: "implicit shared understanding（暗黙の共通理解）は、会話や信頼関係を通じて共有され、文書に明記されていない理解。文書や合意で明確にした理解はexplicit",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q009", unit: 2, eo: "EO 2.2.2", kind: "multiple", points: 2,
    prompt: "Which TWO actions help clarify a system's context?",
    options: ["Identify external interfaces", "Define the system boundary", "Ignore environmental changes", "Treat every external fact as in scope"], correct: [0, 1], keyword: "context",
    explanationJa: "system boundary（システム境界）と外部とのinterface（接点）の明確化による、システムの範囲と周囲との関係の整理",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q010", unit: 2, eo: "EO 2.2.2", kind: "boolean", points: 1,
    prompt: "True or False: Requirements are expected to evolve, so change should be treated as a normal case.",
    options: ["True", "False"], correct: [0], keyword: "evolution",
    explanationJa: "evolution（進化）は、要求が時間とともに変わるという前提。変更を例外ではなく通常の活動として管理",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q011", unit: 2, eo: "EO 2.2.2", kind: "single", points: 1,
    prompt: "Why is validation a fundamental principle of Requirements Engineering?",
    options: ["It freezes all requirements", "It checks whether work products support the intended needs", "It removes the need for elicitation", "It selects a tool vendor"], correct: [1], keyword: "validation",
    explanationJa: "validation（妥当性確認）は、要求や成果物が関係者の本来のニーズに合っているかを確かめる活動",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q012", unit: 2, eo: "EO 2.2.2", kind: "single", points: 2,
    prompt: "A team repeatedly applies the same familiar solution without exploring alternatives. Which principle deserves more attention?",
    options: ["Innovation", "Baseline", "Traceability", "Version control"], correct: [0], keyword: "innovation",
    explanationJa: "innovation（革新）は、既存の解決案を繰り返すだけでなく、より良い別の方法を検討する原則",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q013", unit: 3, eo: "EO 3.1.1", kind: "single", points: 1,
    prompt: "Which term is the broadest label for an artifact created or used during Requirements Engineering?",
    options: ["Work product", "Persona", "Sprint", "Supplier"], correct: [0], keyword: "work product",
    explanationJa: "work product（作業成果物）は、要求工学で作成または利用するものの総称。仕様書などの文書に加え、モデルやプロトタイプも対象",
    source: "Syllabus 3.3.0 · 3.1",
  },
  {
    id: "Q014", unit: 3, eo: "EO 3.1.2", kind: "single", points: 2,
    prompt: "A product goal and a detailed interface rule describe the same system at different heights. Which concept explains the difference?",
    options: ["Abstraction level", "Cardinality", "Priority", "Conflict type"], correct: [0], keyword: "abstraction level",
    explanationJa: "製品の目的と画面の細かな規則では、同じシステムでも詳しさが異なる。この違いがabstraction level（抽象度）",
    source: "Syllabus 3.3.0 · 3.1.2",
  },
  {
    id: "Q015", unit: 3, eo: "EO 3.2.1", kind: "multiple", points: 2,
    prompt: "Which TWO practices reduce ambiguity in natural-language requirements?",
    options: ["Use consistent terms", "Prefer vague qualifiers", "Review sentence structure", "Avoid all stakeholder review"], correct: [0, 2], keyword: "natural language",
    explanationJa: "同じ意味への同じ用語の使用と文構造の見直しにより、読み手による解釈の違いを低減。「すぐに」「適切に」など基準が不明な表現は避ける",
    source: "Syllabus 3.3.0 · 3.2",
  },
  {
    id: "Q016", unit: 3, eo: "EO 3.3.1", kind: "single", points: 2,
    prompt: "What is a primary benefit of a phrase template?",
    options: ["It guarantees correctness", "It guides authors toward a consistent sentence structure", "It replaces validation", "It creates source code"], correct: [1], keyword: "phrase template",
    explanationJa: "phrase template（定型文）は、要求文の書き方と構造をそろえる補助。内容の正しさまで自動で保証するものではない",
    source: "Syllabus 3.3.0 · 3.3",
  },
  {
    id: "Q017", unit: 3, eo: "EO 3.4.2", kind: "single", points: 2,
    prompt: "Which model is most suitable for showing a system and the external actors or systems around it?",
    options: ["Context model", "Version graph", "Priority matrix", "Change log"], correct: [0], keyword: "context model",
    explanationJa: "context model（コンテキストモデル）は、対象システムと周囲の利用者・外部システムとの関係を表すモデル",
    source: "Syllabus 3.3.0 · 3.4.2",
  },
  {
    id: "Q018", unit: 3, eo: "EO 3.5.1", kind: "boolean", points: 1,
    prompt: "True or False: A glossary can support shared understanding by giving project terms a consistent meaning.",
    options: ["True", "False"], correct: [0], keyword: "glossary",
    explanationJa: "glossary（用語集）による、プロジェクト内の用語と意味の統一。同じ対象への別名や、同じ言葉への異なる意味による誤解を低減",
    source: "Syllabus 3.3.0 · 3.5",
  },
  {
    id: "Q019", unit: 3, eo: "EO 3.7.1", kind: "single", points: 1,
    prompt: "What is a useful purpose of a prototype in Requirements Engineering?",
    options: ["To make every requirement final", "To explore or communicate an idea", "To replace the product backlog", "To approve a baseline automatically"], correct: [1], keyword: "prototype",
    explanationJa: "prototype（プロトタイプ）は、案を試し、関係者の理解や意見を得る手段。作成だけで要求が確定するものではない",
    source: "Syllabus 3.3.0 · 3.7",
  },
  {
    id: "Q020", unit: 4, eo: "EO 4.1.1", kind: "multiple", points: 2,
    prompt: "Which TWO can be valid sources for requirements?",
    options: ["Stakeholders", "Existing documents", "Only the project manager", "Only the future system"], correct: [0, 1], keyword: "requirements source",
    explanationJa: "requirements source（要求の情報源）は、ステークホルダー、既存文書、現在のシステムなど。情報源は一人の担当者に限らない",
    source: "Syllabus 3.3.0 · 4.1",
  },
  {
    id: "Q021", unit: 4, eo: "EO 4.1.2", kind: "single", points: 2,
    prompt: "A stakeholder group contains thousands of similar end users who cannot all be interviewed. What can represent that role?",
    options: ["A persona", "A baseline", "A configuration", "A state machine"], correct: [0], keyword: "persona",
    explanationJa: "全利用者への聞き取りが難しい場合は、典型的な利用者像を表すpersona（ペルソナ）により、その立場やニーズを検討",
    source: "Syllabus 3.3.0 · 4.1",
  },
  {
    id: "Q022", unit: 4, eo: "EO 4.2.1", kind: "single", points: 2,
    prompt: "Which elicitation technique is especially useful when users perform work that is difficult to explain verbally?",
    options: ["Observation", "Version control", "Prioritization", "Configuration audit"], correct: [0], keyword: "observation",
    explanationJa: "言葉で説明しにくい作業には、observation（観察）による実際の行動や作業環境の確認が有効",
    source: "Syllabus 3.3.0 · 4.2",
  },
  {
    id: "Q023", unit: 4, eo: "EO 4.2.1", kind: "multiple", points: 2,
    prompt: "Which TWO factors should influence the choice of an elicitation technique?",
    options: ["The type and availability of sources", "The information sought", "A rule to always use interviews", "The logo color of the tool"], correct: [0, 1], keyword: "elicitation technique",
    explanationJa: "要求を引き出す手法は、情報源、相手に直接話を聞けるか、必要な情報に合わせて選択。常にインタビューが適切とは限らない",
    source: "Syllabus 3.3.0 · 4.2",
  },
  {
    id: "Q024", unit: 4, eo: "EO 4.3.1", kind: "single", points: 2,
    prompt: "Two stakeholders request mutually exclusive behaviors. What should happen before choosing a resolution technique?",
    options: ["Analyze the conflict and the parties' interests", "Delete both requirements", "Freeze the baseline immediately", "Select the cheapest tool"], correct: [0], keyword: "requirements conflict",
    explanationJa: "要求の衝突を解決する前に、対立の対象、原因、各関係者が重視する点を整理",
    source: "Syllabus 3.3.0 · 4.3",
  },
  {
    id: "Q025", unit: 4, eo: "EO 4.4.1", kind: "multiple", points: 2,
    prompt: "Which TWO are useful perspectives when validating requirements?",
    options: ["Whether they reflect stakeholder needs", "Whether they are understandable", "Whether they avoid all future change", "Whether they use the longest possible wording"], correct: [0, 1], keyword: "requirements validation",
    explanationJa: "requirements validation（要求の妥当性確認）は、要求が関係者のニーズを表し、読み手が理解できるかの確認。将来の変更がないことを保証する活動ではない",
    source: "Syllabus 3.3.0 · 4.4",
  },
  {
    id: "Q026", unit: 4, eo: "EO 4.4.1", kind: "boolean", points: 1,
    prompt: "True or False: Validation should wait until all requirements are completely documented.",
    options: ["True", "False"], correct: [1], keyword: "early validation",
    explanationJa: "validation（妥当性確認）は、要求の完成前から繰り返せる。発見が遅い誤りほど、修正に必要な時間と費用が増加",
    source: "Syllabus 3.3.0 · 4.4",
  },
  {
    id: "Q027", unit: 5, eo: "EO 5.1.1", kind: "single", points: 2,
    prompt: "Why can the same Requirements Engineering process be unsuitable for two different projects?",
    options: ["Influencing factors differ", "RE has no repeatable practices", "Every project needs a proprietary tool", "Requirements never share patterns"], correct: [0], keyword: "influencing factors",
    explanationJa: "プロジェクトの規模、リスク、契約、開発方法などのinfluencing factors（影響要因）に応じた要求工学の進め方の調整",
    source: "Syllabus 3.3.0 · 5.1",
  },
  {
    id: "Q028", unit: 5, eo: "EO 5.2.1", kind: "single", points: 2,
    prompt: "Which process characteristic helps expose misunderstandings early?",
    options: ["Short feedback loops", "One final review", "No stakeholder access", "A permanent freeze"], correct: [0], keyword: "feedback loop",
    explanationJa: "短いfeedback loop（フィードバックの循環）による、理解のずれの早期発見と修正時間・費用の低減",
    source: "Syllabus 3.3.0 · 5.2",
  },
  {
    id: "Q029", unit: 5, eo: "EO 5.2.1", kind: "boolean", points: 1,
    prompt: "True or False: A Requirements Engineering process can be iterative even when the surrounding development approach is plan-driven.",
    options: ["True", "False"], correct: [0], keyword: "iterative RE",
    explanationJa: "計画重視の開発方法でも、要求工学内での確認と見直しは繰り返せる。開発全体を順番に進める場合でも、要求を一度で確定する必要はない",
    source: "Syllabus 3.3.0 · 5.2",
  },
  {
    id: "Q030", unit: 5, eo: "EO 5.3.1", kind: "multiple", points: 3,
    prompt: "Which TWO actions belong to tailoring a Requirements Engineering process?",
    options: ["Select suitable practices", "Define when work products are produced", "Copy another project without analysis", "Ignore organizational constraints"], correct: [0, 1], keyword: "tailoring",
    explanationJa: "tailoring（調整）は、プロジェクトの状況に合う活動、成果物、役割、実施時期の選択と進め方の構成",
    source: "Syllabus 3.3.0 · 5.3",
  },
  {
    id: "Q031", unit: 5, eo: "EO 5.3.1", kind: "single", points: 2,
    prompt: "A safety-critical project requires documented approvals. What is the best process response?",
    options: ["Include explicit review and approval steps", "Remove all documentation", "Rely only on informal conversation", "Postpone validation until release"], correct: [0], keyword: "process configuration",
    explanationJa: "高い安全リスクや法規制があるプロジェクトでは、確認者と承認者を記録できる手順を進め方に明示",
    source: "Syllabus 3.3.0 · 5.3",
  },
  {
    id: "Q032", unit: 5, eo: "EO 5.1.1", kind: "single", points: 1,
    prompt: "Which item is an influencing factor for configuring an RE process?",
    options: ["Project risk", "The alphabetical order of stakeholder names", "The monitor brand", "The office wall color"], correct: [0], keyword: "risk",
    explanationJa: "project risk（プロジェクトのリスク）は、要求を扱う厳密さと確認頻度を決める重要な要因",
    source: "Syllabus 3.3.0 · 5.1",
  },
  {
    id: "Q033", unit: 6, eo: "EO 6.1.1", kind: "single", points: 1,
    prompt: "What is the central purpose of requirements management?",
    options: ["Keep requirements usable through their life cycle", "Prevent every change", "Replace elicitation", "Manage source code only"], correct: [0], keyword: "requirements management",
    explanationJa: "requirements management（要求管理）は、要求を識別可能にし、作成から廃止まで内容と履歴を維持し、変更を扱う活動",
    source: "Syllabus 3.3.0 · 6.1",
  },
  {
    id: "Q034", unit: 6, eo: "EO 6.3.1", kind: "single", points: 2,
    prompt: "A requirement is revised after a legal change. What enables the team to distinguish the old and new states?",
    options: ["Version control", "A persona", "Observation", "Brainstorming"], correct: [0], keyword: "version control",
    explanationJa: "version control（版管理）による、変更前後の要求の区別と変更時期・内容の追跡",
    source: "Syllabus 3.3.0 · 6.3",
  },
  {
    id: "Q035", unit: 6, eo: "EO 6.4.1", kind: "single", points: 2,
    prompt: "What is a stable, change-controlled set of logically related work products called?",
    options: ["Baseline", "Interview", "Prototype", "Context boundary"], correct: [0], keyword: "baseline",
    explanationJa: "baseline（ベースライン）は、正式な変更手続きなしでは変更できない、互いに関連する確定済み成果物の一式",
    source: "Syllabus 3.3.0 · 6.4",
  },
  {
    id: "Q036", unit: 6, eo: "EO 6.6.1", kind: "multiple", points: 2,
    prompt: "Which TWO relationships are examples of traceability?",
    options: ["Requirement to stakeholder need", "Requirement to test case", "Requirement to font preference", "Requirement to office seating"], correct: [0, 1], keyword: "traceability",
    explanationJa: "traceability（追跡可能性）は、要求と根拠となるニーズ、後続の設計・テストなどとの関連付け。変更の影響調査や確認に利用",
    source: "Syllabus 3.3.0 · 6.6",
  },
  {
    id: "Q037", unit: 6, eo: "EO 6.7.1", kind: "single", points: 2,
    prompt: "What should happen before an approved requirement is changed?",
    options: ["Assess the change request and its impact", "Edit it without recording", "Delete all linked tests", "Ignore affected stakeholders"], correct: [0], keyword: "change request",
    explanationJa: "承認済み要求の変更前に、change request（変更要求）の価値、費用、影響を受ける成果物・関係者を調査して判断",
    source: "Syllabus 3.3.0 · 6.7",
  },
  {
    id: "Q038", unit: 6, eo: "EO 6.8.1", kind: "single", points: 2,
    prompt: "Why is a single priority value often insufficient?",
    options: ["Priorities may depend on several criteria and stakeholders", "Priorities are forbidden", "Every requirement has identical value", "Only tools can assign priorities"], correct: [0], keyword: "prioritization",
    explanationJa: "要求の優先順位は、価値、費用、リスク、依存関係、ステークホルダーの立場など複数の基準で変化。一つの数値だけでは理由を表せない場合もある",
    source: "Syllabus 3.3.0 · 6.8",
  },
  {
    id: "Q039", unit: 6, eo: "EO 6.5.1", kind: "boolean", points: 1,
    prompt: "True or False: Requirement attributes can support filtering and stakeholder-specific views.",
    options: ["True", "False"], correct: [0], keyword: "attribute",
    explanationJa: "attribute（属性）として状態、優先度、担当者などを記録し、条件に合う要求の絞り込みと目的別一覧を作成",
    source: "Syllabus 3.3.0 · 6.5",
  },
  {
    id: "Q040", unit: 7, eo: "EO 7.1.1", kind: "multiple", points: 2,
    prompt: "Which TWO capabilities can an RE tool support?",
    options: ["Traceability", "Version handling", "Automatic stakeholder agreement", "Guaranteed requirement quality"], correct: [0, 1], keyword: "RE tool",
    explanationJa: "要求工学ツールは、要求間の関連付けや版管理を支援。ただし、関係者の合意や要求の品質を自動で保証するものではない",
    source: "Syllabus 3.3.0 · 7.1",
  },
  {
    id: "Q041", unit: 7, eo: "EO 7.1.1", kind: "single", points: 1,
    prompt: "Which statement about tool support is most accurate?",
    options: ["Tools support practices but do not replace sound RE", "A tool removes the need for a process", "The most feature-rich tool is always best", "Tool introduction has no organizational impact"], correct: [0], keyword: "tool support",
    explanationJa: "ツールは要求工学の活動を支援する手段。関係者による理解・合意や適切な進め方の検討を代替するものではない",
    source: "Syllabus 3.3.0 · 7.1",
  },
  {
    id: "Q042", unit: 7, eo: "EO 7.2.1", kind: "multiple", points: 2,
    prompt: "Which TWO activities help introduce a Requirements Engineering tool successfully?",
    options: ["Train users", "Pilot the tool in a suitable scope", "Ignore existing workflows", "Configure every feature before learning needs"], correct: [0, 1], keyword: "tool introduction",
    explanationJa: "利用者へのtraining（研修）と適切な範囲でのpilot（試験導入）により、使い方や現場への影響を確認しながら導入",
    source: "Syllabus 3.3.0 · 7.2",
  },
  {
    id: "Q043", unit: 7, eo: "EO 7.2.1", kind: "single", points: 2,
    prompt: "A new RE tool is technically capable but users avoid it. Which missing factor is most likely?",
    options: ["Change management and user involvement", "More file formats", "A darker logo", "A longer product name"], correct: [0], keyword: "change management",
    explanationJa: "新しいツールの導入は、現場の仕事の進め方を変える取り組み。利用者の参加、研修、移行支援がなければ、機能が十分でも使われない可能性",
    source: "Syllabus 3.3.0 · 7.2",
  },
  {
    id: "Q044", unit: 7, eo: "EO 7.2.1", kind: "boolean", points: 1,
    prompt: "True or False: Tool selection should begin with the organization's RE needs and process context.",
    options: ["True", "False"], correct: [0], keyword: "tool selection",
    explanationJa: "ツール選定の前に、自組織で必要な要求工学の活動と現在の仕事の進め方を把握。その活動を支援できるツールを選択",
    source: "Syllabus 3.3.0 · 7.2",
  },
  {
    id: "Q045", unit: 7, eo: "EO 7.1.1", kind: "single", points: 1,
    prompt: "Which risk can arise when a tool's default workflow is adopted without evaluation?",
    options: ["The process may no longer fit the project context", "All requirements become valid", "Stakeholder conflicts disappear", "Training becomes unnecessary"], correct: [0], keyword: "tool configuration",
    explanationJa: "ツールの初期設定をそのまま仕事の流れにすると、プロジェクトの規模、リスク、組織の事情に合わない進め方となる可能性",
    source: "Syllabus 3.3.0 · 7.1–7.2",
  },
];

function applyCalibratedContent(legacy: Question[], calibrated: Question[]): Question[] {
  const calibratedById = new Map(calibrated.map((question) => [question.id, question]));
  return legacy.map((question) => {
    const upgraded = calibratedById.get(question.id);
    if (!upgraded) return question;
    const gradingChanged =
      upgraded.kind !== question.kind ||
      upgraded.points !== question.points ||
      upgraded.correct.length !== question.correct.length ||
      upgraded.correct.some((value, index) => value !== question.correct[index]);
    if (gradingChanged) {
      throw new Error(`Calibrated question ${question.id} changed grading metadata`);
    }
    if (upgraded.options.length !== question.options.length) {
      throw new Error(`Calibrated question ${question.id} changed option count`);
    }
    return {
      ...question,
      prompt: upgraded.prompt,
      options: upgraded.options,
      keyword: upgraded.keyword,
      explanationJa: upgraded.explanationJa,
      source: upgraded.source,
    };
  });
}

const upgradedCoreQuestions = applyCalibratedContent(coreQuestions, calibratedCoreQuestions);
const upgradedAdditionalQuestions = applyCalibratedContent(additionalQuestions, calibratedQuestions);

export const questions: Question[] = [...upgradedCoreQuestions, ...upgradedAdditionalQuestions];

export const sources = [
  { id: "fl-syllabus-en", title: "CPRE Foundation Level Syllabus", version: "3.3.0", chapter: "EU 1–7", url: "https://cpre.ireb.org/en/downloads-and-resources/downloads#cpre-foundation-level-syllabus" },
  { id: "fl-handbook-en", title: "CPRE Foundation Level Handbook", version: "1.3.2", chapter: "Chapters 1–7", url: "https://cpre.ireb.org/en/downloads-and-resources/downloads#cpre-foundation-level-handbook" },
  { id: "cpre-glossary-en", title: "CPRE Glossary", version: "2.2.0", chapter: "Definitions of Terms", url: "https://cpre.ireb.org/en/downloads-and-resources/downloads#cpre-glossary" },
  { id: "fl-exam-regulations-en", title: "Foundation Level Examination Regulations", version: "5.6.2", chapter: "Sections 1–2", url: "https://cpre.ireb.org/en/downloads-and-resources/downloads#cpre-foundation-level-and-agile-primer-examination-regulations" },
];
