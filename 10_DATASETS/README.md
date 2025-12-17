# Prima Veritas Kernel — Datasets

## Purpose

This directory contains **canonical and adversarial datasets** used to
exercise, validate, and demonstrate the Prima Veritas Kernel.

Datasets are **not kernel code**.
They are inputs, materializers, and proof artifacts.

Nothing in this directory is trusted by default.
Everything here must earn trust by replaying deterministically.

---

## What Lives Here

Each subdirectory represents a **self-contained dataset** with:

- Raw input data
- Deterministically produced artifacts
- A `run.mjs` materializer that generates:
  - `atoms.json`
  - `ledger.json`
  - `expected_hash.txt`

These outputs must be reproducible byte-for-byte.

---

## Dataset Categories

### Canonical Datasets

Used to establish baseline behavior.

Examples:
- `la_court_baseline`

Purpose:
- Demonstrate normal, real-world data ingestion
- Establish a stable reference hash

---

### Adversarial Datasets

Used to prove kernel invariants under stress.

Examples:
- `adversarial_reorder`
- `la_court_adversarial`
- `structural_mutation`

Purpose:
- Change **ordering**, **structure**, or **representation**
- Preserve underlying content
- Force observable hash divergence

If adversarial changes do **not** change the hash,
the kernel is broken.

---

## Required Files per Dataset

Each dataset directory MUST contain:

- `input.*`  
  Raw source input (text or structured)

- `run.mjs`  
  Deterministic materializer script

- `atoms.json`  
  Atomized event output

- `ledger.json`  
  Sealed ledger with hash chain

- `expected_hash.txt`  
  Canonical expected hash for verification

Missing any of these is a dataset failure.

---

## Determinism Rules (Hard)

- `run.mjs` may import kernel modules
- Kernel modules must **never** import from `10_DATASETS`
- No randomness
- No timestamps
- No environment-dependent behavior
- No network access
- No filesystem discovery beyond explicit paths

If a dataset cannot be replayed deterministically,
it is invalid and must be fixed or removed.

---

## Relationship to the Kernel

- Datasets are **inputs**
- The kernel is **authoritative**
- Datasets may be messy
- Kernel code may not be

A dataset passing replay and verification
is a **portable proof artifact**.

---

## Final Invariant

If two machines produce the same hash from the same dataset,
the kernel is doing its job.

If they do not, the dataset exposed a bug.

Both outcomes are success.
