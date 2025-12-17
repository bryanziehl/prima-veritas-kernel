/**
 * Prima Veritas Kernel — normalize_text.mjs
 *
 * Responsibility
 * ---------------
 * Apply deterministic, explicit text normalization rules to raw text inputs.
 * This module performs mechanical transforms only, as declared in rules.
 *
 * Determinism Guarantees
 * ---------------------
 * - No randomness
 * - No timestamps
 * - No locale, encoding, or environment-dependent behavior
 * - Fixed ordering only
 * - Pure function: input → output
 *
 * Non-Goals / Explicit Refusals
 * ----------------------------
 * - Will not infer language, encoding, or semantics
 * - Will not auto-correct spelling or grammar
 * - Will not guess missing text
 * - Will not trim, pad, or reflow text unless explicitly instructed
 * - Will not collapse whitespace unless rule-declared
 *
 * Stability Contract
 * ------------------
 * - Output must remain byte-stable for identical input + rules
 * - Any behavior change requires version bump + replay diff
 */

import fs from "fs";

/**
 * Normalize a text payload using explicit normalization rules.
 *
 * @param {string} rawText
 * @param {Object} rules
 * Rules may include only explicit, boolean or enum transforms, e.g.:
 *   {
 *     "normalize_newlines": "LF",
 *     "strip_trailing_whitespace": true
 *   }
 *
 * @returns {string}
 */
export function normalizeText(rawText, rules) {
  if (typeof rawText !== "string") {
    throw new Error("NORMALIZE_TEXT_INVALID_INPUT: rawText must be a string");
  }

  if (typeof rules !== "object" || rules === null) {
    throw new Error("NORMALIZE_TEXT_INVALID_RULES");
  }

  let output = rawText;

  // Normalize newline characters
  if (rules.normalize_newlines) {
    if (rules.normalize_newlines === "LF") {
      output = output.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    } else if (rules.normalize_newlines === "CRLF") {
      output = output.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      output = output.replace(/\n/g, "\r\n");
    } else {
      throw new Error(
        `NORMALIZE_TEXT_INVALID_RULE: normalize_newlines=${rules.normalize_newlines}`
      );
    }
  }

  // Strip trailing whitespace (spaces + tabs only)
  if (rules.strip_trailing_whitespace === true) {
    output = output.replace(/[ \t]+$/gm, "");
  } else if (rules.strip_trailing_whitespace !== undefined) {
    throw new Error(
      "NORMALIZE_TEXT_INVALID_RULE: strip_trailing_whitespace must be boolean"
    );
  }

  return output;
}






