# Errors Module — 07_ERRORS

## Purpose

This module defines **first-class, deterministic kernel failures**.

Errors in Prima Veritas are not exceptions, logs, or messages.
They are **structured truth artifacts** emitted when the kernel cannot proceed
without violating determinism, scope, or declared invariants.

Silence is forbidden.

---

## Design Principles

- Errors are **explicit**
- Errors are **deterministic**
- Errors are **structured**
- Errors are **replayable**
- Errors are **part of the kernel’s output surface**

If execution cannot proceed truthfully, the kernel must fail loudly and precisely.

---

## What This Module DOES

- Defines canonical kernel error codes
- Provides a deterministic error construction mechanism
- Ensures errors are:
  - machine-readable
  - auditable
  - stable across executions
- Prevents silent fallback or implicit behavior

Errors emitted by the kernel are intended to be:
- logged
- inspected
- handed to humans or downstream systems
without reinterpretation by the kernel itself.

---

## What This Module DOES NOT Do

- Does not catch or suppress errors
- Does not recover from failures
- Does not retry execution
- Does not interpret error meaning
- Does not suggest corrective action

Recovery, retry, or interpretation belongs **outside the kernel boundary**.

---

## Files in This Directory

- `kernel_error.mjs`  
  Defines the canonical kernel error object and construction helpers.

- `error_codes.json`  
  Declarative registry of allowed kernel error codes and meanings.

JSON files in this directory are **data**, not executable logic.

---

## Stability Contract

- Error shapes are a **public contract**
- Error codes are **stable identifiers**
- Any change to:
  - error structure
  - error semantics
  - error categorization  
  is a **breaking change**

Changes require:
- version bump
- replay diff
- explicit rationale against `KERNEL_CHARTER.md`

---

## Boundary Rule

The kernel emits errors.
It does not explain them.

Any logic that attempts to:
- soften errors
- infer intent
- continue execution after failure

does not belong in the kernel.

---

## Final Invariant

Errors are part of the truth.

If the kernel cannot proceed deterministically,
the error **is** the output.
