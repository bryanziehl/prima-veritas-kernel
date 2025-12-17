import fs from "fs";
import path from "path";

import { ingestFile } from "../../01_INGEST/ingest_file.mjs";
import { normalizeStructured } from "../../02_NORMALIZE/normalize_structured.mjs";
import { atomizeEvents } from "../../03_ATOMIZE/atomize_events.mjs";
import { buildLedger } from "../../04_LEDGER/build_ledger.mjs";
import { replaySequence } from "../../05_REPLAY/replay_sequence.mjs";

const ROOT = path.resolve(".");
const DATASET_DIR = path.join(
  ROOT,
  "10_DATASETS",
  "adversarial_reorder"
);

const INPUT = path.join(DATASET_DIR, "input.json");
const NORMALIZE_RULES = JSON.parse(
  fs.readFileSync(path.join("02_NORMALIZE", "normalize_rules.json"), "utf8")
);

// 1. ingest
const raw = ingestFile(INPUT);

// 2. normalize
const normalized = normalizeStructured(raw, NORMALIZE_RULES);
const sequence = Array.isArray(normalized) ? normalized : [normalized];

// 3. atomize
const atoms = atomizeEvents(sequence);

// 4. ledger
const ledger = buildLedger(atoms);

// 5. replay
const replay = replaySequence(ledger);

// write artifacts
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
  ledger.ledger_hash
);

console.log("DATASET MATERIALIZED:");
console.log(" - atoms.json");
console.log(" - ledger.json");
console.log(" - expected_hash.txt");
