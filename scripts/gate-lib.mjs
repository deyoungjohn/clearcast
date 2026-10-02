import { readFileSync, realpathSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';
import { createHash } from 'node:crypto';

export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const hashPattern = /^[a-f0-9]{64}$/;
const commitPattern = /^[a-f0-9]{40}$/;
const utcPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

export function safeFile(root, name) {
  if (typeof name !== 'string' || !name || isAbsolute(name)) throw new Error('Evidence path must be a relative file path');
  const base = realpathSync(root);
  const target = realpathSync(resolve(base, name));
  const rel = relative(base, target);
  if (rel === '..' || rel.startsWith('../') || isAbsolute(rel)) throw new Error(`Evidence path escapes repository: ${name}`);
  return target;
}

export function verifyGate(root, gateId, commitIsValid = () => false) {
  const errors = [];
  const visited = new Set();
  const active = new Set();
  let policy;
  try { policy = JSON.parse(readFileSync(safeFile(root, 'contracts/gate-policy.json'), 'utf8')); }
  catch (error) { return { passed: false, errors: [error.message] }; }
  if (policy.schema !== 'clearcast.gate-policy/1' || !policy.gates || typeof policy.gates !== 'object') {
    return { passed: false, errors: ['Invalid gate policy'] };
  }
  function visit(id) {
    if (!Object.hasOwn(policy.gates, id)) { errors.push(`Unknown gate ${id}`); return; }
    if (active.has(id)) { errors.push(`Gate dependency cycle at ${id}`); return; }
    if (visited.has(id)) return;
    active.add(id);
    const dependencies = policy.gates[id];
    if (!Array.isArray(dependencies)) { errors.push(`${id}: invalid dependencies`); active.delete(id); return; }
    for (const dependency of dependencies) visit(dependency);
    active.delete(id);
    visited.add(id);
    let record;
    try { record = JSON.parse(readFileSync(safeFile(root, `evidence/gates/${id}.json`), 'utf8')); }
    catch (error) { errors.push(`${id}: ${error.message}`); return; }
    if (record.gateId !== id) errors.push(`${id}: record identity mismatch`);
    if (record.status !== 'PASS' || record.decision !== 'PROCEED') errors.push(`${id}: status=${record.status}, decision=${record.decision}; real PASS required`);
    if (!commitPattern.test(record.commit ?? '') || !commitIsValid(record.commit)) errors.push(`${id}: missing or invalid repository commit provenance`);
    for (const field of ['executor', 'reviewer', 'environment']) {
      if (typeof record[field] !== 'string' || !record[field].trim()) errors.push(`${id}: missing ${field}`);
    }
    for (const field of ['startedAt', 'finishedAt']) {
      if (!utcPattern.test(record[field] ?? '') || !Number.isFinite(Date.parse(record[field]))) errors.push(`${id}: invalid ${field}`);
    }
    if (Date.parse(record.finishedAt) < Date.parse(record.startedAt)) errors.push(`${id}: invalid time order`);
    if (!Array.isArray(record.blockingFindings) || record.blockingFindings.length) errors.push(`${id}: blockers must be empty`);
    if (!Array.isArray(record.checks) || !record.checks.length) errors.push(`${id}: no executed checks`);
    else for (const check of record.checks) {
      if (!check || check.passed !== true || typeof check.id !== 'string' || !check.id || !Object.hasOwn(check, 'actual') || !Object.hasOwn(check, 'expected') || typeof check.evidencePath !== 'string') {
        errors.push(`${id}: incomplete or failed check`);
      }
    }
    const inputs = record.inputs;
    if (!inputs || typeof inputs !== 'object' || Array.isArray(inputs)) errors.push(`${id}: missing input hashes`);
    else {
      for (const required of ['docs/architecture.md', 'contracts/gate-policy.json']) {
        if (!Object.hasOwn(inputs, required)) errors.push(`${id}: missing required input ${required}`);
      }
      for (const [path, expected] of Object.entries(inputs)) {
        try {
          if (!hashPattern.test(expected) || sha256(readFileSync(safeFile(root, path))) !== expected) errors.push(`${id}: input hash mismatch: ${path}`);
        } catch (error) { errors.push(`${id}: ${error.message}`); }
      }
    }
    if (!Array.isArray(record.artifacts) || !record.artifacts.length) errors.push(`${id}: no hashed artifacts`);
    else {
      const paths = new Set();
      for (const artifact of record.artifacts) {
        try {
          if (!artifact || typeof artifact.path !== 'string') throw new Error('Invalid artifact');
          if (paths.has(artifact.path)) throw new Error(`Duplicate artifact: ${artifact.path}`);
          paths.add(artifact.path);
          if (!hashPattern.test(artifact.sha256 ?? '') || sha256(readFileSync(safeFile(root, artifact.path))) !== artifact.sha256) errors.push(`${id}: artifact hash mismatch: ${artifact.path}`);
        } catch (error) { errors.push(`${id}: ${error.message}`); }
      }
      for (const check of record.checks ?? []) {
        if (!paths.has(check?.evidencePath)) errors.push(`${id}: check evidence is not a hashed artifact`);
      }
    }
  }
  visit(gateId);
  return { passed: errors.length === 0, errors };
}
