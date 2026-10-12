// g7-ratios-proportions: unit rates with fractions, proportional graphs,
// tables → equations, percent problems, ratio chains.
// Covers released items 6, 8, 13, 18, 20, 21, 28, 32, 34, 38, 43, 44 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt } from '../math1/rng';
import { gcd } from '../math1/rng';
import { frac, mc, money, num } from '../math1/latex';
import { lineGraphSvg } from './svg';

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

// ── Q6/Q43-style GR: unit rate with fractions → distance in n hours ─────
export const genUnitRateFractions: ProblemFactory = (rng) => {
  // trip: a/b mile in 1/d hour → speed = a·d/b mph (must be a whole number)
  let a = 1, b = 2, d = 2, u = 1;
  for (let tries = 0; tries < 60; tries++) {
    a = randInt(rng, 1, 5);
    b = randInt(rng, 2, 6);
    d = randInt(rng, 2, 6);
    if (a < b && gcd(a, b) === 1 && (a * d) % b === 0) {
      u = (a * d) / b;
      break;
    }
  }
  const n = choice(rng, [2, 3, 4]);
  const ans = u * n;
  return {
    itemType: 'GR',
    context: `A cyclist travels ${a}/${b} mile in 1/${d} hour at a constant speed. At this rate, how many miles does the cyclist travel in ${n} hours?`,
    question: '\\text{miles}',
    answer: num(ans),
    steps: [
      { number: 1, description: 'Find the unit rate (miles per 1 hour).', math: `${frac(a, b)} \\div ${frac(1, d)} = ${frac(a, b)} \\times ${d} = ${u} \\text{ mph}` },
      { number: 2, description: `Multiply by ${n} hours.`, math: `${u} \\times ${n} = ${ans}` },
    ],
    hints: ['Unit rate = miles ÷ hours. Dividing by a fraction = multiplying by its reciprocal.'],
    timeEstimate: 90,
  };
};

// ── Q44-style MC: (a/b) mile per (c/b) hour → miles per hour ────────────
export const genRateDivision: ProblemFactory = (rng) => {
  const b = choice(rng, [3, 4, 5, 6]);
  let a = randInt(rng, 3, 8);
  if (a % b === 0) a += 1; // keep the distance a proper-looking fraction
  const c = randInt(rng, 2, Math.min(5, a - 1));
  const correct = frac(a, c);
  const m = mcUnique(rng, correct, [
    frac(c, a),
    frac(a * c, b),
    frac(a, b * c),
    frac(a + b, c),
  ], (k) => frac(a + k * c, c));
  return {
    itemType: 'MC',
    context: `A snail crawls ${a}/${b} mile in ${c}/${b} hour. Which expression gives the snail's speed in miles per hour, and what is it?`,
    question: `${frac(a, b)} \\div ${frac(c, b)}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Speed = distance ÷ time; dividing fractions means multiplying by the reciprocal.', math: `${frac(a, b)} \\times ${frac(b, c)} = ${correct}` },
    ],
    hints: ['The denominators cancel when you multiply by the reciprocal.'],
    timeEstimate: 60,
  };
};

// ── Q13-style MC: earnings table → equation e = kh ──────────────────────
export const genTableToEquation: ProblemFactory = (rng) => {
  const k = choice(rng, [3, 4, 5, 6, 7, 8, 9, 12, 15]);
  const hs = [2, 5, 8];
  const rows = hs.map((h) => `${h} & ${k * h}`).join(' \\\\ ');
  const table = `\\begin{array}{c|c} \\text{Hours} & \\text{Earnings (\\$)} \\\\ \\hline ${rows} \\end{array}`;
  const correct = `e = ${k}h`;
  const m = mc(rng, correct, [
    `e = h + ${k}`,
    `e = ${k + 1}h`,
    `e = ${k} + h`,
  ]);
  return {
    itemType: 'MC',
    context: 'The table shows the relationship between hours worked, h, and earnings, e. Which equation represents the relationship?',
    question: table,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Each earning value is the same multiple of the hours.', math: `${k * 2} \\div 2 = ${k},\\quad ${k * 5} \\div 5 = ${k},\\quad ${k * 8} \\div 8 = ${k}` },
      { number: 2, description: 'Write earnings = k × hours.', math: correct },
    ],
    hints: ['Divide any earnings value by its hours value to find the constant.'],
    timeEstimate: 60,
  };
};

// ── Q21-style MC: estimate a 15% tip ────────────────────────────────────
export const genTipEstimate: ProblemFactory = (rng) => {
  const bill = randInt(rng, 1480, 4200) / 100;
  const tip = bill * 0.15;
  const correct = `\\$${money(Math.round(tip))}`;
  const m = mcUnique(rng, correct, [
    `\\$${money(Math.round(bill * 0.10))}`,
    `\\$${money(Math.round(bill * 0.20))}`,
    `\\$${money(Math.round(tip) + randInt(rng, 4, 8))}`,
  ], (k) => `\\$${money(Math.round(tip) + 2 * k + 1)}`);
  return {
    itemType: 'MC',
    context: `A meal costs $${money(bill)}. Which is the best estimate of a 15% tip?`,
    question: `15\\% \\text{ of } \\$${money(bill)}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: '10% of the bill.', math: `\\$${money(bill / 10)}` },
      { number: 2, description: '5% is half of that; add for 15%.', math: `${money(bill / 10)} + ${money(bill / 20)} \\approx ${money(Math.round(tip))}` },
    ],
    hints: ['Break 15% into 10% + 5%.'],
    timeEstimate: 60,
  };
};

