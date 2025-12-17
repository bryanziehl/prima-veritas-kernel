# Atomization Layer — 03_ATOMIZE

## Purpose

The atomization layer converts normalized records into **atomic events**.

An event is the smallest indivisible unit of recorded occurrence the kernel
can attest to **without interpretation**.

This layer is the boundary where:
- structured data
- becomes
- ordered factual artifacts

No meaning is added here.
No meaning is removed here.

---

## What This Layer DOES

The atomization layer is responsible for:

- Emitting one or more **event objects** per normalized input record
- Preserving original ordering when provided
- Preserving timestamps *only if explicitly present*
- Assigning deterministic sequence indices
- Capturing provenance (source file, row index, record id, etc.)
- Emitting ambiguity as ambiguity

This layer produces **facts as-recorded**, not conclusions.

---

## What This Layer DOES NOT DO

The atomization layer will NOT:

- Infer causality
- Infer intent or motive
- Invent timestamps
- Collapse multiple records into summaries
- Reorder events unless explicitly instructed by invariant rules
- Clean or correct malformed client data
- Guess missing fields
- Interpret payload semantics

If input ambiguity exists, it must survive atomization unchanged.

---

## Determinism Guarantees

All behavior in this layer must be:

- Fully deterministic
- Replayable across machines and time
- Independent of environment
- Independent of operator intent

Forbidden behaviors include:

- Randomness
- System clocks
- UUID generation
- Non-deterministic iteration
- Implicit sorting
- Heuristic splitting or merging

---

## Event Cardinality Rules

- One input record may produce:
  - zero events **only if explicitly rejected**
  - one event
  - multiple events (only if rule-driven and documented)

Silent drops are forbidden.

---

## Output Contract

This layer outputs:

- A flat, ordered list of event objects
- Conforming strictly to `event_schema.json`
- With stable ordering and stable field structure

Downstream layers MUST be able to replay these events
without consulting the original dataset.

---

## Failure Philosophy

Failures are first-class outputs.

If an input record cannot be atomized deterministically:
- Emit a structured kernel error
- Do not guess
- Do not partially emit

---

## Relationship to Other Layers

- Consumes output from `02_NORMALIZE`
- Produces inputs for `04_LEDGER`
- Enforced by invariants defined in `06_INVARIANTS`
- Errors defined in `07_ERRORS`

This layer is **not optional**.

If atomization is incorrect, the entire kernel is invalid.

---

## Final Invariant

Atomization preserves truth as recorded.
It does not create meaning.

Any logic that violates that sentence does not belong here.
