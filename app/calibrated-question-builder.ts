import type { Question } from "./data.ts";

export type Level = "L1" | "L2" | "L3";
export type Variant = readonly [prompt: string, correct: string, distractors: readonly [string, string, string]];
export type Concept = {
  unit: number;
  eo: string;
  section: string;
  level: Level;
  keyword: string;
  explanationJa: string;
  variants: readonly [Variant, Variant];
};

const practicalExamplesByEo: Readonly<Record<string, string>> = {
  "EO 3.1.2": "【実務例（Polarion）】分析中に更新し続けるRequirement Work Itemはevolvingな成果物として扱える。承認済みのDocument Baselineなどで状態を固定し、変更管理下に置けばdurableな成果物のイメージに近い",
  "EO 3.1.3": "【実務例（Jira）】Epic『Remote Vehicle Control』→ Story『As a driver, I want to unlock my vehicle remotely』→ acceptance criteriaの順に具体化すると、同じ目的を異なるabstraction levelで表すイメージをつかみやすい",
  "EO 3.3.1": "【実務例（Polarion）】Work ItemにあらかじめStatus、Owner、Reviewerなどのfieldを用意するのはform templateのイメージ。LiveDoc全体の章立ちを定めるならdocument templateに近い",
  "EO 3.3.2": "【実務例（Jira）】Storyに『As a driver, I want to unlock my vehicle remotely so that I can access it without the key』と書けば、role、need、valueを分けるuser storyの型を具体化できる",
  "EO 3.3.3": "【実務例（Polarion）】Use Case用のWork ItemにActor、Precondition、Trigger、Main Flow、Alternative Flow、Postconditionのfieldを持たせると、use case form templateをツール上で実装するイメージになる",
  "EO 5.3.1": "【実務例（Jira）】市場向けプロダクトでEpicやStoryをbacklogに置き、利用者や市場からのfeedbackで継続的に追加、並べ替えする運用はproduct-oriented REを想像しやすい",
  "EO 6.1.1": "【実務例（Polarion）】Requirement Work Itemを一意に管理し、StatusやOwnerを保持し、System Testや設計Work Itemへのlinkを追える状態にするのがrequirements managementの具体例",
  "EO 6.2.1": "【実務例（Polarion）】RequirementのworkflowをDraft → In Review → Approvedのように定義し、許可する遷移を制御することでrequirements life cycleをツール上に表現できる",
  "EO 6.3.1": "【実務例（Polarion）】RequirementやLiveDocのrevisionとhistoryを保持しておけば、変更前後を識別し、過去の状態を確認できる。これがversioning conceptの具体像",
  "EO 6.4.1": "【実務例（Polarion）】あるrelease milestoneで承認済みrequirementsの状態をDocument BaselineやCollection Baselineとしてsnapshot化すると、baselineの概念を具体的に理解しやすい",
  "EO 6.5.1": "【実務例（Polarion）】Requirement Work ItemにStatus=Approved、Priority=High、Owner=IVI Teamのようなfield値を持たせる。これらはrequirement本文ではなく管理用のattribute",
  "EO 6.5.2": "【実務例（Jira）】teamがPriority、Component、Assigneeだけで判断できるなら、その必要なfieldを維持する。利用しないcustom fieldまで増やさないことがattribute selectionの考え方",
  "EO 6.5.3": "【実務例（Jira）】JQLでpriority = High AND component = IVIのwork itemだけを表示すればselective viewのイメージ。dashboardでstatus別件数だけを表示すればaggregating viewに近い",
  "EO 6.6.1": "【実務例（Polarion）】System Requirement → Software Requirement → System Testのlinkを保持すると、要求変更時に影響する設計やテストを追える。これはtraceabilityの代表例",
  "EO 6.6.2": "【実務例（Jira）】StoryとTestをIssue Linkで明示的に関連付ければexplicit traceability。同じ番号や似た命名だけで関係を推測するならimplicit traceabilityに近い",
  "EO 6.6.3": "【実務例（Polarion）】RequirementとTest Caseの関係をTraceability Matrixで一覧表示すると、ID間のexplicit traceをmatrix形式で表現できる",
  "EO 6.7.1": "【実務例（Jira）】新しい要求をStoryとしてbacklogへ追加し、既存work itemと一緒にimpactやpriorityを確認して順序を決める運用はiterativeなchange handlingの具体例",
  "EO 6.8.1": "【実務例（Jira）】PriorityだけでなくBusiness Value、Risk、Story Points、dependencyなどを判断材料としてbacklogの順序を決めると、複数criteriaによるprioritizationを具体化できる",
  "EO 7.1.1": "【実務例（Polarion / Jira）】Polarionはrequirements、version、baseline、trace linkなどを管理でき、Jiraはwork item、backlog、workflow、filterなどを支援できる。ただしtool自体が要求の妥当性やstakeholder間の判断を代替するわけではない",
  "EO 7.2.1": "【実務例（Polarion）】全社展開前に代表projectでpilotし、必要なWork Item type、field、workflow、trace ruleを設定して利用者trainingを行う。結果を評価してから展開範囲を広げるのがtool introductionの具体例",
};

function rotateOptions(id: string, correct: string, distractors: readonly string[]) {
  const options = [correct, ...distractors];
  const shift = Array.from(id).reduce((sum, character) => sum + character.charCodeAt(0), 0) % options.length;
  const rotated = [...options.slice(shift), ...options.slice(0, shift)];
  return { options: rotated, correct: [rotated.indexOf(correct)] };
}

export function makeQuestions(concepts: readonly Concept[]): Question[] {
  return concepts.flatMap((concept) =>
    concept.variants.map((variant, index) => {
      const suffix = index === 0 ? "A" : "B";
      const id = `P${concept.eo.replace(/\D/g, "")}${suffix}`;
      const [prompt, correctAnswer, distractors] = variant;
      const answer = rotateOptions(id, correctAnswer, distractors);
      const practicalExample = practicalExamplesByEo[concept.eo];
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
        explanationJa: practicalExample ? `${concept.explanationJa}。${practicalExample}` : concept.explanationJa,
        source: `Syllabus 3.3.0 · ${concept.section}`,
      };
    }),
  );
}
