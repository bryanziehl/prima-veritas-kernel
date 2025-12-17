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
No meaning is resolved here.

---

## What This Layer DOES

The atomization layer is responsible for:

- Emitting one or more **event objects** per normalized input record
- Preserving original ordering when provided
- Preserving timestamps **only if explicitly present in input**
- Assigning deterministic sequence indices
- Capturing provenance (source file, record index, identifiers)
- Emitting ambiguity as ambiguity, without resolution

This layer produces **facts as-recorded**, not conclusions.

---

## What This Layer DOES NOT DO

The atomization layer will NOT:

- Infer causality
- Infer intent, motive, or responsibility
- Invent timestamps or temporal relationships
- Collapse multiple records into summaries
- Reorder events unless explicitly instructed by invariant rules
- Clean, repair, or normalize client meaning
- Guess missing fields
- Interpret payload semantics

If ambiguity exists in the input, it must survive atomization unchanged.

---

## Determinism Guarantees

All behavior in this layer is:

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
  - zero events **only via explicit rejection**
  - one event
  - multiple events **only if rule-driven and documented**

Silent drops are forbidden.

---

## Output Contract

This layer outputs:

- A flat, ordered list of event objects
- Strictly conforming to `event_schema.json`
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

This layer is **mandatory**.

If atomization is incorrect, the kernel’s guarantees do not hold.

---

## Final Invariant

Atomization preserves recorded structure and order.
It does not create meaning.

Any logic that violates that sentence does not belong here.
