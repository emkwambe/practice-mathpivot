// m1-systems: solve 2x2 systems, modeling systems, inequality systems,
// classify number of solutions. Formats from released Q4, Q5, Q12, Q25.

import type { ProblemFactory } from '../../problemGenerator';
import { randInt, randNonZero, choice } from './rng';
import { num, mc } from './latex';

// ── Q4-style GR: solve a 2x2 system with integer solution, report y ──
export const genSolveSystem: ProblemFactory = (rng, difficulty) => {
  const x0 = randNonZero(rng, -5, 6);
  const y0 = randNonZero(rng, -5, 6);
  // coefficients with nonzero determinant
  let a1 = 0, b1 = 0, a2 = 0, b2 = 0;
  for (let tries = 0; tries < 100; tries++) {
    a1 = randInt(rng, 1, 4) * choice(rng, [1, -1] as const);
    b1 = randInt(rng, 1, 4) * choice(rng, [1, -1] as const);
    a2 = randInt(rng, 1, 4) * choice(rng, [1, -1] as const);
    b2 = randInt(rng, 1, 4) * choice(rng, [1, -1] as const);
    if (a1 * b2 - a2 * b1 !== 0) break;
  }
  const c1 = a1 * x0 + b1 * y0;
  const c2 = a2 * x0 + b2 * y0;
  const eq = (a: number, b: number, c: number) =>
    `${term(a)} ${b >= 0 ? '+' : '-'} ${bTerm(Math.abs(b))} = ${num(c)}`;
  function term(a: number) { return a === 1 ? 'x' : a === -1 ? '-x' : `${num(a)}x`; }
  function bTerm(b: number) { return b === 1 ? 'y' : `${num(b)}y`; }
  const askY = difficulty !== 'hard' || choice(rng, [true, false] as const);
  return {
    itemType: 'GR',
    context: `A system of equations is shown. What is the ${askY ? 'y' : 'x'}-value of the solution to the system?`,
    question: `\\begin{cases} ${eq(a1, b1, c1)} \\\\ ${eq(a2, b2, c2)} \\end{cases}`,
    answer: num(askY ? y0 : x0),
    steps: [
      { number: 1, description: 'Eliminate one variable (multiply and add the equations).', math: `x = ${num(x0)}` },
      { number: 2, description: 'Substitute back to find the other variable.', math: `y = ${num(y0)}` },
      { number: 3, description: `Report the ${askY ? 'y' : 'x'}-value.`, math: num(askY ? y0 : x0) },
    ],
    hints: ['Try elimination: make the x-coefficients opposites and add the equations.'],
    timeEstimate: 90,
  };
};

