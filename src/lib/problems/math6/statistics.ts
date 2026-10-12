// g6-statistics: mean (incl. money rounding), lowest-score-for-mean, box plots, dot plots.
// Covers released items 19, 25, 26, 32, 40, 41 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt } from '../math1/rng';
import { mc, num } from '../math1/latex';
import { dotPlotSvg, singleBoxPlotSvg, type SingleBoxData } from './svg';

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

// ── Q19-style GR (money): mean of weekly deposits, nearest cent ─────────
export const genMeanDeposits: ProblemFactory = (rng) => {
  const cents = () => randInt(rng, 1500, 6500);
  const vals = [cents(), cents(), cents(), cents()];
  const mean = vals.reduce((s, v) => s + v, 0) / 4 / 100;
  const answer = mean.toFixed(2);
  const fmt = (c: number) => `$${(c / 100).toFixed(2)}`;
  return {
    itemType: 'GR',
    context: `Lisa deposited money into her savings account each week for four weeks: ${vals.map(fmt).join(', ')}. To the nearest cent, what was Lisa's mean weekly deposit? (Express the answer as dollars.cents.)`,
    question: '\\text{mean deposit} = ?',
    answer,
    steps: [
      { number: 1, description: 'Add the deposits.', math: `\\text{sum} = \\$${(vals.reduce((s, v) => s + v, 0) / 100).toFixed(2)}` },
      { number: 2, description: 'Divide by 4 and round to the nearest cent.', math: `\\$${(vals.reduce((s, v) => s + v, 0) / 100).toFixed(2)} \\div 4 = \\$${answer}` },
    ],
    hints: ['Mean = total ÷ number of weeks. Round only at the end.'],
    timeEstimate: 70,
  };
};

// ── Q25-style MC: lowest 6th score for a target mean ────────────────────
export const genLowestScoreSix: ProblemFactory = (rng) => {
  const target = choice(rng, [75, 78, 80, 82, 85] as const);
  const scores = [randInt(rng, 60, 95), randInt(rng, 60, 95), randInt(rng, 60, 95), randInt(rng, 60, 95), randInt(rng, 60, 95)];
  const sum = scores.reduce((s, v) => s + v, 0);
  const need = 6 * target - sum;
  if (need < 40 || need > 98) return genLowestScoreSix(rng, 'medium');
  const m = mcUnique(rng, num(need), [
    num(need + 2),
    num(need - 2),
    num(target),
  ], (k) => num(need + 4 + 2 * k));
  return {
    itemType: 'MC',
    context: `A student made these scores on 5 quizzes: ${scores.join(', ')}. What is the lowest score the student could get on the 6th quiz to have an unrounded average of at least ${target}?`,
    question: `\\text{6th score} \\geq \\, ?`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `An average of ${target} over 6 quizzes needs a total of ${6 * target}.`, math: `6 \\times ${target} = ${6 * target}` },
      { number: 2, description: `The first 5 quizzes sum to ${sum}.`, math: `${6 * target} - ${sum} = ${need}` },
    ],
    hints: ['Work backward from the total points needed.'],
    timeEstimate: 70,
  };
};

