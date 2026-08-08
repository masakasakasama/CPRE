import { makeQuestions, type Concept } from "./calibrated-question-builder.ts";

const concepts: Concept[] = [
  {
    unit: 6, eo: "EO 6.1.1", section: "6.1", level: "L1", keyword: "requirements management",
    explanationJa: "requirements managementは既存要求を保存、識別、変更、追跡し、必要な役割が利用できる状態を保つ",
    variants: [
      ["Which activity is primarily part of requirements management rather than requirements elicitation?", "Maintaining trace links from an existing requirement to related work products", ["Interviewing a newly identified stakeholder", "Observing a current business process", "Brainstorming new solution ideas"]],
      ["Why is requirements management needed after requirements have been elicited?", "Requirements must remain usable and controlled while they evolve", ["Requirements stop changing after elicitation", "Management replaces the need for validation", "Only management tools can display requirements"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.2.1", section: "6.2", level: "L2", keyword: "requirements life cycle",
    explanationJa: "life cycle modelはallowed statesとtransitionsを定義し、current statusとhistoryを扱う",
    variants: [
      ["A requirement may move from Draft to Reviewed to Agreed, but not directly from Draft to Implemented. What defines these allowed states and transitions?", "A requirements life-cycle model", ["A requirements configuration", "A traceability model", "A prioritization scheme"]],
      ["Why is a requirement's current life-cycle status useful?", "It tells participants whether the requirement is ready for particular downstream activities", ["It replaces the need for version information", "It determines the requirement's business value", "It identifies the requirement's source automatically"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.3.1", section: "6.3", level: "L2", keyword: "versioning concept",
    explanationJa: "versioning conceptにはunique version identification、change history、storage/retrievalが必要",
    variants: [
      ["Which set of capabilities is essential for requirements version control?", "Unique version identifiers, change history, and a way to store and retrieve versions", ["Priority criteria, stakeholder roles, and review techniques", "Life-cycle states, personas, and prototypes", "Context boundaries, model views, and user stories"]],
      ["Why is a new version normally created after a controlled change to a work product?", "To preserve its evolution and allow an earlier state to be identified or restored", ["To make the changed work product a baseline automatically", "To remove the need for recording why it changed", "To replace traceability to related work products"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.4.1", section: "6.4", level: "L1", keyword: "configuration and baseline",
    explanationJa: "configurationは目的に対して整合したselected versionsの集合、baselineはそのうちstableでchange-controlledなもの",
    variants: [
      ["A review package contains one selected version of each related requirement work product for a particular release candidate. What is this collection?", "A requirements configuration", ["A requirements version", "A requirements view", "A requirements life-cycle model"]],
      ["What distinguishes a baseline from an ordinary requirements configuration?", "The baseline is stable and subject to defined change control", ["The baseline contains every historical version of every work product", "The baseline has no particular purpose or scope", "The baseline cannot be replaced by a later baseline"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.5.1", section: "6.5", level: "L1", keyword: "requirements attribute",
    explanationJa: "requirement attributeはowner、status、priorityなどのmetadataを保持し、管理やviewを支援する",
    variants: [
      ["Which item is a suitable requirement attribute?", "The person or role responsible for the requirement", ["The trace link to a verifying test case", "The text of a related requirement", "The diagram used to model the system context"]],
      ["What is the main purpose of requirement attributes?", "Store metadata needed to manage and retrieve requirements during the life cycle", ["Replace the requirement statement itself", "Replace explicit trace links between work products", "Define the system boundary"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.5.2", section: "6.5", level: "L2", keyword: "attribute selection",
    explanationJa: "attributeはstakeholder information needとproject contextから必要最小限を選び、入力負荷とのバランスを取る",
    variants: [
      ["A test manager must find agreed requirements that still have no linked test. Which information is most useful to maintain?", "Approval status and whether a verifying test link exists", ["Only the author and creation date", "Only the requirement's textual length", "Only the document section containing the requirement"]],
      ["How should a project decide which requirement attributes to maintain?", "Start from the information that stakeholders need for their work and decisions", ["Copy every attribute available in the tool", "Use the same attribute set for every project regardless of context", "Let each author invent different attributes for each requirement"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.5.3", section: "6.5", level: "L2", keyword: "requirements view",
    explanationJa: "selective viewは対象requirementsを絞り、projective viewはattributesを絞り、aggregating viewはsummary/aggregationを示す",
    variants: [
      ["A report displays only the requirements tagged as security-related, while retaining their normal attributes. Which view type is primarily being used?", "A selective view", ["A projective view", "An aggregating view", "A configuration view"]],
      ["A dashboard groups requirements by status and shows only counts per group. Which view type is primarily being used?", "An aggregating view", ["A selective view", "A projective view", "A traceability view"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.6.1", section: "6.6", level: "L1", keyword: "traceability purpose",
    explanationJa: "traceabilityはorigin、downstream work product、inter-requirement dependenciesを追い、impact analysisやcomplianceを支援する",
    variants: [
      ["Which task is directly supported by requirements traceability?", "Finding which tests and design elements may be affected by a changed requirement", ["Determining the requirement's priority from its wording", "Choosing the best elicitation technique for a new stakeholder", "Selecting a document template for the specification"]],
      ["Why can traceability be important in a regulated project?", "It can provide evidence linking obligations through requirements to verification or implementation artifacts", ["It ensures that requirements never change", "It removes the need for requirement identifiers", "It proves that every requirement has equal priority"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.6.2", section: "6.6", level: "L1", keyword: "implicit traceability",
    explanationJa: "implicit traceabilityはstructureやnamingからrelationを推測し、explicit traceabilityはID間のrelationを明示記録する",
    variants: [
      ["Requirements and test cases use matching section structures, but no links are stored between them. What kind of traceability is this?", "Implicit traceability", ["Explicit traceability", "Bidirectional explicit traceability", "Traceability through a matrix"]],
      ["What distinguishes explicit traceability from implicit traceability?", "Relationships between uniquely identified work products are deliberately recorded", ["Relationships are inferred only from similar document structure", "No identifiers are needed for the related work products", "The relationship exists only while two documents have the same version number"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.6.3", section: "6.6", level: "L1", keyword: "trace representation",
    explanationJa: "explicit traceabilityはreference、hyperlink、matrix、table、graphなどでID間relationshipを表す",
    variants: [
      ["Which artifact is commonly used to represent explicit relationships between requirements and test cases?", "A traceability matrix", ["A requirements glossary", "A prioritization matrix", "A stakeholder map"]],
      ["Which mechanism is an explicit traceability representation?", "A stored hyperlink from a requirement identifier to a test-case identifier", ["Matching paragraph positions in two documents", "Similar wording in a requirement and a test", "A shared naming convention without stored relationships"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.7.1", section: "6.7", level: "L1", keyword: "handling change",
    explanationJa: "change handlingはprocess contextにより、formal change request/CCBやbacklog reprioritizationなどで管理する",
    variants: [
      ["In a plan-driven project with formally baselined requirements, which body may be responsible for approving a change request?", "A Change Control Board", ["The individual who originally wrote the requirement alone", "The RE tool administrator", "Any stakeholder who discovers the need for change"]],
      ["How is a newly discovered requirement commonly handled in an iterative product approach?", "Add it to the product backlog and prioritize it with the other work", ["Modify the current baseline without recording a change", "Implement it immediately before assessing value or impact", "Keep the backlog fixed once an iteration has started"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.8.1", section: "6.8", level: "L1", keyword: "prioritization criteria",
    explanationJa: "prioritization criteriaにはbusiness value、urgency、effort、risk、dependencyなどがある",
    variants: [
      ["Which item is a meaningful criterion for prioritizing requirements?", "Business value", ["Requirement identifier", "Sentence length", "Document section number"]],
      ["Why is requirements prioritization needed?", "Available capacity and dependencies mean that not all requirements should be implemented at the same time", ["Every requirement has a fixed natural rank", "Prioritization removes requirement dependencies", "One stakeholder must always make all priority decisions"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.8.2", section: "6.8", level: "L1", keyword: "prioritization steps",
    explanationJa: "prioritization前にgoal/constraints、criteria、stakeholders、requirements、techniqueを決める",
    variants: [
      ["What should be clarified before choosing a prioritization technique?", "The goals and constraints of the prioritization activity", ["The final implementation design", "The final acceptance-test results", "The next baseline version number"]],
      ["Which preparation step determines whose judgments should contribute to prioritization?", "Identify the stakeholders who should participate", ["Assign a random initial ranking", "Remove requirements that appear low value", "Freeze all requirement attributes"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.8.3", section: "6.8", level: "L1", keyword: "prioritization technique",
    explanationJa: "prioritization techniqueはad-hocとanalyticalに大別でき、weighted matrixなどはanalytical",
    variants: [
      ["Which pair names the two broad categories of prioritization techniques described in the syllabus?", "Ad-hoc and analytical", ["Linear and iterative", "Explicit and implicit", "Temporary and durable"]],
      ["A team scores each requirement against weighted value, risk, and effort criteria. Which category best describes the technique?", "An analytical prioritization technique", ["An ad-hoc prioritization technique", "A conflict-resolution technique", "An elicitation technique"]],
    ],
  },
];

export const calibratedUnit6Questions = makeQuestions(concepts);
