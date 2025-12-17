# Prima Veritas Kernel — Golden Inputs

## Role

This directory contains **canonical, adversarial test fixtures** used by
`determinism.test.mjs` to prove kernel determinism.

These files are **opaque inputs**.
They are not examples.
They are not documentation.
They are not meant to be read, explained, or interpreted.

They exist solely to be ingested, transformed, atomized, ledgered, replayed,
and compared byte-for-byte across executions.

---

## Rules (Hard)

- Files in this directory **must not change** without:
  - updating corresponding golden outputs
  - acknowledging a **breaking change**
  - providing explicit justification

- No file in this directory may:
  - be reformatted
  - be normalized
  - be “cleaned”
  - be reordered
  - be commented
  - be “made nicer”

- Filenames are part of the contract.
- File bytes are part of the contract.

---

## Design Intent

Golden inputs are intentionally:
- small
- minimal
- awkward
- adversarial

They may include:
- ordering edge cases
- nested structures
- missing fields
- duplicate-looking records
- structurally valid but semantically strange data

This is intentional.

---

## Change Protocol

If a golden input changes:
1. The kernel has changed
2. Determinism must be re-proven
3. Golden outputs must be regenerated
4. The change must be treated as **breaking**

Silent edits are forbidden.

---

## Final Invariant

If a golden input passes today and fails tomorrow,
**the kernel is wrong — not the test**.
