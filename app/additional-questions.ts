import type { Question } from "./data.ts";

type Level = "L1" | "L2" | "L3";
type Variant = readonly [prompt: string, correct: string, distractors: readonly [string, string, string]];
type Concept = {
  unit: number;
  eo: string;
  section: string;
  level: Level;
  keyword: string;
  explanationJa: string;
  variants: readonly [Variant, Variant];
};

function rotateOptions(id: string, correct: string, distractors: readonly string[]) {
  const options = [correct, ...distractors];
  const shift = Array.from(id).reduce((sum, character) => sum + character.charCodeAt(0), 0) % options.length;
  const rotated = [...options.slice(shift), ...options.slice(0, shift)];
  return { options: rotated, correct: [rotated.indexOf(correct)] };
}

function makeQuestion(concept: Concept, variant: Variant, index: number): Question {
  const suffix = index === 0 ? "A" : "B";
  const id = `P${concept.eo.replace(/\D/g, "")}${suffix}`;
  const [prompt, correctAnswer, distractors] = variant;
  const answer = rotateOptions(id, correctAnswer, distractors);
  return {
    id,
    unit: concept.unit,
    eo: concept.eo,
    kind: "single",
    points: concept.level === "L1" ? 1 : concept.level === "L2" ? 2 : 3,
    prompt,
    options: answer.options,
    correct: answer.correct,
    keyword: concept.keyword,
    explanationJa: concept.explanationJa,
    source: `Syllabus 3.3.0 · ${concept.section}`,
  };
}

