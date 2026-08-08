import { makeQuestions, type Concept } from "./calibrated-question-builder.ts";

const concepts: Concept[] = [
  {
    unit: 2, eo: "EO 2.1.1", section: "2.1", level: "L1", keyword: "RE principles",
    explanationJa: "9原則はvalue-orientation、shared understanding、context、Problem–Requirement–Solution、validation、evolution、innovation、systematic workなど",
    variants: [
      ["Which statement reflects a fundamental RE principle?", "Requirements work should be systematic and disciplined", ["Requirements should be frozen as early as possible", "The tool should determine the process", "More documentation always creates more value"]],
      ["Which principle explicitly recognizes that changing requirements are the normal case?", "Evolution", ["Validation", "Innovation", "Value-orientation"]],
    ],
  },
  {
    unit: 2, eo: "EO 2.2.1", section: "2.2", level: "L1", keyword: "shared understanding",
    explanationJa: "shared understandingには、文書と明示的合意に基づくexplicitと、共有知識や経験に基づくimplicitがある",
    variants: [
      ["A requirement has been documented, reviewed, and agreed by the relevant stakeholders. Which form of shared understanding is this?", "Explicit shared understanding", ["Implicit shared understanding", "Shared context", "Validated traceability"]],
      ["Which condition most strongly supports implicit shared understanding?", "A stable team with shared domain knowledge and successful prior collaboration", ["Frequent team turnover", "Different meanings for key terms", "Long delays between questions and feedback"]],
    ],
  },
  {
    unit: 2, eo: "EO 2.2.2", section: "2.2", level: "L2", keyword: "Problem–Requirement–Solution",
    explanationJa: "problem、requirement、solutionは相互に影響するが、議論では区別して扱うことで混同を減らし、solutionから新しいneedが見つかることもある",
    variants: [
      ["A prototype causes users to recognize a need they had not previously articulated. Which principle best explains this interaction?", "Problem–Requirement–Solution", ["Value-orientation", "Systematic work", "Explicit shared understanding"]],
      ["Why should a team distinguish problems, requirements, and solutions during discussion even though they influence each other?", "The distinction helps the team reason about intertwined concerns without confusing them", ["The distinction proves that solutions never create new requirements", "The distinction makes validation unnecessary", "The distinction prevents the system context from changing"]],
    ],
  },
];

export const calibratedUnit2Questions = makeQuestions(concepts);
