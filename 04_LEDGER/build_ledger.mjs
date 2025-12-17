/*
Prima Veritas Kernel — Ledger Construction Module

Responsibility
--------------
Build a deterministic, append-only ledger from atomic events.
This module establishes ordering, immutability, and hash-chain integrity.

It does not interpret events.
It does not assess correctness.
It does not summarize or analyze content.

Determinism Guarantees
---------------------
- No randomness
- No timestamps generated
- No environment-dependent behavior
- Fixed ordering based solely on input sequence
- Cryptographic operations are deterministic
- Identical input events → identical ledger, bit-for-bit

Determinism Assumptions
----------------------
- Event objects are already canonicalized upstream
- Object key ordering is stable by construction before reaching this module
- This module does not normalize, sort, or repair event structure

If these assumptions are violated upstream, determinism is not guaranteed
and execution should be considered invalid.

Non-Goals / Explicit Refusals
-----------------------------
- Will not reorder events
- Will not merge or collapse events
- Will not infer causality, correctness, or meaning
- Will not repair malformed events
- Will not skip or silently drop entries
- Will not re-hash or reinterpret payload structure

Stability Contract
------------------
- Ledger entry structure is BREAKING if changed
- Hash semantics and chaining rules must remain stable
- Any behavior change requires:
  - version bump
  - full replay diff
  - justification against KERNEL_CHARTER.md

Hash Scope Clarification
-----------------------
- The ledger hash attests to:
  - kernel version
  - spec version
  - entry count
  - final entry hash (ordering + immutability)
- It does NOT attest to reports, interpretations, or downstream artifacts

This boundary is intentional and must not be expanded.
*/


import crypto from "crypto";

import {
  kernel_version as KERNEL_VERSION,
  spec_version,
  hash_algorithm
} from "../00_SYSTEM/kernel_constants.mjs";

/**
 * Deterministically hash an object.
 * JSON stringification order is preserved by construction upstream.
 */
function hashObject(obj) {
  const serialized = JSON.stringify(obj);
  return crypto.createHash(hash_algorithm).update(serialized).digest("hex");
}

/**
 * Build a deterministic ledger from atomic events.
 *
 * @param {Object[]} events - Atomic event array (ordered)
 *
 * @returns {Object} ledger
 */
export function buildLedger(events) {
  if (!Array.isArray(events)) {
    throw new Error("LEDGER_INPUT_NOT_ARRAY");
  }

  const ledger = {
    header: {
      kernel_version: KERNEL_VERSION,
      spec_version,
      hash_algorithm
    },
    entry_count: events.length,
    entries: []
  };

  let previous_hash = null;

  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    const entry = {
      index: i,
      event_id: event.event_id,
      event_hash: hashObject(event),
      previous_hash,
      event
    };

    entry.entry_hash = hashObject(entry);

    ledger.entries.push(entry);
    previous_hash = entry.entry_hash;
  }

  ledger.ledger_hash = hashObject({
    kernel_version: KERNEL_VERSION,
    spec_version,
    entry_count: ledger.entry_count,
    final_entry_hash: previous_hash
  });

  return ledger;
}
