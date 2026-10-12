// m3-rational-expressions: discontinuity, operations, rational equations.
// Covers released items 2, 3, 7, 13, 15, 27, 34, 36 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt, randNonZero } from '../math1/rng';
import { frac, linExpr, mc, num, varTerm } from '../math1/latex';

// ── Q3-style: positive discontinuity of a rational function (F-IF.4) ────
export const genDiscontinuityPos: ProblemFactory = (rng) => {
  const r1 = randInt(rng, 2, 6); // negative root: -r1
  const r2 = randInt(rng, 2, 6); // positive root (the answer)
  if (r1 === r2) return genDiscontinuityPos(rng, 'medium');
  const a = randInt(rng, 2, 8);
  const b = randInt(rng, 1, 9) * (rng() < 0.5 ? -1 : 1);
  // avoid hole cancellation: -b/a must not equal a root
  if (Math.abs(-b / a + r1) < 1e-9 || Math.abs(-b / a - r2) < 1e-9) return genDiscontinuityPos(rng, 'medium');
  // denominator (x + r1)(x - r2) = x^2 + (r1 - r2)x - r1 r2
  const p = r1 - r2;
  const q = -r1 * r2;
  const denom = polyish([q, p, 1]);
  const correct = `x = ${r2}`;
  const m = mc(rng, correct, [`x = ${r1}`, `x = ${-r2}`, `x = ${-r1}`, `x = ${r2 + r1}`]);
  return {
    itemType: 'MC',
    context: 'A function is shown. At which positive x-value is the function discontinuous?',
    question: `f(x) = \\frac{${linExpr(a, b)}}{${denom}}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Factor the denominator.', math: `${denom} = (x + ${r1})(x - ${r2})` },
      { number: 2, description: 'The numerator does not cancel either factor, so the function is discontinuous at both roots. The positive one is the answer.', math: `x = ${r2}` },
    ],
    hints: ['Discontinuities happen where the denominator is zero (and the factor does not cancel).'],
    timeEstimate: 75,
  };
};

/** tiny local poly formatter (ascending coeffs) to avoid importing polyTex everywhere */
function polyish(c: number[]): string {
  const parts: string[] = [];
  for (let i = c.length - 1; i >= 0; i--) {
    const coef = c[i];
    if (coef === 0) continue;
    const abs = Math.abs(coef);
    const cs = i === 0 ? num(abs) : abs === 1 ? '' : num(abs);
    const vs = i === 0 ? '' : i === 1 ? 'x' : `x^${i}`;
    const t = `${cs}${vs}`;
    parts.push(parts.length === 0 ? (coef < 0 ? `-${t}` : t) : coef < 0 ? `- ${t}` : `+ ${t}`);
  }
  return parts.join(' ') || '0';
}

// ── Q7-style: discontinuity at a fractional x-value (F-IF.7) ────────────
export const genDiscontinuityFrac: ProblemFactory = (rng) => {
  const a = choice(rng, [2, 3, 4, 5]);
  const b = randInt(rng, 1, 7); // root -b/a
  const c = choice(rng, [2, 3, 4]);
  const d = randInt(rng, 1, 7); // root d/c
  if (Math.abs(-b / a - d / c) < 1e-9) return genDiscontinuityFrac(rng, 'medium');
  const K = randInt(rng, 2, 12);
  // denom = (ax + b)(cx - d)
  const denom = polyish([-b * d, a * -d + b * c, a * c]);
  const rootNeg = frac(-b, a);
  const rootPos = frac(d, c);
  const correct = `x = ${rootNeg}`;
  const distractors = [
    `x = ${rootPos}`,
    `x = ${frac(b, a)}`,
    `x = ${frac(-d, c)}`,
    `x = ${frac(-b, c)}`,
  ];
  if (new Set([correct, ...distractors]).size < 5) return genDiscontinuityFrac(rng, 'medium');
  const m = mc(rng, correct, distractors);
  return {
    itemType: 'MC',
    context: `Which choice is a point of discontinuity on the graph of the function?`,
    question: `f(x) = \\frac{${K}}{${denom}}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Factor the denominator.', math: `${denom} = (${varTerm(a, 'x')} + ${b})(${varTerm(c, 'x')} - ${d})` },
      { number: 2, description: 'Set each factor to zero.', math: `x = ${rootNeg} \\quad \\text{or} \\quad x = ${rootPos}` },
    ],
    hints: ['The graph is discontinuous where the denominator equals zero.'],
    timeEstimate: 75,
  };
};

