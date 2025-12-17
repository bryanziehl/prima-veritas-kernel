/**
 * PRIMA VERITAS KERNEL — CLI INGEST ENTRYPOINT
 *
 * Responsibility:
 * This file provides a thin, deterministic CLI interface to kernel ingest.
 * It performs argument validation only and delegates all behavior to ingest modules.
 *
 * Determinism Guarantees:
 * - No randomness
 * - No timestamps
 * - No environment-dependent behavior
 * - No implicit defaults
 * - Fixed execution path for identical arguments
 *
 * Explicit Non-Goals:
 * - Will not guess input type
 * - Will not auto-detect formats
 * - Will not recurse unless explicitly instructed
 * - Will not clean, fix, or coerce data
 * - Will not suppress or recover from errors
 *
 * Stability Contract:
 * - Argument structure is a public contract
 * - Any behavior change is breaking
 * - Changes require version bump and replay diff
 */

import { ingestFile } from "../01_INGEST/ingest_file.mjs";
import { ingestDirectory } from "../01_INGEST/ingest_directory.mjs";
import { KernelError } from "../07_ERRORS/kernel_error.mjs";

function fail(
  message,
  code = "CLI_ARGUMENT_ERROR",
  stage = "cli"
) {
  throw new KernelError(code, stage, message);
}

const args = process.argv.slice(2);

if (args.length === 0) {
  fail("No arguments provided. Explicit input required.");
}

let mode = null;
let targetPath = null;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === "--file") {
    if (mode !== null) fail("Multiple ingest modes specified.");
    mode = "file";
    targetPath = args[++i];
    continue;
  }

  if (arg === "--dir") {
    if (mode !== null) fail("Multiple ingest modes specified.");
    mode = "dir";
    targetPath = args[++i];
    continue;
  }

  fail(`Unknown argument: ${arg}`);
}

if (!mode) {
  fail("Ingest mode not specified. Use --file or --dir.");
}

if (!targetPath) {
  fail("Target path missing.");
}

(async () => {
  try {
    if (mode === "file") {
      await ingestFile(targetPath);
    } else if (mode === "dir") {
      await ingestDirectory(targetPath);
    } else {
      fail("Unreachable ingest mode.");
    }
  } catch (err) {
    if (err instanceof KernelError) {
      console.error(err.format());
      process.exit(1);
    }
    throw err;
  }
})();
