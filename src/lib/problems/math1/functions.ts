// m1-functions: evaluate functions, slope/intercept meaning, table rules,
// recursive-explicit, combining functions, initial value from a table.
// Formats from released Q6, Q7, Q8, Q10, Q13, Q27, Q31, Q43.

import type { ProblemFactory } from '../../problemGenerator';
import { randInt, randNonZero, choice } from './rng';
import { num, money, mc } from './latex';

// ── Q7-style GR: evaluate a linear earnings function ──
const EARN_CONTEXTS = [
  { who: 'Tyson', what: 'mows lawns', per: 'per lawn', unit: 'lawns' },
  { who: 'Ava', what: 'walks dogs', per: 'per dog', unit: 'dogs' },
  { who: 'Malik', what: 'tutors students', per: 'per student', unit: 'students' },
  { who: 'Sofia', what: 'sells bracelets', per: 'per bracelet', unit: 'bracelets' },
];
export const genEvalLinear: ProblemFactory = (rng, difficulty) => {
  const ctx = choice(rng, EARN_CONTEXTS);
  const m = difficulty === 'easy' ? randInt(rng, 5, 25) : randInt(rng, 8, 60);
  const b = randInt(rng, 2, 30) * 10;
  const x0 = randInt(rng, 3, 12);
  const ans = m * x0 + b;
  return {
    itemType: 'GR',
    context: `${ctx.who} has a part-time job and ${ctx.what} for additional money. The function f(x) = ${m}x + ${b} models total monthly earnings (in dollars) for x ${ctx.unit}. What are the total monthly earnings when x = ${x0}?`,
    question: `f(${x0}) = ${m}(${x0}) + ${b}`,
    answer: num(ans),
    steps: [
      { number: 1, description: `Substitute x = ${x0}.`, math: `f(${x0}) = ${m} \\cdot ${x0} + ${b}` },
      { number: 2, description: 'Compute.', math: `f(${x0}) = ${m * x0} + ${b} = ${ans}` },
    ],
    hints: [`Replace every x with ${x0} and simplify.`],
    timeEstimate: 40,
  };
};

// ── Q8-style GR: evaluate f(x) = b^x + kx ──
export const genEvalExpMix: ProblemFactory = (rng, difficulty) => {
  const base = choice(rng, [2, 3] as const);
  const k = difficulty === 'easy' ? randInt(rng, 2, 5) : randInt(rng, 2, 9);
  const x0 = difficulty === 'hard' ? randInt(rng, 4, 5) : randInt(rng, 2, 4);
  const ans = Math.pow(base, x0) + k * x0;
  return {
    itemType: 'GR',
    context: `A function f is defined by f(x) = ${base}^x + ${k}x. What is the value of f(${x0})?`,
    question: `f(x) = ${base}^x + ${k}x`,
    answer: num(ans),
    steps: [
      { number: 1, description: 'Substitute.', math: `f(${x0}) = ${base}^{${x0}} + ${k} \\cdot ${x0}` },
      { number: 2, description: 'Evaluate the power, then add.', math: `f(${x0}) = ${Math.pow(base, x0)} + ${k * x0} = ${ans}` },
    ],
    hints: [`${base}^${x0} = ${Math.pow(base, x0)}`],
    timeEstimate: 40,
  };
};

// ── Q6/Q21-style MC: meaning of the slope in a context ──
const SLOPE_CONTEXTS = [
  { job: 'an automobile mechanic', verb: 'charges a per-hour rate of', unit: 'hour', thing: 'repair cost' },
  { job: 'a dog groomer', verb: 'charges a per-visit rate of', unit: 'visit', thing: 'grooming cost' },
  { job: 'a taxi service', verb: 'charges a per-mile rate of', unit: 'mile', thing: 'ride cost' },
  { job: 'a landscaper', verb: 'charges a per-hour rate of', unit: 'hour', thing: 'project cost' },
];
export const genSlopeMeaning: ProblemFactory = (rng) => {
  const ctx = choice(rng, SLOPE_CONTEXTS);
  const m = choice(rng, [15, 20, 25, 30, 40, 45] as const);
  const b = choice(rng, [50, 75, 100, 150, 200] as const);
  const correct = `${ctx.job.charAt(0).toUpperCase() + ctx.job.slice(1)} ${ctx.verb} $${m}.`;
  const m2 = mc(rng, correct, [
    `${ctx.job.charAt(0).toUpperCase() + ctx.job.slice(1)} ${ctx.verb} $${b}.`,
    `${ctx.job.charAt(0).toUpperCase() + ctx.job.slice(1)} charges a flat fee of $${m}.`,
    `The ${ctx.thing} increases by $${b} for each additional ${ctx.unit}.`,
  ]);
  return {
    itemType: 'MC',
    context: `${ctx.job.charAt(0).toUpperCase() + ctx.job.slice(1)} uses the function y = ${m}x + ${b} to estimate the ${ctx.thing}, where x is the number of ${ctx.unit}s. What is the meaning of the slope of the graph of the function?`,
    question: `y = ${m}x + ${b}`,
    answer: m2.answer,
    choices: m2.choices,
    steps: [
      { number: 1, description: 'The slope is the coefficient of x — the change in y per one additional unit of x.', math: `m = ${m}` },
      { number: 2, description: 'Interpret in context.', math: `\\text{rate} = \\$${m}\\ \\text{per ${ctx.unit}}` },
    ],
    hints: ['In y = mx + b, m is the per-unit rate and b is the starting/flat amount.'],
    timeEstimate: 45,
  };
};

