#!/usr/bin/env bash
set -euo pipefail
node -e 'if (Number(process.versions.node.split(".")[0]) !== 24) throw new Error("Configure Node 24 in this environment before running setup")'
clearcast_pnpm_version='11.25.0'
if ! command -v pnpm >/dev/null 2>&1 || [ "$(pnpm --version)" != "$clearcast_pnpm_version" ]; then
  npm install --global "pnpm@$clearcast_pnpm_version"
fi
pnpm install --frozen-lockfile --ignore-scripts
pnpm check
pnpm test
pnpm gate:status
