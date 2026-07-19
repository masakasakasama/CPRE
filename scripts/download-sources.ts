import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(await readFile(join(root, "sources", "manifest.json"), "utf8"));
const allowedHosts = new Set(["cpre.ireb.org", "cockpit-v1.ireb.org", "cockpit.ireb.org"]);
const propose = process.argv.includes("--propose");
const idArg = process.argv.find((item) => item.startsWith("--id="))?.slice(5);

async function fetchOfficial(url: string) {
  let current = new URL(url);
  for (let redirects = 0; redirects < 6; redirects += 1) {
    if (current.protocol !== "https:" || !allowedHosts.has(current.hostname)) throw new Error(`Blocked source host: ${current.hostname}`);
    const response = await fetch(current, { redirect: "manual", signal: AbortSignal.timeout(30_000) });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error(`Redirect without location: ${current}`);
      current = new URL(location, current);
      continue;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${current}`);
    return { response, finalUrl: current };
  }
  throw new Error("Too many redirects");
}

for (const source of manifest.sources.filter((item: { enabled: boolean; id: string }) => item.enabled && (!idArg || item.id === idArg))) {
  const { response, finalUrl } = await fetchOfficial(source.downloadUrl);
  const type = response.headers.get("content-type")?.split(";")[0];
  if (type !== source.mediaType && !(source.mediaType === "application/pdf" && type === "application/octet-stream")) throw new Error(`${source.id}: unexpected MIME ${type}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > 15 * 1024 * 1024) throw new Error(`${source.id}: file exceeds 15 MiB`);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  if (propose) {
    console.log(`${source.id} ${source.version} ${sha256} ${finalUrl}`);
    continue;
  }
  if (!/^[a-f0-9]{64}$/.test(source.sha256)) throw new Error(`${source.id}: manifest SHA-256 is not pinned; run with --propose`);
  if (sha256 !== source.sha256) throw new Error(`${source.id}: SHA-256 mismatch (expected ${source.sha256}, received ${sha256})`);
  const extension = extname(finalUrl.pathname) || (source.mediaType === "application/pdf" ? ".pdf" : ".zip");
  const output = join(root, "data", "raw", source.id, source.version, `${source.id}${extension}`);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, bytes);
  console.log(`verified ${source.id} ${source.version} ${sha256}`);
}
