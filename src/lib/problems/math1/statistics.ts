// m1-statistics: correlation, best-fit lines, outliers, average rate of change.
// Datasets are generated with controlled properties; all statistics are
// computed exactly inside the factory so choices are always consistent.
// Formats from released Q21-Q22, Q28-Q30, Q33, Q36, Q44, Q48-Q50.

import type { ProblemFactory } from '../../problemGenerator';
import { randInt, choice, shuffle } from './rng';
import { num, mc } from './latex';

// ── exact statistics helpers ──
function mean(xs: number[]): number {
  return xs.reduce((s, v) => s + v, 0) / xs.length;
}
function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}
function pearson(xs: number[], ys: number[]): number {
  const mx = mean(xs), my = mean(ys);
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < xs.length; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  return sxy / Math.sqrt(sxx * syy);
}
function leastSquares(xs: number[], ys: number[]): { slope: number; intercept: number } {
  const mx = mean(xs), my = mean(ys);
  let sxy = 0, sxx = 0;
  for (let i = 0; i < xs.length; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx };
}

/** Build a dataset of n points with approximately the target correlation. */
function datasetWithR(rng: () => number, n: number, targetR: number, scale = 1): { xs: number[]; ys: number[] } {
  const xs: number[] = [];
  for (let i = 0; i < n; i++) xs.push(Math.round((i + 1) * 10 * scale + randInt(rng, -5, 5)));
  const slope = randInt(rng, 3, 8);
  const sign = targetR >= 0 ? 1 : -1;
  // noise amplitude from target r: noiseStd = signalStd * sqrt(1/r^2 - 1)
  const mx = mean(xs);
  const signalStd = slope * Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0) / n);
  const noiseStd = signalStd * Math.sqrt(1 / (targetR * targetR) - 1);
  const amp = Math.max(2, Math.round(noiseStd * 1.732)); // uniform ±A has std A/√3
  const ys = xs.map((x) => Math.round(sign * slope * x + 50 + randInt(rng, -amp, amp)));
  return { xs, ys };
}

function tableLatex(xs: number[], ys: number[], xLabel: string, yLabel: string): string {
  const rows = xs.map((x, i) => `${x.toLocaleString('en-US').replace(/,/g, '{,}')} & ${ys[i].toLocaleString('en-US').replace(/,/g, '{,}')}`).join(' \\\\ ');
  return `\\begin{array}{c|c} \\text{${xLabel}} & \\text{${yLabel}} \\\\ \\hline ${rows} \\end{array}`;
}

// ── Q22-style MC: correlation coefficient to nearest thousandth ──
export const genCorrelationValue: ProblemFactory = (rng) => {
  let xs: number[] = [], ys: number[] = [], r = 1;
  // regenerate until r lands in a realistic, clearly-below-1 range
  for (let tries = 0; tries < 80; tries++) {
    const ds = datasetWithR(rng, 5, choice(rng, [0.93, 0.96, 0.975] as const), 10);
    xs = ds.xs; ys = ds.ys;
    r = pearson(xs, ys);
    const rr = Math.round(r * 1000) / 1000;
    if (rr >= 0.955 && rr <= 0.992) break;
  }
  const rRounded = Math.round(r * 1000) / 1000;
  const correct = num(rRounded);
  const offs = shuffle(rng, [0.003, -0.003, 0.006, -0.006, 0.005]).map((o) => num(Math.round((rRounded + o) * 1000) / 1000));
  const m = mc(rng, correct, offs);
  return {
    itemType: 'MC',
    context: 'A table shows two related quantities for five months. What is the correlation coefficient, to the nearest thousandth, when y is modeled as a linear best-fit function of x?',
    question: tableLatex(xs, ys, 'x', 'y'),
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Enter the data into a calculator (L1, L2) and run LinReg.', math: 'r \\approx ' + num(r) },
      { number: 2, description: 'Round to the nearest thousandth.', math: `r \\approx ${correct}` },
    ],
    hints: ['The points rise together tightly, so r is positive and close to 1 — compute it exactly with linear regression.'],
    timeEstimate: 60,
  };
};

