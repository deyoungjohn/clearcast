# Phase-zero spikes

Implement the validation harnesses described in architecture section 1 before the application. Initial files do not claim any completed probe.

Default to fixture/read-only behavior. Financial probes require the architecture's explicit budget and owned-wallet signing flow. Use `budget.local.json` for private local budget values; the schema will be committed during the first task. Evidence must state live versus fixture and remain sanitized.

## Source conformance seed

Run the artificial fixture with `pnpm source:conformance --mode fixture --fixture
spikes/fixtures/coinbase-2030-01-01.json --date 2030-01-01`. A single read-only
probe uses `--mode live`; add `--output evidence/private/source-probe.json` so
raw evidence remains ignored until sanitized and reviewed.

The command constructs the fixed Coinbase Exchange URL internally and rejects
redirects, unsuccessful responses, non-JSON content (including 200 HTML), and
malformed, duplicate, missing, misaligned, or OHLC-inconsistent target buckets.
Neither fixture success nor a single live probe passes G0.2.
