// m1-exponents-geometry: exponent laws, perpendicular/parallel lines,
// midpoint/endpoint, coordinate geometry with parallelograms.
// Formats from released Q14, Q15, Q32, Q34, Q35, Q38, Q41.

import type { ProblemFactory } from '../../problemGenerator';
import { randInt, randNonZero, choice } from './rng';
import { num, frac, mc } from './latex';

// ── Q35-style GR: power of a power ((x^a)^b)^c = x^m ──
export const genPowerTower: ProblemFactory = (rng, difficulty) => {
  const a = difficulty === 'easy' ? randInt(rng, 2, 4) : randInt(rng, 2, 6);
  const b = randInt(rng, 2, 5);
  const c = difficulty === 'hard' ? randInt(rng, 2, 4) : choice(rng, [1, 2, 3] as const);
  const m = a * b * c;
  const inner = c === 1 ? `(x^{${a}})^{${b}}` : `((x^{${a}})^{${b}})^{${c}}`;
  return {
    itemType: 'GR',
    context: `An expression is shown: ${inner}. When the expression is written in the form x^m, what is the value of m?`,
    question: `${inner} = x^m`,
    answer: num(m),
    steps: [
      { number: 1, description: 'Powers of powers multiply exponents.', math: `(x^{${a}})^{${b}} = x^{${a * b}}` },
      { number: 2, description: 'Repeat for the outer power.', math: `m = ${a} \\cdot ${b}${c === 1 ? '' : ` \\cdot ${c}`} = ${m}` },
    ],
    hints: ['For (x^a)^b, multiply the exponents: x^(ab).'],
    timeEstimate: 40,
  };
};

// ── Q15-style GR: (x^a y^b / x^c y^d)^n = x^p y^q, find n ──
export const genPowerQuotient: ProblemFactory = (rng, difficulty) => {
  const nTarget = difficulty === 'easy' ? choice(rng, [2, 3] as const) : difficulty === 'medium' ? choice(rng, [2, 3, 4] as const) : 0;
  let n: number;
  let a: number, b: number, c: number, d: number, p: number, q: number;
  if (nTarget !== 0) {
    n = nTarget;
    const dx = randInt(rng, 2, 6);
    const dy = randInt(rng, 2, 6);
    a = dx + randInt(rng, 1, 4); c = a - dx;
    b = dy + randInt(rng, 1, 4); d = b - dy;
    p = dx * n; q = dy * n;
  } else {
    // fractional n, e.g. 3/2: dx * n = p → pick dx=4, n=3/2 → p=6
    n = 1.5;
    const dx = choice(rng, [2, 4, 6] as const);
    const dy = choice(rng, [2, 4] as const);
    a = dx + randInt(rng, 1, 4); c = a - dx;
    b = dy + randInt(rng, 1, 4); d = b - dy;
    p = (dx * 3) / 2; q = (dy * 3) / 2;
  }
  const cStr = c >= 0 ? `x^{${c}}` : `x^{${c}}`;
  const dStr = `y^{${d}}`;
  const ans = Number.isInteger(n) ? num(n) : frac(Math.round(n * 2), 2);
  return {
    itemType: 'GR',
    context: 'What is the value of n in the equation shown?',
    question: `\\left( \\frac{x^{${a}} y^{${b}}}{${cStr} ${dStr}} \\right)^{n} = x^{${p}} y^{${q}}`,
    answer: ans,
    steps: [
      { number: 1, description: 'Simplify inside the parentheses by subtracting exponents.', math: `\\left( x^{${a - c}} y^{${b - d}} \\right)^n = x^{${p}} y^{${q}}` },
      { number: 2, description: 'Multiply exponents by n and match.', math: `${a - c}n = ${p} \\Rightarrow n = ${ans}` },
    ],
    hints: ['Subtract exponents inside first, then set (difference)·n equal to the final exponent.'],
    timeEstimate: 60,
  };
};

// ── Q14-style GR: find b of a line through a point, perpendicular to y = mx + c ──
export const genPerpIntercept: ProblemFactory = (rng, difficulty) => {
  // given slope g = p/q → perp slope = −q/p; b = k + (q/p)·h, integer when p | h
  const p = choice(rng, [1, 2, 3, 4] as const);
  const q = choice(rng, [1, 2, 3, 5] as const);
  const h = p * randNonZero(rng, 1, difficulty === 'easy' ? 2 : 4);
  const k = randInt(rng, -6, 8);
  const b = k + q * (h / p);
  const gLatex = q === 1 ? (p === 1 ? 'x' : `${p}x`) : p === 1 ? `\\frac{1}{${q}}x` : `\\frac{${p}}{${q}}x`;
  const cGiven = randInt(rng, 0, 6);
  return {
    itemType: 'GR',
    context: `A line y = mx + b passes through the point (${h}, ${k}) and is perpendicular to y = ${gLatex} + ${cGiven}. What is the value of b?`,
    question: `y = mx + b \\ \\perp \\ y = ${gLatex} + ${cGiven}`,
    answer: num(b),
    steps: [
      { number: 1, description: 'Perpendicular slope is the negative reciprocal.', math: `m = -\\frac{${q}}{${p}}` },
      { number: 2, description: 'Substitute the point to find b.', math: `${k} = -\\frac{${q}}{${p}}(${h}) + b` },
      { number: 3, description: 'Solve for b.', math: `b = ${k} + ${num(q * (h / p))} = ${k + q * (h / p)}` },
    ],
    hints: ['Perpendicular slopes multiply to −1. Flip the given slope and negate it.'],
    timeEstimate: 75,
  };
};

