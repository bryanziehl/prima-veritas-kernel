import fs from "fs";
import path from "path";

const baseDir = process.cwd();
const inputPath = path.join(baseDir, "input.json");

// Load original records (copied from baseline)
const raw = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

if (!Array.isArray(raw)) {
  console.error("ERROR: input.json must contain an array.");
  process.exit(1);
}

// Remove a deterministic slice (events 200–204)
const cleaned = [
  ...raw.slice(0, 200),
  ...raw.slice(205)
];

fs.writeFileSync(
  inputPath,
  JSON.stringify(cleaned, null, 2),
  "utf8"
);

console.log("Deterministic removals applied.");
console.log("Original length:", raw.length);
console.log("New length:", cleaned.length);
