/**
 * Prima Veritas Kernel — Determinism Test
 *
 * Responsibility:
 * Verifies that the complete kernel pipeline produces byte-for-byte
 * identical outputs across repeated executions.
 *
 * Determinism Guarantees:
 * - No randomness
 * - No timestamps
 * - No environment-dependent behavior
 * - Fixed ordering only
 *
 * Non-Goals / Refusals:
 * - Does not validate business correctness
 * - Does not interpret results
 * - Does not tolerate drift
 *
 * Stability Contract:
 * Any change that alters outputs here is a BREAKING CHANGE.
 * Golden outputs must be updated explicitly with justification.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import assert from "assert";
import { fileURLToPath } from "url";

import { ingestFile } from "../01_INGEST/ingest_file.mjs";
import { normalizeStructured } from "../02_NORMALIZE/normalize_structured.mjs";
import { atomizeEvents } from "../03_ATOMIZE/atomize_events.mjs";
import { buildLedger } from "../04_LEDGER/build_ledger.mjs";
import { replaySequence } from "../05_REPLAY/replay_sequence.mjs";

// HARD ROOT: anchor to kernel folder, never process.cwd()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const TEST_ROOT = path.join(ROOT, "09_TESTS");
const GOLDEN_INPUTS = path.join(TEST_ROOT, "golden_inputs");
const GOLDEN_OUTPUTS = path.join(TEST_ROOT, "golden_outputs");

const NORMALIZE_RULES_PATH = path.join(
  ROOT,
  "02_NORMALIZE",
  "normalize_rules.json"
);

const NORMALIZE_RULES = JSON.parse(
  fs.readFileSync(NORMALIZE_RULES_PATH, "utf8")
);

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function writeJSON(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), "utf8");
}

function runKernelPipeline(inputPath) {
  const raw = ingestFile(inputPath);

  const normalized = normalizeStructured(raw, NORMALIZE_RULES);

  // Atomize requires a sequence — test harness responsibility
  const sequence = Array.isArray(normalized)
    ? normalized
    : [normalized];

  const events = atomizeEvents(sequence);
  const ledger = buildLedger(events);
  const replay = replaySequence(ledger);

  return {
    raw,
    normalized,
    events,
    ledger,
    replay
  };
}

function snapshotOutputs(outputs) {
  const serialized = JSON.stringify(outputs, null, 2);
  return {
    bytes: Buffer.from(serialized, "utf8"),
    hash: sha256(serialized)
  };
}

console.log("Running Prima Veritas determinism test…");

// Ensure output dir exists (hermetic + avoids weird parent writes)
fs.mkdirSync(GOLDEN_OUTPUTS, { recursive: true });

const inputFiles = fs
  .readdirSync(GOLDEN_INPUTS)
  .filter(f => f.endsWith(".json"));

assert(inputFiles.length > 0, "No golden inputs found.");

for (const file of inputFiles) {
  const inputPath = path.join(GOLDEN_INPUTS, file);
  const goldenPath = path.join(GOLDEN_OUTPUTS, `${file}.golden.json`);

  const runA = snapshotOutputs(runKernelPipeline(inputPath));
  const runB = snapshotOutputs(runKernelPipeline(inputPath));

  assert.strictEqual(
    runA.hash,
    runB.hash,
    `Non-determinism detected for ${file}`
  );

  if (fs.existsSync(goldenPath)) {
    const golden = fs.readFileSync(goldenPath);
    const goldenHash = sha256(golden);

    assert.strictEqual(
      runA.hash,
      goldenHash,
      `Golden output mismatch for ${file}`
    );
  } else {
    writeJSON(goldenPath, JSON.parse(runA.bytes.toString("utf8")));
    console.warn(`Golden output created for ${file}`);
  }

  console.log(`✔ ${file} deterministic`);
}

console.log("All determinism tests passed.");