// ── Q13-style MC: meaning of the y-intercept ──
export const genInterceptMeaning: ProblemFactory = (rng) => {
  const ctx = choice(rng, SLOPE_CONTEXTS);
  const m = choice(rng, [15, 20, 25, 30, 40, 45] as const);
  const b = choice(rng, [50, 75, 100, 150, 200] as const);
  const correct = `${ctx.job.charAt(0).toUpperCase() + ctx.job.slice(1)} charges a flat fee of $${b}.`;
  const m2 = mc(rng, correct, [
    `${ctx.job.charAt(0).toUpperCase() + ctx.job.slice(1)} ${ctx.verb} $${b}.`,
    `${ctx.job.charAt(0).toUpperCase() + ctx.job.slice(1)} charges a flat fee of $${m}.`,
    `The ${ctx.thing} increases by $${b} for each additional ${ctx.unit}.`,
  ]);
  return {
    itemType: 'MC',
    context: `${ctx.job.charAt(0).toUpperCase() + ctx.job.slice(1)} uses the function y = ${m}x + ${b} to estimate the ${ctx.thing}, where x is the number of ${ctx.unit}s. What is the meaning of the y-intercept of the graph of the function?`,
    question: `y = ${m}x + ${b}`,
    answer: m2.answer,
    choices: m2.choices,
    steps: [
      { number: 1, description: 'The y-intercept is the value of y when x = 0.', math: `y = ${m}(0) + ${b} = ${b}` },
      { number: 2, description: 'Interpret: with zero units, the cost is the flat fee.', math: `\\text{flat fee} = \\$${b}` },
    ],
    hints: ['The y-intercept is what you pay when x = 0 — the fixed amount.'],
    timeEstimate: 45,
  };
};

// ── Q27-style MC: explicit rule from an arithmetic table ──
export const genTableRule: ProblemFactory = (rng, difficulty) => {
  const d = difficulty === 'easy' ? randInt(rng, 2, 9) : randInt(rng, 12, 30);
  const a = randInt(rng, 3, 45);
  // f(n) = d n + a, table shows n=1..5
  const rows = [1, 2, 3, 4, 5].map((n) => `${n} & \\$${d * n + a}`).join(' \\\\ ');
  const correct = `f(n) = ${d}n + ${a}`;
  const m2 = mc(rng, correct, [
    `f(n) = n + ${d}`,
    `f(n) = ${d}n + ${d + a}`,
    `f(n) = ${d + a}n`,
  ]);
  return {
    itemType: 'MC',
    context: 'A table shows the total amount saved at the end of each week for 5 weeks. Which function gives the total saved after n weeks, assuming the pattern continues?',
    question: `\\begin{array}{c|c} \\text{Week} & \\text{Total Saved} \\\\ \\hline ${rows} \\end{array}`,
    answer: m2.answer,
    choices: m2.choices,
    steps: [
      { number: 1, description: 'The weekly increase is constant — a linear function with slope d.', math: `d = ${d}` },
      { number: 2, description: 'Work backward to week 0 for the intercept.', math: `f(0) = ${d + a} - ${d} = ${a}` },
      { number: 3, description: 'Write the rule.', math: correct },
    ],
    hints: ['Check the constant difference between weeks — that is the coefficient of n.'],
    timeEstimate: 60,
  };
};

