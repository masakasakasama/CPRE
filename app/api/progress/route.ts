import { Buffer } from "node:buffer";
import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { mergeSyncDocument } from "../../progress-merge";
import { parseSyncDocument, type SyncDocument } from "../../progress";
import { hasPostgresStorage, readPostgres, writePostgres } from "../../progress-storage";

export const dynamic = "force-dynamic";

const repository = process.env.GITHUB_PROGRESS_REPOSITORY || "masakasakasama/CPRE-data";
const filePath = process.env.GITHUB_PROGRESS_PATH || "progress.json";
const branch = process.env.GITHUB_PROGRESS_BRANCH || "main";

type D1Statement = {
  bind: (...values: (string | number | null)[]) => D1Statement;
  first: <T>() => Promise<T | null>;
  run: () => Promise<unknown>;
};

type D1DatabaseLike = {
  prepare: (sql: string) => D1Statement;
};

function secureMatch(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function hashedKey(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function userKey(request: Request) {
  const email = request.headers.get("oai-authenticated-user-email")?.trim().toLowerCase();
  if (email) return `chatgpt:${hashedKey(email)}`;

  const expected = process.env.CPRE_SYNC_KEY;
  const received = request.headers.get("x-cpre-sync-key");
  if (expected && received && secureMatch(received, expected)) return `legacy:${hashedKey(expected)}`;
  return null;
}

async function d1Database(): Promise<D1DatabaseLike | null> {
  try {
    const workers = await import("cloudflare:workers");
    return (workers.env as unknown as { DB?: D1DatabaseLike }).DB ?? null;
  } catch {
    return null;
  }
}

async function ensureD1(db: D1DatabaseLike) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS cpre_progress (
      user_key TEXT PRIMARY KEY,
      document TEXT NOT NULL,
      saved_at TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

async function readD1(db: D1DatabaseLike, key: string) {
  await ensureD1(db);
  const row = await db.prepare("SELECT document FROM cpre_progress WHERE user_key = ? LIMIT 1").bind(key).first<{ document: string }>();
  if (!row?.document) return { document: null };
  const parsed = parseSyncDocument(JSON.parse(row.document));
  if (!parsed) throw new Error("d1_invalid_progress");
  return { document: parsed };
}

async function writeD1(db: D1DatabaseLike, key: string, incoming: SyncDocument) {
  const current = await readD1(db, key);
  const merged = mergeSyncDocument(current.document, incoming);
  await db.prepare(`
    INSERT INTO cpre_progress (user_key, document, saved_at, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_key) DO UPDATE SET
      document = excluded.document,
      saved_at = excluded.saved_at,
      updated_at = CURRENT_TIMESTAMP
  `).bind(key, JSON.stringify(merged), merged.savedAt).run();
  return { merged, commit: null };
}

function githubHeaders(request: Request) {
  const token = process.env.GITHUB_PROGRESS_TOKEN || request.headers.get("x-cpre-github-token");
  if (!token) return null;
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "CPRE-English-Study",
  };
}

async function readGitHubRemote(request: Request) {
  const headers = githubHeaders(request);
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

async function writeGitHubMergedRemote(request: Request, incoming: SyncDocument) {
  const headers = githubHeaders(request);
  if (!headers) throw new Error("sync_not_configured");

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const current = await readGitHubRemote(request);
    const merged = mergeSyncDocument(current.document, incoming);
    const body = {
      message: `Save CPRE progress ${merged.savedAt}`,
      content: Buffer.from(`${JSON.stringify(merged, null, 2)}\n`, "utf8").toString("base64"),
      branch,
      ...(current.sha ? { sha: current.sha } : {}),
    };
    const response = await fetch(`https://api.github.com/repos/${repository}/contents/${filePath}`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      const payload = await response.json() as { commit?: { sha?: string } };
      return { merged, commit: payload.commit?.sha || null };
    }
    if (response.status === 409 && attempt === 0) continue;
    throw new Error(`github_write_${response.status}`);
  }

  throw new Error("github_write_conflict");
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "sync_failed";
  if (message === "sync_not_configured") return NextResponse.json({ error: message }, { status: 503 });
  return NextResponse.json({ error: message }, { status: 502 });
}

export async function GET(request: Request) {
  const key = userKey(request);
  if (!key) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    if (hasPostgresStorage()) {
      const remote = await readPostgres(key);
      return NextResponse.json({ exists: Boolean(remote.document), document: remote.document, storage: "postgres" });
    }
    const db = await d1Database();
    const remote = db ? await readD1(db, key) : await readGitHubRemote(request);
    return NextResponse.json({ exists: Boolean(remote.document), document: remote.document, storage: db ? "d1" : "github" });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request) {
  const key = userKey(request);
  if (!key) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > 250_000) return NextResponse.json({ error: "payload_too_large" }, { status: 413 });

  let document: SyncDocument | null;
  try {
    document = parseSyncDocument(await request.json());
  } catch {
    document = null;
  }
  if (!document) return NextResponse.json({ error: "invalid_progress" }, { status: 400 });

  try {
    if (hasPostgresStorage()) {
      const saved = await writePostgres(key, document);
      return NextResponse.json({ savedAt: saved.merged.savedAt, commit: null, storage: "postgres" });
    }
    const db = await d1Database();
    const saved = db ? await writeD1(db, key, document) : await writeGitHubMergedRemote(request, document);
    return NextResponse.json({ savedAt: saved.merged.savedAt, commit: saved.commit, storage: db ? "d1" : "github" });
  } catch (error) {
    return errorResponse(error);
  }
}
