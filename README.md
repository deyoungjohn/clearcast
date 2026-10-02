# Clearcast

Clearcast turns a prediction into an explicit, tested market specification, publishes it through Panta using the owner's wallet, and preserves a verifiable evidence record.

This repository is initialized for gated development on Codex cloud. It is a bootstrap, not a working market application. All product and live-integration gates are **NOT_RUN**.

## Start

1. Read [AGENTS.md](AGENTS.md).
2. Read the [architecture](docs/architecture.md) and [branding decision](docs/adr/0001-clearcast-name.md).
3. Configure the environment using [Codex cloud setup](docs/codex-cloud-setup.md).
4. Paste [the starting prompt](docs/CODEX_START_PROMPT.md) into a Codex task on this repository.

## Bootstrap commands

Requires Node 24 and pnpm 11.25.0. The initial bootstrap has no third-party runtime dependencies.

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm gate:status
pnpm gate:check G1
```

The last command is expected to fail until all G0 subgates have real, reviewed evidence. Bootstrap checks passing do not mean G0 passed.

## Build order

G0: capability/source/product/financial/toolchain validation → G1: foundation → G2: compiler → G3: approvals → G4: publication → G5: participation/claims → G6: live evidence → G7: operational pilot.

Use [STATUS.md](docs/STATUS.md) to continue work across tasks. Commit code and sanitized evidence; never commit credentials, signing keys, private user study records, or raw pending signed transactions. Do not claim source support, market creation, claim completion, or customer validation until independently evidenced.

The first intended category is BTC-USD UTC daily close. Source availability and Panta resolution support must be validated before dependent implementation. Nothing in this bootstrap authorizes financial transactions or production deployment.
