#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parseArgs } from 'node:util';
import { parseCandleResponse, sourceUrl } from '../packages/sources/src/coinbase.ts';

const { values } = parseArgs({ options: { mode: { type: 'string' }, fixture: { type: 'string' }, date: { type: 'string' }, output: { type: 'string' }, help: { type: 'boolean' } } });
if (values.help || !values.mode) {
  console.log('Usage: pnpm source:conformance --mode fixture --fixture <json> --date YYYY-MM-DD [--output path]\n       pnpm source:conformance --mode live --date YYYY-MM-DD [--output path]\nLive mode is read-only and results never constitute G0.2 PASS without the complete reviewed gate run.');
  process.exit(values.help ? 0 : 2);
}
if (!values.date || !/\d{4}-\d{2}-\d{2}/.test(values.date)) throw new Error('--date is required');
const url = sourceUrl(values.date);
let body: string;
let contentType: string;
let status: number;
if (values.mode === 'fixture') {
  if (!values.fixture) throw new Error('--fixture is required in fixture mode');
  body = await readFile(values.fixture, 'utf8'); contentType = 'application/json'; status = 200;
} else if (values.mode === 'live') {
  const response = await fetch(url, { redirect: 'error', headers: { accept: 'application/json', 'user-agent': 'clearcast-source-conformance/0.1' } });
  status = response.status; contentType = response.headers.get('content-type') ?? ''; body = await response.text();
  if (!response.ok) throw new Error(`SOURCE_HTTP_${status}`);
} else throw new Error('--mode must be fixture or live');
const candle = parseCandleResponse(body, contentType, values.date);
const result = { schema: 'clearcast.source-conformance/1', mode: values.mode, status: 'FIXTURE_PASS', gateStatus: 'NOT_RUN', requestedUrl: url, http: { status, contentType }, observation: candle, rawSha256: createHash('sha256').update(body).digest('hex'), note: values.mode === 'live' ? 'Single read-only probe only; full G0.2 requirements were not run.' : 'Artificial fixture; not live conformance evidence.' };
if (values.mode === 'live') result.status = 'LIVE_PROBE_PASS';
const serialized = `${JSON.stringify(result, null, 2)}\n`;
if (values.output) { await mkdir(new URL('.', `file://${process.cwd()}/${values.output}`).pathname, { recursive: true }); await writeFile(values.output, serialized); }
console.log(serialized);
