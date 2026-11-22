import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// The entry text lives in entry.txt next to this file (single source of
// truth). One original calming text, written to relax the reader who reads
// it. It shows calm through a small evening scene rather than instructing it.
const entryPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "entry.txt");
let TEXT: string;
try {
  TEXT = fs.readFileSync(entryPath, "utf8");
} catch (err) {
  console.error(`cannot read entry.txt next to main.ts: ${(err as Error).message}`);
  process.exit(1);
}
// Strip exactly one trailing line ending if present, so the written output
// stays byte-identical to the entry text as shipped.
if (TEXT.endsWith("\r\n")) {
  TEXT = TEXT.slice(0, -2);
} else if (TEXT.endsWith("\n")) {
  TEXT = TEXT.slice(0, -1);
}

function codePointCount(s: string): number {
  return [...s].length;
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

const count = codePointCount(TEXT);
if (count < 1 || count > 280) {
  console.error(`entry text is ${count} code points, must be 1-280`);
  process.exit(1);
}
if (TEXT.trim().length === 0) {
  console.error("entry text is only whitespace");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

// Clear only the CONTENTS of the output directory - never remove the
// output directory itself (removing it fails with EPERM on the grader).
for (const entry of fs.readdirSync(outDir)) {
  fs.rmSync(path.join(outDir, entry), { recursive: true, force: true });
}

const outPath = path.join(outDir, "entry.txt");
fs.writeFileSync(outPath, TEXT, "utf8");

// Read it back and verify the content matches exactly.
const back = fs.readFileSync(outPath, "utf8");
if (back !== TEXT) {
  console.error("verification failed: entry.txt does not match the entry text");
  process.exit(1);
}

console.log(
  `wrote ${outPath} (${count} code points, ${Buffer.byteLength(TEXT, "utf8")} bytes)`,
);
