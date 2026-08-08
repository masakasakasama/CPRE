import { readFileSync, writeFileSync } from "node:fs";

function replaceOnce(source, needle, replacement, label) {
  const first = source.indexOf(needle);
  if (first < 0) throw new Error(`Missing target: ${label}`);
  if (source.indexOf(needle, first + needle.length) >= 0) throw new Error(`Ambiguous target: ${label}`);
  return source.replace(needle, replacement);
}

const pagePath = "app/page.tsx";
let page = readFileSync(pagePath, "utf8");

page = replaceOnce(
  page,
  'import { useEffect, useMemo, useRef, useState } from "react";\nimport { questions, sources, units, type Question } from "./data";',
  'import { useEffect, useMemo, useRef, useState } from "react";\nimport { APP_VERSION, EXAM_KEY, GITHUB_TOKEN_STORAGE, INTRO_KEY, LOCAL_SAVED_AT_KEY, STORAGE_KEY, SYNC_KEY_STORAGE } from "./app-config";\nimport { questions, sources, units, type Question } from "./data";',
  "central app config import",
);

page = replaceOnce(
  page,
  'const STORAGE_KEY = "cpre-english-study:v1";\nconst EXAM_KEY = "cpre-english-study:exam:v1";\nconst INTRO_KEY = "cpre-english-study:intro:v1";\nconst LOCAL_SAVED_AT_KEY = "cpre-english-study:saved-at:v1";\nconst SYNC_KEY_STORAGE = "cpre-english-study:sync-key";\nconst GITHUB_TOKEN_STORAGE = "cpre-english-study:github-token";\nconst APP_VERSION = "0.12.0";\n\n',
  "",
  "duplicated storage/version constants",
);

const oldSubmit = `  function submitExam(target: ActiveExam) {
    let points = 0;
    let correct = 0;
    let total = 0;
    const wrong: string[] = [];
    const nextAnswered = { ...progress.answered };
    for (const id of target.order) {
      const question = questions.find((candidate) => candidate.id === id);
      if (!question) continue;
      const selected = target.answers[question.id] ?? [];
      const exact = sameAnswer(selected, question.correct);
      points += questionScore(question, selected);
      total += question.points;
      if (exact) correct += 1;
      else wrong.push(question.id);
      nextAnswered[question.id] = { selected, correct: exact, lastAt: new Date().toISOString() };
    }
    const result: MockResult = { at: new Date().toISOString(), percent: Math.round((points / total) * 100), correct, points: Math.round(points * 10) / 10, total };
    setProgress((current) => ({
      ...current,
      answered: nextAnswered,
      review: Array.from(new Set([...current.review, ...wrong])),
      mockHistory: [result, ...current.mockHistory].slice(0, 20),
    }));
    setExamResult(result);
    setExam(null);
  }`;

const newSubmit = `  function submitExam(target: ActiveExam) {
    const submittedAt = new Date().toISOString();
    let points = 0;
    let correct = 0;
    let total = 0;
    const wrong: string[] = [];
    const attempts: { question: Question; selected: number[]; exact: boolean }[] = [];
    for (const id of target.order) {
      const question = questions.find((candidate) => candidate.id === id);
      if (!question) continue;
      const selected = target.answers[question.id] ?? [];
      const exact = sameAnswer(selected, question.correct);
      points += questionScore(question, selected);
      total += question.points;
      if (exact) correct += 1;
      else wrong.push(question.id);
      attempts.push({ question, selected, exact });
    }
    const result: MockResult = { at: submittedAt, percent: Math.round((points / total) * 100), correct, points: Math.round(points * 10) / 10, total };
    setProgress((current) => {
      const nextAnswered = { ...current.answered };
      for (const attempt of attempts) {
        nextAnswered[attempt.question.id] = upsertAnswerAttempt(
          nextAnswered[attempt.question.id],
          attempt.selected,
          attempt.exact,
          undefined,
          submittedAt,
        );
      }
      return {
        ...current,
        answered: nextAnswered,
        review: Array.from(new Set([...current.review, ...wrong])),
        mockHistory: [result, ...current.mockHistory].slice(0, 20),
      };
    });
    setExamResult(result);
    setExam(null);
  }`;

page = replaceOnce(page, oldSubmit, newSubmit, "mock submission history preservation");
writeFileSync(pagePath, page);

const lockPath = "package-lock.json";
const lock = JSON.parse(readFileSync(lockPath, "utf8"));
if (lock.name !== "cpre-english-study") throw new Error("Unexpected package-lock root");
if (lock.version !== "0.12.0" || lock.packages?.[""]?.version !== "0.12.0") {
  throw new Error(`Expected root lock version 0.12.0, found ${lock.version}/${lock.packages?.[""]?.version}`);
}
lock.version = "0.13.0";
lock.packages[""].version = "0.13.0";

let repaired = 0;
for (const [path, entry] of Object.entries(lock.packages ?? {})) {
  if (path === "" || !entry || typeof entry !== "object") continue;
  if (entry.version === "0.12.0" && typeof entry.resolved === "string" && entry.resolved.includes("-0.1.0.tgz")) {
    entry.version = "0.1.0";
    repaired += 1;
  }
}
if (repaired < 1) throw new Error("Expected at least one corrupted 0.1.0 dependency to repair");
writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);

console.log(`Finalized v0.13.0, preserved mock attempt history, repaired ${repaired} lockfile dependency version(s)`);
