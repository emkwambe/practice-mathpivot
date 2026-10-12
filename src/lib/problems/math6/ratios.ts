// g6-ratios: ratios, unit rates, proportional reasoning, percents.
// Covers released items 18, 22, 28, 30, 31, 36, 37, 38, 39, 43, 44, 45 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt, gcd } from '../math1/rng';
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

const ratioStr = (a: number, b: number) => `${a} : ${b}`;

// ── Q18-style GR: ratio a:b, given one part, find the other ─────────────
export const genRatioFindPart: ProblemFactory = (rng) => {
  const a = randInt(rng, 2, 5);
  const b = randInt(rng, 2, 7);
  if (a === b) return genRatioFindPart(rng, 'medium');
  const k = randInt(rng, 2, 6);
  const boys = a * k;
  const girls = b * k;
  return {
    itemType: 'GR',
    context: `The ratio of boys to girls in a classroom is ${a} to ${b}. There are ${boys} boys in the classroom.`,
    question: '\\text{How many girls are in the classroom?}',
    answer: num(girls),
    steps: [
      { number: 1, description: `Each ratio group has ${boys} ÷ ${a} = ${k} students.`, math: `${boys} \\div ${a} = ${k}` },
      { number: 2, description: `Multiply the girls part by the group size.`, math: `${b} \\times ${k} = ${girls}` },
    ],
    hints: ['Find the value of one ratio part first.'],
    timeEstimate: 60,
  };
};

