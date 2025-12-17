/**
 * Prima Veritas Kernel — normalize_structured.mjs
 *
 * Responsibility
 * ---------------
 * Apply deterministic, rule-declared normalization to structured inputs
 * (objects / arrays) without interpretation or repair.
 *
 * Determinism Guarantees
 * ---------------------
 * - No randomness
 * - No timestamps
 * - No locale / environment-dependent behavior
 * - Stable key ordering (when declared)
 * - Pure transform: input → output
 *
 * Non-Goals / Explicit Refusals
 * ----------------------------
 * - Will not infer schemas or missing fields
 * - Will not coerce types
 * - Will not fill defaults
 * - Will not reconcile conflicts
 * - Will not reorder arrays unless explicitly declared
 *
 * Stability Contract
 * ------------------
 * - Output must remain byte-stable for identical input + rules
 * - Any behavior change requires version bump + replay diff
 */

export function normalizeStructured(input, rulesInput) {
  if (typeof rulesInput !== "object" || rulesInput === null) {
    throw new Error("NORMALIZE_STRUCTURED_INVALID_RULES");
  }

  // Accept BOTH:
  // 1) full rules document { meta, rules, invariants, refusals }
  // 2) raw rules object { sort_object_keys, enforce_array_order }
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
