/*
Prima Veritas Kernel — atomize_events.mjs

Responsibility
--------------
Deterministically convert normalized records into atomic events.

This module performs structural event extraction only.
It records events as-presented without interpretation, inference, or correction.

Determinism Guarantees
---------------------
- No randomness
- No timestamps generated
- No environment-dependent behavior
- Fixed ordering only (input order preserved)
- Pure transformation: input → events
- Identical input yields identical output

Non-Goals / Explicit Refusals
----------------------------
- Will not guess or synthesize timestamps
- Will not reorder records or events
- Will not collapse, merge, or summarize events
- Will not infer relationships, causality, or intent
- Will not repair, clean, or normalize payload semantics
- Will not resolve ambiguity present in input

Stability Contract
------------------
- This file is a breaking-change boundary
- Event structure and field semantics are locked
- Outputs must remain byte-stable
- Any behavior change requires:
  - explicit version bump
  - replay diff validation
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