// ── Q50-style MC: describe the relationship ──
export const genDescribeCorrelation: ProblemFactory = (rng) => {
  const strength = choice(rng, ['strong', 'weak'] as const);
  const direction = choice(rng, ['positive', 'negative'] as const);
  const target = strength === 'strong' ? 0.96 : 0.45;
  const { xs, ys } = datasetWithR(rng, 10, direction === 'positive' ? target : -target, 3);
  const correct = `There is a ${strength} ${direction} relationship.`;
  const m = mc(rng, correct, [
    `There is a strong ${direction === 'positive' ? 'negative' : 'positive'} relationship.`,
    `There is a ${strength === 'strong' ? 'weak' : 'strong'} ${direction} relationship.`,
    'There is no apparent relationship.',
  ]);
  return {
    itemType: 'MC',
    context: 'A table shows measurements of two variables for 10 subjects. Which statement describes the relationship between the variables?',
    question: tableLatex(xs, ys, 'x', 'y'),
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Check direction: as x increases, does y tend to increase or decrease?', math: direction === 'positive' ? 'y \\uparrow \\text{ as } x \\uparrow' : 'y \\downarrow \\text{ as } x \\uparrow' },
      { number: 2, description: 'Check strength: how tightly do the points follow a line?', math: `\\text{${strength}} ${direction}` },
    ],
    hints: ['Direction = sign of the trend; strength = how close the points hug a straight line.'],
    timeEstimate: 45,
  };
};

// ── Q49-style MC: predicted value from the best-fit line ──
export const genBestFitPredict: ProblemFactory = (rng) => {
  const n = 8;
  const { xs, ys } = datasetWithR(rng, n, 0.98, 30);
  const { slope, intercept } = leastSquares(xs, ys);
  const x0 = Math.round(Math.max(...xs) * 1.4);
  const pred = Math.round((slope * x0 + intercept) / 100) * 100;
  const correct = pred.toLocaleString('en-US');
  const m = mc(rng, correct, [
    (pred + choice(rng, [4200, -3600, 7800] as const)).toLocaleString('en-US'),
    (pred + choice(rng, [-11500, 12300] as const)).toLocaleString('en-US'),
    (pred + choice(rng, [42100, -38900] as const)).toLocaleString('en-US'),
  ]);
  return {
    itemType: 'MC',
    context: `A table shows two variables for ${n} cities. According to the linear best-fit model, to the nearest hundred, what is the predicted y-value when x = ${x0.toLocaleString('en-US')}?`,
    question: tableLatex(xs, ys, 'x', 'y'),
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Run linear regression on the data.', math: `\\hat{y} \\approx ${num(Math.round(slope * 100) / 100)}x + ${num(Math.round(intercept))}` },
      { number: 2, description: `Evaluate at x = ${x0.toLocaleString('en-US')} and round to the nearest hundred.`, math: `\\hat{y} \\approx ${correct}` },
    ],
    hints: ['Use LinReg on the table, then substitute the given x and round.'],
    timeEstimate: 90,
  };
};

