// g8-functions: linear vs nonlinear, function identification, slope/y-intercept
// from tables, comparing function properties, qualitative graphs.
// Covers released items 2, 4, 9, 12, 15, 18, 21, 23, 27, 29, 31, 34, 40, 45 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt, randNonZero, shuffle } from '../math1/rng';
import { gcd } from '../math1/rng';
import { linExpr, mc, money, num, varTerm } from '../math1/latex';
import { paramPlotSvg, qualitativeGraphSvg } from './svg';

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

function tableLatex(rows: [string, string][], h1 = 'x', h2 = 'y'): string {
  const body = rows.map(([a, b]) => `${a} & ${b}`).join(' \\\\ ');
  return `\\begin{array}{c|c} ${h1} & ${h2} \\\\ \\hline ${body} \\end{array}`;
}

// ── Q2/Q34-style MC: which equation is linear ───────────────────────────
export const genLinearEquationId: ProblemFactory = (rng) => {
  const a = randInt(rng, 2, 9);
  const b = randNonZero(rng, -9, 9);
  const correct = `y = ${linExpr(a, b)}`;
  const variant = choice(rng, [1, 2] as const);
  const distractors =
    variant === 1
      ? [`y = ${varTerm(a, 'x^2')}`, `y = \\frac{${a}}{x}`, `y = ${a}^x`]
      : [`y = ${varTerm(a, 'x^3')}`, `y = ${a}x^{\\!-1}`, `y = \\sqrt{${a}x}`];
  const m = mcUnique(rng, correct, distractors, (k) => `y = ${a}^x + ${k}`);
  return {
    itemType: 'MC',
    context: 'Which equation represents a linear function?',
    question: 'y = mx + b',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'A linear function has the form y = mx + b — x to the first power only.', math: correct },
    ],
    hints: ['Linear means no exponents on x, no x in a denominator, no x inside a root.'],
    timeEstimate: 45,
  };
};

// ── Q4-style MC + VIS choices: which graph is NOT a function ────────────
export const genNotFunctionGraph: ProblemFactory = (rng) => {
  const correctIdx = randInt(rng, 0, 3);
  const a = randInt(rng, 1, 3);
  const b = randInt(rng, -2, 2);
  const r = choice(rng, [2.5, 3, 3.5]);
  const funcs: (() => string)[] = [
    () => paramPlotSvg((t) => t, (t) => a * t + b, -4, 4),                    // line
    () => paramPlotSvg((t) => t, (t) => (t * t) / 3 - 3, -4, 4),              // parabola
    () => paramPlotSvg((t) => t, (t) => (t * t * t) / 8, -3, 3),              // cubic
    () => paramPlotSvg((t) => t, (t) => Math.abs(t) - 2, -4, 4),              // abs V
  ];
  const nonFuncs: (() => string)[] = [
    () => paramPlotSvg((t) => r * Math.cos(t), (t) => r * Math.sin(t), 0, 2 * Math.PI), // circle
    () => paramPlotSvg((t) => (t * t) / 2 - 2, (t) => t, -4, 4),                        // sideways parabola
    () => paramPlotSvg((t) => t * t * t - 3 * t, (t) => t, -2.2, 2.2),                  // sideways cubic
  ];
  const fnPick = shuffle(rng, [0, 1, 2, 3]).slice(0, 3);
  const nfPick = choice(rng, [0, 1, 2]);
  const svgs: string[] = [];
  let fi = 0;
  for (let i = 0; i < 4; i++) svgs.push(i === correctIdx ? nonFuncs[nfPick]() : funcs[fnPick[fi++]]());
  const letters = ['A', 'B', 'C', 'D'];
  return {
    itemType: 'MC',
    context: 'Which graph does NOT represent y as a function of x?',
    question: '\\text{vertical line test}',
    answer: letters[correctIdx],
    choices: letters,
    svgChoices: svgs,
    steps: [
      { number: 1, description: 'A graph is a function only if every vertical line crosses it at most once.', math: `\\text{graph } ${letters[correctIdx]} \\text{ fails the vertical line test}` },
    ],
    hints: ['Picture a vertical line sweeping left to right — if it ever hits the graph twice, it is not a function.'],
    timeEstimate: 60,
  };
};

