import assert from "node:assert/strict";
import test from "node:test";
import { questions } from "../app/data.ts";
import { MOCK_BLUEPRINT, selectMockExamQuestions } from "../app/exam.ts";
import { calculateNextReview, calculateReadiness, calculateSchedule, getAnswerStats, getLastLearningActivity, initialProgress, makeSyncDocument, parseSyncDocument, selectNextQuestionId, upsertAnswerAttempt } from "../app/progress.ts";

test("accepts a complete GitHub progress document", () => {
  const document = makeSyncDocument({
    ...initialProgress,
    review: ["q-1"],
    completedUnits: [1],
    lastActivity: { type: "study", unit: 1, at: "2026-07-26T10:00:00.000Z" },
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
    total: 60,
    coverage: 100,
    accuracy: 50,
    study: 50,
    review: 0,
    mock: 60,
  });
});

test("does not inflate readiness from a few correct answers", () => {
  const answered = Object.fromEntries(Array.from({ length: 4 }, (_, index) => [
    `q${index + 1}`,
    { selected: [0], correct: true, lastAt: "2026-07-26T00:00:00.000Z" },
  ]));
  assert.deepEqual(calculateReadiness({ ...initialProgress, answered }), {
    total: 5,
    coverage: 9,
    accuracy: 9,
    study: 0,
    review: 0,
    mock: 0,
  });
});

test("counts a question as repeatedly mastered after two consecutive correct answers", () => {
  const at = "2026-07-26T00:00:00.000Z";
  const first = upsertAnswerAttempt(undefined, [0], true, "medium", at);
  const second = upsertAnswerAttempt(first, [0], true, "medium", "2026-07-28T00:00:00.000Z");
  assert.deepEqual(calculateReadiness({ ...initialProgress, answered: { q1: second } }, 1), {
    total: 65,
    coverage: 100,
    accuracy: 100,
    study: 0,
    review: 100,
    mock: 0,
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

test("restores a resume point from the latest legacy answer", () => {
  const progress = {
    ...initialProgress,
    answered: {
      q1: { selected: [0], correct: true, lastAt: "2026-07-25T00:00:00.000Z", attempts: [] },
      q2: { selected: [1], correct: false, lastAt: "2026-07-26T00:00:00.000Z", attempts: [] },
    },
  };
  assert.deepEqual(getLastLearningActivity(progress), {
    type: "practice",
    at: "2026-07-26T00:00:00.000Z",
    unit: "all",
    questionId: "q2",
  });
});

test("prefers an explicitly stored study resume point", () => {
  const lastActivity = { type: "study", unit: 4, at: "2026-07-26T09:30:00.000Z" };
  assert.deepEqual(getLastLearningActivity({ ...initialProgress, lastActivity }), lastActivity);
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

test("changes confidence on the current answer without adding another history entry", () => {
  const at = "2026-07-26T00:00:00.000Z";
  const firstChoice = upsertAnswerAttempt(undefined, [0], true, "low", at);
  const changedChoice = upsertAnswerAttempt(firstChoice, [0], true, "high", at, at);
  assert.equal(changedChoice.attempts.length, 1);
  assert.equal(changedChoice.attempts[0].confidence, "high");
  assert.equal(changedChoice.attempts[0].intervalDays, 5);
});

test("draws a fresh 45-question mock that follows the public unit blueprint", () => {
  const exam = selectMockExamQuestions(questions, () => 0.42);
  assert.equal(exam.length, 45);
  assert.equal(new Set(exam.map((question) => question.id)).size, 45);
  for (const [unit, count] of Object.entries(MOCK_BLUEPRINT)) {
    assert.equal(exam.filter((question) => question.unit === Number(unit)).length, count);
  }
});
