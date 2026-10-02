import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

for (const major of [20, 24]) {
  test(`setup starting on Node ${major} reaches package commands on Node 24`, () => {
    const root = mkdtempSync(join(tmpdir(), 'clearcast-setup-'));
    try {
      const bin = join(root, 'bin');
      const home = join(root, 'home');
      const nvmDir = join(home, '.nvm');
      mkdirSync(bin); mkdirSync(nvmDir, { recursive: true });
      const executable = (name, body) => writeFileSync(join(bin, name), `#!/bin/bash\n${body}\n`, { mode: 0o755 });
      executable('node', 'if [ "$1" = -p ]; then echo "$TEST_NODE_MAJOR"; else [ "$TEST_NODE_MAJOR" = 24 ]; fi');
      executable('pnpm', 'if [ "$1" = --version ]; then echo 11.25.0; else [ "$TEST_NODE_MAJOR" = 24 ] || exit 1; echo "pnpm $*" >> "$TEST_LOG"; fi');
      writeFileSync(join(nvmDir, 'nvm.sh'), 'nvm() { echo "nvm $*" >> "$TEST_LOG"; if [ "$1" = use ]; then export TEST_NODE_MAJOR=24; fi; }\n');
      const env = { ...process.env, HOME: home, NVM_DIR: nvmDir, PATH: `${bin}:/usr/bin:/bin`, TEST_NODE_MAJOR: String(major), TEST_LOG: join(root, 'calls') };
      const result = spawnSync('bash', ['scripts/codex-setup.sh'], { encoding: 'utf8', env });
      assert.equal(result.status, 0, result.stderr);
      const calls = readFileSync(env.TEST_LOG, 'utf8');
      assert.match(calls, /pnpm install --frozen-lockfile --ignore-scripts/);
      if (major === 20) {
        assert.match(calls, /^nvm install 24\nnvm use 24\nnvm alias default 24\npnpm install/);
        const nextShell = spawnSync('bash', ['-c', 'source "$HOME/.bashrc"; node -p version'], { encoding: 'utf8', env });
        assert.equal(nextShell.status, 0, nextShell.stderr);
        assert.equal(nextShell.stdout.trim(), '24');
        const again = spawnSync('bash', ['scripts/codex-setup.sh'], { encoding: 'utf8', env });
        assert.equal(again.status, 0, again.stderr);
        assert.equal(readFileSync(join(home, '.bashrc'), 'utf8').split('# Clearcast Node 24 runtime').length, 2);
      }
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
}
