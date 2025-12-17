/*
Prima Veritas Kernel — Ledger Construction Module

Responsibility:
Build a deterministic, append-only ledger from atomic events.
This module establishes ordering, immutability, and hash-chain integrity.

Determinism Guarantees:
- No randomness
- No timestamps generated
- No environment-dependent behavior
- Fixed ordering based solely on input sequence
- Cryptographic operations are deterministic
- Same input → same ledger, bit-for-bit

Non-Goals / Refusals:
- Will not reorder events
- Will not merge or collapse events
- Will not infer causality or correctness
- Will not repair malformed events
- Will not skip or silently drop entries

Stability Contract:
- Ledger structure is BREAKING if changed
- Hash semantics must remain stable
- Any change requires version bump + full replay diff
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
