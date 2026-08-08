import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const { questions, sources } = await import(new URL("../app/data.ts", import.meta.url).href);
const { studyGuides } = await import(new URL("../app/study.ts", import.meta.url).href);
const manifest = JSON.parse(await readFile(join(root, "sources", "manifest.json"), "utf8"));
const errors: string[] = [];
const japanese = /[\u3040-\u30ff\u3400-\u9fff]/;
const unnaturalJapanese = /解決空間|要求源|作業構造|下流成果物|無批判/;
const expectedObjectives = [
  "EO 1.1.1", "EO 1.1.2", "EO 1.2.1", "EO 1.2.2", "EO 1.3.1", "EO 1.4.1", "EO 1.5.1", "EO 1.6.1",
  "EO 2.1.1", "EO 2.2.1", "EO 2.2.2",
  "EO 3.1.1", "EO 3.1.2", "EO 3.1.3", "EO 3.1.4", "EO 3.1.5", "EO 3.1.6", "EO 3.2.1", "EO 3.2.2",
  "EO 3.3.1", "EO 3.3.2", "EO 3.3.3", "EO 3.4.1", "EO 3.4.2", "EO 3.4.3", "EO 3.4.4", "EO 3.4.5",
  "EO 3.4.6", "EO 3.4.7", "EO 3.5.1", "EO 3.6.1", "EO 3.6.2", "EO 3.7.1", "EO 3.8.1", "EO 3.8.2",
  "EO 4.1.1", "EO 4.1.2", "EO 4.1.3", "EO 4.1.4", "EO 4.2.1", "EO 4.2.2", "EO 4.2.3",
  "EO 4.3.1", "EO 4.3.2", "EO 4.3.3", "EO 4.4.1", "EO 4.4.2", "EO 4.4.3",
  "EO 5.1.1", "EO 5.1.2", "EO 5.2.1", "EO 5.3.1", "EO 5.3.2", "EO 5.3.3",
  "EO 6.1.1", "EO 6.2.1", "EO 6.3.1", "EO 6.4.1", "EO 6.5.1", "EO 6.5.2", "EO 6.5.3",
  "EO 6.6.1", "EO 6.6.2", "EO 6.6.3", "EO 6.7.1", "EO 6.8.1", "EO 6.8.2", "EO 6.8.3",
  "EO 7.1.1", "EO 7.2.1",
];

if (questions.length < 180) errors.push(`Expected at least 180 questions, found ${questions.length}`);
if (studyGuides.length !== 7 || new Set(studyGuides.map((guide: { unit: number }) => guide.unit)).size !== 7) errors.push("Expected one study guide for each of the seven units");
for (const guide of studyGuides) {
  if (guide.diagram.length < 3 || guide.points.length < 3 || guide.terms.length < 4) errors.push(`EU ${guide.unit}: study guide is incomplete`);
  if (!/Syllabus 3\.3\.0/.test(guide.source) || !/Handbook 1\.3\.2/.test(guide.source)) errors.push(`EU ${guide.unit}: study guide source is not pinned`);
}
if (new Set(questions.map((question: { id: string }) => question.id)).size !== questions.length) errors.push("Question IDs must be unique");
if (new Set(questions.map((question: { prompt: string }) => question.prompt)).size !== questions.length) errors.push("Question prompts must be unique");
for (const objective of expectedObjectives) {
  const count = questions.filter((question: { eo: string }) => question.eo === objective).length;
  if (count < 2) errors.push(`${objective}: expected at least two independently worded questions, found ${count}`);
}
for (const question of questions) {
  if (japanese.test(question.prompt) || question.options.some((option: string) => japanese.test(option))) errors.push(`${question.id}: Japanese text found in an exam field`);
  if (!question.explanationJa || unnaturalJapanese.test(question.explanationJa)) errors.push(`${question.id}: Japanese explanation needs plain-language review`);
  if (!question.correct.length || question.correct.some((index: number) => index < 0 || index >= question.options.length)) errors.push(`${question.id}: invalid correct answer`);
  if (!/^Syllabus 3\.3\.0 · /.test(question.source)) errors.push(`${question.id}: missing pinned syllabus reference`);
}
for (const source of manifest.sources) {
  if (source.publisher !== "IREB e.V." || source.language !== "en") errors.push(`${source.id}: source policy violation`);
  if (!/^[a-f0-9]{64}$/.test(source.sha256)) errors.push(`${source.id}: SHA-256 is not pinned`);
}
if (sources.some((source: { version: string }) => !source.version)) errors.push("Public source metadata must include versions");
const tracked = execFileSync("git", ["ls-files", "data/raw", "data/extracted"], { cwd: root, encoding: "utf8" }).trim();
if (tracked) errors.push(`Private source data is tracked by Git:\n${tracked}`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`validated ${questions.length} English questions and ${manifest.sources.length} pinned official sources`);
