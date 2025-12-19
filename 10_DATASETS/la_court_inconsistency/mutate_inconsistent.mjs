import fs from "fs";
import path from "path";

// deterministic selection
function seededIndex(max, seed = 98765) {
  seed = (seed * 16807) % 2147483647;
  return seed % max;
}

const baseDir = process.cwd();
const inputPath = path.join(baseDir, "input.json");

// load baseline structured records
const raw = JSON.parse(fs.readFileSync(inputPath, "utf8"));
if (!Array.isArray(raw)) {
  console.error("ERROR: input.json must contain an array of records.");
  process.exit(1);
}

let mutated = JSON.parse(JSON.stringify(raw)); // deep clone

// pick deterministic indices
const idxDate = seededIndex(mutated.length, 11111);
const idxActor = seededIndex(mutated.length, 22222);
const idxScope = seededIndex(mutated.length, 33333);

// 1) DATE DRIFT (+1 day)
if (mutated[idxDate].payload?.text?.includes("date:")) {
  mutated[idxDate].payload.text = mutated[idxDate].payload.text.replace(
    /date:\s*(\d{4}-\d{2}-\d{2})/,
    (m, d) => {
      const dt = new Date(d + "T00:00:00Z");
      dt.setUTCDate(dt.getUTCDate() + 1);
      const shifted = dt.toISOString().slice(0, 10);
      return `date: ${shifted}`;
    }
  );
}

// 2) ACTOR TYPO (Aurice → Aurince) if present
if (mutated[idxActor].payload?.text?.includes("actor: Aurice")) {
  mutated[idxActor].payload.text = mutated[idxActor].payload.text.replace(
    "actor: Aurice",
    "actor: Aurince"
  );
}

// 3) SCOPE mismatch (Entire action → Entire case)
if (mutated[idxScope].payload?.text?.includes("scope: Entire action")) {
  mutated[idxScope].payload.text = mutated[idxScope].payload.text.replace(
    "scope: Entire action",
    "scope: Entire case"
  );
}

fs.writeFileSync(inputPath, JSON.stringify(mutated, null, 2), "utf8");

console.log("Realistic inconsistencies injected:");
console.log(" - timestamp drift");
console.log(" - actor typo");
console.log(" - scope mismatch");
console.log("Done.");