// ── Q9-style MC: which set of ordered pairs is a function ───────────────
export const genFunctionPointsId: ProblemFactory = (rng) => {
  const mkFn = (): string => {
    const xs = shuffle(rng, [1, 2, 3, 4]).slice(0, 3);
    const ys = shuffle(rng, [2, 4, 5, 7, 8]).slice(0, 3);
    return `\\{${xs.map((x, i) => `(${x}, ${ys[i]})`).join(', ')}\\}`;
  };
  const dup = randInt(rng, 1, 4);
  const badSets = [
    `\\{(${dup}, 2), (${dup}, 5), (6, 7)\\}`,
    `\\{(${dup}, 3), (${dup + 1}, 4), (${dup}, 6)\\}`,
    `\\{(${dup}, 1), (${dup}, 2), (${dup}, 3)\\}`,
  ];
  const correct = mkFn();
  const m = mcUnique(rng, correct, badSets, () => mkFn());
  return {
    itemType: 'MC',
    context: 'Which set of ordered pairs represents y as a function of x?',
    question: '\\text{function?}',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'A function never repeats an x-value with a different y-value.', math: '\\text{each x appears exactly once}' },
    ],
    hints: ['Scan the x-values — a repeated x with different y values is not a function.'],
    timeEstimate: 45,
  };
};

// ── Q29-style MC: which table is a function (LaTeX table choices) ───────
export const genFunctionTableId: ProblemFactory = (rng) => {
  const mkGood = (): string => {
    const m0 = randInt(rng, 2, 5);
    const b0 = randInt(rng, -4, 6);
    const xs = shuffle(rng, [0, 1, 2, 3, 4]).slice(0, 4);
    return tableLatex(xs.map((x) => [String(x), String(m0 * x + b0)] as [string, string]));
  };
  const dup = randInt(rng, 1, 3);
  const bads = [
    tableLatex([[String(dup), '2'], [String(dup), '5'], ['4', '6'], ['5', '7']]),
    tableLatex([['1', '3'], [String(dup), '4'], [String(dup), '8'], ['6', '9']]),
    tableLatex([[String(dup), '1'], [String(dup), '2'], [String(dup), '3'], ['7', '4']]),
  ];
  const correct = mkGood();
  const m = mcUnique(rng, correct, bads, () => mkGood());
  return {
    itemType: 'MC',
    context: 'Which table represents y as a function of x?',
    question: '\\text{function table?}',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'In a function table each x-value appears only once.', math: '\\text{no repeated x-values}' },
    ],
    hints: ['Look down the x column for repeats.'],
    timeEstimate: 45,
  };
};

// ── Q12-style GR: slope from a table ────────────────────────────────────
export const genSlopeFromTable: ProblemFactory = (rng) => {
  const m0 = choice(rng, [1.5, 2, 2.5, 3, 3.5, 4]);
  const b0 = randInt(rng, -8, 10);
  const xs = choice(rng, [[2, 6, 8], [1, 3, 7], [2, 4, 10]] as const);
  const rows = xs.map((x) => [String(x), num(m0 * x + b0)] as [string, string]);
  return {
    itemType: 'GR',
    context: 'The table shows a linear relationship between x and y. What is the slope of the line?',
    question: tableLatex(rows),
    answer: num(m0),
    steps: [
      { number: 1, description: 'Pick two rows and compute rise over run.', math: `m = \\frac{${num(m0 * xs[1] + b0)} - ${num(m0 * xs[0] + b0)}}{${xs[1]} - ${xs[0]}} = ${num(m0)}` },
    ],
    hints: ['Slope = change in y ÷ change in x between any two rows.'],
    timeEstimate: 60,
  };
};

