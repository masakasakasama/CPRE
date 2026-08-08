import type { Question } from "./data.ts";

export const calibratedCoreUnit2Questions: Question[] = [
  {
    id: "Q007", unit: 2, eo: "EO 2.1.1", kind: "single", points: 1,
    prompt: "A team considers documenting a minor requirement in great detail, but the expected benefit is lower than the effort. Which RE principle is most directly relevant?",
    options: ["Innovation", "Value-orientation", "Evolution", "Shared understanding"], correct: [1], keyword: "value-orientation",
    explanationJa: "value-orientationは、要求を扱うためのコストと得られる価値の釣り合いを考える原則",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q008", unit: 2, eo: "EO 2.2.2", kind: "single", points: 2,
    prompt: "A stable team uses the same domain vocabulary and reaches decisions quickly through conversation, but records only a small part of that knowledge. Which form of shared understanding is dominant?",
    options: ["Explicit shared understanding", "Implicit shared understanding", "Requirements validation", "Explicit traceability"], correct: [1], keyword: "implicit shared understanding",
    explanationJa: "共有知識、経験、信頼を背景に文書化されず成立する理解はimplicit shared understanding。文書や明示的合意に基づくものはexplicit",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q009", unit: 2, eo: "EO 2.2.2", kind: "multiple", points: 2,
    prompt: "Which TWO activities most directly help clarify a system's context?",
    options: ["Identify relevant external interfaces", "Define the system boundary", "Specify the internal component architecture", "Prioritize stakeholder requirements"], correct: [0, 1], keyword: "context",
    explanationJa: "contextを明確にする中心は、対象システムと周囲を分けるsystem boundaryと、周囲とのinterfaceを把握すること",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q010", unit: 2, eo: "EO 2.2.2", kind: "boolean", points: 1,
    prompt: "True or False: The evolution principle treats requirements change as a normal situation that should be managed rather than as an exceptional failure.",
    options: ["True", "False"], correct: [0], keyword: "evolution",
    explanationJa: "evolutionの原則では、要求は時間とともに変化することを前提とし、変更を通常の活動として扱う",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q011", unit: 2, eo: "EO 2.2.2", kind: "single", points: 1,
    prompt: "Which statement best describes the purpose of requirements validation?",
    options: ["Confirm that every requirement follows the chosen document template", "Check whether the requirements and work products correspond to the intended stakeholder needs", "Confirm that the selected design is technically feasible", "Verify that all requirements are already under change control"], correct: [1], keyword: "validation",
    explanationJa: "validationは、要求や成果物が関係者の本来のニーズに合っているかを確認する活動。形式への準拠や技術的実現性だけの確認ではない",
    source: "Syllabus 3.3.0 · 2.2",
  },
  {
    id: "Q012", unit: 2, eo: "EO 2.2.2", kind: "single", points: 2,
    prompt: "A team keeps reusing a familiar solution although stakeholders are dissatisfied with its results. Which RE principle should receive more attention?",
    options: ["Innovation", "Value-orientation", "Evolution", "Systematic and disciplined work"], correct: [0], keyword: "innovation",
    explanationJa: "innovationは既存解決策を当然視せず、問題に対してより良い解決の可能性を探索する原則",
    source: "Syllabus 3.3.0 · 2.2",
  },
];
