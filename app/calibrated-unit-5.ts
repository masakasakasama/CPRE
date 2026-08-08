import { makeQuestions, type Concept } from "./calibrated-question-builder.ts";

const concepts: Concept[] = [
  {
    unit: 5, eo: "EO 5.1.1", section: "5.1", level: "L1", keyword: "influencing factor",
    explanationJa: "RE processにはdevelopment context、stakeholder availability、risk、complexity、constraints、time/budget、volatility、experienceなどが影響する",
    variants: [
      ["Which factor can directly influence how an RE process should be configured?", "The volatility of the requirements", ["The numbering scheme used for requirement IDs", "The visual layout of the requirements tool", "The alphabetical order of stakeholder names"]],
      ["Which stakeholder-related factor should be considered when configuring the process?", "Stakeholder capability and availability", ["The default font in stakeholder documents", "The device used to join meetings", "The order in which stakeholder names are listed"]],
    ],
  },
  {
    unit: 5, eo: "EO 5.1.2", section: "5.1", level: "L2", keyword: "process constraint",
    explanationJa: "influencing factors constrain viable process choices。継続feedback前提のprocessには継続的なstakeholder availabilityが必要",
    variants: [
      ["Stakeholders are available for intensive workshops only at the start of a project. Which process choice is most at risk?", "An iterative RE approach that depends on frequent stakeholder feedback throughout development", ["An early concentrated elicitation phase", "A formal approval step after initial documentation", "A versioning concept for durable work products"]],
      ["A system is highly safety-critical and subject to external audits. Which process adaptation is most reasonable?", "Increase rigor in documentation, traceability, and validation", ["Reduce documentation to preserve flexibility", "Rely mainly on implicit shared understanding", "Minimize formal review to shorten feedback loops"]],
    ],
  },
  {
    unit: 5, eo: "EO 5.2.1", section: "5.2", level: "L2", keyword: "process facets",
    explanationJa: "process facetsはtime（linear/iterative）、purpose（prescriptive/explorative）、target（customer-specific/market-oriented）",
    variants: [
      ["Which process facet distinguishes whether requirements are largely prescribed or must be explored?", "The purpose facet", ["The time facet", "The target facet", "The work-product facet"]],
      ["Which process facet distinguishes a product developed for a market from a system commissioned by a specific customer?", "The target facet", ["The purpose facet", "The time facet", "The validation facet"]],
    ],
  },
  {
    unit: 5, eo: "EO 5.3.1", section: "5.3", level: "L1", keyword: "typical RE process",
    explanationJa: "typical configurations include participatory、contractual、product-oriented RE and differ in facets and work products",
    variants: [
      ["Which typical RE process is commonly iterative, explorative, and market-oriented?", "A product-oriented RE process", ["A contractual RE process", "A participatory customer-specific process", "A prescriptive acceptance process"]],
      ["Which work product is particularly characteristic of a contractual RE setting?", "A classic system requirements specification used as an agreed contractual basis", ["A continuously reprioritized market backlog", "Only disposable exploratory prototypes", "Only informal stakeholder conversations"]],
    ],
  },
  {
    unit: 5, eo: "EO 5.3.2", section: "5.3", level: "L2", keyword: "process configuration steps",
    explanationJa: "process構成はinfluencing factors分析、facet評価、process構成、work product決定、practice選択の順で進める",
    variants: [
      ["What should be done first when configuring an RE process for a specific project?", "Analyze the relevant influencing factors", ["Select the RE tool", "Choose the final work-product template", "Freeze the initial requirements"]],
      ["After the process facets have been configured, what should the team determine before selecting detailed practices?", "The work products that the process needs", ["The final implementation architecture", "The release automation platform", "The certification provider"]],
    ],
  },
  {
    unit: 5, eo: "EO 5.3.3", section: "5.3", level: "L3", keyword: "process selection",
    explanationJa: "密なcustomer collaborationにはparticipatory、contract中心にはcontractual、market productにはproduct-orientedを基準にtailorする",
    variants: [
      ["A supplier and customer collaborate weekly, requirements emerge through workshops, and prototypes drive frequent feedback. Which typical configuration is the best starting point?", "Participatory RE", ["Contractual RE", "Product-oriented RE", "Linear prescriptive RE"]],
      ["A software company targets a broad market, releases increments, and learns from usage and market feedback. Which typical configuration is the best starting point?", "Product-oriented RE", ["Contractual RE", "Participatory customer-specific RE", "Linear customer-specific RE"]],
    ],
  },
];

export const calibratedUnit5Questions = makeQuestions(concepts);
