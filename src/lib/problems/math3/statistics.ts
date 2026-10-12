// m3-statistics: sampling methods and valid conclusions (S-IC).
// Covers released items 22, 23, 44, 50 (original items only).
// Q23 DD and Q44 MS formats convert to MC variants (see analysis doc section 6).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, shuffle } from '../math1/rng';
import { mc } from '../math1/latex';
import { barChartSvg } from './svg';

// ── Q22-style: paired-difference experiment conclusion (S-IC.5) — VISUAL ─
export const genPairedDiff: ProblemFactory = (rng) => {
  const brands = choice(rng, [
    ['Brand K', 'Brand R', 'lightbulbs', 'burn out'],
    ['Model A', 'Model B', 'batteries', 'run out of charge'],
    ['Type X', 'Type Y', 'plant fertilizers', 'stop working'],
  ] as const);
  const n = choice(rng, [20, 25, 30, 35]);
  // differences mostly positive -> Brand K (first brand) lasts longer
  const cats = Array.from({ length: 8 }, (_, i) => `${(i * 0.5 - 1.5).toFixed(1)}`);
  const weights = [1, 2, 3, 7, 9, 6, 3, 1]; // histogram-ish counts centered right of 0
  const svg = barChartSvg(cats, weights, `difference in hours (${brands[0]} - ${brands[1]})`);
  const correct = `Choose ${brands[0]} — it had a higher average time before failing.`;
  const m = mc(rng, correct, [
    `Choose ${brands[1]} — the most frequent difference favors it.`,
    `Pick either — sometimes each brand lasted longer.`,
    `Repeat the test because the sample averages had variation.`,
    `Choose ${brands[1]} — it lasted longer in most pairings.`,
  ]);
  return {
    itemType: 'MC',
    context: `A company is deciding between ${brands[0]} and ${brands[1]} ${brands[2]}. It pairs one of each brand, measures the time until they ${brands[3]}, and records the ${brands[0]} time minus the ${brands[1]} time. The results of ${n} tests are shown in the chart. Which statement is valid?`,
    question: '\\text{Which conclusion does the data support?}',
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Nearly all differences are positive, meaning the first brand consistently lasted longer.', math: `\\text{differences} > 0 \\Rightarrow ${brands[0]} \\text{ lasts longer}` },
      { number: 2, description: 'Variation in the data does not prevent a conclusion when the direction is consistent.', math: `\\bar{d} > 0` },
    ],
    hints: ['Positive differences mean the first brand lasted longer; look at where most of the chart lies.'],
    timeEstimate: 90,
  };
};

// ── Q23-style: population vs sample, DD -> MC (S-IC.1) ──────────────────
export const genPopSample: ProblemFactory = (rng) => {
  const N = choice(rng, [400, 500, 600, 800]);
  const pct = choice(rng, [45, 55, 60, 65]);
  const favor = Math.round((N * pct) / 100);
  const against = N - favor;
  const scenario = choice(rng, [
    ['building a new school', 'in favor of the new school', 'opposed to the new school'],
    ['adding a bike lane downtown', 'in favor of the bike lane', 'opposed to the bike lane'],
    ['extending library hours', 'in favor of longer hours', 'opposed to longer hours'],
  ] as const);
  const correct = `Population: all town residents; Sample: the ${N} people surveyed`;
  const m = mc(rng, correct, [
    `Population: the ${N} surveyed; Sample: the ${favor} in favor`,
    `Population: the ${favor} in favor; Sample: all town residents`,
    `Population: all town residents; Sample: the ${against} opposed`,
    `Population: the ${favor} in favor; Sample: the ${N} surveyed`,
  ]);
  return {
    itemType: 'MC',
    context: `A survey of ${N} people in a town found that ${pct}% of the people are in favor of ${scenario[0]}. Which option correctly identifies the population and the sample?`,
    question: '\\text{population vs sample}',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'The population is the whole group the survey asks about; the sample is the group actually surveyed.', math: `\\text{population} \\supset \\text{sample}` },
    ],
    hints: ['The population is everyone the conclusion is about — not just the people contacted.'],
    timeEstimate: 60,
  };
};

// ── Q44-style: which procedure gives a random sample, MS -> MC (S-IC.1) ──
export const genRandomProcedure: ProblemFactory = (rng) => {
  const scenarios = shuffle(rng, [
    {
      good: 'surveying every third student on an alphabetical list of all students about cafeteria food quality',
      bad: [
        'surveying 20 random football players about renovating the football stadium',
        'surveying only juniors about the favorite after-school activity of all students',
        'surveying students who volunteer during lunch about school start times',
      ],
    },
    {
      good: 'selecting four students with a random number generator from each homeroom about the best day for an assembly',
      bad: [
        'asking the first 30 students who arrive in the morning about parking rules',
        'polling the student council about spirit week themes',
        'surveying only seniors about graduation venue options',
      ],
    },
  ]);
  const s = scenarios[0];
  const correct = s.good;
  const m = mc(rng, correct, [...s.bad]);
  return {
    itemType: 'MC',
    context: 'Which procedure would result in a random sample of the intended population?',
    question: '\\text{choose the unbiased procedure}',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'A random sample gives every member of the population an equal chance of selection.', math: `\\text{random} \\neq \\text{convenient}` },
      { number: 2, description: 'Procedures restricted to a subgroup (one team, one grade, volunteers) are biased.', math: `\\text{subgroup only} \\Rightarrow \\text{biased}` },
    ],
    hints: ['Watch for procedures that only reach one subgroup — those are biased even if random within it.'],
    timeEstimate: 75,
  };
};

// ── Q50-style: most unbiased sampling method (S-IC.3) ───────────────────
export const genUnbiasedSample: ProblemFactory = (rng) => {
  const goal = choice(rng, [
    'which new lunch choice its students would prefer',
    'which theme students want for the spring dance',
    'how students feel about a new phone policy',
  ]);
  const correct = 'surveying a random sample of students from a list of all students';
  const m = mc(rng, correct, [
    'inviting all students to respond by text message',
    'placing suggestion boxes at random locations in the school',
    'assembling one male and one female student from each grade',
    'asking everyone in the cafeteria during one lunch period',
  ]);
  return {
    itemType: 'MC',
    context: `A school wants to find out ${goal}. Which procedure is most likely to obtain a statistically unbiased sample?`,
    question: '\\text{best sampling method}',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Voluntary responses (texts, suggestion boxes) over-represent strong opinions.', math: `\\text{volunteer bias}` },
      { number: 2, description: 'A random draw from a complete list gives every student equal probability — unbiased.', math: `\\text{random from full list}` },
    ],
    hints: ['Unbiased means every student has an equal chance — not everyone who feels like answering.'],
    timeEstimate: 60,
  };
};

export const statisticsFactories: ProblemFactory[] = [
  genPairedDiff,
  genPopSample,
  genRandomProcedure,
  genUnbiasedSample,
];
