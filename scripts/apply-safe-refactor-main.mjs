import { readFileSync, writeFileSync } from "node:fs";

function replaceOnce(source, needle, replacement, label) {
  const first = source.indexOf(needle);
  if (first < 0) throw new Error(`Missing refactor target: ${label}`);
  if (source.indexOf(needle, first + needle.length) >= 0) throw new Error(`Ambiguous refactor target: ${label}`);
  return source.replace(needle, replacement);
}

const pagePath = "app/page.tsx";
let page = readFileSync(pagePath, "utf8");

page = replaceOnce(
  page,
  'import { useEffect, useMemo, useRef, useState } from "react";\nimport { questions, sources, units, type Question } from "./data";',
  'import { useEffect, useMemo, useRef, useState } from "react";\nimport { APP_VERSION, EXAM_KEY, GITHUB_TOKEN_STORAGE, INTRO_KEY, LOCAL_SAVED_AT_KEY, STORAGE_KEY, SYNC_KEY_STORAGE } from "./app-config";\nimport { questions, sources, units, type Question } from "./data";',
  "app config import",
);

page = replaceOnce(
  page,
  'import { selectMockExamQuestions } from "./exam";\nimport { calculateNextReview, calculatePassEstimate, calculateReadiness, calculateSchedule, getAnswerStats, getLastLearningActivity, initialProgress, makeSyncDocument, parseActiveExam, parseProgress, parseSyncDocument, selectNextQuestionId, upsertAnswerAttempt, type ActiveExam, type Confidence, type LastLearningActivity, type MockResult, type Progress } from "./progress";',
  'import { selectMockExamQuestions } from "./exam";\nimport { scoreMockSubmission } from "./mock-results";\nimport { calculateNextReview, calculatePassEstimate, calculateReadiness, calculateSchedule, getAnswerStats, getLastLearningActivity, initialProgress, makeSyncDocument, parseActiveExam, parseProgress, parseSyncDocument, selectNextQuestionId, upsertAnswerAttempt, type ActiveExam, type Confidence, type LastLearningActivity, type MockResult, type Progress } from "./progress";',
  "mock result import",
);

page = replaceOnce(
  page,
  'const STORAGE_KEY = "cpre-english-study:v1";\nconst EXAM_KEY = "cpre-english-study:exam:v1";\nconst INTRO_KEY = "cpre-english-study:intro:v1";\nconst LOCAL_SAVED_AT_KEY = "cpre-english-study:saved-at:v1";\nconst SYNC_KEY_STORAGE = "cpre-english-study:sync-key";\nconst GITHUB_TOKEN_STORAGE = "cpre-english-study:github-token";\nconst APP_VERSION = "0.12.0";\n',
  "",
  "duplicated app constants",
);

const submitPattern = /  function submitExam\(target: ActiveExam\) \{[\s\S]*?\n  \}\n\n  async function refreshSources\(\) \{/;
if (!submitPattern.test(page)) throw new Error("Missing submitExam function");
page = page.replace(submitPattern, `  function submitExam(target: ActiveExam) {
    const submittedAt = new Date().toISOString();
    const scored = scoreMockSubmission(target, questions, {}, submittedAt);
    setProgress((current) => {
      const merged = scoreMockSubmission(target, questions, current.answered, submittedAt);
      return {
        ...current,
        answered: merged.answered,
        review: Array.from(new Set([...current.review, ...merged.wrong])),
        mockHistory: [merged.result, ...current.mockHistory].slice(0, 20),
      };
    });
    setExamResult(scored.result);
    setExam(null);
  }

  async function refreshSources() {`);
writeFileSync(pagePath, page);

for (const path of ["package.json", "package-lock.json"]) {
  let source = readFileSync(path, "utf8");
  if (!source.includes('"version": "0.12.0"')) throw new Error(`${path}: expected v0.12.0 metadata`);
  source = source.replaceAll('"version": "0.12.0"', '"version": "0.13.0"');
  writeFileSync(path, source);
}

const readmePath = "README.md";
let readme = readFileSync(readmePath, "utf8");
readme = readme.replace("- 45 independently written questions across single-choice, multiple-choice, and true/false formats", "- 185 independently written questions covering all 70 educational objectives, across single-choice, multiple-choice, and true/false formats");
readme = readme.replace("`content:validate` checks the 45-question inventory", "`content:validate` checks the 185-question inventory");
readme = readme.replace("- The first release contains one 45-question bank; a larger bank and independent language review are planned.", "- The question bank contains 185 independently written questions; continued difficulty calibration and independent language review are still recommended.");
writeFileSync(readmePath, readme);

const handoffPath = "handoff.md";
let handoff = readFileSync(handoffPath, "utf8");
handoff = handoff.replace("- Seven syllabus units, 45 independently written questions, 75-minute mock exam", "- Seven syllabus units, 185 independently written questions, 75-minute mock exam");
handoff = handoff.replace("- Expand the question bank beyond the first 45 while preserving objective coverage.", "- Continue calibrating distractor quality and mock difficulty while preserving question IDs and grading metadata.");
if (!handoff.includes("## Data compatibility guard")) {
  handoff += "\n## Data compatibility guard\n\n- Browser storage keys and progress schema remain unchanged in v0.13.0.\n- Question IDs, answer positions, kinds, point values, and option counts are pinned by `tests/question-grading-contract.json`.\n- Mock-exam answers append to existing attempt history instead of replacing prior practice history.\n";
}
writeFileSync(handoffPath, handoff);

const { questions } = await import(new URL("../app/data.ts", import.meta.url).href);
const contract = questions.map((question) => ({
  id: question.id,
  kind: question.kind,
  points: question.points,
  correct: question.correct,
  optionCount: question.options.length,
}));
writeFileSync("tests/question-grading-contract.json", `${JSON.stringify(contract, null, 2)}\n`);

writeFileSync("tests/question-contract.test.mjs", `import assert from "node:assert/strict";\nimport { readFile } from "node:fs/promises";\nimport test from "node:test";\nimport { questions } from "../app/data.ts";\n\nconst contract = JSON.parse(await readFile(new URL("./question-grading-contract.json", import.meta.url), "utf8"));\n\nfunction gradingShape(question) {\n  return {\n    id: question.id,\n    kind: question.kind,\n    points: question.points,\n    correct: question.correct,\n    optionCount: question.options.length,\n  };\n}\n\ntest("question IDs and grading metadata remain compatible with saved answer history", () => {\n  assert.deepEqual(questions.map(gradingShape), contract);\n});\n`);

console.log(`Applied safe v0.13.0 refactor and pinned ${contract.length} question grading contracts`);
