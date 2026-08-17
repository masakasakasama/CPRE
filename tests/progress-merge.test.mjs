import assert from "node:assert/strict";
import test from "node:test";
import { mergeSyncDocument } from "../app/progress-merge.ts";
import { initialProgress } from "../app/progress.ts";

function document(progress, savedAt, activeExam = null) {
  return { schema: 1, savedAt, progress, activeExam };
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

test("an older device snapshot cannot replace newer non-answer progress or active exam state", () => {
  const remoteExam = { order: ["Q1"], answers: { Q1: [0] }, index: 0, endsAt: 9999999999999 };
  const remote = document({
    ...initialProgress,
    completedUnits: [1, 2],
    bookmarks: ["Q1"],
    review: ["Q2"],
  }, "2026-08-08T12:00:00.000Z", remoteExam);
  const staleIncoming = document({
    ...initialProgress,
    completedUnits: [1],
    bookmarks: [],
    review: [],
  }, "2026-08-08T11:00:00.000Z", null);

  const merged = mergeSyncDocument(remote, staleIncoming);
  assert.equal(merged.savedAt, remote.savedAt);
  assert.deepEqual(merged.progress.completedUnits, [1, 2]);
  assert.deepEqual(merged.progress.bookmarks, ["Q1"]);
  assert.deepEqual(merged.progress.review, ["Q2"]);
  assert.deepEqual(merged.activeExam, remoteExam);
});

test("sync merge never truncates attempts or mock history", () => {
  const attempts = Array.from({ length: 75 }, (_, index) => ({
    selected: [index % 4],
    correct: index % 2 === 0,
    at: new Date(Date.UTC(2026, 0, 1, 0, index)).toISOString(),
  }));
  const mockHistory = Array.from({ length: 30 }, (_, index) => ({
    at: new Date(Date.UTC(2026, 1, index + 1)).toISOString(),
    percent: 70,
    correct: 32,
    points: 35,
    total: 50,
  }));
  const remote = document({
    ...initialProgress,
    answered: { Q1: { selected: [0], correct: true, lastAt: attempts[39].at, attempts: attempts.slice(0, 40) } },
    mockHistory: mockHistory.slice(0, 15),
  }, "2026-02-15T00:00:00.000Z");
  const incoming = document({
    ...initialProgress,
    answered: { Q1: { selected: [0], correct: true, lastAt: attempts.at(-1).at, attempts: attempts.slice(40) } },
    mockHistory: mockHistory.slice(15),
  }, "2026-03-01T00:00:00.000Z");

  const merged = mergeSyncDocument(remote, incoming);
  assert.equal(merged.progress.answered.Q1.attempts.length, 75);
  assert.equal(merged.progress.mockHistory.length, 30);
});
