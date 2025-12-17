/**
 * Prima Veritas Dataset — LA Court Baseline
 *
 * Responsibility
 * ---------------
 * Convert a large, pre-extracted ROA text timeline into
 * a deterministic kernel ledger for baseline replay.
 *
 * Determinism Guarantees
 * ---------------------
 * - No randomness
 * - No timestamps added
 * - Fixed line ordering
 * - Explicit text → record mapping only
 *
 * Non-Goals
 * ---------
 * - Will not interpret legal meaning
 * - Will not merge or infer events
 * - Will not repair malformed lines
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

// 3. EXPLICIT TEXT → RECORD SEQUENCE
const records = normalizedText
  .split("\n")
  .filter(line => line.trim().length > 0)
  .map((line, index) => ({
    event_id: `line:${index}`,
    sequence_index: index,
    timestamp: null,
    source: {
      origin: "la_court_roa",
      location: `line_${index}`
    },
    payload: {
      text: line
    },
    provenance: {
      ingest_id: "la_court_baseline",
      normalize_id: "normalize_text"
    },
    notes: null
  }));

// 4. ATOMIZE
const atoms = atomizeEvents(records);

// 5. LEDGER
const ledger = buildLedger(atoms, {
  kernel_version,
  spec_version,
  hash_algorithm
});

// 6. EXPECTED HASH
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

console.log("LA COURT BASELINE MATERIALIZED");
