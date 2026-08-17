import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const target = process.env.CPRE_MIGRATION_TARGET_URL;
  const token = process.env.CPRE_MIGRATION_TOKEN;
  if (!target || !token) return NextResponse.json({ error: "migration_disabled" }, { status: 404 });
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > 750_000) return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  const rawBody = await request.text();
  const response = await fetch(`${target.replace(/\/$/, "")}/api/migration/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-cpre-migration-token": token },
    body: rawBody,
    cache: "no-store",
  });
  return new NextResponse(response.body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("content-type") || "application/json" },
  });
}
