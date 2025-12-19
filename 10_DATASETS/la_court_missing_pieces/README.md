# LA Court — Missing Pieces Variant

This dataset is derived from the LA Court baseline dataset, with a
deterministic removal of several records to simulate missing filings,
lost paperwork, or incomplete digital transfer.

This variant demonstrates:
- Gap detection
- Timeline discontinuities
- Missing-event resilience
- Replay stability under partial information

All removals are deterministic and declared in mutate_missing.mjs.
