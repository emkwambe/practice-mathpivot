// g7-expressions-equations: combine like terms, distribute negatives,
// fraction-coefficient simplification, inequalities, modeling, evaluation,
// number sentences, multi-step word problems.
// Covers released items 1, 4, 11, 12, 14, 19, 31, 35, 41, 42 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt, randNonZero } from '../math1/rng';
import { frac, linExpr, mc, money, num, varTerm } from '../math1/latex';

/** MC with guaranteed-unique distractors: filters candidates, tops up via fallback. */
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

// ── Q1-style MC: combine like terms with distribution ───────────────────
export const genCombineLikeTerms: ProblemFactory = (rng) => {
  const a = randInt(rng, 2, 9);
  const b = randInt(rng, 2, 6);
  const c = randInt(rng, 2, 9);
  const d = randInt(rng, 2, 8);
  const e = randInt(rng, 1, 9);
  const A = a + b - d;
  const B = -b * c + e;
  const correct = linExpr(A, B);
  const m = mc(rng, correct, [
    linExpr(a + b + d, B),
    linExpr(A, b * c + e),
    linExpr(a - b - d, -b * c - e),
    linExpr(A + 2, B),
  ]);
  return {
    itemType: 'MC',
    context: 'Which expression is equivalent to the one shown?',
    question: `${varTerm(a, 'x')} + ${b}(${linExpr(1, -c)}) - ${varTerm(d, 'x')} + ${e}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Distribute.', math: `${varTerm(a, 'x')} + ${varTerm(b, 'x')} - ${b * c} - ${varTerm(d, 'x')} + ${e}` },
      { number: 2, description: 'Combine like terms.', math: correct },
    ],
    hints: ['Distribute first, then collect x terms and constants separately.'],
    timeEstimate: 60,
  };
};

// ── Q35-style MC: distribute negative, e.g. -6(x + 4) - 4x ──────────────
export const genDistributeNegatives: ProblemFactory = (rng) => {
  const a = randInt(rng, 2, 9);
  const b = randInt(rng, 2, 9);
  const c = randInt(rng, 2, 9);
  const A = -(a + c);
  const B = -a * b;
  const correct = linExpr(A, B);
  const m = mc(rng, correct, [
    linExpr(-(a - c), B),
    linExpr(A, a * b),
    linExpr(-(a + c), -b),
    linExpr(c - a, B),
  ]);
  return {
    itemType: 'MC',
    context: 'Which expression is equivalent to the one shown?',
    question: `-${a}(${linExpr(1, b)}) - ${varTerm(c, 'x')}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Distribute the negative factor to BOTH terms.', math: `-${varTerm(a, 'x')} - ${a * b} - ${varTerm(c, 'x')}` },
      { number: 2, description: 'Combine like terms.', math: correct },
    ],
    hints: [`-${a} distributes over the whole parentheses — the constant becomes -${a * b}.`],
    timeEstimate: 45,
  };
};

// ── Q11-style MC: (a(x - b) - c(x - d))/e equivalent expression ─────────
export const genFractionCoeffSimplify: ProblemFactory = (rng) => {
  const e = choice(rng, [2, 3, 4]);
  const a = e * randInt(rng, 1, 3);
  const c = e * randInt(rng, 1, 2);
  const b = randInt(rng, 1, 6);
  const d = randInt(rng, 1, 6);
  // numerator: (a-c)x + (-ab + cd); divide whole thing by e
  const Ax = (a - c) / e;
  const Bx = (-a * b + c * d) / e;
  const correct = linExpr(Ax, Bx);
  const m = mcUnique(rng, correct, [
    linExpr((a - c) / e, (-a * b - c * d) / e),
    linExpr(a - c, -a * b + c * d),
    linExpr(Ax, Bx + e),
    linExpr((a + c) / e, Bx),
  ], (k) => linExpr(Ax, Bx + e * k));
  return {
    itemType: 'MC',
    context: 'Which expression is equivalent to the one shown?',
    question: `\\frac{${a}(${linExpr(1, -b)}) - ${c}(${linExpr(1, -d)})}{${e}}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Distribute inside the numerator.', math: `\\frac{${linExpr(a, -a * b)} - ${linExpr(c, -c * d)}}{${e}}` },
      { number: 2, description: 'Combine like terms.', math: `\\frac{${linExpr(a - c, -a * b + c * d)}}{${e}}` },
      { number: 3, description: 'Divide each term by the denominator.', math: correct },
    ],
    hints: ['Simplify the numerator first, then divide every term by the denominator.'],
    timeEstimate: 90,
  };
};

// ── Q4-style MC: solve ax + b > c ───────────────────────────────────────
export const genSolveInequality: ProblemFactory = (rng) => {
  const x0 = randInt(rng, -6, 8);
  const a = randNonZero(rng, -5, 5);
  const b = randInt(rng, -9, 9);
  const rhs = a * x0 + b;
  const flip = a < 0;
  const correct = `x ${flip ? '<' : '>'} ${x0}`;
  const m = mc(rng, correct, [
    `x ${flip ? '>' : '<'} ${x0}`,
    `x ${flip ? '<' : '>'} ${x0 + 1}`,
    `x ${flip ? '>' : '<'} ${x0 - 1}`,
  ]);
  return {
    itemType: 'MC',
    context: 'Which inequality represents all solutions of the inequality shown?',
    question: `${linExpr(a, b)} > ${rhs}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Isolate the variable term.', math: `${varTerm(a, 'x')} > ${rhs - b}` },
      { number: 2, description: flip ? `Divide by ${a} — flip the inequality because the divisor is negative.` : `Divide by ${a}.`, math: correct },
    ],
    hints: flip ? ['Dividing by a negative reverses the inequality sign.'] : ['Undo the constant first, then divide.'],
    timeEstimate: 60,
  };
};