// ── Q40-style MC: lowest 4th test score for a target mean ───────────────
export const genLowestScoreFour: ProblemFactory = (rng) => {
  const target = choice(rng, [85, 88, 90, 92] as const);
  const scores = [randInt(rng, 80, 99), randInt(rng, 80, 99), randInt(rng, 80, 99)];
  const sum = scores.reduce((s, v) => s + v, 0);
  const need = 4 * target - sum;
  if (need < 50 || need > 100) return genLowestScoreFour(rng, 'medium');
  const m = mcUnique(rng, num(need), [
    num(need + 2),
    num(need - 2),
    num(target),
  ], (k) => num(need - 4 - 2 * k));
  return {
    itemType: 'MC',
    context: `A student scored ${scores.join(', ')} on 3 tests. What is the lowest score the student can earn on the 4th test to have an unrounded average of at least ${target}?`,
    question: `\\text{4th test} \\geq \\, ?`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Total needed for an average of ${target} over 4 tests.`, math: `4 \\times ${target} = ${4 * target}` },
      { number: 2, description: `Subtract the known sum ${sum}.`, math: `${4 * target} - ${sum} = ${need}` },
    ],
    hints: ['Multiply the target average by the number of tests first.'],
    timeEstimate: 70,
  };
};

// ── Q26-style MC + VIS choices: which box plot matches the data ─────────
export const genBoxPlotMatch: ProblemFactory = (rng) => {
  const data = Array.from({ length: 7 }, () => randInt(rng, 60, 100)).sort((a, b) => a - b);
  const correct: SingleBoxData = { min: data[0], q1: data[1], med: data[3], q3: data[5], max: data[6] };
  const wrong1: SingleBoxData = { ...correct, med: data[2] === correct.med ? data[4] : data[2] };
  const wrong2: SingleBoxData = { ...correct, q1: data[2], q3: data[4] };
  const wrong3: SingleBoxData = { ...correct, max: Math.min(100, correct.max + 4), min: Math.max(50, correct.min - 4) };
  const variants = [correct, wrong1, wrong2, wrong3];
  // drop any variant identical to the correct one
  const key = (d: SingleBoxData) => `${d.min},${d.q1},${d.med},${d.q3},${d.max}`;
  const ck = key(correct);
  const distinct = variants.filter((d, i) => i === 0 || key(d) !== ck);
  while (distinct.length < 4) {
    const fudge: SingleBoxData = { ...correct, q3: Math.min(100, correct.q3 + distinct.length + 1) };
    if (key(fudge) !== ck && !distinct.some((d) => key(d) === key(fudge))) distinct.push(fudge);
    else distinct.push({ ...correct, med: Math.min(correct.q3, correct.med + distinct.length) });
  }
  const lo = Math.floor(Math.min(...distinct.map((d) => d.min)) / 5) * 5;
  const hi = Math.ceil(Math.max(...distinct.map((d) => d.max)) / 5) * 5;
  const correctIdx = randInt(rng, 0, 3);
  const svgs: string[] = [];
  let wi = 1;
  for (let i = 0; i < 4; i++) svgs.push(singleBoxPlotSvg(i === correctIdx ? distinct[0] : distinct[wi++ % distinct.length], lo, hi));
  const letters = ['A', 'B', 'C', 'D'];
  return {
    itemType: 'MC',
    context: `A data set is: ${data.join(', ')}. Which box plot correctly represents the data?`,
    question: '\\text{correct box plot?}',
    answer: letters[correctIdx],
    choices: letters,
    svgChoices: svgs,
    steps: [
      { number: 1, description: `Five-number summary: min ${correct.min}, Q1 ${correct.q1}, median ${correct.med}, Q3 ${correct.q3}, max ${correct.max}.`, math: `${correct.min},\\ ${correct.q1},\\ ${correct.med},\\ ${correct.q3},\\ ${correct.max}` },
    ],
    hints: ['Order the data, find the median, then the medians of each half.'],
    timeEstimate: 80,
  };
};

// ── Q32-style MC + VIS stem: dot plot threshold count ───────────────────
export const genDotPlotThreshold: ProblemFactory = (rng) => {
  const wage = choice(rng, [10, 12, 15, 20] as const);
  const t = randInt(rng, 4, 6); // hours threshold
  const pay = wage * t;
  const counts: number[] = [];
  for (let h = 0; h <= 8; h++) counts.push(randInt(rng, 0, 3));
  // guarantee data on both sides of the threshold
  counts[t] = randInt(rng, 1, 2);
  counts[t + 1] = Math.max(counts[t + 1], 1);
  counts[Math.max(0, t - 2)] = Math.max(counts[Math.max(0, t - 2)], 1);
  const above = counts.reduce((s, c, h) => (h > t ? s + c : s), 0);
  const total = counts.reduce((s, c) => s + c, 0);
  const svg = dotPlotSvg('Hours Worked', 'Hours', counts, 0);
  const m = mcUnique(rng, num(above), [
    num(counts[t + 1] ?? 1),
    num(total),
    num(total - above),
  ], (k) => num(above + 1 + k));
  return {
    itemType: 'MC',
    context: `This dot plot shows the number of hours worked yesterday by each employee at a company. Employees are paid $${wage} per hour. How many employees were paid more than $${pay} yesterday?`,
    question: `\\text{hours} > ${t} \\Rightarrow \\text{pay} > ${pay}`,
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `More than $${pay} at $${wage}/hour means more than ${t} hours.`, math: `${pay} \\div ${wage} = ${t}` },
      { number: 2, description: `Count the dots above ${t + 1} through 8 hours.`, math: num(above) },
    ],
    hints: ['Convert the pay threshold to hours, then count dots to the right of it.'],
    timeEstimate: 60,
  };
};

// ── Q41-style MC: mean of four counts ───────────────────────────────────
export const genMeanOfCounts: ProblemFactory = (rng) => {
  const mean = randInt(rng, 100, 160);
  const offs = [randInt(rng, -15, -4), randInt(rng, -12, 5), randInt(rng, 2, 14)];
  const off4 = -(offs[0] + offs[1] + offs[2]);
  if (Math.abs(off4) > 18 || off4 === 0 || new Set([...offs, off4]).size < 4) return genMeanOfCounts(rng, 'medium');
  const vals = [...offs, off4].map((o) => mean + o);
  const m = mcUnique(rng, num(mean), [
    num([...vals].sort((a, b) => a - b)[1]),
    num(mean + 2),
    num(mean - 2),
  ], (k) => num(mean + 4 + k));
  const place = choice(rng, ['cafeteria', 'library', 'gym'] as const);
  return {
    itemType: 'MC',
    context: `The number of students who used the ${place} each day last week was ${vals.join(', ')}. What is the mean number of students per day?`,
    question: '\\text{mean} = ?',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Sum = ${vals.reduce((s, v) => s + v, 0)}; divide by 4.`, math: `\\frac{${vals.reduce((s, v) => s + v, 0)}}{4} = ${mean}` },
    ],
    hints: ['Add all four counts, then divide by 4.'],
    timeEstimate: 60,
  };
};

export const statisticsFactories: ProblemFactory[] = [
  genMeanDeposits,
  genLowestScoreSix,
  genLowestScoreFour,
  genBoxPlotMatch,
  genDotPlotThreshold,
  genMeanOfCounts,
];
