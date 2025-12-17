PRIMA VERITAS KERNEL — HEADER GUIDANCE (v1.0)
Purpose

Headers exist to protect determinism, scope, and operator intent.
They are documentation contracts, not style artifacts.

REQUIRED HEADER CONTENT (semantic, not cosmetic)

Every executable or core module must clearly state:

1. Responsibility

What this file does — precisely and narrowly.

“This file performs deterministic normalization of raw events into canonical form.”

2. Determinism Guarantees

Explicit list of forbidden behaviors.

Must include language equivalent to:

No randomness

No timestamps

No environment-dependent behavior

No heuristics or inference

Fixed ordering only

3. Non-Goals / Refusals

What this file will not attempt, even if inputs are messy.

Examples:

Will not guess missing fields

Will not auto-correct malformed data

Will not silently coerce types

Will not clean client dysfunction beyond explicit rules

4. Stability Contract

How changes should be treated.

Examples:

“Changes here are breaking”

“Inputs/outputs must remain byte-stable”

“Any behavior change requires version bump + replay diff”

OPTIONAL HEADER CONTENT (safe to omit)

Version numbers

Decorative separators

ASCII art

Historical notes

Contributor notes

License repetition (handled elsewhere)

These are non-binding and refactorable.

STYLE RULES (lightweight)

Comment style does not matter

Formatting does not matter

Order of sections does not matter

Clarity > verbosity

Explicit refusals > clever explanations

KERNEL-SPECIFIC RULES

Kernel files do not contain dataset-specific logic

Kernel files do not “help” the user

Kernel files fail loudly instead of guessing

Kernel files assume adversarial inputs

Kernel files favor replayability over convenience

OPERATOR PROMPT (reuse verbatim)

“Operate under the Prima Veritas Kernel Header Guidance.
Enforce strict determinism, explicit refusals, and narrow responsibility.
Do not introduce heuristics, cleanup logic, or implicit behavior.”

FINAL PRINCIPLE

Headers exist to stop future-you from being clever.

If cleverness is required, it belongs outside the kernel.