// ── Q31-style MC (converted DD): recursive to explicit ──
export const genRecursiveExplicit: ProblemFactory = (rng) => {
  const d = randNonZero(rng, -4, 6);
  const a1 = randInt(rng, 1, 8);
  // a_n = d n + (a1 - d)
  const c = a1 - d;
  const correct = c === 0 ? `a_n = ${d}n` : `a_n = ${varN(d)} ${c > 0 ? '+' : '-'} ${num(Math.abs(c))}`;
  const m2 = mc(rng, correct, [
    `a_n = ${varN(d)} + ${num(a1)}`,
    `a_n = ${varN(d + 1)} ${c >= 0 ? '+' : '-'} ${num(Math.abs(c))}`,
    `a_n = ${varN(d - 1)} ${c >= 0 ? '+' : '-'} ${num(Math.abs(c))}`,
    `a_n = ${varN(d)} ${c + 2 >= 0 ? '+' : '-'} ${num(Math.abs(c + 2))}`,
  ]);
  function varN(k: number) { return k === 1 ? 'n' : k === -1 ? '-n' : `${num(k)}n`; }
  return {
    itemType: 'MC',
    context: `A sequence is defined recursively by a(n+1) = a(n) ${d >= 0 ? '+' : '−'} ${Math.abs(d)}, with a(1) = ${a1}. Which explicit formula defines the same sequence?`,
    question: `a_{n+1} = a_n ${d >= 0 ? '+' : '-'} ${num(Math.abs(d))}, \\quad a_1 = ${a1}`,
    answer: m2.answer,
    choices: m2.choices,
    steps: [
      { number: 1, description: 'Common difference d becomes the coefficient of n.', math: `a_n = ${varN(d)} + c` },
      { number: 2, description: 'Use a(1) to find c.', math: `${a1} = ${d}(1) + c \\Rightarrow c = ${num(c)}` },
    ],
    hints: ['For an arithmetic sequence, a_n = d·n + (a_1 − d).'],
    timeEstimate: 60,
  };
};

// ── Q43-style MC: savings = difference of two cost functions ──
export const genSavingsDiff: ProblemFactory = (rng) => {
  const a1c = choice(rng, [0.04, 0.05, 0.06, 0.08] as const);
  const a2c = a1c - 0.01;
  const b1 = choice(rng, [6.50, 7.25, 8.50, 9.75] as const);
  const b2 = b1 - choice(rng, [0.25, 0.50, 0.75] as const);
  const dm = (a1c - a2c).toFixed(2);
  const db = (b1 - b2).toFixed(2);
  const correct = `m(x) = ${dm}x + ${db}`;
  const m2 = mc(rng, correct, [
    `m(x) = ${a2c.toFixed(2)}x + ${db}`,
    `m(x) = ${a1c.toFixed(2)}x + ${db}`,
    `m(x) = ${(a1c + a2c).toFixed(2)}x + ${db}`,
  ]);
  return {
    itemType: 'MC',
    context: `Carrie needs to buy supplies. g(x) = ${a1c.toFixed(2)}x + ${b1.toFixed(2)} models the cost at the first store and h(x) = ${a2c.toFixed(2)}x + ${b2.toFixed(2)} at a second store, for x items. Which function models the amount m(x) saved by buying from the second store instead of the first?`,
    question: `m(x) = g(x) - h(x)`,
    answer: m2.answer,
    choices: m2.choices,
    steps: [
      { number: 1, description: 'Subtract the second cost from the first.', math: `m(x) = (${a1c.toFixed(2)}x + ${b1.toFixed(2)}) - (${a2c.toFixed(2)}x + ${b2.toFixed(2)})` },
      { number: 2, description: 'Combine like terms.', math: correct },
    ],
    hints: ['Savings = first store cost − second store cost. Distribute the negative.'],
    timeEstimate: 60,
  };
};

// ── Q10-style GR: initial fee from a linear cost table ──
export const genInitialFee: ProblemFactory = (rng, difficulty) => {
  const per = difficulty === 'easy' ? randInt(rng, 2, 6) : randInt(rng, 3, 9);
  const fee = randInt(rng, 2, 10);
  const h1 = 2, h2 = randInt(rng, 5, 7), h3 = randInt(rng, 9, 12);
  const rows = [h1, h2, h3].map((h) => `${h} & \\$${per * h + fee}`).join(' \\\\ ');
  return {
    itemType: 'GR',
    context: 'A company rents bicycles, charging an initial fee plus an hourly rate. The table shows the total cost for different rental times. What is the initial fee, in dollars?',
    question: `\\begin{array}{c|c} \\text{Hours} & \\text{Total Cost} \\\\ \\hline ${rows} \\end{array}`,
    answer: num(fee),
    steps: [
      { number: 1, description: 'The hourly rate is the constant difference per hour.', math: `r = \\frac{${per * h2 + fee} - ${per * h1 + fee}}{${h2} - ${h1}} = ${per}` },
      { number: 2, description: 'Subtract the hourly charges from any row.', math: `\\text{fee} = ${per * h1 + fee} - ${per} \\cdot ${h1} = ${fee}` },
    ],
    hints: ['Find the per-hour rate from two rows first, then subtract to find what is left at 0 hours.'],
    timeEstimate: 75,
  };
};

export const functionFactories: ProblemFactory[] = [
  genEvalLinear,
  genEvalExpMix,
  genSlopeMeaning,
  genInterceptMeaning,
  genTableRule,
  genRecursiveExplicit,
  genSavingsDiff,
  genInitialFee,
];

// re-export for convenience in other factories
export { money };
