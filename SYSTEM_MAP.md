Prima Veritas Kernel — System Map

This document defines the canonical structure of the Prima Veritas Kernel
repository.

This map is normative.
If code or folders diverge from this structure, the divergence must be justified
against KERNEL_CHARTER.md and this SYSTEM_MAP.md.

Repository Exposure Policy

All contents of this repository are safe for public distribution.

Canonical truth artifacts are explicitly labeled.
Supporting materials are non-authoritative and do not alter kernel guarantees.

Nothing in this repository expresses opinions, conclusions, or interpretations.

PRIMA_VERITAS_KERNEL/
PRIMA_VERITAS_KERNEL/
│
├── KERNEL_CHARTER.md ← locked (kernel scope + invariants)
├── SYSTEM_MAP.md ← normative (this file)
├── HEADER_GUIDANCE.md ← kernel-wide header contract
│
├── 00_SYSTEM/ ← kernel-wide constants + shared utilities
│   ├── kernel_constants.mjs
│   └── .keep
│
├── 01_INGEST/ ← raw intake, zero interpretation
│   ├── ingest_file.mjs
│   ├── ingest_directory.mjs
│   ├── ingest_manifest.mjs
│   └── README.md
│
├── 02_NORMALIZE/ ← deterministic transforms only
│   ├── normalize_structured.mjs
│   ├── normalize_text.mjs
│   ├── normalize_rules.json
│   ├── normalize_text.rules.json
│   └── README.md
│
├── 03_ATOMIZE/ ← event extraction (no meaning, no inference)
│   ├── atomize_events.mjs
│   ├── event_schema.json
│   └── README.md
│
├── 04_LEDGER/ ← hash chain + ordering
│   ├── build_ledger.mjs
│   ├── hash_utils.mjs
│   ├── ledger_schema.json
│   └── .keep
│
├── 05_REPLAY/ ← deterministic reconstruction
│   ├── replay_sequence.mjs
│   └── README.md
│
├── 06_INVARIANTS/ ← declarative rules only (no logic)
│   ├── ordering.rules.json
│   ├── immutability.rules.json
│   ├── rejection.rules.json
│   └── README.md
│
├── 07_ERRORS/ ← first-class deterministic failures
│   ├── kernel_error.mjs
│   ├── error_codes.json
│   └── .keep
│
├── 08_CLI/ ← thin operator surface (no business logic)
│   ├── pv_ingest.mjs
│   ├── pv_replay.mjs
│   ├── pv_verify.mjs
│   └── .keep
│
├── 09_TESTS/ ← determinism + replay guarantees
│   ├── determinism.test.mjs
│   ├── golden_inputs/
│   ├── golden_outputs/
│   └── README.md
│
├── 10_DATASETS/ ← kernel proof datasets (NON-KERNEL code)
│   │
│   ├── la_court_baseline/ ← canonical public proof dataset
│   │   ├── input.txt
│   │   ├── atoms.json
│   │   ├── ledger.json
│   │   ├── expected_hash.txt
│   │   └── run.mjs ← dataset materializer (non-kernel)
│   │
│   ├── adversarial_reorder/ ← ordering mutation, content preserved
│   │   ├── input.json
│   │   ├── atoms.json
│   │   ├── ledger.json
│   │   ├── expected_hash.txt
│   │   └── run.mjs ← dataset materializer (non-kernel)
│   │
│   ├── la_court_adversarial/ ← alternate adversarial court variant
│   │   ├── input.txt
│   │   ├── atoms.json
│   │   ├── ledger.json
│   │   ├── expected_hash.txt
│   │   └── run.mjs ← dataset materializer (non-kernel)
│   │
│   └── structural_mutation/ ← structure mutation, semantics preserved
│       ├── input.json
│       ├── atoms.json
│       ├── ledger.json
│       ├── expected_hash.txt
│       └── run.mjs ← dataset materializer (non-kernel)
│
├── 90_CASEWORK_REPORTS/ ← canonical truth artifacts (read-only)
│   │
│   ├── la_court_baseline/
│   │   └── la_court_baseline.report.md ← canonical
│   │
│   ├── adversarial_reorder/
│   │   └── adversarial_reorder.report.md ← canonical
│   │
│   ├── delta_analysis.md ← canonical cross-case artifact
│   │
│   ├── basic_case/ ← illustrative example (non-canonical)
│   │   ├── 01_raw.json
│   │   ├── 02_normalized.json
│   │   ├── 03_events.json
│   │   ├── 04_ledger.json
│   │   ├── 05_replay.json
│   │   └── FINAL_HASH.txt
│   │
│   └── input/ ← illustrative example (non-canonical)
│       ├── 01_raw.json
│       ├── 02_normalized.json
│       ├── 03_events.json
│       ├── 04_ledger.json
│       ├── 05_replay.json
│       └── FINAL_HASH.txt
│
├── 91_DIAGNOSTICS/ ← reserved (currently empty)
├── 92_CASES/ ← reserved (currently empty)
├── 93_TEMPLATES/ ← reserved (currently empty)
└── 94_TOOLS/ ← support tooling (non-kernel)
    ├── evidence_packet.mjs
    └── .keep

Dataset Rules (Normative)

10_DATASETS/*/run.mjs may call kernel modules

Kernel modules must never import from 10_DATASETS

Dataset materializers are explicitly NON-KERNEL

Dataset code may change freely; kernel code may not

Expected hash definition must match pv_verify exactly

Any dataset that passes pv_verify is a valid kernel proof

Canonical Artifact Rules

Canonical artifacts are limited to:

Kernel code

Kernel configuration

Casework reports in 90_CASEWORK_REPORTS

delta_analysis.md

Illustrative or exploratory materials must be explicitly labeled
non-canonical and never referenced as proof.

Final Constraint

The kernel is complete when:

Datasets can change freely

Replay truth does not change

Canonical hashes remain reproducible

Interpretation remains external to the kernel

Any change that violates these conditions is out of scope.