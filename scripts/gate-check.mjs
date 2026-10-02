import { execFileSync } from 'node:child_process';
import { verifyGate } from './gate-lib.mjs';
const gateId = process.argv[2];
if (!gateId || process.argv.length !== 3) {
  console.error('Usage: pnpm gate:check <gate-id>');
  process.exit(2);
}
const root = process.cwd();
function commitIsValid(commit) {
  try {
    execFileSync('git', ['cat-file', '-e', `${commit}^{commit}`], { cwd: root, stdio: 'ignore' });
    execFileSync('git', ['merge-base', '--is-ancestor', commit, 'HEAD'], { cwd: root, stdio: 'ignore' });
    return true;
  } catch { return false; }
}
const result = verifyGate(root, gateId, commitIsValid);
if (!result.passed) {
  console.error(`BLOCKED: ${gateId}`);
  for (const error of result.errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`PASS evidence verified: ${gateId}`);
console.log('Evidence integrity is necessary; phase-specific acceptance and human review remain required.');
