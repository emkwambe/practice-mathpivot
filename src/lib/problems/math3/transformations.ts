// m3-functions-transformations: translations, inverses, piecewise evaluation,
// cubic behavior, quartic/graph identification, graph-reading arithmetic.
// Covers released items 4, 5, 16, 29, 30, 31, 32, 38 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt, randNonZero } from '../math1/rng';
import { frac, linExpr, mc, num } from '../math1/latex';
import { functionPlotSvg } from './svg';

// ── Q4-style: piecewise evaluation, gridded (F-IF.2) ────────────────────
export const genPiecewiseEvalGR: ProblemFactory = (rng) => {
  const a = randInt(rng, 2, 5);
  const b = randInt(rng, 1, 9);
  const c = randInt(rng, 2, 5); // breakpoint
  const K = randInt(rng, 6, 30);
  // f(x) = ax + b for x < c; K/x for x >= c
  const x1 = c; // uses K/x branch
  const x2 = -randInt(rng, 1, 6); // uses linear branch (x2 < 0 < c)
  const v1 = K / x1;
  const v2 = a * x2 + b;
  const total = v1 + v2;
  const ans = Number.isInteger(total) ? num(total) : frac(Math.round(total * 100), 100);
  return {
    itemType: 'GR',
    context: `A function is shown. What is the value of f(${x1}) + f(${x2})?`,
    question: `f(x) = \\begin{cases} ${linExpr(a, b)} & \\text{for } x < ${c} \\\\ \\frac{${K}}{x} & \\text{for } x \\geq ${c} \\end{cases}`,
    answer: ans,
    steps: [
      { number: 1, description: `${x1} ≥ ${c}, so use the second branch.`, math: `f(${x1}) = \\frac{${K}}{${x1}} = ${num(v1)}` },
      { number: 2, description: `${x2} < ${c}, so use the first branch. Then add.`, math: `f(${x2}) = ${linExpr(a, b).replace(/x/g, `(${x2})`)} = ${num(v2)} \\Rightarrow ${ans}` },
    ],
    hints: ['Check which branch each input belongs to before evaluating.'],
    timeEstimate: 75,
  };
};

// ── Q29-style: piecewise evaluation, MC (F-IF.2) ────────────────────────
export const genPiecewiseEvalMC: ProblemFactory = (rng) => {
  const c = randInt(rng, 1, 4);
  const a = choice(rng, [2, 3, 4]);
  const b = randInt(rng, 1, 8);
  const q = randInt(rng, 2, 5);
  const x = -randInt(rng, 2, 6); // negative input -> quadratic branch
  // f(x) = x^2 - q for x < c ; ax + b for x >= c
  const v = x * x - q;
  const correct = num(v);
  const m = mc(rng, correct, [
    num(a * x + b),
    num(x * x + q),
    num(-(x * x - q)),
    num(a * x - b),
  ]);
  return {
    itemType: 'MC',
    context: `A piecewise function is shown. What is the value of f(${x})?`,
    question: `f(x) = \\begin{cases} x^2 - ${q} & \\text{for } x < ${c} \\\\ ${linExpr(a, b)} & \\text{for } x \\geq ${c} \\end{cases}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `${x} < ${c}, so use the first branch.`, math: `f(${x}) = (${x})^2 - ${q} = ${correct}` },
    ],
    hints: ['The input decides which branch to use.'],
    timeEstimate: 60,
  };
};

// ── Q5-style: translate 1/x (F-BF.3) ────────────────────────────────────
export const genTranslateRecip: ProblemFactory = (rng) => {
  const h = randInt(rng, 1, 4); // left h
  const k = randInt(rng, 1, 4); // up k
  const correct = `g(x) = \\frac{1}{x + ${h}} + ${k}`;
  const m = mc(rng, correct, [
    `g(x) = \\frac{1}{x - ${h}} + ${k}`,
    `g(x) = \\frac{1}{x + ${h}} - ${k}`,
    `g(x) = \\frac{1}{x - ${h}} - ${k}`,
    `g(x) = \\frac{1}{x + ${k}} + ${h}`,
  ]);
  return {
    itemType: 'MC',
    context: `The function f(x) = 1/x was translated ${k} unit${k > 1 ? 's' : ''} up and ${h} unit${h > 1 ? 's' : ''} to the left, resulting in the function g. Which equation defines g?`,
    question: `f(x) = \\frac{1}{x}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Left ${h}: replace x with (x + ${h}). Up ${k}: add ${k} outside.`, math: correct },
    ],
    hints: ['Horizontal shifts change the input with the opposite sign; vertical shifts add outside.'],
    timeEstimate: 60,
  };
};

// ── Q31-style: translate |x| (F-BF.3) ───────────────────────────────────
export const genTranslateAbs: ProblemFactory = (rng) => {
  const h = randInt(rng, 1, 6); // right h
  const k = randInt(rng, 1, 6); // down k
  const correct = `y = |x - ${h}| - ${k}`;
  const m = mc(rng, correct, [
    `y = |x + ${h}| - ${k}`,
    `y = |x - ${h}| + ${k}`,
    `y = |x + ${h}| + ${k}`,
    `y = |x - ${k}| - ${h}`,
  ]);
  return {
    itemType: 'MC',
    context: `Which equation describes the graph that is produced by moving y = |x| to the right ${h} unit${h > 1 ? 's' : ''} and down ${k} unit${k > 1 ? 's' : ''}?`,
    question: 'y = |x|',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Right ${h} subtracts inside; down ${k} subtracts outside.`, math: correct },
    ],
    hints: ['Inside changes go opposite to the direction of the shift.'],
    timeEstimate: 45,
  };
};