// ── Q13-style: subtract rational expressions (A-APR.7.a) ────────────────
export const genSubtractRationals: ProblemFactory = (rng) => {
  const a = randInt(rng, 2, 9);
  // (x - a)/(x + a) - (x + a)/(x - a) = -4ax / (x^2 - a^2)
  const correct = `\\frac{${varTerm(-4 * a, 'x')}}{x^2 - ${a * a}}`;
  const m = mc(rng, correct, [
    '0',
    '1',
    `\\frac{${varTerm(4 * a, 'x')}}{x^2 - ${a * a}}`,
    `\\frac{${varTerm(-4 * a, 'x')} ${a > 0 ? '-' : '+'} ${4 * a * a}}{x^2 - ${a * a}}`,
  ]);
  return {
    itemType: 'MC',
    context: 'Which choice is equivalent to the expression shown?',
    question: `\\frac{x - ${a}}{x + ${a}} - \\frac{x + ${a}}{x - ${a}}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Common denominator: (x + a)(x - a) = x^2 - a^2.', math: `\\frac{(x - ${a})^2 - (x + ${a})^2}{x^2 - ${a * a}}` },
      { number: 2, description: 'Expand the numerators: (x^2 - 2ax + a^2) - (x^2 + 2ax + a^2) = -4ax.', math: correct },
    ],
    hints: ['Combine over a common denominator, then expand (x ± a)^2 carefully.'],
    timeEstimate: 90,
  };
};

// ── Q15-style: rational equation, gridded (A-REI.2) ─────────────────────
export const genRationalEquation: ProblemFactory = (rng) => {
  const a = randInt(rng, 2, 6);
  let b = randInt(rng, 2, 7);
  if (b === a) b = a + 1;
  const r = randNonZero(rng, -6, 6); // the valid solution
  if (r === a || r === b) return genRationalEquation(rng, 'medium');
  // x/(x - a) + 1/(x - b) = c / ((x - a)(x - b))  ->  x(x - b) + (x - a) = c
  const c = r * (r - b) + (r - a);
  if (c === 0) return genRationalEquation(rng, 'medium');
  return {
    itemType: 'GR',
    context: 'What is the solution to the equation?',
    question: `\\frac{x}{x - ${a}} + \\frac{1}{x - ${b}} = \\frac{${c}}{x^2 - ${a + b}x + ${a * b}}`,
    answer: num(r),
    steps: [
      { number: 1, description: `x^2 - ${a + b}x + ${a * b} factors as (x - ${a})(x - ${b}). Multiply both sides by it.`, math: `x(x - ${b}) + (x - ${a}) = ${c}` },
      { number: 2, description: 'Solve the resulting quadratic and reject any value that makes a denominator zero.', math: `x = ${num(r)}` },
    ],
    hints: ['Factor the right-hand denominator first — it is the common denominator.'],
    timeEstimate: 105,
  };
};

// ── Q27-style: decimal proportion, gridded (A-REI.2) ────────────────────
export const genRationalProportion: ProblemFactory = (rng) => {
  const p = choice(rng, [20, 25, 36, 40, 50, 75]); // displayed as 0.20 etc.
  const x0 = randNonZero(rng, -12, 12);
  const b = choice(rng, [2, 3, 4, 5]);
  const a = randInt(rng, 1, 9);
  if (x0 === -a) return genRationalProportion(rng, 'medium');
  // p/100 = (x + a)/(bx - c)  ->  c = b x0 - 100(x0 + a)/p  (p divides 100)
  const c = b * x0 - (100 * (x0 + a)) / p;
  if (!Number.isInteger(c) || c === 0) return genRationalProportion(rng, 'medium');
  const kDisplay = (p / 100).toFixed(2).replace(/0$/, '');
  return {
    itemType: 'GR',
    context: 'An equation is shown. What is the value of x?',
    question: `${kDisplay} = \\frac{x + ${a}}{${linExpr(b, -c)}}`,
    answer: num(x0),
    steps: [
      { number: 1, description: 'Cross-multiply.', math: `${kDisplay}(${linExpr(b, -c)}) = x + ${a}` },
      { number: 2, description: 'Isolate x.', math: `x = ${num(x0)}` },
    ],
    hints: ['Cross-multiply, then collect the x terms on one side.'],
    timeEstimate: 75,
  };
};

// ── Q2-style: solve f(x) = g(x), linear vs rational (A-REI.11) ──────────
export const genSolveLinearRational: ProblemFactory = (rng) => {
  const a = randInt(rng, 1, 4);
  const b = randInt(rng, -6, 8);
  const d = randNonZero(rng, -5, 5);
  const x0 = randNonZero(rng, -9, 9);
  if (x0 === d) return genSolveLinearRational(rng, 'medium');
  const c = (a * x0 + b) * (x0 - d);
  if (c === 0) return genSolveLinearRational(rng, 'medium');
  // second root of (ax+b)(x-d) = c:  ax^2 + (b - ad)x - bd - c = 0
  const x1 = (a * d - b) / a - x0;
  const fTex = linExpr(a, b);
  const gTex = `\\frac{${c}}{x ${d > 0 ? '-' : '+'} ${Math.abs(d)}}`;
  const fmt = (v: number) => num(Math.round(v * 10) / 10);
  const correct = fmt(x0);
  const distractors = [fmt(x1), fmt(-x0), fmt(x0 + (rng() < 0.5 ? 0.1 : -0.1)), fmt(-x1)];
  if (new Set([correct, ...distractors]).size < 5) return genSolveLinearRational(rng, 'medium');
  const m = mc(rng, correct, distractors);
  return {
    itemType: 'MC',
    context: 'Two functions are shown. For what value of x does f(x) = g(x)?',
    question: `f(x) = ${fTex} \\qquad g(x) = ${gTex}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Set the functions equal and multiply through by the denominator.', math: `(${fTex})(x ${d > 0 ? '-' : '+'} ${Math.abs(d)}) = ${c}` },
      { number: 2, description: 'Solve the quadratic; the listed solution is the answer.', math: `x = ${correct}` },
    ],
    hints: ['Cross-multiply to turn f(x) = g(x) into a quadratic equation.'],
    timeEstimate: 90,
  };
};

