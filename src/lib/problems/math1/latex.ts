// LaTeX formatting helpers for Math 1 EOC generators.
// All returned strings are KaTeX-safe (double backslashes in source).

import type { RNG } from './rng';
import { gcd, shuffle } from './rng';

/** Format a number for display/gridding: trims -0 and trailing zeros. */
export function num(n: number): string {
  if (Object.is(n, -0)) n = 0;
  const r = Math.round(n * 1e6) / 1e6;
  return Number.isInteger(r) ? String(r) : String(parseFloat(r.toFixed(6)));
}

/** Money with exactly 2 decimals, e.g. 168.75 */
export function money(n: number): string {
  return n.toFixed(2);
}

/** Reduced fraction as LaTeX. Handles sign and whole numbers. */
export function frac(n: number, d: number): string {
  if (d === 0) throw new Error('frac: zero denominator');
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d);
  n /= g; d /= g;
  if (d === 1) return String(n);
  if (n < 0) return `-\\frac{${-n}}{${d}}`;
  return `\\frac{${n}}{${d}}`;
}

/** A coefficient+variable term: 1x -> x, -1x -> -x, 3x, -3x. coef 0 -> ''. */
export function varTerm(coef: number, v: string): string {
  if (coef === 0) return '';
  if (coef === 1) return v;
  if (coef === -1) return `-${v}`;
  return `${num(coef)}${v}`;
}

/** Linear expression ax + b as LaTeX text: "3x + 5", "-2x - 7", "4", "x". */
export function linExpr(a: number, b: number, v = 'x'): string {
  const t = varTerm(a, v);
  if (b === 0) return t || '0';
  if (!t) return num(b);
  return b > 0 ? `${t} + ${num(b)}` : `${t} - ${num(-b)}`;
}

/** Signed constant with explicit +: "+ 5" / "- 3" */
export function signed(n: number): string {
  return n >= 0 ? `+ ${num(n)}` : `- ${num(-n)}`;
}

/** Inline plain-text context wrapper: \text{...} with escaped content kept simple ASCII. */
export function text(s: string): string {
  return `\\text{${s}}`;
}

export interface McResult {
  answer: string;
  choices: string[];
}

/** Build a 4-option MC item: shuffles correct + 3 distractors, dedupes. */
export function mc(rng: RNG, correct: string, distractors: string[]): McResult {
  const seen = new Set<string>([correct]);
  const pool: string[] = [];
  for (const d of distractors) {
    if (!seen.has(d)) {
      seen.add(d);
      pool.push(d);
    }
    if (pool.length === 3) break;
  }
  if (pool.length < 3) {
    throw new Error(`mc: not enough unique distractors for ${correct}`);
  }
  return { answer: correct, choices: shuffle(rng, [correct, ...pool]) };
}

/** Letter label of the correct choice (for worksheet answer keys). */
export function mcKey(m: McResult): string {
  return 'ABCD'[m.choices.indexOf(m.answer)];
}
