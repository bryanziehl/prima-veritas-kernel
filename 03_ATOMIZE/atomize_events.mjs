/*
Prima Veritas Kernel — Atomization Module

Responsibility:
Deterministically convert normalized records into atomic events.
This file performs structural event extraction only.
It does not infer meaning, causality, intent, or correctness.

Determinism Guarantees:
- No randomness
- No timestamps generated
- No environment-dependent behavior
- Fixed ordering only (input order preserved)
- Identical input yields identical output

Non-Goals / Refusals:
- Will not guess missing timestamps
- Will not reorder records
- Will not collapse or merge events
- Will not infer relationships between events
- Will not repair malformed payloads

Stability Contract:
- Any change to event structure is BREAKING
- Outputs must remain byte-stable
- Behavior changes require version bump + replay diff
*/

import fs from "fs";
import path from "path";

import { kernel_version, spec_version } from "../00_SYSTEM/kernel_constants.mjs";

/**
 * Atomize normalized records into atomic events.
 *
 * @param {Object[]} normalizedRecords - Array of normalized records (already deterministic)
 * @param {Object|null} context - Provenance context (optional for kernel-internal usage)
 * @param {string} context.ingest_id
 * @param {string} context.normalize_id
 * @param {string} context.source_origin
 * @param {string} context.source_location
 *
 * @returns {Object[]} Array of atomic event objects
 */
export function atomizeEvents(normalizedRecords, context = null) {
  if (!Array.isArray(normalizedRecords)) {
    throw new Error("ATOMIZE_INPUT_NOT_ARRAY");
  }

  // If context is provided, it MUST be complete
  if (context !== null) {
    const {
      ingest_id,
      normalize_id,
      source_origin,
      source_location
    } = context;

    if (!ingest_id || !normalize_id || !source_origin || !source_location) {
      throw new Error("ATOMIZE_MISSING_CONTEXT");
    }
  }

  const events = [];

  for (let i = 0; i < normalizedRecords.length; i++) {
    const record = normalizedRecords[i];

    const event = {
      event_id: context
        ? `${context.normalize_id}:${i}`
        : `deterministic:${i}`,
      sequence_index: i,
      timestamp: record.timestamp ?? null,
      source: context
        ? {
            origin: context.source_origin,
            location: `${context.source_location}#${i}`
          }
        : null,
      payload: record,
      provenance: context
        ? {
            ingest_id: context.ingest_id,
            normalize_id: context.normalize_id,
            kernel_version,
            spec_version
          }
        : null,
      notes: record.notes ?? null
    };

    events.push(event);
  }

  return events;
}

/**
 * Convenience helper for atomizing from a JSON file.
 * This function is intentionally thin and deterministic.
 *
 * @param {string} inputPath
 * @param {Object|null} context
 * @returns {Object[]}
 */
export function atomizeFromFile(inputPath, context = null) {
  const absolutePath = path.resolve(inputPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error("ATOMIZE_INPUT_FILE_NOT_FOUND");
  }

  const raw = fs.readFileSync(absolutePath, "utf8");
  const parsed = JSON.parse(raw);

  return atomizeEvents(parsed, context);
}
