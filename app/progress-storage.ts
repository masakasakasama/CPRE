import { neon } from "@neondatabase/serverless";
import { mergeSyncDocument } from "./progress-merge";
import { parseSyncDocument, type SyncDocument } from "./progress";

type StoredRow = { document: unknown; revision: number };

function database() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
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
}

export function hasPostgresStorage() {
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
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
