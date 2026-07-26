import assert from "node:assert/strict";
import test from "node:test";
import { calculateNextReview, calculateReadiness, calculateSchedule, getAnswerStats, initialProgress, makeSyncDocument, parseSyncDocument, selectNextQuestionId } from "../app/progress.ts";

test("accepts a complete GitHub progress document", () => {
  const document = makeSyncDocument({
    ...initialProgress,
    review: ["q-1"],
    completedUnits: [1],
  }, {
    order: ["q-1"],
    answers: { "q-1": [0] },
    index: 0,
    endsAt: Date.now() + 60_000,
  });
  assert.deepEqual(parseSyncDocument(JSON.parse(JSON.stringify(document))), document);
});

test("rejects malformed progress before it can be committed", () => {
  assert.equal(parseSyncDocument({ schema: 1, savedAt: "now", progress: { schema: 1 }, activeExam: null }), null);
});

test("calculates a transparent knowledge estimate from five learning signals", () => {
  const progress = {
    ...initialProgress,
    answered: {
      q1: { selected: [0], correct: true, lastAt: "2026-07-20T00:00:00.000Z" },
      q2: { selected: [1], correct: false, lastAt: "2026-07-20T00:00:00.000Z" },
    },
    review: ["q2"],
    completedUnits: [1],
    mockHistory: [{ at: "2026-07-20T00:00:00.000Z", percent: 60, correct: 27, points: 27, total: 45 }],
  };
  assert.deepEqual(calculateReadiness(progress, 2, 2), {
    total: 65,
    coverage: 100,
    accuracy: 50,
    study: 50,
    review: 50,
    mock: 60,
  });
});

test("compares knowledge estimate with the pace required by an exam date", () => {
  const progress = {
    ...initialProgress,
    targetExamDate: "2026-08-10",
    planStartedAt: "2026-07-20T00:00:00.000Z",
  };
  assert.deepEqual(calculateSchedule(progress, 40, new Date("2026-07-30T12:00:00")), {
    daysLeft: 11,
    expectedByToday: 48,
    difference: -8,
    questionsPerDay: 5,
    status: "behind",
  });
});

test("migrates the legacy last answer into the first history entry", () => {
  const parsed = parseSyncDocument({
    schema: 1,
    savedAt: "2026-07-26T00:00:00.000Z",
    progress: {
      ...initialProgress,
      answered: { q1: { selected: [0], correct: true, lastAt: "2026-07-25T00:00:00.000Z" } },
    },
    activeExam: null,
  });
  assert.deepEqual(parsed?.progress.answered.q1.attempts, [
    { selected: [0], correct: true, at: "2026-07-25T00:00:00.000Z" },
  ]);
});

test("weights first correct review by three confidence levels", () => {
  const at = new Date("2026-07-26T00:00:00.000Z");
  assert.equal(calculateNextReview(undefined, true, "low", at).intervalDays, 1);
  assert.equal(calculateNextReview(undefined, true, "medium", at).intervalDays, 2);
  assert.equal(calculateNextReview(undefined, true, "high", at).intervalDays, 5);
});

test("uses Anki-inspired multipliers for repeated correct answers", () => {
  const record = {
    selected: [0],
    correct: true,
    lastAt: "2026-07-24T00:00:00.000Z",
    attempts: [{
      selected: [0],
      correct: true,
      at: "2026-07-24T00:00:00.000Z",
      confidence: "medium",
      intervalDays: 2,
      dueAt: "2026-07-26T00:00:00.000Z",
    }],
  };
  assert.equal(calculateNextReview(record, true, "low").intervalDays, 3);
  assert.equal(calculateNextReview(record, true, "medium").intervalDays, 5);
  assert.equal(calculateNextReview(record, true, "high").intervalDays, 7);
});

test("keeps recently scheduled questions out and exposes their due date", () => {
  const dueAt = "2026-07-28T00:00:00.000Z";
  const progress = {
    ...initialProgress,
    answered: {
      q1: {
        selected: [0],
        correct: true,
        lastAt: "2026-07-26T00:00:00.000Z",
        attempts: [{ selected: [0], correct: true, at: "2026-07-26T00:00:00.000Z", confidence: "medium", intervalDays: 2, dueAt }],
      },
    },
  };
  assert.equal(getAnswerStats(progress.answered.q1, new Date("2026-07-26T12:00:00.000Z")).due, false);
  assert.equal(selectNextQuestionId(["q1", "q2"], null, progress, new Date("2026-07-26T12:00:00.000Z")), "q2");
  assert.equal(selectNextQuestionId(["q1"], null, progress, new Date("2026-07-26T12:00:00.000Z")), null);
});
