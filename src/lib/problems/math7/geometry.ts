// g7-geometry: triangle inequality, angle relationships (with diagrams),
// circle sectors, volume and surface area.
// Covers released items 2, 15, 22, 25, 29, 33, 40 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt, shuffle } from '../math1/rng';
import { linExpr, mc, num } from '../math1/latex';
import { angleSplitSvg, perpendicularSvg, prismSvg, rectAngleSvg, sectorSvg } from './svg';

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

// ── Q2-style MC: which triple can be the side lengths of a triangle ─────
export const genTriangleInequality: ProblemFactory = (rng) => {
  // valid triple
  const a = randInt(rng, 3, 9);
  const b = randInt(rng, 3, 9);
  const c = randInt(rng, Math.abs(a - b) + 1, a + b - 1);
  const ok = shuffle(rng, [a, b, c]).join(', ');
  const m = mc(rng, ok, [
    // each invalid: sum of two ≤ third
    (() => { const x = randInt(rng, 2, 6); const y = randInt(rng, 2, 6); return shuffle(rng, [x, y, x + y]).join(', '); })(),
    (() => { const x = randInt(rng, 2, 7); const y = randInt(rng, 2, 7); return shuffle(rng, [x, y, x + y + randInt(rng, 1, 3)]).join(', '); })(),
    (() => { const x = randInt(rng, 2, 5); const y = randInt(rng, 2, 5); return shuffle(rng, [x, y, 2 * (x + y)]).join(', '); })(),
  ]);
  return {
    itemType: 'MC',
    context: 'Which set of lengths, in centimeters, could be the side lengths of a triangle?',
    question: `a + b > c`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Triangle inequality: the two shorter sides must sum to MORE than the longest side.', math: ok.replace(/, /g, ',\\;') },
    ],
    hints: ['Check the two shortest sides against the longest.'],
    timeEstimate: 60,
  };
};

// ── Q15-style GR + VIS: complementary angles x + (bx + c) = 90 ──────────
export const genComplementaryAngles: ProblemFactory = (rng) => {
  const x0 = choice(rng, [10, 15, 20, 25]);
  const b = choice(rng, [2, 3]);
  const c = 90 - (b + 1) * x0; // ensures solution x0
  const svg = angleSplitSvg('x°', `(${linExpr(b, c)})°`);
  return {
    itemType: 'GR',
    context: 'The two angles shown are complementary. What is the value of x? Write only the number in the box.',
    question: `x + (${linExpr(b, c)}) = 90`,
    stemSvg: svg,
    answer: num(x0),
    steps: [
      { number: 1, description: 'Complementary angles sum to 90°.', math: `x + ${linExpr(b, c)} = 90` },
      { number: 2, description: 'Combine and solve.', math: `${linExpr(b + 1, c)} = 90 \\Rightarrow x = ${x0}` },
    ],
    hints: ['The two expressions add to 90.'],
    timeEstimate: 75,
  };
};

// ── Q22-style GR + VIS: perpendicular lines, expression angle = 90 ──────
export const genPerpendicularVertical: ProblemFactory = (rng) => {
  const c = randInt(rng, 4, 40);
  const k = choice(rng, [2, 4] as const);
  const x0 = k * 90 - c; // (x + c)/k = 90 → x = 90k − c
  const svg = perpendicularSvg(`${k === 2 ? '½' : '¼'}(x + ${c})°`);
  return {
    itemType: 'GR',
    context: 'The two lines shown are perpendicular. The labeled angle equals its vertical angle. What is the value of x? Write only the number in the box.',
    question: `\\frac{x + ${c}}{${k}} = 90`,
    stemSvg: svg,
    answer: num(x0),
    steps: [
      { number: 1, description: 'Perpendicular lines form 90° angles.', math: `\\frac{x + ${c}}{${k}} = 90` },
      { number: 2, description: `Multiply both sides by ${k}, then subtract ${c}.`, math: `x = ${90 * k} - ${c} = ${x0}` },
    ],
    hints: ['The labeled angle must equal 90°.'],
    timeEstimate: 75,
  };
};

