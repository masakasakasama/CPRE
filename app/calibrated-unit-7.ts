import { makeQuestions, type Concept } from "./calibrated-question-builder.ts";

const concepts: Concept[] = [
  {
    unit: 7, eo: "EO 7.1.1", section: "7.1", level: "L1", keyword: "RE tool type",
    explanationJa: "RE toolsはrequirements management、modeling、collaboration、process support、testing/simulationなどのactivitiesを支援する",
    variants: [
      ["Which capability is characteristic of a tool used for requirements management?", "Managing requirement versions, configurations, and trace links", ["Resolving stakeholder conflicts without human decisions", "Determining business value objectively", "Guaranteeing that every requirement is adequate"]],
      ["A distributed team needs shared editing, review comments, and discussion around requirements. Which type of tool support is most directly relevant?", "Collaboration in Requirements Engineering", ["Requirements simulation", "Requirements versioning", "Requirements modeling"]],
    ],
  },
  {
    unit: 7, eo: "EO 7.2.1", section: "7.2", level: "L2", keyword: "tool introduction",
    explanationJa: "tool introductionはgoals/context/requirementsを明確にし、TCO、resources、pilot、evaluation criteria、training、change managementを考える",
    variants: [
      ["What should be done before selecting a specific RE tool?", "Describe the goals, context, processes, and support requirements the tool must address", ["Choose the product with the most features", "Adopt a candidate tool's default workflow as the target process", "Migrate existing data before defining evaluation criteria"]],
      ["Why is a pilot useful when introducing an RE tool?", "It allows fit, usability, and introduction risks to be evaluated in a limited representative scope", ["It makes user training unnecessary", "It eliminates the need to estimate life-cycle costs", "It guarantees organization-wide adoption"]],
    ],
  },
];

export const calibratedUnit7Questions = makeQuestions(concepts);
