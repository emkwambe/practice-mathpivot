// g6-expressions-equations: exponents/powers of ten, phrase→expression,
// distributive property, inequalities (incl. graphs), story equations, y = kx from a graph.
// Covers released items 1, 2, 4, 5, 7, 8, 10, 12, 14, 16, 29 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt, shuffle } from '../math1/rng';
import { linExpr, mc, num, varTerm } from '../math1/latex';
import { inequalityLineSvg } from './svg';
import { lineGraphSvg } from '../math7/svg';

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

// ── Q1-style MC: value = n ÷ 10^k, find n ───────────────────────────────
export const genPowersOfTenSolve: ProblemFactory = (rng) => {
  const k = choice(rng, [2, 3] as const);
  const n = randInt(rng, 12, 96) * 100 + randInt(rng, 10, 99); // 4-digit-ish
  const displayed = (n / 100).toFixed(2); // decimal shown on the left side
  // displayed = m ÷ 10^k → m = displayed × 10^k
  const mVal = Math.round(parseFloat(displayed) * Math.pow(10, k));
  const m = mcUnique(rng, num(mVal), [
    num(mVal / 10),
    num(mVal * 10),
    num(Math.round(parseFloat(displayed) * Math.pow(10, k - 1))),
  ], (kk) => num(mVal * 10 + kk * 100));
  return {
    itemType: 'MC',
    context: `What value of m makes the equation true?`,
    question: `${displayed} = m \\div 10^{${k}}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Multiply both sides by 10^${k}.`, math: `m = ${displayed} \\times 10^{${k}} = ${num(mVal)}` },
    ],
    hints: ['Dividing by a power of ten moves the decimal left; undo it by multiplying.'],
    timeEstimate: 45,
  };
};

// ── Q2/Q8-style MC: phrase → algebraic expression ───────────────────────
export const genPhraseToExpression: ProblemFactory = (rng) => {
  const c = randInt(rng, 2, 9);
  const k = randInt(rng, 2, 9);
  const v = choice(rng, ['y', 'n', 'x'] as const);
  const variant = choice(rng, ['lessThanProduct', 'increasedByTwice'] as const);
  if (variant === 'lessThanProduct') {
    const correct = `${varTerm(c, v)} - ${k}`;
    const m = mcUnique(rng, correct, [
      `${k} - ${varTerm(c, v)}`,
      `(${c} + ${v}) - ${k}`,
      `${k} - (${c} + ${v})`,
    ], (kk) => `${varTerm(c + kk, v)} - ${k + kk}`);
    return {
      itemType: 'MC',
      context: `Which expression is equivalent to "${k} less than the product of ${c} and a number, ${v}"?`,
      question: `\\text{${k} less than } ${c}${v} \\text{?}`,
      answer: m.answer,
      choices: m.choices,
      steps: [
        { number: 1, description: `"${k} less than" means subtract ${k} FROM the product.`, math: `${c}${v} - ${k}` },
      ],
      hints: ['"Less than" reverses the order: the product comes first.'],
      timeEstimate: 45,
    };
  }
  const correct = `${k} + ${varTerm(2, v)}`;
  const m = mcUnique(rng, correct, [
    `${k} \\times 2${v}`,
    `2(${k} + ${v})`,
    `${varTerm(2, v)} - ${k}`,
  ], (kk) => `${k + kk} + ${varTerm(2, v)}`);
  return {
    itemType: 'MC',
    context: `Which expression represents "${k} increased by twice a number ${v}"?`,
    question: `\\text{${k} increased by } 2${v} \\text{?}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `"Twice a number" is 2${v}; "increased by" adds it to ${k}.`, math: `${k} + 2${v}` },
    ],
    hints: ['"Increased by" means add.'],
    timeEstimate: 45,
  };
};

// ── Q7-style MC: story → expression with variable ───────────────────────
export const genStoryExpression: ProblemFactory = (rng) => {
  const mult = randInt(rng, 2, 4);
  const per = choice(rng, [3, 4, 5, 6] as const);
  const less = randInt(rng, 1, 3);
  const v = choice(rng, ['m', 'b', 'p'] as const);
  const correct = `${mult}(${per}${v}) - ${less}`;
  const m = mcUnique(rng, correct, [
    `${mult}(${per}${v}) + ${less}`,
    `${mult}${per}${v} - ${less}`,
    `${per}(${mult}${v}) - ${less + 1}`,
  ], (k) => `${mult}(${per}${v}) - ${less + k}`);
  return {
    itemType: 'MC',
    context: `Ben read ${less} less than ${mult} times the number of books Renee read. Renee read ${per} books each month for ${v} months. Which expression shows the number of books Ben read?`,
    question: '\\text{books Ben read} = ?',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Renee read ${per}${v} books; ${mult} times that is ${mult}(${per}${v}); ${less} less subtracts ${less}.`, math: correct },
    ],
    hints: ['Build the expression piece by piece: months → times → less.'],
    timeEstimate: 60,
  };
};