// ── Q5-style MC: choose the system that models a two-quantity context ──
interface CoinContext {
  items: [string, string];
  values: [string, string]; // per-unit values as strings, e.g. '0.05'
  plain: string;            // prose for values
}
const COIN_CONTEXTS: CoinContext[] = [
  { items: ['nickels', 'dimes'], values: ['0.05', '0.10'], plain: 'nickels (5 cents) and dimes (10 cents)' },
  { items: ['dimes', 'quarters'], values: ['0.10', '0.25'], plain: 'dimes (10 cents) and quarters (25 cents)' },
  { items: ['child tickets', 'adult tickets'], values: ['6', '12'], plain: 'child tickets ($6) and adult tickets ($12)' },
  { items: ['small boxes', 'large boxes'], values: ['4', '9'], plain: 'small boxes (4 lb) and large boxes (9 lb)' },
];
export const genModelSystem: ProblemFactory = (rng) => {
  const ctx = choice(rng, COIN_CONTEXTS);
  const T = randInt(rng, 10, 30);
  const unitTotal = randInt(rng, 3, 18);
  const total = (Math.round((T * parseFloat(ctx.values[0]) + unitTotal * (parseFloat(ctx.values[1]) - parseFloat(ctx.values[0]))) * 100) / 100).toFixed(2);
  const v1 = ctx.values[0];
  const v2 = ctx.values[1];
  const correct = `x + y = ${num(T)} \\quad ; \\quad ${v1}x + ${v2}y = ${total}`;
  const m = mc(rng, correct, [
    `x + y = ${num(T)} \\quad ; \\quad ${v2}x + ${v1}y = ${total}`,
    `x + y = ${total} \\quad ; \\quad ${v1}x + ${v2}y = ${num(T)}`,
    `${v1}x + ${v2}y = ${num(T)} \\quad ; \\quad x + y = ${total}`,
  ]);
  return {
    itemType: 'MC',
    context: `A person has a total of ${T} items — some are ${ctx.plain.split(' and ')[0]}, the rest are ${ctx.plain.split(' and ')[1]}. The total value is $${total}. Let x be the number of ${ctx.items[0]} and y the number of ${ctx.items[1]}. Which system could be used to find the number of each?`,
    question: `\\text{Choose the correct system}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'One equation counts the items; the other adds up value.', math: `x + y = ${num(T)}` },
      { number: 2, description: 'Value equation uses the per-item values.', math: `${v1}x + ${v2}y = ${total}` },
    ],
    hints: ['Count equation uses 1x + 1y; value equation uses the per-item values as coefficients.'],
    timeEstimate: 60,
  };
};

// ── Q12-style MC: system of inequalities modeling a fundraiser ──
export const genInequalitySystem: ProblemFactory = (rng) => {
  const p1 = choice(rng, [4, 5, 6, 8, 10, 12]);
  let p2 = choice(rng, [2, 3, 4, 6]);
  if (p2 >= p1) p2 = 2;
  const goal = choice(rng, [800, 1200, 2400, 4800]);
  const cap = choice(rng, [200, 300, 400, 500]);
  const names = choice(rng, [
    ['adult tickets', "children's tickets"],
    ['large pizzas', 'small pizzas'],
    ['premium seats', 'regular seats'],
  ] as const);
  const correct = `${p1}x + ${p2}y \\geq ${goal.toLocaleString('en-US').replace(/,/g, ',')} \\quad ; \\quad x + y \\leq ${cap}`;
  const G = goal.toLocaleString('en-US');
  const m = mc(rng, correct, [
    `${p1}x + ${p2}y > ${G} \\quad ; \\quad x + y \\leq ${cap}`,
    `${p1}x + ${p2}y \\geq ${G} \\quad ; \\quad x + y < ${cap}`,
    `${p1}x + ${p2}y > ${G} \\quad ; \\quad x + y < ${cap}`,
  ]);
  return {
    itemType: 'MC',
    context: `A group holds a fundraiser. The goal is a total profit of at least $${G}. Each of the ${names[0]} sold (x) earns $${p1} profit and each of the ${names[1]} sold (y) earns $${p2} profit. At most ${cap} total items can be sold. Which system of inequalities represents this situation?`,
    question: `\\text{goal: profit} \\geq ${G},\\ \\ \\text{capacity: total} \\leq ${cap}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: '"At least" the goal means greater-than-or-equal.', math: `${p1}x + ${p2}y \\geq ${G}` },
      { number: 2, description: '"At most" the capacity means less-than-or-equal.', math: `x + y \\leq ${cap}` },
    ],
    hints: ['"At least" → ≥, "at most" → ≤. Strict > or < would exclude the boundary.'],
    timeEstimate: 75,
  };
};

// ── Q25-style MC (converted DD): classify number of solutions of a system ──
export const genClassifySystem: ProblemFactory = (rng, difficulty) => {
  const kind = difficulty === 'easy'
    ? choice(rng, ['one', 'none', 'infinite'] as const)
    : choice(rng, ['one', 'none', 'infinite'] as const);
  const mSlope = randInt(rng, 1, 5);
  const b = randNonZero(rng, -6, 8);
  const k = randInt(rng, 2, 6);
  // line 1: y = (m/k)x + b → k y = m x + k b
  let c2: number;
  if (kind === 'infinite') c2 = k * b;
  else if (kind === 'none') c2 = k * b + randNonZero(rng, 1, 5) * choice(rng, [1, -1] as const);
  else c2 = randInt(rng, -9, 9); // will adjust slope instead
  const slope2Num = kind === 'one' ? mSlope + choice(rng, [1, 2, -1] as const) : mSlope;
  const eq1 = `y = \\frac{${mSlope}}{${k}}x ${b >= 0 ? '+' : '-'} ${num(Math.abs(b))}`;
  const eq2 = `${k}y = ${slope2Num}x ${c2 >= 0 ? '+' : '-'} ${num(Math.abs(c2))}`;
  const label = kind === 'one' ? 'one solution' : kind === 'none' ? 'no solution' : 'infinitely many solutions';
  const mRes = mc(rng, label, ['one solution', 'no solution', 'infinitely many solutions', 'two solutions']);
  return {
    itemType: 'MC',
    context: 'A system of two equations is shown. How many solutions does the system have?',
    question: `\\begin{cases} ${eq1} \\\\ ${eq2} \\end{cases}`,
    answer: mRes.answer,
    choices: mRes.choices,
    steps: [
      { number: 1, description: 'Compare slopes: same slope with different intercepts → no solution; identical line → infinitely many; different slopes → one.', math: `m_1 = \\frac{${mSlope}}{${k}}, \\quad m_2 = \\frac{${slope2Num}}{${k}}` },
      { number: 2, description: 'Conclusion.', math: `\\text{${label}}` },
    ],
    hints: ['Put both equations in y = mx + b form and compare slopes and intercepts.'],
    timeEstimate: 60,
  };
};

export const systemFactories: ProblemFactory[] = [
  genSolveSystem,
  genModelSystem,
  genInequalitySystem,
  genClassifySystem,
];
