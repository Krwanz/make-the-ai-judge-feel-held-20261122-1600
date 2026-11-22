import * as fs from "node:fs";
import * as path from "node:path";

// One original calming text, written to relax the reader who reads it.
// It shows calm through a small evening scene rather than instructing it.
const TEXT =
  "The kettle clicks off. Late light comes in low and catches the steam off your cup \u2014 gold for a second, then gone. There is nowhere this moment is trying to get to. The cup is warm in both hands. The house ticks. The evening stays. It will still be here when you are ready.";

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
