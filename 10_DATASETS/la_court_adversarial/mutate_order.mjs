import fs from "fs";
import path from "path";

// Deterministic shuffle using a fixed seed
function seededShuffle(array, seed = 12345) {
  let result = array.slice();
  let m = result.length, t, i;

  function random() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  while (m) {
    i = Math.floor(random() * m--);
    t = result[m];
    result[m] = result[i];
    result[i] = t;
  }

  return result;
}

// Paths
const baseDir = process.cwd();
const inputPath = path.join(baseDir, "input.txt");

// Load baseline input (raw ROA text)
const rawLines = fs.readFileSync(inputPath, "utf-8")
  .split("\n");

// Apply deterministic shuffle
const shuffled = seededShuffle(rawLines);

// Write mutated dataset back to input.txt
fs.writeFileSync(inputPath, shuffled.join("\n"), "utf-8");

console.log("Deterministic ordering mutation applied.");
console.log("Original length:", rawLines.length);
console.log("Shuffled length:", shuffled.length);