// ── Q30/Q48-style MC: which data point is closest/farthest from the best-fit line ──
export const genResidualPick: ProblemFactory = (rng) => {
  const mode = choice(rng, ['closest', 'farthest'] as const);
  const n = 5;
  let xs: number[] = [];
  let ys: number[] = [];
  let residuals: number[] = [];
  let target = 0;
  let fs = 0, fi = 0;
  // retry until the target residual is unique with a clear margin
  for (let tries = 0; tries < 60; tries++) {
    const ds = datasetWithR(rng, n, 0.99, 20);
    xs = ds.xs;
    const slope = randInt(rng, 3, 7);
    const base = xs.map((x) => slope * x + randInt(rng, 200, 400));
    const idxFar = randInt(rng, 0, n - 1);
    ys = base.map((y, i) => y + (i === idxFar ? choice(rng, [60, -60, 80, -80] as const) : randInt(rng, -8, 8)));
    const fit = leastSquares(xs, ys);
    fs = fit.slope; fi = fit.intercept;
    residuals = ys.map((y, i) => Math.abs(y - (fs * xs[i] + fi)));
    const sortedRes = [...residuals].sort((a, b) => a - b);
    if (mode === 'closest') {
      if (sortedRes[1] - sortedRes[0] >= 2) { target = residuals.indexOf(sortedRes[0]); break; }
    } else {
      if (sortedRes[n - 1] - sortedRes[n - 2] >= 5) { target = residuals.indexOf(sortedRes[n - 1]); break; }
    }
    if (tries === 59) target = mode === 'closest' ? residuals.indexOf(sortedRes[0]) : residuals.indexOf(sortedRes[n - 1]);
  }
  const pt = (i: number) => `(${xs[i].toLocaleString('en-US')}, ${ys[i].toLocaleString('en-US')})`;
  const correct = pt(target);
  const others = ys.map((_, i) => i).filter((i) => i !== target);
  const m = mc(rng, correct, shuffle(rng, others).slice(0, 3).map(pt));
  return {
    itemType: 'MC',
    context: `A data set of ${n} points is shown. Which data point is ${mode} to the graph of the linear best-fit equation of the data?`,
    question: tableLatex(xs, ys, 'x', 'y'),
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Find the best-fit line, then compute each vertical residual.', math: `\\hat{y} \\approx ${num(Math.round(fs * 100) / 100)}x + ${num(Math.round(fi))}` },
      { number: 2, description: `The point with the ${mode === 'closest' ? 'smallest' : 'largest'} |y − ŷ|.`, math: correct },
    ],
    hints: ['Residual = actual y minus predicted y. Compare their sizes.'],
    timeEstimate: 90,
  };
};

