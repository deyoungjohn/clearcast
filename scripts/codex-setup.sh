#!/usr/bin/env bash
set -euo pipefail
if ! command -v node >/dev/null 2>&1 || [ "$(node -p 'process.versions.node.split(".")[0]')" != '24' ]; then
  clearcast_nvm_script=''
  for clearcast_nvm_dir in "${NVM_DIR:-}" "$HOME/.nvm" /opt/nvm /usr/local/share/nvm; do
    if [ -n "$clearcast_nvm_dir" ] && [ -s "$clearcast_nvm_dir/nvm.sh" ]; then
      clearcast_nvm_script="$clearcast_nvm_dir/nvm.sh"
      export NVM_DIR="$clearcast_nvm_dir"
      break
    fi
  done
  if [ -z "$clearcast_nvm_script" ]; then
    echo 'Node 24 is required. Select Node 24 in the environment runtime settings, or provide nvm via NVM_DIR, then retry.' >&2
    exit 1
  fi
  # shellcheck disable=SC1090
  source "$clearcast_nvm_script"
  nvm install 24
  nvm use 24
  nvm alias default 24
  # Setup and agent commands run in separate shells. Persist only runtime selection.
  if ! grep -q '^# Clearcast Node 24 runtime$' "$HOME/.bashrc" 2>/dev/null; then
    {
      printf '\n# Clearcast Node 24 runtime\n'
      printf 'export NVM_DIR=%q\n' "$NVM_DIR"
      printf '[ ! -s %q ] || source %q\n' "$clearcast_nvm_script" "$clearcast_nvm_script"
      printf 'if declare -F nvm >/dev/null; then nvm use 24 --silent >/dev/null; fi\n'
    } >> "$HOME/.bashrc"
  fi
fi
node -e 'if (Number(process.versions.node.split(".")[0]) !== 24) throw new Error("Node 24 selection failed")'
clearcast_pnpm_version='11.25.0'
if ! command -v pnpm >/dev/null 2>&1 || [ "$(pnpm --version)" != "$clearcast_pnpm_version" ]; then
  npm install --global "pnpm@$clearcast_pnpm_version"
fi
pnpm install --frozen-lockfile --ignore-scripts
pnpm check
pnpm test
pnpm gate:status
