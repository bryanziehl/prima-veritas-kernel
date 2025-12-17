/*
Prima Veritas Kernel — Hash Utilities

Responsibility
--------------
Provide deterministic cryptographic hashing primitives for the kernel.
Includes canonical, stable serialization used for hashing only.

Determinism Guarantees
---------------------
- No randomness
- No salts
- No timestamps
- Fixed algorithm (SHA-256)
- Fixed encoding (utf8 → hex)
- Stable key ordering
- Identical input → identical hash

Non-Goals / Explicit Refusals
-----------------------------
- No heuristic normalization
- No type coercion
- No environment dependence
- No interpretation of semantic meaning
- No schema inference or repair

Stability Contract
------------------
- HARD invariant
- Any change invalidates historical ledgers
- Behavior changes require version bump + full replay
*/


import crypto from "crypto";

/**
 * Deterministically stringify a JSON-serializable value
 * with stable key ordering.
 *
 * @param {any} value
 * @returns {string}
 */
export function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  const keys = Object.keys(value).sort();
  const entries = keys.map(
    (k) => `"${k}":${stableStringify(value[k])}`
  );

  return `{${entries.join(",")}}`;
}

/**
 * Hash a UTF-8 string deterministically.
 */
export function hashString(value) {
  if (typeof value !== "string") {
    throw new Error("HASH_STRING_INPUT_NOT_STRING");
  }

  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

/**
 * Hash an object deterministically using stableStringify.
 */
export function hashObject(obj) {
  if (obj === null || typeof obj !== "object") {
    throw new Error("HASH_OBJECT_INPUT_NOT_OBJECT");
  }

  return hashString(stableStringify(obj));
}
