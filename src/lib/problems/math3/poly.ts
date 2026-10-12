// Integer-polynomial utilities for Math 3 EOC generators.
// Polynomials are coefficient arrays in ASCENDING order: c[0] + c[1]x + c[2]x^2 + ...

import { num } from '../math1/latex';

/** Multiply two polynomials. */
export function polyMul(a: number[], b: number[]): number[] {
  const out = new Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < b.length; j++) out[i + j] += a[i] * b[j];
  return out;
}

/** Add two polynomials. */
export function polyAdd(a: number[], b: number[]): number[] {
  const n = Math.max(a.length, b.length);
  const out = new Array(n).fill(0);
  for (let i = 0; i < n; i++) out[i] = (a[i] ?? 0) + (b[i] ?? 0);
  return out;
}

/** Scale by a constant. */
export function polyScale(a: number[], k: number): number[] {
  return a.map((c) => c * k);
}

/** Evaluate at x. */
export function polyEval(a: number[], x: number): number {
  let v = 0;
  for (let i = a.length - 1; i >= 0; i--) v = v * x + a[i];
  return v;
}

/** Strip trailing zero coefficients. */
export function polyTrim(a: number[]): number[] {
  const out = [...a];
  while (out.length > 1 && out[out.length - 1] === 0) out.pop();
  return out;
}

/** Format as LaTeX in descending powers: "4x^3 - 2x^2 + 10". */
export function polyTex(coeffs: number[], v = 'x'): string {
  const c = polyTrim(coeffs);
  const deg = c.length - 1;
  if (deg === 0) return num(c[0]);
  const terms: string[] = [];
  for (let i = deg; i >= 0; i--) {
    const coef = c[i];
    if (coef === 0) continue;
    const absC = Math.abs(coef);
    const coefStr = i === 0 ? num(absC) : absC === 1 ? '' : num(absC);
    const varStr = i === 0 ? '' : i === 1 ? v : `${v}^${i}`;
    const term = `${coefStr}${varStr}`;
    if (terms.length === 0) {
      terms.push(coef < 0 ? `-${term}` : term);
    } else {
      terms.push(coef < 0 ? `- ${term}` : `+ ${term}`);
    }
  }
  return terms.join(' ');
}

/** Build a polynomial from roots (multiplicity supported): returns integer
 *  coeffs when roots are integers. rootSpec entries: [root, multiplicity]. */
export function polyFromRoots(rootSpec: [number, number][], leading = 1): number[] {
  let p = [leading];
  for (const [r, mult] of rootSpec) {
    for (let k = 0; k < mult; k++) p = polyMul(p, [-r, 1]);
  }
  return p;
}
