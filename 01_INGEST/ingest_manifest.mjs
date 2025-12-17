/**
 * Prima Veritas Kernel — ingest_manifest.mjs
 *
 * Responsibility
 * ---------------
 * Deterministically assemble a manifest describing WHAT was ingested,
 * not what it means. This file records raw artifact metadata only.
 *
 * Determinism Guarantees
 * ---------------------
 * - No randomness
 * - No timestamps
 * - No environment-dependent behavior
 * - Fixed ordering only
 * - Pure data transformation
 *
 * Non-Goals / Explicit Refusals
 * ----------------------------
 * - Will not hash file contents
 * - Will not inspect or parse bytes
 * - Will not infer file types
 * - Will not guess intent or meaning
 * - Will not silently deduplicate or coerce
 *
 * Stability Contract
 * ------------------
 * - Output structure is byte-stable
 * - Any behavior change requires version bump + replay diff
 */

import path from "path";

/**
 * Build a deterministic ingest manifest from raw file artifacts.
 *
 * @param {Array<Object>} artifacts
 * Each artifact must include:
 *   - absolute_path (string)
 *   - relative_path (string)
 *   - byte_size (number)
 *
 * @returns {Object} manifest
 */
export function buildIngestManifest(artifacts) {
  if (!Array.isArray(artifacts)) {
    throw new Error("INGEST_MANIFEST_INVALID_INPUT: artifacts must be an array");
  }

  // Defensive copy
  const records = artifacts.map((a, idx) => {
    if (
      !a ||
      typeof a.absolute_path !== "string" ||
      typeof a.relative_path !== "string" ||
      typeof a.byte_size !== "number"
    ) {
      throw new Error(
        `INGEST_MANIFEST_INVALID_ARTIFACT at index ${idx}`
      );
    }

    return {
      absolute_path: a.absolute_path,
      relative_path: a.relative_path,
      byte_size: a.byte_size
    };
  });

  // Deterministic ordering: lexicographic by relative_path
  records.sort((a, b) => {
    if (a.relative_path < b.relative_path) return -1;
    if (a.relative_path > b.relative_path) return 1;
    return 0;
  });

  // Reject duplicates explicitly
  for (let i = 1; i < records.length; i++) {
    if (records[i].relative_path === records[i - 1].relative_path) {
      throw new Error(
        `INGEST_MANIFEST_DUPLICATE_PATH: ${records[i].relative_path}`
      );
    }
  }

  return {
    manifest_version: "1.0",
    artifact_count: records.length,
    artifacts: records
  };
}






