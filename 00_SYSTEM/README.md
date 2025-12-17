# System Layer — Prima Veritas Kernel

## Responsibility

The system layer defines **kernel-wide constants and invariants** that are shared
across all kernel modules.

This layer establishes the *fixed parameters* under which determinism,
hashing, and replay guarantees are enforced.

Nothing in this layer performs computation on user data.

---

## What the System Layer IS

The system layer is responsible for:

- Declaring the canonical kernel version
- Declaring the canonical specification version
- Declaring the cryptographic hash algorithm
- Declaring canonical encoding assumptions
- Providing immutable constants used across kernel modules

These values form part of the **kernel’s identity** and must be stable across
machines, executions, and environments.

---

## What the System Layer IS NOT

The system layer will **never**:

- Inspect or process input data
- Perform hashing directly on user artifacts
- Contain business logic
- Contain dataset-specific logic
- Change dynamically at runtime
- Infer or negotiate configuration values

All values are explicit, static, and versioned.

---

## Determinism Guarantees

All exports from this layer guarantee:

- No randomness
- No timestamps
- No environment-dependent behavior
- No runtime mutation
- Stable values across executions

If a value must change, it constitutes a **breaking change**.

---

## Files in This Directory

- `kernel_constants.mjs`  
  Canonical kernel and specification constants, including:
  - `kernel_version`
  - `spec_version`
  - `hash_algorithm`
  - `canonical_encoding`

These constants are imported by other kernel modules and may be incorporated
into canonical hash contracts.

---

## Stability Contract

This layer is a **hard invariant boundary**.

Any change requires:

- Explicit version bump
- Written rationale
- Replay comparison
- Acknowledgment that historical artifacts may no longer validate

Silent drift is prohibited.

---

## Final Invariant

The system layer defines *what the kernel is*.

If a value here is negotiable, dynamic, or context-dependent,
it does not belong in this directory.
