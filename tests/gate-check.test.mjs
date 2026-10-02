import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyGate, sha256 } from '../scripts/gate-lib.mjs';
const commit = 'a'.repeat(40);
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'clearcast-gate-'));
  for (const dir of ['docs', 'contracts', 'evidence/gates', 'evidence/results']) mkdirSync(join(root, dir), { recursive: true });
  writeFileSync(join(root, 'docs/architecture.md'), 'approved architecture');
  writeFileSync(join(root, 'contracts/gate-policy.json'), JSON.stringify({ schema: 'clearcast.gate-policy/1', gates: { G0: [], G1: ['G0'] } }));
  writeFileSync(join(root, 'evidence/results/check.txt'), 'actual result');
  const record = (id) => ({
    gateId: id, status: 'PASS', decision: 'PROCEED', commit,
    environment: 'test', executor: 'Test executor', reviewer: 'Test reviewer',
    startedAt: '2026-10-02T00:00:00Z', finishedAt: '2026-10-02T00:01:00Z',
    blockingFindings: [], checks: [{ id: 'CHECK-1', passed: true, expected: 'actual result', actual: 'actual result', evidencePath: 'evidence/results/check.txt' }],
    inputs: Object.fromEntries(['docs/architecture.md', 'contracts/gate-policy.json'].map((p) => [p, sha256(readFileSync(join(root, p)))])),
    artifacts: [{ path: 'evidence/results/check.txt', sha256: sha256(readFileSync(join(root, 'evidence/results/check.txt'))) }]
  });
  for (const id of ['G0', 'G1']) writeFileSync(join(root, `evidence/gates/${id}.json`), JSON.stringify(record(id)));
  return { root, dispose: () => rmSync(root, { recursive: true, force: true }) };
}
function alter(root, id, change) {
  const path = join(root, `evidence/gates/${id}.json`);
  const data = JSON.parse(readFileSync(path)); change(data); writeFileSync(path, JSON.stringify(data));
}
const validCommit = (value) => value === commit;
test('complete dependency evidence is accepted by the integrity verifier', () => {
  const f = fixture(); try { assert.equal(verifyGate(f.root, 'G1', validCommit).passed, true); } finally { f.dispose(); }
});
test('a child PASS cannot bypass an unrun predecessor', () => {
  const f = fixture(); try { alter(f.root, 'G0', (r) => { r.status = 'NOT_RUN'; r.decision = 'STOP'; }); assert.equal(verifyGate(f.root, 'G1', validCommit).passed, false); } finally { f.dispose(); }
});
test('tampered artifacts invalidate evidence', () => {
  const f = fixture(); try { writeFileSync(join(f.root, 'evidence/results/check.txt'), 'tampered'); assert.equal(verifyGate(f.root, 'G1', validCommit).passed, false); } finally { f.dispose(); }
});
test('changed architecture invalidates previously recorded PASS', () => {
  const f = fixture(); try { writeFileSync(join(f.root, 'docs/architecture.md'), 'different semantics'); assert.equal(verifyGate(f.root, 'G1', validCommit).passed, false); } finally { f.dispose(); }
});
test('failed checks or missing review cannot pass', () => {
  const f = fixture(); try { alter(f.root, 'G1', (r) => { r.checks[0].passed = false; r.reviewer = ''; }); assert.equal(verifyGate(f.root, 'G1', validCommit).passed, false); } finally { f.dispose(); }
});
test('unknown gates and absent commit provenance fail closed', () => {
  const f = fixture(); try { assert.equal(verifyGate(f.root, 'G99', validCommit).passed, false); assert.equal(verifyGate(f.root, 'G1').passed, false); } finally { f.dispose(); }
});
test('escaping repository paths cannot become evidence', () => {
  const f = fixture(); try { alter(f.root, 'G1', (r) => { r.artifacts[0].path = '../outside.txt'; }); assert.equal(verifyGate(f.root, 'G1', validCommit).passed, false); } finally { f.dispose(); }
});