// ── Q34-style: intersection y-value, rational ∩ quadratic (A-REI.11) ────
// Construction: h(x) = (x + a)/(x - b), k(x) = -x^2 + px + q.
// Choose d = x0 - b in {±2, ±4} and numerator n, so the intersection
// y-value y0 = n/d is a clean half/quarter and a = n - x0 stays integer.
export const genIntersectionY: ProblemFactory = (rng) => {
  const coeffTex = (v: number): string =>
    Number.isInteger(v) ? num(v) : frac(Math.round(v * 4), 4);
  const kTex = (p: number, q: number): string =>
    `-x^2 ${p >= 0 ? '+' : '-'} ${coeffTex(Math.abs(p))}x ${q >= 0 ? '+' : '-'} ${coeffTex(Math.abs(q))}`;

  for (let attempt = 0; attempt < 80; attempt++) {
    const x0 = randNonZero(rng, -4, 4);
    const d = choice(rng, [2, 4, -2, -4]);
    const b = x0 - d;
    if (b === 0 || Math.abs(b) > 6) continue;
    let n = randNonZero(rng, -9, 9);
    if (n % d === 0) n += d > 0 ? 1 : -1; // keep y0 non-integer
    const y0 = n / d;
    const a = n - x0;
    if (a === 0 || Math.abs(a) > 9) continue;
    const p = randNonZero(rng, -4, 4);
    const q = y0 + x0 * x0 - p * x0;
    // g(x) = (x + a) - k(x)(x - b): require x0 to be the ONLY real root
    const g = (x: number) => x + a - (-x * x + p * x + q) * (x - b);
    const roots: number[] = [];
    let prevX = -30;
    let prevY = g(prevX);
    for (let i = 1; i <= 1200; i++) {
      const x = -30 + (60 * i) / 1200;
      const y = g(x);
      if (prevY === 0 || y === 0 || prevY * y < 0) {
        let lo = prevX, hi = x, ylo = prevY;
        for (let k = 0; k < 60; k++) {
          const mid = (lo + hi) / 2;
          const ym = g(mid);
          if (ylo * ym <= 0) hi = mid;
          else { lo = mid; ylo = ym; }
        }
        const root = (lo + hi) / 2;
        if (!roots.some((r) => Math.abs(r - root) < 1e-6)) roots.push(root);
      }
      prevX = x;
      prevY = y;
    }
    if (roots.length !== 1 || Math.abs(roots[0] - x0) > 1e-4) continue;
    return {
      itemType: 'GR' as const,
      context: 'Two functions are shown. What is the y-value, to the nearest hundredth, of the point where the graph of h(x) intersects the graph of k(x)?',
      question: `h(x) = \\frac{x ${a >= 0 ? '+' : '-'} ${Math.abs(a)}}{x ${b > 0 ? '-' : '+'} ${Math.abs(b)}} \\qquad k(x) = ${kTex(p, q)}`,
      answer: y0.toFixed(2),
      steps: [
        { number: 1, description: 'Set h(x) = k(x) and solve for the intersection x-value (a calculator or graph helps).', math: `x = ${num(x0)}` },
        { number: 2, description: 'Evaluate either function there.', math: `y = \\frac{${num(x0)} ${a >= 0 ? '+' : '-'} ${Math.abs(a)}}{${num(x0)} ${b > 0 ? '-' : '+'} ${Math.abs(b)}} = ${coeffTex(y0)}` },
      ],
      hints: ['Set the two functions equal and solve for x first.'],
      timeEstimate: 120,
    };
  }
  // fallback: deterministic safe config (verified unique intersection)
  return {
    itemType: 'GR',
    context: 'Two functions are shown. What is the y-value, to the nearest hundredth, of the point where the graph of h(x) intersects the graph of k(x)?',
    question: `h(x) = \\frac{x + 1}{x - 3} \\qquad k(x) = -x^2 - 2x + 24`,
    answer: '0.55',
    steps: [{ number: 1, description: 'Solve h(x) = k(x), then evaluate.', math: 'y \\approx 0.55' }],
    hints: ['Set the two functions equal.'],
    timeEstimate: 120,
  };
};