// ── Q15-style GR: y-intercept from a table (negative slope) ─────────────
export const genYInterceptFromTable: ProblemFactory = (rng) => {
  const m0 = -choice(rng, [1, 2, 3, 4]);
  const b0 = randInt(rng, 8, 26);
  const xs = shuffle(rng, [3, 5, 7, 9, 11]).slice(0, 3).sort((p, q) => p - q);
  const rows = xs.map((x) => [String(x), num(m0 * x + b0)] as [string, string]);
  return {
    itemType: 'GR',
    context: 'The table shows a linear relationship. What is the y-intercept of the line?',
    question: tableLatex(rows),
    answer: num(b0),
    steps: [
      { number: 1, description: 'Slope from two rows.', math: `m = ${m0}` },
      { number: 2, description: 'Back-substitute one point into y = mx + b.', math: `${num(m0 * xs[0] + b0)} = ${m0}(${xs[0]}) + b \\Rightarrow b = ${b0}` },
    ],
    hints: ['Find the slope first, then solve for b with one row.'],
    timeEstimate: 75,
  };
};

// ── Q18-style GR: per-unit rate + fixed fee from a cost table ───────────
export const genFeeFromTable: ProblemFactory = (rng) => {
  const per = choice(rng, [15, 20, 25, 27, 30]);
  const fee = choice(rng, [5, 8, 10, 12]);
  const xs = [3, 5, 6];
  const rows = xs.map((x) => [String(x), String(per * x + fee)] as [string, string]);
  return {
    itemType: 'GR',
    context: `A website charges per ticket plus one fixed processing fee per order. The table shows the total cost for orders of different sizes. What is the processing fee, in dollars?`,
    question: tableLatex(rows, '\\text{tickets}', '\\text{cost (\\$)}'),
    answer: num(fee),
    steps: [
      { number: 1, description: 'Per-ticket rate from two rows.', math: `(${per * 5 + fee} - ${per * 3 + fee}) \\div 2 = ${per}` },
      { number: 2, description: 'Fee = total − tickets × rate.', math: `${per * 3 + fee} - 3(${per}) = ${fee}` },
    ],
    hints: ['The fee is the y-intercept — the cost when 0 tickets are ordered.'],
    timeEstimate: 90,
  };
};

// ── Q21-style MC: which table has a greater slope than a given function ─
export const genCompareSlopes: ProblemFactory = (rng) => {
  const m0 = randInt(rng, 2, 6);
  const mk = (slope: number, b0: number): string =>
    tableLatex([[1, num(slope + b0)], [3, num(3 * slope + b0)], [5, num(5 * slope + b0)]].map((r) => [String(r[0]), String(r[1])] as [string, string]));
  const correct = mk(m0 + choice(rng, [1, 2]), randInt(rng, -3, 6));
  const m = mcUnique(rng, correct, [mk(m0 - 1, 4), mk(m0, 0), mk(Math.max(m0 - 2, 1), 6)], () => mk(m0 - 1, randInt(rng, 7, 12)));
  return {
    itemType: 'MC',
    context: `Which table represents a function with a slope greater than the slope of y = ${linExpr(m0, 2)}?`,
    question: `m > ${m0}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Compute each table slope: Δy ÷ Δx (Δx = 2 in every table).', math: `\\text{correct table slope} = ${m0 + 1} \\text{ or more}` },
    ],
    hints: ['Δx is 2 in each table — divide each Δy by 2.'],
    timeEstimate: 90,
  };
};

// ── Q23-style MC: lower unit cost than y = kx ───────────────────────────
export const genCompareUnitCost: ProblemFactory = (rng) => {
  const k = choice(rng, [8.5, 10, 12.5, 15]);
  const lower = k - choice(rng, [1, 1.5, 2, 2.5]);
  const mk = (rate: number, tag: number): string =>
    tableLatex([2, 4, 6].map((q) => [String(q), money(q * rate + tag * 0)] as [string, string]), '\\text{items}', '\\text{cost (\\$)}');
  const correct = mk(lower, 0);
  const m = mcUnique(rng, correct, [mk(k, 0), mk(k + 1.5, 0), mk(k + 3, 0)], () => mk(k + randInt(rng, 4, 6), 0));
  return {
    itemType: 'MC',
    context: `An online store charges y = ${num(k)}x dollars for x items with free shipping. Which table shows a store with a LOWER cost per item?`,
    question: `\\text{unit cost} < ${num(k)}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Divide cost by items in any row of each table.', math: `${money(2 * lower)} \\div 2 = \\$${money(lower)} < \\$${money(k)}` },
    ],
    hints: ['Unit cost = total ÷ items.'],
    timeEstimate: 75,
  };
};

