# Clearcast engineering instructions

## Read before implementing

- `docs/STATUS.md`: current progress and blockers.
- `docs/adr/0001-clearcast-name.md`: Clearcast branding and protocol identifier policy.
- `docs/architecture.md`: authoritative implementation specification. Read sections 1–5 and 14 before the first build task, then relevant sections before each change. The large blueprint belongs in this file, not in AGENTS.md.
- `docs/CODEX_START_PROMPT.md`: initial task scope and completion criteria.

## Work rules

Implement and verify concrete code. Do not end with a plan when useful authorized implementation remains. Work in reviewable increments and update STATUS.md with exact commands, evidence, blockers, and the next action. Before new work, inspect the branch and existing code; do not overwrite another task's changes.

Follow G0–G7 sequentially. Phase-zero spikes and tooling may be implemented while gates are NOT_RUN; full dependent application phases require the relevant predecessor PASS records. If a gate is blocked, finish other independent work in the current phase and prepare the concrete test/harness or decision for the owner. Never fabricate live outcomes or pass a gate based on mocks. Missing access is NOT_RUN, not a successful test.

A PASS requires named review, correct input/artifact hashes, all checks passed, and no blocking findings. Do not change gate requirements just to get a green result. If an architectural requirement is impossible or contradictory, document evidence in an ADR and identify the affected gate; an unaccepted proposal does not waive the requirement.

## Product/financial boundaries

- Use Clearcast as the product name. Preserve the source blueprint byte-for-byte; apply the branding ADR to new code.
- No custom custody program, PDA vault, server-held user private key, silent signing, secondary trading, or guaranteed payout.
- Every money-moving instruction must be decoded and matched to user intent. Allowlisting a program or passing simulation alone is insufficient.
- Persist signature and exact signed bytes before broadcast; uncertain broadcasts must be reconciled before a new attempt. No automatic duplicate spending.
- Panta controls settlement. Clearcast assessments are advisory. Missing source data is NEEDS_REVIEW, never NO.
- Compiler is deterministic and has no network/model/database effects. LLM output is untrusted drafting input.
- Keep credentials and user evidence private. Setup-only secrets must not be written to repository files to make them available to the agent.
- No live spending, credential/account creation, outreach, or deployment without the required existing authorization, owned wallet, and explicit numeric budget. Read-only research, code, and fixtures are allowed.

## Verification and handoff

Run `pnpm check` and `pnpm test` for bootstrap changes and meaningful targeted tests for new behavior. Add architecture-prescribed test commands as those suites exist; do not create scripts that return success without running checks. Pin exact dependency versions and commit a lockfile after compatibility checks. Keep live conformance separate from fixture results.

Final task report: implemented behavior, tests actually run, gate status, material blockers, and next concrete step. Include the exact branch/commit or PR when available. Do not label initialization or fixture success as completed end-to-end product delivery.
