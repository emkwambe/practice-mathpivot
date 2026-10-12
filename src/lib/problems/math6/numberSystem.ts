// g6-number-system: integers/inequalities, coordinate distance, decimal & fraction
// operations, long division, GCF/LCM, integer models, rational ordering.
// Covers released items 6, 9, 11, 13, 15, 17, 20, 21, 24, 34 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt } from '../math1/rng';
import { mc, num } from '../math1/latex';
import { hopModelSvg } from './svg';

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

const neg = (n: number) => `-${n}`;

// ── Q6-style MC: which inequality is true ───────────────────────────────
export const genTrueInequality: ProblemFactory = (rng) => {
  const a = randInt(rng, 2, 9);
  const b = randInt(rng, 2, 9);
  if (a === b) return genTrueInequality(rng, 'medium');
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  const correct = `${neg(big)} < ${neg(small)}`;
  const m = mcUnique(rng, correct, [
    `${neg(big)} > ${neg(small)}`,
    `${neg(small)} < ${neg(big)}`,
    `${neg(big)} > ${small}`,
  ], (k) => `${neg(big + k)} > ${neg(small)}`);
  return {
    itemType: 'MC',
    context: 'Which inequality is true?',
    question: '\\text{true?}',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `On the number line, ${neg(big)} is to the LEFT of ${neg(small)}, so ${neg(big)} is smaller.`, math: `${neg(big)} < ${neg(small)}` },
    ],
    hints: ['For negatives, the number closer to zero is greater.'],
    timeEstimate: 40,
  };
};

// ── Q9-style MC: distance between two points (same x) ───────────────────
export const genCoordDistanceVertical: ProblemFactory = (rng) => {
  const x = randInt(rng, -6, 6);
  const y1 = randInt(rng, -5, 3);
  const d = randInt(rng, 2, 7);
  const y2 = y1 + d;
  const fmt = (v: number) => (v < 0 ? `-${Math.abs(v)}` : `${v}`);
  const correct = num(d);
  const m = mcUnique(rng, correct, [
    num(Math.abs(x) + d),
    num(y2 - y1 + 1 === d + 1 ? d + 1 : d + 2),
    num(Math.abs(y1) + Math.abs(y2) === d ? d + 3 : Math.abs(y1) + Math.abs(y2)),
  ], (k) => num(d + 2 + k));
  return {
    itemType: 'MC',
    context: `Point M is located at (${fmt(x)}, ${fmt(y1)}) and point P is located at (${fmt(x)}, ${fmt(y2)}) on a coordinate plane. What is the distance between the two points?`,
    question: '\\text{distance} = ? \\text{ units}',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Same x-coordinate: distance is the difference of the y-coordinates.', math: `|${fmt(y2)} - (${fmt(y1)})| = ${d}` },
    ],
    hints: ['Same x means vertical distance — subtract the y-values.'],
    timeEstimate: 45,
  };
};