// ── Q31-style MC: slope twice the table's slope ─────────────────────────
export const genDoubleSlope: ProblemFactory = (rng) => {
  const m0 = randInt(rng, 2, 4);
  const b0 = randNonZero(rng, -6, 6);
  const rows = [[1, m0 + b0], [3, 3 * m0 + b0], [5, 5 * m0 + b0]].map((r) => [String(r[0]), num(r[1])] as [string, string]);
  const target = 2 * m0;
  const correct = `y = ${linExpr(target, b0)}`;
  const m = mcUnique(rng, correct, [
    `y = ${linExpr(m0, b0)}`,
    `y = ${linExpr(target + 1, b0)}`,
    `y = ${linExpr(target, b0 + 2)}`,
  ], (k) => `y = ${linExpr(target, b0 + 2 * k)}`);
  return {
    itemType: 'MC',
    context: 'Which function has a slope that is twice the slope of the function shown in the table?',
    question: tableLatex(rows),
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Table slope.', math: `m = ${m0}` },
      { number: 2, description: 'Double it.', math: `2m = ${target} \\Rightarrow ${correct}` },
    ],
    hints: ['Only the coefficient of x doubles.'],
    timeEstimate: 60,
  };
};

// ── Q40-style MC: which table has y-intercept b ─────────────────────────
export const genCompareYIntercept: ProblemFactory = (rng) => {
  const b0 = randNonZero(rng, -6, 6);
  const mk = (slope: number, b: number): string =>
    tableLatex([1, 2, 3].map((x) => [String(x), num(slope * x + b)] as [string, string]));
  const correct = mk(randInt(rng, 2, 5), b0);
  const m = mcUnique(rng, correct, [mk(2, b0 + 2), mk(3, b0 - 3), mk(4, 0)], (k) => mk(2, b0 + 2 * k + 2));
  return {
    itemType: 'MC',
    context: `Which table represents a linear function with a y-intercept of ${b0}?`,
    question: `b = ${b0}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Extend each table back to x = 0 (subtract the slope).', math: `b = y - mx` },
    ],
    hints: ['y-intercept = y-value when x = 0.'],
    timeEstimate: 75,
  };
};

// ── Q45-style MC: same rate of change as line through two points ────────
export const genSameRateFromPoints: ProblemFactory = (rng) => {
  const dx = choice(rng, [2, 4, 5]);
  const dy = choice(rng, [2, 3, 4, 6]);
  const x1 = randInt(rng, -2, 3);
  const y1 = randInt(rng, -3, 4);
  const x2 = x1 + dx;
  const y2 = y1 + dy;
  // reduced slope
  const gg = gcd(dy, dx);
  const rn = dy / gg;
  const rd = dx / gg;
  const slopeTex = rn === rd ? 'x' : rd === 1 ? `${rn}x` : `\\frac{${rn}}{${rd}}x`;
  const recipTex = rn === rd ? 'x' : rn === 1 ? `${rd}x` : `\\frac{${rd}}{${rn}}x`;
  const eq = (b: number) => (b === 0 ? `y = ${slopeTex}` : b > 0 ? `y = ${slopeTex} + ${b}` : `y = ${slopeTex} - ${-b}`);
  const b0 = randInt(rng, -3, 5);
  const correct = eq(b0);
  const m = mcUnique(rng, correct, [
    `y = ${recipTex} + ${b0}`,
    eq(y1),
    eq(-b0 === 0 ? 2 : -b0),
  ], (k) => eq(b0 + 2 * k));
  return {
    itemType: 'MC',
    context: `Which function has the same rate of change as the line passing through (${x1}, ${y1}) and (${x2}, ${y2})?`,
    question: `m = \\frac{${y2} - ${y1}}{${x2} - ${x1}}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Rate of change between the points.', math: `m = \\frac{${dy}}{${dx}} = ${rd === 1 ? String(rn) : `\\frac{${rn}}{${rd}}`}` },
      { number: 2, description: 'Match the coefficient of x.', math: correct },
    ],
    hints: ['Rate of change is just the slope.'],
    timeEstimate: 60,
  };
};

