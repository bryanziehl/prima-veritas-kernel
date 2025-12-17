# Replay Layer — Deterministic Reconstruction

## Responsibility
This layer reconstructs event sequences exactly as recorded in the ledger.
It performs verification and replay only.

Replay consumes:
- canonicalized event atoms
- ledger ordering
- hash-chain attestations

Replay emits:
- deterministic event sequences
- integrity violations
- gaps, conflicts, and duplicates as signals

## Determinism Guarantees
- No randomness
- No timestamps
- No environment-dependent behavior
- Fixed ordering derived solely from the ledger
- Byte-identical output for identical inputs

## Explicit Non-Goals
This layer will not:
- Infer causality, intent, or meaning
- Collapse events into summaries
- Resolve ambiguity
- Perform analytics or scoring
- Generate narratives, reports, or conclusions

## Integrity Rules
- Ledger is the source of truth
- Any mismatch, break, or violation fails execution
- Silence is not permitted

Replay is verification, not explanation.
Meaning exists outside the kernel.
