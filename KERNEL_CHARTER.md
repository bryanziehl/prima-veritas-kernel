PRIMA VERITAS — KERNEL CHARTER (v1.0.0)

Purpose

The Prima Veritas Kernel exists to produce deterministic, replayable, verifiable truth artifacts from structured inputs, without interpretation, inference, correction, or enrichment.

The kernel is a truth-preserving machine, not:

- an analytics engine
- an ETL pipeline
- a data-cleaning service
- a decision or scoring system

Its outputs must be:

- bit-for-bit reproducible
- auditable
- legally defensible
- independent of operator intent

What the Kernel IS

The kernel is responsible for only the following functions:

1. Deterministic Ingest

- Accepting input files exactly as provided
- Recording raw structure, ordering, and source metadata
- Explicitly rejecting malformed or unsupported inputs  
  (never silently coercing or correcting)

2. Canonical Normalization

- Applying deterministic, documented transforms only
- No heuristics
- No probabilistic logic
- No “fixing,” guessing, or smoothing

All transforms must:

- preserve provenance
- be reversible in principle
- be declared before execution

3. Event Atomization

- Breaking inputs into atomic events
- Preserving original ordering where provided
- Recording ambiguity as ambiguity, never resolving it
- Capturing uncertainty explicitly (nulls, ranges, conflicts)

4. Hash-Chain Sealing

- Producing cryptographic attestations over:
  - inputs
  - transforms
  - event atoms
- Ensuring replay yields identical outputs across machines

Canonical Hash Contract

The kernel’s canonical hash attests only to the ordered event ledger produced by the kernel, together with the declared kernel version and specification version.

The canonical hash does not attest to reports, presentations, interpretations, summaries, or downstream artifacts derived from the ledger.

5. Deterministic Replay

- Reconstructing the exact recorded event sequence
- Surfacing gaps, conflicts, reversals, and duplicates
- Emitting signals, not conclusions

6. Invariant Enforcement

- Enforcing immutability
- Enforcing declared ordering rules
- Enforcing non-inference
- Enforcing determinism or refusing execution

What the Kernel IS NOT

The kernel will never:

❌ Infer intent, causality, motive, fault, or responsibility  
❌ Decide “what happened” beyond recorded events  
❌ Clean, reconcile, repair, or normalize meaning  
❌ Fill gaps or “make data reasonable”  
❌ Collapse events into summaries  
❌ Reorder events unless instructed by an explicit deterministic rule  
❌ Perform analytics, scoring, ranking, or judgments  
❌ Generate narratives, conclusions, or opinions  

If a client requests any of the above, that work does not belong in the kernel.

Boundary of Responsibility

Layer | Responsibility
--- | ---
Client / Operator | Data preparation, export, formatting, business meaning
Kernel | Deterministic ingest → normalize → atomize → replay → attest
Report / Analysis Layer | Interpretation, summaries, visuals
Legal / Human Review | Conclusions, arguments, decisions

The kernel never crosses upward into interpretation.

Error Philosophy

- Errors are first-class outputs
- Ambiguity is preserved, not resolved
- Conflicts are emitted as conflicts
- Missing data is recorded as missing
- Silence is failure
- Assumptions are forbidden

If something cannot be represented truthfully, execution must stop.

Determinism Requirements

- Same input → same output
- Across machines
- Across time
- Across operators

If determinism cannot be guaranteed, the kernel must refuse execution.

Extensibility Rules

All new modules must:

- declare invariants
- declare input/output schemas
- be deterministic by construction

Client-specific logic never enters the kernel.  
Domain adapters live outside the kernel boundary.

Legal & Evidentiary Posture

The kernel produces:

- artifacts
- ledgers
- replayable sequences

The kernel’s canonical hash certifies recorded order and structure only, not interpretation or meaning.

It does not produce opinions.

This distinction is intentional and must never be blurred.

Change Control

This charter is versioned.

Changes require:

- explicit version bump
- written rationale
- acknowledgment of scope change

Silent drift is prohibited.

Note: All prior revisions occurred pre-release; v1.0.0 represents the first public, normative kernel contract.

Final Invariant

The kernel preserves truth; it does not create meaning.

If a feature proposal violates that sentence, it does not belong here.

Charter Version: v1.0.0  
Status: ACTIVE  
Scope: All kernel code, present and future
