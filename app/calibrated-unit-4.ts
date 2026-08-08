import { makeQuestions, type Concept } from "./calibrated-question-builder.ts";

const concepts: Concept[] = [
  {
    unit: 4, eo: "EO 4.1.1", section: "4.1", level: "L3", keyword: "system boundary",
    explanationJa: "system boundaryは対象systemとcontextを分け、context boundaryは要求に関係するcontextと無関係な外界を分ける",
    variants: [
      ["A third-party payment service is not part of the system being built but exchanges authorization data with it. Where should the service be placed?", "Inside the system context but outside the system boundary", ["Inside the system boundary", "Outside the context boundary", "Inside the requirements-management repository"]],
      ["Weather conditions have no influence on an indoor payroll system or any of its requirements. Where are they most likely located?", "Outside the context boundary", ["Inside the system boundary", "Inside the system context as a relevant external factor", "On the system boundary as an interface"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.1.2", section: "4.1", level: "L1", keyword: "requirements source",
    explanationJa: "requirements sourceにはstakeholder、document、existing systemなどがあり、法令や業務文書も重要",
    variants: [
      ["Which item is a document source for requirements?", "A regulation that the planned system must comply with", ["A stakeholder interview plan", "A prototype created to explore a new solution", "A prioritization matrix produced after elicitation"]],
      ["Why can examining an existing legacy system be useful during elicitation?", "It may reveal current behavior and implicit needs that stakeholders do not mention", ["It fixes the architecture of the replacement system", "It makes stakeholder elicitation unnecessary", "It proves that all current behavior must be preserved"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.1.3", section: "4.1", level: "L3", keyword: "stakeholder list",
    explanationJa: "stakeholder listではroleとpersonを区別し、availability、expertise、interestなど要求工学に必要な情報を管理する",
    variants: [
      ["Which information is most useful in a stakeholder list for planning elicitation?", "Role, availability, relevant expertise, and interests", ["Only the person's organizational title", "Only the requirement IDs already assigned to the person", "Only the solution component the person prefers"]],
      ["A product targets millions of anonymous consumers. How should their stakeholder perspective be represented?", "Identify relevant user groups and use representative personas where useful", ["Exclude consumers because individual names are unknown", "Represent only the internal product owner", "Treat the future product itself as the consumer stakeholder"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.1.4", section: "4.1", level: "L2", keyword: "stakeholder management",
    explanationJa: "stakeholder relationship managementはrights、obligations、participation、needsの扱いを明確にし、関係上の問題を抑える",
    variants: [
      ["Which issue is stakeholder relationship management intended to address most directly?", "Unclear participation, responsibilities, rights, or neglected stakeholder interests", ["All volatility in system requirements", "All technical defects in the solution", "All limitations of the chosen modeling notation"]],
      ["Why should stakeholder identification continue throughout development?", "Relevant roles, people, influence, and availability may change over time", ["The initial stakeholder list is intentionally incomplete by definition", "Only end users matter after implementation starts", "Changes in the system boundary automatically identify every new stakeholder"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.2.1", section: "4.2", level: "L2", keyword: "Kano model",
    explanationJa: "Kano modelはdissatisfier、satisfier、delighterを区別し、明示されない当然品質や潜在ニーズも考える",
    variants: [
      ["Users rarely ask for secure authentication because they consider it a basic expectation; its absence would cause strong dissatisfaction. How does Kano classify it?", "A dissatisfier", ["A satisfier", "A delighter", "A solution constraint"]],
      ["A feature that users did not expect creates strong positive excitement when they see it. How does Kano classify it?", "A delighter", ["A dissatisfier", "A satisfier", "A mandatory constraint"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.2.2", section: "4.2", level: "L2", keyword: "elicitation technique category",
    explanationJa: "gathering techniquesは既存sourceから情報を得て、design/idea-generating techniquesは新しいsolution ideaやdelighter探索に向く",
    variants: [
      ["Which activity is primarily a design and idea-generating elicitation technique?", "Brainstorming alternative ways to solve a user's problem", ["Interviewing an operator about the current process", "Reading a relevant regulation", "Observing users performing the current task"]],
      ["What is the primary purpose of gathering techniques?", "Obtain requirements-related information from existing sources", ["Generate only unexpected delighters", "Resolve conflicting requirements", "Prioritize the elicited requirements"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.2.3", section: "4.2", level: "L2", keyword: "technique selection",
    explanationJa: "elicitation techniqueはsystem、lifecycle、stakeholder、organization、information needに合わせ、複数を組み合わせる",
    variants: [
      ["Operators perform a highly habitual task and cannot explain many of its steps. Which technique is a strong starting point?", "Observation in the actual work environment", ["A broad anonymous questionnaire", "A requirements prioritization workshop", "A document inspection of the future specification"]],
      ["Why is combining elicitation techniques often useful?", "Different techniques reveal different kinds of knowledge and reduce blind spots", ["A combination guarantees complete requirements", "Combining techniques makes stakeholder availability irrelevant", "All techniques have equivalent strengths when used together"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.3.1", section: "4.3", level: "L1", keyword: "conflict type",
    explanationJa: "conflict typesにはsubject matter、data、interest、value、relationship、structuralなどがある",
    variants: [
      ["Two stakeholder groups compete for the same limited budget to fund different features. Which conflict type is most likely?", "An interest conflict", ["A data conflict", "A value conflict", "A relationship conflict"]],
      ["Two trusted reports provide different values for the same market size. Which conflict type is most likely?", "A data conflict", ["An interest conflict", "A value conflict", "A structural conflict"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.3.2", section: "4.3", level: "L2", keyword: "conflict resolution activities",
    explanationJa: "conflict resolutionではidentify、analyze、resolve、documentの活動を区別する",
    variants: [
      ["After a requirements conflict has been recognized, what should happen before choosing a resolution technique?", "Analyze the conflict type, causes, and stakeholder attitudes", ["Prioritize the conflicting requirements immediately", "Record a compromise as the decision", "Revalidate only the higher-level requirement"]],
      ["Why should the result of resolving a requirements conflict be documented?", "To preserve the agreed decision and the reasoning needed for later understanding", ["To ensure the decision can never be changed", "To replace stakeholder agreement with a written record", "To convert the resolved requirements into a baseline automatically"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.3.3", section: "4.3", level: "L2", keyword: "conflict resolution technique",
    explanationJa: "consensus、compromise、voting、overruling、definition of variantsなどをconflictと状況に応じて使う",
    variants: [
      ["Two alternatives have comparable support, only one can be funded, and all parties accept a majority decision. Which resolution technique fits best?", "Voting", ["Consensus building", "Definition of variants", "Overruling"]],
      ["Two customer segments need incompatible workflows, but maintaining two product editions is economically feasible. Which technique fits best?", "Definition of variants", ["Voting for one universal workflow", "Overruling one segment", "Averaging both workflows into a compromise"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.4.1", section: "4.4", level: "L2", keyword: "validation value",
    explanationJa: "早いvalidationは欠陥のdownstream costを下げ、work productとindividual requirementのqualityを確認する",
    variants: [
      ["Why is early requirements validation economically valuable?", "Defects can be corrected before they cause more expensive downstream rework", ["It permanently stabilizes the requirements scope", "It eliminates the need for later change management", "It proves market success before implementation"]],
      ["What is an object of requirements validation?", "Both individual requirements and the quality of the work products containing them", ["Only the implemented source code", "Only the process used to elicit the requirements", "Only the version identifiers assigned by the tool"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.4.2", section: "4.4", level: "L1", keyword: "validation aspects",
    explanationJa: "validationではright stakeholders、defect findingとcorrectionの分離、複数viewpoint、repeated validationが重要",
    variants: [
      ["Which practice is an important aspect of requirements validation?", "Perform validation repeatedly as requirements evolve", ["Use one reviewer to keep interpretations consistent", "Correct every issue immediately while it is being identified", "Exclude stakeholders who did not author the requirement"]],
      ["Why can defect identification be separated from defect correction during a review?", "It helps reviewers stay focused on finding and understanding defects before debating fixes", ["It ensures defects remain unresolved until implementation", "It makes stakeholder decisions unnecessary", "It converts validation into elicitation"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.4.3", section: "4.4", level: "L2", keyword: "validation technique",
    explanationJa: "validation techniques include review系とexploratory系を目的やriskに応じて選ぶ",
    variants: [
      ["A safety-critical specification requires a formal, documented review with defined roles and findings. Which technique is most suitable?", "A structured inspection", ["An informal walkthrough", "A prototype demonstration", "An acceptance test on a future implementation"]],
      ["Stakeholders cannot judge a written interaction sequence and need to experience it before implementation. Which technique is most suitable?", "Explore the interaction with a prototype", ["Perform a version audit", "Create a baseline before review", "Use a traceability matrix without stakeholder interaction"]],
    ],
  },
];

export const calibratedUnit4Questions = makeQuestions(concepts);
