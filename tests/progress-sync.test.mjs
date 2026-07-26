import assert from "node:assert/strict";
import test from "node:test";
import { calculateReadiness, calculateSchedule, initialProgress, makeSyncDocument, parseSyncDocument } from "../app/progress.ts";

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
