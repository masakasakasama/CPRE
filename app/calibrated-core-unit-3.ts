import type { Question } from "./data.ts";

export const calibratedCoreUnit3Questions: Question[] = [
  {
    id: "Q013", unit: 3, eo: "EO 3.1.1", kind: "single", points: 1,
    prompt: "Which term is the broadest name for something created or used as an artifact during Requirements Engineering?",
    options: ["Work product", "Requirements specification", "Requirements model", "Requirements document"], correct: [0], keyword: "work product",
    explanationJa: "work productは要求工学で作成・利用する成果物の総称で、仕様書、モデル、プロトタイプなどを含む",
    source: "Syllabus 3.3.0 · 3.1",
  },
  {
    id: "Q014", unit: 3, eo: "EO 3.1.2", kind: "single", points: 2,
    prompt: "A product goal states why a system is needed, while an interface rule specifies a detailed reaction of that system. Which concept primarily distinguishes these descriptions?",
    options: ["Abstraction level", "Work-product life span", "Requirement type", "Modeling syntax"], correct: [0], keyword: "abstraction level",
    explanationJa: "同じ対象でも目的レベルと詳細な振る舞いでは抽象度が異なる。この違いがabstraction level",
    source: "Syllabus 3.3.0 · 3.1.2",
  },
  {
    id: "Q015", unit: 3, eo: "EO 3.2.1", kind: "multiple", points: 2,
    prompt: "Which TWO practices reduce ambiguity when documenting requirements in natural language?",
    options: ["Use the same term consistently for the same concept", "Prefer pronouns when the referenced object seems obvious", "Use a consistent sentence structure", "Use qualitative words such as 'fast' when exact values are not yet known"], correct: [0, 2], keyword: "natural language",
    explanationJa: "用語を一貫させ、文構造をそろえることで解釈差を減らせる。参照先が曖昧な代名詞や測定基準のないqualifierは曖昧さを増やす",
    source: "Syllabus 3.3.0 · 3.2",
  },
  {
    id: "Q016", unit: 3, eo: "EO 3.3.1", kind: "single", points: 2,
    prompt: "What is the primary contribution of a phrase template when writing individual requirements?",
    options: ["It ensures that all content fields required for a complete use case are present", "It guides authors toward a consistent sentence structure", "It defines the section structure of the complete requirements document", "It standardizes the notation used in requirements models"], correct: [1], keyword: "phrase template",
    explanationJa: "phrase templateは個々の要求文の構造をそろえるための型。use caseの項目をそろえるform templateや文書全体のdocument templateとは役割が異なる",
    source: "Syllabus 3.3.0 · 3.3",
  },
  {
    id: "Q017", unit: 3, eo: "EO 3.4.2", kind: "single", points: 2,
    prompt: "A team wants one diagram that shows the system under consideration and the relevant people and neighboring systems that interact with it. Which model is most suitable?",
    options: ["Context model", "Class model", "Activity model", "State machine"], correct: [0], keyword: "context model",
    explanationJa: "context modelは対象システムと、その境界を越えて関係するactorや外部systemを表すのに適する",
    source: "Syllabus 3.3.0 · 3.4.2",
  },
  {
    id: "Q018", unit: 3, eo: "EO 3.5.1", kind: "boolean", points: 1,
    prompt: "True or False: A project glossary can support shared understanding by defining preferred terms and clarifying synonyms or homonyms.",
    options: ["True", "False"], correct: [0], keyword: "glossary",
    explanationJa: "glossaryは用語の意味、同義語、同音異義語などを共有し、関係者の用語解釈をそろえるために使う",
    source: "Syllabus 3.3.0 · 3.5",
  },
  {
    id: "Q019", unit: 3, eo: "EO 3.7.1", kind: "single", points: 1,
    prompt: "Which purpose is most characteristic of using a prototype in Requirements Engineering?",
    options: ["Demonstrate that an implemented system conforms to every requirement", "Explore or communicate a solution idea so that stakeholders can give feedback", "Place a set of requirements under formal change control", "Replace the need to document requirements once stakeholders have seen the prototype"], correct: [1], keyword: "prototype",
    explanationJa: "prototypeは解決案を具体化し、理解やフィードバックを得るために使う。実装完了の証明や要求管理の代替ではない",
    source: "Syllabus 3.3.0 · 3.7",
  },
];