// ── Q4-style MC: phrase → inequality solution ───────────────────────────
export const genPhraseToInequality: ProblemFactory = (rng) => {
  const dec = randInt(rng, 5, 15);
  const over = randInt(rng, 1, 9);
  const sol = dec + over;
  const correct = `n > ${sol}`;
  const m = mcUnique(rng, correct, [
    `n < ${sol}`,
    `n = ${sol}`,
    `n \\geq ${sol}`,
  ], (k) => `n > ${sol + k}`);
  return {
    itemType: 'MC',
    context: `When a number n is decreased by ${dec}, the result is greater than ${over}. Which describes the set of all values of n?`,
    question: `n - ${dec} > ${over}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Add ${dec} to both sides.`, math: `n > ${over} + ${dec} = ${sol}` },
    ],
    hints: ['Undo the subtraction on both sides; keep the inequality direction.'],
    timeEstimate: 45,
  };
};

// ── Q5-style MC: regular polygon with algebraic side → perimeter ────────
export const genPolygonPerimeter: ProblemFactory = (rng) => {
  const sides = choice(rng, [5, 6, 8, 10, 12] as const);
  const a = randInt(rng, 2, 5);
  const b = randInt(rng, 1, 9);
  const correct = `${varTerm(sides * a, 'x')} + ${sides * b}`;
  const m = mcUnique(rng, correct, [
    `${varTerm(sides * a, 'x')} + ${b}`,
    `${varTerm(a, 'x')} + ${sides * b}`,
    `${varTerm(sides + a, 'x')} + ${sides + b}`,
  ], (k) => `${varTerm(sides * a, 'x')} + ${sides * b + k}`);
  return {
    itemType: 'MC',
    context: `A regular ${sides}-sided figure has a side length of ${a}x + ${b}. What is the perimeter of the figure?`,
    question: `P = ${sides}(${linExpr(a, b)})`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `A regular figure has ${sides} equal sides; distribute ${sides}.`, math: `${sides} \\times (${a}x + ${b}) = ${sides * a}x + ${sides * b}` },
    ],
    hints: ['Multiply the side expression by the number of sides.'],
    timeEstimate: 50,
  };
};

// ── Q14-style GR: distributive blank ────────────────────────────────────
export const genDistributiveBlank: ProblemFactory = (rng) => {
  const c = randInt(rng, 3, 12);
  const b = randInt(rng, 2, 9);
  const sub = randInt(rng, 1, c * b - 1);
  const blank = c * b - sub;
  return {
    itemType: 'GR',
    context: `Which number goes in the blank to make the equation true?`,
    question: `${c}(x + ${b}) - ${sub} = ${c}x + \\boxed{\\phantom{00}}`,
    answer: num(blank),
    steps: [
      { number: 1, description: `Distribute ${c}.`, math: `${c}(x + ${b}) = ${c}x + ${c * b}` },
      { number: 2, description: `Subtract ${sub}.`, math: `${c * b} - ${sub} = ${blank}` },
    ],
    hints: ['Distribute first, then combine the constants.'],
    timeEstimate: 50,
  };
};

// ── Q16-style GR (money): multi-item total, find unknown item ───────────
export const genStoryEquationMoney: ProblemFactory = (rng) => {
  const ticket = choice(rng, [6.5, 7.5, 8.25, 9.5] as const);
  const soda = choice(rng, [2.25, 2.5, 3.0, 3.5] as const);
  const popcorn = choice(rng, [4.5, 5.25, 6.5] as const);
  const candy = choice(rng, [1.5, 2.0, 2.5, 3.0, 4.0] as const);
  const total = 2 * ticket + 3 * soda + popcorn + candy;
  const fmt = (v: number) => v.toFixed(2);
  return {
    itemType: 'GR',
    context: `A family bought 2 movie tickets for $${fmt(ticket)} each, 3 sodas for $${fmt(soda)} each, and one popcorn for $${fmt(popcorn)}. They also bought one box of candy. The total cost was $${fmt(total)}. What was the cost of the candy, in dollars? (Express the answer as dollars.cents.)`,
    question: `2(${fmt(ticket)}) + 3(${fmt(soda)}) + ${fmt(popcorn)} + c = ${fmt(total)}`,
    answer: fmt(candy),
    steps: [
      { number: 1, description: 'Add the known costs.', math: `2(${fmt(ticket)}) + 3(${fmt(soda)}) + ${fmt(popcorn)} = ${fmt(2 * ticket + 3 * soda + popcorn)}` },
      { number: 2, description: 'Subtract from the total.', math: `c = ${fmt(total)} - ${fmt(2 * ticket + 3 * soda + popcorn)} = ${fmt(candy)}` },
    ],
    hints: ['Find the sum of everything except the candy, then subtract from the total.'],
    timeEstimate: 80,
  };
};

