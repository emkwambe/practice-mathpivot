// g7-statistics: sampling, box plots, mean/MAD/median comparisons from
// tables, simulation-based expectations.
// Covers released items 5, 7, 16, 26, 27, 39 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt, shuffle } from '../math1/rng';
import { mc, num } from '../math1/latex';
import { boxPlotSvg, type BoxPlotData } from './svg';

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

function tableLatex(rows: [string, string][], h1: string, h2: string): string {
  const body = rows.map(([a, b]) => `${a} & ${b}`).join(' \\\\ ');
  return `\\begin{array}{c|c} \\text{${h1}} & \\text{${h2}} \\\\ \\hline ${body} \\end{array}`;
}

function mean(xs: number[]): number {
  return xs.reduce((s, v) => s + v, 0) / xs.length;
}

function mad(xs: number[]): number {
  const m = mean(xs);
  return mean(xs.map((x) => Math.abs(x - m)));
}

// ── Q7-style MC: best survey strategy (plain-prose choices) ─────────────
export const genSurveyStrategy: ProblemFactory = (rng) => {
  const ctx = choice(rng, [
    { place: 'a middle school', unit: 'students', topic: 'favorite school lunch' },
    { place: 'a city', unit: 'residents', topic: 'support for a new park' },
    { place: 'a factory', unit: 'workers', topic: 'preferred shift times' },
  ] as const);
  const correct = `Survey a random sample of ${ctx.unit} from all of ${ctx.place}`;
  const m = mc(rng, correct, [
    `Survey every ${ctx.unit.slice(0, -1)} who arrives first on Monday`,
    `Survey only the ${ctx.unit} in one small group at ${ctx.place}`,
    `Survey ${ctx.unit} who volunteer to answer`,
  ]);
  return {
    itemType: 'MC',
    context: `A researcher wants to know the ${ctx.topic} of ${ctx.unit} at ${ctx.place}. Which method gives the most representative sample?`,
    question: '\\text{most representative sample?}',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'A representative sample must be random and drawn from the whole population.', math: '\\text{random sample of the whole population}' },
    ],
    hints: ['Avoid convenience groups and volunteers — they bias the results.'],
    timeEstimate: 60,
  };
};

// ── Q5-style MC + VIS: compare two box plots ────────────────────────────
export const genBoxPlotCompare: ProblemFactory = (rng) => {
  const mk = (): BoxPlotData => {
    const min = randInt(rng, 0, 10);
    const q1 = min + randInt(rng, 2, 6);
    const med = q1 + randInt(rng, 1, 5);
    const q3 = med + randInt(rng, 1, 5);
    const max = q3 + randInt(rng, 2, 6);
    return { label: '', min, q1, med, q3, max };
  };
  // Regenerate until every fixed distractor is genuinely false:
  //  - medians differ ("same median" distractor)
  //  - ranges differ AND IQRs differ with OPPOSITE signs, so neither
  //    "ranges equal but IQRs differ" nor "A greater range AND greater IQR"
  //    can accidentally be true alongside the keyed answer.
  let a = mk();
  let b = mk();
  for (let tries = 0; tries < 60; tries++) {
    const dRange = a.max - a.min - (b.max - b.min);
    const dIqr = a.q3 - a.q1 - (b.q3 - b.q1);
    if (a.med !== b.med && dRange !== 0 && dIqr !== 0 && dRange * dIqr < 0) break;
    a = mk();
    b = mk();
  }
  a.label = 'Class A';
  b.label = 'Class B';
  const iqrA = a.q3 - a.q1;
  const iqrB = b.q3 - b.q1;
  const rangeA = a.max - a.min;
  const rangeB = b.max - b.min;
  const svg = boxPlotSvg(a, b);
  const correct =
    iqrA === iqrB
      ? 'Both classes have the same interquartile range'
      : iqrA > iqrB
        ? `Class A has a greater interquartile range (${iqrA} vs ${iqrB})`
        : `Class B has a greater interquartile range (${iqrB} vs ${iqrA})`;
  const m = mc(rng, correct, [
    `Class A has a greater range (${rangeA} vs ${rangeB}) and a greater interquartile range`,
    'Both classes have the same median',
    `The ranges are equal but the interquartile ranges differ`,
  ]);
  return {
    itemType: 'MC',
    context: 'The box plots show quiz scores for two classes. Which statement about the spreads is true?',
    question: '\\text{IQR} = Q_3 - Q_1',
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Read the quartiles from each box.', math: `A: ${a.q1}, ${a.q3} \\Rightarrow IQR ${iqrA};\\quad B: ${b.q1}, ${b.q3} \\Rightarrow IQR ${iqrB}` },
    ],
    hints: ['The box length is the IQR; whisker-to-whisker is the range.'],
    timeEstimate: 75,
  };
};

