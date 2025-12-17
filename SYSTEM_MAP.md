# Prima Veritas Kernel — System Map

This document defines the canonical structure of the Prima Veritas Kernel.

This map is **normative**.
If code or folders diverge from this structure, the divergence must be justified
against `KERNEL_CHARTER.md` and this `SYSTEM_MAP.md`.

---

## PRIMA_VERITAS_KERNEL/

PRIMA_VERITAS_KERNEL/
│
├── KERNEL_CHARTER.md ← locked (do not move)
├── SYSTEM_MAP.md ← normative
├── HEADER_GUIDANCE.md ← kernel-wide header contract
│
├── 00_SYSTEM/ ← kernel-wide constants + shared utilities
│ ├── kernel_constants.mjs
│ └── README.md
│
├── 01_INGEST/ ← raw intake, zero interpretation
│ ├── ingest_file.mjs
│ ├── ingest_directory.mjs
│ ├── ingest_manifest.mjs
│ └── README.md
│
├── 02_NORMALIZE/ ← deterministic transforms only
│ ├── normalize_structured.mjs
│ ├── normalize_text.mjs
│ ├── normalize_rules.json
│ └── README.md
│
├── 03_ATOMIZE/ ← event extraction (no meaning, no inference)
│ ├── atomize_events.mjs
│ ├── event_schema.json
│ └── README.md
│
├── 04_LEDGER/ ← hash chain + ordering
│ ├── build_ledger.mjs
│ ├── hash_utils.mjs
│ ├── ledger_schema.json
│ └── README.md
│
├── 05_REPLAY/ ← deterministic reconstruction
│ ├── replay_sequence.mjs
│ └── README.md
│
├── 06_INVARIANTS/ ← declarative rules only (no logic)
│ ├── ordering.rules.json
│ ├── immutability.rules.json
│ ├── rejection.rules.json
│ └── README.md
│
├── 07_ERRORS/ ← first-class deterministic failures
│ ├── kernel_error.mjs
│ ├── error_codes.json
│ └── README.md
│
├── 08_CLI/ ← thin operator surface (no business logic)
│ ├── pv_ingest.mjs
│ ├── pv_replay.mjs
│ ├── pv_verify.mjs
│ └── README.md
│
├── 09_TESTS/ ← determinism + replay guarantees
│ ├── golden_inputs/
│ ├── golden_outputs/
│ └── determinism.test.mjs
│
├── 10_DATASETS/ ← adversarial + canonical kernel datasets
│ │
│ ├── adversarial_reorder/ ← order mutation, content preserved
│ │ ├── input.json
│ │ ├── atoms.json
│ │ ├── ledger.json
│ │ ├── expected_hash.txt
│ │ └── run.mjs ← dataset materializer (non-kernel)
│ │
│ ├── structural_mutation/ ← structure mutation, semantics preserved
│ │ ├── input.json
│ │ ├── atoms.json
│ │ ├── ledger.json
│ │ ├── expected_hash.txt
│ │ └── run.mjs ← dataset materializer (non-kernel)
│ │
│ └── README.md
│
└── NON-KERNEL WORKSPACE (not covered by kernel guarantees)
├── 90_CASEWORK_REPORTS/
├── 91_DIAGNOSTICS/
├── 92_CASES/
├── 93_TEMPLATES/
└── 94_TOOLS/

yaml
Copy code

---

## Dataset Rules (Normative)

- `10_DATASETS/*/run.mjs` **may call kernel modules**
- Kernel modules **must never import from 10_DATASETS**
- Dataset code may be messy; kernel code may not
- Expected hash definition **must match replay verification exactly**
- Any dataset that passes `pv_verify` is a **valid kernel proof**

---

## Final Constraint

The kernel is complete when:
- Datasets can change freely
- Replay truth does not