// ── Q34-style MC: percent discount from original vs sale price ──────────
export const genPercentDiscount: ProblemFactory = (rng) => {
  const pct = choice(rng, [10, 20, 25, 30, 40]);
  const orig = choice(rng, [20, 24, 30, 40, 48, 50, 60, 80]);
  const sale = orig * (1 - pct / 100);
  const correct = `${pct}\\%`;
  const m = mcUnique(rng, correct, [
    `${pct + 10}\\%`,
    `${Math.max(pct - 10, 5)}\\%`,
    `${pct * 2}\\%`,
  ], (k) => `${pct + 5 * k + 10}\\%`);
  return {
    itemType: 'MC',
    context: `A jacket originally costs $${orig}. It is on sale for $${num(sale)}. What is the percent discount?`,
    question: `${orig} \\to ${num(sale)}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Find the discount amount.', math: `${orig} - ${num(sale)} = ${num(orig - sale)}` },
      { number: 2, description: 'Divide by the original price.', math: `\\frac{${num(orig - sale)}}{${orig}} = ${pct}\\%` },
    ],
    hints: ['Percent discount = discount ÷ original price.'],
    timeEstimate: 60,
  };
};

// ── Q20-style MC: ratio chain a:b and b:c ───────────────────────────────
export const genRatioChain: ProblemFactory = (rng) => {
  const ab = choice(rng, [[2, 3], [3, 4], [2, 5], [3, 5]] as const);
  const bc = choice(rng, [[2, 1], [3, 2], [4, 3]] as const);
  // a:b = ab[0]:ab[1], b:c = bc[0]:bc[1]; make b common: lcm
  const bVal = ab[1] * bc[0];
  const aVal = ab[0] * bc[0];
  const cVal = ab[1] * bc[1];
  const given = aVal * choice(rng, [2, 3, 4]);
  const ans = (given / aVal) * cVal;
  const m = mcUnique(rng, num(ans), [
    num(ans + bc[1]),
    num((given / aVal) * ab[1]),
    num(given - aVal + cVal),
    num(ans + aVal),
  ], (k) => num(ans + bc[1] + k));
  return {
    itemType: 'MC',
    context: `The ratio of red marbles to blue marbles is ${ab[0]}:${ab[1]}. The ratio of blue marbles to green marbles is ${bc[0]}:${bc[1]}. If there are ${given} red marbles, how many green marbles are there?`,
    question: `${ab[0]}:${ab[1]} \\text{ and } ${bc[0]}:${bc[1]}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Make the blue values match.', math: `\\text{red:blue:green} = ${aVal}:${bVal}:${cVal}` },
      { number: 2, description: 'Scale so red equals the given amount.', math: `${given} \\div ${aVal} = ${num(given / aVal)} \\Rightarrow ${num(given / aVal)} \\times ${cVal} = ${num(ans)}` },
    ],
    hints: ['Rewrite both ratios with the same middle (blue) number.'],
    timeEstimate: 90,
  };
};

// ── Q8-style MC + VIS: proportional graph → equation S = kw ─────────────
export const genGraphToEquation: ProblemFactory = (rng) => {
  const k = choice(rng, [2, 3, 4, 5, 6]);
  const wMax = 10;
  const svg = lineGraphSvg({ xLabel: 'w', yLabel: 'S', xMax: wMax, yMax: k * wMax, mark: { x: 4, y: 4 * k } });
  const correct = `S = ${k}w`;
  const m = mc(rng, correct, [
    `S = w + ${k}`,
    `S = ${k + 1}w`,
    `S = ${k}w + 1`,
  ]);
  return {
    itemType: 'MC',
    context: 'The graph shows the relationship between w and S. Which equation represents the relationship?',
    question: 'S = \\,?',
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'The graph passes through the marked point — divide S by w.', math: `${4 * k} \\div 4 = ${k}` },
      { number: 2, description: 'A proportional graph through the origin has equation S = kw.', math: correct },
    ],
    hints: ['Pick a clear grid point on the line and compute S ÷ w.'],
    timeEstimate: 60,
  };
};

