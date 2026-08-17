import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createDeviceClaim } from "../../progress-storage";

export const dynamic = "force-dynamic";

function secureMatch(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const expected = process.env.CPRE_SYNC_KEY || "";
  const received = request.headers.get("x-cpre-sync-key") || "";
  if (!expected || !secureMatch(received, expected)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userKey = `legacy:${createHash("sha256").update(expected).digest("hex")}`;
  const token = await createDeviceClaim(userKey);
  return NextResponse.json({ connectUrl: `${new URL(request.url).origin}/?connect=${encodeURIComponent(token)}` });
}
