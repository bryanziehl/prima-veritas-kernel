PRIMA VERITAS KERNEL — HEADER GUIDANCE (v1.0.0)

Purpose

Headers exist to protect determinism, scope, and operator intent.
They are documentation contracts, not style artifacts.

They define what a file is allowed to do, and—more importantly—what it must refuse to do.

APPLICABILITY

This guidance applies to:

- All kernel modules (00–08)
- All CLI entrypoints
- Any file whose behavior affects canonical hashes or replay outcomes

This guidance does NOT apply to:

- Dataset materializers (10_DATASETS/*/run.mjs)
- Reports, templates, or outreach artifacts
- Non-kernel tooling

REQUIRED HEADER CONTENT (semantic, not cosmetic)

Every executable or core kernel module must clearly state:

1. Responsibility

What this file does — precisely and narrowly.

Example:
“This file performs deterministic normalization of structured inputs into canonical form.”

Responsibility must be:

- singular
- bounded
- non-overlapping with adjacent layers

2. Determinism Guarantees

An explicit list of forbidden behaviors.

Must include language equivalent to:

- No randomness
- No timestamps
- No environment-dependent behavior
- No heuristics or inference
- Fixed ordering only
- Hash scope is explicit and stable

If a file contributes to a hash, it must say so.

3. Non-Goals / Refusals

What this file will not attempt, even if inputs are messy or incomplete.

Examples:

- Will not guess missing fields
- Will not auto-correct malformed data
- Will not silently coerce types
- Will not clean client dysfunction beyond explicit rules
- Will not interpret meaning or intent

Refusals are mandatory.
Silence implies prohibition.

4. Stability Contract

How changes to this file must be treated.

Examples:

- “Changes here are breaking”
- “Inputs/outputs must remain byte-stable”
- “Any behavior change requires version bump + replay diff”
- “Hash-affecting changes invalidate prior artifacts”

If the file affects determinism, the header must say how.

OPTIONAL HEADER CONTENT (safe to omit)

- Version numbers
- Decorative separators
- ASCII art
- Historical notes
- Contributor notes
- License repetition (handled elsewhere)

These are non-binding and refactorable.

STYLE RULES (lightweight)

- Comment style does not matter
- Formatting does not matter
- Order of sections does not matter
- Clarity > verbosity
- Explicit refusals > clever explanations

KERNEL-SPECIFIC RULES

- Kernel files do not contain dataset-specific logic
- Kernel files do not “help” the user
- Kernel files fail loudly instead of guessing
- Kernel files assume adversarial inputs
- Kernel files favor replayability over convenience
- Kernel files do not embed interpretation or policy

OPERATOR PROMPT (reuse verbatim)

“Operate under the Prima Veritas Kernel Header Guidance.
Enforce strict determinism, explicit refusals, and narrow responsibility.
Do not introduce heuristics, cleanup logic, interpretation, or implicit behavior.”

FINAL PRINCIPLE

Headers exist to stop future-you from being clever.

If cleverness is required, it belongs outside the kernel.