// ── Q22-style MC: part-to-part → part-to-total (prose choices) ──────────
export const genPartToTotal: ProblemFactory = (rng) => {
  const a = randInt(rng, 1, 4);
  const b = randInt(rng, 2, 6);
  if (a === b) return genPartToTotal(rng, 'medium');
  const total = a + b;
  const item1 = choice(rng, ['plain', 'chocolate', 'vanilla'] as const);
  const item2 = item1 === 'chocolate' ? 'strawberry' : 'chocolate';
  const correct = `${b} ${item2} milks for every ${total} milks ordered`;
  const m = mcUnique(rng, correct, [
    `${b} ${item2} milks for every ${a} milk${a > 1 ? 's' : ''} ordered`,
    `${a} ${item2} milks for every ${total} milks ordered`,
    `${total} ${item2} milks for every ${b} milks ordered`,
  ], (k) => `${b + k} ${item2} milks for every ${total + k} milks ordered`);
  return {
    itemType: 'MC',
    context: `At a cafeteria, the ratio of ${item1} milks to ${item2} milks ordered is ${a} to ${b}. Which statement describes the ratio of ${item2} milks to the total milks ordered?`,
    question: `\\text{${item2} : total = } ?`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Total parts = ${a} + ${b} = ${total}.`, math: `${item2} : \\text{total} = ${b} : ${total}` },
    ],
    hints: ['Add both parts to get the total.'],
    timeEstimate: 50,
  };
};

// ── Q28-style MC: proportional relationship, find y for a given x ───────
export const genProportionalTable: ProblemFactory = (rng) => {
  const k = randInt(rng, 2, 7);
  const x1 = choice(rng, [2, 3, 4] as const);
  const y1 = k * x1;
  const x2 = randInt(rng, 6, 12);
  const y2 = k * x2;
  const m = mcUnique(rng, num(y2), [
    num(y2 + x1),
    num(y1 + x2),
    num(k * (x2 + 1)),
  ], (kk) => num(y2 + 2 * kk + 1));
  return {
    itemType: 'MC',
    context: `y is proportional to x. When x = ${x1}, y = ${y1}.`,
    question: `\\text{When } x = ${x2}, \\text{ what is the value of } y?`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `The constant of proportionality is ${y1} ÷ ${x1} = ${k}.`, math: `y = ${k}x` },
      { number: 2, description: `Substitute x = ${x2}.`, math: `y = ${k} \\times ${x2} = ${y2}` },
    ],
    hints: ['Find k = y ÷ x from the known pair.'],
    timeEstimate: 50,
  };
};

// ── Q30-style MC: which ratio is NOT equivalent ─────────────────────────
export const genNotEquivalentRatio: ProblemFactory = (rng) => {
  let a = randInt(rng, 2, 9);
  let b = randInt(rng, 2, 9);
  const g0 = gcd(a, b);
  a /= g0;
  b /= g0;
  if (a === b) return genNotEquivalentRatio(rng, 'medium');
  const M = choice(rng, [4, 5, 6, 8] as const);
  const baseA = a * M;
  const baseB = b * M;
  // three equivalents with multipliers guaranteed different from M
  const equivs = [2 * M, 3 * M, 4 * M].map((k) => ratioStr(a * k, b * k));
  // the NOT-equivalent answer: break one term
  const wrongA = baseA + a * randInt(rng, 1, 3);
  const wrongB = baseB + b * randInt(rng, 2, 4);
  if (wrongA * b === wrongB * a) return genNotEquivalentRatio(rng, 'medium');
  const wrong = ratioStr(wrongA, wrongB);
  const m = mcUnique(rng, wrong, equivs, (k) => ratioStr(a * (11 + k), b * (11 + k)));
  return {
    itemType: 'MC',
    context: `A recipe uses ${baseA} cups of flour for every ${baseB} cups of sugar. Which ratio is NOT equivalent to ${baseA} : ${baseB}?`,
    question: `\\text{NOT equivalent to } ${baseA} : ${baseB} \\text{?}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Equivalent ratios multiply (or divide) both terms by the same number. Each correct choice reduces to ${a} : ${b}.`, math: `${baseA} : ${baseB} = ${a} : ${b}` },
      { number: 2, description: `${wrongA} : ${wrongB} does not reduce to ${a} : ${b}, so it is not equivalent.`, math: wrong },
    ],
    hints: ['Divide both terms of each choice by a common factor and compare.'],
    timeEstimate: 60,
  };
};

// ── Q31/Q36-style MC: part of a whole → percent (nearest whole percent) ─
export const genPercentOfWhole: ProblemFactory = (rng) => {
  const total = choice(rng, [40, 42, 50, 60, 80, 116, 120, 150, 200] as const);
  const pct = randInt(rng, 12, 88);
  const part = Math.round((pct / 100) * total);
  const actual = Math.round((part / total) * 100);
  const item = choice(rng, [
    { setup: `A collection has ${total} stamps. ${part} of them were given away.`, ask: 'what percent of the stamps were given away' },
    { setup: `A player attempted ${total} free throws and made ${part} of them.`, ask: 'what percent of the free throws were made' },
    { setup: `A quiz had ${total} problems. A student answered ${part} of them correctly.`, ask: 'what percent of the problems were answered correctly' },
  ] as const);
  const m = mcUnique(rng, `${actual}\\%`, [
    `${Math.max(1, actual - randInt(rng, 5, 12))}\\%`,
    `${Math.min(99, actual + randInt(rng, 5, 12))}\\%`,
    `${100 - actual}\\%`,
  ], (k) => `${Math.min(99, actual + 13 + k)}\\%`);
  return {
    itemType: 'MC',
    context: `${item.setup} To the nearest whole percent, ${item.ask}?`,
    question: '\\text{percent} = ?',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Write the part over the whole and convert to a percent.`, math: `\\frac{${part}}{${total}} \\approx ${(part / total).toFixed(3)} = ${actual}\\%` },
    ],
    hints: ['Divide the part by the total, then multiply by 100.'],
    timeEstimate: 60,
  };
};

