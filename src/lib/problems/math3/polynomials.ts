// m3-polynomials: factoring, division, factor theorem, zeros, volume models.
// Covers released items 1, 6, 9, 11, 28, 35, 39, 40, 42 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt, randNonZero } from '../math1/rng';
import { linExpr, mc, num, varTerm } from '../math1/latex';
import { polyMul, polyTex } from './poly';

// ── Q1-style: factor a^2x^2 - b^2y^2 (A-SSE.2) ──────────────────────────
export const genDiffSquares: ProblemFactory = (rng) => {
  const a = randInt(rng, 1, 6);
  const b = randInt(rng, 2, 12);
  const A = varTerm(a, 'x');
  const B = varTerm(b, 'y');
  const correct = `(${A} - ${B})(${A} + ${B})`;
  const m = mc(rng, correct, [
    `(${A} - ${B})(${A} - ${B})`,
    `(${A} + ${B})(${A} + ${B})`,
    a === 1 ? `(x - ${b * b}y)(x + ${b * b}y)` : `(x - ${B})(x + ${B})`,
    `(${varTerm(a * a, 'x')} - ${B})(${varTerm(a * a, 'x')} + ${B})`,
  ]);
  return {
    itemType: 'MC',
    question: `${varTerm(a * a, 'x^2')} - ${varTerm(b * b, 'y^2')}`,
    context: 'Which expression is equivalent to the one shown?',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Recognize a difference of squares: u^2 - v^2 = (u - v)(u + v).', math: `u = ${A},\\quad v = ${B}` },
      { number: 2, description: 'Apply the pattern.', math: correct },
    ],
    hints: ['Look for perfect-square coefficients on both terms.'],
    timeEstimate: 45,
  };
};

// ── Q6-style: polynomial division, no remainder (A-APR.6) ───────────────
export const genPolyDivision: ProblemFactory = (rng) => {
  const d = choice(rng, [2, 3, 4, 5]);
  const k = choice(rng, [-4, -3, -2, 2, 3, 4]);
  const e = d * k; // divisor dx + e, excluded x = -k
  const q = randInt(rng, 2, 6);
  let r = randNonZero(rng, -6, 6);
  const dividend = polyTex(polyMul([r, q], [e, d]));
  const divisor = linExpr(d, e);
  const correct = linExpr(q, r);
  const m = mc(rng, correct, [
    linExpr(q, -r),
    linExpr(q, r + 1),
    linExpr(q, r - 1),
    linExpr(q + 1, r),
  ]);
  return {
    itemType: 'MC',
    context: `Which expression is equivalent to the quotient, if x ≠ ${num(-k)}?`,
    question: `(${dividend}) \\div (${divisor})`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Factor the dividend (or use long division).', math: `${dividend} = (${divisor})(${correct})` },
      { number: 2, description: 'Cancel the common factor.', math: correct },
    ],
    hints: [`The divisor divides evenly — try factoring ${divisor} out of the dividend.`],
    timeEstimate: 75,
  };
};

