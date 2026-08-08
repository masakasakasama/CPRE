import type { Question } from "./data.ts";

export const calibratedCoreUnit4Questions: Question[] = [
  {
    id: "Q020", unit: 4, eo: "EO 4.1.1", kind: "multiple", points: 2,
    prompt: "Which TWO are typical sources from which requirements can be elicited?",
    options: ["Relevant stakeholders", "Existing regulations or business documents", "Only requirements that have already been approved", "Only the architecture selected for the new system"], correct: [0, 1], keyword: "requirements source",
    explanationJa: "要求の情報源にはstakeholder、既存文書、既存systemなどがある。承認済み要求や新システムの設計だけに限定されない",
    source: "Syllabus 3.3.0 · 4.1",
  },
  {
    id: "Q021", unit: 4, eo: "EO 4.1.2", kind: "single", points: 2,
    prompt: "A consumer product has thousands of similar end users, so interviewing every individual is impossible. Which artifact can help represent a typical user group during elicitation?",
    options: ["Persona", "Stakeholder list", "Context model", "User story"], correct: [0], keyword: "persona",
    explanationJa: "多数の利用者を個別に扱えない場合、代表的な特徴や目標をまとめたpersonaが役割理解を支援する",
    source: "Syllabus 3.3.0 · 4.1",
  },
  {
    id: "Q022", unit: 4, eo: "EO 4.2.1", kind: "single", points: 2,
    prompt: "Operators perform a routine physical task expertly but omit many steps when they try to explain it. Which elicitation technique is the strongest starting point?",
    options: ["Observation", "Interview", "Questionnaire", "Document analysis"], correct: [0], keyword: "observation",
    explanationJa: "言語化されにくい暗黙知を含む作業は、実際の環境で行動を観察することで把握しやすい",
    source: "Syllabus 3.3.0 · 4.2",
  },
  {
    id: "Q023", unit: 4, eo: "EO 4.2.1", kind: "multiple", points: 2,
    prompt: "Which TWO factors should most directly influence the choice of an elicitation technique?",
    options: ["The type and availability of requirements sources", "The kind of information that needs to be elicited", "The notation planned for the final requirements specification", "The current version number of the requirements baseline"], correct: [0, 1], keyword: "elicitation technique",
    explanationJa: "elicitation techniqueは、利用できる情報源の性質と、引き出したい情報に合わせて選ぶ。最終文書の記法やbaselineの版番号は中心的な選択基準ではない",
    source: "Syllabus 3.3.0 · 4.2",
  },
  {
    id: "Q024", unit: 4, eo: "EO 4.3.1", kind: "single", points: 2,
    prompt: "Two stakeholders request mutually exclusive behaviors. What should be done before selecting a conflict-resolution technique?",
    options: ["Analyze the conflict, its causes, and the parties' interests", "Prioritize both requirements using one numerical criterion", "Validate each requirement independently and keep both if each is valid", "Document a compromise before discussing the conflict with the stakeholders"], correct: [0], keyword: "requirements conflict",
    explanationJa: "解決手法を選ぶ前に、conflictの種類、原因、関係者の利害や態度を分析する必要がある",
    source: "Syllabus 3.3.0 · 4.3",
  },
  {
    id: "Q025", unit: 4, eo: "EO 4.4.1", kind: "multiple", points: 2,
    prompt: "Which TWO questions are directly relevant when validating requirements?",
    options: ["Do the requirements reflect the relevant stakeholder needs?", "Are the requirements understandable to the intended readers?", "Are all requirements documented at exactly the same level of detail?", "Has one final technical solution already been selected for every requirement?"], correct: [0, 1], keyword: "requirements validation",
    explanationJa: "validationではニーズへの適合や理解可能性などを確認する。全要求を同一詳細度にしたり、すべての解決策を確定したりすることが目的ではない",
    source: "Syllabus 3.3.0 · 4.4",
  },
  {
    id: "Q026", unit: 4, eo: "EO 4.4.1", kind: "boolean", points: 1,
    prompt: "True or False: Requirements validation should be postponed until the complete requirements specification has been finished.",
    options: ["True", "False"], correct: [1], keyword: "early validation",
    explanationJa: "validationは早期かつ繰り返し行うことで、後工程に進む前に欠陥を見つけ、手戻りを抑えられる",
    source: "Syllabus 3.3.0 · 4.4",
  },
];
