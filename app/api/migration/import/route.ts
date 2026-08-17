import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { parseActiveExam, parseProgress, type SyncDocument } from "../../../progress";
import { importMigrationBackup, readBackup } from "../../../progress-storage";

export const dynamic = "force-dynamic";

function secureMatch(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function userKey() {
  const key = process.env.CPRE_SYNC_KEY;
  return key ? `legacy:${createHash("sha256").update(key).digest("hex")}` : null;
}

export async function POST(request: Request) {
  const expected = process.env.CPRE_MIGRATION_TOKEN;
  const received = request.headers.get("x-cpre-migration-token") || "";
  if (!expected || !secureMatch(received, expected)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > 750_000) return NextResponse.json({ error: "payload_too_large" }, { status: 413 });

  let body: { rawProgress?: unknown; rawActiveExam?: unknown; rawLocalSavedAt?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (typeof body.rawProgress !== "string" || (body.rawActiveExam !== null && typeof body.rawActiveExam !== "string" && body.rawActiveExam !== undefined)) {
    return NextResponse.json({ error: "invalid_raw_backup" }, { status: 400 });
  }

  let progress;
  let activeExam = null;
  try {
    progress = parseProgress(JSON.parse(body.rawProgress));
    activeExam = typeof body.rawActiveExam === "string" ? parseActiveExam(JSON.parse(body.rawActiveExam)) : null;
  } catch {
    progress = null;
  }
  if (!progress || (typeof body.rawActiveExam === "string" && !activeExam)) {
    return NextResponse.json({ error: "invalid_progress" }, { status: 400 });
  }

  const key = userKey();
  if (!key) return NextResponse.json({ error: "sync_not_configured" }, { status: 503 });
  const savedAt = typeof body.rawLocalSavedAt === "string" ? body.rawLocalSavedAt : new Date().toISOString();
  const document: SyncDocument = { schema: 1, savedAt, progress, activeExam };
  const raw = {
    rawProgress: body.rawProgress,
    rawActiveExam: typeof body.rawActiveExam === "string" ? body.rawActiveExam : null,
    rawLocalSavedAt: typeof body.rawLocalSavedAt === "string" ? body.rawLocalSavedAt : null,
  };

  const imported = await importMigrationBackup(key, raw, document);
  const backup = await readBackup(imported.backup);
  if (!backup || backup.raw_progress !== raw.rawProgress || (backup.raw_active_exam ?? null) !== raw.rawActiveExam || (backup.raw_local_saved_at ?? null) !== raw.rawLocalSavedAt) {
    return NextResponse.json({ error: "backup_verification_failed" }, { status: 500 });
  }

  const origin = new URL(request.url).origin;
  return NextResponse.json({
    backupSha256: imported.backup,
    document: imported.document,
    redirectUrl: `${origin}/?claim=${encodeURIComponent(imported.claim)}`,
  });
}
