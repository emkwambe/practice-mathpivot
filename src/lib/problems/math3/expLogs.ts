// m3-exponential-logs: solving exponential equations with logs, interpreting
// exponential models, growth-base conversion, rate comparison, graph ID.
// Covers released items 8, 10, 14, 24, 33, 37, 41 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt } from '../math1/rng';
import { mc, num } from '../math1/latex';
import { functionPlotSvg } from './svg';

// ── Q8-style: solve A = B^(x - c), 4-decimal MC (F-LE.4) ────────────────
export const genExpSolveMC: ProblemFactory = (rng) => {
  const B = choice(rng, [2, 3, 4, 5, 6, 8, 10, 12, 16, 64]);
  let A = randInt(rng, 2, 15);
  if (A === B) A = A + 1;
  const c = choice(rng, [0, 1, 2]);
  const x = c + Math.log(A) / Math.log(B);
  const fmt = (v: number) => v.toFixed(4);
  const correct = fmt(x);
  const L = Math.log(A) / Math.log(B);
  const m = mc(rng, correct, [
    fmt(c - L),
    fmt(L === x ? L + 1 : L),
    fmt(x + 0.2),
    fmt(Math.log(B) / Math.log(A) + c),
  ]);
  const sub = c === 0 ? 'x' : `x - ${c}`;
  return {
    itemType: 'MC',
    context: `An equation is shown. To the nearest ten-thousandth, what is the value of x?`,
    question: `${A} = ${B}^{${sub}}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Take the logarithm of both sides.', math: `\\log ${A} = (${sub}) \\log ${B}` },
      { number: 2, description: 'Isolate x and evaluate.', math: `x = ${c === 0 ? '' : `${c} + `}\\frac{\\log ${A}}{\\log ${B}} \\approx ${correct}` },
    ],
    hints: ['Use logarithms: x = log(A) / log(B)' + (c ? ` + ${c}` : '') + '.'],
    timeEstimate: 90,
  };
};

// ── Q14/Q33-style: solve a^(bx + c) = d, 2-decimal GR (F-LE.4) ──────────
export const genExpSolveGR: ProblemFactory = (rng) => {
  const a = choice(rng, [2, 3, 5, 6, 7, 10]);
  const b = choice(rng, [1, 2]);
  const c = randInt(rng, 1, 5) * (rng() < 0.5 ? -1 : 1);
  const d = randInt(rng, 7, 60);
  const x = (Math.log(d) / Math.log(a) - c) / b;
  const ans = (Math.round(x * 100) / 100).toFixed(2);
  const bx = b === 1 ? 'x' : `${b}x`;
  const exp = c >= 0 ? `${bx} + ${c}` : `${bx} - ${-c}`;
  return {
    itemType: 'GR',
    context: 'An equation is shown. What is the value, to the nearest hundredth, of x?',
    question: `${a}^{${exp}} = ${d}`,
    answer: ans,
    steps: [
      { number: 1, description: 'Take log of both sides.', math: `${exp} = \\frac{\\log ${d}}{\\log ${a}}` },
      { number: 2, description: 'Isolate x and round.', math: `x \\approx ${ans}` },
    ],
    hints: [`x = (log ${d} / log ${a} ${c >= 0 ? '-' : '+'} ${Math.abs(c)}) / ${b}`],
    timeEstimate: 90,
  };
};

// ── Q24-style: interpret A(1 + r)^t (A-SSE.1.a) ─────────────────────────
export const genInterpretExp: ProblemFactory = (rng) => {
  const A = choice(rng, [75, 120, 250, 400, 800, 1500]);
  const rPct = choice(rng, [1.5, 2.5, 3.2, 4.5, 0.8]);
  const base = (1 + rPct / 100).toFixed(4).replace(/0+$/, '');
  const correct = `The initial value of the investment is $${A}.`;
  const m = mc(rng, correct, [
    `The initial value of the investment is $${Math.round(A * rPct / 100)}.`,
    `The interest rate on the investment is ${num(rPct * 10)}%.`,
    `The interest rate on the investment is ${A}%.`,
    `The initial value of the investment is $${A * 10}.`,
  ]);
  return {
    itemType: 'MC',
    context: `The expression ${A}(${base})^t can be used to determine the value of an investment after t years. The interest on the investment is being compounded yearly. Which statement is true?`,
    question: `V(t) = ${A}(${base})^t`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'In A(1 + r)^t, A is the initial value and r is the rate per period.', math: `A = ${A},\\quad r = ${num(rPct)}\\%` },
    ],
    hints: ['Match each part of A(1 + r)^t to its meaning.'],
    timeEstimate: 60,
  };
};

// ── Q41-style: yearly multiplier -> weekly growth base (A-SSE.3) ────────
export const genWeeklyBase: ProblemFactory = (rng) => {
  const k = choice(rng, [2, 3, 4]);
  const baseW = Math.pow(k, 1 / 52).toFixed(4);
  const baseM = Math.pow(k, 1 / 12).toFixed(4);
  const word = k === 2 ? 'doubles' : k === 3 ? 'triples' : 'quadruples';
  const correct = `p \\cdot ${baseW}^w`;
  const m = mc(rng, correct, [
    `p \\cdot ${baseM}^w`,
    `${k}p \\cdot ${baseW}^w`,
    `p \\cdot ${k}^w`,
    `${k}p \\cdot ${baseM}^w`,
  ]);
  return {
    itemType: 'MC',
    context: `A population, p, ${word} in number every year. Which expression best represents the population after w weeks? (Note: There are 52 weeks in a year.)`,
    question: `\\text{weekly base} = ${k}^{1/52}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `After w weeks, the elapsed time is w/52 years.`, math: `P(w) = p \\cdot ${k}^{w/52}` },
      { number: 2, description: 'Rewrite with a single exponent on w.', math: `p \\cdot \\left(${k}^{1/52}\\right)^w = ${correct}` },
    ],
    hints: ['Convert weeks to years first: w weeks = w/52 years.'],
    timeEstimate: 105,
  };
};

