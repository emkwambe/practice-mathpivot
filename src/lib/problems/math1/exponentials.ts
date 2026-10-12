// m1-exponentials: growth rate, decay evaluation, linear-vs-exponential,
// exceed point, intersection approximation, equal linear functions.
// Formats from released Q2, Q18, Q24, Q37, Q40, Q47.

import type { ProblemFactory } from '../../problemGenerator';
import { randInt, randNonZero, choice } from './rng';
import { num, mc } from './latex';

// ── Q2-style MC: growth rate from f(x) = a(1 + r)^x ──
const GROWTH_CONTEXTS = [
  'predict the population of a city in x years',
  'model the value of an investment after x years',
  'model the number of bacteria in a colony after x hours',
  'predict the followers of an account after x months',
];
export const genGrowthRate: ProblemFactory = (rng) => {
  const rPct = choice(rng, [2, 5, 8, 13, 20, 25, 30, 45] as const);
  const a = choice(rng, [300, 500, 1200, 2500, 4000] as const);
  const factor = (1 + rPct / 100).toFixed(2);
  const ctx = choice(rng, GROWTH_CONTEXTS);
  const correct = `${rPct}%`;
  const m = mc(rng, correct, [
    `${rPct + 100}%`,
    `${100 - rPct}%`,
    `${rPct / 10 % 1 === 0 ? rPct / 10 : (rPct / 10).toFixed(1)}%`,
  ]);
  return {
    itemType: 'MC',
    context: `A model uses the function f(x) = ${a.toLocaleString('en-US')}(${factor})^x to ${ctx}. By what rate is the quantity predicted to grow each period?`,
    question: `f(x) = ${a.toLocaleString('en-US').replace(/,/g, '{,}')}(${factor})^x`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'The growth factor is 1 + r.', math: `1 + r = ${factor}` },
      { number: 2, description: 'Solve for r and convert to a percent.', math: `r = ${num(rPct / 100)} = ${rPct}\\%` },
    ],
    hints: ['The base of the exponential is 1 + r, not r itself.'],
    timeEstimate: 45,
  };
};

// ── Q24-style GR: evaluate a decay function, dollars.cents ──
export const genDecayEval: ProblemFactory = (rng, difficulty) => {
  const a = choice(rng, [200, 300, 400, 500] as const);
  const bPct = choice(rng, [50, 60, 75, 80, 90] as const);
  const x0 = difficulty === 'easy' ? 2 : choice(rng, [2, 3] as const);
  const ans = a * Math.pow(bPct / 100, x0);
  const item = choice(rng, ['video game system', 'smartphone', 'laptop', 'game console'] as const);
  return {
    itemType: 'GR',
    context: `The function c(x) = ${a}(${(bPct / 100).toFixed(2)})^x models the cost of a ${item} x years after it was released. How much did the ${item} cost ${x0} years after it was released? (Express the answer as dollars.cents.)`,
    question: `c(${x0}) = ${a}(${(bPct / 100).toFixed(2)})^{${x0}}`,
    answer: ans.toFixed(2),
    steps: [
      { number: 1, description: `Substitute x = ${x0}.`, math: `c(${x0}) = ${a}(${(bPct / 100).toFixed(2)})^{${x0}}` },
      { number: 2, description: 'Evaluate the power, then multiply.', math: `c(${x0}) = ${a}(${num(Math.pow(bPct / 100, x0))}) = ${ans.toFixed(2)}` },
    ],
    hints: [`Compute ${(bPct / 100).toFixed(2)}^${x0} first, then multiply by ${a}.`],
    timeEstimate: 45,
  };
};

