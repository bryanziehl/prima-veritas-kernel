/**
 * Prima Veritas Kernel — normalize_text.mjs
 *
 * Responsibility
 * --------------
 * Apply deterministic, explicit text normalization rules to raw text inputs.
 * This module performs mechanical, rule-declared transforms only.
 *
 * Determinism Guarantees
 * ---------------------
 * - No randomness
 * - No timestamps
 * - No locale- or environment-dependent behavior
 * - Explicit, rule-declared transforms only
 * - Pure transform: identical input + rules → identical output
 *
 * Explicit Non-Goals / Refusals
 * ----------------------------
 * - No language, encoding, or semantic inference
 * - No spelling or grammar correction
 * - No guessing missing text
 * - No trimming, padding, or reflow unless explicitly rule-declared
 * - No whitespace collapse unless explicitly rule-declared
 *
 * Stability Contract
 * ------------------
 * Output must remain byte-stable for identical input and rules.
 * Any behavior change requires a version bump and replay diff.
 */


import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Resolve kernel-owned normalization rules deterministically.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RULES_PATH = path.join(__dirname, "normalize_rules.json");

function loadRules() {
  const raw = fs.readFileSync(RULES_PATH, "utf8");
  return JSON.parse(raw);
}

/**
 * Normalize a text payload using explicit normalization rules.
 *
 * @param {string} rawText
 * @returns {string}
 */
export function normalizeText(rawText) {
  if (typeof rawText !== "string") {
    throw new Error("NORMALIZE_TEXT_INVALID_INPUT: rawText must be a string");
  }

  const rules = loadRules();

  if (!rules || typeof rules !== "object") {
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
