# Ingest Layer — Prima Veritas Kernel

## Responsibility

The ingest layer is responsible for **accepting raw inputs exactly as provided** and
recording their structure, ordering, and source metadata without interpretation,
correction, or enrichment.

Ingest is a capture boundary, not a processing layer.

---

## What Ingest DOES

The ingest layer:

- Accepts files and directories as-is
- Records byte-level contents
- Records file ordering when determinable
- Records source metadata (paths, names, sizes, declared encodings)
- Emits explicit errors for malformed or unsupported inputs
- Produces deterministic ingest artifacts suitable for downstream normalization

---

## What Ingest DOES NOT DO

The ingest layer will **never**:

- Guess file formats
- Infer schemas
- Repair malformed files
- Clean encoding issues
- Auto-detect delimiters heuristically
- Reorder records
- Modify whitespace
- Normalize line endings
- Drop or add fields
- “Make things work”

If input cannot be ingested deterministically, execution must fail.

---

## Determinism Guarantees

All ingest operations guarantee:

- No randomness
- No timestamps
- No environment-dependent behavior
- No filesystem traversal order dependence
- Fixed byte-for-byte capture
- Stable output across machines and executions

If determinism cannot be guaranteed, ingest must refuse execution.

---

## Failure Philosophy

Failures are **first-class outputs**.

Ingest failures must:

- Be explicit
- Be structured
- Preserve the original input reference
- Never silently downgrade behavior

Silence is failure.

---

## Boundary of Responsibility

| Layer | Responsibility |
|------|---------------|
| Client / Operator | Data export, formatting decisions, tool choice |
| **Ingest** | Raw capture + structural recording |
| Normalize | Deterministic transforms only |
| Atomize | Event extraction |
| Ledger | Ordering + hash sealing |

Ingest never crosses upward into interpretation or correction.

---

## Files in This Directory

- `ingest_file.mjs`  
  Deterministic ingestion of a single file.

- `ingest_directory.mjs`  
  Deterministic ingestion of a directory with explicit ordering rules.

- `ingest_manifest.mjs`  
  Construction of a stable ingest manifest describing captured inputs.

Each executable must declare its own determinism guarantees and refusals.

---

## Stability Contract

Changes in this layer are **breaking by default**.

Any behavior change requires:

- Version bump
- Replay comparison
- Explicit justification against `KERNEL_CHARTER.md`

---

## Final Invariant

Ingest captures reality; it does not improve it.

If a feature proposal attempts to “help” the input,
it does not belong here.