// ── Q12-style GR: sum of powers of ten ──────────────────────────────────
export const genPowerOfTenSum: ProblemFactory = (rng) => {
  const a = randInt(rng, 2, 9);
  const b = randInt(rng, 2, 9);
  const k1 = choice(rng, [3, 4] as const);
  const k2 = k1 === 3 ? 4 : 3;
  const value = a * Math.pow(10, k1) + b * Math.pow(10, k2);
  return {
    itemType: 'GR',
    context: 'What is the value of the expression below?',
    question: `(${a} \\times 10^{${k1}}) + (${b} \\times 10^{${k2}})`,
    answer: num(value),
    steps: [
      { number: 1, description: 'Evaluate each term.', math: `${a} \\times 10^{${k1}} = ${a * Math.pow(10, k1)}, \\quad ${b} \\times 10^{${k2}} = ${b * Math.pow(10, k2)}` },
      { number: 2, description: 'Add.', math: num(value) },
    ],
    hints: ['A power of ten just appends zeros.'],
    timeEstimate: 45,
  };
};

// ── Q10-style MC + VIS choices: graph of an inequality ──────────────────
export const genInequalityGraph: ProblemFactory = (rng) => {
  const bound = randInt(rng, 3, 9);
  const cmp = choice(rng, ['gt', 'lt', 'ge', 'le'] as const);
  const cmpSym = { gt: '>', lt: '<', ge: '\\geq', le: '\\leq' }[cmp];
  // distractors = the three OTHER comparison types, shuffled — never duplicated
  const others = shuffle(rng, (['gt', 'lt', 'ge', 'le'] as const).filter((c) => c !== cmp));
  const correctIdx = randInt(rng, 0, 3);
  const svgs: string[] = [];
  let wi = 0;
  for (let i = 0; i < 4; i++) svgs.push(inequalityLineSvg(i === correctIdx ? cmp : others[wi++], bound));
  const letters = ['A', 'B', 'C', 'D'];
  const v = choice(rng, ['b', 'x', 'n'] as const);
  return {
    itemType: 'MC',
    context: `Which graph represents the solution for ${v} ${cmpSym === '\\geq' ? '≥' : cmpSym === '\\leq' ? '≤' : cmpSym} ${bound}?`,
    question: `${v} ${cmpSym} ${bound}`,
    answer: letters[correctIdx],
    choices: letters,
    svgChoices: svgs,
    steps: [
      { number: 1, description: `${cmp === 'gt' || cmp === 'lt' ? 'An open circle' : 'A closed circle'} at ${bound}; shade ${cmp === 'gt' || cmp === 'ge' ? 'right (greater values)' : 'left (smaller values)'}.`, math: `\\text{graph } ${letters[correctIdx]}` },
    ],
    hints: ['Open circle for > or <, closed for ≥ or ≤; the ray points toward the solutions.'],
    timeEstimate: 40,
  };
};

// ── Q29-style MC + VIS stem: proportional graph → equation ──────────────
export const genGraphEquation: ProblemFactory = (rng) => {
  const k = choice(rng, [10, 15, 20, 25, 30] as const);
  const svg = lineGraphSvg({ xLabel: 'Hours', yLabel: 'Dollars', xMax: 5, yMax: 5 * k, mark: { x: 2, y: 2 * k } });
  const correct = `y = ${k}x`;
  const m = mcUnique(rng, correct, [
    `y = ${k + 10}x`,
    `y = ${Math.max(2, k - 10)}x`,
    `x = ${k}y`,
  ], (kk) => `y = ${k + 10 * kk}x`);
  return {
    itemType: 'MC',
    context: 'The graph shows the relationship between hours worked and dollars earned. Which equation represents this relationship?',
    question: 'y = \\, ?',
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `The ray passes through (1, ${k}), so the rate is ${k} dollars per hour.`, math: `y = ${k}x` },
    ],
    hints: ['Read the value of y when x = 1 — that is the unit rate.'],
    timeEstimate: 50,
  };
};

export const expressionFactories: ProblemFactory[] = [
  genPowersOfTenSolve,
  genPhraseToExpression,
  genStoryExpression,
  genPhraseToInequality,
  genPolygonPerimeter,
  genDistributiveBlank,
  genStoryEquationMoney,
  genPowerOfTenSum,
  genInequalityGraph,
  genGraphEquation,
];
