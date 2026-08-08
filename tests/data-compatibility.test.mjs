import assert from "node:assert/strict";
import test from "node:test";
import {
  EXAM_KEY,
  GITHUB_TOKEN_STORAGE,
  INTRO_KEY,
  LOCAL_SAVED_AT_KEY,
  STORAGE_KEY,
  SYNC_KEY_STORAGE,
} from "../app/app-config.ts";
import { questions } from "../app/data.ts";
import { initialProgress } from "../app/progress.ts";

test("persisted browser keys and progress schema stay compatible", () => {
  assert.equal(STORAGE_KEY, "cpre-english-study:v1");
  assert.equal(EXAM_KEY, "cpre-english-study:exam:v1");
  assert.equal(INTRO_KEY, "cpre-english-study:intro:v1");
  assert.equal(LOCAL_SAVED_AT_KEY, "cpre-english-study:saved-at:v1");
  assert.equal(SYNC_KEY_STORAGE, "cpre-english-study:sync-key");
  assert.equal(GITHUB_TOKEN_STORAGE, "cpre-english-study:github-token");
  assert.equal(initialProgress.schema, 1);
});

test("expanded question bank keeps stable unique IDs", () => {
  assert.equal(questions.length, 185);
  assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);
});
