import assert from "node:assert/strict";
import test from "node:test";
import { scoreMockSubmission } from "../app/mock-results.ts";

const single = {
  id: "QX1",
  unit: 1,
  eo: "EO 1.1.1",
  kind: "single",
  prompt: "Single",
  options: ["A", "B", "C", "D"],
  correct: [1],
  points: 2,
  keyword: "single",
  explanationJa: "",
  source: "Syllabus 3.3.0 · 1.1",
};

const multiple = {
  id: "QX2",
  unit: 1,
  eo: "EO 1.1.1",
  kind: "multiple",
  prompt: "Multiple",
  options: ["A", "B", "C", "D"],
  correct: [0, 2],
  points: 2,
  keyword: "multiple",
  explanationJa: "",
  source: "Syllabus 3.3.0 · 1.1",
};

test("mock submission preserves previous practice attempts", () => {
  const existing = {
    QX1: {
      selected: [1],
      correct: true,
      lastAt: "2026-08-07T00:00:00.000Z",
      attempts: [{
        selected: [1],
        correct: true,
        at: "2026-08-07T00:00:00.000Z",
        confidence: "high",
        intervalDays: 5,
        dueAt: "2026-08-12T00:00:00.000Z",
      }],
    },
  };
  const submission = scoreMockSubmission({
    order: ["QX1"],
    answers: { QX1: [0] },
    index: 0,
    endsAt: 0,
  }, [single], existing, "2026-08-08T00:00:00.000Z");

  assert.equal(submission.answered.QX1.attempts.length, 2);
  assert.equal(submission.answered.QX1.attempts[0].at, "2026-08-07T00:00:00.000Z");
  assert.equal(submission.answered.QX1.attempts[1].at, "2026-08-08T00:00:00.000Z");
  assert.equal(submission.answered.QX1.correct, false);
  assert.deepEqual(submission.wrong, ["QX1"]);
});

test("mock scoring keeps the existing partial-credit behavior", () => {
  const submission = scoreMockSubmission({
    order: ["QX1", "QX2"],
    answers: { QX1: [1], QX2: [0, 1] },
    index: 1,
    endsAt: 0,
  }, [single, multiple], {}, "2026-08-08T00:00:00.000Z");

  assert.equal(submission.result.points, 3);
  assert.equal(submission.result.total, 4);
  assert.equal(submission.result.percent, 75);
  assert.equal(submission.result.correct, 1);
  assert.deepEqual(submission.wrong, ["QX2"]);
});
