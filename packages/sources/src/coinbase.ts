import { LosslessNumber, parse } from 'lossless-json';

export const COINBASE_ORIGIN = 'https://api.exchange.coinbase.com';
export const PRODUCT = 'BTC-USD';
export const GRANULARITY = 86400;

export type Candle = { timestamp: number; low: string; high: string; open: string; close: string; volume: string };

export function sourceUrl(utcDate: string): string {
  const start = parseDate(utcDate);
  const end = new Date(start.getTime() + GRANULARITY * 1000);
  const seconds = (date: Date) => date.toISOString().replace('.000Z', 'Z');
  return `${COINBASE_ORIGIN}/products/${PRODUCT}/candles?granularity=${GRANULARITY}&start=${encodeURIComponent(seconds(start))}&end=${encodeURIComponent(seconds(end))}`;
}

function parseDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('invalid UTC date');
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw new Error('invalid UTC date');
  return date;
}

const lexeme = (value: unknown): string => {
  if (!(value instanceof LosslessNumber)) throw new Error('candle numeric value was not parsed losslessly');
  return value.value;
};

export function parseCandleResponse(body: string, contentType: string, utcDate: string): Candle {
  if (!contentType.toLowerCase().split(';')[0]!.trim().endsWith('/json')) throw new Error('SOURCE_CONTENT_TYPE');
  let decoded: unknown;
  try { decoded = parse(body); } catch { throw new Error('SOURCE_INVALID_JSON'); }
  if (!Array.isArray(decoded)) throw new Error('SOURCE_SHAPE');
  const expected = parseDate(utcDate).getTime() / 1000;
  const matches = decoded.filter((row) => Array.isArray(row) && row.length === 6 && Number(lexeme(row[0])) === expected);
  if (matches.length !== 1) throw new Error(matches.length === 0 ? 'SOURCE_MISSING_BUCKET' : 'SOURCE_DUPLICATE_BUCKET');
  const row = matches[0] as unknown[];
  const timestampText = lexeme(row[0]);
  if (!/^\d+$/.test(timestampText) || Number(timestampText) !== expected) throw new Error('SOURCE_BUCKET_ALIGNMENT');
  const candle: Candle = { timestamp: expected, low: lexeme(row[1]), high: lexeme(row[2]), open: lexeme(row[3]), close: lexeme(row[4]), volume: lexeme(row[5]) };
  const values = [candle.low, candle.high, candle.open, candle.close, candle.volume];
  if (values.some((value) => !/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value))) throw new Error('SOURCE_NUMERIC_SHAPE');
  const [low, high, open, close] = values.slice(0, 4).map((value) => Number(value));
  if (![low, high, open, close].every(Number.isFinite) || low! > open! || low! > close! || high! < open! || high! < close!) throw new Error('SOURCE_OHLC_INCONSISTENT');
  return candle;
}
