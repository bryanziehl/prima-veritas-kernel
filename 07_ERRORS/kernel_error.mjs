/**
 * Prima Veritas Kernel — kernel_error.mjs
 *
 * Responsibility
 * ---------------
 * Defines the single canonical error object used by the Prima Veritas Kernel.
 * Errors are deterministic data artifacts, not exceptions or control flow.
 *
 * Determinism Guarantees
 * ---------------------
 * - No timestamps
 * - No randomness
 * - No environment-derived fields
 * - No stack traces
 * - Fixed key ordering
 *
 * Non-Goals / Explicit Refusals
 * -----------------------------
 * - Will not infer cause or responsibility
 * - Will not attach human-readable explanations beyond static messages
 * - Will not include OS paths, file handles, or runtime context
 * - Will not throw or catch exceptions internally
 *
 * Stability Contract
 * ------------------
 * - Shape of KernelError payload is immutable
 * - Adding or changing fields is a breaking change
 * - Any modification requires version bump + replay diff
 */

const KERNEL_ERROR_VERSION = "1.0";

/**
 * Create a deterministic kernel error object.
 *
 * @param {Object} params
 * @param {string} params.code
 * @param {string} params.stage
 * @param {string} params.message
 * @param {Object|null} params.details
 *
 * @returns {Object} frozen error object
 */
export function createKernelError({ code, stage, message, details = null }) {
  if (!code || !stage || !message) {
    // Kernel invariant violation
    throw new Error("KernelError requires code, stage, and message");
  }

  const errorObject = {
    type: "PRIMA_VERITAS_KERNEL_ERROR",
    version: KERNEL_ERROR_VERSION,
    code,
    stage,
    message,
    details,
  };

  return deepFreeze(errorObject);
}

/**
 * KernelError transport shell.
 *
 * This exists ONLY to satisfy JS module / CLI boundaries.
 * The deterministic payload lives in `.payload`.
 */
export class KernelError extends Error {
  constructor(code, stage, message, details = null) {
    super(message);
    this.name = "KernelError";
    this.payload = createKernelError({ code, stage, message, details });
  }

  format() {
    return JSON.stringify(this.payload, null, 2);
  }

  /* -----------------------------
   * Canonical static constructors
   * -----------------------------
   * These exist to prevent ad-hoc error creation across the kernel.
   * No logic, no inference, no environment coupling.
   */

  static ioFailure(message, details = null) {
    return new KernelError(
      "IO_FAILURE",
      "INGEST",
      message,
      details
    );
  }

  static invalidInput(message, stage = "INGEST", details = null) {
    return new KernelError(
      "INVALID_INPUT",
      stage,
      message,
      details
    );
  }

  static invariantViolation(message, stage, details = null) {
    return new KernelError(
      "INVARIANT_VIOLATION",
      stage,
      message,
      details
    );
  }
}

/**
 * Deterministically deep-freeze an object.
 */
function deepFreeze(obj) {
  if (obj && typeof obj === "object" && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    for (const key of Object.keys(obj)) {
      deepFreeze(obj[key]);
    }
  }
  return obj;
}