// ── Q37-style: greatest average rate of change (F-LE.3) ─────────────────
export const genRateCompare: ProblemFactory = (rng) => {
  const a = randInt(rng, 6, 9);
  const b = a + randInt(rng, 3, 5);
  const funcs: { name: string; tex: string; f: (x: number) => number }[] = [
    { name: 'g', tex: `g(x) = ${randInt(rng, 3, 6)}x + ${randInt(rng, 2, 15)}`, f: null as unknown as (x: number) => number },
    { name: 'm', tex: '', f: null as unknown as (x: number) => number },
    { name: 'r', tex: '', f: null as unknown as (x: number) => number },
    { name: 't', tex: '', f: null as unknown as (x: number) => number },
  ];
  // build concrete functions
  const lM = randInt(rng, 3, 6);
  const lB = randInt(rng, 2, 15);
  const qA = 1;
  const qB = randInt(rng, 2, 8);
  const qC = randInt(rng, 1, 9);
  const cA = randInt(rng, 2, 4);
  const cB = randInt(rng, 10, 20);
  const cC = randInt(rng, 1, 9);
  const eB = choice(rng, [2, 3]);
  funcs[0] = { name: 'g', tex: `g(x) = ${lM}x + ${lB}`, f: (x) => lM * x + lB };
  funcs[1] = { name: 'm', tex: `m(x) = x^2 + ${qB}x + ${qC}`, f: (x) => qA * x * x + qB * x + qC };
  funcs[2] = { name: 'r', tex: `r(x) = ${cA}x^3 + ${cB}x - ${cC}`, f: (x) => cA * x ** 3 + cB * x - cC };
  funcs[3] = { name: 't', tex: `t(x) = ${eB}^x`, f: (x) => Math.pow(eB, x) };
  const arcs = funcs.map((fn) => (fn.f(b) - fn.f(a)) / (b - a));
  const winnerIdx = arcs.indexOf(Math.max(...arcs));
  const correct = funcs[winnerIdx].tex;
  const m = mc(rng, correct, funcs.filter((_, i) => i !== winnerIdx).map((fn) => fn.tex));
  return {
    itemType: 'MC',
    context: `Which function has the greatest rate of change over the interval ${a} ≤ x ≤ ${b}?`,
    question: `\\text{average rate} = \\frac{f(${b}) - f(${a})}{${b} - ${a}}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Compute (f(b) - f(a))/(b - a) for each function.', math: funcs.map((fn, i) => `${fn.name}: ${num(Math.round(arcs[i] * 10) / 10)}`).join('\\quad ') },
      { number: 2, description: 'The largest value wins.', math: correct },
    ],
    hints: ['Over a long enough interval, exponential growth outpaces any polynomial.'],
    timeEstimate: 105,
  };
};

// ── Q10-style: identify the exponential graph (F-BF.1.a) — VISUAL ───────
export const genExpGraphId: ProblemFactory = (rng) => {
  const A = choice(rng, [1, 2, 3, 5, 10, 25]);
  const decay = rng() < 0.6;
  const b = decay ? choice(rng, [0.5, 0.25, 0.75]) : choice(rng, [1.5, 2, 3]);
  const f = (x: number) => A * Math.pow(b, x);
  const yMax = Math.max(A * 1.4, Math.min(f(-3) * 1.2, f(3) * 1.2, 60));
  const svg = functionPlotSvg(f, { xMin: -3, xMax: 3, yMin: -1, yMax });
  const bTex = b >= 1 ? num(b) : num(b);
  const correct = `f(x) = ${A === 1 ? '' : A}(${bTex})^x`;
  const m = mc(rng, correct, [
    `f(x) = ${A === 1 ? '' : A}(${num(1 / b)})^x`,
    `f(x) = ${A * 2}(${bTex})^x`,
    `f(x) = ${A === 1 ? '' : A}(${num(b)})^x + ${A}`,
    `f(x) = ${A === 1 ? '' : A}x^2`,
  ]);
  return {
    itemType: 'MC',
    context: 'The graph of a function is shown. Which function is shown in the graph?',
    question: decay ? '\\text{exponential decay}' : '\\text{exponential growth}',
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `The y-intercept is (0, ${A}), so the leading factor is ${A}.`, math: `f(0) = ${A}` },
      { number: 2, description: decay ? 'The curve decreases, so the base is between 0 and 1.' : 'The curve increases rapidly, so the base is greater than 1.', math: `b = ${bTex}` },
    ],
    hints: ['Check the y-intercept and whether the curve grows or decays.'],
    timeEstimate: 75,
  };
};

export const exponentialLogFactories: ProblemFactory[] = [
  genExpSolveMC,
  genExpSolveGR,
  genInterpretExp,
  genWeeklyBase,
  genRateCompare,
  genExpGraphId,
];
