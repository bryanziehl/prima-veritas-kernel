/**
 * PRIMA VERITAS KERNEL — CLI REPLAY ENTRYPOINT
 *
 * Responsibility:
 * This file provides a thin, deterministic CLI interface for replaying
 * an existing Prima Veritas ledger and atomized event set.
 *
 * It performs argument validation only and delegates all execution
 * to the replay module.
 *
 * Determinism Guarantees:
 * - No randomness
 * - No timestamps
 * - No environment-dependent behavior
 * - Explicit paths only
 * - Fixed execution path for identical arguments
 *
 * Explicit Non-Goals:
 * - Will not infer ledger or atom paths
 * - Will not auto-discover files
 * - Will not repair missing or malformed inputs
 * - Will not summarize or interpret results
 * - Will not suppress kernel errors
 *
 * Stability Contract:
 * - CLI arguments are a public contract
 * - Any change is breaking
 * - Behavior changes require version bump + replay diff
 */

import { replaySequence } from "../05_REPLAY/replay_sequence.mjs";
import { KernelError } from "../07_ERRORS/kernel_error.mjs";

function fail(message, code = "CLI_ARGUMENT_ERROR") {
  throw new KernelError(code, message);
}

const args = process.argv.slice(2);

if (args.length === 0) {
  fail("No arguments provided. Explicit ledger and atom paths required.");
}

let ledgerPath = null;
let atomsPath = null;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === "--ledger") {
    ledgerPath = args[++i];
    continue;
  }

  if (arg === "--atoms") {
    atomsPath = args[++i];
    continue;
  }

  fail(`Unknown argument: ${arg}`);
}

if (!ledgerPath) {
  fail("Missing required argument: --ledger <path>");
}

if (!atomsPath) {
  fail("Missing required argument: --atoms <path>");
}

(async () => {
  try {
    await replaySequence({
      ledgerPath,
      atomsPath
    });
  } catch (err) {
    if (err instanceof KernelError) {
      console.error(err.format());
      process.exit(1);
    }
    throw err;
  }
})();






