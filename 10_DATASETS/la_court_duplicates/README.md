# LA Court — Duplicates Dataset  
NON-KERNEL DATASET

## Purpose
A controlled test dataset that introduces:
- exact duplicate records  
- near-duplicate records  
- repeated event_ids  
- payload-level duplicates  
- reordered duplicates  

This validates that the Prima Veritas kernel:
- processes duplicate structured records deterministically  
- produces a stable ledger_hash  
- keeps normalization + atomization + replay strictly mechanical  
- never infers or repairs duplicates  

## Pipeline
1. `input.json` is copied from baseline (`records.json`).  
2. `mutate_duplicates.mjs` injects controlled duplicate patterns.  
3. `run.mjs` materializes:  
   - `atoms.json`  
   - `ledger.json`  
   - `expected_hash.txt`  
   - `replay.json`

## Determinism Notes
- No randomness  
- Duplicate insertion uses fixed index rules  
- Ordering is preserved except where intentionally cloned  

## Output Contract
`expected_hash.txt` MUST equal `ledger.ledger_hash`
