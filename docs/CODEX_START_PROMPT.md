# Clearcast: starting Codex task

Build Clearcast in this repository, beginning with the phase-zero validation milestone. Read AGENTS.md, docs/STATUS.md, docs/adr/0001-clearcast-name.md, and sections 1–5, 7–9 and 14 of docs/architecture.md before coding.

Treat the architecture as the implementation contract. Execute useful work now and leave runnable code, tests, sanitized evidence, and a clear continuation point. This first task is the dependency-validation milestone; do not attempt the full platform in one unverified pass.

## Deliver this first increment

1. Run the current bootstrap checks and inspect existing files. Reuse the workspace and gate checker; improve them where needed without weakening fail-closed behavior.
2. Implement G0.5 toolchain discovery/compatibility checks. Resolve exact supported dependency versions from official registries, commit the lockfile, and record versions and evidence. Build only the minimal spike/fixture dependencies required at this stage.
3. Implement `spikes/source-conformance` and its command. Enforce the fixed URL, strict response content/shape, exact bucket selection, lossless decimals, missing/conflicting data handling, rate limits, and sanitized evidence. Treat 200 HTML as failure. Add a fixture mode and a read-only live mode; distinguish their results explicitly.
4. Implement the deterministic AST/evaluator seed needed for G0.2 and the architecture's 30 independent golden cases. Create the explicit Clearcast identifier map before hashing or anchoring protocols. No floating-point money/price comparisons, hidden defaults, or model-based outcome decisions.
5. Implement Panta capability discovery/conformance scaffolding for G0.1: strict provisional schemas tied to captured official evidence, credential-safe read-only probes, and a capability matrix. Do not present handoff endpoint candidates as verified or create guessed responses. If official contracts or access are unavailable, record the precise blocker and finish the runnable fixture/conformance tooling.
6. Prepare the wallet harness and numeric budget schema for G0.4 without spending or deploying. Require an owned wallet and documented per-step authorization before any write. Test recovery/state-machine behavior with labeled fault fixtures; never mark that live gate PASS from fixture tests.
7. Prepare the G0.3 study protocol, counterbalanced task sheets, anonymized recording template, reviewer answer-key format and automatic metric calculation. Do not fabricate participants, responses or pass results.
8. Connect the new commands to package.json, write CLI usage and artifact formats, and run the relevant tests. Keep all gates honest. If access/study/wallet dependencies block completion, finish independent phase-zero work and produce concrete owner actions in docs/STATUS.md.

## Completion criteria for this task

- Runnable phase-zero commands with useful help/error output and deterministic fixtures.
- Meaningful source/evaluator/gate/state-machine tests pass; commands and results recorded.
- Exact dependency lockfile and actual toolchain evidence; no fake placeholders reported as conformance.
- Each gate remains NOT_RUN/RUNNING/FAIL unless its actual reviewed PASS criteria are satisfied.
- No credentials, signing keys, raw private study records, or pending signed transactions in Git.
- No full UI/backend/database-platform implementation beyond phase-zero prototype/harness scope while G0 is incomplete.
- A reviewable commit/PR titled around the implemented phase-zero behavior, and an updated STATUS.md with remaining blockers and the next bounded task.

Persist until this increment is complete. Do not stop at a plan or a mock screenshot. Do not bypass unavailable APIs, approval boundaries, or source support. If a fundamental gate fails, state the evidence and stop dependent work while completing remaining independent work in the phase.

In your final response, report shipped code, exact verification, real gate status, what still needs owner input, and the next task. Do not claim Clearcast is end-to-end complete after this first increment.
