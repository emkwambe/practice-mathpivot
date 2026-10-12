// m1-linear-equations: solve linear equations, literal equations, budget
// inequalities, perimeter problems. Multiple factories per released format.

import type { ProblemFactory } from '../../problemGenerator';
import { randInt, randNonZero, choice } from './rng';
import { num, frac, linExpr, mc } from './latex';

// ── Q23-style GR: a(bx + c) = d(ex + f), solution may be decimal/fraction ──
export const genSolveBothSides: ProblemFactory = (rng, difficulty) => {
  // pick target solution
  const x0 =
    difficulty === 'easy'
      ? randNonZero(rng, -6, 8)
      : difficulty === 'medium'
        ? randInt(rng, -8, 8) / 2 || 1.5
        : randInt(rng, -33, 33) / 10 || -3.3;

  // coefficients with retries until f is an integer and ab != de
  let a = 0, b = 0, c = 0, d = 0, e = 0, f = 0;
  for (let tries = 0; tries < 200; tries++) {
    a = randInt(rng, 2, 5);
    b = randInt(rng, 2, 6);
    c = randNonZero(rng, -9, 9);
    d = randInt(rng, 2, 9);
    e = randInt(rng, 1, 6);
    if (a * b === d * e) continue;
    const rhs = a * (b * x0 + c);
    const rem = rhs - d * e * x0;
    if (Math.abs(rem - Math.round(rem)) > 1e-9) continue;
    const ff = Math.round(rem) / d;
    if (Number.isInteger(ff) && ff !== 0 && Math.abs(ff) <= 12) {
      f = ff;
      break;
    }
  }
  if (f === 0) { a = 3; b = 2; c = -9; d = 9; e = 4; f = 8; } // deterministic fallback

  const lhs = `${a}(${linExpr(b, c, 'x')})`;
  const rhsS = `${d}(${linExpr(e, f, 'x')})`;
  const ans = Number.isInteger(x0) ? num(x0) : Number.isInteger(x0 * 2) ? frac(Math.round(x0 * 2), 2) : num(Math.round(x0 * 10) / 10);

  return {
    itemType: 'GR',
    context: 'What is the solution to the equation shown? Enter only a number.',
    question: `${lhs} = ${rhsS}`,
    answer: ans,
    steps: [
      { number: 1, description: 'Distribute on both sides.', math: `${varTermInline(a * b)} ${c * a >= 0 ? '+' : '-'} ${num(Math.abs(a * c))} = ${varTermInline(d * e)} ${d * f >= 0 ? '+' : '-'} ${num(Math.abs(d * f))}` },
      { number: 2, description: 'Collect x-terms on one side and constants on the other.', math: `${varTermInline(a * b - d * e)} = ${num(d * f - a * c)}` },
      { number: 3, description: 'Divide to solve for x.', math: `x = ${frac(d * f - a * c, a * b - d * e)}` },
    ],
    hints: ['Distribute first, then move all x-terms to one side.', `The solution is x = ${ans}.`],
    timeEstimate: difficulty === 'easy' ? 60 : 90,
  };
};

function varTermInline(coef: number): string {
  if (coef === 1) return 'x';
  if (coef === -1) return '-x';
  return `${num(coef)}x`;
}

// ── Q9-style MC: rearrange a literal equation for a variable ──
interface LiteralSpec {
  formula: string;       // display latex
  plain: string;         // plain-text formula for prose
  desc: string;          // prose description of variables
  target: string;        // variable name
  correct: string;
  distractors: string[];
}
const LITERALS: LiteralSpec[] = [
  { formula: 'W = Fd', plain: 'W = Fd', desc: 'W represents the amount of work done, F represents the force used, and d represents the distance moved.', target: 'F', correct: 'F = \\frac{W}{d}', distractors: ['F = dW', 'F = W - d', 'F = \\frac{d}{W}'] },
  { formula: 'd = rt', plain: 'd = rt', desc: 'd represents distance traveled, r represents the rate, and t represents the time.', target: 'r', correct: 'r = \\frac{d}{t}', distractors: ['r = dt', 'r = d - t', 'r = \\frac{t}{d}'] },
  { formula: 'A = bh', plain: 'A = bh', desc: 'A represents the area of a parallelogram, b represents the base, and h represents the height.', target: 'h', correct: 'h = \\frac{A}{b}', distractors: ['h = Ab', 'h = A - b', 'h = \\frac{b}{A}'] },
  { formula: 'P = 2l + 2w', plain: 'P = 2l + 2w', desc: 'P represents the perimeter of a rectangle, l represents the length, and w represents the width.', target: 'l', correct: 'l = \\frac{P - 2w}{2}', distractors: ['l = \\frac{P + 2w}{2}', 'l = P - 2w', 'l = \\frac{2w - P}{2}'] },
  { formula: 'I = Prt', plain: 'I = Prt', desc: 'I represents simple interest, P represents principal, r represents rate, and t represents time.', target: 't', correct: 't = \\frac{I}{Pr}', distractors: ['t = IPr', 't = \\frac{Pr}{I}', 't = I - Pr'] },
  { formula: 'V = lwh', plain: 'V = lwh', desc: 'V represents the volume of a rectangular prism, l the length, w the width, and h the height.', target: 'w', correct: 'w = \\frac{V}{lh}', distractors: ['w = \\frac{lh}{V}', 'w = Vlh', 'w = V - lh'] },
];

