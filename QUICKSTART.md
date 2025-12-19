Quickstart — Prima Veritas Kernel

(Zero setup. Works from any folder.)

📌 Note for non-technical users

Prima Veritas uses PowerShell, the built-in command window included with every Windows computer.

To open it:

Click Start

Type PowerShell

Press Enter

You’ll see a prompt like:

PS C:\>


You do not need programming knowledge.
Just copy and paste the commands below.

1. Materialize a dataset

Run this from any folder:

node C:\PRIMA_VERITAS_KERNEL\10_DATASETS\la_court_baseline\run.mjs


This generates three deterministic outputs:

atoms.json

ledger.json

expected_hash.txt

All outputs are bit-for-bit identical across all machines.

2. Verify the dataset

(Updated — uses the real CLI contract: three required flags)

Run this from any folder:

node C:\PRIMA_VERITAS_KERNEL\08_CLI\pv_verify.mjs --ledger C:\PRIMA_VERITAS_KERNEL\10_DATASETS\la_court_baseline\ledger.json --atoms C:\PRIMA_VERITAS_KERNEL\10_DATASETS\la_court_baseline\atoms.json --expected-hash C:\PRIMA_VERITAS_KERNEL\10_DATASETS\la_court_baseline\expected_hash.txt


If the verification passes, the dataset is a valid Prima Veritas kernel proof.

No navigation required.
No setup required.
Pure determinism.

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


See KERNEL_CHARTER.md and SYSTEM_MAP.md for full rules and invariants.

✅ Done

You have reproduced and verified Prima Veritas with:

no installation

no configuration

no technical experience

Prima Veritas is now live, deterministic, and verifiable end-to-end on your machine.