// ── Q25-style MC + VIS: shaded sector area + radius → arc length ────────
export const genSectorArc: ProblemFactory = (rng) => {
  const r = choice(rng, [4, 5, 6, 8, 10]);
  const arc = choice(rng, [4, 6, 8, 10, 12]); // arc length L
  const area = (arc * r) / 2; // sector area = Lr/2
  const deg = Math.round((arc / (2 * Math.PI * r)) * 360);
  const svg = sectorSvg(deg, `r = ${r}`);
  const correct = num(arc);
  const m = mcUnique(rng, correct, [
    num(arc * 2),
    num(Math.round((area / r) * 10) / 10),
    num(Math.round((2 * area) / (r + 1) * 10) / 10),
  ], (k) => num(arc + 2 * k));
  return {
    itemType: 'MC',
    context: `The shaded sector of the circle has an area of ${num(area)} square units, and the radius is ${r} units. What is the length of the arc bounding the shaded sector?`,
    question: `\\text{sector area} = \\frac{1}{2} r L`,
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Sector area = ½ · radius · arc length.', math: `${num(area)} = \\frac{1}{2}(${r})L` },
      { number: 2, description: 'Solve for L.', math: `L = ${num(arc)}` },
    ],
    hints: ['Sector area A = ½rL, where L is the arc length.'],
    timeEstimate: 90,
  };
};

// ── Q29-style GR + VIS: rectangle + diagonal angle chase ────────────────
export const genRectAngleChase: ProblemFactory = (rng) => {
  const a = choice(rng, [22, 25, 28, 30, 32, 35, 40]);
  const target = 90 - a;
  const svg = rectAngleSvg({ a: `${a}°`, target: '?°' });
  return {
    itemType: 'GR',
    context: 'The figure shows a rectangle with a diagonal. What is the measure, in degrees, of the angle marked ? Write only the number in the box.',
    question: `${a}° + \\,? = 90°`,
    stemSvg: svg,
    answer: num(target),
    steps: [
      { number: 1, description: 'The corner of a rectangle is 90°, and the diagonal splits it into the two marked angles.', math: `${a} + ? = 90` },
      { number: 2, description: 'Solve.', math: `? = ${target}°` },
    ],
    hints: ['The two angles at that corner are complementary.'],
    timeEstimate: 60,
  };
};

// ── Q33-style MC: cube volume minus soil added ──────────────────────────
export const genCubeVolume: ProblemFactory = (rng) => {
  const s = choice(rng, [3, 4, 5, 6]);
  const V = s * s * s;
  const soil = choice(rng, [8, 20, 27, 40, 54].filter((v) => v < V));
  const left = V - soil;
  const m = mcUnique(rng, num(left), [
    num(V),
    num(Math.max(V - soil - s * s, 1)),
    num(soil),
  ], (k) => num(left + s * k));
  return {
    itemType: 'MC',
    context: `A cube-shaped planter has edges of ${s} feet. It currently contains ${soil} cubic feet of soil. How many more cubic feet of soil can fit in the planter?`,
    question: `${s}^3 - ${soil}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Volume of the cube.', math: `${s}^3 = ${V}` },
      { number: 2, description: 'Subtract the soil already inside.', math: `${V} - ${soil} = ${left}` },
    ],
    hints: ['Cube volume = edge³.'],
    timeEstimate: 60,
  };
};

// ── Q40-style MC + VIS: isometric prism surface area ────────────────────
export const genPrismSurface: ProblemFactory = (rng) => {
  const l = randInt(rng, 3, 9);
  const w = randInt(rng, 2, 7);
  const h = randInt(rng, 2, 7);
  const sa = 2 * (l * w + l * h + w * h);
  const svg = prismSvg(`${l} cm`, `${w} cm`, `${h} cm`);
  const m = mcUnique(rng, num(sa), [
    num(l * w * h),
    num(2 * (l * w + l * h)),
    num(sa + 2 * l),
  ], (k) => num(sa + 2 * w * k));
  return {
    itemType: 'MC',
    context: 'What is the total surface area, in square centimeters, of the rectangular prism shown?',
    question: `2(lw + lh + wh)`,
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Three different face areas.', math: `${l}(${w}) = ${l * w},\\quad ${l}(${h}) = ${l * h},\\quad ${w}(${h}) = ${w * h}` },
      { number: 2, description: 'Double the sum (two of each face).', math: `2(${l * w} + ${l * h} + ${w * h}) = ${sa}` },
    ],
    hints: ['A box has 3 pairs of identical faces.'],
    timeEstimate: 75,
  };
};

export const geometryFactories: ProblemFactory[] = [
  genTriangleInequality,
  genComplementaryAngles,
  genPerpendicularVertical,
  genSectorArc,
  genRectAngleChase,
  genCubeVolume,
  genPrismSurface,
];
