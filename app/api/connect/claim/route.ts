import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { claimDevice } from "../../../progress-storage";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let token = "";
  try {
    const body = await request.json() as { token?: unknown };
    if (typeof body.token === "string") token = body.token;
  } catch { /* handled below */ }
  if (!token) return NextResponse.json({ error: "invalid_claim" }, { status: 400 });
  const expected = process.env.CPRE_SYNC_KEY;
  if (!expected) return NextResponse.json({ error: "sync_not_configured" }, { status: 503 });
  const claimedUser = await claimDevice(token);
  const expectedUser = `legacy:${createHash("sha256").update(expected).digest("hex")}`;
  if (!claimedUser || claimedUser !== expectedUser) return NextResponse.json({ error: "invalid_claim" }, { status: 401 });
  return NextResponse.json({ syncKey: expected });
}