// ── Q12-style MC: model a word problem as an inequality ─────────────────
export const genModelInequality: ProblemFactory = (rng) => {
  const cost = randInt(rng, 2, 15);
  let fee = randInt(rng, 2, 12);
  if (fee === cost) fee += 3;
  const budget = randInt(rng, cost * 2 + fee + 1, cost * 5 + fee + 9);
  const correct = `${cost}c + ${fee} \\leq ${budget}`;
  const m = mcUnique(rng, correct, [
    `${cost}c + ${fee} \\geq ${budget}`,
    `${fee}c + ${cost} \\leq ${budget}`,
    `${cost}c - ${fee} \\leq ${budget}`,
  ], (k) => `${cost}c + ${fee + k} \\leq ${budget}`);
  return {
    itemType: 'MC',
    context: `A club charges $${cost} per ticket plus a one-time service fee of $${fee}. Jordan can spend at most $${budget}. Which inequality can be used to find c, the number of tickets Jordan can buy?`,
    question: '\\text{total} \\leq \\text{budget}',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Cost = price per ticket × tickets + one-time fee.', math: `${cost}c + ${fee}` },
      { number: 2, description: '"At most" means ≤ the budget.', math: correct },
    ],
    hints: ['"At most" → less than or equal.'],
    timeEstimate: 60,
  };
};

// ── Q14-style MC: evaluate (ax - by)/(cz - d) with given values ─────────
export const genEvaluateExpression: ProblemFactory = (rng) => {
  let a = 2, b = 2, c = 2, d = 2, x = 2, y = 1, z = 2;
  let numerator = 0;
  let denominator = 0;
  for (let tries = 0; tries < 40; tries++) {
    a = randInt(rng, 2, 4);
    b = randInt(rng, 2, 4);
    c = randInt(rng, 2, 6);
    d = randInt(rng, 2, 6);
    x = randInt(rng, 2, 6);
    y = randInt(rng, 1, 4);
    z = randInt(rng, 2, 5);
    numerator = a * x - b * y;
    denominator = c * z - d;
    if (denominator !== 0 && numerator !== 0) break;
  }
  const correct = frac(numerator, denominator);
  const m = mcUnique(rng, correct, [
    frac(numerator, denominator + c),
    frac(numerator + a, denominator),
    frac(a * x + b * y, denominator),
    frac(numerator, c * z + d),
  ], (k) => frac(numerator + a * k, denominator + k));
  return {
    itemType: 'MC',
    context: `What is the value of the expression when x = ${x}, y = ${y}, and z = ${z}?`,
    question: `\\frac{${linExpr(a, -b)}}{${linExpr(c, -d, 'z')}}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Substitute the values.', math: `\\frac{${a}(${x}) - ${b}(${y})}{${c}(${z}) - ${d}} = \\frac{${numerator}}{${denominator}}` },
      { number: 2, description: 'Simplify.', math: correct },
    ],
    hints: ['Substitute carefully — watch the signs.'],
    timeEstimate: 60,
  };
};

// ── Q41-style MC: verbal sentence → equation ────────────────────────────
export const genNumberSentence: ProblemFactory = (rng) => {
  const a = randInt(rng, 2, 6);
  const b = randInt(rng, 1, 9);
  const total = a * randInt(rng, 2, 6) + b;
  const correct = `${a}p + ${b} = ${total}`;
  const m = mcUnique(rng, correct, [
    `${a}(p + ${b}) = ${total}`,
    `${a}p - ${b} = ${total}`,
    `${b}p + ${a} = ${total}`,
  ], (k) => `${a}p + ${b + k} = ${total}`);
  return {
    itemType: 'MC',
    context: `Which equation represents the sentence: "${b > 1 ? num(b) : 'One'} more than ${a === 2 ? 'twice' : `${a} times`} a number p is ${total}"?`,
    question: '\\text{sentence} \\to \\text{equation}',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `"${a} times a number" is ${a}p; "${b} more than" adds ${b}.`, math: correct },
    ],
    hints: ['"More than" means add AFTER multiplying.'],
    timeEstimate: 45,
  };
};

// ── Q19-style MC: sold a fraction, gave a percent, kept n → total ───────
export const genKeptRemainder: ProblemFactory = (rng) => {
  // total T; sold 7/8 → remainder T/8; gave 10% of remainder? Q19: sold 7/8, gave 10%, kept 8.
  // Simpler original format: sold f of stock, kept k items = (1-f)T → T.
  const den = choice(rng, [4, 5, 6, 8]);
  const keptFracNum = 1; // kept 1/den after selling
  const kept = choice(rng, [4, 5, 6, 8, 10, 12].filter((k) => k !== den));
  const T = kept * den;
  const soldNum = den - keptFracNum;
  const m = mcUnique(rng, num(T), [
    num(T + den),
    num(kept * soldNum),
    num(T - den),
  ], (k) => num(T + den * (k + 1)));
  return {
    itemType: 'MC',
    context: `A baker sold ${soldNum}/${den} of the muffins made and kept the remaining ${kept} muffins. How many muffins did the baker make?`,
    question: `${frac(soldNum, den)} \\text{ sold, } ${kept} \\text{ kept}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'The kept muffins are the unsold fraction.', math: `1 - ${frac(soldNum, den)} = ${frac(keptFracNum, den)}` },
      { number: 2, description: 'Set up the equation and solve.', math: `${frac(keptFracNum, den)} T = ${kept} \\Rightarrow T = ${T}` },
    ],
    hints: ['The kept muffins represent the fraction NOT sold.'],
    timeEstimate: 75,
  };
};