// ── Q16-style MC: compare mean and MAD of two classes (table) ───────────
export const genMeanMADTable: ProblemFactory = (rng) => {
  // Class A tightly clustered, Class B spread out, same mean
  const m0 = choice(rng, [70, 75, 80, 85]);
  const aDev = choice(rng, [2, 4]);
  const bDev = choice(rng, [8, 10, 12]);
  const A = [m0 - aDev, m0, m0 + aDev, m0 - aDev, m0 + aDev];
  const B = [m0 - bDev, m0 - bDev, m0, m0 + bDev, m0 + bDev];
  const table = tableLatex(
    A.map((v, i) => [String(v), String(B[i])] as [string, string]),
    'Class A',
    'Class B',
  );
  const correct = 'The means are equal, and Class B has a greater mean absolute deviation';
  const m = mc(rng, correct, [
    'Class B has a greater mean and a greater mean absolute deviation',
    'The means are equal, and Class A has a greater mean absolute deviation',
    'Class A has a greater mean, and the MADs are equal',
  ]);
  return {
    itemType: 'MC',
    context: 'The table shows five quiz scores from each of two classes. Which statement correctly compares the means and mean absolute deviations?',
    question: table,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Both means.', math: `\\bar{x}_A = ${num(mean(A))},\\quad \\bar{x}_B = ${num(mean(B))}` },
      { number: 2, description: 'MAD of each class.', math: `MAD_A = ${num(mad(A))},\\quad MAD_B = ${num(mad(B))}` },
    ],
    hints: ['MAD = mean of the distances from the mean.'],
    timeEstimate: 90,
  };
};

// ── Q26-style MC: compare mean and median of two classes (table) ────────
export const genMeanMedianTable: ProblemFactory = (rng) => {
  const base = randInt(rng, 6, 9);
  const A = [base - 2, base - 1, base, base + 1, base + 6]; // mean pulled up
  const B = [base - 1, base, base, base + 1, base + 2];
  const table = tableLatex(
    A.map((v, i) => [String(v), String(B[i])] as [string, string]),
    'Team A',
    'Team B',
  );
  const meanA = num(mean(A));
  const meanB = num(mean(B));
  const medA = base;
  const medB = base;
  const correct = `Team A has a greater mean (${meanA} vs ${meanB}), and the medians are equal`;
  const m = mc(rng, correct, [
    `Team B has a greater mean, and Team A has a greater median`,
    `The means are equal, and Team A has a greater median`,
    `Team A has a greater mean and a greater median`,
  ]);
  return {
    itemType: 'MC',
    context: 'The table shows points scored by two teams in five games. Which statement correctly compares the means and medians?',
    question: table,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Compute both means.', math: `\\bar{x}_A = ${meanA},\\quad \\bar{x}_B = ${meanB}` },
      { number: 2, description: 'Middle value of each ordered set.', math: `\\text{med}_A = ${medA},\\quad \\text{med}_B = ${medB}` },
    ],
    hints: ['One high score pulls the mean up but not the median.'],
    timeEstimate: 75,
  };
};

// ── Q39-style MC: compare means of two data sets ────────────────────────
export const genMeanCompare: ProblemFactory = (rng) => {
  const m1 = randInt(rng, 10, 20);
  const m2 = m1 + choice(rng, [-4, -3, 3, 4]);
  const mk = (m: number) => {
    const devs = shuffle(rng, [-3, -1, 0, 1, 3]);
    return devs.map((d) => m + d);
  };
  const A = mk(m1);
  const B = mk(m2);
  const table = tableLatex(
    A.map((v, i) => [String(v), String(B[i])] as [string, string]),
    'Set 1',
    'Set 2',
  );
  const diff = Math.abs(m1 - m2);
  const correct = m1 > m2 ? `The mean of Set 1 is ${diff} greater than the mean of Set 2` : `The mean of Set 2 is ${diff} greater than the mean of Set 1`;
  const m = mc(rng, correct, [
    m1 > m2 ? `The mean of Set 2 is ${diff} greater than the mean of Set 1` : `The mean of Set 1 is ${diff} greater than the mean of Set 2`,
    `The means of the two sets are equal`,
    `The mean of Set 1 is ${diff * 5} greater than the mean of Set 2`,
  ]);
  return {
    itemType: 'MC',
    context: 'The table shows two data sets. Which statement about the means is true?',
    question: table,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Add each set and divide by 5.', math: `\\bar{x}_1 = ${m1},\\quad \\bar{x}_2 = ${m2}` },
    ],
    hints: ['Compare totals first — both sets have the same count.'],
    timeEstimate: 60,
  };
};

// ── Q27-style MC: simulation frequency table → expected count ───────────
export const genSimulationExpected: ProblemFactory = (rng) => {
  const trials = choice(rng, [20, 25, 40, 50]);
  const successes = randInt(rng, Math.floor(trials * 0.15), Math.floor(trials * 0.6));
  const more = choice(rng, [60, 80, 100, 120]);
  const expected = Math.round((successes / trials) * more);
  const rows: [string, string][] = [
    ['Trials', String(trials)],
    ['Successes', String(successes)],
  ];
  const m = mcUnique(rng, num(expected), [
    num(Math.round(((successes + 5) / trials) * more)),
    num(successes + more),
    num(Math.round((successes / trials) * more * 2)),
  ], (k) => num(expected + 3 * k));
  return {
    itemType: 'MC',
    context: `A simulation of an event produced the results shown. Based on the simulation, how many times would the event be expected to occur in ${more} more trials?`,
    question: tableLatex(rows, 'Result', 'Count'),
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Experimental probability from the simulation.', math: `${successes}/${trials}` },
      { number: 2, description: `Scale to ${more} trials.`, math: `${successes}/${trials} \\times ${more} = ${num(Math.round((successes / trials) * more * 100) / 100)} \\approx ${expected}` },
    ],
    hints: ['Expected count = (successes ÷ trials) × new trials.'],
    timeEstimate: 60,
  };
};

export const statisticsFactories: ProblemFactory[] = [
  genSurveyStrategy,
  genBoxPlotCompare,
  genMeanMADTable,
  genMeanMedianTable,
  genMeanCompare,
  genSimulationExpected,
];
