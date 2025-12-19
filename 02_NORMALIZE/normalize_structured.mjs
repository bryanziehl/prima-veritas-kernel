/**
 * Prima Veritas Kernel — normalize_structured.mjs
 *
 * Responsibility
 * --------------
 * Apply deterministic, rule-declared normalization to structured inputs
 * (objects and arrays) without interpretation, inference, or repair.
 *
 * Determinism Guarantees
 * ---------------------
 * - No randomness
 * - No timestamps
 * - No environment- or locale-dependent behavior
 * - Stable key ordering only when explicitly declared
 * - Pure transform: identical input + rules → identical output
 *
 * Explicit Non-Goals / Refusals
 * ----------------------------
 * - No schema inference or missing-field guessing
 * - No type coercion
 * - No default filling
 * - No conflict reconciliation
 * - No array reordering unless explicitly declared
 *
 * Stability Contract
 * ------------------
 * Output must remain byte-stable for identical input and rules.
 * Any behavior change requires a version bump and replay diff.
 */


export function normalizeStructured(input, rulesInput) {
  if (typeof rulesInput !== "object" || rulesInput === null) {
    throw new Error("NORMALIZE_STRUCTURED_INVALID_RULES");
  }

  // Canonical: accept only explicit rules, never apply defaults
  const rules =
    typeof rulesInput.rules === "object" && rulesInput.rules !== null
      ? rulesInput.rules
      : rulesInput;

  if (typeof rules !== "object" || rules === null) {
    throw new Error("NORMALIZE_STRUCTURED_INVALID_RULES");
  }

  const seen = new WeakSet();

  function walk(node) {
    if (node === null) return null;

    if (typeof node !== "object") {
      return node;
    }

    if (seen.has(node)) {
      throw new Error("NORMALIZE_STRUCTURED_CYCLE_DETECTED");
    }
    seen.add(node);

    // Arrays
    if (Array.isArray(node)) {
      if (rules.enforce_array_order !== true) {
        throw new Error("NORMALIZE_STRUCTURED_ARRAY_ORDER_UNDECLARED");
      }
      return node.map(walk);
    }

    // Objects
    let keys = Object.keys(node);

    if (rules.sort_object_keys === true) {
      keys = keys.slice().sort();
    } else if (rules.sort_object_keys !== undefined) {
      throw new Error(
        "NORMALIZE_STRUCTURED_INVALID_RULE: sort_object_keys must be boolean"
      );
    }

    const out = {};
    for (const k of keys) {
      out[k] = walk(node[k]);
    }

    return out;
  }

  return walk(input);
}
