/**
 * Prima Veritas Kernel — ingest_file.mjs
 *
 * Responsibility
 * --------------
 * Deterministically ingest a single file as raw bytes and emit a stable
 * ingest artifact describing its contents and structural metadata.
 *
 * This module captures reality; it does not interpret it.
 *
 * Determinism Guarantees
 * ---------------------
 * - No randomness
 * - No timestamps
 * - No environment-dependent behavior
 * - No locale-dependent encoding logic
 * - Fixed byte-for-byte reads
 * - Explicit ordering only
 *
 * Forbidden Behaviors
 * -------------------
 * - No format inference
 * - No schema detection
 * - No content parsing
 * - No encoding correction
 * - No newline normalization
 * - No trimming or coercion
 * - No silent fallback behavior
 *
 * Stability Contract
 * ------------------
 * This file is a breaking-change boundary.
 * Any modification requires a version bump and replay diff validation.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { KernelError } from "../07_ERRORS/kernel_error.mjs";

/**
 * Deterministically ingest a single file.
 *
 * @param {string} filePath - Absolute or relative path to file
 * @returns {Object} ingest artifact
 */
export function ingestFile(filePath) {
  if (typeof filePath !== "string" || filePath.length === 0) {
    throw KernelError.invalidInput(
      "INGEST_INVALID_PATH",
      "File path must be a non-empty string",
      { provided: filePath }
    );
  }

  const resolvedPath = path.resolve(filePath);

  let stat;
  try {
    stat = fs.statSync(resolvedPath);
  } catch (err) {
    throw KernelError.ioFailure(
      "INGEST_STAT_FAILED",
      "Unable to stat file",
      { path: resolvedPath, error: err.message }
    );
  }

  if (!stat.isFile()) {
    throw KernelError.invalidInput(
      "INGEST_NOT_A_FILE",
      "Provided path is not a regular file",
      { path: resolvedPath }
    );
  }

  let buffer;
  try {
    buffer = fs.readFileSync(resolvedPath);
  } catch (err) {
    throw KernelError.ioFailure(
      "INGEST_READ_FAILED",
      "Unable to read file bytes",
      { path: resolvedPath, error: err.message }
    );
  }

  // Cryptographic hash of raw bytes (content-addressed identity)
  const sha256 = crypto
    .createHash("sha256")
    .update(buffer)
    .digest("hex");

  // IMPORTANT: No timestamps, no inode numbers, no OS-specific metadata
  return {
    type: "INGEST_FILE",
    path: resolvedPath,
    filename: path.basename(resolvedPath),
    size_bytes: buffer.length,
    hash_sha256: sha256,
    raw_bytes_base64: buffer.toString("base64"),
  };
}