export const genLiteralEquation: ProblemFactory = (rng) => {
  const spec = choice(rng, LITERALS);
  const m = mc(rng, spec.correct, spec.distractors);
  return {
    itemType: 'MC',
    context: `A formula is ${spec.plain}. ${spec.desc} Which formula could be used to determine the value of ${spec.target}?`,
    question: `${spec.formula} \\ \\Rightarrow\\ \\ ?`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Isolate ${spec.target} by undoing the operations applied to it.`, math: spec.formula },
      { number: 2, description: 'Result.', math: spec.correct },
    ],
    hints: [`Undo whatever multiplies or is added to ${spec.target}, on both sides.`],
    timeEstimate: 45,
  };
};

// ── Q20-style GR: maximum whole units under a budget ──
const BUDGET_CONTEXTS = [
  { item: 'ounces of frozen yogurt', fixed: 'for a container', unit: 'per ounce' },
  { item: 'ride tickets', fixed: 'for admission', unit: 'per ticket' },
  { item: 't-shirts', fixed: 'for a membership', unit: 'per shirt' },
  { item: 'pounds of fruit', fixed: 'for a basket', unit: 'per pound' },
];
export const genBudgetMax: ProblemFactory = (rng, difficulty) => {
  const ctx = choice(rng, BUDGET_CONTEXTS);
  const per = choice(rng, [0.25, 0.48, 0.50, 0.65, 0.75, 0.85, 1.25]);
  const fixed = choice(rng, [1.25, 1.50, 2.00, 2.50, 4.50, 5.00]);
  const n = difficulty === 'easy' ? randInt(rng, 4, 8) : randInt(rng, 5, 12);
  // budget just above n units but below n+1
  const extra = randInt(rng, 1, 80) / 100;
  const budget = Math.round((fixed + per * n + per * extra) * 100) / 100;
  return {
    itemType: 'GR',
    context: `Maria has $${budget.toFixed(2)} to spend. A shop charges $${fixed.toFixed(2)} ${ctx.fixed} plus $${per.toFixed(2)} ${ctx.unit}. All prices include tax. What is the maximum whole number of ${ctx.item} she can buy?`,
    question: `${num(fixed)} + ${num(per)}x \\leq ${num(budget)}`,
    answer: num(n),
    steps: [
      { number: 1, description: 'Write the inequality: fixed fee plus per-unit cost stays within budget.', math: `${num(per)}x \\leq ${num(budget)} - ${num(fixed)}` },
      { number: 2, description: 'Subtract the fixed fee.', math: `${num(per)}x \\leq ${num(Math.round((budget - fixed) * 100) / 100)}` },
      { number: 3, description: 'Divide, then round DOWN to a whole number.', math: `x \\leq ${num(Math.round(((budget - fixed) / per) * 1000) / 1000)} \\Rightarrow x = ${n}` },
    ],
    hints: ['Subtract the fixed fee from the budget first.', 'The answer must be a whole number — round down, not up.'],
    timeEstimate: 75,
  };
};

// ── Q19-style GR: rectangle perimeter word problem ──
export const genPerimeterWord: ProblemFactory = (rng, difficulty) => {
  const L = difficulty === 'easy' ? randInt(rng, 6, 12) : randInt(rng, 8, 20);
  const k = randInt(rng, 2, Math.min(6, L - 2));
  const w = L - k;
  const P = 2 * (L + w);
  const less = choice(rng, [true, false]);
  const ctx = less
    ? `The width of a rectangle is ${k} inches less than the length.`
    : `The length of a rectangle is ${k} inches greater than the width.`;
  return {
    itemType: 'GR',
    context: `${ctx} The perimeter of the rectangle is ${P} inches. What is the length of the rectangle in inches?`,
    question: `2L + 2(L - ${k}) = ${P}`,
    answer: num(L),
    steps: [
      { number: 1, description: 'Let L be the length; the width is L − k.', math: `w = L - ${k}` },
      { number: 2, description: 'Write the perimeter equation.', math: `2L + 2(L - ${k}) = ${P}` },
      { number: 3, description: 'Solve.', math: `4L = ${P + 2 * k} \\Rightarrow L = ${L}` },
    ],
    hints: ['Perimeter = 2(length + width). Express the width using the length.'],
    timeEstimate: 75,
  };
};

// ── Q17-style MC: perimeter/area expression for rectangle with length = x + k ──
export const genPerimeterExpression: ProblemFactory = (rng, difficulty) => {
  const k = difficulty === 'easy' ? randInt(rng, 2, 6) : randInt(rng, 3, 9);
  const mult = difficulty === 'hard' ? choice(rng, [2, 3]) : 1;
  // length = mult*x + k, width = x → perimeter = 2(mult x + k) + 2x = (2mult+2)x + 2k
  const P = `${varTermInline(2 * mult + 2)} + ${num(2 * k)}`;
  const m = mc(rng, P, [
    `${varTermInline(mult + 1)} + ${num(k)}`,
    `${varTermInline(2 * mult + 2)} + ${num(k)}`,
    mult === 1 ? `x^2 + ${num(k)}x` : `${varTermInline(mult)}^2 + ${num(k)}x`,
  ]);
  const lenDesc = mult === 1 ? `${k} units greater than the width` : `${k} units greater than ${mult === 2 ? 'twice' : 'three times'} the width`;
  return {
    itemType: 'MC',
    context: `The length of a rectangle is ${lenDesc}, x. What is the perimeter of the rectangle?`,
    question: `P = 2(${mult === 1 ? 'x' : `${mult}x`} + ${k}) + 2x`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Perimeter = 2(length) + 2(width).', math: `P = 2(${mult === 1 ? 'x' : `${mult}x`} + ${k}) + 2x` },
      { number: 2, description: 'Distribute and combine like terms.', math: `P = ${P}` },
    ],
    hints: ['Perimeter adds all four sides: 2 lengths and 2 widths.'],
    timeEstimate: 60,
  };
};

// ── Q23b GR: simple one-step/two-step equation ──
export const genSolveSimple: ProblemFactory = (rng, difficulty) => {
  const x0 = difficulty === 'easy' ? randNonZero(rng, -8, 10) : randNonZero(rng, -12, 12);
  const a = randInt(rng, 2, 7);
  const form = choice(rng, ['ax+k', 'a(x+k)'] as const);
  if (form === 'a(x+k)') {
    const cc = randNonZero(rng, -8, 8);
    const target = a * (x0 + cc);
    return {
      itemType: 'GR',
      context: 'What is the value of x in the equation shown?',
      question: `${a}(x ${cc >= 0 ? '+' : '-'} ${num(Math.abs(cc))}) = ${num(target)}`,
      answer: num(x0),
      steps: [
        { number: 1, description: 'Divide both sides by the leading factor.', math: `x ${cc >= 0 ? '+' : '-'} ${num(Math.abs(cc))} = ${num(target / a)}` },
        { number: 2, description: 'Isolate x.', math: `x = ${num(x0)}` },
      ],
      hints: ['Divide both sides by the number outside the parentheses first.'],
      timeEstimate: 45,
    };
  }
  const k = randNonZero(rng, -9, 12);
  const r = a * x0 + k;
  return {
    itemType: 'GR',
    context: 'What is the value of x in the equation shown?',
    question: `${varTermInline(a)} ${k >= 0 ? '+' : '-'} ${num(Math.abs(k))} = ${num(r)}`,
    answer: num(x0),
    steps: [
      { number: 1, description: 'Move the constant to the other side.', math: `${varTermInline(a)} = ${num(a * x0)}` },
      { number: 2, description: 'Divide.', math: `x = ${num(x0)}` },
    ],
    hints: ['Undo addition/subtraction before division.'],
    timeEstimate: 40,
  };
};

export const linearEquationFactories: ProblemFactory[] = [
  genSolveBothSides,
  genLiteralEquation,
  genBudgetMax,
  genPerimeterWord,
  genPerimeterExpression,
  genSolveSimple,
];
