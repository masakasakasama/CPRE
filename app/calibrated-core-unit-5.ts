import type { Question } from "./data.ts";

export const calibratedCoreUnit5Questions: Question[] = [
  {
    id: "Q027", unit: 5, eo: "EO 5.1.1", kind: "single", points: 2,
    prompt: "Why can an RE process that works well for one project be unsuitable for another?",
    options: ["Relevant influencing factors such as risk, stakeholder availability, and development context may differ", "Requirements Engineering has no practices that can be reused across projects", "Every project must use a different requirements notation", "Requirements patterns cannot recur across different systems"], correct: [0], keyword: "influencing factors",
    explanationJa: "REプロセスはrisk、stakeholderの可用性、契約、開発アプローチなどのinfluencing factorsに合わせて構成する",
    source: "Syllabus 3.3.0 · 5.1",
  },
  {
    id: "Q028", unit: 5, eo: "EO 5.2.1", kind: "single", points: 2,
    prompt: "Which process characteristic most directly helps expose misunderstandings between stakeholders and the development team early?",
    options: ["Short feedback loops", "A single centrally controlled baseline", "A highly detailed initial specification", "One final acceptance review"], correct: [0], keyword: "feedback loop",
    explanationJa: "短いfeedback loopは理解のずれを早い段階で明らかにし、修正コストを抑える",
    source: "Syllabus 3.3.0 · 5.2",
  },
  {
    id: "Q029", unit: 5, eo: "EO 5.2.1", kind: "boolean", points: 1,
    prompt: "True or False: Requirements Engineering can use iterative feedback and refinement even when the surrounding development process is largely plan-driven.",
    options: ["True", "False"], correct: [0], keyword: "iterative RE",
    explanationJa: "周辺の開発がplan-drivenでも、要求の確認や詳細化を反復的に進めることは可能",
    source: "Syllabus 3.3.0 · 5.2",
  },
  {
    id: "Q030", unit: 5, eo: "EO 5.3.1", kind: "multiple", points: 3,
    prompt: "Which TWO activities belong to tailoring a Requirements Engineering process?",
    options: ["Select practices that fit the project context", "Define when the required work products are produced and refined", "Reuse another project's process without analyzing the current situation", "Select the RE tool before determining process needs"], correct: [0, 1], keyword: "tailoring",
    explanationJa: "tailoringでは、状況に合わせてpractice、work product、役割、タイミングなどを構成する",
    source: "Syllabus 3.3.0 · 5.3",
  },
  {
    id: "Q031", unit: 5, eo: "EO 5.3.1", kind: "single", points: 2,
    prompt: "A safety-critical project requires auditable evidence that key requirements were reviewed and approved. Which process adaptation is most appropriate?",
    options: ["Include explicit review, approval, and documentation steps", "Rely mainly on informal discussions to keep feedback fast", "Delay validation until the system is ready for release", "Reduce documentation so that requirements can change without control"], correct: [0], keyword: "process configuration",
    explanationJa: "安全性や規制上の厳密さが高い場合、明示的なreview、approval、documented evidenceをプロセスに組み込む",
    source: "Syllabus 3.3.0 · 5.3",
  },
  {
    id: "Q032", unit: 5, eo: "EO 5.1.1", kind: "single", points: 1,
    prompt: "Which factor is most relevant when deciding how rigorous an RE process needs to be?",
    options: ["Project risk", "Requirement identifier format", "Preferred modeling notation", "Repository file format"], correct: [0], keyword: "risk",
    explanationJa: "project riskは必要な文書化、validation、承認などの厳密さに直接影響するinfluencing factor",
    source: "Syllabus 3.3.0 · 5.1",
  },
];
