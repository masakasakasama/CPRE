import type { Question } from "./data.ts";

export const calibratedCoreUnit6Questions: Question[] = [
  {
    id: "Q033", unit: 6, eo: "EO 6.1.1", kind: "single", points: 1,
    prompt: "What is the central purpose of requirements management?",
    options: ["Keep existing requirements identifiable, usable, and controlled throughout their life cycle", "Discover all stakeholder needs before any requirement is documented", "Define the system boundary and all external interfaces", "Select the technical solution that satisfies each requirement"], correct: [0], keyword: "requirements management",
    explanationJa: "requirements managementは、既存要求をライフサイクル全体で識別、利用、変更、追跡できる状態に保つ活動",
    source: "Syllabus 3.3.0 · 6.1",
  },
  {
    id: "Q034", unit: 6, eo: "EO 6.3.1", kind: "single", points: 2,
    prompt: "A legal change causes an approved requirement to be revised. Which management concept primarily enables the team to distinguish and recover its earlier and later states?",
    options: ["Version control", "Traceability", "Baseline management", "Life-cycle status"], correct: [0], keyword: "version control",
    explanationJa: "version controlにより、成果物の異なる版と変更履歴を識別し、必要に応じて以前の状態へ戻せる",
    source: "Syllabus 3.3.0 · 6.3",
  },
  {
    id: "Q035", unit: 6, eo: "EO 6.4.1", kind: "single", points: 2,
    prompt: "A logically consistent set of selected work-product versions has been stabilized and can be changed only through defined change control. What is it?",
    options: ["Baseline", "Configuration", "Version", "Release"], correct: [0], keyword: "baseline",
    explanationJa: "configurationのうち、安定化され変更管理の対象となったものがbaseline",
    source: "Syllabus 3.3.0 · 6.4",
  },
  {
    id: "Q036", unit: 6, eo: "EO 6.6.1", kind: "multiple", points: 2,
    prompt: "Which TWO relationships are examples of requirements traceability?",
    options: ["A requirement linked to the stakeholder need from which it originated", "A requirement linked to a test case that verifies it", "A requirement associated with its priority attribute", "A requirement associated with its current life-cycle status"], correct: [0, 1], keyword: "traceability",
    explanationJa: "traceabilityは要求の起源や関連する後続成果物との関係を追えるようにする。priorityやstatusは要求自身のattribute",
    source: "Syllabus 3.3.0 · 6.6",
  },
  {
    id: "Q037", unit: 6, eo: "EO 6.7.1", kind: "single", points: 2,
    prompt: "A change request affects an approved requirement. What should happen before the requirement itself is modified?",
    options: ["Assess the requested change and its impact", "Create a new version and then decide whether the change was needed", "Update the baseline first so every stakeholder sees the proposed change", "Reprioritize the requirement before identifying affected work products"], correct: [0], keyword: "change request",
    explanationJa: "変更を反映する前にchange requestを評価し、価値、コスト、影響範囲、関係者などを確認する",
    source: "Syllabus 3.3.0 · 6.7",
  },
  {
    id: "Q038", unit: 6, eo: "EO 6.8.1", kind: "single", points: 2,
    prompt: "Why may one simple priority number be insufficient for deciding which requirements to implement next?",
    options: ["Different criteria and stakeholder perspectives may lead to different priority judgments", "Priority should always be derived directly from the requirement's life-cycle state", "Only requirements with trace links are allowed to receive priorities", "A requirement's priority becomes fixed once it enters a baseline"], correct: [0], keyword: "prioritization",
    explanationJa: "優先順位はbusiness value、urgency、effort、risk、dependencyやstakeholder視点など複数要素に左右される",
    source: "Syllabus 3.3.0 · 6.8",
  },
  {
    id: "Q039", unit: 6, eo: "EO 6.5.1", kind: "boolean", points: 1,
    prompt: "True or False: Requirement attributes can be used to filter a requirements collection and create views for different stakeholder information needs.",
    options: ["True", "False"], correct: [0], keyword: "attribute",
    explanationJa: "attributeにstatus、priority、ownerなどを持たせることで、目的に応じた抽出やviewを作れる\n\n【実務例（Polarion）】Requirement Work ItemにStatus=Approved、Priority=High、Owner=IVI Teamのようなfield値を持たせ、これらを条件にfilterすると、管理者向け（High Priorityのみ）やIVI担当向け（Owner=IVI Teamのみ）のviewを作れる",
    source: "Syllabus 3.3.0 · 6.5",
  },
];
