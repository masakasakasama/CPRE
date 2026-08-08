import { makeQuestions, type Concept } from "./calibrated-question-builder.ts";

const concepts: Concept[] = [
  {
    unit: 1, eo: "EO 1.1.1", section: "1.1", level: "L1", keyword: "requirement",
    explanationJa: "requirementは、対象となるシステムに対してstakeholderが必要とする性質や能力を表す。systemはソフトウェアだけでなくサービスや組織的な仕組みも含み得る",
    variants: [
      ["A retailer states that customers must be able to cancel an order before dispatch. In RE terminology, what is this statement primarily?", "A requirement", ["A stakeholder", "A work product", "A system context"]],
      ["Which item can be regarded as a system in Requirements Engineering?", "An organizational service being introduced for customers", ["Only executable software", "Only a physical technical device", "Only the written requirements specification"]],
    ],
  },
  {
    unit: 1, eo: "EO 1.1.2", section: "1.1", level: "L2", keyword: "requirement classification",
    explanationJa: "機能要求は振る舞い、品質要求は性能や信頼性などの品質、constraintは解決方法の選択肢を制限する",
    variants: [
      ["A payment service shall confirm a transaction within 800 ms under normal load. How should this requirement be classified?", "A quality requirement", ["A functional requirement", "A constraint", "A business requirement"]],
      ["The solution must use the database product mandated by the enterprise architecture board. How should this requirement be classified?", "A constraint", ["A functional requirement", "A quality requirement", "A user requirement"]],
    ],
  },
  {
    unit: 1, eo: "EO 1.2.1", section: "1.2", level: "L2", keyword: "value of RE",
    explanationJa: "適切な要求工学は、必要なものへの共通理解を高め、見積りやtestの根拠を作り、誤ったシステムを作るリスクを下げる",
    variants: [
      ["Which outcome is most directly supported when requirements describe the expected behavior clearly and measurably?", "Testers have a stronger basis for deriving tests", ["Architectural trade-offs are no longer needed", "Requirement changes no longer need impact analysis", "Stakeholder conflicts are automatically resolved"]],
      ["Why can adequate Requirements Engineering improve an early effort estimate?", "The required scope and relevant constraints are better understood", ["The implementation technology becomes fully determined", "The requirements become permanently stable", "All uncertainty in the project is removed"]],
    ],
  },
  {
    unit: 1, eo: "EO 1.2.2", section: "1.2", level: "L1", keyword: "inadequate RE",
    explanationJa: "要求の欠落や誤解は、実装を急ぐこと、意思疎通不足、要求は自明という思い込みなどから起こりやすい",
    variants: [
      ["A team starts implementation after hearing only the sponsor's high-level goal and postpones stakeholder analysis. Which RE problem does this best illustrate?", "Rushing into solution development before understanding the requirements", ["Over-documenting traceability", "Applying too many validation perspectives", "Using an overly detailed life-cycle model"]],
      ["Which situation most increases the risk of missing implicit requirements?", "Stakeholders and developers assume that important needs are obvious to everyone", ["The team validates early prototypes", "The glossary is reviewed with stakeholders", "Conflicting requirements are analyzed explicitly"]],
    ],
  },
  {
    unit: 1, eo: "EO 1.3.1", section: "1.3", level: "L1", keyword: "requirement perspectives",
    explanationJa: "要求はbusiness、stakeholder、user、systemなど異なる視点と抽象度で現れる",
    variants: [
      ["A company states that order-processing cost must fall by 20% next year. Which perspective does this statement most closely represent?", "A business requirement", ["A user requirement", "A system requirement", "A quality attribute"]],
      ["A nurse says, 'I need to see the patient's current medication before administering a dose.' Which perspective does this most closely express?", "A user requirement", ["A business requirement", "A system architecture constraint", "A requirements-management attribute"]],
    ],
  },
  {
    unit: 1, eo: "EO 1.4.1", section: "1.4", level: "L1", keyword: "major RE tasks",
    explanationJa: "要求工学の主要タスクはelicitation、documentation、validation、managementで、状況に合わせて組み合わせる",
    variants: [
      ["Which activity belongs to the major Requirements Engineering tasks?", "Validating documented requirements with relevant stakeholders", ["Designing the component architecture", "Executing system integration tests", "Estimating source-code complexity"]],
      ["Why is there no single RE process that is optimal for every project?", "RE activities and practices must be tailored to the development and system context", ["Each project must invent new RE terminology", "A tool vendor determines the valid RE process", "Requirements should be handled differently for every individual stakeholder"]],
    ],
  },
  {
    unit: 1, eo: "EO 1.5.1", section: "1.5", level: "L1", keyword: "Requirements Engineer",
    explanationJa: "Requirements Engineerは固定職名に限らず、要求工学の活動を担い、problemとsolutionの理解をつなぐ役割",
    variants: [
      ["Which person can perform the role of Requirements Engineer?", "A product owner who elicits, documents, and validates requirements", ["Only a person whose formal job title is Requirements Engineer", "Only the stakeholder who pays for the system", "Only the administrator of the RE tool"]],
      ["What is a characteristic contribution of a Requirements Engineer?", "Connecting understanding of stakeholder problems with the exploration of possible solutions", ["Making every stakeholder decision on their behalf", "Keeping problem analysis completely separate from any solution learning", "Restricting the role to formatting requirements documents"]],
    ],
  },
  {
    unit: 1, eo: "EO 1.6.1", section: "1.6", level: "L1", keyword: "foundational RE knowledge",
    explanationJa: "基礎知識には原則、work product、elicitationやvalidation、process、management、tool supportが含まれる",
    variants: [
      ["Which capability belongs to the foundational knowledge of Requirements Engineering?", "Selecting suitable practices to elaborate and validate requirements", ["Selecting a programming language for every implementation context", "Administering every database product used by the organization", "Performing financial audits of all suppliers"]],
      ["Which topic is part of the CPRE Foundation Level scope?", "Managing requirements and their changes over time", ["Optimizing production deployment pipelines", "Designing detailed algorithms for all system functions", "Certifying the financial stability of stakeholders"]],
    ],
  },
];

export const calibratedUnit1Questions = makeQuestions(concepts);
