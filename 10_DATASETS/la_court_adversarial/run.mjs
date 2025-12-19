/**
 * Prima Veritas Dataset Materializer — LA Court Adversarial
 * NON-KERNEL CODE
 *
 * Responsibility
 * ---------------
 * Read the already-shuffled input.json (structured records),
 * apply canonical structured normalization,
 * then run the full kernel pipeline:
 * normalize → atomize → ledger → replay.
 *
 * Determinism Notes
 * ------------------
 * - Ordering mutation already applied by mutate_order.mjs
 * - No randomness here
 * - Must match baseline structured schema exactly
 */

import fs from "fs";
import path from "path";

import { normalizeStructured } from "../../02_NORMALIZE/normalize_structured.mjs";
import { atomizeEvents } from "../../03_ATOMIZE/atomize_events.mjs";
import { buildLedger } from "../../04_LEDGER/build_ledger.mjs";
import { replaySequence } from "../../05_REPLAY/replay_sequence.mjs";

import {
  kernel_version,
  spec_version,
  hash_algorithm
} from "../../00_SYSTEM/kernel_constants.mjs";

const DATASET_DIR = path.resolve(".");
const INPUT_PATH = path.join(DATASET_DIR, "input.json");

// 1. READ SHUFFLED STRUCTURED INPUT
const raw = JSON.parse(fs.readFileSync(INPUT_PATH, "utf8"));

if (!Array.isArray(raw)) {
  console.error("ERROR: input.json must contain an array of structured records.");
  process.exit(1);
}

// 2. NORMALIZE (canonical structured normalization)
const normalized = raw.map((record, index) =>
  normalizeStructured(record, {
    ingest_id: "la_court_adversarial",
    sequence_index: index
  })
);

// 3. ATOMIZE
const atoms = atomizeEvents(normalized);
fs.writeFileSync("atoms.json", JSON.stringify(atoms, null, 2));

// 4. LEDGER
const ledger = buildLedger(atoms, {
  kernel_version,
  spec_version,
  hash_algorithm
});
fs.writeFileSync("ledger.json", JSON.stringify(ledger, null, 2));

// 5. EXPECTED HASH
fs.writeFileSync("expected_hash.txt", ledger.ledger_hash + "\n");

// 6. REPLAY
const replay = replaySequence(ledger);
fs.writeFileSync("replay.json", JSON.stringify(replay, null, 2));

console.log("LA COURT ADVERSARIAL MATERIALIZED");
