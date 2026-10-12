// g8-statistics-probability: scatterplots (association, best fit),
// interpreting slope/intercept of linear models, two-way tables.
// Covers released items 1, 8, 10, 25, 33, 37, 38 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt, shuffle } from '../math1/rng';
import { linExpr, mc, num } from '../math1/latex';
import { scatterplotSvg } from './svg';

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

/** Integer-point scatterplot data with a controlled association. */
function scatterPoints(rng: Parameters<typeof choice>[0], kind: 'pos' | 'neg' | 'none'): [number, number][] {
  const pts: [number, number][] = [];
  const used = new Set<string>();
  let guard = 0;
  while (pts.length < 12 && guard++ < 200) {
    const x = randInt(rng, -5, 5);
    let y: number;
    if (kind === 'pos') y = Math.max(-5, Math.min(5, Math.round(x + randInt(rng, -2, 2))));
    else if (kind === 'neg') y = Math.max(-5, Math.min(5, Math.round(-x + randInt(rng, -2, 2))));
    else y = randInt(rng, -5, 5);
    const key = `${x},${y}`;
    if (used.has(key)) continue;
    used.add(key);
    pts.push([x, y]);
  }
  return pts;
}

// ── Q1/Q33-style MC + VIS choices: identify the association ─────────────
export const genScatterAssociationId: ProblemFactory = (rng) => {
  const target = choice(rng, ['pos', 'neg'] as const);
  const correctIdx = randInt(rng, 0, 3);
  const kinds: ('pos' | 'neg' | 'none')[] = shuffle(rng, [
    target === 'pos' ? 'neg' : 'pos',
    'none',
    'none',
  ]);
  const svgs: string[] = [];
  let ki = 0;
  for (let i = 0; i < 4; i++) svgs.push(scatterplotSvg(scatterPoints(rng, i === correctIdx ? target : kinds[ki++])));
  const letters = ['A', 'B', 'C', 'D'];
  const targetWord = target === 'pos' ? 'positive' : 'negative';
  return {
    itemType: 'MC',
    context: `Which scatterplot shows a ${targetWord} association between x and y?`,
    question: `\\text{${targetWord} association?}`,
    answer: letters[correctIdx],
    choices: letters,
    svgChoices: svgs,
    steps: [
      { number: 1, description: `A ${targetWord} association means y tends to ${target === 'pos' ? 'increase' : 'decrease'} as x increases.`, math: `\\text{graph } ${letters[correctIdx]}` },
    ],
    hints: ['Trace left to right: do the dots drift upward (positive) or downward (negative)?'],
    timeEstimate: 45,
  };
};

// ── Q37-style MC + VIS stem: best linear model for a scatterplot ────────
export const genScatterBestModel: ProblemFactory = (rng) => {
  const slope = choice(rng, [1, 2] as const);
  const b = randInt(rng, -4, 6);
  const pts: [number, number][] = [];
  const used = new Set<string>();
  let guard = 0;
  while (pts.length < 10 && guard++ < 200) {
    const x = randInt(rng, -5, 4);
    const y = Math.max(-5, Math.min(5, Math.round(slope * x + b + randInt(rng, -1, 1))));
    const key = `${x},${y}`;
    if (!used.has(key)) {
      used.add(key);
      pts.push([x, y]);
    }
  }
  const svg = scatterplotSvg(pts);
  const correct = `y = ${linExpr(slope, b)}`;
  const m = mcUnique(rng, correct, [
    `y = ${linExpr(slope, -b === 0 ? 2 : -b)}`,
    `y = ${linExpr(slope + 1, b)}`,
    `y = ${linExpr(-slope, b)}`,
  ], (k) => `y = ${linExpr(slope, b + 2 * k)}`);
  return {
    itemType: 'MC',
    context: 'A scatterplot is shown. Which equation best models the data?',
    question: 'y = \\,?',
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Estimate where the trend line crosses the y-axis and its rise over run.', math: correct },
    ],
    hints: ['Check the y-intercept first, then the slope direction.'],
    timeEstimate: 60,
  };
};