// ── Q28/Q38-style MC + VIS: unit price from a proportional graph ────────
export const genGraphUnitPrice: ProblemFactory = (rng) => {
  const n = choice(rng, [4, 5, 8, 10]);
  const cents = choice(rng, [25, 40, 50, 60, 75, 80]);
  const total = (n * cents) / 100;
  const svg = lineGraphSvg({
    xLabel: 'Number of items',
    yLabel: 'Cost ($)',
    xMax: n * 2,
    yMax: Math.ceil((total * 2) / 5) * 5,
    mark: { x: n, y: total },
  });
  const correct = `\\$${money(cents / 100)}`;
  const m = mc(rng, correct, [
    `\\$${money(total)}`,
    `\\$${money((cents / 100) * 2)}`,
    `\\$${money(Math.max((cents - 15) / 100, 0.05))}`,
  ]);
  return {
    itemType: 'MC',
    context: 'The graph shows the cost of items at a store. What is the unit price per item, to the nearest cent?',
    question: '\\text{unit price} = \\,?',
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Read the marked point.', math: `${n} \\text{ items cost } \\$${money(total)}` },
      { number: 2, description: 'Unit price = cost ÷ items.', math: `${money(total)} \\div ${n} = \\$${money(cents / 100)}` },
    ],
    hints: ['Find a point on the line with whole-number coordinates, then divide.'],
    timeEstimate: 60,
  };
};

// ── Q32-style MC + VIS: verbal rate vs graph — which is faster ──────────
export const genRateCompare: ProblemFactory = (rng) => {
  const verbal = randInt(rng, 4, 9); // laps per minute
  const graphRate = verbal + choice(rng, [-2, -1, 1, 2]);
  const svg = lineGraphSvg({
    xLabel: 'Time (minutes)',
    yLabel: 'Laps',
    xMax: 5,
    yMax: graphRate * 5,
  });
  const faster = graphRate > verbal ? 'The swimmer shown in the graph' : 'The swimmer who swims ' + verbal + ' laps per minute';
  const slower = graphRate > verbal ? 'The swimmer who swims ' + verbal + ' laps per minute' : 'The swimmer shown in the graph';
  const m = mc(rng, faster, [
    slower,
    'They swim at the same rate',
    'There is not enough information to compare the rates',
  ]);
  return {
    itemType: 'MC',
    context: `One swimmer swims at a constant rate of ${verbal} laps per minute. The graph shows another swimmer's laps over time. Which statement is true?`,
    question: '\\text{Compare the rates.}',
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'The graph passes through (5, ' + graphRate * 5 + '), so its rate is:', math: `${graphRate * 5} \\div 5 = ${graphRate} \\text{ laps per minute}` },
      { number: 2, description: 'Compare the two rates.', math: `${graphRate} ${graphRate > verbal ? '>' : '<'} ${verbal}` },
    ],
    hints: ['Get the graph\'s unit rate from a clear grid point.'],
    timeEstimate: 75,
  };
};

// ── Q18-style MC + VIS: table vs graph unit prices ──────────────────────
export const genTableVsGraph: ProblemFactory = (rng) => {
  const storeA = choice(rng, [2, 3, 4, 5]); // $ per item from table
  const storeB = storeA + choice(rng, [-1, 1]);
  const rows = [2, 4, 6].map((q) => `${q} & ${q * storeA}`).join(' \\\\ ');
  const table = `\\begin{array}{c|c} \\text{Items} & \\text{Cost (\\$)} \\\\ \\hline ${rows} \\end{array}`;
  const svg = lineGraphSvg({ xLabel: 'Items', yLabel: 'Cost ($)', xMax: 6, yMax: Math.ceil((6 * Math.max(storeA, storeB) + 2) / 5) * 5, end: { x: 6, y: 6 * storeB } });
  const cheaper = storeA < storeB ? 'Store F has the lower unit price' : 'Store N has the lower unit price';
  const other = storeA < storeB ? 'Store N has the lower unit price' : 'Store F has the lower unit price';
  const m = mc(rng, cheaper, [
    other,
    'Both stores have the same unit price',
    'The unit prices cannot be compared',
  ]);
  return {
    itemType: 'MC',
    context: 'The table shows prices at Store F, and the graph shows prices at Store N. Which statement about the unit prices is true?',
    question: table,
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Store F unit price from the table.', math: `${2 * storeA} \\div 2 = \\$${storeA} \\text{ per item}` },
      { number: 2, description: 'Store N unit price from the graph.', math: `${6 * storeB} \\div 6 = \\$${storeB} \\text{ per item}` },
    ],
    hints: ['Compute each store\'s cost per 1 item, then compare.'],
    timeEstimate: 90,
  };
};

export const ratioFactories: ProblemFactory[] = [
  genUnitRateFractions,
  genRateDivision,
  genTableToEquation,
  genTipEstimate,
  genPercentDiscount,
  genRatioChain,
  genGraphToEquation,
  genGraphUnitPrice,
  genRateCompare,
  genTableVsGraph,
];
