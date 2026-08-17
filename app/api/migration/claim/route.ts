import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { claimMigration } from "../../../progress-storage";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const syncKey = process.env.CPRE_SYNC_KEY;
  if (!syncKey) return NextResponse.json({ error: "sync_not_configured" }, { status: 503 });
  let token = "";
  try {
    const body = await request.json() as { token?: unknown };
    token = typeof body.token === "string" ? body.token : "";
  } catch { /* Invalid input is handled below. */ }
  if (!token) return NextResponse.json({ error: "invalid_claim" }, { status: 400 });
  const claimedUser = await claimMigration(token);
  const expectedUser = `legacy:${createHash("sha256").update(syncKey).digest("hex")}`;
  if (!claimedUser || claimedUser !== expectedUser) return NextResponse.json({ error: "invalid_claim" }, { status: 401 });
  return NextResponse.json({ syncKey });
}
