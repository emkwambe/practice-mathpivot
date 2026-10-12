// g8-expressions-equations: scientific notation, exponent rules, square
// roots of areas, multi-step linear equations, systems word problems.
// Covers released items 3, 6, 11, 14, 16, 17, 28, 36, 42, 44 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt } from '../math1/rng';
import { frac, linExpr, mc, num, varTerm } from '../math1/latex';

/** MC with guaranteed-unique distractors. */
function mcUnique(rng: Parameters<typeof mc>[0], correct: string, candidates: string[], fallback: (k: number) => string) {
  const pool: string[] = [];
  for (const c of candidates) if (c !== correct && !pool.includes(c)) pool.push(c);
  let k = 1;
  while (pool.length < 3) {
    const c = fallback(k++);
    if (c !== correct && !pool.includes(c)) pool.push(c);
  }
  return mc(rng, correct, pool.slice(0, 3));
}

// ── Q3-style MC: this year is k times last year (scientific notation) ───
export const genSciNotationCompare: ProblemFactory = (rng) => {
  const lastCoeff = choice(rng, [2, 4, 5, 8]);
  const lastExp = randInt(rng, 4, 7);
  const k = choice(rng, [2, 4, 5, 8]);
  const thisCoeff = lastCoeff * k;
  const correct = `${lastCoeff} \\times 10^{${lastExp}}`;
  const m = mcUnique(rng, correct, [
    `${lastCoeff * 10} \\times 10^{${lastExp}}`,
    `${lastCoeff} \\times 10^{${lastExp - 1}}`,
    `${Math.max(lastCoeff - 1, 1)} \\times 10^{${lastExp}}`,
  ], (kk) => `${lastCoeff + kk} \\times 10^{${lastExp - 1}}`);
  return {
    itemType: 'MC',
    context: `This year a company produced ${thisCoeff} × 10^${lastExp} units, which is exactly ${k} times the number produced last year. Which expression gives last year's production?`,
    question: `(${thisCoeff} \\times 10^{${lastExp}}) \\div ${k}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Divide this year by the multiplier.', math: `\\frac{${thisCoeff}}{${k}} \\times 10^{${lastExp}} = ${correct}` },
    ],
    hints: ['Only the coefficient gets divided — the power of 10 stays.'],
    timeEstimate: 60,
  };
};

// ── Q16-style GR: x·10^a = c·(d·10^b) → x ──────────────────────────────
export const genSciNotationSolve: ProblemFactory = (rng) => {
  const c = choice(rng, [15, 20, 25, 30, 40]);
  const d = choice(rng, [2, 4, 5]);
  const b = randInt(rng, 2, 4);
  const a = b + 1;
  // x·10^a = c·(d·10^b) → x = c·d/10
  const x = (c * d) / 10;
  if (!Number.isInteger(x)) return genSciNotationSolve(rng, 'medium');
  return {
    itemType: 'GR',
    context: `A computation gives x × 10^${a} = ${c} × (${d} × 10^${b}). What is the value of x?`,
    question: `x \\times 10^{${a}} = ${c} \\times (${d} \\times 10^{${b}})`,
    answer: num(x),
    steps: [
      { number: 1, description: 'Simplify the right side.', math: `${c} \\times ${d} \\times 10^{${b}} = ${c * d} \\times 10^{${b}}` },
      { number: 2, description: `10^${a} = 10 × 10^${b}, so divide ${c * d} by 10.`, math: `x = ${x}` },
    ],
    hints: [`Rewrite 10^${a} as 10 × 10^${b}.`],
    timeEstimate: 75,
  };
};

// ── Q14-style GR: exponent product/quotient chain ───────────────────────
export const genExponentChain: ProblemFactory = (rng) => {
  const base = choice(rng, [2, 3, 5]);
  const e1 = randInt(rng, 2, 4);
  const e2 = randInt(rng, 3, 6);
  const e3 = randInt(rng, 1, Math.min(e1 + e2 - 1, 4));
  const n = e1 + e2 - e3;
  const val = Math.pow(base, n);
  return {
    itemType: 'GR',
    context: 'What is the value of the expression?',
    question: `\\frac{${base}^{${e1}} \\cdot ${base}^{${e2}}}{${base}^{${e3}}}`,
    answer: num(val),
    steps: [
      { number: 1, description: 'Add exponents in the numerator, subtract the denominator exponent.', math: `${base}^{${e1} + ${e2} - ${e3}} = ${base}^{${n}}` },
      { number: 2, description: 'Evaluate.', math: `${base}^{${n}} = ${val}` },
    ],
    hints: ['Same base: multiply → add exponents; divide → subtract.'],
    timeEstimate: 60,
  };
};

// ── Q11-style GR: powers of fraction bases ──────────────────────────────
export const genFractionPowers: ProblemFactory = (rng) => {
  // (a/b)^2 · (c/d)^2 chosen so the decimal terminates cleanly
  const opts = choice(rng, [
    { f1: [1, 2], f2: [1, 5] },   // 1/4 · 1/25 = 0.01
    { f1: [1, 2], f2: [2, 5] },   // 1/4 · 4/25 = 0.04
    { f1: [3, 4], f2: [2, 5] },   // 9/16 · 4/25 = 0.09
    { f1: [1, 5], f2: [1, 2] },   // 1/25 · 1/4 = 0.01
    { f1: [1, 4], f2: [1, 5] },   // 1/16 · 1/25 = 1/400 = 0.0025
  ] as const);
  const [a, b] = opts.f1;
  const [c, d] = opts.f2;
  const val = (a * a * c * c) / (b * b * d * d);
  const ans = num(val);
  return {
    itemType: 'GR',
    context: 'What is the value of the expression? Write the answer as a decimal.',
    question: `\\left(${frac(a, b)}\\right)^2 \\cdot \\left(${frac(c, d)}\\right)^2`,
    answer: ans,
    steps: [
      { number: 1, description: 'Square each fraction.', math: `${frac(a * a, b * b)} \\cdot ${frac(c * c, d * d)}` },
      { number: 2, description: 'Multiply and convert to a decimal.', math: ans },
    ],
    hints: ['Square numerator and denominator of each fraction first.'],
    timeEstimate: 75,
  };
};

// ── Q6-style MC: square areas → difference of side lengths ──────────────
export const genSquareAreaSides: ProblemFactory = (rng) => {
  const s1 = choice(rng, [4, 5, 6, 7, 8, 9]);
  const s2 = s1 + choice(rng, [3, 4, 5, 6]);
  const diff = s2 - s1;
  const m = mcUnique(rng, num(diff), [
    num(s2 * s2 - s1 * s1),
    num(diff * 2),
    num(s1 + s2),
  ], (k) => num(diff + k * 2 + 1));
  return {
    itemType: 'MC',
    context: `Square A has an area of ${s1 * s1} square units and Square B has an area of ${s2 * s2} square units. What is the positive difference between their side lengths?`,
    question: `\\sqrt{${s2 * s2}} - \\sqrt{${s1 * s1}}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Side length = square root of area.', math: `\\sqrt{${s1 * s1}} = ${s1},\\quad \\sqrt{${s2 * s2}} = ${s2}` },
      { number: 2, description: 'Subtract.', math: `${s2} - ${s1} = ${diff}` },
    ],
    hints: ['Take the square root of each area first.'],
    timeEstimate: 60,
  };
};

