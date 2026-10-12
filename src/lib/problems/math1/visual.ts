// Visual (SVG) item types from the Math 1 2026 released form:
//  - Q1-style  (A-REI.12): pick the graph of a linear inequality — 4 graph choices
//  - Q42-style (F-BF.1.a): dot-pattern figures -> nth-term function
// Original items only; format matches the released form.

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt, shuffle } from './rng';
import { linExpr, mc, num } from './latex';
import { dotPatternSvg, inequalityGraphSvg } from './svg';

// ── Q1-style: graph of a linear inequality (A-REI.12) ──────────────────

interface SlopeOpt { v: number; tex: string }
const SLOPES: SlopeOpt[] = [
  { v: 2, tex: '2' },
  { v: 1, tex: '' },
  { v: 0.5, tex: '\\frac{1}{2}' },
  { v: -2, tex: '-2' },
  { v: -1, tex: '-' },
  { v: -0.5, tex: '-\\frac{1}{2}' },
];

interface IneqOpt { sign: string; tex: string; solid: boolean; shadeAbove: boolean }
const INEQS: IneqOpt[] = [
  { sign: '≥', tex: '\\geq', solid: true, shadeAbove: true },
  { sign: '>', tex: '>', solid: false, shadeAbove: true },
  { sign: '≤', tex: '\\leq', solid: true, shadeAbove: false },
  { sign: '<', tex: '<', solid: false, shadeAbove: false },
];

export const genInequalityGraph: ProblemFactory = (rng) => {
  const slope = choice(rng, SLOPES);
  const ineq = choice(rng, INEQS);
  const b = randInt(rng, -3, 3);

  const rhs = `${slope.tex}x${b === 0 ? '' : b > 0 ? ` + ${b}` : ` - ${-b}`}`;
  const inequality = `y ${ineq.tex} ${rhs}`;

  // Correct graph + three distractors (flip shading / flip dash / flip slope)
  const correctSvg = inequalityGraphSvg({ m: slope.v, b, solid: ineq.solid, shadeAbove: ineq.shadeAbove });
  const distractors = [
    inequalityGraphSvg({ m: slope.v, b, solid: ineq.solid, shadeAbove: !ineq.shadeAbove }),
    inequalityGraphSvg({ m: slope.v, b, solid: !ineq.solid, shadeAbove: ineq.shadeAbove }),
    inequalityGraphSvg({ m: -slope.v, b, solid: ineq.solid, shadeAbove: ineq.shadeAbove }),
  ];
  const options = shuffle(rng, [
    { svg: correctSvg, ok: true },
    ...distractors.map((svg) => ({ svg, ok: false })),
  ]);
  if (new Set(options.map((o) => o.svg)).size !== 4) {
    throw new Error('genInequalityGraph: duplicate SVG choices');
  }
  const correctIdx = options.findIndex((o) => o.ok);

  // Evaluate the (0, 0) test point honestly for the step text
  const originHolds =
    ineq.sign === '≥' ? 0 >= b :
    ineq.sign === '>' ? 0 > b :
    ineq.sign === '≤' ? 0 <= b : 0 < b;

  return {
    itemType: 'MC',
    context: 'Which graph represents the solution set of this inequality?',
    question: inequality,
    answer: 'ABCD'[correctIdx],
    choices: ['A', 'B', 'C', 'D'],
    svgChoices: options.map((o) => o.svg),
    steps: [
      {
        number: 1,
        description: `Graph the boundary line. The slope is ${num(slope.v)} and the y-intercept is ${b}.`,
        math: `y = ${rhs}`,
      },
      {
        number: 2,
        description: ineq.solid
          ? `"${ineq.sign}" includes the boundary, so the line is solid.`
          : `"${ineq.sign}" excludes the boundary, so the line is dashed.`,
        math: inequality,
      },
      {
        number: 3,
        description: `Test the point (0, 0): the statement is ${originHolds ? 'true' : 'false'}, so shade the side ${originHolds ? 'containing' : 'not containing'} the origin.`,
        math: `0 ${ineq.tex} ${num(b)}`,
      },
    ],
    hints: [
      'Match the slope and y-intercept of the boundary line first.',
      '≥ and ≤ use a solid line; > and < use a dashed line.',
      'Plug (0, 0) into the inequality to decide which side to shade.',
    ],
    timeEstimate: 75,
  };
};

// ── Q42-style: dot-pattern figures -> nth-term function (F-BF.1.a) ─────

export const genDotPattern: ProblemFactory = (rng) => {
  const h = randInt(rng, 2, 4); // dots added per figure (column height)
  const c = randInt(rng, 1, 3); // constant tail dots

  const a1 = h + c;
  const a2 = 2 * h + c;
  const a3 = 3 * h + c;

  const correct = linExpr(h, c, 'n');
  const m = mc(rng, correct, [
    linExpr(h + 1, c, 'n'),
    linExpr(h, c + 1, 'n'),
    linExpr(h + 1, c + 1, 'n'),
    linExpr(h + 2, c, 'n'),
    linExpr(h, c + 2, 'n'),
  ]);

  return {
    itemType: 'MC',
    context: 'A pattern of dots is shown for the first three figures. The pattern continues in the same way.',
    question: '\\text{Which function gives the dots in figure } n\\text{?}',
    stemSvg: dotPatternSvg(h, c),
    answer: m.answer,
    choices: m.choices,
    steps: [
      {
        number: 1,
        description: 'Count the dots in each figure.',
        math: `${num(a1)},\\ ${num(a2)},\\ ${num(a3)},\\ \\ldots`,
      },
      {
        number: 2,
        description: `Each figure adds a column of ${h} dots, so the common difference is ${h}.`,
        math: `d = ${h}`,
      },
      {
        number: 3,
        description: `Figure 1 has ${a1} dots, so the constant term is ${a1} - ${h} = ${c}.`,
        math: `f(n) = ${correct}`,
      },
    ],
    hints: [
      'Count the dots: the sequence is arithmetic.',
      'The common difference becomes the coefficient of n.',
    ],
    timeEstimate: 90,
  };
};