// ── Q35-style: polynomial division with remainder (A-APR.6) ─────────────
export const genPolyDivisionRem: ProblemFactory = (rng) => {
  const c = randInt(rng, 2, 6);
  const a = randInt(rng, 2, 5);
  const b = randNonZero(rng, -9, 9);
  const d = randNonZero(rng, -9, 9);
  let R = randNonZero(rng, 20, 300);
  if (rng() < 0.5) R = -R;
  // dividend = (ax^2 + bx + d)(x + c) + R
  const dividendCoeffs = polyMul([d, b, a], [c, 1]);
  dividendCoeffs[0] += R;
  const divisor = `x + ${c}`;
  const remSign = R > 0 ? '+' : '-';
  const correct = `${polyTex([d, b, a])} ${remSign} \\frac{${num(Math.abs(R))}}{${divisor}}`;
  const m = mc(rng, correct, [
    `${polyTex([d, b, a])} ${remSign} \\frac{${num(Math.abs(R) + randInt(rng, 6, 60))}}{${divisor}}`,
    `${polyTex([d + c, b, a])} ${R > 0 ? '-' : '+'} \\frac{${num(Math.abs(R))}}{${divisor}}`,
    `${polyTex([d, b + 1, a])} ${remSign} \\frac{${num(Math.abs(R))}}{${divisor}}`,
    `${polyTex([R, b, a])} + \\frac{${num(d)}}{${divisor}}`,
  ]);
  return {
    itemType: 'MC',
    question: `\\frac{${polyTex(dividendCoeffs)}}{${divisor}}`,
    context: 'Which expression is equivalent to the one shown?',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Divide by x + ${c} using long or synthetic division.`, math: `\\text{quotient } = ${polyTex([d, b, a])}` },
      { number: 2, description: 'Write the remainder over the divisor.', math: correct },
    ],
    hints: ['Synthetic division with root -' + c + ' gives the quotient coefficients and the remainder.'],
    timeEstimate: 105,
  };
};

// ── Q9-style: sum of zeros of a cubic via Vieta (F-IF.7) ────────────────
export const genVietaSum: ProblemFactory = (rng) => {
  const t = choice(rng, [1, 2, 3]);
  const m10 = randNonZero(rng, -35, 35); // sum = m10/10
  const A = 10 * t * (rng() < 0.5 ? -1 : 1);
  const B = -m10 * t * (A > 0 ? 1 : -1);
  const C = randNonZero(rng, 2, 60);
  const sum = -B / A;
  return {
    itemType: 'GR',
    context: 'A function is shown. The function has zeros f, g, and h. What is the value of f + g + h?',
    question: `P(x) = ${polyTex([C, 0, B, A])}`,
    answer: num(Math.round(sum * 10) / 10),
    steps: [
      { number: 1, description: 'By Vieta\'s formulas, the sum of the zeros of ax^3 + bx^2 + ... is -b/a.', math: `f + g + h = -\\frac{${num(B)}}{${num(A)}}` },
      { number: 2, description: 'Compute the sum.', math: num(Math.round(sum * 1000) / 1000) },
    ],
    hints: ['You do not need to find the zeros — use Vieta: sum = -(x^2 coefficient) / (x^3 coefficient).'],
    timeEstimate: 60,
  };
};

// ── Q11-style: factor theorem — pick the other factor (A-APR.2) ─────────
export const genFactorPick: ProblemFactory = (rng) => {
  const a = choice(rng, [2, 3, 5]);
  const b = randInt(rng, 2, 9);
  const c = randInt(rng, 2, 7);
  // f(x) = (ax - b)(x - c)
  const f = polyTex(polyMul([-b, a], [-c, 1]));
  const correct = `${varTerm(a, 'x')} - ${b}`;
  const m = mc(rng, correct, [
    `${varTerm(a, 'x')} + ${b}`,
    `${varTerm(a, 'x')} - ${b + c * a}`,
    `${varTerm(a, 'x')} + ${b + c * a}`,
    `x + ${c}`,
  ]);
  const wrap = (s: string) => `${s} \\text{ is a factor of } f(x)`;
  return {
    itemType: 'MC',
    context: `If f(x) = ${f} and f(${c}) = 0, which statement is true?`,
    question: `\\text{Which factor divides } f(x) = ${f}\\text{?}`,
    answer: wrap(m.answer),
    choices: m.choices.map(wrap),
    steps: [
      { number: 1, description: `f(${c}) = 0 means (x - ${c}) is a factor. Divide it out.`, math: `${f} = (x - ${c})(${correct})` },
      { number: 2, description: 'The other factor is the answer.', math: correct },
    ],
    hints: ['Since f(c) = 0, (x - c) is one factor. Divide to find the other.'],
    timeEstimate: 75,
  };
};

// ── Q28-style: factor theorem — find k (A-APR.2) ────────────────────────
export const genFactorFindK: ProblemFactory = (rng) => {
  const r = randInt(rng, 1, 4);
  const a = randInt(rng, 1, 6);
  const cst = randInt(rng, 2, 30);
  // f(x) = x^3 + ax^2 + kx - cst, (x - r) factor -> k = (cst - r^3 - a r^2) / r
  const kNum = cst - r * r * r - a * r * r;
  // ensure integer k
  const k = kNum / r;
  if (!Number.isInteger(k)) {
    // adjust cst up to the next value that divides
    return genFactorFindK(rng, 'medium');
  }
  const correct = num(k);
  const m = mc(rng, correct, [num(k + r), num(k - r), num(-k), num(k + 2 * r)]);
  return {
    itemType: 'MC',
    context: `The function f(x) is defined as f(x) = x^3 + ${a}x^2 + kx - ${cst}, where k is an integer. If (x - ${r}) is a factor of the polynomial, what is the value of k?`,
    question: `f(${r}) = 0 \\Rightarrow k = \\ ?`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `By the Factor Theorem, f(${r}) = 0.`, math: `${r * r * r} + ${a}(${r * r}) + k(${r}) - ${cst} = 0` },
      { number: 2, description: 'Solve for k.', math: `k = ${correct}` },
    ],
    hints: ['Substitute the root into the polynomial and set it equal to 0.'],
    timeEstimate: 75,
  };
};

// ── Q42-style: find b given factor (A-APR.3), gridded ───────────────────
export const genFindB: ProblemFactory = (rng) => {
  const s = randInt(rng, 2, 6);
  const t = randInt(rng, 3, 8);
  if (t === s) return genFindB(rng, 'medium');
  const u = randNonZero(rng, -6, 6);
  if (u === s || u === t) return genFindB(rng, 'medium');
  // h(x) = (x - s)(x - t)(x - u) = x^3 + bx^2 + px + q
  const b = -(s + t + u);
  const p = s * t + s * u + t * u;
  const q = -s * t * u;
  return {
    itemType: 'GR',
    context: `The function h(x) = x^3 + bx^2 ${p >= 0 ? '+ ' + num(p) : '- ' + num(-p)}x ${q >= 0 ? '+ ' + num(q) : '- ' + num(-q)} has (x - ${s}) as a factor and a zero at x = ${t}. What is the value of the constant b?`,
    question: `h(${s}) = 0 \\Rightarrow b = \\ ?`,
    answer: num(b),
    steps: [
      { number: 1, description: `Substitute x = ${s} and set h(x) = 0.`, math: `${s ** 3} + b(${s * s}) ${p >= 0 ? '+ ' + num(p * s) : '- ' + num(-p * s)} ${q >= 0 ? '+ ' + num(q) : '- ' + num(q)} = 0` },
      { number: 2, description: 'Solve for b.', math: `b = ${num(b)}` },
    ],
    hints: [`The factor (x - ${s}) means h(${s}) = 0.`],
    timeEstimate: 75,
  };
};

// ── Q39-style: build the quartic from zeros (F-BF.1.a) ──────────────────
export const genBuildQuartic: ProblemFactory = (rng) => {
  const r1 = randInt(rng, 2, 7); // zero at -r1
  const kn = choice(rng, [1, 3, 5, 7]); // zero at kn/2 -> factor (2x - kn)
  const r3 = randInt(rng, 1, 4); // double zero at r3
  const lead = choice(rng, [2, -2, 5, -5]);
  // poly = lead * (x + r1)(2x - kn)(x - r3)^2
  const poly = polyMul(
    polyMul([r1, 1], [-kn, 2]),
    polyMul([-r3, 1], [-r3, 1]),
  ).map((c) => c * lead);
  const correct = `g(x) = ${polyTex(poly)}`;
  const variants = [
    polyMul(polyMul([r1, 1], [kn, 2]), polyMul([-r3, 1], [-r3, 1])).map((c) => c * lead), // sign flip on fraction zero
    polyMul(polyMul([-r1, 1], [-kn, 2]), polyMul([r3, 1], [r3, 1])).map((c) => c * lead), // all roots flipped
    polyMul(polyMul([r1, 1], [-kn, 2]), polyMul([-r3, 1], [-r3, 1])).map((c) => -c * lead / Math.abs(lead) * (Math.abs(lead) === 2 ? 5 : 2)), // different leading
  ];
  const m = mc(rng, correct, variants.map((v) => `g(x) = ${polyTex(v)}`));
  return {
    itemType: 'MC',
    context: `Which quartic function has zeros at -${r1} and ${num(kn / 2)}, and a double zero at ${r3}?`,
    question: '\\text{Choose the quartic}',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'A zero at c gives a factor (x - c); a double zero squares the factor; zero at k/2 gives (2x - k).', math: `g(x) = a(x + ${r1})(2x - ${kn})(x - ${r3})^2` },
      { number: 2, description: 'Expand and match the leading coefficient.', math: correct },
    ],
    hints: ['Build the factors from the zeros, then expand.'],
    timeEstimate: 120,
  };
};

// ── Q40-style: open-top box volume (A-CED.2) ────────────────────────────
export const genBoxVolume: ProblemFactory = (rng) => {
  const [L, W] = choice(rng, [[16, 10], [20, 12], [14, 8], [18, 12], [24, 14]] as const);
  // v = x(L - 2x)(W - 2x) = 4x^3 - 2(L+W)x^2 + LW x
  const correct = `v = ${polyTex([0, L * W, -2 * (L + W), 4])}`;
  const m = mc(rng, correct, [
    `v = ${polyTex([0, L * W, -(L + W), 1])}`,
    `v = ${polyTex([L * W, 0, -4])}`,
    `v = ${polyTex([0, L * W, -2 * (L + W), 2])}`,
    `v = ${polyTex([0, L * W, -4 * (L + W), 4])}`,
  ]);
  return {
    itemType: 'MC',
    context: `A person is making an open-top box using a ${L}-foot-by-${W}-foot rectangular piece of cardboard. Congruent squares of length x are cut from each corner. Which equation can be used to determine the volume, v, of the box?`,
    question: `v = x(${L} - 2x)(${W} - 2x)`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'After cutting, the base dimensions shrink by 2x in each direction; the height is x.', math: `v = x(${L} - 2x)(${W} - 2x)` },
      { number: 2, description: 'Expand.', math: correct },
    ],
    hints: ['Volume = length x width x height with the folded-up sides of height x.'],
    timeEstimate: 90,
  };
};

export const polynomialFactories: ProblemFactory[] = [
  genDiffSquares,
  genPolyDivision,
  genPolyDivisionRem,
  genVietaSum,
  genFactorPick,
  genFactorFindK,
  genFindB,
  genBuildQuartic,
  genBoxVolume,
];
