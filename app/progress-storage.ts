import { neon } from "@neondatabase/serverless";
import { createHash, randomBytes } from "node:crypto";
import { mergeSyncDocument } from "./progress-merge";
import { parseSyncDocument, type SyncDocument } from "./progress";

type StoredRow = { document: unknown; revision: number };

function database() {
  const url = process.env.DATABASE_URL;
  return url ? neon(url) : null;
}

async function ensureTables(sql: NonNullable<ReturnType<typeof database>>) {
  await sql`
    CREATE TABLE IF NOT EXISTS cpre_progress (
      user_key TEXT PRIMARY KEY,
      document JSONB NOT NULL,
      saved_at TEXT NOT NULL,
      revision INTEGER NOT NULL DEFAULT 1,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS cpre_progress_backups (
      backup_sha256 TEXT PRIMARY KEY,
      user_key TEXT NOT NULL,
      raw_progress TEXT NOT NULL,
      raw_active_exam TEXT,
      raw_local_saved_at TEXT,
      imported_document JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS cpre_migration_claims (
      token_sha256 TEXT PRIMARY KEY,
      user_key TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      claimed_at TIMESTAMPTZ
    )
  `;
}

export function hasPostgresStorage() {
  return Boolean(process.env.DATABASE_URL);
}

export async function readPostgres(userKey: string) {
  const sql = database();
  if (!sql) throw new Error("postgres_not_configured");
  await ensureTables(sql);
  const rows = await sql`SELECT document, revision FROM cpre_progress WHERE user_key = ${userKey} LIMIT 1` as StoredRow[];
  if (!rows[0]) return { document: null, revision: 0 };
  const document = parseSyncDocument(rows[0].document);
  if (!document) throw new Error("postgres_invalid_progress");
  return { document, revision: Number(rows[0].revision) };
}

export async function writePostgres(userKey: string, incoming: SyncDocument) {
  const sql = database();
  if (!sql) throw new Error("postgres_not_configured");
  await ensureTables(sql);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const current = await readPostgres(userKey);
    const merged = mergeSyncDocument(current.document, incoming);
    if (current.revision === 0) {
      const inserted = await sql`
        INSERT INTO cpre_progress (user_key, document, saved_at, revision)
        VALUES (${userKey}, ${JSON.stringify(merged)}::jsonb, ${merged.savedAt}, 1)
        ON CONFLICT (user_key) DO NOTHING
        RETURNING revision
      `;
      if (inserted.length) return { merged, revision: 1 };
    } else {
      const updated = await sql`
        UPDATE cpre_progress
        SET document = ${JSON.stringify(merged)}::jsonb,
            saved_at = ${merged.savedAt},
            revision = revision + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_key = ${userKey} AND revision = ${current.revision}
        RETURNING revision
      ` as { revision: number }[];
      if (updated[0]) return { merged, revision: Number(updated[0].revision) };
    }
  }
  throw new Error("postgres_write_conflict");
}

export type RawMigrationBackup = {
  rawProgress: string;
  rawActiveExam: string | null;
  rawLocalSavedAt: string | null;
};

export function backupSha256(raw: RawMigrationBackup) {
  return createHash("sha256").update(JSON.stringify(raw)).digest("hex");
}

export async function importMigrationBackup(userKey: string, raw: RawMigrationBackup, document: SyncDocument) {
  const sql = database();
  if (!sql) throw new Error("postgres_not_configured");
  await ensureTables(sql);
  const backup = backupSha256(raw);
  await sql`
    INSERT INTO cpre_progress_backups
      (backup_sha256, user_key, raw_progress, raw_active_exam, raw_local_saved_at, imported_document)
    VALUES
      (${backup}, ${userKey}, ${raw.rawProgress}, ${raw.rawActiveExam}, ${raw.rawLocalSavedAt}, ${JSON.stringify(document)}::jsonb)
    ON CONFLICT (backup_sha256) DO NOTHING
  `;
  const saved = await writePostgres(userKey, document);
  const claim = randomBytes(32).toString("base64url");
  const claimHash = createHash("sha256").update(claim).digest("hex");
  await sql`
    INSERT INTO cpre_migration_claims (token_sha256, user_key, expires_at)
    VALUES (${claimHash}, ${userKey}, CURRENT_TIMESTAMP + INTERVAL '24 hours')
  `;
  return { backup, claim, document: saved.merged };
}

export async function claimMigration(token: string) {
  const sql = database();
  if (!sql) throw new Error("postgres_not_configured");
  await ensureTables(sql);
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const rows = await sql`
    UPDATE cpre_migration_claims
    SET claimed_at = CURRENT_TIMESTAMP
    WHERE token_sha256 = ${tokenHash}
      AND claimed_at IS NULL
      AND expires_at > CURRENT_TIMESTAMP
    RETURNING user_key
  ` as { user_key: string }[];
  return rows[0]?.user_key ?? null;
}

export async function readBackup(backup: string) {
  const sql = database();
  if (!sql) throw new Error("postgres_not_configured");
  await ensureTables(sql);
  const rows = await sql`
    SELECT backup_sha256, raw_progress, raw_active_exam, raw_local_saved_at, imported_document
    FROM cpre_progress_backups WHERE backup_sha256 = ${backup} LIMIT 1
  `;
  return rows[0] ?? null;
}
