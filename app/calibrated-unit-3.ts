import { makeQuestions, type Concept } from "./calibrated-question-builder.ts";

const concepts: Concept[] = [
  {
    unit: 3, eo: "EO 3.1.1", section: "3.1.1", level: "L1", keyword: "work product",
    explanationJa: "work productは要求工学で作成または利用する成果物で、目的、表現、規模、life spanなどで特徴づけられる",
    variants: [
      ["Which characteristic is useful for distinguishing different RE work products?", "Their purpose in the RE process", ["The organizational rank of the author", "The order in which their file names sort", "The visual theme used by the editing tool"]],
      ["Which item is an RE work product that can capture a coherent set of requirements?", "A use case", ["A source-code build artifact", "A deployment log", "A hardware inventory record"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.1.2", section: "3.1.1", level: "L1", keyword: "work product life span",
    explanationJa: "temporaryは短期利用、evolvingは反復的に更新、durableはbaseline化またはreleaseされchange controlの対象となる",
    variants: [
      ["A sketch is used during one elicitation workshop and intentionally discarded afterwards. Which life-span category fits best?", "Temporary work product", ["Evolving work product", "Durable work product", "Baselined work product"]],
      ["Which characteristic best distinguishes a durable work product?", "It has been baselined or released and is subject to controlled change", ["It is updated informally after every conversation", "It is expected to be discarded after one workshop", "It contains only high-level requirements"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.1.3", section: "3.1.2–3.1.3", level: "L2", keyword: "abstraction and detail",
    explanationJa: "抽象度と詳細度は目的、risk、feedbackの得やすさ、記述コスト、設計自由度を考えて選ぶ",
    variants: [
      ["A specification mixes business goals, user needs, and component reactions in one unstructured list. What is the best improvement?", "Structure the work product so that different abstraction levels are distinguishable", ["Rewrite every item at the most detailed level", "Remove the high-level goals and keep only system behavior", "Represent every item as a prototype instead of text"]],
      ["Stakeholders can review working increments every week and uncertainty is high. What may be reasonable for low-risk details?", "Defer some detail until it can be refined through rapid feedback", ["Specify every possible detail before the first feedback", "Freeze the solution architecture before clarifying needs", "Remove stakeholder requirements once development starts"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.1.4", section: "3.1.4", level: "L1", keyword: "work product aspects",
    explanationJa: "要求成果物のaspectsにはstructure/data、function/flow、state/behavior、contextなどがあり相互に関係する",
    variants: [
      ["Which aspect primarily describes how a system reacts differently depending on its current condition?", "State and behavior", ["Structure and data", "Function and flow", "System context"]],
      ["A user action starts a process that reads and updates stored business objects. What does this illustrate?", "Different work-product aspects are interrelated", ["Each aspect can be specified independently without consistency concerns", "Only the function-and-flow aspect is relevant", "The context aspect replaces structure-and-data modeling"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.1.5", section: "3.1.5", level: "L1", keyword: "documentation guideline",
    explanationJa: "目的に合う成果物を選び、重複はreferenceで減らし、用語と内容の整合性を保つ",
    variants: [
      ["The same requirement is copied into three specifications. Which documentation guideline best reduces the resulting consistency risk?", "Keep one authoritative statement and reference it from the other work products", ["Maintain the copies independently", "Use different terminology in each copy", "Convert one copy into a different requirement type"]],
      ["Which practice best supports consistency across RE work products?", "Use project terms according to the agreed glossary", ["Allow each document to define its own synonyms", "Resolve terminology only after implementation", "Use different terms to distinguish document authors"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.1.6", section: "3.1.6", level: "L1", keyword: "work product planning",
    explanationJa: "work productを早期に計画し、必要な抽象度、形式、責任、情報の流れを決めると後の再構成を減らせる",
    variants: [
      ["Which decision belongs to planning the RE work products for a project?", "Which abstraction levels and representations are needed for the intended readers", ["Which developer will implement each component", "Which deployment environment will be used for production", "Which supplier will provide office hardware"]],
      ["What is a likely benefit of planning the main work products early?", "Less later restructuring and duplication of requirements information", ["Conflicts between stakeholders can no longer occur", "Validation can be omitted because structure is predefined", "Every requirement becomes complete when first documented"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.2.1", section: "3.2", level: "L1", keyword: "natural language",
    explanationJa: "natural languageは柔軟で多くの関係者が読める一方、曖昧さや複数解釈を生みやすい",
    variants: [
      ["What is a major advantage of documenting requirements in natural language?", "It can express a wide variety of requirement types in a form many stakeholders can read", ["It gives every sentence a formal, mathematically precise semantics", "It prevents omissions through syntax rules", "It makes consistency checking automatic"]],
      ["What is a major risk of unconstrained natural-language requirements?", "Different readers may assign different meanings to the same statement", ["Quality requirements cannot be expressed", "Stakeholders must learn a modeling notation before reading them", "The statements cannot be combined with models"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.2.2", section: "3.2", level: "L2", keyword: "writing rules",
    explanationJa: "自然言語要求では主体、条件、動作、対象を明確にし、曖昧語、不完全な比較、不明確な参照を避ける",
    variants: [
      ["Which rewrite best improves the requirement 'The system shall respond quickly' for verifiability?", "The system shall display the search result within two seconds after the user submits a query", ["The system shall display the result with good performance", "The result shall be returned as soon as reasonably possible", "The system should respond faster than usual"]],
      ["A requirement says, 'The new report shall be easier to use than the old one.' What is the most direct wording problem?", "The comparison lacks a defined, measurable criterion", ["The requirement contains too much quantitative detail", "The subject of the sentence is too specific", "The requirement should be represented only as a model"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.3.1", section: "3.3", level: "L1", keyword: "template category",
    explanationJa: "phrase templateは文構造、form templateは定型field、document templateは文書全体の構造を支援する",
    variants: [
      ["Which template type is most suitable for recording predefined fields such as actor, precondition, trigger, and main flow?", "A form template", ["A phrase template", "A document template", "A modeling language"]],
      ["Which risk can arise from using templates mechanically?", "Authors may concentrate on filling the prescribed structure instead of evaluating the content", ["Templates necessarily produce inconsistent work products", "Templates prevent repeated structures from being reused", "Templates make stakeholder review impossible"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.3.2", section: "3.3", level: "L3", keyword: "phrase template",
    explanationJa: "個別要求は条件、主体、動作、対象を明確にし、user storyはrole、need、valueを区別して書く",
    variants: [
      ["Which statement best follows a clear phrase structure for an individual functional requirement?", "When payment is confirmed, the shop system shall send a receipt to the customer", ["After payment, a receipt should normally be available", "The customer receives appropriate payment information", "Receipt generation shall be handled efficiently"]],
      ["Which statement contains the role, need, and value elements of a user story?", "As a warehouse clerk, I want to scan a parcel so that I can register it without typing its identifier", ["As a user, I want the system to use a scanner", "The warehouse system shall scan parcel identifiers", "Scanning parcels quickly is valuable for warehouse staff"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.3.3", section: "3.3", level: "L3", keyword: "use case template",
    explanationJa: "use case formではactor、precondition、trigger、main flow、alternative/exception flow、postconditionなどを区別する",
    variants: [
      ["During checkout, an invalid card causes the system to request another payment method. Where should this behavior be documented in a use-case form?", "As an alternative or exception flow", ["As a precondition", "As the primary actor", "As a postcondition"]],
      ["Which use-case field describes a condition that must already be true before the use case can start?", "Precondition", ["Postcondition", "Trigger", "Alternative flow"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.4.1", section: "3.4.1", level: "L2", keyword: "model",
    explanationJa: "modelは対象の一部を抽象化して特定aspectに集中し、関係や欠落を見つけやすくする",
    variants: [
      ["Why can a requirements model make a complex problem easier to reason about?", "It deliberately focuses on selected aspects and abstracts from others", ["It reproduces all details of reality in one representation", "It removes the need to maintain relationships between work products", "It guarantees a single interpretation for every stakeholder"]],
      ["How can a model help validate requirements that were originally written as text?", "It can reveal missing, inconsistent, or ambiguous information through another representation", ["It proves that every textual requirement is necessary", "It replaces stakeholder review with formal notation", "It automatically selects the correct solution"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.4.2", section: "3.4.1", level: "L2", keyword: "model limitation",
    explanationJa: "モデルは関係や構造を示しやすいが、すべてのdetail、quality requirement、constraintを一つの記法で経済的に表現できるわけではない",
    variants: [
      ["Which content is often less economical to express in a primarily functional behavior model?", "A detailed performance or reliability requirement", ["A sequence of actions", "A branch in control flow", "A transition between states"]],
      ["Why are requirements models often combined with natural-language statements?", "A restricted modeling syntax may not express every relevant detail or constraint efficiently", ["Natural language has more formal semantics than models", "Models cannot represent relationships between elements", "Text automatically keeps different models consistent"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.4.3", section: "3.4", level: "L1", keyword: "modeling terminology",
    explanationJa: "modelはoriginalの抽象表現で、modeling languageはmodelを記述するsyntaxとsemanticsを定める",
    variants: [
      ["In modeling terminology, what is the part of reality that a model represents called?", "The original", ["The view", "The baseline", "The configuration"]],
      ["Which diagram type is used to express states and transitions in a UML state machine model?", "A state machine diagram", ["A class diagram", "An activity diagram", "A context diagram"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.4.4", section: "3.4.2–3.4.5", level: "L2", keyword: "model selection",
    explanationJa: "目的に応じてcontext、class、activity、state machineなどを選び、表したいaspectに合うmodelを使う",
    variants: [
      ["Which model is most suitable for showing an order-processing workflow with actions, branches, and parallel paths?", "An activity model", ["A class model", "A context model", "A state-machine model"]],
      ["Which model is most suitable for showing how a door controller reacts differently in Locked, Unlocked, and Alarm states?", "A state machine", ["An activity model", "A class model", "A context model"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.4.5", section: "3.4.2–3.4.5", level: "L2", keyword: "model interpretation",
    explanationJa: "図の種類とelementのsemanticsを読み分け、interface、association、control flow、state transitionなどを解釈する",
    variants: [
      ["In a context model, what does a relationship crossing the system boundary typically represent?", "An interface or interaction between the system and an external context element", ["An internal class association", "A requirement version relationship", "A prioritization dependency"]],
      ["In an activity diagram, two guarded outgoing flows leave a decision node. What do they represent?", "Alternative control paths selected according to conditions", ["Two versions of the same action", "Two external systems connected through an interface", "Two states that must be active simultaneously"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.4.6", section: "3.4.3", level: "L3", keyword: "UML class diagram",
    explanationJa: "class diagramではdomain objectをclass、性質をattribute、関係をassociationとmultiplicityで表す",
    variants: [
      ["A member can borrow several books, while a book can be on loan to at most one member at a time. How should this relationship be represented in a class diagram?", "An association between Member and Book with appropriate multiplicities", ["An inheritance relation between Member and Book", "A state transition from Member to Book", "An activity flow from Member to Book"]],
      ["When modeling stored customer data, how should emailAddress normally be represented?", "As an attribute of the Customer class", ["As an association to an external actor", "As an operation on a context boundary", "As a state of the Customer class"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.4.7", section: "3.4.4", level: "L3", keyword: "UML activity diagram",
    explanationJa: "activity diagramではaction、control flow、decision/merge、fork/joinなどで処理の流れを表す",
    variants: [
      ["A refund follows one path when the amount is below a limit and another path otherwise. Which activity-diagram construct best models the choice?", "A decision node with guarded outgoing flows", ["A fork node with parallel outgoing flows", "A class association with multiplicity", "A state with two entry actions"]],
      ["Two independent fraud checks may execute at the same time and both must finish before payment continues. Which activity-diagram structure best represents this?", "A fork into parallel flows followed by a join", ["A decision followed by a merge", "A class hierarchy", "A context boundary with two interfaces"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.5.1", section: "3.5", level: "L2", keyword: "glossary",
    explanationJa: "glossaryは中央管理し、preferred term、synonym、homonymなどを明示し、関係者と合意して継続更新する",
    variants: [
      ["Two departments use 'client' and 'customer' for the same business role. What should the project glossary do?", "Record the synonym relationship and identify the preferred term", ["Maintain separate unrelated definitions for each department", "Create a requirement baseline for each term", "Represent the words as different stakeholder roles"]],
      ["Which practice best supports an effective project glossary?", "Make it accessible to all relevant participants and use it consistently across work products", ["Allow each team to maintain private meanings for common terms", "Freeze the glossary after initial elicitation", "Exclude stakeholders from agreeing domain terminology"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.6.1", section: "3.6", level: "L1", keyword: "requirements document",
    explanationJa: "requirements documents can organize business, stakeholder, user, and system requirements; product backlogなど別構造もあり得る",
    variants: [
      ["Which document primarily captures what users need from their perspective?", "A User Requirements Specification", ["A Business Requirements Specification", "A System Requirements Specification", "A Vision Document"]],
      ["Which item is an alternative structure for organizing requirements rather than a classic requirements specification document?", "A product backlog", ["A System Requirements Specification", "A Business Requirements Specification", "A User Requirements Specification"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.6.2", section: "3.6", level: "L2", keyword: "documentation structure",
    explanationJa: "文書構造はdevelopment process、domain、contract、sizeなどに合わせ、理解しやすくmaintainableにする",
    variants: [
      ["A customer contract mandates a specific structure and set of sections for the requirements specification. Which factor is decisive for the document structure?", "The contractual constraint", ["The preferred modeling notation", "The number of requirement attributes", "The chosen elicitation technique"]],
      ["Why should a large requirements specification have a defined internal structure?", "To keep related information findable, consistent, and maintainable", ["To force every requirement to the same abstraction level", "To eliminate the need for attributes and trace links", "To avoid combining textual requirements with models"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.7.1", section: "3.7", level: "L1", keyword: "prototype",
    explanationJa: "wireframe、mock-up、native prototype、evolutionary prototypeはfidelityと目的が異なる",
    variants: [
      ["Which prototype best describes a clickable screen flow that demonstrates navigation but has no real business logic?", "A mock-up", ["A wireframe", "A native prototype", "An evolutionary prototype"]],
      ["Which prototype is intentionally developed so that it can grow into the core of the final system?", "An evolutionary prototype", ["A throwaway exploratory prototype", "A wireframe", "A mock-up"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.8.1", section: "3.8", level: "L1", keyword: "single-requirement quality",
    explanationJa: "単一要求のquality criteriaにはadequate、understandable、necessary、unambiguous、complete、verifiableなどがある",
    variants: [
      ["Which quality criterion asks whether a requirement correctly reflects an actual stakeholder need?", "Adequate", ["Necessary", "Unambiguous", "Verifiable"]],
      ["A requirement says that response time shall be 'acceptable' but provides no observable criterion. Which quality criterion is most clearly violated?", "Verifiable", ["Necessary", "Complete", "Adequate"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.8.2", section: "3.8", level: "L1", keyword: "work-product quality",
    explanationJa: "要求集合にはconsistent、non-redundant、complete、modifiable、traceable、conformantなどのcriteriaも適用する",
    variants: [
      ["Two requirements specify mutually incompatible maximum refund amounts for the same situation. Which work-product quality criterion is violated?", "Consistent", ["Complete", "Traceable", "Modifiable"]],
      ["The same business rule appears repeatedly in slightly different wording across one specification. Which criterion is most at risk?", "Non-redundant", ["Conformant", "Traceable", "Complete"]],
    ],
  },
];

export const calibratedUnit3Questions = makeQuestions(concepts);
