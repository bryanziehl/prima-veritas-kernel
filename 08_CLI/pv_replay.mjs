/**
 * PRIMA VERITAS KERNEL — CLI REPLAY ENTRYPOINT
 *
 * Responsibility:
 * Provide a thin, deterministic CLI interface for replaying
 * an existing Prima Veritas ledger and atomized event set.
 *
 * Performs argument validation only and delegates execution
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

import fs from "fs";
import { replaySequence } from "../05_REPLAY/replay_sequence.mjs";
import { KernelError } from "../07_ERRORS/kernel_error.mjs";

function fail(message, code = "CLI_ARGUMENT_ERROR", stage = "REPLAY") {
  throw new KernelError(code, stage, message);
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
    const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
    const atoms = JSON.parse(fs.readFileSync(atomsPath, "utf8"));

    replaySequence({
      ledger,
      atoms,
      returnFinalHash: false
    });

    console.log("REPLAY VERIFIED");
  } catch (err) {
    if (err instanceof KernelError) {
      console.error(err.format());
      process.exit(1);
    }
    throw err;
  }
})();