// ── Q31-style MC: multi-item purchase, change from $20 ──────────────────
export const genChangeFromTwenty: ProblemFactory = (rng) => {
  const n1 = randInt(rng, 2, 4);
  const p1 = choice(rng, [1.25, 1.5, 1.75, 2.25, 2.5]);
  const n2 = randInt(rng, 2, 3);
  const p2 = choice(rng, [2.5, 3, 3.5, 4]);
  const total = n1 * p1 + n2 * p2;
  const change = 20 - total;
  const m = mcUnique(rng, `\\$${money(change)}`, [
    `\\$${money(change + 1)}`,
    `\\$${money(Math.max(change - 1.25, 0.25))}`,
    `\\$${money(total)}`,
  ], (k) => `\\$${money(change + k + 1)}`);
  return {
    itemType: 'MC',
    context: `Riley buys ${n1} notebooks at $${money(p1)} each and ${n2} packs of pens at $${money(p2)} each, and pays with a $20 bill. How much change should Riley receive?`,
    question: `20 - (${n1} \\times ${money(p1)} + ${n2} \\times ${money(p2)})`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Total cost.', math: `${n1}(${money(p1)}) + ${n2}(${money(p2)}) = ${money(total)}` },
      { number: 2, description: 'Subtract from $20.', math: `20 - ${money(total)} = \\$${money(change)}` },
    ],
    hints: ['Find the total first, then subtract from 20.'],
    timeEstimate: 75,
  };
};

// ── Q42-style MC: fraction/percent time allocation → minutes left ───────
export const genTimeAllocation: ProblemFactory = (rng) => {
  const total = choice(rng, [40, 50, 60]);
  const pct = choice(rng, [20, 30, 40, 50]);
  const den = choice(rng, [4, 5]);
  const used1 = (total * pct) / 100;
  const used2 = total / den;
  const left = total - used1 - used2;
  const m = mcUnique(rng, num(left), [
    num(total - used1),
    num(Math.abs(left - 5)),
    num(total - used2),
  ], (k) => num(left + 5 * k));
  return {
    itemType: 'MC',
    context: `A class period lasts ${total} minutes. The teacher spends ${pct}% of the period on a warmup and 1/${den} of the period on a lesson. How many minutes remain?`,
    question: `${total} - ${pct}\\% \\cdot ${total} - ${frac(1, den)} \\cdot ${total}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Warmup minutes.', math: `${pct}\\% \\times ${total} = ${num(used1)}` },
      { number: 2, description: 'Lesson minutes.', math: `${frac(1, den)} \\times ${total} = ${num(used2)}` },
      { number: 3, description: 'Subtract both from the total.', math: `${total} - ${num(used1)} - ${num(used2)} = ${num(left)}` },
    ],
    hints: ['Convert the percent and the fraction to minutes before subtracting.'],
    timeEstimate: 90,
  };
};

export const expressionFactories: ProblemFactory[] = [
  genCombineLikeTerms,
  genDistributeNegatives,
  genFractionCoeffSimplify,
  genSolveInequality,
  genModelInequality,
  genEvaluateExpression,
  genNumberSentence,
  genKeptRemainder,
  genChangeFromTwenty,
  genTimeAllocation,
];
