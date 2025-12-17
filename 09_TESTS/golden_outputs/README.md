
The contents must match kernel output:
- byte-for-byte
- field-for-field
- ordering preserved
- hashes preserved

Any deviation is a failure.

---

## Rules (Hard)

- Files in this directory **must not change** unless:
  - the kernel behavior has intentionally changed
  - the change is acknowledged as **breaking**
  - golden outputs are regenerated explicitly

- These files must not be:
  - reformatted
  - reordered
  - “cleaned up”
  - partially regenerated
  - hand-edited

If a file changes unintentionally, the kernel is invalid.

---

## Change Protocol

If a golden output changes:

1. A kernel invariant was modified
2. Determinism must be re-established
3. The change must be justified
4. The update must be deliberate and documented

Silent drift is forbidden.

---

## Final Invariant

Golden outputs are the **memory of the kernel**.

If the kernel disagrees with its own memory,
the kernel is wrong.