// ── Q37/Q39-style MC: percent of a number ───────────────────────────────
export const genPercentOfNumber: ProblemFactory = (rng) => {
  const pct = choice(rng, [5, 10, 15, 20, 25, 30, 40, 60, 75, 80] as const);
  const base = choice(rng, [60, 80, 120, 160, 200, 240, 300, 480, 780] as const);
  const result = (pct * base) / 100;
  const m = mcUnique(rng, num(result), [
    num((pct * base) / 1000),
    num(result + pct),
    num(Math.round(base / pct)),
  ], (k) => num(result + 10 * k));
  return {
    itemType: 'MC',
    context: choice(rng, [
      `A store charges a ${pct}% tax on a $${base} purchase. How much is the tax?`,
      `A hiker has completed ${pct}% of a ${base}-mile trail. How many miles has she hiked?`,
      `A stadium seats ${base} people. If ${pct}% of the seats are filled, how many people are seated?`,
    ] as const),
    question: `${pct}\\% \\text{ of } ${base} = ?`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Convert the percent to a decimal and multiply.`, math: `${(pct / 100).toFixed(2).replace(/0+$/, '').replace(/\.$/, '')} \\times ${base} = ${num(result)}` },
    ],
    hints: ['Move the percent decimal two places left, then multiply.'],
    timeEstimate: 45,
  };
};

// ── Q38-style MC: proportional price scaling ────────────────────────────
export const genProportionalPrice: ProblemFactory = (rng) => {
  const per = choice(rng, [8, 12, 15, 18, 20, 25] as const);
  const len1 = choice(rng, [6, 8, 9, 10, 12] as const);
  const price1 = per * len1;
  const len2 = len1 + choice(rng, [6, 8, 10, 12] as const);
  const price2 = per * len2;
  const item = choice(rng, ['necklace chain', 'ribbon', 'rope', 'pipe'] as const);
  const m = mcUnique(rng, `\\$${price2}`, [
    `\\$${price1 + (len2 - len1)}`,
    `\\$${price2 - per * 2}`,
    `\\$${price2 + per * 3}`,
  ], (k) => `\\$${price2 + per * (3 + k)}`);
  return {
    itemType: 'MC',
    context: `The price of a ${item} is proportional to its length. A ${len1}-inch ${item} costs $${price1}.`,
    question: `\\text{Price of a ${len2}-inch ${item} = ?}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Price per inch = $${price1} ÷ ${len1} = $${per}.`, math: `\\frac{${price1}}{${len1}} = ${per}` },
      { number: 2, description: `Multiply by the new length.`, math: `${per} \\times ${len2} = ${price2}` },
    ],
    hints: ['Find the unit price first.'],
    timeEstimate: 55,
  };
};

// ── Q43-style MC: which student earned a given percent ──────────────────
export const genPercentFromScores: ProblemFactory = (rng) => {
  const pct = choice(rng, [72, 76, 80, 84, 88, 92] as const);
  const names = ['Ava', 'Malik', 'Sofia', 'Jayden'];
  const targetTotal = choice(rng, [25, 50] as const);
  const targetScore = (pct / 100) * targetTotal;
  const others: string[] = [];
  const used = new Set<number>([pct]);
  let guard = 0;
  while (others.length < 3 && guard++ < 60) {
    const t = choice(rng, [20, 25, 40, 50] as const);
    const s = randInt(rng, Math.floor(t * 0.5), t);
    const p = Math.round((s / t) * 100);
    if (used.has(p)) continue;
    used.add(p);
    others.push(`${s} out of ${t}`);
  }
  const entries = [`${targetScore} out of ${targetTotal}`, ...others];
  const idx = [0, 1, 2, 3];
  for (let i = idx.length - 1; i > 0; i--) {
    const j = randInt(rng, 0, i);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const lines = idx.map((e, i) => `${names[i]} answered ${entries[e]} questions correctly.`);
  const correctName = names[idx.indexOf(0)];
  const m = mcUnique(rng, `\\text{${correctName}}`, names.filter((n) => n !== correctName).map((n) => `\\text{${n}}`), (k) => `\\text{Student ${k}}`);
  return {
    itemType: 'MC',
    context: `Four students took a quiz. ${lines.join(' ')}`,
    question: `\\text{Who answered } ${pct}\\% \\text{ of the questions correctly?}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Convert each score to a percent: part ÷ total × 100.`, math: `\\frac{${targetScore}}{${targetTotal}} = ${pct}\\%` },
    ],
    hints: ['A score of a out of b is (a ÷ b) × 100 percent.'],
    timeEstimate: 60,
  };
};

// ── Q44-style MC: Venn-style one-color vs both-colors ratio ─────────────
export const genVennRatio: ProblemFactory = (rng) => {
  // a only-X, b only-Y, c both; answer (a+b):c simplified — ensure gcd > 1
  let a = 0, b = 0, c = 0, g = 1;
  let guard = 0;
  while (g < 2 && guard++ < 200) {
    a = randInt(rng, 6, 18);
    b = randInt(rng, 4, 14);
    c = randInt(rng, 6, 16);
    g = gcd(a + b, c);
  }
  const sa = (a + b) / g;
  const sc = c / g;
  const thing = choice(rng, [
    { one: 'yellow markings', two: 'red markings', whole: 'bugs in a collection' },
    { one: 'stripes', two: 'spots', whole: 'fish in a tank' },
    { one: 'wheels painted black', two: 'wheels painted silver', whole: 'model cars' },
  ] as const);
  const correct = ratioStr(sa, sc);
  const m = mcUnique(rng, correct, [
    ratioStr(sc, sa),
    ratioStr(sa, sa + sc),
    ratioStr(a, c),
  ], (k) => ratioStr(sa + k, sc));
  return {
    itemType: 'MC',
    context: `${a} ${thing.whole} have only ${thing.one}, ${b} have only ${thing.two}, and ${c} have both. What is the ratio of those with markings of one color to those with markings of both colors?`,
    question: '\\text{one color : both colors} = ?',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `One color total = ${a} + ${b} = ${a + b}.`, math: `${a + b} : ${c}` },
      { number: 2, description: `Divide both terms by ${g}.`, math: `${sa} : ${sc}` },
    ],
    hints: ['Add the two single-color groups, then simplify the ratio.'],
    timeEstimate: 60,
  };
};

// ── Q45-style MC: approximate rate over a different span ────────────────
export const genApproxRate: ProblemFactory = (rng) => {
  const days1 = choice(rng, [28, 31, 29, 35] as const);
  const per6 = randInt(rng, 8, 14); // target cans per 6 days
  const total = Math.round((per6 * days1) / 6);
  const days2 = choice(rng, [5, 6, 7] as const);
  const approx = Math.round((total / days1) * days2);
  const m = mcUnique(rng, num(approx), [
    num(Math.round(total / days2)),
    num(approx + randInt(rng, 6, 10)),
    num(Math.max(1, approx - randInt(rng, 4, 6))),
  ], (k) => num(approx + 11 + k));
  return {
    itemType: 'MC',
    context: `A dog ate ${total} cans of food in ${days1} days. At this rate, approximately how many cans would the dog be expected to eat in ${days2} days?`,
    question: '\\text{approximately } ? \\text{ cans}',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Daily rate ≈ ${total} ÷ ${days1} ≈ ${(total / days1).toFixed(1)} cans per day.`, math: `\\frac{${total}}{${days1}} \\approx ${(total / days1).toFixed(1)}` },
      { number: 2, description: `Multiply by ${days2} days.`, math: `${(total / days1).toFixed(1)} \\times ${days2} \\approx ${approx}` },
    ],
    hints: ['Estimate the daily rate, then scale to the new number of days.'],
    timeEstimate: 60,
  };
};

export const ratioFactories: ProblemFactory[] = [
  genRatioFindPart,
  genPartToTotal,
  genProportionalTable,
  genNotEquivalentRatio,
  genPercentOfWhole,
  genPercentOfWhole, // released form weights percent-of-whole twice (Q31 + Q36)
  genPercentOfNumber,
  genPercentOfNumber, // Q37 + Q39
  genProportionalPrice,
  genPercentFromScores,
  genVennRatio,
  genApproxRate,
];
