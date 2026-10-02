import { readFileSync } from 'node:fs';
const policy = JSON.parse(readFileSync('contracts/gate-policy.json', 'utf8'));
for (const id of Object.keys(policy.gates)) {
  const record = JSON.parse(readFileSync(`evidence/gates/${id}.json`, 'utf8'));
  console.log(`${id.padEnd(5)} ${record.status.padEnd(9)} requires: ${policy.gates[id].join(', ') || 'none'}`);
}
