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