// ── Q21-style MC: point k units from a given point ──────────────────────
export const genPointAtDistance: ProblemFactory = (rng) => {
  const x = randInt(rng, -6, 2);
  const y = randInt(rng, -5, 5);
  const d = randInt(rng, 5, 9);
  const fmtP = (a: number, b: number) => `(${a}, ${b})`;
  const correct = fmtP(x + d, y);
  const m = mcUnique(rng, correct, [
    fmtP(x - d + 2, y), // horizontal but wrong length
    fmtP(x + d, y + 2), // diagonal — distance ≠ d
    fmtP(x + 2, y + d), // diagonal — distance ≠ d
  ], (k) => fmtP(x + d, y + 2 + k));
  return {
    itemType: 'MC',
    context: `Which point is exactly ${d} units from the point (${x}, ${y})?`,
    question: `\\text{distance } ${d} \\text{ from } (${x}, ${y})`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Move horizontally ${d} units: (${x} + ${d}, ${y}) = (${x + d}, ${y}). Every other choice is either a shorter horizontal move or a diagonal move whose distance is not ${d}.`, math: `\\sqrt{${d}^2 + 0^2} = ${d}` },
    ],
    hints: ['Only a purely horizontal or vertical move of exactly d units works here.'],
    timeEstimate: 50,
  };
};

// ── Q11-style GR: decimal multiply & subtract ───────────────────────────
export const genDecimalOps: ProblemFactory = (rng) => {
  const price = randInt(rng, 825, 1525) / 100; // e.g. 11.27
  const mult = choice(rng, [2, 3] as const);
  const spent = randInt(rng, 500, Math.floor(mult * price * 100) - 100) / 100;
  const result = Math.round((mult * price - spent) * 100) / 100;
  return {
    itemType: 'GR',
    context: `Jordan earned ${mult} payments of $${price.toFixed(2)} each and then spent $${spent.toFixed(2)}. How much money, in dollars, does Jordan have left? (Express the answer as dollars.cents.)`,
    question: `${mult} \\times ${price.toFixed(2)} - ${spent.toFixed(2)}`,
    answer: result.toFixed(2),
    steps: [
      { number: 1, description: 'Multiply first.', math: `${mult} \\times ${price.toFixed(2)} = ${(mult * price).toFixed(2)}` },
      { number: 2, description: 'Then subtract.', math: `${(mult * price).toFixed(2)} - ${spent.toFixed(2)} = ${result.toFixed(2)}` },
    ],
    hints: ['Multiply before subtracting, and keep the decimal points lined up.'],
    timeEstimate: 70,
  };
};

// ── Q13-style GR: mixed number ÷ fraction (speed) ───────────────────────
export const genMixedDivFraction: ProblemFactory = (rng) => {
  const k = choice(rng, [2, 4] as const);
  let speed = randInt(rng, 120, 480);
  if (k === 2) speed = 2 * Math.floor(speed / 2) + 1; // odd → half remainder
  else speed = 4 * Math.floor(speed / 4) + 2; // → .5 remainder
  const distNum = speed; // distance = speed × 1/k
  const whole = Math.floor(distNum / k);
  const fracPart = k === 2 ? '1/2' : '1/2'; // remainder .5 either way
  const distStr = `${whole} \\frac{1}{2}`;
  void fracPart;
  return {
    itemType: 'GR',
    context: `An airplane traveled ${whole} 1/2 miles in 1/${k} of an hour. What was the average speed, in miles per hour, of the airplane?`,
    question: `${distStr} \\div \\frac{1}{${k}}`,
    answer: num(speed),
    steps: [
      { number: 1, description: 'Write the distance as an improper fraction.', math: `${whole} \\frac{1}{2} = \\frac{${2 * whole + 1}}{2}` },
      { number: 2, description: `Divide by 1/${k}: multiply by ${k}.`, math: `\\frac{${2 * whole + 1}}{2} \\times ${k} = ${speed}` },
    ],
    hints: ['Dividing by a unit fraction is the same as multiplying by its denominator.'],
    timeEstimate: 70,
  };
};

// ── Q15-style GR: multi-digit division story ────────────────────────────
export const genLongDivision: ProblemFactory = (rng) => {
  const per = choice(rng, [150, 250, 125, 225, 175] as const);
  const days = randInt(rng, 9, 16);
  const total = per * days;
  const veh = choice(rng, ['delivery truck', 'tour bus', 'moving van'] as const);
  return {
    itemType: 'GR',
    context: `A ${veh} travels ${per} miles each day. How many days will it take the ${veh} to travel ${total.toLocaleString('en-US')} miles?`,
    question: `${total} \\div ${per}`,
    answer: num(days),
    steps: [
      { number: 1, description: 'Divide the total miles by the daily miles.', math: `${total} \\div ${per} = ${days}` },
    ],
    hints: ['Estimate: how many groups of the daily distance fit into the total?'],
    timeEstimate: 70,
  };
};

// ── Q17-style GR: fraction area ÷ fraction width ────────────────────────
export const genFractionAreaLength: ProblemFactory = (rng) => {
  const lenHalf = randInt(rng, 5, 14); // length = lenHalf + 0.5? keep integer or .5
  const len = choice(rng, [lenHalf, lenHalf + 0.5] as const);
  const wWhole = randInt(rng, 3, 9);
  const width = wWhole + 0.5;
  const area = len * width;
  const areaWhole = Math.floor(area);
  const areaFrac = area - areaWhole; // .25 or .75
  const fracStr = areaFrac === 0.25 ? '\\frac{1}{4}' : areaFrac === 0.75 ? '\\frac{3}{4}' : '\\frac{1}{2}';
  const fracPlain = areaFrac === 0.25 ? '1/4' : areaFrac === 0.75 ? '3/4' : '1/2';
  return {
    itemType: 'GR',
    context: `The area of a rectangle is ${areaWhole} ${fracPlain} square inches and its width is ${wWhole} 1/2 inches. What is the length, in inches, of the rectangle?`,
    question: `${areaWhole} ${fracStr} \\div ${wWhole} \\frac{1}{2}`,
    answer: num(len),
    steps: [
      { number: 1, description: 'Length = area ÷ width.', math: `${area.toFixed(2)} \\div ${width.toFixed(1)} = ${num(len)}` },
    ],
    hints: ['Convert the mixed numbers to decimals or improper fractions, then divide.'],
    timeEstimate: 80,
  };
};

// ── Q20-style GR: GCF & LCM, one number given, find the other ───────────
export const genGcfLcmOther: ProblemFactory = (rng) => {
  const g = choice(rng, [2, 3, 5] as const);
  const pairs: [number, number][] = [[2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [2, 7], [3, 7], [5, 6]];
  const [m1, m2] = choice(rng, pairs);
  const a = g * m1;
  const b = g * m2;
  const l = g * m1 * m2;
  return {
    itemType: 'GR',
    context: `The greatest common factor of two numbers is ${g}. The least common multiple of the two numbers is ${l}. One of the numbers is ${a}.`,
    question: '\\text{What is the other number?}',
    answer: num(b),
    steps: [
      { number: 1, description: 'For two numbers, GCF × LCM = product of the numbers.', math: `${g} \\times ${l} = ${g * l}` },
      { number: 2, description: `Divide by the known number.`, math: `${g * l} \\div ${a} = ${b}` },
    ],
    hints: ['Use GCF × LCM = first number × second number.'],
    timeEstimate: 60,
  };
};

// ── Q24-style MC + VIS stem: number-line hop model → expression ─────────
export const genHopModel: ProblemFactory = (rng) => {
  const first = randInt(rng, 2, 6);
  const second = -randInt(rng, first + 1, 7); // go left past zero
  const svg = hopModelSvg([first, second]);
  const absSecond = Math.abs(second);
  const correct = `${first} + (-${absSecond})`;
  const m = mcUnique(rng, correct, [
    `${first} - (-${absSecond})`,
    `${first} - ${absSecond === 3 ? 4 : 3}`, // subtraction with a DIFFERENT magnitude
    `${first} + (-${absSecond === 3 ? 4 : 3})`,
  ], (k) => `${first + k} + (-${absSecond})`);
  return {
    itemType: 'MC',
    context: 'A model of an expression is shown on the number line. Which expression is represented by this model?',
    question: '\\text{expression} = ?',
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `The first arrow starts at 0 and moves right ${first} units: +${first}.`, math: `+${first}` },
      { number: 2, description: `The second arrow moves left ${absSecond} units: adding a negative.`, math: `${first} + (-${absSecond})` },
    ],
    hints: ['Right arrows add positive values; left arrows add negative values.'],
    timeEstimate: 50,
  };
};

// ── Q34-style MC: temperature chains → order (prose choices) ────────────
export const genTempOrdering: ProblemFactory = (rng) => {
  const base = randInt(rng, 45, 65);
  const d1 = randInt(rng, 3, 9); // G cooler than F
  const d2 = randInt(rng, 3, 9); // H cooler than G
  const d3 = randInt(rng, 1, d1 + d2 - 1); // I warmer than H, but below F
  const F = base;
  const G = F - d1;
  const H = G - d2;
  const I = H + d3;
  // order coldest → warmest
  const cities = [
    { name: 'City F', t: F },
    { name: 'City G', t: G },
    { name: 'City H', t: H },
    { name: 'City I', t: I },
  ];
  const sorted = [...cities].sort((x, y) => x.t - y.t).map((c) => c.name.replace('City ', ''));
  const correct = sorted.join(', ');
  // build wrong orders
  const reversed = [...sorted].reverse().join(', ');
  const swap1 = [sorted[1], sorted[0], sorted[2], sorted[3]].join(', ');
  const swap2 = [sorted[0], sorted[2], sorted[1], sorted[3]].join(', ');
  const m = mcUnique(rng, correct, [reversed, swap1, swap2], (k) => [sorted[(k) % 4], sorted[(k + 1) % 4], sorted[(k + 2) % 4], sorted[(k + 3) % 4]].join(', '));
  return {
    itemType: 'MC',
    context: `The temperature in City F was ${F}°F. City G was ${d1}° cooler than City F. City H was ${d2}° cooler than City G. City I was ${d3}° warmer than City H. Which lists the cities in order from coldest to warmest?`,
    question: '\\text{coldest} \\rightarrow \\text{warmest}',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Compute each temperature: F = ${F}, G = ${G}, H = ${H}, I = ${I}.`, math: `${H} < ${[G, I].sort((x, y) => x - y)[0]} < ${[G, I].sort((x, y) => x - y)[1]} < ${F}` },
    ],
    hints: ['Find each city’s exact temperature before ordering.'],
    timeEstimate: 60,
  };
};

export const numberSystemFactories: ProblemFactory[] = [
  genTrueInequality,
  genCoordDistanceVertical,
  genPointAtDistance,
  genDecimalOps,
  genMixedDivFraction,
  genLongDivision,
  genFractionAreaLength,
  genGcfLcmOther,
  genHopModel,
  genTempOrdering,
];
