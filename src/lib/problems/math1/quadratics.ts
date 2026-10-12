// m1-quadratics-polynomials: square-root equations, projectile roots/vertex,
// factored forms, root-sign classification, area expressions.
// Formats from released Q3, Q11, Q16, Q17(area), Q26, Q39, Q45, Q46.

import type { ProblemFactory } from '../../problemGenerator';
import { randInt, randNonZero, choice, distinctInts } from './rng';
import { num, mc } from './latex';

// ── Q3-style GR: x^2 − c = −k, positive value of x ──
export const genSqrtSolve: ProblemFactory = (rng, difficulty) => {
  const r = difficulty === 'easy' ? randInt(rng, 2, 9) : randInt(rng, 3, 12);
  const sq = r * r;
  const k = randInt(rng, 1, sq - 1);
  const c = sq + k;
  return {
    itemType: 'GR',
    context: 'What is the positive value of x in this equation?',
    question: `x^2 - ${c} = -${k}`,
    answer: num(r),
    steps: [
      { number: 1, description: 'Add k to both sides.', math: `x^2 = ${c} - ${k} = ${sq}` },
      { number: 2, description: 'Take the positive square root.', math: `x = \\sqrt{${sq}} = ${r}` },
    ],
    hints: ['Isolate x², then take the square root — the question asks for the positive value.'],
    timeEstimate: 45,
  };
};

// ── Q11-style GR: horizontal distance traveled = distance between roots ──
export const genProjectileRoots: ProblemFactory = (rng, difficulty) => {
  const a = difficulty === 'easy' ? choice(rng, [1, 2] as const) : choice(rng, [1, 2, 4] as const);
  const dist = difficulty === 'easy' ? randInt(rng, 4, 8) : randInt(rng, 5, 12);
  const b = a * dist;
  return {
    itemType: 'GR',
    context: `The function f(x) = −${a === 1 ? '' : a}x² + ${b}x models the height above the ground, in cm, of a jumping frog, where x is the horizontal distance in cm. What horizontal distance did the frog travel during its jump?`,
    question: `f(x) = -${a === 1 ? '' : a}x^2 + ${b}x`,
    answer: num(dist),
    steps: [
      { number: 1, description: 'The jump starts and ends at height 0 — find the roots.', math: `-${a === 1 ? '' : a}x^2 + ${b}x = 0 \\Rightarrow x(-${a === 1 ? '' : a}x + ${b}) = 0` },
      { number: 2, description: 'Roots are 0 and b/a.', math: `x = 0 \\ \\text{or}\\ x = ${dist}` },
      { number: 3, description: 'The distance between roots is the horizontal distance.', math: `${dist} \\text{ cm}` },
    ],
    hints: ['Factor out x. The frog lands at the second root.'],
    timeEstimate: 60,
  };
};

// ── Q39-style GR: maximum height of h(x) = −16x² + bx + c ──
export const genVertexMax: ProblemFactory = (rng, difficulty) => {
  const k = difficulty === 'easy' ? randInt(rng, 1, 2) : randInt(rng, 1, 3); // vertex at t = k
  const b = 32 * k;
  const c = choice(rng, [3, 5, 7, 9, 11] as const);
  const maxH = c + 16 * k * k;
  return {
    itemType: 'GR',
    context: `A ball is thrown straight up from a porch. Its height in feet is modeled by h(x) = −16x² + ${b}x + ${c}, where x is time in seconds. What is the maximum height, in feet, of the ball?`,
    question: `h(x) = -16x^2 + ${b}x + ${c}`,
    answer: num(maxH),
    steps: [
      { number: 1, description: 'The maximum occurs at the vertex: x = −b/(2a).', math: `x = \\frac{-${b}}{2(-16)} = ${k}` },
      { number: 2, description: 'Evaluate h at the vertex.', math: `h(${k}) = -16(${k})^2 + ${b}(${k}) + ${c} = ${maxH}` },
    ],
    hints: ['Use x = −b/(2a) to find the time of the peak, then substitute back.'],
    timeEstimate: 75,
  };
};