// ── Q10/Q38-style MC: meaning of the slope of a linear model ────────────
export const genSlopeMeaningModel: ProblemFactory = (rng) => {
  const ctx = choice(rng, [
    { y: 'the total cost, in dollars,', x: 'the number of tickets', m: 30, b: 15, what: 'the cost of each ticket' },
    { y: 'the remaining balance, in dollars,', x: 'the number of weekly payments', m: -40, b: 900, what: 'the amount of each weekly payment' },
    { y: 'the plant height, in centimeters,', x: 'the number of weeks', m: 4, b: 12, what: 'the weekly growth of the plant' },
  ] as const);
  const mAbs = Math.abs(ctx.m);
  const dir = ctx.m > 0 ? 'increases' : 'decreases';
  const correct = `${ctx.y.replace(/^./, (c) => c.toUpperCase())} ${dir} by ${mAbs} per unit of ${ctx.x} — ${ctx.what}`;
  const m = mcUnique(rng, correct, [
    `The starting value is ${mAbs}`,
    `${ctx.y.replace(/^./, (c) => c.toUpperCase())} ${ctx.m > 0 ? 'decreases' : 'increases'} by ${mAbs} per unit of ${ctx.x}`,
    `The model predicts a value of ${ctx.b} when ${ctx.x} is 1`,
  ], (k) => `The amount changes by ${mAbs + 5 * k} per unit of ${ctx.x}`);
  return {
    itemType: 'MC',
    context: `The equation y = ${ctx.m}x + ${ctx.b} models ${ctx.y} in terms of ${ctx.x}. What does the slope of the model represent?`,
    question: `y = ${linExpr(ctx.m, ctx.b)}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'The slope is the rate of change of y per unit of x.', math: `m = ${ctx.m}` },
    ],
    hints: ['Slope = change per one unit; the y-intercept is the starting value.'],
    timeEstimate: 60,
  };
};

// ── Q8-style MC: meaning of the y-intercept of a linear model ───────────
export const genInterceptMeaningModel: ProblemFactory = (rng) => {
  const ctx = choice(rng, [
    { y: 'the total fee, in dollars,', x: 'hours of rental', m: 12, b: 25, what: 'the fixed charge before any hours are counted' },
    { y: 'the temperature, in °F,', x: 'minutes after noon', m: -3, b: 68, what: 'the temperature at noon' },
    { y: 'the cost, in dollars,', x: 'the number of guests', m: 9, b: 40, what: 'the base cost with zero guests' },
  ] as const);
  const correct = `${ctx.what.replace(/^./, (c) => c.toUpperCase())} (${ctx.b})`;
  const m = mcUnique(rng, correct, [
    `The rate of ${ctx.m} per unit of ${ctx.x}`,
    `The value of ${ctx.x} when y is 0`,
    `The maximum value of y`,
  ], (k) => `The fixed value ${ctx.b + 10 * k}`);
  return {
    itemType: 'MC',
    context: `The equation y = ${ctx.m}x + ${ctx.b} models ${ctx.y} in terms of ${ctx.x}. What does the y-intercept represent?`,
    question: `y = ${linExpr(ctx.m, ctx.b)}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'The y-intercept is the value of y when x = 0.', math: `y(0) = ${ctx.b}` },
    ],
    hints: ['Set x = 0 and interpret the result in the context.'],
    timeEstimate: 60,
  };
};

// ── Q25-style MC: two-way frequency table ───────────────────────────────
export const genTwoWayTable: ProblemFactory = (rng) => {
  const total = choice(rng, [200, 240, 250, 300]);
  const both = choice(rng, [10, 12, 15, 20]);
  const onlyA = randInt(rng, 40, 70);
  const onlyB = randInt(rng, 30, 60);
  const neither = total - onlyA - onlyB - both;
  if (neither <= 0) return genTwoWayTable(rng, 'medium');
  const table =
    `\\begin{array}{c|c|c|c} & \\text{Sport A} & \\text{No Sport A} & \\text{Total} \\\\ \\hline ` +
    `\\text{Sport B} & ${both} & ${onlyB} & ${both + onlyB} \\\\ ` +
    `\\text{No Sport B} & ${onlyA} & ${neither} & ${onlyA + neither} \\\\ ` +
    `\\text{Total} & ${both + onlyA} & ${onlyB + neither} & ${total} \\end{array}`;
  const correct = `${neither} students play neither sport`;
  const m = mcUnique(rng, correct, [
    `${both + onlyA} students play both sports`,
    `${onlyB + neither} students play Sport B`,
    `${onlyA} students play neither sport`,
  ], (k) => `${neither + 5 * k} students play neither sport`);
  return {
    itemType: 'MC',
    context: `The two-way table shows whether ${total} surveyed students play Sport A and/or Sport B. Which statement is true?`,
    question: table,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Read the "No Sport A" + "No Sport B" cell.', math: `${total} - ${onlyA} - ${onlyB} - ${both} = ${neither}` },
    ],
    hints: ['"Neither" is the cell where both answers are No.'],
    timeEstimate: 75,
  };
};

// ── SP.3 variant: predict a value from the linear model ────────────────
export const genModelPrediction: ProblemFactory = (rng) => {
  const m0 = choice(rng, [2, 3, 4, 5, 6]);
  const b = randInt(rng, 10, 90);
  const x0 = randInt(rng, 5, 20);
  const y = m0 * x0 + b;
  const m = mcUnique(rng, num(y), [
    num(m0 * (x0 + 1) + b),
    num(m0 * x0),
    num(y + m0),
  ], (k) => num(y + 2 * m0 * k));
  return {
    itemType: 'MC',
    context: `A linear model for a data set is y = ${m0}x + ${b}. According to the model, what is the predicted value of y when x = ${x0}?`,
    question: `y = ${m0}(${x0}) + ${b}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Substitute and evaluate.', math: `${m0}(${x0}) + ${b} = ${m0 * x0} + ${b} = ${y}` },
    ],
    hints: ['Substitute the x-value into the model.'],
    timeEstimate: 45,
  };
};

export const statisticsFactories: ProblemFactory[] = [
  genScatterAssociationId,
  genScatterBestModel,
  genSlopeMeaningModel,
  genInterceptMeaningModel,
  genTwoWayTable,
  genModelPrediction,
];
