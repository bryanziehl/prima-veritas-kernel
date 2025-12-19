# structural_mutation — Dataset Materializer (NON-KERNEL)

This folder contains a structural-mutation variant of the dataset.  
Its purpose is to demonstrate how the Prima Veritas kernel responds when the
underlying content is preserved but the surrounding structure is altered.

Contents:

- input.json — structurally mutated input  
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
