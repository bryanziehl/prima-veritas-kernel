# Prima Veritas Kernel — Tests

## Purpose

This directory contains **determinism and replay verification tests** for the
Prima Veritas Kernel.

These tests exist to prove — not assume — that:

- identical inputs produce identical outputs
- replay artifacts are byte-for-byte stable
- kernel behavior does not drift across runs, machines, or environments

If these tests fail, the kernel is considered **invalid**, regardless of
feature completeness.

---

## What These Tests Verify

The tests in this directory verify:

- Deterministic ingest → normalize → atomize → ledger → replay
- Stable hashing across multiple executions
- Absence of non-deterministic behavior (timestamps, ordering drift, randomness)
- Structural and byte-level equivalence of outputs

These tests do **not** verify correctness, meaning, or business interpretation.
They verify **reproducibility only**.

---

## Test Philosophy

- Tests are adversarial
- Tests assume hostile or messy inputs
- Tests do not “help” the kernel succeed
- Tests fail loudly and explicitly

Passing tests mean:
> “This kernel can be trusted to replay reality exactly as recorded.”

---

## Directory Structure

09_TESTS/
├── golden_inputs/ ← canonical test inputs (small, explicit)
├── golden_outputs/ ← expected byte-stable outputs
└── determinism.test.mjs


---

## Golden Inputs

Golden inputs must be:

- minimal
- human-readable
- intentionally awkward (ordering edge cases, missing fields, duplicates)

Golden inputs must **never change** without:

- updating golden outputs
- documenting the reason
- acknowledging a breaking change

---

## Golden Outputs

Golden outputs are the canonical truth artifacts produced by the kernel.

They are compared using:

- exact byte equality
- stable hashing

Any mismatch is a failure.

---

## determinism.test.mjs

This test must:

1. Run the full kernel pipeline on a golden input
2. Capture all emitted artifacts
3. Run the same pipeline again
4. Compare outputs byte-for-byte
5. Fail if any difference exists

No tolerances.
No fuzzy matching.
No “close enough.”

---

## Rules

- Tests may import kernel modules
- Kernel modules may not import tests
- Tests may not introduce new logic paths
- Tests must be deterministic themselves

---

## Final Invariant

If this directory passes on two different machines,
the kernel earns the right to exist.

If it fails, the kernel is wrong — not the test.