// ── Q38-style MC: which point pair lies on a line parallel to y = c − mx ──
export const genParallelPoints: ProblemFactory = (rng, difficulty) => {
  const mSlope = difficulty === 'easy' ? randInt(rng, 2, 4) : randInt(rng, 2, 6);
  const c = randInt(rng, 1, 9);
  const x1 = randNonZero(rng, -6, 6);
  const x2 = x1 + choice(rng, [1, 2] as const);
  const y1 = randInt(rng, -6, 8);
  const y2 = y1 - mSlope * (x2 - x1); // slope −m
  const pt = (x: number, y: number) => `(${num(x)}, ${num(y)})`;
  const correct = `${pt(x1, y1)} \\text{ and } ${pt(x2, y2)}`;
  const mRes = mc(rng, correct, [
    `${pt(x1, y1)} \\text{ and } ${pt(x2, y1 + mSlope * (x2 - x1))}`, // +m slope
    `${pt(x1, y1)} \\text{ and } ${pt(x2, y1 + (x2 - x1))}`,          // slope 1
    `${pt(x1, y2)} \\text{ and } ${pt(x2, y1)}`,                      // swapped
  ]);
  return {
    itemType: 'MC',
    context: `Which points lie on a line that is parallel to the graph of y = ${c} − ${mSlope}x?`,
    question: `y = ${c} - ${mSlope}x`,
    answer: mRes.answer,
    choices: mRes.choices,
    steps: [
      { number: 1, description: 'Parallel lines share the slope −m.', math: `m = -${mSlope}` },
      { number: 2, description: 'Compute the slope between each point pair: (y₂ − y₁)/(x₂ − x₁).', math: `\\frac{${y2} - ${y1}}{${x2} - ${x1}} = -${mSlope}` },
    ],
    hints: ['A parallel line has the same slope. Check rise over run for each pair.'],
    timeEstimate: 60,
  };
};

// ── Q32-style MC: find endpoint Q given P and midpoint M ──
export const genMidpointEndpoint: ProblemFactory = (rng, difficulty) => {
  const px = randNonZero(rng, -6, 6);
  const py = randNonZero(rng, -6, 6);
  const mx = difficulty === 'easy' ? randInt(rng, -6, 8) : randInt(rng, -9, 9);
  const my = difficulty === 'easy' ? randInt(rng, -6, 8) : randInt(rng, -9, 9);
  const qx = 2 * mx - px;
  const qy = 2 * my - py;
  const pt = (x: number, y: number) => `(${num(x)}, ${num(y)})`;
  const correct = pt(qx, qy);
  const m = mc(rng, correct, [
    pt(Math.round((px + mx) / 2 * 10) / 10, Math.round((py + my) / 2 * 10) / 10),
    pt(mx - px, my - py),
    pt(qx + 1, qy - 1),
    pt(qx - 2, qy + 1),
  ]);
  return {
    itemType: 'MC',
    context: `The midpoint of segment PQ is M. If P is located at (${px}, ${py}) and M is located at (${mx}, ${my}), what are the coordinates of Q?`,
    question: `M = \\left( \\frac{${px} + x_Q}{2}, \\frac{${py} + y_Q}{2} \\right) = (${mx}, ${my})`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Midpoint formula: M = ((P+Q)/2). Solve each coordinate.', math: `x_Q = 2(${mx}) - (${px}) = ${qx}` },
      { number: 2, description: 'Repeat for y.', math: `y_Q = 2(${my}) - (${py}) = ${qy}` },
    ],
    hints: ['Double the midpoint coordinate and subtract the known endpoint.'],
    timeEstimate: 60,
  };
};

// ── Q34-style GR: parallelogram vertex via slope + 3-4-5 length ──
export const genParallelogramK: ProblemFactory = (rng, difficulty) => {
  const scale = difficulty === 'hard' ? choice(rng, [1, 2] as const) : 1;
  const rise = 4 * scale;
  const run = 3 * scale;
  const len = 5 * scale;
  const gx = randInt(rng, 1, 8);
  const gy = randInt(rng, 1, 8);
  const upLeft = choice(rng, [true, false] as const);
  const k = gy + rise; // F is above G
  return {
    itemType: 'GR',
    context: `Points F(h, k) and G(${gx}, ${gy}) are adjacent vertices of parallelogram EFGH. Point F is located up and to the ${upLeft ? 'left' : 'right'} of point G. Side FG has a slope of ${upLeft ? '−' : ''}4/3 and a length of ${len}. What is the value of k?`,
    question: `\\text{slope} = \\frac{\\text{rise}}{\\text{run}} = ${upLeft ? '-' : ''}\\frac{4}{3}, \\quad |FG| = ${len}`,
    answer: num(k),
    steps: [
      { number: 1, description: 'A 3-4-5 triangle: slope 4/3 with length 5 means a rise of 4 and run of 3 (scaled).', math: `\\Delta y = ${rise}, \\quad \\Delta x = ${run}` },
      { number: 2, description: 'F is above G, so add the rise to the y-coordinate of G.', math: `k = ${gy} + ${rise} = ${k}` },
    ],
    hints: ['A segment with slope ±4/3 and length 5 rises 4 and runs 3 — a 3-4-5 right triangle.'],
    timeEstimate: 90,
  };
};

export const exponentsGeometryFactories: ProblemFactory[] = [
  genPowerTower,
  genPowerQuotient,
  genPerpIntercept,
  genParallelPoints,
  genMidpointEndpoint,
  genParallelogramK,
];
