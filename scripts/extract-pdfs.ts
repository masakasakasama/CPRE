import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(await readFile(join(root, "sources", "manifest.json"), "utf8"));
const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

for (const source of manifest.sources.filter((item: { enabled: boolean; usage: string; mediaType: string }) => item.enabled && item.usage === "extract" && item.mediaType === "application/pdf")) {
  const input = join(root, "data", "raw", source.id, source.version, `${source.id}.pdf`);
  const bytes = new Uint8Array(await readFile(input));
  const document = await pdfjs.getDocument({ data: bytes, disableWorker: true }).promise;
  const pages: { page: number; text: string }[] = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items.map((item) => "str" in item ? item.str : "").join(" ").replace(/\s+/g, " ").trim();
    pages.push({ page: pageNumber, text });
  }
  const fullText = pages.map((page) => page.text).join("\n");
  const educationalObjectives = Array.from(fullText.matchAll(/EO\s+(\d+\.\d+\.\d+)\s+(.{1,180}?)(?=\s+\(L[123]\))/g), (match) => ({ id: `EO ${match[1]}`, label: match[2].trim() }));
  const chapters = Array.from(fullText.matchAll(/(?:^|\s)([1-7])\s+([A-Z][A-Za-z ,&@-]{8,80}?)\s+\(L[123]\)/g), (match) => ({ id: Number(match[1]), title: match[2].trim() }));
  const terms = Array.from(fullText.matchAll(/Terms:\s*(.{1,500}?)(?=Educational objectives|EO\s+\d)/g), (match) => match[1].split(/,|;/).map((term) => term.trim()).filter(Boolean)).flat();
  const output = join(root, "data", "extracted", source.id, source.sha256, "structure.json");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify({ sourceId: source.id, version: source.version, sha256: source.sha256, pages, chapters, educationalObjectives, terms }, null, 2));
  console.log(`extracted ${source.id}: ${pages.length} pages, ${educationalObjectives.length} EOs`);
}