// ── Q36-style: combine rational expressions over factored denoms (A-APR.7.a)
export const genRationalSimplify: ProblemFactory = (rng) => {
  const s = choice(rng, [3, 4, 5]);
  const p = choice(rng, [2, 3, 6]);
  const q = choice(rng, [2, 3]);
  const r = choice(rng, [2, 3]);
  const A = randInt(rng, 2, 11);
  const B = randInt(rng, 1, 9);
  const C = randInt(rng, 1, 6);
  const D = randInt(rng, 2, 6);
  // A x + B        C        D x
  // --------  -  (------ + ------)   all denominators are multiples of (x + s)
  // p(x + s)      q(x + s)  r(x + s)
  const n1 = A * q * r - D * p * q;
  const n0 = B * q * r - C * p * r;
  const dx = p * q * r;
  if (n1 === 0 && n0 === 0) return genRationalSimplify(rng, 'medium');
  const numTex = linExpr(n1, n0) || '0';
  const denTex = linExpr(dx, dx * s);
  const correct = `\\frac{${numTex}}{${denTex}}`;
  const m = mc(rng, correct, [
    `\\frac{${linExpr(A * q * r + D * p * q, n0) || '0'}}{${denTex}}`,
    `\\frac{${numTex}}{${linExpr(p, p * s)}}`,
    `\\frac{${linExpr(n1, B * q * r + C * p * r) || '0'}}{${denTex}}`,
    `\\frac{${linExpr(n1 + q, n0) || '0'}}{${linExpr(dx, dx * s + dx)}}`,
  ]);
  return {
    itemType: 'MC',
    context: 'Which expression is equivalent to the one shown?',
    question: `\\frac{${linExpr(A, B)}}{${linExpr(p, p * s)}} - \\left( \\frac{${C}}{${linExpr(q, q * s)}} + \\frac{${varTerm(D, 'x')}}{${linExpr(r, r * s)}} \\right)`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Every denominator is a multiple of (x + ${s}); use the common denominator ${linExpr(dx, dx * s)}.`, math: `\\text{LCD} = ${dx}(x + ${s})` },
      { number: 2, description: 'Combine the numerators.', math: correct },
    ],
    hints: ['Factor each denominator first — they all share the same linear factor.'],
    timeEstimate: 105,
  };
};

export const rationalFactories: ProblemFactory[] = [
  genDiscontinuityPos,
  genDiscontinuityFrac,
  genSubtractRationals,
  genRationalEquation,
  genRationalProportion,
  genSolveLinearRational,
  genIntersectionY,
  genRationalSimplify,
];
