Quickstart — Prima Veritas Kernel

(Zero setup. No installation. Explicit paths only.)

📌 Note for non-technical users

Prima Veritas uses PowerShell, the built-in command window included with every Windows computer.

To open it:

Click Start

Type PowerShell

Press Enter

You’ll see a prompt like:

PS C:\>


You do not need programming knowledge.
Just copy and paste the commands below exactly.

Execution Model (Important)

Prima Veritas has two distinct execution contexts:

Dataset materialization (generates proof data)

Kernel verification (verifies proof data)

This separation is intentional and enforced by design.

1. Materialize a dataset

You may run the dataset materializer from any folder, because the path is explicit.

node C:\PRIMA_VERITAS_KERNEL\10_DATASETS\la_court_baseline\run.mjs


This generates three deterministic outputs:

atoms.json

ledger.json

expected_hash.txt

All outputs are bit-for-bit identical across all machines.

No configuration.
No environment setup.
No interpretation.

2. Verify the dataset (Kernel CLI)

The kernel verification CLI may also be run from any folder, as long as all paths are explicit.

node C:\PRIMA_VERITAS_KERNEL\08_CLI\pv_verify.mjs `
  --ledger C:\PRIMA_VERITAS_KERNEL\10_DATASETS\la_court_baseline\ledger.json `
  --atoms  C:\PRIMA_VERITAS_KERNEL\10_DATASETS\la_court_baseline\atoms.json `
  --expected-hash C:\PRIMA_VERITAS_KERNEL\10_DATASETS\la_court_baseline\expected_hash.txt


If verification passes, the dataset is a valid Prima Veritas kernel proof.

Verification is binary:

✅ PASS

❌ FAIL

No explanations.
No repairs.
No inference.

3. View the canonical truth artifacts

All citation-safe, interpretation-free artifacts live here:

C:\PRIMA_VERITAS_KERNEL\90_CASEWORK_REPORTS\


This folder contains:

baseline replay

adversarial ordering replay

delta analysis

These files are authoritative and never modified.

4. Kernel code (for developers)

The deterministic replay kernel lives under:

00_SYSTEM
01_INGEST
02_NORMALIZE
03_ATOMIZE
04_LEDGER
05_REPLAY
08_CLI


Full rules, scope, and invariants are defined in:

KERNEL_CHARTER.md

SYSTEM_MAP.md

✅ Done

You have reproduced and verified Prima Veritas with:

no installation

no configuration

no prior technical experience

Prima Veritas is now live, deterministic, and verifiable end-to-end on your machine.