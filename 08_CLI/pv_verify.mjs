/**
 * PRIMA VERITAS KERNEL — CLI VERIFY ENTRYPOINT
 *
 * Responsibility:
 * Deterministically verify that a provided ledger matches
 * an expected canonical ledger hash.
 *
 * Verification is binary: PASS or FAIL.
 *
 * Determinism Guarantees:
 * - No randomness
 * - No timestamps
 * - No environment-dependent behavior
 * - Explicit paths only
 * - Fixed execution path for identical inputs
 *
 * Explicit Non-Goals:
 * - Will not explain failures
 * - Will not repair mismatches
 * - Will not infer missing parameters
 * - Will not generate reports or summaries
 *
 * Stability Contract:
 * - CLI arguments are a public contract
 * - Any change is breaking
 * - Behavior changes require version bump + replay diff
 */

import { replaySequence } from "../05_REPLAY/replay_sequence.mjs";
import { KernelError } from "../07_ERRORS/kernel_error.mjs";
import { readFileSync } from "fs";

function fail(message, code = "CLI_ARGUMENT_ERROR", stage = "VERIFY") {
  throw new KernelError(code, stage, message);
}

const args = process.argv.slice(2);

let ledgerPath = null;
let atomsPath = null;
let expectedHashPath = null;

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

  if (arg === "--expected-hash") {
    expectedHashPath = args[++i];
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

if (!expectedHashPath) {
  fail("Missing required argument: --expected-hash <path>");
}

(async () => {
  try {
    const ledger = JSON.parse(readFileSync(ledgerPath, "utf8"));
    const atoms = JSON.parse(readFileSync(atomsPath, "utf8"));
    const expectedHash = readFileSync(expectedHashPath, "utf8").trim();

    if (!ledger || typeof ledger !== "object") {
      throw new KernelError(
        "LEDGER_INVALID",
        "VERIFY",
        "Ledger must be a JSON object."
      );
    }

    if (!ledger.ledger_hash || typeof ledger.ledger_hash !== "string") {
      throw new KernelError(
        "LEDGER_HASH_MISSING",
        "VERIFY",
        "Ledger does not contain canonical ledger_hash"
      );
    }

    // Canonical verification hash = ledger.ledger_hash (per KERNEL_CHARTER)
    if (ledger.ledger_hash !== expectedHash) {
      throw new KernelError(
        "VERIFICATION_FAILED",
        "VERIFY",
        "Ledger hash does not match expected hash."
      );
    }

    // Replay is a determinism sanity check only
    await replaySequence({
      ledger,
      atoms,
      returnFinalHash: false
    });

    console.log("VERIFICATION PASSED");
  } catch (err) {
    if (err instanceof KernelError) {
      console.error(err.format());
      process.exit(1);
    }
    throw err;
  }
})();
