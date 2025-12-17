# Dataset: adversarial_reorder

## Purpose
Demonstrate that **event ordering alone** is materially significant in the
Prima Veritas Kernel. This dataset contains the same event content as its
baseline counterpart, but with ordering deliberately altered.

## Dataset Type
Adversarial (ordering mutation)

## What Is Held Constant
- Event content
- Normalization rules
- Atomization rules
- Ledger construction logic
- Kernel version and spec version

## What Is Changed
- Event ordering prior to ledger construction

No events are added, removed, or modified.
Only sequence position differs.

## Expected Behavior
- Ledger hash MUST differ from the baseline dataset
- Replay MUST verify cleanly
- No determinism or integrity errors are permitted

A hash mismatch relative to baseline is the **correct outcome**.

## Artifacts
- `input.json` — adversarially reordered input
- `atoms.json` — atomized events (same content, new order)
- `ledger.json` — sealed ledger reflecting adversarial ordering
- `expected_hash.txt` — canonical hash for this ordering
- `run.mjs` — dataset materializer (non-kernel code)

## Notes
This dataset proves that:
- Identical data does not guarantee identical outcomes
- Ordering is a first-class, auditable property
- Deterministic replay makes structural manipulation explicit

No interpretation or judgment is asserted here.