// ── Q17-style GR: solve ½(ax + b) = cx + d − ex ────────────────────────
export const genSolveDistributeFraction: ProblemFactory = (rng) => {
  // ½(ax + b) = (c−e)x + d ; choose integer solution
  const x0 = randInt(rng, -12, -2);
  const a = 2 * choice(rng, [1, 2, 3]);
  const b = 2 * randInt(rng, 1, 6);
  const left = (a * x0 + b) / 2; // must be integer: a,b even → ok
  const c = randInt(rng, 3, 7);
  const e = randInt(rng, 1, c - 1);
  const d = left - (c - e) * x0;
  return {
    itemType: 'GR',
    context: 'What is the value of x that makes the equation true?',
    question: `\\frac{1}{2}(${linExpr(a, b)}) = ${linExpr(c, d)} - ${varTerm(e, 'x')}`,
    answer: num(x0),
    steps: [
      { number: 1, description: 'Distribute the ½ and collect x terms.', math: `${linExpr(a / 2, b / 2)} = ${linExpr(c - e, d)}` },
      { number: 2, description: 'Solve.', math: `x = ${x0}` },
    ],
    hints: ['Distribute ½ first — both terms inside get halved.'],
    timeEstimate: 90,
  };
};

// ── Q42-style MC: ax + b(cx + d) = k(ex + f) has no solution → k ───────
export const genNoSolutionK: ProblemFactory = (rng) => {
  const e = randInt(rng, 2, 5);
  const c = randInt(rng, 2, 4);
  const k = randInt(rng, 2, 6);
  // left x-coefficient: a + bc must equal k·e
  const b = randInt(rng, 2, 5);
  const a = k * e - b * c;
  const d = randInt(rng, 2, 6);
  const f = randInt(rng, 2, 6);
  // no solution requires constants to differ: bd ≠ kf
  if (b * d === k * f) return genNoSolutionK(rng, 'medium');
  const m = mcUnique(rng, num(k), [
    num(k + 1),
    num(Math.max(k - 1, 1)),
    num(k * 2),
  ], (kk) => num(k + kk + 2));
  return {
    itemType: 'MC',
    context: 'For what value of k does the equation have no solution?',
    question: `${varTerm(a, 'x')} + ${b}(${linExpr(c, d)}) = k(${linExpr(e, f)})`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Expand both sides.', math: `${linExpr(a, 0)} + ${linExpr(b * c, b * d)} = ${varTerm(k * e, 'x')} + ${k * f}` },
      { number: 2, description: 'No solution requires equal x-coefficients but unequal constants.', math: `${a} + ${b} \\cdot ${c} = ${e}k \\Rightarrow ${a + b * c} = ${e}k \\Rightarrow k = ${k}` },
    ],
    hints: ['Same slope on both sides, different intercepts → parallel → no solution.'],
    timeEstimate: 90,
  };
};