// ── Q16-style: inverse of a linear function (F-BF.4.c) ──────────────────
export const genInverseLinear: ProblemFactory = (rng) => {
  const a = randInt(rng, 20, 400); // subtract a
  const b = choice(rng, [12, 15, 20, 25, 40, 50]); // divide by b
  const scenarios = choice(rng, [
    ['a person’s score on a standardized test', 'the person’s actual score', 'Z'],
    ['the temperature in degrees Celsius', 'the actual temperature', 'T'],
    ['the number of laps completed', 'the actual distance run', 'D'],
  ] as const);
  const correct = `${scenarios[2]}^{-1}(x) = ${b}x + ${a}`;
  const m = mc(rng, correct, [
    `${scenarios[2]}^{-1}(x) = ${b}x - ${a}`,
    `${scenarios[2]}^{-1}(x) = \\frac{x - ${b}}{${a}}`,
    `${scenarios[2]}^{-1}(x) = \\frac{x + ${b}}{${a}}`,
    `${scenarios[2]}^{-1}(x) = ${a}x + ${b}`,
  ]);
  return {
    itemType: 'MC',
    context: `A value can be given by ${scenarios[2]}(x) = (x - ${a})/${b}, where x is ${scenarios[1]}. Which function is the inverse?`,
    question: `${scenarios[2]}(x) = \\frac{x - ${a}}{${b}}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Swap x and y, then solve for y.', math: `x = \\frac{y - ${a}}{${b}} \\Rightarrow y = ${b}x + ${a}` },
    ],
    hints: ['To invert, undo the operations in reverse order: multiply first, then add.'],
    timeEstimate: 75,
  };
};

// ── Q30-style: cubic end behavior & extrema, MS->MC (F-IF.7) ────────────
export const genCubicBehavior: ProblemFactory = (rng) => {
  // critical points r1 < r2 with r1 + r2 even so p is an integer
  const r1 = randInt(rng, -5, 1);
  const step = choice(rng, [2, 4]);
  const r2 = r1 + step;
  // f'(x) = 3(x - r1)(x - r2) = 3x^2 - 3(r1+r2)x + 3 r1 r2
  const p = (-3 * (r1 + r2)) / 2;
  const q = 3 * r1 * r2;
  const r = randInt(rng, -20, 20);
  if (p === 0 || q === 0) return genCubicBehavior(rng, 'medium');
  const fmax = r1 ** 3 + p * r1 * r1 + q * r1 + r;
  const fTex = `f(x) = x^3 ${p >= 0 ? '+' : '-'} ${Math.abs(p)}x^2 ${q >= 0 ? '+' : '-'} ${Math.abs(q)}x ${r >= 0 ? '+' : '-'} ${Math.abs(r)}`;
  const trueStatements = [
    `As x → −∞, y → −∞`,
    `The function has a relative maximum at about (${r1}, ${num(Math.round(fmax * 100) / 100)})`,
  ];
  const falseStatements = [
    `As x → −∞, y → ∞`,
    `As x → ∞, y → −∞`,
    `The function has a relative maximum at about (${r2}, ${num(Math.round((r2 ** 3 + p * r2 * r2 + q * r2 + r) * 100) / 100)})`,
    `The function is decreasing where x < ${r1}`,
    `The function is increasing where ${r1} < x < ${r2}`,
  ];
  const correct = choice(rng, trueStatements);
  const m = mc(rng, correct, falseStatements);
  return {
    itemType: 'MC',
    context: 'A function is shown. Which statement about the function is true?',
    question: fTex,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Positive leading coefficient and odd degree: falls left, rises right.', math: `x \\to -\\infty \\Rightarrow y \\to -\\infty` },
      { number: 2, description: `f'(x) = 0 at x = ${r1} and x = ${r2}; the relative maximum is at the smaller critical point.`, math: `f(${r1}) = ${num(Math.round(fmax * 100) / 100)}` },
    ],
    hints: ['Check end behavior from the leading term, and extrema from the derivative.'],
    timeEstimate: 90,
  };
};

