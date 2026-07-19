import assert from "node:assert/strict";
import test from "node:test";
import { initialProgress, makeSyncDocument, parseSyncDocument } from "../app/progress.ts";

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
