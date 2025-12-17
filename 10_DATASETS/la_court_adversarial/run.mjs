/**
 * Prima Veritas Dataset — LA Court Adversarial
 *
 * Responsibility
 * ---------------
 * Convert a large, pre-extracted ROA text timeline into
 * a deterministic kernel ledger under adversarial ordering.
 *
 * This dataset intentionally violates input ordering to test
 * kernel stability, replay guarantees, and hash invariance.
 *
 * Determinism Guarantees
 * ---------------------
 * - No randomness
 * - No timestamps added
 * - Deterministic adversarial ordering (lexicographic sort)
 * - Explicit text → record mapping only
 *
 * Non-Goals
 * ---------
 * - Will not interpret legal meaning
 * - Will not merge or infer events
 * - Will not repair malformed lines
 * - Will not attempt to restore original order
 *
 * Stability Contract
 * ------------------
 * - This file is test-only and non-canonical
 * - Any change must preserve deterministic adversarial behavior
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

import { normalizeText } from "../../02_NORMALIZE/normalize_text.mjs";
import { atomizeEvents } from "../../03_ATOMIZE/atomize_events.mjs";
import { buildLedger } from "../../04_LEDGER/build_ledger.mjs";
import {
  kernel_version,
  spec_version,
  hash_algorithm
} from "../../00_SYSTEM/kernel_constants.mjs";

const DATASET_DIR = path.resolve(".");
const INPUT_PATH = path.join(DATASET_DIR, "input.txt");

function sha256(obj) {
  return crypto
    .createHash(hash_algorithm)
    .update(JSON.stringify(obj))
    .digest("hex");
}

// 1. READ RAW TEXT (dataset responsibility)
const rawText = fs.readFileSync(INPUT_PATH, "utf8");

// 2. NORMALIZE TEXT
const normalizedText = normalizeText(rawText);

// 3. BASELINE TEXT LINES
const lines = normalizedText
  .split("\n")
  .filter(line => line.trim().length > 0);

// 4. ADVERSARIAL TRANSFORM (deterministic reorder)
const adversarialLines = [...lines].sort();

// 5. EXPLICIT TEXT → RECORD SEQUENCE
const records = adversarialLines.map((line, index) => ({
  event_id: crypto
    .createHash(hash_algorithm)
    .update(line)
    .digest("hex"),
  sequence_index: index,
  timestamp: null,
  source: {
    origin: "la_court_roa",
    location: `sorted_line_${index}`
  },
  payload: {
    text: line
  },
  provenance: {
    ingest_id: "la_court_adversarial",
    normalize_id: "normalize_text"
  },
  notes: null
}));

// 6. ATOMIZE
const atoms = atomizeEvents(records);

// 7. LEDGER
const ledger = buildLedger(atoms, {
  kernel_version,
  spec_version,
  hash_algorithm
});

// 8. EXPECTED HASH (kernel canonical)
const expected_hash = sha256({
  kernel_version,
  spec_version,
  hash_algorithm,
  ledger_hash: ledger.ledger_hash
});

// WRITE FILES
fs.writeFileSync("atoms.json", JSON.stringify(atoms, null, 2));
fs.writeFileSync("ledger.json", JSON.stringify(ledger, null, 2));
fs.writeFileSync("expected_hash.txt", expected_hash + "\n");

console.log("LA COURT ADVERSARIAL DATASET MATERIALIZED");