// ── Q33-style MC: effect of adding a large data point on mean and median ──
export const genOutlierEffect: ProblemFactory = (rng) => {
  const n = choice(rng, [7, 8, 9] as const);
  const data: number[] = [];
  const seen = new Set<number>();
  while (data.length < n) {
    const v = randInt(rng, 4, 16);
    if (!seen.has(v)) { seen.add(v); data.push(v); }
  }
  data.sort((a, b) => a - b);
  const extra = randInt(rng, 38, 50);
  const mean0 = mean(data);
  const med0 = median(data);
  const mean1 = mean([...data, extra]);
  const med1 = median([...data, extra]);
  const dMean = Math.round((mean1 - mean0) * 100) / 100;
  const dMed = Math.round((med1 - med0) * 100) / 100;
  const meanTxt = dMean === 0 ? 'remain the same' : `increase by ${num(dMean)}`;
  const medTxt = dMed === 0 ? 'remain the same' : `increase by ${num(dMed)}`;
  const correct = `The mean would ${meanTxt}, and the median would ${medTxt}.`;
  const m = mc(rng, correct, [
    `The mean would ${medTxt}, and the median would ${meanTxt}.`,
    `The mean would remain the same, and the median would increase by ${num(Math.round((dMean + 1.5) * 100) / 100)}.`,
    `The mean would increase by ${num(Math.round(dMean * 200) / 100)}, and the median would remain the same.`,
  ]);
  return {
    itemType: 'MC',
    context: `A data set is shown: ${data.join(', ')}. How would adding a data point of ${extra} affect the set?`,
    question: `${data.join(', \\ ')} \\ \\xrightarrow{+${extra}}\\ \\ ?`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Original mean and median.`, math: `\\bar{x} = ${num(Math.round(mean0 * 100) / 100)}, \\quad \\text{med} = ${num(med0)}` },
      { number: 2, description: `New mean and median after adding ${extra}.`, math: `\\bar{x}' = ${num(Math.round(mean1 * 100) / 100)}, \\quad \\text{med}' = ${num(med1)}` },
    ],
    hints: ['A value far above the data pulls the mean up strongly; the median moves at most one position.'],
    timeEstimate: 75,
  };
};

// ── Q28-style MC: effect of an outlier on distribution shape ──
export const genSkewDirection: ProblemFactory = (rng) => {
  const side = choice(rng, ['right', 'left'] as const);
  const cluster: number[] = [];
  for (let i = 0; i < 10; i++) cluster.push(randInt(rng, 170, 260) * 100);
  const outlier = side === 'right' ? randInt(rng, 700, 900) * 100 : randInt(rng, 10, 60) * 100;
  const data = shuffle(rng, [...cluster, outlier]);
  const correct = `The outlier causes the data distribution to be strongly skewed to the ${side}.`;
  const m = mc(rng, correct, [
    `The outlier causes the data distribution to be strongly skewed to the ${side === 'right' ? 'left' : 'right'}.`,
    'The outlier causes the data distribution to be more symmetrical.',
    'The outlier causes the data distribution to be more concentrated near the mean.',
  ]);
  return {
    itemType: 'MC',
    context: `A dealership's sales for one month are shown (in dollars): ${data.map((v) => '$' + v.toLocaleString('en-US')).join(', ')}. Which statement is true?`,
    question: `\\text{one value is far ${side === 'right' ? 'above' : 'below'} the rest}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Locate the outlier relative to the cluster.', math: side === 'right' ? '\\text{outlier on the high end}' : '\\text{outlier on the low end}' },
      { number: 2, description: 'An outlier pulls the tail in its direction.', math: `\\text{skewed ${side}}` },
    ],
    hints: ['The tail points toward the outlier — that direction names the skew.'],
    timeEstimate: 60,
  };
};

// ── Q36/Q44-style MC: average rate of change from a table ──
const RATE_CONTEXTS = [
  { xLabel: 'Drop Height (inches)', yLabel: 'Bounce Height (inches)', ask: 'the bounce height as drop height changed' },
  { xLabel: 'Time (minutes)', yLabel: 'Altitude (feet)', ask: 'the altitude of the balloon' },
  { xLabel: 'Week', yLabel: 'Sales ($)', ask: 'weekly sales' },
];
export const genAvgRateChange: ProblemFactory = (rng, difficulty) => {
  const ctx = choice(rng, RATE_CONTEXTS);
  const x1 = choice(rng, [10, 20, 30] as const);
  const x2 = x1 + choice(rng, [20, 30, 40] as const);
  const num_ = difficulty === 'easy' ? choice(rng, [2, 3, 4, 6] as const) : randInt(rng, 3, 24);
  const rate = num_ / 2 / ((x2 - x1) / 20); // arbitrary pleasant rate
  const y1v = randInt(rng, 8, 30);
  const dy = Math.round(rate * (x2 - x1) * 100) / 100;
  const y2v = y1v + dy;
  const r = dy / (x2 - x1);
  const correct = num(Math.round(r * 100) / 100);
  const m = mc(rng, correct, [
    num(Math.round((r + 0.35) * 100) / 100),
    num(Math.round(r * 2 * 100) / 100),
    num(Math.round(dy * 100) / 100),
    num(Math.round((dy / (x1 + x2)) * 100) / 100),
  ]);
  return {
    itemType: 'MC',
    context: `A table records ${ctx.xLabel.toLowerCase()} and ${ctx.yLabel.toLowerCase()}. When ${ctx.xLabel.toLowerCase()} is ${x1}, ${ctx.yLabel.toLowerCase()} is ${num(y1v)}; when it is ${x2}, it is ${num(y2v)}. What was the average rate of change in ${ctx.ask} between those two values?`,
    question: `\\frac{${num(y2v)} - ${num(y1v)}}{${x2} - ${x1}}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Average rate of change = Δy / Δx.', math: `\\frac{${num(y2v)} - ${num(y1v)}}{${x2} - ${x1}} = \\frac{${num(dy)}}{${x2 - x1}}` },
      { number: 2, description: 'Divide.', math: `= ${correct}` },
    ],
    hints: ['(change in y) ÷ (change in x) — not the other way around.'],
    timeEstimate: 60,
  };
};

export const statisticsFactories: ProblemFactory[] = [
  genCorrelationValue,
  genDescribeCorrelation,
  genBestFitPredict,
  genResidualPick,
  genOutlierEffect,
  genSkewDirection,
  genAvgRateChange,
];

