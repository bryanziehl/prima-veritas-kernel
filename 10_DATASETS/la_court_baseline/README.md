# la_court_baseline — Dataset Materializer (NON-KERNEL)

This folder contains the baseline LA court dataset.  
It represents the unmodified public ROA text extracted into a simple timeline.

Contents:

- input.txt — raw ROA text export  
- run.mjs — dataset materializer (NON-KERNEL)  
- atoms.json — atomized events  
- ledger.json — deterministic ledger output  
- expected_hash.txt — authoritative ledger hash for verification  

Dataset materializers:

- ingest input exactly  
- normalize deterministically  
- atomize events  
- build the ledger  
- write expected artifacts  

This folder is NON-KERNEL code.  
Kernel invariants do not apply.