// ── Q28/36/44-style MC: break-even systems word problems ────────────────
export const genSystemsBreakEven: ProblemFactory = (rng) => {
  const ctx = choice(rng, [
    { item: 'shirts', a: { flat: 18, per: 12 }, b: { flat: 20, per: 4 }, unit: 'shirts' },
    { item: 'books', a: { flat: 20, per: 12 }, b: { flat: 35, per: 9 }, unit: 'books' },
    { item: 'movies', a: { flat: 10, per: 2 }, b: { flat: 8, per: 3 }, unit: 'movies' },
  ] as const);
  // solve a.flat + a.per·n = b.flat + b.per·n → n = (b.flat − a.flat)/(a.per − b.per)
  const num_ = ctx.b.flat - ctx.a.flat;
  const den_ = ctx.a.per - ctx.b.per;
  const n = num_ / den_;
  if (!Number.isInteger(n) || n <= 0) return genSystemsBreakEven(rng, 'medium');
  const m = mcUnique(rng, num(n), [
    num(n + 1),
    num(Math.max(n - 1, 1)),
    num(n + 2),
  ], (k) => num(n + k + 2));
  return {
    itemType: 'MC',
    context: `Plan A costs $${ctx.a.flat} plus $${ctx.a.per} per ${ctx.item.slice(0, -1)}, and Plan B costs $${ctx.b.flat} plus $${ctx.b.per} per ${ctx.item.slice(0, -1)}. For how many ${ctx.unit} do the two plans cost the same?`,
    question: `${ctx.a.flat} + ${ctx.a.per}n = ${ctx.b.flat} + ${ctx.b.per}n`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Set the two cost expressions equal.', math: `${ctx.a.flat} + ${ctx.a.per}n = ${ctx.b.flat} + ${ctx.b.per}n` },
      { number: 2, description: 'Solve for n.', math: `${den_}n = ${num_} \\Rightarrow n = ${n}` },
    ],
    hints: ['Write a cost expression for each plan, then set them equal.'],
    timeEstimate: 75,
  };
};

// ── EE.8 variant: two-club membership totals ────────────────────────────
export const genSystemsTwoPlans: ProblemFactory = (rng) => {
  const j1 = choice(rng, [15, 20, 25, 30]);
  const m1 = choice(rng, [5, 8, 10, 12]);
  const j2 = choice(rng, [10, 12, 18]);
  const m2 = choice(rng, [6, 9, 11, 14]);
  const months = (j2 - j1) / (m1 - m2);
  if (!Number.isInteger(months) || months <= 0 || months > 24) return genSystemsTwoPlans(rng, 'medium');
  const m = mcUnique(rng, num(months), [
    num(months + 2),
    num(Math.max(months - 2, 1)),
    num(months * 2),
  ], (k) => num(months + 3 * k));
  return {
    itemType: 'MC',
    context: `Gym A charges a $${j1} joining fee plus $${m1} per month. Gym B charges a $${j2} joining fee plus $${m2} per month. After how many months is the total cost the same at both gyms?`,
    question: `${j1} + ${m1}m = ${j2} + ${m2}m`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Set the totals equal.', math: `${j1} + ${m1}m = ${j2} + ${m2}m` },
      { number: 2, description: 'Solve.', math: `m = ${months}` },
    ],
    hints: ['Total = joining fee + monthly rate × months.'],
    timeEstimate: 75,
  };
};

export const equationFactories: ProblemFactory[] = [
  genSciNotationCompare,
  genSciNotationSolve,
  genExponentChain,
  genFractionPowers,
  genSquareAreaSides,
  genSolveDistributeFraction,
  genNoSolutionK,
  genSystemsBreakEven,
  genSystemsTwoPlans,
];
