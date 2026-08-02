import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the CPRE study application shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>CPRE English Study<\/title>/i);
  assert.match(html, /Unofficial English-exam study app/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("contains a full practice bank and no starter dependency", async () => {
  const [data, additional, page, packageJson] = await Promise.all([
    readFile(new URL("../app/data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/additional-questions.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  const ids = data.match(/id: "Q\d{3}"/g) ?? [];
  assert.equal(ids.length, 45);
  assert.match(additional, /EO 7\.2\.1/);
  assert.match(page, /questions\.length/);
  assert.match(page, /75 \* 60 \* 1000/);
  assert.match(page, /前回の続き/);
  assert.match(page, /const APP_VERSION = "0\.11\.0"/);
  assert.match(page, /scrollIntoView\(\{ block: "start", behavior: "auto" \}\)/);
  assert.match(page, /選ぶと次の問題へ進む/);
  assert.match(page, /不正解として記録済み · 1日後にもう一度出す/);
  assert.match(page, /あなたの回答/);
  assert.match(page, /直前の問題に戻る/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview/);
});