const concepts: Concept[] = [
  // EU 1
  {
    unit: 1, eo: "EO 1.1.1", section: "1.1", level: "L1", keyword: "requirement",
    explanationJa: "requirementは、構築または変更する対象に対して人や組織が持つニーズ",
    variants: [
      ["A retailer needs same-day order cancellation. What does this need represent in RE terminology?", "A requirement", ["A baseline", "A configuration", "A model type"]],
      ["Which item can the syllabus treat as a system?", "A service that an organization wants to introduce", ["Only compiled software", "Only a physical machine", "Only a requirements document"]],
    ],
  },
  {
    unit: 1, eo: "EO 1.1.2", section: "1.1", level: "L2", keyword: "quality requirement",
    explanationJa: "機能要求は振る舞い、品質要求は性能や信頼性などの品質、制約は解決方法の選択肢を限定",
    variants: [
      ["The search result shall appear within two seconds. What kind of requirement is this?", "A quality requirement", ["A functional requirement", "A stakeholder role", "A configuration"]],
      ["The system shall send a receipt after payment. What kind of requirement is this?", "A functional requirement", ["A quality requirement", "A constraint", "A baseline"]],
    ],
  },
  {
    unit: 1, eo: "EO 1.2.1", section: "1.2", level: "L2", keyword: "value of RE",
    explanationJa: "適切な要求工学は誤ったシステムを作るリスクを下げ、見積りとテストの根拠を作る",
    variants: [
      ["Which RE outcome most directly helps testers decide what behavior to check?", "A clear basis for system testing", ["A guarantee of zero defects", "Automatic source-code generation", "Removal of stakeholder review"]],
      ["Why can adequate RE improve an early cost estimate?", "The required scope and behavior become better understood", ["Every technical choice becomes fixed", "All future changes become impossible", "The team no longer needs assumptions"]],
    ],
  },
  {
    unit: 1, eo: "EO 1.2.2", section: "1.2", level: "L1", keyword: "inadequate RE",
    explanationJa: "要求の欠落・不明確さ・誤りは、着手の焦り、意思疎通の問題、要求は自明という思い込みなどから発生",
    variants: [
      ["A team starts implementation before discussing stakeholder needs. Which problem does this illustrate?", "Rushing straight into building the system", ["Excessive traceability", "Too many baselines", "Overuse of configuration views"]],
      ["Which situation is a typical cause of missing or unclear requirements?", "The parties assume the requirements are self-evident", ["The glossary is maintained", "Requirements are validated repeatedly", "Stakeholders clarify conflicts"]],
    ],
  },
  {
    unit: 1, eo: "EO 1.3.1", section: "1.3", level: "L1", keyword: "requirements occurrence",
    explanationJa: "要求工学はあらゆる種類のシステムに適用でき、system・stakeholder・user・domain・businessの各要求が存在",
    variants: [
      ["Which requirement expresses an organization's goal rather than a particular system behavior?", "A business requirement", ["A system requirement", "A user-interface model", "A version increment"]],
      ["A nurse states what she needs from a medication system. Which perspective does this requirement express?", "A user requirement", ["A configuration requirement", "A process metric", "A document template"]],
    ],
  },
  {
    unit: 1, eo: "EO 1.4.1", section: "1.4", level: "L1", keyword: "major RE tasks",
    explanationJa: "要求工学の主要タスクはelicitation、documentation、validation、managementであり、状況に合わせたプロセス調整が必要",
    variants: [
      ["Which activity belongs to the four major RE tasks?", "Managing requirements through change", ["Compiling source code", "Deploying production servers", "Designing a company logo"]],
      ["Why must an RE process be tailored?", "No single process fits every development and system context", ["Every project uses identical stakeholders", "Tool vendors define the only valid process", "Tailoring prevents all requirement changes"]],
    ],
  },
  {
    unit: 1, eo: "EO 1.5.1", section: "1.5", level: "L1", keyword: "Requirements Engineer",
    explanationJa: "Requirements Engineerは職名に限らず、要求の各活動を担い、問題と解決案の間をつなぐ役割",
    variants: [
      ["Which person may act in the role of Requirements Engineer?", "A product owner who elicits and validates requirements", ["Only someone with that exact job title", "Only the final system user", "Only the tool administrator"]],
      ["What distinctive contribution does a Requirements Engineer make?", "Bridging the gap between a problem and potential solutions", ["Replacing every stakeholder decision", "Preventing all solution discussion", "Writing implementation code only"]],
    ],
  },
  {
    unit: 1, eo: "EO 1.6.1", section: "1.6", level: "L1", keyword: "foundational skill set",
    explanationJa: "基礎知識には原則、文書化、要求の具体化、プロセス、管理、ツール支援が含まれる",
    variants: [
      ["Which topic belongs to the foundational RE skill set?", "How to elaborate requirements with suitable practices", ["How to administer every database product", "How to certify a supplier's finances", "How to implement every programming language"]],
      ["Which capability is part of what a Requirements Engineer needs to learn?", "How to manage existing requirements", ["How to eliminate stakeholder involvement", "How to avoid all documentation", "How to guarantee a fixed solution"]],
    ],
  },

  // EU 2
  {
    unit: 2, eo: "EO 2.1.1", section: "2.1", level: "L1", keyword: "RE principles",
    explanationJa: "9原則は価値志向、ステークホルダー、共通理解、コンテキスト、問題・要求・解決策、妥当性確認、進化、革新、体系的作業",
    variants: [
      ["Which item is one of the nine fundamental RE principles?", "Systematic and disciplined work", ["Permanent requirement freezing", "Tool-first development", "Document maximization"]],
      ["Which principle states that changing requirements are the normal case?", "Evolution", ["Validation", "Value-orientation", "Shared understanding"]],
    ],
  },
  {
    unit: 2, eo: "EO 2.2.1", section: "2.2", level: "L1", keyword: "shared understanding",
    explanationJa: "共通理解には、文書と合意によるexplicitと、共有知識や信頼に基づくimplicitの2つがある",
    variants: [
      ["What is documented and agreed understanding called?", "Explicit shared understanding", ["Implicit shared understanding", "Context boundary", "Solution scope"]],
      ["What can enable implicit shared understanding?", "Previous successful collaboration", ["High team turnover", "Unrecorded conflicting terminology", "Long feedback delays"]],
    ],
  },
  {
    unit: 2, eo: "EO 2.2.2", section: "2.2", level: "L2", keyword: "Problem–Requirement–Solution",
    explanationJa: "問題・要求・解決策は相互に影響するが、考える際にはできるだけ分け、早い妥当性確認と変化への対応を行う",
    variants: [
      ["A prototype reveals a new user need. Which principle explains why solution ideas may lead to new requirements?", "Problem–Requirement–Solution", ["Configuration uniqueness", "Document conformance", "Life-cycle status"]],
      ["Why should a team distinguish problems, requirements, and solutions while discussing them?", "Separation makes the intertwined concerns easier to handle", ["It proves they never influence each other", "It removes the need for innovation", "It fixes the system boundary permanently"]],
    ],
  },

  // EU 3
  {
    unit: 3, eo: "EO 3.1.1", section: "3.1.1", level: "L1", keyword: "work product",
    explanationJa: "作業成果物は目的、表現、規模、寿命で特徴づけられ、単一要求から仕様書、用語集、プロトタイプまで含む",
    variants: [
      ["Which characteristic is used to distinguish RE work products?", "Their purpose", ["Their author's salary", "Their screen color", "Their file-name length"]],
      ["Which item is an RE work product for a coherent set of requirements?", "A use case", ["A compiler warning", "A payroll record", "A network cable"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.1.2", section: "3.1.1", level: "L1", keyword: "work product life span",
    explanationJa: "temporaryは対話用、evolvingは反復的に更新、durableはベースライン化またはリリース済みで変更管理が必要",
    variants: [
      ["A sketch is created for one workshop and discarded afterward. What is its life-span category?", "Temporary work product", ["Evolving work product", "Durable work product", "Released baseline"]],
      ["What characterizes a durable work product?", "It is baselined or released and subject to change control", ["It must be handwritten", "It has no metadata", "It is discarded after discussion"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.1.3", section: "3.1.2–3.1.3", level: "L2", keyword: "abstraction and detail",
    explanationJa: "抽象度は対象と目的に合わせて選び、詳細化によるリスク低減と記述コスト、設計者の自由度を調整",
    variants: [
      ["A large specification contains business goals and component reactions. How should it handle the abstraction difference?", "Separate the levels through an appropriate document structure", ["Mix every level in one list", "Delete all high-level goals", "Convert every item into a prototype"]],
      ["When rapid stakeholder feedback is available, what may be reasonable?", "Leave more detail to later feedback-driven refinement", ["Specify every detail regardless of value", "Remove all stakeholder requirements", "Freeze all solution decisions immediately"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.1.4", section: "3.1.4", level: "L1", keyword: "work product aspects",
    explanationJa: "要求成果物では要求種別、構造とデータ、機能とフロー、状態と振る舞い、コンテキスト、境界を関連づけて扱う",
    variants: [
      ["Which aspect focuses on events and transitions between conditions of a system?", "State and behavior", ["Structure and data", "Function and flow", "Document life span"]],
      ["A user request triggers actions that use stored data. What does this illustrate?", "Different work-product aspects are interrelated", ["Every aspect can be made independent", "Only quality requirements matter", "Context can always be ignored"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.1.5", section: "3.1.5", level: "L1", keyword: "documentation guideline",
    explanationJa: "目的に合う成果物を選び、重複を参照で避け、整合性と用語統一、適切な構造を保つ",
    variants: [
      ["Two documents repeat the same requirement word for word. Which guideline should the team apply?", "Reference the content instead of duplicating it", ["Create a third copy", "Use different terms in every file", "Remove the glossary"]],
      ["Which practice follows the general documentation guidelines?", "Use terms consistently with the glossary", ["Mix synonyms without explanation", "Ignore inconsistency across models", "Choose work products without a purpose"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.1.6", section: "3.1.6", level: "L1", keyword: "work product planning",
    explanationJa: "成果物を早期に計画すると、工数・資源・記法を決め、後の大規模な情報移動や重複を避けられる",
    variants: [
      ["What should a team agree when planning RE work products?", "Which abstraction levels need to be represented", ["Which developer uses the fastest laptop", "Which office hosts the release party", "Which vendor owns the domain"]],
      ["What is a benefit of defining work products early?", "Less reshuffling and final editing later", ["Guaranteed absence of conflicts", "No need for validation", "Automatic stakeholder agreement"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.2.1", section: "3.2", level: "L1", keyword: "natural language",
    explanationJa: "自然言語は柔軟で誰でも読める一方、曖昧さ・欠落・不整合を見つけにくい",
    variants: [
      ["What is a major advantage of natural-language requirements?", "They can express almost any kind of requirement", ["They eliminate every ambiguity", "They enforce one formal syntax", "They always expose omissions automatically"]],
      ["What is a major disadvantage of unconstrained natural language?", "Different readers may interpret the same text differently", ["It cannot describe quality", "It requires a modeling tool", "It is never understood by stakeholders"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.2.2", section: "3.2", level: "L2", keyword: "writing rules",
    explanationJa: "短く構造化した文、統一用語、明確な条件と比較を使い、曖昧語・不特定名詞・不完全な記述を避ける",
    variants: [
      ["Which rewrite best improves 'The system shall respond quickly'?", "The system shall display the result within two seconds after submission", ["The system shall respond appropriately", "Fast responses shall be provided", "The response should be good"]],
      ["A requirement says 'The report shall be better than before.' What is the main defect?", "The comparison is incomplete", ["The sentence is too measurable", "The actor is over-specified", "The requirement is a baseline"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.3.1", section: "3.3", level: "L1", keyword: "template category",
    explanationJa: "phrase templateは文、form templateは定型フィールド、document templateは文書全体の構造を規定",
    variants: [
      ["Which template category provides predefined fields for a use case?", "A form template", ["A phrase template", "A document template", "A context diagram"]],
      ["What is a risk of template-based documentation?", "Authors may focus on filling fields instead of content quality", ["It cannot create uniform results", "It never omits an aspect", "It forbids reusable structures"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.3.2", section: "3.3", level: "L3", keyword: "phrase template",
    explanationJa: "個別要求は条件・主体・動作・対象を明確にし、user storyは役割・望み・価値を区別して記述",
    variants: [
      ["Which sentence best follows a clear individual-requirement phrase structure?", "When payment succeeds, the shop system shall send the customer a receipt", ["Receipts and successful payments", "There should be a suitable receipt", "Sending is performed quickly"]],
      ["Which user story has role, need, and value?", "As a warehouse clerk, I want to scan a parcel so that I can register it without typing an ID", ["The system shall use scanners", "Scanning parcels is useful", "As a user, the database is fast"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.3.3", section: "3.3", level: "L3", keyword: "use case template",
    explanationJa: "use caseのフォームには、主体、事前条件、トリガー、通常フロー、代替フロー、結果などを対応づけて記録",
    variants: [
      ["Where should a failed-card path be recorded in a use-case form?", "As an alternative or exception flow", ["As the primary actor", "As the system boundary", "As a glossary synonym"]],
      ["Which field states what must already hold before a use case starts?", "Precondition", ["Postcondition", "Trigger", "Priority"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.4.1", section: "3.4.1", level: "L2", keyword: "model",
    explanationJa: "modelは現実または作る対象の一部を抽象化し、特定の側面に集中して関係や全体像を理解しやすくする",
    variants: [
      ["Why can a model reduce cognitive load?", "It focuses on selected aspects and abstracts from others", ["It reproduces every detail of reality", "It removes all relationships", "It guarantees stakeholder agreement"]],
      ["How may a model support validation of textual requirements?", "By exposing omissions, ambiguities, or inconsistencies", ["By replacing every stakeholder", "By fixing every quality requirement", "By approving a baseline automatically"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.4.2", section: "3.4.1", level: "L2", keyword: "model limitation",
    explanationJa: "モデルは関係と概要を示しやすいが、異なるモデル間の整合維持や品質要求・制約の表現には限界がある",
    variants: [
      ["Which information is often difficult to express economically in a functional model?", "A detailed quality requirement", ["A control-flow branch", "A domain class relationship", "An external actor"]],
      ["Why are models often combined with natural language?", "Restricted modeling syntax cannot express every relevant detail", ["Natural language has formal semantics", "Models cannot show relationships", "Text automatically keeps models consistent"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.4.3", section: "3.4", level: "L1", keyword: "modeling terminology",
    explanationJa: "modelは対象の抽象表現、modeling languageはモデルを記述する構文と意味の規則",
    variants: [
      ["What is the part of reality represented by a model called?", "The original", ["The baseline", "The increment", "The view"]],
      ["Which diagram expresses a UML state machine?", "A state machine diagram", ["A class diagram", "A context diagram", "A story map"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.4.4", section: "3.4.2–3.4.5", level: "L2", keyword: "model selection",
    explanationJa: "対象の側面に合わせ、外部関係はcontext、構造とデータはclass、処理フローはactivity、状態依存動作はstate machineを選ぶ",
    variants: [
      ["Which model best shows an order moving through actions and decision branches?", "An activity model", ["A class model", "A glossary", "A requirements configuration"]],
      ["Which model best shows how a device reacts differently in Locked and Unlocked states?", "A state machine", ["A context model", "A document template", "A priority matrix"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.4.5", section: "3.4.2–3.4.5", level: "L2", keyword: "model interpretation",
    explanationJa: "図の種類と要素の意味を読み分け、actor・class・action・stateなどから要求を解釈",
    variants: [
      ["In a context diagram, what does a line between an external actor and the system usually indicate?", "An interface or interaction across the system boundary", ["A version history", "A class inheritance rule", "A requirement priority"]],
      ["In an activity diagram, a decision node has two guarded outgoing paths. What does it represent?", "Alternative control flows selected by conditions", ["Two versions of one work product", "Two external stakeholders", "Two glossary definitions"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.4.6", section: "3.4.3", level: "L3", keyword: "UML class diagram",
    explanationJa: "class diagramでは、対象をclass、性質をattribute、関係をassociationと多重度で表す",
    variants: [
      ["A library member may borrow many books, while a book is borrowed by at most one member at a time. What should the class diagram include?", "An association between Member and Book with suitable multiplicities", ["An activity decision between Member and Book", "A state transition named Member", "A context boundary around Book"]],
      ["Where should 'emailAddress' appear when modeling a Customer's stored data?", "As an attribute of the Customer class", ["As an external actor", "As an activity fork", "As a baseline"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.4.7", section: "3.4.4", level: "L3", keyword: "UML activity diagram",
    explanationJa: "activity diagramではaction、制御フロー、分岐・合流、開始・終了、必要に応じて担当者を表す",
    variants: [
      ["A refund is approved only when the amount is below a limit. Which activity-diagram element expresses this condition?", "A decision node with guarded outgoing flows", ["A class attribute", "A context actor", "A version number"]],
      ["How should two independent checks that can run at the same time be modeled?", "With a fork into parallel activity flows", ["With a glossary synonym", "With a single class association", "With a baseline reset"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.5.1", section: "3.5", level: "L2", keyword: "glossary",
    explanationJa: "用語集は中央管理し、担当者を置き、関係者と合意し、同義語と同音異義語を明示して継続更新",
    variants: [
      ["Two departments use 'client' and 'customer' for the same role. What should the glossary record?", "That the terms are synonyms and which preferred term to use", ["Two unrelated definitions", "A new system boundary", "A separate baseline for each word"]],
      ["Which rule supports an effective project glossary?", "Make it accessible and mandatory for everyone involved", ["Let every team keep a private definition", "Freeze it at project start", "Exclude stakeholder agreement"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.6.1", section: "3.6", level: "L1", keyword: "requirements document",
    explanationJa: "代表的な仕様文書はbusiness・stakeholder・user・system requirements specificationとvision document",
    variants: [
      ["Which document focuses on what users want from their perspective?", "A User Requirements Specification", ["A version history", "A configuration report", "A class model legend"]],
      ["Which item is an alternative documentation structure rather than a classic requirements specification document?", "A product backlog", ["A System Requirements Specification", "A Vision Document", "A Business Requirements Specification"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.6.2", section: "3.6", level: "L2", keyword: "documentation structure",
    explanationJa: "文書構造は開発プロセス、開発種別・分野、契約、規模に合わせて選び、保守可能なまとまりを作る",
    variants: [
      ["A customer contract prescribes a specific specification structure. Which selection factor is decisive?", "The contract", ["The monitor size", "The test environment color", "The number of synonyms"]],
      ["Why does a large requirements document need a defined internal structure?", "To keep the collection consistent and maintainable", ["To make every requirement longer", "To eliminate metadata", "To avoid all models"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.7.1", section: "3.7", level: "L1", keyword: "prototype",
    explanationJa: "wireframeは低忠実度、mock-upは画面と遷移、native prototypeは動作可能な重要部分、evolutionary prototypeは製品の核として成長",
    variants: [
      ["Which prototype is a clickable screen flow without real business functionality?", "A mock-up", ["A wireframe", "A native prototype", "An evolutionary prototype"]],
      ["Which prototype is intended to become the core of the final system?", "An evolutionary prototype", ["A discarded exploratory prototype", "A paper wireframe", "A requirements baseline"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.8.1", section: "3.8", level: "L1", keyword: "single-requirement quality",
    explanationJa: "単一要求ではadequateとunderstandableが最重要で、necessary、unambiguous、complete、verifiableも推奨基準",
    variants: [
      ["Which quality criterion asks whether a requirement describes a true and agreed stakeholder need?", "Adequate", ["Modifiable", "Traceable", "Conformant"]],
      ["A requirement has no observable acceptance condition. Which quality criterion is weakest?", "Verifiable", ["Non-redundant", "Consistent", "Baselined"]],
    ],
  },
  {
    unit: 3, eo: "EO 3.8.2", section: "3.8", level: "L1", keyword: "work-product quality",
    explanationJa: "複数要求を含む成果物には、単一要求の基準に加えてconsistent、non-redundant、complete、modifiable、traceable、conformantを適用",
    variants: [
      ["Two requirements prescribe incompatible refund limits. Which work-product criterion is violated?", "Consistent", ["Traceable", "Modifiable", "Conformant"]],
      ["The same rule appears in four places with minor wording differences. Which criterion is at risk?", "Non-redundant", ["Adequate", "Verifiable", "Necessary"]],
    ],
  },

  // EU 4
  {
    unit: 4, eo: "EO 4.1.1", section: "4.1", level: "L3", keyword: "system boundary",
    explanationJa: "system boundaryは対象とcontextの境界、context boundaryは要求に関係する環境と無関係な外界の境界",
    variants: [
      ["A payment service is external but exchanges authorization data with the system. Where should it be placed?", "In the system context, outside the system boundary", ["Inside the system as a required component", "Outside the context boundary", "Inside the requirements document"]],
      ["Weather has no effect on an indoor payroll system or its requirements. Where is it likely located?", "Beyond the context boundary", ["Inside the system boundary", "At an external system interface", "Inside the product backlog"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.1.2", section: "4.1", level: "L1", keyword: "requirements source",
    explanationJa: "要求の情報源はstakeholder、document、systemの3種類で、既存システム、法令、業務文書、市場情報も対象",
    variants: [
      ["Which item is a document source for requirements?", "A regulation that the future system must satisfy", ["A compiled binary only", "An unconnected office device", "A color chosen at random"]],
      ["Why should an existing legacy system be examined during elicitation?", "It can reveal behavior and implicit requirements not stated by stakeholders", ["It automatically defines the final solution", "It replaces all stakeholder input", "It guarantees complete requirements"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.1.3", section: "4.1", level: "L3", keyword: "stakeholder list",
    explanationJa: "ステークホルダーは役割と人物を継続的に特定し、連絡先、可用性、重要度、専門性、目標・利害を一覧化",
    variants: [
      ["Which entry belongs in a useful stakeholder list?", "The stakeholder's role, availability, expertise, and project interests", ["Only the person's initials", "Only the chosen solution", "Only the team's sprint number"]],
      ["Thousands of anonymous consumers will use a product. How should their stakeholder role be represented?", "Define relevant user groups and personas", ["Omit consumers because names are unknown", "List only the developer", "Treat the product as its own stakeholder"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.1.4", section: "4.1", level: "L2", keyword: "stakeholder management",
    explanationJa: "stakeholder relationship managementは権利・義務、参加方法、ニーズの扱いを明確にし、関係上の問題を抑える",
    variants: [
      ["What problem can stakeholder relationship management reduce?", "Unclear rights, obligations, and neglected needs", ["All requirement volatility", "Every technical defect", "Every modeling limitation"]],
      ["Why is stakeholder identification a continuous activity?", "Relevant roles and people can change during development", ["A stakeholder list must never be updated", "Only end users influence requirements", "The system boundary replaces stakeholder analysis"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.2.1", section: "4.2", level: "L2", keyword: "Kano model",
    explanationJa: "Kano modelはdelighter、satisfier、dissatisfierを区別し、明示ニーズだけでなく暗黙・潜在ニーズも探る",
    variants: [
      ["Users expect secure login but rarely mention it because they consider it obvious. How does Kano classify it?", "A dissatisfier", ["A delighter", "A satisfier", "A baseline"]],
      ["A novel feature unexpectedly excites customers. How does Kano classify it?", "A delighter", ["A dissatisfier", "A mandatory constraint", "A requirements configuration"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.2.2", section: "4.2", level: "L2", keyword: "elicitation technique category",
    explanationJa: "gathering techniquesは既存の情報源から要求を集め、design and idea-generating techniquesは新しい解決案やdelighterを生む",
    variants: [
      ["Which activity is a design and idea-generating technique?", "Brainstorming new ways to solve the user's problem", ["Reading an existing regulation", "Interviewing a known operator", "Observing the current workflow"]],
      ["What is the main purpose of gathering techniques?", "Investigate sources to elicit satisfiers and dissatisfiers", ["Guarantee innovative delighters only", "Choose a version number", "Approve a baseline"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.2.3", section: "4.2", level: "L2", keyword: "technique selection",
    explanationJa: "手法はシステム種別、開発ライフサイクル、関係者、組織状況に合わせ、複数手法を組み合わせる",
    variants: [
      ["Operators cannot explain a highly habitual physical task. Which technique is a strong starting point?", "Observation in the work environment", ["A final baseline review", "A priority vote", "Version numbering"]],
      ["Why is combining elicitation techniques often effective?", "Different techniques reveal different kinds of requirements and source knowledge", ["One technique always produces complete requirements", "Combination removes the need for stakeholders", "Every technique has identical strengths"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.3.1", section: "4.3", level: "L1", keyword: "conflict type",
    explanationJa: "代表的な衝突はsubject matter、data、interest、value、relationship、structural conflict",
    variants: [
      ["Two stakeholders want the same budget allocated to different features. What type of conflict is most likely?", "An interest conflict", ["A data conflict", "A relationship conflict", "A modeling conflict"]],
      ["Two reports provide incompatible figures for the same market size. What type of conflict is this?", "A data conflict", ["A value conflict", "A structural conflict", "A baseline conflict"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.3.2", section: "4.3", level: "L2", keyword: "conflict resolution activities",
    explanationJa: "衝突解決はidentification、analysis、resolution、決定内容のdocumentationの順で扱う",
    variants: [
      ["After recognizing a conflict, what should happen before selecting a resolution?", "Analyze its nature and the stakeholders' attitudes", ["Delete both requirements", "Freeze the specification", "Choose a tool vendor"]],
      ["Why must the result of conflict resolution be documented?", "To preserve the decision and its agreed basis", ["To prevent any future change", "To replace stakeholder agreement", "To create a prototype automatically"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.3.3", section: "4.3", level: "L2", keyword: "conflict resolution technique",
    explanationJa: "合意、妥協、投票、権限による決定、複数案の定義を、衝突種別と状況に応じて選ぶ",
    variants: [
      ["Two equally supported alternatives cannot both be funded, and the group accepts a majority decision. Which technique fits?", "Voting", ["Definition of variants", "Observation", "Prototyping"]],
      ["Two customer segments need incompatible workflows, but separate product editions are feasible. Which technique fits?", "Definition of variants", ["Overruling without analysis", "Deleting both needs", "Ignoring the conflict"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.4.1", section: "4.4", level: "L2", keyword: "validation value",
    explanationJa: "要求を早期に妥当性確認すると、後工程の無駄を減らし、関係者ニーズとの不一致を実装前に発見",
    variants: [
      ["Why validate requirements before implementation?", "Defects found early avoid costly downstream rework", ["Validation permanently freezes scope", "It replaces elicitation", "It guarantees market success"]],
      ["What is checked during requirements validation?", "The quality of work products and the individual requirements they contain", ["Only source-code performance", "Only tool configuration", "Only version numbers"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.4.2", section: "4.4", level: "L1", keyword: "validation aspects",
    explanationJa: "重要な観点は正しい関係者の参加、欠陥発見と修正の分離、複数視点、繰り返し実施",
    variants: [
      ["Which practice is one of the four important validation aspects?", "Validate repeatedly rather than only once", ["Use only one viewpoint", "Correct defects while hiding their identification", "Exclude affected stakeholders"]],
      ["Why separate defect identification from defect correction during validation?", "It keeps the review focused on finding and understanding defects first", ["It prevents defects from being corrected", "It eliminates the need for decisions", "It turns validation into elicitation"]],
    ],
  },
  {
    unit: 4, eo: "EO 4.4.3", section: "4.4", level: "L2", keyword: "validation technique",
    explanationJa: "validation techniqueはwalkthrough・inspectionなどのreviewと、prototype・各種test・MVPなどのexploratoryに分類",
    variants: [
      ["A safety-critical specification needs a formal audit trail. Which technique is most suitable?", "A structured inspection", ["An informal hallway conversation", "A logo survey", "A random tool demo"]],
      ["Stakeholders cannot judge a written interaction requirement. Which validation technique can make it tangible?", "Explore it with a prototype", ["Assign a version number", "Create a baseline without review", "Sort requirements alphabetically"]],
    ],
  },

  // EU 5
  {
    unit: 5, eo: "EO 5.1.1", section: "5.1", level: "L1", keyword: "influencing factor",
    explanationJa: "REプロセスには全体プロセス、開発状況、関係者の能力と可用性、共通理解、複雑性・重要性、制約、時間・予算、変動性、経験が影響",
    variants: [
      ["Which factor directly influences the configuration of an RE process?", "The volatility of requirements", ["The alphabetical order of requirements", "The office wall color", "The font used in email"]],
      ["Which stakeholder-related factor must be analyzed?", "Stakeholder capability and availability", ["Stakeholder screen resolution", "Stakeholder commute distance only", "Stakeholder preferred file icon"]],
    ],
  },
  {
    unit: 5, eo: "EO 5.1.2", section: "5.1", level: "L2", keyword: "process constraint",
    explanationJa: "影響要因は選べるプロセスを制約する。継続的な関係者フィードバックが必要な進め方は関係者が継続参加できる場合に限る",
    variants: [
      ["Stakeholders are available only at project start. Which process choice becomes risky?", "An iterative process that depends on continuous stakeholder feedback", ["An early intensive elicitation phase", "A documented approval step", "A versioning concept"]],
      ["A system is highly safety-critical. What process effect is reasonable?", "More rigorous documentation and validation", ["Less traceability", "No status model", "Fewer relevant stakeholders"]],
    ],
  },
  {
    unit: 5, eo: "EO 5.2.1", section: "5.2", level: "L2", keyword: "process facets",
    explanationJa: "3つのfacetはtimeのlinear/iterative、purposeのprescriptive/explorative、targetのcustomer-specific/market-oriented",
    variants: [
      ["Which facet distinguishes binding requirements from requirements that must be explored?", "The purpose facet", ["The time facet", "The target facet", "The version facet"]],
      ["Which facet distinguishes a product for a market from a system ordered by one customer?", "The target facet", ["The purpose facet", "The time facet", "The quality facet"]],
    ],
  },
  {
    unit: 5, eo: "EO 5.3.1", section: "5.3", level: "L1", keyword: "typical RE process",
    explanationJa: "典型構成はparticipatory、contractual、product-orientedで、facetと成果物・情報の流れが異なる",
    variants: [
      ["Which process is typically iterative, explorative, and market-oriented?", "A product-oriented RE process", ["A contractual RE process", "A linear approval process", "A baseline-only process"]],
      ["Which work product is typical of a contractual RE process?", "A classic system requirements specification", ["Only disposable wireframes", "Only an unprioritized idea list", "Only informal conversations"]],
    ],
  },
  {
    unit: 5, eo: "EO 5.3.2", section: "5.3", level: "L2", keyword: "process configuration steps",
    explanationJa: "構成手順は影響要因分析、facet基準評価、プロセス構成、成果物決定、適切なpractice選択",
    variants: [
      ["What is the first recommended step when configuring an RE process?", "Analyze the influencing factors", ["Select a tool", "Freeze every requirement", "Copy the previous process"]],
      ["After configuring the process facets, what should the team determine next?", "The work products to use", ["The final source code", "The certification body", "The office layout"]],
    ],
  },
  {
    unit: 5, eo: "EO 5.3.3", section: "5.3", level: "L3", keyword: "process selection",
    explanationJa: "顧客との密な協働はparticipatory、契約仕様中心はcontractual、市場向け製品はproduct-orientedを基準に調整",
    variants: [
      ["A supplier and customer collaborate weekly, requirements emerge, and prototypes drive feedback. Which configuration fits best?", "Participatory RE", ["Contractual RE", "Linear market RE", "Baseline-only RE"]],
      ["A product company targets anonymous users and learns from releases. Which configuration fits best?", "Product-oriented RE", ["Contractual RE", "Prescriptive customer-specific RE", "One-phase RE"]],
    ],
  },

  // EU 6
  {
    unit: 6, eo: "EO 6.1.1", section: "6.1", level: "L1", keyword: "requirements management",
    explanationJa: "requirements managementは既存要求の保存、変更、追跡を行い、各役割が効率よく利用できる状態を保つ",
    variants: [
      ["Which activity is part of requirements management?", "Tracing an existing requirement to related work products", ["Discovering every initial stakeholder", "Generating production code", "Choosing an elicitation interview room"]],
      ["Why is requirements management needed?", "Requirements must remain usable while they evolve", ["Requirements never change", "Only tools can read requirements", "It replaces validation"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.2.1", section: "6.2", level: "L2", keyword: "requirements life cycle",
    explanationJa: "life cycle modelは許可する状態と遷移を定義し、各成果物の現在状態と通常は遷移履歴を明確にする",
    variants: [
      ["A requirement moves from Draft to Reviewed to Agreed. What defines the allowed states and transitions?", "A life cycle model", ["A context model", "A phrase template", "A persona"]],
      ["Why record a requirement's current life-cycle status?", "People need to know whether it is ready for their work", ["To eliminate version history", "To make every requirement durable", "To prevent all refinement"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.3.1", section: "6.3", level: "L2", keyword: "versioning concept",
    explanationJa: "versioning conceptには一意な版番号、変更履歴、成果物の保存方法が必要",
    variants: [
      ["Which set is essential for requirements version control?", "Version identifiers, a change history, and a storage concept", ["Priorities, personas, and prototypes", "Actors, states, and actions", "Goals, costs, and office roles"]],
      ["Why create a new version after changing a work product?", "To trace its evolution and restore an earlier state", ["To avoid recording the change", "To make every version a baseline", "To remove unique identification"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.4.1", section: "6.4", level: "L1", keyword: "configuration and baseline",
    explanationJa: "configurationは特定目的の整合した成果物集合で各成果物は最大1版、baselineは安定し変更管理されたconfiguration",
    variants: [
      ["A review package contains one chosen version of each related work product. What is it?", "A requirements configuration", ["A stakeholder list", "An elicitation plan", "A phrase template"]],
      ["What distinguishes a baseline from an ordinary configuration?", "It is stable and change-controlled", ["It contains every historical version", "It has no specific purpose", "It can change without control"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.5.1", section: "6.5", level: "L1", keyword: "requirements attribute",
    explanationJa: "attributeは状態、担当、優先度などのmetadataを保持し、関係者が必要な要求情報を取得できるようにする",
    variants: [
      ["Which item is suitable as a requirement attribute?", "The requirement's owner", ["An unrelated employee hobby", "The office temperature", "A random diagram color"]],
      ["What is the main purpose of requirement attributes?", "Provide metadata needed during the project or product life cycle", ["Replace the requirement text", "Eliminate traceability", "Fix the system boundary"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.5.2", section: "6.5", level: "L2", keyword: "attribute selection",
    explanationJa: "適切な属性集合は、各関係者が答えたい問いとプロジェクト状況から選び、不要な入力負荷を増やさない",
    variants: [
      ["A test manager needs to find approved requirements without linked tests. Which attributes are most useful?", "Approval status and test-case link status", ["Author's favorite color and desk number", "Only paragraph length", "Only document font"]],
      ["How should a project choose its requirement attributes?", "Start from stakeholders' information needs", ["Copy every attribute from a standard", "Record no metadata", "Let each requirement use unrelated fields"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.5.3", section: "6.5", level: "L2", keyword: "requirements view",
    explanationJa: "viewは要求全体から関心対象を抽出し、selectiveは行、projectiveは属性、aggregatingは集計を中心に示す",
    variants: [
      ["A report shows only security requirements. What kind of view is primarily used?", "A selective view", ["A projective view", "An aggregating view", "A baseline view"]],
      ["A dashboard groups requirements by status and displays counts. What kind of view is primarily used?", "An aggregating view", ["A selective view", "A projective view", "A context view"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.6.1", section: "6.6", level: "L1", keyword: "traceability purpose",
    explanationJa: "traceabilityは起源、後続成果物、要求間依存を追い、影響分析、法令順守、情報取得を支援",
    variants: [
      ["Which task is directly supported by requirements traceability?", "Finding tests affected by a changed requirement", ["Choosing a wireframe color", "Replacing stakeholder validation", "Selecting a job title"]],
      ["Why may a regulator demand traceability?", "To demonstrate compliance from obligations through implementation evidence", ["To eliminate requirement identifiers", "To avoid change history", "To prevent all prioritization"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.6.2", section: "6.6", level: "L1", keyword: "implicit traceability",
    explanationJa: "implicit traceabilityは構造と標準化から関係を推測し、explicit traceabilityは一意IDで成果物間リンクを明示",
    variants: [
      ["Requirements and tests use matching section structures but no stored links. What kind of traceability is this?", "Implicit traceability", ["Explicit traceability", "Forward-only traceability", "A baseline"]],
      ["What distinguishes explicit traceability?", "Relationships are recorded between uniquely identified work products", ["Relationships are only assumed from document order", "No identifiers are used", "Only one work product exists"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.6.3", section: "6.6", level: "L1", keyword: "trace representation",
    explanationJa: "explicit traceabilityはhyperlink、reference、matrix、table、graphなどで一意ID間の関係を記録",
    variants: [
      ["Which artifact can document explicit traceability between requirements and tests?", "A traceability matrix", ["An unlabeled sketch", "A private memory", "A random sort order"]],
      ["Which mechanism is an explicit traceability representation?", "A hyperlink from a requirement ID to a test-case ID", ["Similar paragraph positions", "Matching font colors", "An assumed conversation"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.7.1", section: "6.7", level: "L1", keyword: "handling change",
    explanationJa: "linearでは正式なchange requestと委員会判断、iterativeではbacklogへ追加してproduct ownerが優先順位を調整するのが代表例",
    variants: [
      ["In a plan-driven project, who may formally decide an approved requirement change?", "A Change Control Board", ["A random end user", "The diagram renderer", "The glossary alone"]],
      ["How is a new requirement commonly handled in an agile approach?", "Add it to the product backlog and prioritize it", ["Edit a baseline without record", "Ignore its impact", "Freeze the backlog permanently"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.8.1", section: "6.8", level: "L1", keyword: "prioritization criteria",
    explanationJa: "prioritizationは次のreleaseやincrementに重要な要求を選び、business value、urgency、effort、dependencyなどで評価",
    variants: [
      ["Which item is a meaningful requirement-prioritization criterion?", "Business value", ["Sentence length", "Requirement ID alphabet", "Author's keyboard type"]],
      ["Why prioritize requirements?", "Not all requirements can or should be implemented at the same time", ["All requirements have identical importance", "Prioritization removes dependencies", "Only one stakeholder may decide"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.8.2", section: "6.8", level: "L1", keyword: "prioritization steps",
    explanationJa: "目的と制約、評価基準、参加者、対象要求、手法を決めてから優先順位付けを実施",
    variants: [
      ["What should be defined before selecting a prioritization technique?", "The major goals and constraints of prioritization", ["The final implementation code", "A new system boundary", "The prototype fidelity only"]],
      ["Which step identifies whose judgments must contribute to prioritization?", "Define the stakeholders to involve", ["Create a random rank", "Delete low-priority requirements", "Freeze every attribute"]],
    ],
  },
  {
    unit: 6, eo: "EO 6.8.3", section: "6.8", level: "L1", keyword: "prioritization technique",
    explanationJa: "優先順位付け手法は大きくad-hocとanalyticalに分類",
    variants: [
      ["Which pair names the syllabus categories of prioritization techniques?", "Ad-hoc and analytical", ["Linear and iterative", "Explicit and implicit", "Temporary and durable"]],
      ["A team uses a weighted decision matrix for value, risk, and effort. Which category best fits?", "An analytical prioritization technique", ["An ad-hoc technique", "A gathering technique", "A version-control technique"]],
    ],
  },

  // EU 7
  {
    unit: 7, eo: "EO 7.1.1", section: "7.1", level: "L1", keyword: "RE tool type",
    explanationJa: "RE toolsは要求管理、REプロセス管理、知識の文書化、modeling、collaboration、testing/simulationなどを支援",
    variants: [
      ["Which capability belongs to tools for managing requirements?", "Managing versions and configurations", ["Guaranteeing stakeholder agreement", "Eliminating all process decisions", "Writing every requirement automatically"]],
      ["A team needs shared editing and discussion around requirements. Which tool-support type is most relevant?", "Collaboration in RE", ["Requirements simulation only", "Version numbering only", "Source-code compilation"]],
    ],
  },
  {
    unit: 7, eo: "EO 7.2.1", section: "7.2", level: "L2", keyword: "tool introduction",
    explanationJa: "ツール導入前に目的・状況・要求とRE手順・責任を明確化し、総費用、資源、pilot、評価基準、教育を考慮",
    variants: [
      ["What should happen before selecting an RE tool?", "Describe the goals, context, and requirements for tool support", ["Buy the tool with the most features", "Adopt its default process unchanged", "Skip defining RE responsibilities"]],
      ["Why use a pilot project when introducing an RE tool?", "To evaluate fit and reduce introduction risk in a limited scope", ["To avoid user instruction", "To ignore life-cycle costs", "To guarantee organization-wide success"]],
    ],
  },
];

export const additionalQuestions: Question[] = concepts.flatMap((concept) =>
  concept.variants.map((variant, index) => makeQuestion(concept, variant, index)),
);
