import { Decimal } from 'decimal.js';

export type Decision = 'YES' | 'NO' | 'NEEDS_REVIEW';
export type Comparator = 'GT' | 'GTE';
export type Capture = {
  capturedAt: string;
  close?: string;
  valid: boolean;
  warning?: string;
};

export type Evaluation = { decision: Decision; reasons: string[]; warnings: string[] };

const MAX_SCALE = 8;

export function normalizeSourceDecimal(value: string): string {
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)) throw new Error('malformed decimal');
  const decimal = new Decimal(value);
  if (!decimal.isFinite() || decimal.isNegative()) throw new Error('nonfinite or negative decimal');
  const expanded = decimal.toFixed();
  const fraction = expanded.split('.')[1] ?? '';
  if (fraction.length > MAX_SCALE) throw new Error('SOURCE_PRECISION');
  return expanded.includes('.') ? expanded.replace(/0+$/, '').replace(/\.$/, '') : expanded;
}

export function compareExact(close: string, threshold: string, comparator: Comparator): Decision {
  let a: Decimal;
  let b: Decimal;
  try {
    normalizeSourceDecimal(close);
    a = new Decimal(close);
    b = new Decimal(threshold);
  } catch {
    return 'NEEDS_REVIEW';
  }
  return comparator === 'GT' ? (a.gt(b) ? 'YES' : 'NO') : (a.gte(b) ? 'YES' : 'NO');
}

export function evaluateCaptures(input: {
  comparator: Comparator;
  threshold: string;
  collectionStart: string;
  resolutionAt: string;
  evaluatedAt: string;
  captures: Capture[];
}): Evaluation {
  const reasons: string[] = [];
  const warnings = input.captures.flatMap((c) => c.warning ? [c.warning] : []);
  if (Date.parse(input.evaluatedAt) < Date.parse(input.resolutionAt)) return { decision: 'NEEDS_REVIEW', reasons: ['NOT_DUE'], warnings };
  const valid = input.captures.filter((capture) => capture.valid && capture.close !== undefined &&
    Date.parse(capture.capturedAt) >= Date.parse(input.collectionStart) && Date.parse(capture.capturedAt) < Date.parse(input.resolutionAt));
  if (valid.length < 2) return { decision: 'NEEDS_REVIEW', reasons: ['INSUFFICIENT_VALID_CAPTURES'], warnings };
  const times = valid.map((c) => Date.parse(c.capturedAt)).sort((a, b) => a - b);
  if (times.at(-1)! - times[0]! < 300_000) return { decision: 'NEEDS_REVIEW', reasons: ['CAPTURES_TOO_CLOSE'], warnings };
  let closes: string[];
  try {
    closes = valid.map((capture) => normalizeSourceDecimal(capture.close!));
  } catch (error) {
    return { decision: 'NEEDS_REVIEW', reasons: [(error as Error).message], warnings };
  }
  if (new Set(closes).size !== 1) return { decision: 'NEEDS_REVIEW', reasons: ['CONFLICTING_CLOSES'], warnings };
  return { decision: compareExact(closes[0]!, input.threshold, input.comparator), reasons, warnings };
}
