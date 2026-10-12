// g7-probability: compound events, spinners, counting principle, complements.
// Covers released items 9, 23, 30, 36, 45 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt } from '../math1/rng';
import { gcd } from '../math1/rng';
import { frac, mc } from '../math1/latex';
import { spinnerSvg } from './svg';

function fracStr(n: number, d: number): string {
  const g = gcd(n, d);
  n /= g;
  d /= g;
  return d === 1 ? String(n) : `${n}/${d}`;
}

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

// ── Q9-style GR: number cube + coin compound probability ────────────────
export const genCubeCoinCompound: ProblemFactory = (rng) => {
  const mode = choice(rng, [
    { desc: 'rolling an even number AND flipping heads', num: 3 * 1, den: 12 },
    { desc: 'rolling a number less than 3 AND flipping tails', num: 2 * 1, den: 12 },
    { desc: 'rolling a 5 OR a 6 AND flipping heads', num: 2 * 1, den: 12 },
    { desc: 'rolling a number greater than 2 AND flipping tails', num: 4 * 1, den: 12 },
  ] as const);
  const ans = fracStr(mode.num, mode.den);
  return {
    itemType: 'GR',
    context: `A number cube with faces numbered 1 through 6 is rolled, and a coin is flipped. What is the probability of ${mode.desc}? Express the answer as a fraction in simplest form.`,
    question: `P(\\text{compound})`,
    answer: ans,
    steps: [
      { number: 1, description: 'Multiply the independent probabilities.', math: `${fracStr(mode.num / 1, 6)} \\times \\frac{1}{2} = ${frac(ans.split('/')[0] ? Number(ans.split('/')[0]) : 0, ans.includes('/') ? Number(ans.split('/')[1]) : 1)}` },
    ],
    hints: ['P(A and B) = P(A) × P(B) for independent events.'],
    timeEstimate: 60,
  };
};

// ── Q23-style MC + VIS: two spinners compound probability ───────────────
export const genSpinnerCompound: ProblemFactory = (rng) => {
  const colors = choice(rng, [
    ['Red', 'Blue', 'Green', 'Yellow'],
    ['Red', 'Blue', 'Green', 'Orange'],
  ] as const);
  const numbers = choice(rng, [
    ['1', '2', '3', '4', '5', '6'],
    ['1', '2', '3', '4'],
    ['1', '2', '3', '4', '5'],
  ] as const);
  const svg =
    `<div style="display:flex;gap:24px;align-items:center">` +
    spinnerSvg([...colors]) +
    spinnerSvg([...numbers]) +
    `</div>`;
  const den = colors.length * numbers.length;
  const targetColor = colors[0];
  const targetParity = rng() < 0.5 ? 'an even number' : 'an odd number';
  const hitCount = numbers.filter((n) => (Number(n) % 2 === 0) === targetParity.includes('even')).length;
  const correct = fracStr(hitCount, den);
  const m = mcUnique(rng, correct, [
    fracStr(1, den),
    fracStr(hitCount + 1, den),
    fracStr(1, numbers.length),
    fracStr(hitCount + 2, den),
  ], (k) => fracStr(hitCount + k + 2, den));
  return {
    itemType: 'MC',
    context: `Spinner 1 has ${colors.length} equal sections and Spinner 2 has ${numbers.length} equal sections, as shown. Both are spun. What is the probability of landing on ${targetColor} AND ${targetParity}?`,
    question: `P(${targetColor} \\text{ and } ${targetParity})`,
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Count equally likely outcomes.', math: `${colors.length} \\times ${numbers.length} = ${den}` },
      { number: 2, description: `Favorable: ${targetColor} paired with ${targetParity.replace('an ', '').replace('a ', '')}s.`, math: `${hitCount} \\text{ of } ${den} \\Rightarrow ${correct}` },
    ],
    hints: ['Total outcomes = sections on Spinner 1 × sections on Spinner 2.'],
    timeEstimate: 75,
  };
};

// ── Q30-style MC: counting principle ────────────────────────────────────
export const genCountingPrinciple: ProblemFactory = (rng) => {
  const a = randInt(rng, 2, 6);
  const b = randInt(rng, 2, 5);
  const c = randInt(rng, 2, 4);
  const total = a * b * c;
  const m = mcUnique(rng, String(total), [
    String(a + b + c),
    String(a * b + c),
    String(a * b * c + a),
  ], (k) => String(total + a * k));
  return {
    itemType: 'MC',
    context: `A snack bar offers ${a} drink flavors, ${b} sandwich types, and ${c} fruit sides. A combo includes one of each. How many different combos are possible?`,
    question: `${a} \\times ${b} \\times ${c}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Counting principle: multiply the number of options at each stage.', math: `${a} \\times ${b} \\times ${c} = ${total}` },
    ],
    hints: ['Multiply — do not add — the option counts.'],
    timeEstimate: 45,
  };
};

// ── Q36-style GR: complement probability ────────────────────────────────
export const genProbComplement: ProblemFactory = (rng) => {
  const colors = choice(rng, [
    ['red', 'blue', 'green'],
    ['red', 'yellow', 'purple'],
  ] as const);
  const den = choice(rng, [4, 5, 6, 8]);
  const p1 = randInt(rng, 1, Math.floor(den / 2) - 1);
  const target = colors[0];
  const ans = fracStr(den - p1, den);
  return {
    itemType: 'GR',
    context: `A bag contains ${colors[0]}, ${colors[1]}, and ${colors[2]} marbles. The probability of drawing a ${target} marble is ${fracStr(p1, den)}. What is the probability of drawing a marble that is NOT ${target}? Express the answer as a fraction in simplest form.`,
    question: `P(\\text{not ${target}}) = 1 - ${fracStr(p1, den)}`,
    answer: ans,
    steps: [
      { number: 1, description: 'Complement rule.', math: `1 - ${fracStr(p1, den)} = ${ans}` },
    ],
    hints: ['P(not A) = 1 − P(A).'],
    timeEstimate: 45,
  };
};

// ── Q45-style MC: probability of "other than" a color ───────────────────
export const genColorComplement: ProblemFactory = (rng) => {
  const den = choice(rng, [6, 8, 10, 12]);
  const yellow = randInt(rng, 1, Math.floor((den - 1) / 2)); // strictly < half
  const correct = fracStr(den - yellow, den);
  const m = mcUnique(rng, correct, [
    fracStr(yellow, den),
    fracStr(1, den),
    fracStr(den - yellow + 1, den),
  ], (k) => fracStr(den - yellow + k + 1, den));
  return {
    itemType: 'MC',
    context: `A bag holds ${den} counters, and ${yellow} of them are yellow. One counter is drawn at random. What is the probability of drawing a counter that is a color other than yellow?`,
    question: `P(\\text{not yellow})`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Counters that are not yellow.', math: `${den} - ${yellow} = ${den - yellow}` },
      { number: 2, description: 'Divide by the total.', math: correct },
    ],
    hints: ['Count the counters that are NOT yellow first.'],
    timeEstimate: 45,
  };
};

export const probabilityFactories: ProblemFactory[] = [
  genCubeCoinCompound,
  genSpinnerCompound,
  genCountingPrinciple,
  genProbComplement,
  genColorComplement,
];
