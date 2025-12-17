/**
 * PRIMA VERITAS KERNEL — replay_sequence.mjs
 *
 * Responsibility:
 * Deterministically replay + verify a sealed ledger produced by 04_LEDGER/build_ledger.mjs.
 * This module verifies:
 * - entry ordering
 * - hash-chain integrity
 * - per-event hash integrity
 *
 * Determinism Guarantees:
 * - No randomness
 * - No timestamps
 * - No environment-dependent behavior
 * - Fixed verification path for identical ledger bytes
 *
 * Explicit Non-Goals:
 * - Will not interpret events
 * - Will not “fix” broken chains
 * - Will not skip malformed entries
 * - Will not infer missing fields
 *
 * Stability Contract:
 * - Ledger verification rules are a public contract
 * - Any behavior change is breaking
 * - Changes require version bump + replay diff
 */

import crypto from "crypto";

import {
  kernel_version as KERNEL_VERSION,
  spec_version,
  hash_algorithm
} from "../00_SYSTEM/kernel_constants.mjs";

function hashObjectDeterministic(obj) {
  const serialized = JSON.stringify(obj);
  return crypto.createHash(hash_algorithm).update(serialized).digest("hex");
}

/**
 * Deterministically replay and verify a ledger.
 *
 * Supported call forms:
 *   replaySequence(ledger)
 *   replaySequence({ ledger, atoms, returnFinalHash })
 */
export function replaySequence(input) {
  // --- normalize call shape ---
  let ledger = null;
  let returnFinalHash = false;

  if (input && typeof input === "object" && input.ledger) {
    ledger = input.ledger;
    returnFinalHash = Boolean(input.returnFinalHash);
  } else {
    ledger = input;
  }

  if (!ledger || typeof ledger !== "object") {
    throw new Error("REPLAY_LEDGER_INVALID");
  }

  // --- header enforcement ---
  if (!ledger.header || typeof ledger.header !== "object") {
    throw new Error("REPLAY_HEADER_MISSING");
  }

  if (
    ledger.header.kernel_version !== KERNEL_VERSION ||
    ledger.header.spec_version !== spec_version ||
    ledger.header.hash_algorithm !== hash_algorithm
  ) {
    throw new Error("REPLAY_HEADER_VERSION_MISMATCH");
  }

  const entries = ledger.entries;
  if (!Array.isArray(entries)) {
    throw new Error("REPLAY_ENTRIES_NOT_ARRAY");
  }

  let previousHash = null;
  const reconstructed = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (!entry || typeof entry !== "object") {
      throw new Error("REPLAY_ENTRY_INVALID");
    }

    if (entry.index !== i) {
      throw new Error("REPLAY_INDEX_MISMATCH");
    }

    if (entry.previous_hash !== previousHash) {
      throw new Error("REPLAY_CHAIN_BROKEN");
    }

    const computedEventHash = hashObjectDeterministic(entry.event);
    if (computedEventHash !== entry.event_hash) {
      throw new Error("REPLAY_EVENT_HASH_MISMATCH");
    }

    const computedEntryHash = hashObjectDeterministic({
      index: entry.index,
      event_id: entry.event_id,
      event_hash: entry.event_hash,
      previous_hash: entry.previous_hash,
      event: entry.event
    });

    if (computedEntryHash !== entry.entry_hash) {
      throw new Error("REPLAY_ENTRY_HASH_MISMATCH");
    }

    reconstructed.push(entry.event);
    previousHash = entry.entry_hash;
  }

  if (returnFinalHash) {
    return {
      events: reconstructed,
      finalHash: ledger.ledger_hash
    };
  }

  return reconstructed;
}
