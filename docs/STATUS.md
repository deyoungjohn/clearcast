# Clearcast status

## Current milestone

Repository bootstrap created. Full architecture copied unchanged. No application, credentialed Panta integration, source conformance, signed approval, market, trade, claim, deployment, or customer study has been completed.

## Bootstrap versus product gates

`pnpm check` verifies repository JSON and JavaScript syntax. `pnpm test` tests the fail-closed gate verifier. Neither passes any product gate.

All G0.1–G0.5 and G0–G7 are NOT_RUN. See `evidence/gates/` and `pnpm gate:status`.

## First shipping task

Use `docs/CODEX_START_PROMPT.md`. Implement the phase-zero source and Panta read/conformance harnesses, compiler golden-test seed, gate evidence handling, and user-study assets. Validate toolchain compatibility. Do not start G1 until G0 is supported by real reviewed evidence.

## External prerequisites to resolve

- Current account-accessible Panta contracts, permissions, source-policy confirmation, network/mint/program identities.
- Reachability and valid JSON from the selected evidence source in the intended environment.
- Owner-approved numeric budget and an owned signing wallet for the controlled financial spike; no private key is required by the application.
- Independently reviewed product study and an eligible owned win-claim test.

## Required task handoff fields

Every subsequent task updates: commit, implemented files/behavior, exact executed commands and results, actual gate artifacts, blockers with reproducing steps, and the next bounded task. Do not copy secrets or raw user-study responses here.

## Phase-zero increment 1 — source/evaluator seed (2 October 2026)

Implemented the fixed Coinbase BTC-USD daily-candle URL builder, lossless JSON
numeric-token capture, strict content/tuple/target-bucket/OHLC validation, an
exact-decimal evaluator for the two-capture policy, and fixture/live CLI modes.
Fixture output is explicitly `FIXTURE_PASS` with gate status `NOT_RUN`. Added the
provisional undeployed Clearcast identifier map and a partial toolchain record
with exact locked versions for the minimal TypeScript source spike.

Commands executed on Node 24.21.0 and pnpm 11.25.0:

- `pnpm install` — PASS; lock resolution was current and the allowlisted
  `esbuild@0.25.12` install step completed.
- `pnpm check` — PASS; bootstrap integrity and strict TypeScript checks passed.
- `pnpm test` — PASS; 9 bootstrap/gate tests and 3 source/evaluator test groups.
- `pnpm source:conformance --mode fixture --fixture spikes/fixtures/coinbase-2030-01-01.json --date 2030-01-01`
  — artificial fixture PASS only; raw SHA-256
  `7e17e2b2ac329346b56040b12fb84e4d0ae19a0f1748de909e27ae66539757ff`.
- `pnpm gate:status` — status command passed; every product gate remains
  `NOT_RUN`.

No product-gate artifact was created and no live conformance was attempted.
G0.2 still requires a 30-day live run, delayed five-day repeat, deployed-region
reachability, retention confirmation, all 30 independent golden cases, named
execution, and review. G0.1 lacks official credentialed Panta contracts/access
and verified identities. G0.3 requires real independent participants/reviewers.
G0.4 requires its predecessors, an owned wallet, and an approved numeric budget.
G0.5 still needs the remaining dependency families, container digest,
advisory/license review, v0 signing/simulation fixture, and wallet harness.

Next bounded task: complete CMP-01–CMP-30 and generated decimal/calendar boundary
cases; extend the source runner to the rate-limited 30-day and delayed-repeat
manifest; then run a sanitized read-only probe if the intended region permits it.

## Node runtime setup fix — 2 October 2026

Fixed the Node 20 bootstrap failure in commit `0bd48ce60d764d4a35e2afc082449777f845c686` on `main`; regression tests and setup instructions follow in commits `c1c38a0b07f2b3b8b1c340ece72be5688ed8a752` and `26ea8a2a475481549e62026b864462373cd81874`. Setup now installs/selects Node 24 through existing nvm and persists runtime selection for subsequent Bash shells.

Verified locally: `bash -n scripts/codex-setup.sh`, `bash scripts/codex-setup.sh` on Node 24, `pnpm check`, and `pnpm test` (9 passed). Node 20 selection, subsequent-shell initialization, and repeated setup were tested with a stubbed version manager; a real Node download in the user's cloud environment has not been run here. Product gates remain NOT_RUN. Next action: retry environment setup against current main, then execute the bounded phase-zero starting prompt.
