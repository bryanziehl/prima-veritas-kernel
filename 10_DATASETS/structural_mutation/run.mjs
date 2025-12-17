/**
 * Prima Veritas Dataset Runner — structural_mutation
 *
 * Responsibility
 * ---------------
 * Materializes a deterministic dataset by running the kernel pipeline
 * against a fixed local input file using declared normalization rules.
 *
 * Determinism Guarantees
 * ---------------------
 * - No randomness
 * - No timestamps
 * - No environment-dependent paths
 * - Fixed ordering only
 *
 * Non-Goals / Refusals
 * -------------------
 * - Will not infer meaning
 * - Will not clean or repair malformed input
 * - Will not depend on process.cwd()
 *
 * Stability Contract
 * ------------------
 * Changes are breaking and require dataset regeneration.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

import { ingestFile } from "../../01_INGEST/ingest_file.mjs";
import { normalizeStructured } from "../../02_NORMALIZE/normalize_structured.mjs";
import { atomizeEvents } from "../../03_ATOMIZE/atomize_events.mjs";
import { buildLedger } from "../../04_LEDGER/build_ledger.mjs";
import {
  kernel_version,
  spec_version,
  hash_algorithm
} from "../../00_SYSTEM/kernel_constants.mjs";

// --- deterministic dataset root
const __filename = fileURLToPath(import.meta.url);
const DATASET_DIR = path.dirname(__filename);
const INPUT_PATH = path.join(DATASET_DIR, "input.json");

// --- normalization rules (explicit, deterministic)
const NORMALIZE_RULES_PATH = path.join(
  DATASET_DIR,
  "..",
  "..",
  "02_NORMALIZE",
  "normalize_rules.json"
);

const NORMALIZE_RULES = JSON.parse(
  fs.readFileSync(NORMALIZE_RULES_PATH, "utf8")
);

function sha256(obj) {
  const serialized = JSON.stringify(obj);
  return crypto.createHash(hash_algorithm).update(serialized).digest("hex");
}

// 1. INGEST
const raw = ingestFile(INPUT_PATH);

// 2. NORMALIZE (rules REQUIRED)
const normalized = normalizeStructured(raw, NORMALIZE_RULES);

// 3. ATOMIZE
const sequence = Array.isArray(normalized) ? normalized : [normalized];
const atoms = atomizeEvents(sequence);

// 4. LEDGER
const ledger = buildLedger(atoms, {
  kernel_version,
  spec_version,
  hash_algorithm
});

// 5. FINAL HASH (kernel canonical)
const expected_hash = ledger.ledger_hash;

// WRITE FILES
fs.writeFileSync(
  path.join(DATASET_DIR, "atoms.json"),
  JSON.stringify(atoms, null, 2)
);

fs.writeFileSync(
  path.join(DATASET_DIR, "ledger.json"),
  JSON.stringify(ledger, null, 2)
);

fs.writeFileSync(
  path.join(DATASET_DIR, "expected_hash.txt"),
  expected_hash + "\n"
);

console.log("DATASET MATERIALIZED:");
console.log(" - atoms.json");
console.log(" - ledger.json");
console.log(" - expected_hash.txt");
