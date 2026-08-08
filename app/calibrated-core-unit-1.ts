import type { Question } from "./data.ts";

export const calibratedCoreUnit1Questions: Question[] = [
  {
    id: "Q001", unit: 1, eo: "EO 1.1.1", kind: "single", points: 1,
    prompt: "A regulator never uses the planned system but can impose mandatory reporting rules on it. Which term best describes the regulator?",
    options: ["Stakeholder", "System user", "System component", "Requirements Engineer"], correct: [0], keyword: "stakeholder",
    explanationJa: "stakeholderは、システムを直接使う人だけでなく、要求へ影響を与える、またはシステムから影響を受ける個人・組織も含む",
    source: "Syllabus 3.3.0 · 1.1",
  },
  {
    id: "Q002", unit: 1, eo: "EO 1.1.2", kind: "single", points: 1,
    prompt: "Company policy requires the solution to use only an approved cloud provider. The required user-visible behavior is unchanged. How should this requirement be classified?",
    options: ["Functional requirement", "Quality requirement", "Constraint", "Business requirement"], correct: [2], keyword: "constraint",
    explanationJa: "特定のクラウド事業者を使うという条件は、実現方法の選択肢を制限するconstraint。機能や性能そのものを要求しているわけではない",
    source: "Syllabus 3.3.0 · 1.1",
  },
  {
    id: "Q003", unit: 1, eo: "EO 1.2.1", kind: "multiple", points: 2,
    prompt: "Which TWO outcomes are realistic benefits of adequate Requirements Engineering?",
    options: ["A better basis for estimating development effort", "Elimination of the need for architectural decisions", "Lower risk of delivering a system that misses stakeholder needs", "Stable requirements that no longer need change management"], correct: [0, 2], keyword: "value of RE",
    explanationJa: "適切な要求工学は、必要な範囲を明確にして見積りの根拠を改善し、必要とされないシステムを作るリスクを下げる。設計判断や変更管理が不要になるわけではない",
    source: "Syllabus 3.3.0 · 1.2",
  },
  {
    id: "Q004", unit: 1, eo: "EO 1.2.2", kind: "boolean", points: 1,
    prompt: "True or False: Treating stakeholder needs as self-evident can contribute to missing or misunderstood requirements.",
    options: ["True", "False"], correct: [0], keyword: "inadequate RE",
    explanationJa: "要求は自明という思い込みは、確認や合意を省略させ、要求の欠落や解釈違いにつながる代表的な問題",
    source: "Syllabus 3.3.0 · 1.2",
  },
  {
    id: "Q005", unit: 1, eo: "EO 1.4.1", kind: "multiple", points: 2,
    prompt: "Which TWO activities are major Requirements Engineering tasks?",
    options: ["Requirements validation", "Architecture design", "Requirements elicitation", "System testing"], correct: [0, 2], keyword: "RE tasks",
    explanationJa: "要求工学の主要タスクにはelicitation、documentation、validation、managementが含まれる。architecture designやsystem testingは隣接活動だが主要REタスクそのものではない",
    source: "Syllabus 3.3.0 · 1.4",
  },
  {
    id: "Q006", unit: 1, eo: "EO 1.5.1", kind: "single", points: 1,
    prompt: "Which statement best characterizes the role of a Requirements Engineer?",
    options: ["The person who has final authority to approve every requirement", "The role that helps bridge understanding of a problem and possible solutions", "The person responsible only for maintaining the requirements repository", "A formal job title that cannot be performed by other roles"], correct: [1], keyword: "Requirements Engineer",
    explanationJa: "Requirements Engineerは固定された職名ではなく、問題側の理解と解決策側の検討をつなぎ、要求工学の活動を担う役割",
    source: "Syllabus 3.3.0 · 1.5",
  },
];
