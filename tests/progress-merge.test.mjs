import assert from "node:assert/strict";
import test from "node:test";
import { mergeSyncDocument } from "../app/progress-merge.ts";
import { initialProgress } from "../app/progress.ts";

function document(progress, savedAt) {
  return { schema: 1, savedAt, progress, activeExam: null };
}

test("sync merge preserves older practice attempts when a mock overwrites the latest answer shape", () => {
  const remote = document({
    ...initialProgress,
    answered: {
      Q1: {
        selected: [0],
        correct: true,
        lastAt: "2026-08-07T10:00:00.000Z",
        attempts: [{ selected: [0], correct: true, at: "2026-08-07T10:00:00.000Z", confidence: "high", intervalDays: 5, dueAt: "2026-08-12T10:00:00.000Z" }],
      },
    },
  }, "2026-08-07T10:00:01.000Z");

  const incoming = document({
    ...initialProgress,
    answered: {
      Q1: { selected: [1], correct: false, lastAt: "2026-08-08T10:00:00.000Z", attempts: [{ selected: [1], correct: false, at: "2026-08-08T10:00:00.000Z" }] },
    },
  }, "2026-08-08T10:00:01.000Z");

  const merged = mergeSyncDocument(remote, incoming);
  assert.equal(merged.progress.answered.Q1.attempts.length, 2);
  assert.equal(merged.progress.answered.Q1.lastAt, "2026-08-08T10:00:00.000Z");
  assert.equal(merged.progress.answered.Q1.correct, false);
});

test("sync merge keeps mock results from both snapshots without duplicates", () => {
  const first = { at: "2026-08-07T00:00:00.000Z", percent: 80, correct: 36, points: 40, total: 50 };
  const second = { at: "2026-08-08T00:00:00.000Z", percent: 84, correct: 38, points: 42, total: 50 };
  const remote = document({ ...initialProgress, mockHistory: [first] }, "2026-08-07T00:00:01.000Z");
  const incoming = document({ ...initialProgress, mockHistory: [second, first] }, "2026-08-08T00:00:01.000Z");

  const merged = mergeSyncDocument(remote, incoming);
  assert.deepEqual(merged.progress.mockHistory.map((item) => item.at), [second.at, first.at]);
});
