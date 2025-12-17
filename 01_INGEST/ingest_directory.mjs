/**
 * Prima Veritas Kernel — ingest_directory.mjs
 *
 * Responsibility:
 * Deterministically enumerate files within a directory and emit a canonical,
 * ordered file manifest for downstream ingest. This module does not read file
 * contents or interpret file formats.
 *
 * Determinism Guarantees:
 * - No randomness
 * - No timestamps
 * - No environment-dependent ordering
 * - Fixed, lexicographic ordering only
 * - Explicit rejection of unsupported filesystem states
 *
 * Non-Goals / Refusals:
 * - Will not recurse implicitly unless explicitly instructed
 * - Will not ignore hidden files silently
 * - Will not auto-skip unreadable files
 * - Will not infer file types or intent
 *
 * Stability Contract:
 * - Output structure is byte-stable
 * - Any change to ordering, filtering, or emitted fields is breaking
 * - Changes require version bump and replay diff
 */

import fs from "fs";
import path from "path";
import { KernelError } from "../07_ERRORS/kernel_error.mjs";

/**
 * Deterministically enumerate files in a directory.
 *
 * @param {string} directoryPath - Absolute or relative path to directory
 * @param {object} options
 * @param {boolean} options.recursive - Explicit recursion flag (default: false)
 * @returns {Array<Object>} file manifest entries
 */
export function ingestDirectory(directoryPath, options = {}) {
  const { recursive = false } = options;

  if (typeof directoryPath !== "string" || directoryPath.length === 0) {
    throw KernelError.invalidInput(
      "DIRECTORY_PATH_INVALID",
      "Directory path must be a non-empty string"
    );
  }

  const resolvedPath = path.resolve(directoryPath);

  let stat;
  try {
    stat = fs.statSync(resolvedPath);
  } catch (err) {
    throw KernelError.ioFailure(
      "DIRECTORY_NOT_ACCESSIBLE",
      `Cannot access directory: ${resolvedPath}`
    );
  }

  if (!stat.isDirectory()) {
    throw KernelError.invalidInput(
      "PATH_NOT_DIRECTORY",
      `Path is not a directory: ${resolvedPath}`
    );
  }

  const results = [];

  function walk(currentPath) {
    let entries;
    try {
      entries = fs.readdirSync(currentPath, { withFileTypes: true });
    } catch (err) {
      throw KernelError.ioFailure(
        "DIRECTORY_READ_FAILED",
        `Failed to read directory: ${currentPath}`
      );
    }

    // Deterministic ordering
    entries
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b))
      .forEach((name) => {
        const fullPath = path.join(currentPath, name);
        let entryStat;

        try {
          entryStat = fs.statSync(fullPath);
        } catch (err) {
          throw KernelError.ioFailure(
            "FILE_STAT_FAILED",
            `Failed to stat path: ${fullPath}`
          );
        }

        if (entryStat.isDirectory()) {
          if (recursive) {
            walk(fullPath);
          } else {
            // Explicitly record directory presence without traversal
            results.push({
              type: "directory",
              path: fullPath,
            });
          }
        } else if (entryStat.isFile()) {
          results.push({
            type: "file",
            path: fullPath,
            size_bytes: entryStat.size,
          });
        } else {
          throw KernelError.invalidInput(
            "UNSUPPORTED_FS_ENTRY",
            `Unsupported filesystem entry: ${fullPath}`
          );
        }
      });
  }

  walk(resolvedPath);

  return results;
}






