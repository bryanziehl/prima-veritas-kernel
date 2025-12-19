/**
 * Prima Veritas Dataset Materializer — LA Court Baseline
 * NON-KERNEL CODE
 *
 * Responsibility
 * ---------------
 * Convert a pre-extracted ROA text timeline into deterministic kernel
 * atoms + ledger using only kernel modules. Produces a reproducible
 * dataset for baseline replay.
 *
 * Determinism Guarantees
 * -----------------------
 * - No randomness
 * - No timestamps
 * - Fixed line ordering
 * - Explicit text → record mapping only
 * - Kernel modules perform all deterministic transforms
 *
 * Non-Goals / Refusals
 * ---------------------
 * - Will not interpret legal meaning or intent
 * - Will not merge or infer events
 * - Will not repair malformed lines
 * - Will not modify kernel behavior
 * - Will not add heuristics or inference
 *
 * Stability Contract
 * -------------------
 * - This file is NON-KERNEL and may change freely
 * - Changes here do NOT require kernel version bumps
 * - Must continue to call kernel modules deterministically
 * - Must not alter any kernel invariant
 *
 * Canonical Rule
 * ---------------
 * expected_hash.txt MUST equal ledger.ledger_hash
 * (per pv_verify CLI contract and KERNEL_CHARTER)
 */

import fs from "fs";
import path from "path";
import { normalizeText } from "../../02_NORMALIZE/normalize_text.mjs";
import { atomizeEvents } from "../../03_ATOMIZE/atomize_events.mjs";
import { buildLedger } from "../../04_LEDGER/build_ledger.mjs";
import { replaySequence } from "../../05_REPLAY/replay_sequence.mjs";
import {
  kernel_version,
  spec_version,
  hash_algorithm
} from "../../00_SYSTEM/kernel_constants.mjs";

const DATASET_DIR = path.resolve(".");
const INPUT_PATH = path.join(DATASET_DIR, "input.txt");

// 1. RAW TEXT
const rawText = fs.readFileSync(INPUT_PATH, "utf8");

// 2. NORMALIZE TEXT
const normalizedText = normalizeText(rawText);

// 3. TEXT → RECORDS
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

// **NEW: Export canonical structured records so adversarial pipeline has input**
fs.writeFileSync("records.json", JSON.stringify(records, null, 2));

// 4. ATOMIZE
const atoms = atomizeEvents(records);
fs.writeFileSync("atoms.json", JSON.stringify(atoms, null, 2));

// 5. LEDGER
const ledger = buildLedger(atoms, {
  kernel_version,
  spec_version,
  hash_algorithm
});
fs.writeFileSync("ledger.json", JSON.stringify(ledger, null, 2));

// 6. EXPECTED HASH
fs.writeFileSync("expected_hash.txt", ledger.ledger_hash + "\n");

// 7. REPLAY
const replay = replaySequence(ledger);
fs.writeFileSync("replay.json", JSON.stringify(replay, null, 2));

console.log("LA COURT BASELINE MATERIALIZED (records.json emitted)");
