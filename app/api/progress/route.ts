import { timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";
import { NextResponse } from "next/server";
import { parseSyncDocument } from "../../progress";

export const dynamic = "force-dynamic";

const repository = process.env.GITHUB_PROGRESS_REPOSITORY || "masakasakasama/CPRE-data";
const filePath = process.env.GITHUB_PROGRESS_PATH || "progress.json";
const branch = process.env.GITHUB_PROGRESS_BRANCH || "main";

function secureMatch(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function isAuthorized(request: Request) {
  if (process.env.OAI_SITE_AUTH === "true" && request.headers.get("oai-authenticated-user-email")) return true;
  const expected = process.env.CPRE_SYNC_KEY;
  const received = request.headers.get("x-cpre-sync-key");
  return Boolean(expected && received && secureMatch(received, expected));
}

function githubHeaders() {
  const token = process.env.GITHUB_PROGRESS_TOKEN;
  if (!token) return null;
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "CPRE-English-Study",
  };
}

async function readRemote() {
  const headers = githubHeaders();
  if (!headers) throw new Error("sync_not_configured");
  const response = await fetch(`https://api.github.com/repos/${repository}/contents/${filePath}?ref=${encodeURIComponent(branch)}`, { headers, cache: "no-store" });
  if (response.status === 404) return { document: null, sha: null };
  if (!response.ok) throw new Error(`github_read_${response.status}`);
  const payload = await response.json() as { content?: string; sha?: string };
  if (!payload.content || !payload.sha) throw new Error("github_invalid_response");
  const decoded = JSON.parse(Buffer.from(payload.content.replace(/\n/g, ""), "base64").toString("utf8"));
  const document = parseSyncDocument(decoded);
  if (!document) throw new Error("github_invalid_progress");
  return { document, sha: payload.sha };
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "sync_failed";
  if (message === "sync_not_configured") return NextResponse.json({ error: message }, { status: 503 });
  return NextResponse.json({ error: message }, { status: 502 });
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const remote = await readRemote();
    return NextResponse.json({ exists: Boolean(remote.document), document: remote.document });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > 250_000) return NextResponse.json({ error: "payload_too_large" }, { status: 413 });

  let document;
  try {
    document = parseSyncDocument(await request.json());
  } catch {
    document = null;
  }
  if (!document) return NextResponse.json({ error: "invalid_progress" }, { status: 400 });

  try {
    const headers = githubHeaders();
    if (!headers) throw new Error("sync_not_configured");
    const current = await readRemote();
    const body = {
      message: `Save CPRE progress ${document.savedAt}`,
      content: Buffer.from(`${JSON.stringify(document, null, 2)}\n`, "utf8").toString("base64"),
      branch,
      ...(current.sha ? { sha: current.sha } : {}),
    };
    const response = await fetch(`https://api.github.com/repos/${repository}/contents/${filePath}`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`github_write_${response.status}`);
    const payload = await response.json() as { commit?: { sha?: string } };
    return NextResponse.json({ savedAt: document.savedAt, commit: payload.commit?.sha || null });
  } catch (error) {
    return errorResponse(error);
  }
}
