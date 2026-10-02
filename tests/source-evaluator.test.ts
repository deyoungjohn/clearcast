import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateCaptures, compareExact, normalizeSourceDecimal } from '../packages/compiler/src/evaluate.ts';
import { parseCandleResponse, sourceUrl } from '../packages/sources/src/coinbase.ts';

const date = '2030-01-01';
const ts = Date.parse(`${date}T00:00:00Z`) / 1000;
const row = (close = '100.01', timestamp = ts) => `[${timestamp},99,102,100,${close},4]`;
const base = { comparator: 'GT' as const, threshold: '100', collectionStart: '2030-01-02T00:10:00Z', resolutionAt: '2030-01-02T01:00:00Z', evaluatedAt: '2030-01-02T01:00:00Z', captures: [{ capturedAt: '2030-01-02T00:10:00Z', close: '100.01', valid: true }, { capturedAt: '2030-01-02T00:20:00Z', close: '100.01', valid: true }] };

test('exact decimal comparison never uses binary floating point', () => {
  assert.equal(compareExact('100.01', '100', 'GT'), 'YES');
  assert.equal(compareExact('100', '100', 'GT'), 'NO');
  assert.equal(compareExact('99.99', '100', 'GT'), 'NO');
  assert.equal(compareExact('100', '100', 'GTE'), 'YES');
  assert.equal(normalizeSourceDecimal('1e2'), '100');
  assert.throws(() => normalizeSourceDecimal('100.000000001'), /SOURCE_PRECISION/);
});

test('capture policy fails closed and permits a valid pair plus outage', () => {
  assert.equal(evaluateCaptures(base).decision, 'YES');
  assert.deepEqual(evaluateCaptures({ ...base, captures: base.captures.slice(0, 1) }).reasons, ['INSUFFICIENT_VALID_CAPTURES']);
  assert.deepEqual(evaluateCaptures({ ...base, captures: base.captures.map((c, i) => ({ ...c, close: String(100 + i) })) }).reasons, ['CONFLICTING_CLOSES']);
  assert.deepEqual(evaluateCaptures({ ...base, captures: base.captures.map((c, i) => ({ ...c, capturedAt: `2030-01-02T00:1${i}:00Z` })) }).reasons, ['CAPTURES_TOO_CLOSE']);
  const outage = evaluateCaptures({ ...base, captures: [...base.captures, { capturedAt: '2030-01-02T00:30:00Z', valid: false, warning: 'HTTP_429' }] });
  assert.equal(outage.decision, 'YES'); assert.deepEqual(outage.warnings, ['HTTP_429']);
  assert.deepEqual(evaluateCaptures({ ...base, evaluatedAt: '2030-01-02T00:59:59Z' }).reasons, ['NOT_DUE']);
});

test('strict Coinbase adapter selects timestamp and preserves lexemes', () => {
  const candle = parseCandleResponse(`[${row('99', ts - 86400)},${row('1e2')}]`, 'application/json; charset=utf-8', date);
  assert.equal(candle.close, '1e2');
  assert.match(sourceUrl(date), /^https:\/\/api\.exchange\.coinbase\.com\/products\/BTC-USD\/candles\?granularity=86400&start=/);
  assert.throws(() => parseCandleResponse(row(), 'text/html', date), /SOURCE_CONTENT_TYPE/);
  assert.throws(() => parseCandleResponse(`[${row('100', ts - 1)}]`, 'application/json', date), /SOURCE_MISSING_BUCKET/);
  assert.throws(() => parseCandleResponse(`[${row()},${row()}]`, 'application/json', date), /SOURCE_DUPLICATE_BUCKET/);
  assert.throws(() => parseCandleResponse(`[[${ts},101,102,100,100,4]]`, 'application/json', date), /SOURCE_OHLC_INCONSISTENT/);
});
