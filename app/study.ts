export type StudyNode = { label: string; title: string; note: string };
export type StudyTerm = { en: string; ja: string; note: string };
export type StudyGuide = {
  unit: number;
  titleJa: string;
  lead: string;
  diagramTitle: string;
  diagram: StudyNode[];
  points: string[];
  terms: StudyTerm[];
  source: string;
};

export const studyGuides: StudyGuide[] = [
  {
    unit: 1,
    titleJa: "要求工学の全体像",
    lead: "関係者の本当のニーズを理解し、作るものの条件として整理・確認・管理する要求工学。最初の焦点は「誰の、どんな必要を、何として表すのか」",
    diagramTitle: "必要からシステムまで",
    diagram: [
      { label: "START", title: "人や組織のニーズ", note: "困りごと、達成したいこと、守るべき条件" },
      { label: "RE", title: "要求として整理", note: "機能・品質・制約に分け、文書化して確認する" },
      { label: "RESULT", title: "作るシステム", note: "要求を根拠に設計・開発・テストする" },
    ],
    points: [
      "stakeholderは、システムへ影響を与える人・組織と、システムから影響を受ける人・組織の両方",
      "要求はfunctional requirement、quality requirement、constraintに分類",
      "主な活動は、要求の引き出し、文書化、妥当性確認、管理",
      "Requirements Engineerは職名ではなく、問題の理解と解決案をつなぐ役割",
    ],
    terms: [
      { en: "requirement", ja: "要求", note: "満たすべきニーズや条件" },
      { en: "stakeholder", ja: "ステークホルダー", note: "システムに関係する人・組織" },
      { en: "functional requirement", ja: "機能要求", note: "システムが何をするか" },
      { en: "quality requirement", ja: "品質要求", note: "速さ、安全性、使いやすさなど" },
      { en: "constraint", ja: "制約", note: "技術や法規など、実現方法を限定する条件" },
    ],
    source: "Syllabus 3.3.0 · Chapter 1 / Handbook 1.3.2 · Chapter 1",
  },
  {
    unit: 2,
    titleJa: "9つの基本原則",
    lead: "個別の手法より先に押さえる、要求工学の判断基準。9つの原則は独立した暗記項目ではなく、価値、人と理解、範囲、確認、変化をつなぐ考え方",
    diagramTitle: "9原則を3つのまとまりで理解する",
    diagram: [
      { label: "VALUE & PEOPLE", title: "価値と関係者", note: "Value-orientation / Stakeholders / Shared understanding" },
      { label: "SCOPE & LOGIC", title: "範囲とつながり", note: "Context / Problem–Requirement–Solution" },
      { label: "QUALITY & CHANGE", title: "確認と変化", note: "Validation / Evolution / Innovation / Systematic work" },
    ],
    points: [
      "要求は目的ではなく、価値を生むための手段",
      "共通理解は、文書や合意で明確にした理解と、会話や経験に基づく暗黙の理解の2種類",
      "システムは周囲の環境から切り離せないため、system boundaryとcontextを確認",
      "要求の変化を前提に、早く繰り返すvalidationとより良い案の探索",
    ],
    terms: [
      { en: "value-orientation", ja: "価値志向", note: "得られる価値と労力を考える" },
      { en: "shared understanding", ja: "共通理解", note: "関係者が同じ意味で理解している状態" },
      { en: "context", ja: "コンテキスト", note: "システムを理解するために関係する周囲の環境" },
      { en: "validation", ja: "妥当性確認", note: "要求が本来のニーズに合っているか確かめる" },
      { en: "evolution", ja: "進化・変化", note: "要求が時間とともに変わること" },
    ],
    source: "Syllabus 3.3.0 · Chapter 2 / Handbook 1.3.2 · Chapter 2",
  },
  {
    unit: 3,
    titleJa: "要求を表す方法",
    lead: "要求の表現は文章だけではない。目的と読み手に合わせた文章、テンプレート、モデル、用語集、プロトタイプの組み合わせ。試験の焦点は、それぞれの用途と限界の区別",
    diagramTitle: "目的に合う表現を選ぶ",
    diagram: [
      { label: "1 · PURPOSE", title: "誰が何に使うか", note: "合意、設計、テスト、説明など目的を決める" },
      { label: "2 · FORM", title: "表し方を選ぶ", note: "文章 / template / model / glossary / prototype" },
      { label: "3 · REVIEW", title: "品質を確認する", note: "一貫性、明確さ、理解しやすさを見直す" },
    ],
    points: [
      "work productは、文書、モデル、プロトタイプなど、要求工学で作成・利用するものの総称",
      "文章は使いやすい一方で曖昧になりやすいため、用語と文構造を統一",
      "モデルは関係や動きを見やすくする一方、一つのモデルですべてを表すことは不可能",
      "glossaryは用語の意味の統一、prototypeは案を試して意見を得るために利用",
    ],
    terms: [
      { en: "work product", ja: "作業成果物", note: "要求工学で作成または利用するもの" },
      { en: "abstraction level", ja: "抽象度", note: "目的レベルか詳細レベルかという違い" },
      { en: "phrase template", ja: "定型文", note: "要求文の構造をそろえる補助" },
      { en: "context model", ja: "コンテキストモデル", note: "システムと周囲の関係を示すモデル" },
      { en: "glossary", ja: "用語集", note: "プロジェクト内の用語と意味をそろえるもの" },
    ],
    source: "Syllabus 3.3.0 · Chapter 3 / Handbook 1.3.2 · Chapter 3",
  },
  {
    unit: 4,
    titleJa: "要求を見つけ、合意する",
    lead: "良い要求を書く前に必要な、情報収集、関係者間の意見の整理、要求と本来のニーズとの一致確認。実務の流れとして覚える単元",
    diagramTitle: "要求を具体化する4段階",
    diagram: [
      { label: "SOURCE", title: "情報源を見つける", note: "stakeholder / documents / existing systems" },
      { label: "ELICIT", title: "必要な情報を得る", note: "質問、観察、アイデア発想などを選ぶ" },
      { label: "AGREE", title: "意見の衝突を解く", note: "原因と利害を整理して合意を探す" },
      { label: "VALIDATE", title: "ニーズとの一致を確認", note: "早い段階から繰り返し確かめる" },
    ],
    points: [
      "要求の情報源はstakeholder、documents、systemsの3種類",
      "情報収集手法は、情報源の種類、相手に直接話を聞けるか、必要な情報に合わせて選択",
      "衝突の解決前に、対立の種類、原因、関係者の利害を調査",
      "validationでは、ニーズの反映、合意の有無、前提の妥当性を確認",
    ],
    terms: [
      { en: "requirements source", ja: "要求の情報源", note: "要求を得る相手・文書・既存システム" },
      { en: "elicitation", ja: "要求の引き出し", note: "必要な情報を見つけて集める活動" },
      { en: "observation", ja: "観察", note: "実際の作業や環境を見る手法" },
      { en: "requirements conflict", ja: "要求の衝突", note: "両立しない要求や関係者の意見の違い" },
      { en: "requirements validation", ja: "要求の妥当性確認", note: "要求がニーズを正しく表すかの確認" },
    ],
    source: "Syllabus 3.3.0 · Chapter 4 / Handbook 1.3.2 · Chapter 4",
  },
  {
    unit: 5,
    titleJa: "プロジェクトに合う進め方",
    lead: "すべてのプロジェクトへそのまま適用できる要求工学プロセスは存在しない。状況を分析し、情報の流れ、作業時期、成果物、手法を構成",
    diagramTitle: "進め方を決める順序",
    diagram: [
      { label: "1 · ANALYZE", title: "影響要因を調べる", note: "規模、リスク、関係者、時間、要求の変わりやすさ" },
      { label: "2 · CONFIGURE", title: "進め方を組み立てる", note: "いつ、誰が、どの順序で確認するか" },
      { label: "3 · SELECT", title: "成果物と手法を選ぶ", note: "目的に必要なものだけを採用する" },
    ],
    points: [
      "RE processは、要求の引き出し、文書化、妥当性確認、管理を進める枠組み",
      "開発方法、関係者の参加可能性、システムの複雑さと重要度、時間、予算などによる進め方への影響",
      "高いリスクや厳しい規制に必要な、明確な確認・承認と記録",
      "tailoringは他プロジェクトの手順のコピーではなく、状況に合わせた再選択",
    ],
    terms: [
      { en: "RE process", ja: "要求工学プロセス", note: "要求工学の活動を進める枠組み" },
      { en: "influencing factor", ja: "影響要因", note: "進め方の選択へ影響する状況" },
      { en: "feedback loop", ja: "こまめな確認と反映", note: "結果を早く確認し、次の作業へ反映する循環" },
      { en: "tailoring", ja: "状況に合わせた調整", note: "活動、成果物、役割、時期を選び直すこと" },
    ],
    source: "Syllabus 3.3.0 · Chapter 5 / Handbook 1.3.2 · Chapter 5",
  },
  {
    unit: 6,
    titleJa: "要求を変更可能な状態で管理する",
    lead: "要求は作成後も管理対象。状態、版、関連資料とのつながり、変更理由、優先順位を保ち、関係者が必要な情報を取り出せる状態を維持",
    diagramTitle: "要求の一生とつながり",
    diagram: [
      { label: "LIFE CYCLE", title: "状態を管理", note: "作成 → 評価 → 合意 → 変更・廃止" },
      { label: "VERSION", title: "変更履歴を管理", note: "版番号、変更内容、保存場所を記録する" },
      { label: "TRACE", title: "前後を関連付ける", note: "ニーズ ← 要求 → 設計・テスト" },
      { label: "CHANGE", title: "影響を見て変更", note: "価値、費用、影響、優先順位を確認する" },
    ],
    points: [
      "各要求と成果物が持つ、作成、確認、合意などの状態",
      "version controlに必要な、一意な版番号、変更履歴、保存方法",
      "baselineは、正式な変更管理の対象となる確定済み成果物の一式",
      "traceabilityによる要求と根拠・テストの接続で、変更の影響調査を効率化",
      "優先順位は価値、費用、リスク、依存関係など複数の基準で判断",
    ],
    terms: [
      { en: "requirements management", ja: "要求管理", note: "要求を保存、変更、追跡できる状態にする活動" },
      { en: "baseline", ja: "ベースライン", note: "変更管理された確定済みの成果物一式" },
      { en: "attribute", ja: "属性", note: "状態、優先度、担当者などの付加情報" },
      { en: "traceability", ja: "追跡可能性", note: "要求の根拠と後続成果物をたどれること" },
      { en: "change request", ja: "変更要求", note: "承認済み要求の変更を提案する記録" },
    ],
    source: "Syllabus 3.3.0 · Chapter 6 / Handbook 1.3.2 · Chapter 6",
  },
  {
    unit: 7,
    titleJa: "ツールを正しく選び、導入する",
    lead: "ツールによる要求管理、共同作業、モデリングなどの支援。ただし、良い要求工学そのものの代替ではない。先に必要な活動を決め、その活動を助けるツールを選択",
    diagramTitle: "ツール導入で順番を逆にしない",
    diagram: [
      { label: "NEEDS", title: "支援したい仕事を決める", note: "管理、共有、モデリング、共同作業など" },
      { label: "EVALUATE", title: "条件でツールを評価", note: "目的、費用、資源、既存の進め方との相性" },
      { label: "PILOT", title: "小さく試す", note: "pilotでリスクと現場への影響を確認する" },
      { label: "ADOPT", title: "研修して展開する", note: "役割、手順、移行支援を明確にする" },
    ],
    points: [
      "ツールによる要求の属性、優先順位、版、関連付け、変更、共有、モデリングなどの支援",
      "ツール選定前に、支援対象の活動と現在の進め方を明確化",
      "ライセンス以外の費用や必要な人員も含めた評価",
      "pilot projectと利用者への研修による導入リスクの低減",
      "ツールの初期設定へ仕事を無理に合わせないことが重要",
    ],
    terms: [
      { en: "RE tool", ja: "要求工学ツール", note: "要求工学の一部の活動を支援するツール" },
      { en: "tool selection", ja: "ツール選定", note: "目的と評価基準に沿って選ぶこと" },
      { en: "pilot project", ja: "試験導入", note: "限定した範囲で効果とリスクを確かめること" },
      { en: "tool introduction", ja: "ツール導入", note: "役割、手順、研修、移行まで含む取り組み" },
    ],
    source: "Syllabus 3.3.0 · Chapter 7 / Handbook 1.3.2 · Chapter 7",
  },
];