// ── Q32-style: identify the quartic from its graph (F-BF.1.a) — VISUAL ──
export const genQuarticGraphId: ProblemFactory = (rng) => {
  // f(x) = x(x - u)(x - v)(x - w) with three small nonzero roots
  const roots = [randNonZero(rng, -3, 3), randNonZero(rng, -3, 3), randNonZero(rng, -3, 3)];
  if (new Set(roots).size !== 3) return genQuarticGraphId(rng, 'medium');
  const [u, v, w] = roots;
  // expand x(x-u)(x-v)(x-w)
  const e1 = u + v + w;
  const e2 = u * v + u * w + v * w;
  const e3 = u * v * w;
  if (e1 === 0 || e2 === 0) return genQuarticGraphId(rng, 'medium');
  // f = x^4 - e1 x^3 + e2 x^2 - e3 x
  const f = (x: number) => x ** 4 - e1 * x ** 3 + e2 * x * x - e3 * x;
  const fmt = (a1: number, a2: number, a3: number) =>
    `f(x) = x^4 ${-a1 >= 0 ? '+' : '-'} ${Math.abs(a1) === 1 ? '' : Math.abs(a1)}x^3 ${a2 >= 0 ? '+' : '-'} ${Math.abs(a2) === 1 ? '' : Math.abs(a2)}x^2 ${-a3 >= 0 ? '+' : '-'} ${Math.abs(a3) === 1 ? '' : Math.abs(a3)}x`;
  const correct = fmt(e1, e2, e3);
  const m = mc(rng, correct, [
    fmt(-e1 === 0 ? e1 + 2 : -e1, e2, e3),
    fmt(e1, e2, -e3 === 0 ? e3 + 3 : -e3),
    fmt(e1 + 2, e2 - 3, e3),
    fmt(-e1 === 0 ? e1 - 2 : -e1, e2, -e3 === 0 ? e3 - 3 : -e3),
  ]);
  // plot window: x in [min-1, max+1], y range from samples
  const xs: number[] = [];
  for (let i = 0; i <= 200; i++) xs.push(-4 + (8 * i) / 200);
  const ys = xs.map(f).filter((y) => isFinite(y));
  const yLo = Math.min(...ys);
  const yHi = Math.max(...ys.filter((y) => y < yLo + 200));
  const svg = functionPlotSvg(f, {
    xMin: -4,
    xMax: 4,
    yMin: Math.floor(yLo) - 1,
    yMax: Math.min(Math.ceil(yHi) + 1, 80),
  });
  return {
    itemType: 'MC',
    context: 'A graph is shown. Which function is graphed?',
    question: '\\text{quartic with four real zeros}',
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `The x-intercepts are 0, ${u}, ${v}, and ${w} — match them to the factors.`, math: `f(x) = x(x ${u >= 0 ? '-' : '+'} ${Math.abs(u)})(x ${v >= 0 ? '-' : '+'} ${Math.abs(v)})(x ${w >= 0 ? '-' : '+'} ${Math.abs(w)})` },
      { number: 2, description: 'Expand to compare with the choices.', math: correct },
    ],
    hints: ['Read the x-intercepts off the graph and rebuild the function from its factors.'],
    timeEstimate: 105,
  };
};

// ── Q38-style: read a piecewise-linear graph, gridded (F-IF.2) — VISUAL ─
export const genGraphArithmetic: ProblemFactory = (rng) => {
  const xMin = -4;
  const xMax = 6;
  // random walk of integer y-values
  const ys: number[] = [];
  let y = randInt(rng, -3, 3);
  for (let x = xMin; x <= xMax; x++) {
    ys.push(y);
    y = Math.max(-4, Math.min(5, y + randInt(rng, -2, 2)));
  }
  const f = (xx: number) => {
    const i = Math.floor(xx - xMin);
    const t = xx - (xMin + i);
    const y0 = ys[Math.max(0, Math.min(i, ys.length - 1))];
    const y1 = ys[Math.max(0, Math.min(i + 1, ys.length - 1))];
    return y0 + t * (y1 - y0);
  };
  const at = (x: number) => ys[x - xMin];
  const a = randInt(rng, xMin, 1);
  const b = randInt(rng, xMin + 1, 2);
  const c = randInt(rng, 3, xMax);
  const coefB = choice(rng, [2, 3]);
  const value = at(a) + coefB * at(b) - at(c);
  const svg = functionPlotSvg(f, {
    xMin: xMin - 0.5,
    xMax: xMax + 0.5,
    yMin: -5,
    yMax: 6,
    dots: ys.map((yy, i) => ({ x: xMin + i, y: yy })),
  });
  return {
    itemType: 'GR',
    context: `This shows the graph of f(x). What is the value of f(${a}) + ${coefB}f(${b}) - f(${c})?`,
    question: `f(${a}) + ${coefB}f(${b}) - f(${c}) = \\ ?`,
    stemSvg: svg,
    answer: num(value),
    steps: [
      { number: 1, description: 'Read each value off the graph.', math: `f(${a}) = ${at(a)},\\quad f(${b}) = ${at(b)},\\quad f(${c}) = ${at(c)}` },
      { number: 2, description: 'Substitute.', math: `${at(a)} + ${coefB}(${at(b)}) - (${at(c)}) = ${num(value)}` },
    ],
    hints: ['Find each x on the horizontal axis and read up to the graph.'],
    timeEstimate: 90,
  };
};

export const transformationFactories: ProblemFactory[] = [
  genPiecewiseEvalGR,
  genPiecewiseEvalMC,
  genTranslateRecip,
  genTranslateAbs,
  genInverseLinear,
  genCubicBehavior,
  genQuarticGraphId,
  genGraphArithmetic,
];
