// g7-numbers-operations: signed rational arithmetic, fraction expressions,
// money with tax, rates over distance.
// Covers released items 3, 10, 17, 24, 37 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt } from '../math1/rng';
import { gcd } from '../math1/rng';
import { frac, mc, money, num } from '../math1/latex';

/** MC with guaranteed-unique distractors: filters candidates, tops up via fallback. */
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

// ── Q3-style GR: mean of 5 signed temperatures ──────────────────────────
export const genSignedMean: ProblemFactory = (rng) => {
  // mean lands on a clean 1-decimal value; all five temps are integers
  const sum = randInt(rng, -30, 30); // integer total → mean = sum/5 (one decimal)
  const vals: number[] = [];
  let acc = 0;
  let last = 99;
  for (let tries = 0; tries < 40; tries++) {
    vals.length = 0;
    acc = 0;
    for (let i = 0; i < 4; i++) {
      const v = randInt(rng, -9, 9);
      vals.push(v);
      acc += v;
    }
    last = sum - acc;
    if (Math.abs(last) <= 12) break;
  }
  vals.push(last);
  const mean = vals.reduce((s, v) => s + v, 0) / 5;
  const ans = num(Math.round(mean * 10) / 10);
  return {
    itemType: 'GR',
    context: `The temperatures at noon on five days were ${vals.map((v) => `${v}°F`).join(', ')}. What was the mean noon temperature, in degrees Fahrenheit?`,
    question: '\\text{mean temperature}',
    answer: ans,
    steps: [
      { number: 1, description: 'Add the five temperatures.', math: vals.map((v) => (v < 0 ? `(${v})` : `${v}`)).join(' + ') + ` = ${num(vals.reduce((s, v) => s + v, 0))}` },
      { number: 2, description: 'Divide by 5.', math: ans },
    ],
    hints: ['Mean = sum of values ÷ number of values. Add signed numbers carefully.'],
    timeEstimate: 75,
  };
};

// ── Q10/Q24-style GR: fraction arithmetic expression ────────────────────
export const genFractionExpression: ProblemFactory = (rng) => {
  // 1/4·(a/b − c/d) + 3/8·(e/f + g/h) built from chosen inner values so the answer is exact
  const m1 = choice(rng, [2, 3, 4] as const);
  const m2 = choice(rng, [2, 3, 4] as const);
  // inner1 = p/q, inner2 = r/s with small denominators
  const p = randInt(rng, 1, 5);
  const q = choice(rng, [2, 3, 4, 6]);
  const r = randInt(rng, 1, 5);
  const s = choice(rng, [2, 3, 4, 6]);
  // value = p/(q·m1) + r/(s·m2) as an exact fraction
  const den = q * m1 * s * m2;
  const numerator = p * s * m2 + r * q * m1;
  const g = gcd(numerator, den);
  const ansN = numerator / g;
  const ansD = den / g;
  const ans = ansD === 1 ? String(ansN) : `${ansN}/${ansD}`;
  return {
    itemType: 'GR',
    context: 'What is the value of the expression? Express the answer as a fraction in simplest form or as a decimal.',
    question: `${frac(1, m1)}\\left(${frac(p, q)}\\right) + ${frac(1, m2)}\\left(${frac(r, s)}\\right)`,
    answer: ans,
    steps: [
      { number: 1, description: 'Multiply each fraction by its multiplier.', math: `${frac(p, q * m1)} + ${frac(r, s * m2)}` },
      { number: 2, description: 'Add using a common denominator.', math: ansD === 1 ? String(ansN) : frac(ansN, ansD) },
    ],
    hints: ['Multiply first, then find a common denominator to add.'],
    timeEstimate: 90,
  };
};

// ── Q17-style MC: meal + sales tax split n ways ─────────────────────────
export const genMealTaxSplit: ProblemFactory = (rng) => {
  const p1 = choice(rng, [6.5, 7.25, 8.5, 9.75]);
  const p2 = choice(rng, [3.25, 4.5, 5.25]);
  const p3 = choice(rng, [2, 2.5, 3]);
  const taxPct = choice(rng, [4, 5, 6, 8]);
  const n = choice(rng, [2, 3, 4]);
  const subtotal = p1 + p2 + p3;
  const total = subtotal * (1 + taxPct / 100);
  const each = Math.round((total / n) * 100) / 100;
  const m = mc(rng, `\\$${money(each)}`, [
    `\\$${money(Math.round((subtotal / n) * 100) / 100)}`,
    `\\$${money(Math.round(total * 100) / 100)}`,
    `\\$${money(Math.round((each + 1.5) * 100) / 100)}`,
  ]);
  return {
    itemType: 'MC',
    context: `Three friends order items costing $${money(p1)}, $${money(p2)}, and $${money(p3)}. A ${taxPct}% sales tax is added to the bill, and the total is split equally ${n} ways. How much does each person pay?`,
    question: `(${money(p1)} + ${money(p2)} + ${money(p3)}) \\times ${1 + taxPct / 100} \\div ${n}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Subtotal.', math: `${money(subtotal)}` },
      { number: 2, description: 'Add tax.', math: `${money(subtotal)} \\times ${1 + taxPct / 100} = ${money(Math.round(total * 100) / 100)}` },
      { number: 3, description: `Split ${n} ways.`, math: `\\$${money(each)}` },
    ],
    hints: ['Tax applies to the whole bill BEFORE splitting.'],
    timeEstimate: 90,
  };
};

// ── Q37-style MC: round trip at two rates → time difference ─────────────
export const genRoundTripRate: ProblemFactory = (rng) => {
  const d = choice(rng, [60, 90, 120, 150, 180, 240]);
  const r1 = choice(rng, [30, 40, 45, 60]);
  const r2 = r1 + choice(rng, [15, 20, 30]);
  const t1 = d / r1;
  const t2 = d / r2;
  const diffMin = Math.round((t1 - t2) * 60);
  const correct = `${diffMin} \\text{ minutes}`;
  const m = mcUnique(rng, correct, [
    `${diffMin + 15} \\text{ minutes}`,
    `${Math.max(diffMin - 15, 5)} \\text{ minutes}`,
    `${diffMin * 2} \\text{ minutes}`,
  ], (k) => `${diffMin + 10 * k + 20} \\text{ minutes}`);
  return {
    itemType: 'MC',
    context: `A commuter drives ${d} miles to work at an average of ${r1} mph and drives the same route home at an average of ${r2} mph. How much less time does the faster trip take?`,
    question: `\\frac{${d}}{${r1}} - \\frac{${d}}{${r2}} \\text{ hours}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Time = distance ÷ rate for each trip.', math: `${num(Math.round(t1 * 100) / 100)} \\text{ h and } ${num(Math.round(t2 * 100) / 100)} \\text{ h}` },
      { number: 2, description: 'Difference, converted to minutes.', math: `${num(Math.round((t1 - t2) * 1000) / 1000)} \\text{ h} \\times 60 = ${diffMin} \\text{ min}` },
    ],
    hints: ['Compute each trip time separately, then subtract.'],
    timeEstimate: 90,
  };
};

export const numberFactories: ProblemFactory[] = [
  genSignedMean,
  genFractionExpression,
  genMealTaxSplit,
  genRoundTripRate,
];
