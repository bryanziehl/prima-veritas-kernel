import fs from "fs";
import path from "path";

// Mutation: insert deterministic duplicates into structured records.
// No randomness. Fixed insertion points.

const DATASET_DIR = process.cwd();
const INPUT_PATH = path.join(DATASET_DIR, "input.json");

const raw = JSON.parse(fs.readFileSync(INPUT_PATH, "utf8"));

if (!Array.isArray(raw)) {
  console.error("ERROR: input.json must contain an array.");
  process.exit(1);
}

const original = raw.slice();

// Deterministic duplicate pattern:
// - Clone record 10 and insert after 11
// - Clone record 250 and insert after 252
// - Duplicate final record once
// Always safe because baseline > 1000 entries.

const mutated = raw.slice();

function cloneAt(sourceIndex, insertAfter) {
  const clone = JSON.parse(JSON.stringify(original[sourceIndex]));
  mutated.splice(insertAfter, 0, clone);
}

cloneAt(10, 12);
cloneAt(250, 253);

// duplicate last entry
const lastClone = JSON.parse(JSON.stringify(original[original.length - 1]));
mutated.push(lastClone);

// Write back
fs.writeFileSync(INPUT_PATH, JSON.stringify(mutated, null, 2), "utf8");

console.log("Deterministic duplicates injected.");
console.log("Original length:", original.length);
console.log("New length:", mutated.length);
