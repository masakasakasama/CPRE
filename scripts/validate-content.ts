import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const { questions, sources } = await import(new URL("../app/data.ts", import.meta.url).href);
const manifest = JSON.parse(await readFile(join(root, "sources", "manifest.json"), "utf8"));
const errors: string[] = [];
const japanese = /[\u3040-\u30ff\u3400-\u9fff]/;

if (questions.length !== 45) errors.push(`Expected 45 questions, found ${questions.length}`);
if (new Set(questions.map((question: { id: string }) => question.id)).size !== questions.length) errors.push("Question IDs must be unique");
for (const question of questions) {
  if (japanese.test(question.prompt) || question.options.some((option: string) => japanese.test(option))) errors.push(`${question.id}: Japanese text found in an exam field`);
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
