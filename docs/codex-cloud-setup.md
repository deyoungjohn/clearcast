# Codex cloud setup

Select `deyoungjohn/clearcast`, branch `main`, in your Codex environment. Repository initialization is complete; selecting/configuring the Codex environment is a separate step.

## Setup script

Choose **manual setup** and use this command from the repository root:

```bash
bash scripts/codex-setup.sh
```

Optional maintenance command for resumed environments:

```bash
bash scripts/codex-maintenance.sh
```

The setup installs and selects Node 24 through the environment's existing `nvm` when needed. It sets the nvm default and adds a runtime-only initializer to `~/.bashrc` for subsequent shells. If nvm is unavailable, select Node 24 in the environment runtime settings before retrying. The setup installs the exact pinned pnpm version when necessary, installs from the committed lockfile, and runs bootstrap checks. It does not create accounts, contact customers, fund wallets, sign transactions, or pass product gates.

Agent network access is needed for official documentation/registry research and selected read-only source/Panta probes. Configure only the domains actually required by the current spike: official documentation, the package registry, the verified source host, and the verified Panta host. Setup internet access and agent internet access are separate controls. A host returning a proxy HTML page is not a successful JSON response.

Use fixture mode initially. No production credential is needed for bootstrap or fixture tests. Never put secrets in the starting prompt or repository.

The official Codex cloud environment page currently documents Secrets as setup-only, removed before the agent phase. Do not copy them into `.env`, shell startup files, logs, or committed artifacts to bypass that boundary. For authenticated live probes, use an approved broker or run the explicitly scoped probe in a phase where the credential is intentionally available; record only sanitized results. Confirm the actual environment's current behavior before provisioning credentials.

## Starting task

Paste the content of [CODEX_START_PROMPT.md](CODEX_START_PROMPT.md). Run one bounded implementation milestone at a time. Subsequent tasks read STATUS.md and continue the earliest unsatisfied gate.

## Official references checked on 2 October 2026

- [Codex cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environment)
- [AGENTS.md instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md)

These settings are account/environment controls; no Codex task has been launched by this repository initialization.
