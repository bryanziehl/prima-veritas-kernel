# normalize — Deterministic Normalization Layer

## Purpose

This layer applies **explicit, deterministic, documented transforms** to ingested data.
Normalization exists to make inputs **structurally comparable and replayable**, not cleaner,
nicer, or more meaningful.

Normalization is a **mechanical transform**, not interpretation.

---

## What This Layer DOES

- Applies **fixed, declared rules** to raw inputs
- Produces **byte-stable canonical representations**
- Makes structural differences explicit
- Preserves ambiguity as ambiguity
- Refuses inputs that violate declared normalization rules

---

## What This Layer DOES NOT Do

❌ No heuristics  
❌ No guessing missing values  
❌ No probabilistic logic  
❌ No schema inference  
❌ No data repair or reconciliation  
❌ No domain-specific assumptions  

If normalization would require judgment, the kernel **must refuse execution**.

---

## Determinism Guarantees

All normalization modules must guarantee:

- No randomness
- No timestamps
- No environment-dependent behavior
- Fixed ordering only
- Identical input → identical output (bit-for-bit)

---

## Inputs / Outputs

**Input**
- Raw artifacts from ingest layer
- Explicit normalization rules (`normalize_rules.json`)

**Output**
- Canonical, deterministic representations
- No enrichment
- No loss of original structure beyond declared rules

---

## Change Control

- Normalization behavior is **breaking by default**
- Any rule change requires:
  - Version bump
  - Replay diff
  - Explicit rationale
- Silent drift is prohibited

---

## Boundary Rule

Normalization prepares data for **atomization**, not analysis.

If a transformation would change meaning, intent, or interpretation,
it does **not** belong in this layer.

---

## Final Invariant

Normalization makes structure explicit.
It does not make data correct.