// ── Q27-style MC + VIS choices: which graph matches the story ───────────
export const genQualitativeGraph: ProblemFactory = (rng) => {
  const ctx = choice(rng, [
    { who: 'A cyclist', fast: 'rides quickly', flat: 'stops to rest', slow: 'rides slowly' },
    { who: 'A hiker', fast: 'climbs steeply', flat: 'stops for water', slow: 'walks gently' },
  ] as const);
  const correctIdx = randInt(rng, 0, 3);
  // correct: fast rise, flat, slow rise
  const good: [number, number][] = [[0, 0], [1.5, 3], [3, 3], [6, 5]];
  const variants: [number, number][][] = [
    [[0, 0], [3, 1], [4, 1], [6, 5]],       // slow, flat, fast
    [[0, 0], [1.5, 3], [3, 5.4], [6, 5.4]], // fast, slow, flat
    [[0, 0], [2, 2], [2, 4], [6, 5]],       // vertical jump (impossible)
  ];
  const svgs: string[] = [];
  let vi = 0;
  for (let i = 0; i < 4; i++) svgs.push(qualitativeGraphSvg(i === correctIdx ? good : variants[vi++]));
  const letters = ['A', 'B', 'C', 'D'];
  return {
    itemType: 'MC',
    context: `${ctx.who} ${ctx.fast}, then ${ctx.flat}, then ${ctx.slow} until the end of the trip. Which graph best represents distance from home over time?`,
    question: '\\text{distance vs time}',
    answer: letters[correctIdx],
    choices: letters,
    svgChoices: svgs,
    steps: [
      { number: 1, description: 'Fast riding = steep segment; resting = flat segment; slow riding = gentle segment, in that order.', math: `\\text{graph } ${letters[correctIdx]}` },
    ],
    hints: ['A stop means distance stays constant — a horizontal segment in the middle.'],
    timeEstimate: 60,
  };
};

// ── Q10/F.4-style MC: meaning of the slope in a context model ───────────
export const genSlopeMeaningContext: ProblemFactory = (rng) => {
  const start = choice(rng, [1200, 1500, 2000, 2400]);
  const rate = choice(rng, [25, 30, 40, 50]);
  const thing = choice(rng, [
    { noun: 'a savings account balance', verb: 'is withdrawn', unit: 'dollars per week' },
    { noun: 'the water in a tank', verb: 'drains out', unit: 'gallons per hour' },
  ] as const);
  const correct = `${thing.noun.replace(/^./, (c) => c.toUpperCase())} decreases by ${rate} ${thing.unit}`;
  const m = mcUnique(rng, correct, [
    `${thing.noun.replace(/^./, (c) => c.toUpperCase())} increases by ${rate} ${thing.unit}`,
    `The starting amount is ${rate} dollars`,
    `The amount reaches zero after ${rate} weeks`,
  ], (k) => `The amount decreases by ${rate + 10 * k} ${thing.unit}`);
  return {
    itemType: 'MC',
    context: `The equation y = ${start} − ${rate}x models ${thing.noun} (in dollars/gallons) after x time units. What does the slope represent?`,
    question: `y = ${start} - ${rate}x`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'The slope is the rate of change: negative means decreasing.', math: `m = -${rate}` },
    ],
    hints: ['Slope = how much y changes per 1 unit of x; the sign tells the direction.'],
    timeEstimate: 60,
  };
};

export const functionFactories: ProblemFactory[] = [
  genLinearEquationId,
  genNotFunctionGraph,
  genFunctionPointsId,
  genFunctionTableId,
  genSlopeFromTable,
  genYInterceptFromTable,
  genFeeFromTable,
  genCompareSlopes,
  genCompareUnitCost,
  genDoubleSlope,
  genCompareYIntercept,
  genSameRateFromPoints,
  genQualitativeGraph,
  genSlopeMeaningContext,
];
