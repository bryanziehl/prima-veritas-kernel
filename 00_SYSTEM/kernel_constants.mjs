/**
 * PRIMA VERITAS KERNEL — KERNEL CONSTANTS
 *
 * Responsibility:
 * Defines kernel-wide immutable constants that participate in
 * canonical hashing, replay guarantees, and specification identity.
 *
 * These values define the versioned identity of the kernel.
 *
 * Determinism Guarantees:
 * - No randomness
 * - No timestamps
 * - No environment-dependent behavior
 * - Constants are static literals
 * - Same values → same hashes across machines and time
 *
 * Non-Goals / Refusals:
 * - Will not infer versions
 * - Will not auto-increment
 * - Will not read from environment variables
 * - Will not allow runtime overrides
 *
 * Stability Contract:
 * - HARD invariant
 * - Any change here is breaking
 * - Any change invalidates historical ledgers and hashes
 * - Changes require explicit version bump + replay diff
 */

export const kernel_version = "1.0.0";
export const spec_version = "1.0.0";
export const hash_algorithm = "sha256";
export const canonical_encoding = "utf-8";