// ── Q45-style MC (converted TD): equivalent factored form ──
export const genFactorForm: ProblemFactory = (rng, difficulty) => {
  const p = difficulty === 'easy' ? choice(rng, [1, 2] as const) : choice(rng, [2, 3, 6] as const);
  const r2 = difficulty === 'easy' ? 1 : choice(rng, [1, 2, 3] as const);
  const q = randNonZero(rng, -6, 6);
  const s = randNonZero(rng, -6, 6);
  // (p x + q)(r x + s) = pr x^2 + (ps + qr) x + qs
  const A = p * r2, B = p * s + q * r2, C = q * s;
  const xf = (coef: number) => (coef === 1 ? 'x' : `${num(coef)}x`);
  const bPart = B === 0 ? '' : Math.abs(B) === 1 ? ` ${B > 0 ? '+' : '-'} x` : ` ${B > 0 ? '+' : '-'} ${num(Math.abs(B))}x`;
  const quad = `${xf(A)}^2${bPart} ${C >= 0 ? '+' : '-'} ${num(Math.abs(C))}`;
  const factored = (pp: number, qq: number, rr: number, ss: number) =>
    `(${xf(pp)} ${qq >= 0 ? '+' : '-'} ${num(Math.abs(qq))})(${xf(rr)} ${ss >= 0 ? '+' : '-'} ${num(Math.abs(ss))})`;
  const correct = factored(p, q, r2, s);
  const m = mc(rng, correct, [
    factored(p, -q, r2, s),
    factored(p, q, r2, -s),
    factored(p, s, r2, q),
    factored(p, -q, r2, -s),
  ]);
  return {
    itemType: 'MC',
    context: 'Which expression is equivalent to the quadratic shown?',
    question: quad,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Find two numbers whose product is A·C and whose sum is B.', math: `A \\cdot C = ${num(A * C)}, \\quad B = ${num(B)}` },
      { number: 2, description: 'Write the factored form and check by expanding.', math: `${correct} = ${quad}` },
    ],
    hints: ['Factor by grouping: split the middle term using factors of A·C that sum to B.'],
    timeEstimate: 75,
  };
};

// ── Q16-style MC (converted DD): which quadratic has only positive solutions ──
export const genRootSigns: ProblemFactory = (rng, difficulty) => {
  const mode = choice(rng, ['positive', 'negative', 'mixed'] as const);
  const mk = (r1: number, r2: number) => {
    // roots r1, r2 → x^2 - (r1+r2) x + r1 r2 = 0
    const s = r1 + r2, pr = r1 * r2;
    return `x^2 ${s >= 0 ? '-' : '+'} ${num(Math.abs(s))}x ${pr >= 0 ? '+' : '-'} ${num(Math.abs(pr))} = 0`;
  };
  const [a, b2] = distinctInts(rng, 2, 1, difficulty === 'easy' ? 6 : 9);
  const [c, d] = distinctInts(rng, 2, 1, difficulty === 'easy' ? 6 : 9);
  const positive = mk(a, b2);
  const negative = mk(-c, -d);
  const mixed = mk(a, -c);
  const correct = mode === 'positive' ? positive : mode === 'negative' ? negative : mixed;
  const distractors = [positive, negative, mixed].filter((q) => q !== correct);
  const label = mode === 'positive' ? 'only positive solutions' : mode === 'negative' ? 'only negative solutions' : 'one positive and one negative solution';
  const m = mc(rng, correct, [...distractors, mk(a + 1, b2 + 1)]);
  return {
    itemType: 'MC',
    context: `Which quadratic equation has ${label}?`,
    question: `\\text{Select the matching equation}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Factor each choice (or use the sign of the constant and linear terms).', math: mode === 'mixed' ? '\\text{constant} < 0 \\Rightarrow \\text{roots have opposite signs}' : `\\text{factor to check signs}` },
      { number: 2, description: 'Match the sign pattern.', math: correct },
    ],
    hints: ['If the constant term is negative, the roots have opposite signs. If positive, the linear coefficient tells you whether both are positive or both negative.'],
    timeEstimate: 60,
  };
};

// ── Q26/Q46-style MC: area of a rectangle after dimension changes ──
export const genAreaExpression: ProblemFactory = (rng, difficulty) => {
  const k = difficulty === 'easy' ? randInt(rng, 2, 5) : randInt(rng, 3, 7); // width = x − k
  const up = difficulty === 'hard' ? randInt(rng, 2, 4) : randInt(rng, 1, 3); // length + up... keep +1 width
  // new: (x + up)(x − k + 1) = x^2 + (up − k + 1) x + up(1 − k)
  const B = up - k + 1;
  const C = up * (1 - k);
  const fmt = (b: number, c: number) =>
    `y = x^2${b === 0 ? '' : b === 1 ? ' + x' : b === -1 ? ' - x' : ` ${b > 0 ? '+' : '-'} ${num(Math.abs(b))}x`}${c === 0 ? '' : ` ${c > 0 ? '+' : '-'} ${num(Math.abs(c))}`}`;
  const correct = fmt(B, C);
  const m = mc(rng, correct, [
    fmt(B + 1, C),
    fmt(B, C + 2),
    fmt(B - 1, C),
  ]);
  return {
    itemType: 'MC',
    context: `A rectangle has length x units and width (x − ${k}) units. The length is increased by ${up} unit${up > 1 ? 's' : ''} and the width by 1 unit, creating a new rectangle. Which equation represents the area y of the new rectangle?`,
    question: `y = (x + ${up})(x - ${k - 1})`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'New dimensions: (x + up) and (x − k + 1).', math: `y = (x + ${up})(x - ${k - 1})` },
      { number: 2, description: 'Expand with FOIL.', math: fmt(B, C) },
    ],
    hints: ['Write both new dimensions as binomials, then multiply.'],
    timeEstimate: 60,
  };
};

export const quadraticFactories: ProblemFactory[] = [
  genSqrtSolve,
  genProjectileRoots,
  genVertexMax,
  genFactorForm,
  genRootSigns,
  genAreaExpression,
];
