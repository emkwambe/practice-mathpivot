// g8-number-system: rational vs irrational, square-root estimation.
// Covers released items 5, 13 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt } from '../math1/rng';
import { mc, num } from '../math1/latex';

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

// ── Q5-style MC: which number is irrational ─────────────────────────────
export const genIrrationalId: ProblemFactory = (rng) => {
  const nonPerfect = choice(rng, [2, 3, 5, 7, 10, 11, 13, 14]);
  const perfect = choice(rng, [16, 25, 49, 64, 81]);
  const correct = `\\sqrt{${nonPerfect}}`;
  const m = mcUnique(rng, correct, [
    `0.\\overline{${randInt(rng, 2, 9)}}`,
    `\\frac{${randInt(rng, 2, 9)}}{${randInt(rng, 2, 9)}}`,
    `\\sqrt{${perfect}}`,
  ], (k) => `${num(2.5 + k * 0.5)}`);
  return {
    itemType: 'MC',
    context: 'Which number is irrational?',
    question: '\\text{irrational?}',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Irrational numbers cannot be written as a fraction — non-perfect-square roots and non-repeating, non-terminating decimals.', math: `\\sqrt{${nonPerfect}} \\text{ is irrational}` },
    ],
    hints: ['Repeating decimals, fractions, and perfect-square roots are all rational.'],
    timeEstimate: 45,
  };
};

// ── Q13-style GR: closest integer to √n ─────────────────────────────────
export const genSqrtNearestInt: ProblemFactory = (rng) => {
  const k = randInt(rng, 5, 16);
  const n = k * k + randInt(rng, Math.ceil(k * 0.6), Math.floor(k * 1.4)); // closer to k than k±1
  if (n === k * k || n >= (k + 1) * (k + 1) || n <= (k - 0.5) * (k - 0.5)) return genSqrtNearestInt(rng, 'medium');
  return {
    itemType: 'GR',
    context: `Which integer is closest to the value of the expression?`,
    question: `\\sqrt{${n}}`,
    answer: num(k),
    steps: [
      { number: 1, description: `Bracket between perfect squares: ${k * k} < ${n} < ${(k + 1) * (k + 1)}.`, math: `${k} < \\sqrt{${n}} < ${k + 1}` },
      { number: 2, description: `${n} is closer to ${k * k}, so the root is closer to ${k}.`, math: num(k) },
    ],
    hints: ['Find the perfect squares on either side.'],
    timeEstimate: 60,
  };
};

// ── NS.2 variant: √n lies between which two integers ────────────────────
export const genSqrtBetween: ProblemFactory = (rng) => {
  const k = randInt(rng, 3, 14);
  const n = k * k + randInt(rng, 2, 2 * k - 1);
  const correct = `${k} \\text{ and } ${k + 1}`;
  const m = mcUnique(rng, correct, [
    `${k - 1} \\text{ and } ${k}`,
    `${k + 1} \\text{ and } ${k + 2}`,
    `${k + 2} \\text{ and } ${k + 3}`,
  ], (kk) => `${k + 2 + kk} \\text{ and } ${k + 3 + kk}`);
  return {
    itemType: 'MC',
    context: `Between which two consecutive integers does the value of the expression lie?`,
    question: `\\sqrt{${n}}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Since ${k * k} < ${n} < ${(k + 1) * (k + 1)}:`, math: `${k} < \\sqrt{${n}} < ${k + 1}` },
    ],
    hints: ['Compare with nearby perfect squares.'],
    timeEstimate: 45,
  };
};

export const numberSystemFactories: ProblemFactory[] = [
  genIrrationalId,
  genSqrtNearestInt,
  genSqrtBetween,
];