// ── Q37-style MC: linear vs exponential model identification ──
export const genModelIdentify: ProblemFactory = (rng, difficulty) => {
  const isLinear = choice(rng, [true, false] as const);
  const startY = choice(rng, [1995, 2000, 2005, 2010] as const);
  const step = 4;
  const base = difficulty === 'easy' ? randInt(rng, 3, 8) : randInt(rng, 4, 12);
  const cents = choice(rng, [0.25, 0.50, 0.75] as const);
  const p0 = base + cents;
  let rows: string[];
  let pct: number;
  let perYear: string;
  if (isLinear) {
    const inc = choice(rng, [0.15, 0.20, 0.30, 0.45] as const);
    rows = [0, 1, 2, 3, 4].map((i) => `${startY + i * step} & \\$${(p0 + i * step * inc).toFixed(2)}`);
    perYear = `$${inc.toFixed(2)}`;
    pct = Math.round(inc * 100);
  } else {
    pct = choice(rng, [5, 10, 15, 20] as const);
    const g = 1 + pct / 100;
    rows = [0, 1, 2, 3, 4].map((i) => `${startY + i * step} & \\$${(p0 * Math.pow(g, i)).toFixed(2)}`);
    perYear = `$${(pct / 100).toFixed(2)}`;
  }
  const correct = isLinear
    ? `a linear model in which the price increases by ${perYear} each period`
    : `an exponential model in which the price increases by ${pct}% each period`;
  const candidates = [
    `a linear model in which the price increases by ${perYear} each period`,
    `a linear model in which the price increases by ${pct}% each period`,
    `an exponential model in which the price increases by ${perYear} each period`,
    `an exponential model in which the price increases by ${pct}% each period`,
  ];
  const m = mc(rng, correct, candidates.filter((c) => c !== correct));
  return {
    itemType: 'MC',
    context: 'A table shows the price of an item in five different periods. Which model is consistent with the data shown in the table?',
    question: `\\begin{array}{c|c} \\text{Period} & \\text{Price} \\\\ \\hline ${rows.join(' \\\\ ')} \\end{array}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Check differences (linear) vs ratios (exponential) between consecutive rows.', math: isLinear ? '\\text{constant difference} \\Rightarrow \\text{linear}' : '\\text{constant ratio} \\Rightarrow \\text{exponential}' },
      { number: 2, description: 'Match the rate or percent.', math: `\\text{${correct.replace(/%/g, '\\%').replace(/\$/g, 'USD ')}}` },
    ],
    hints: ['Compute the difference between consecutive prices. Constant difference → linear; constant ratio → exponential.'],
    timeEstimate: 75,
  };
};

// ── Q40-style GR: smallest positive integer where b^x exceeds kx ──
export const genExceedsPoint: ProblemFactory = (rng, difficulty) => {
  const b = choice(rng, [1.5, 2, 2.5, 3] as const);
  const k = difficulty === 'easy' ? randInt(rng, 2, 4) : randInt(rng, 3, 7);
  let n = 1;
  while (Math.pow(b, n) <= k * n && n < 50) n++;
  return {
    itemType: 'GR',
    context: `What is the minimum positive integer value of x such that the value of y = ${b}^x exceeds the value of y = ${k}x?`,
    question: `${b}^x > ${k}x`,
    answer: num(n),
    steps: [
      { number: 1, description: 'Test consecutive positive integers.', math: `${b}^{${n - 1}} = ${num(Math.pow(b, n - 1))} \\leq ${k} \\cdot ${n - 1} = ${k * (n - 1)}` },
      { number: 2, description: 'The first integer that works.', math: `${b}^{${n}} = ${num(Math.pow(b, n))} > ${k * n} = ${k} \\cdot ${n} \\Rightarrow x = ${n}` },
    ],
    hints: ['Make a small table: compute b^x and kx for x = 1, 2, 3, … and find the first x where b^x is larger.'],
    timeEstimate: 75,
  };
};

// ── Q18-style MC: x where linear and exponential are approximately equal ──
export const genIntersectionApprox: ProblemFactory = (rng) => {
  // y = m x + b (increasing) vs y = a r^x (decaying) → unique crossing
  const mSlope = choice(rng, [2, 3, 4] as const);
  const bInt = -randInt(rng, 1, 5);
  const a = choice(rng, [10, 12, 15, 20] as const);
  const rPct = choice(rng, [50, 60, 70, 75, 80] as const);
  const r = rPct / 100;
  const f = (x: number) => mSlope * x + bInt - a * Math.pow(r, x);
  // bisection between 0 and 12
  let lo = 0, hi = 12;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (f(lo) * f(mid) <= 0) hi = mid; else lo = mid;
  }
  const root = Math.round(((lo + hi) / 2) * 100) / 100;
  const correct = num(root);
  const m2 = mc(rng, correct, [
    num(Math.round((root - 2.5) * 100) / 100),
    num(Math.round((root + 3.1) * 100) / 100),
    num(Math.round((mSlope * root + bInt) * 100) / 100), // y-value trap
  ]);
  return {
    itemType: 'MC',
    context: `For which x-value are the y-values of y = ${mSlope}x − ${-bInt} and y = ${a}(${r})^x approximately equal?`,
    question: `${mSlope}x - ${-bInt} = ${a}(${r})^x`,
    answer: m2.answer,
    choices: m2.choices,
    steps: [
      { number: 1, description: 'Set the two functions equal and estimate the crossing (table or graph).', math: `${mSlope}x - ${-bInt} = ${a}(${r})^{x}` },
      { number: 2, description: 'Narrow the interval until the values match to two decimals.', math: `x \\approx ${correct}` },
    ],
    hints: ['Make a table of both functions for x = 0, 1, 2, … and find where they cross.'],
    timeEstimate: 90,
  };
};

// ── Q47-style MC: solve f(x) = g(x) for two linear functions ──
export const genEqualLinear: ProblemFactory = (rng, difficulty) => {
  const x0 = difficulty === 'easy' ? randNonZero(rng, -4, 4) : randInt(rng, -8, 8) / 2 || 1;
  const m1 = randNonZero(rng, -5, 6);
  let m2 = randNonZero(rng, -5, 6);
  while (m2 === m1) m2 = randNonZero(rng, -5, 6);
  const b1 = randNonZero(rng, -9, 9);
  const b2 = Math.round((m1 * x0 + b1 - m2 * x0) * 100) / 100;
  const lin = (m: number, b: number) => `${m === 1 ? '' : m === -1 ? '-' : num(m)}x ${b >= 0 ? '+' : '-'} ${num(Math.abs(b))}`;
  const correct = num(x0);
  const mRes = mc(rng, correct, [
    num(-x0),
    num(Math.round((x0 + 1) * 100) / 100),
    num(Math.round((x0 - 1) * 100) / 100),
    num(Math.round((x0 + 2) * 100) / 100),
  ]);
  return {
    itemType: 'MC',
    context: `Two functions are shown: f(x) = ${lin(m1, b1)} and g(x) = ${lin(m2, b2)}. What is the value of x when f(x) = g(x)?`,
    question: `${lin(m1, b1)} = ${lin(m2, b2)}`,
    answer: mRes.answer,
    choices: mRes.choices,
    steps: [
      { number: 1, description: 'Set the expressions equal and collect x-terms.', math: `${num(m1 - m2)}x = ${num(b2 - b1)}` },
      { number: 2, description: 'Divide.', math: `x = ${correct}` },
    ],
    hints: ['Set f(x) equal to g(x), then solve the linear equation.'],
    timeEstimate: 60,
  };
};

export const exponentialFactories: ProblemFactory[] = [
  genGrowthRate,
  genDecayEval,
  genModelIdentify,
  genExceedsPoint,
  genIntersectionApprox,
  genEqualLinear,
];
