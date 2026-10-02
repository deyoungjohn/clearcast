import { readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { sha256 } from './gate-lib.mjs';
if (Number(process.versions.node.split('.')[0]) !== 24) throw new Error('Use Node 24 for this bootstrap');
const manifest = JSON.parse(readFileSync('contracts/bootstrap.json', 'utf8'));
if (sha256(readFileSync(manifest.architecturePath)) !== manifest.architectureSha256) throw new Error('Copied blueprint changed: document an approved revision and update provenance deliberately');
const policy = JSON.parse(readFileSync('contracts/gate-policy.json', 'utf8'));
for (const id of Object.keys(policy.gates)) {
  const record = JSON.parse(readFileSync(`evidence/gates/${id}.json`, 'utf8'));
  if (record.gateId !== id || !['NOT_RUN', 'RUNNING', 'PASS', 'FAIL'].includes(record.status)) throw new Error(`Invalid gate record ${id}`);
}
for (const directory of ['scripts', 'tests']) {
  for (const filename of readdirSync(directory).filter((name) => name.endsWith('.mjs'))) {
    execFileSync(process.execPath, ['--check', `${directory}/${filename}`], { stdio: 'inherit' });
  }
}
JSON.parse(readFileSync('package.json', 'utf8'));
console.log('Bootstrap syntax, JSON, and copied-blueprint integrity verified. Product gates remain separate.');
