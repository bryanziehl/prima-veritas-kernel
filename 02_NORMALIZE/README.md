# Normalize Layer — Prima Veritas Kernel

## Responsibility

The normalization layer applies **explicit, deterministic, and documented
transforms** to ingested data.

Normalization exists to make inputs **structurally comparable and replayable**.
It is a mechanical transform layer, not an interpretation or correction layer.

---

## What This Layer DOES

The normalization layer:

- Applies **fixed, declared rules** to ingested artifacts
- Produces **byte-stable canonical representations**
- Makes structural differences explicit
- Preserves ambiguity as ambiguity
- Explicitly refuses inputs that violate declared normalization rules

---

## What This Layer DOES NOT DO

The normalization layer will **never**:

- Use heuristics
- Guess missing values
- Apply probabilistic logic
- Infer schemas or meaning
- Repair, reconcile, or “fix” data
- Apply domain-specific assumptions

If normalization would require judgment or interpretation,
the kernel must refuse execution.

---

## Determinism Guarantees

All normalization modules guarantee:

- No randomness
- No timestamps
- No environment-dependent behavior
- Fixed, explicit ordering only
- Identical input and rules → identical output (bit-for-bit)

---

## Inputs and Outputs

**Inputs**
- Raw artifacts emitted by the ingest layer
- Explicit normalization rules (`normalize_rules.json`, `normalize_text.rules.json`)

**Outputs**
- Canonical, deterministic representations
- No enrichment
- No inferred or repaired structure
- No loss of information beyond declared rules

---

## Change Control

Normalization behavior is **breaking by default**.

Any change requires:
- Version bump
- Replay diff
- Explicit written rationale

Silent drift is prohibited.

---

## Boundary Rule

Normalization prepares data for **atomization**, not analysis.

If a transformation would alter meaning, intent, or interpretation,
it does not belong in this layer.

---

## Final Invariant

Normalization makes structure explicit.

It does not make data correct.
