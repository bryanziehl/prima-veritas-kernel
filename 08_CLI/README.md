# CLI Layer — Prima Veritas Kernel

## Responsibility

This directory provides the **only supported operator interface** to the
Prima Veritas Kernel.

The CLI layer is a **thin invocation surface**.
It wires inputs to kernel modules and emits deterministic outputs or failures.

The CLI does **not** contain business logic.

---

## What the CLI DOES

The CLI layer:

- Accepts explicit operator commands
- Loads input files exactly as provided
- Invokes kernel modules in declared order
- Emits deterministic outputs to stdout / filesystem
- Surfaces kernel errors verbatim (no interpretation)

---

## What the CLI DOES NOT Do

The CLI will **never**:

- Infer missing arguments
- Guess intent or defaults
- Modify kernel behavior
- Catch or reinterpret kernel errors
- “Help” the operator by fixing inputs
- Hide failures or downgrade errors

If required inputs are missing or invalid, execution fails.

---

## Determinism Guarantees

All CLI commands guarantee:

- No randomness
- No timestamps
- No environment-dependent behavior
- Identical inputs → identical outputs
- Stable exit behavior for identical failures

The CLI introduces **no new sources of nondeterminism**.

---

## Commands

### `pv_ingest.mjs`

Deterministically ingest raw files or directories.

Responsibilities:
- Argument validation
- Path resolution
- Invocation of `01_INGEST` modules only

Produces:
- Raw ingest artifacts
- Deterministic failure on invalid input

---

### `pv_replay.mjs`

Replay a sealed ledger deterministically.

Responsibilities:
- Load ledger artifact
- Invoke `05_REPLAY/replay_sequence.mjs`
- Emit reconstructed event sequence or failure

Does not:
- Modify the ledger
- Explain discrepancies
- Generate reports

---

### `pv_verify.mjs`

Verify a ledger against an expected canonical hash.

Responsibilities:
- Load ledger + expected hash
- Invoke kernel verification logic
- Emit PASS or FAIL deterministically

Verification is **binary**.

---

## Stability Contract

- CLI flags are a **public API**
- Any change to arguments, behavior, or output is breaking
- Changes require:
  - Version bump
  - Replay diff
  - Update to documentation

---

## Boundary Rule

The CLI is not a kernel layer.

All logic that:
- Interprets data
- Explains outcomes
- Generates narratives
- Produces summaries

belongs **outside** the kernel and CLI.

---

## Final Invariant

The CLI exposes the kernel.
It does not soften it.

If an operator finds the CLI “unfriendly,”
the kernel is working as designed.
