// g6-geometry: coordinate distance & area, nets → surface area, fraction-dimension volume.
// Covers released items 3, 23, 27, 33, 35, 42 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt } from '../math1/rng';
import { mc, num } from '../math1/latex';
import { prismNetSvg, triangleNetSvg } from './svg';

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

/** Mixed-number LaTeX from an improper fraction. */
function mixedLatex(n: number, d: number): string {
  const whole = Math.floor(n / d);
  const rem = n % d;
  if (rem === 0) return `${whole}`;
  return `${whole} \\frac{${rem}}{${d}}`;
}

// ── Q3-style MC: distance between two points (same y) ───────────────────
export const genCoordDistanceHorizontal: ProblemFactory = (rng) => {
  const y = randInt(rng, -5, 5);
  const x1 = randInt(rng, -6, 2);
  const d = randInt(rng, 3, 8);
  const x2 = x1 + d;
  const p1 = choice(rng, ['J', 'A', 'R'] as const);
  const p2 = choice(rng, ['K', 'B', 'S'] as const);
  const m = mcUnique(rng, num(d), [
    num(Math.abs(x1) + Math.abs(x2) === d ? d + 2 : Math.abs(x1) + Math.abs(x2)),
    num(d + 1),
    num(Math.abs(y) + d),
  ], (k) => num(d + 2 + k));
  return {
    itemType: 'MC',
    context: `Point ${p1} is located at (${x1}, ${y}) and point ${p2} is located at (${x2}, ${y}) on a coordinate plane. What is the distance, in units, between the two points?`,
    question: '\\text{distance} = ?',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Same y-coordinate: distance is the difference of the x-coordinates.', math: `|${x2} - (${x1})| = ${d}` },
    ],
    hints: ['Same y means horizontal distance — subtract the x-values.'],
    timeEstimate: 45,
  };
};

// ── Q23-style MC + VIS stem: prism net → surface area ───────────────────
export const genPrismNetSA: ProblemFactory = (rng) => {
  const l = randInt(rng, 5, 9);
  const w = randInt(rng, 2, 4);
  const h = randInt(rng, 2, 4);
  const unit = choice(rng, ['ft', 'in', 'cm'] as const);
  const sa = 2 * (l * w + l * h + w * h);
  const svg = prismNetSvg(l, w, h, unit);
  const sqUnit = unit === 'ft' ? 'square feet' : unit === 'in' ? 'square inches' : 'square centimeters';
  const m = mcUnique(rng, `${sa} \\text{ ${sqUnit}}`, [
    `${l * w + l * h + w * h} \\text{ ${sqUnit}}`,
    `${2 * (l * w + l * h)} \\text{ ${sqUnit}}`,
    `${l * w * h} \\text{ ${sqUnit}}`,
  ], (k) => `${sa + 10 * k} \\text{ ${sqUnit}}`);
  return {
    itemType: 'MC',
    context: 'This shows the net of a rectangular prism. What is the surface area of the rectangular prism?',
    question: '\\text{surface area} = ?',
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `The net has three pairs of matching faces: ${l}×${w}, ${l}×${h}, and ${w}×${h}.`, math: `SA = 2(${l} \\cdot ${w} + ${l} \\cdot ${h} + ${w} \\cdot ${h})` },
      { number: 2, description: 'Add the face areas.', math: `SA = 2(${l * w} + ${l * h} + ${w * h}) = ${sa}` },
    ],
    hints: ['Each face of the prism appears twice in the net.'],
    timeEstimate: 70,
  };
};

// ── Q35-style MC + VIS stem: square-prism net → surface area ────────────
export const genSquarePrismNetSA: ProblemFactory = (rng) => {
  const s = randInt(rng, 1, 3);
  const t = randInt(rng, 3, 6);
  const unit = choice(rng, ['m', 'cm', 'ft'] as const);
  const sa = 2 * s * s + 4 * s * t;
  const svg = prismNetSvg(t, s, s, unit); // length t, square cross-section s×s
  const sqUnit = unit === 'm' ? 'square meters' : unit === 'cm' ? 'square centimeters' : 'square feet';
  const m = mcUnique(rng, `${sa} \\text{ ${sqUnit}}`, [
    `${s * s + 4 * s * t} \\text{ ${sqUnit}}`,
    `${6 * s * s} \\text{ ${sqUnit}}`,
    `${s * s * t} \\text{ ${sqUnit}}`,
  ], (k) => `${sa + 8 * k} \\text{ ${sqUnit}}`);
  return {
    itemType: 'MC',
    context: 'This shows the net of a rectangular prism with a square base. What is the surface area of the prism?',
    question: '\\text{surface area} = ?',
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Two square faces (${s}×${s}) and four rectangular faces (${s}×${t}).`, math: `SA = 2(${s}^2) + 4(${s} \\cdot ${t}) = ${2 * s * s} + ${4 * s * t} = ${sa}` },
    ],
    hints: ['Count two square faces and four identical rectangular faces.'],
    timeEstimate: 70,
  };
};

// ── Q27-style MC: quadrilateral on a plane → area ───────────────────────
export const genTrapezoidArea: ProblemFactory = (rng) => {
  const b1 = randInt(rng, 2, 5); // top base
  const b2 = randInt(rng, 2, 5); // bottom base
  const h = randInt(rng, 2, 5);
  const area = ((b1 + b2) / 2) * h;
  if (!Number.isInteger(area)) return genTrapezoidArea(rng, 'medium');
  const x0 = randInt(rng, -4, 0);
  const y0 = randInt(rng, -3, 2);
  const shift = randInt(rng, 0, 1);
  // vertices: bottom-left, top-left, top-right, bottom-right
  const v = [
    `(${x0}, ${y0})`,
    `(${x0 + shift}, ${y0 + h})`,
    `(${x0 + shift + b1}, ${y0 + h})`,
    `(${x0 + b2}, ${y0})`,
  ];
  const m = mcUnique(rng, num(area), [
    num(b1 * h),
    num(b1 + b2 + h),
    num((b1 + b2) * h),
  ], (k) => num(area + 2 * k));
  return {
    itemType: 'MC',
    context: `A quadrilateral has vertices at ${v[0]}, ${v[1]}, ${v[2]}, and ${v[3]}. What is the area of the quadrilateral, in square units?`,
    question: '\\text{area} = ?',
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `The figure is a trapezoid with parallel sides ${b1} and ${b2}, height ${h}.`, math: `A = \\frac{1}{2}(${b1} + ${b2})(${h})` },
      { number: 2, description: 'Evaluate.', math: `A = ${area}` },
    ],
    hints: ['Plot the points: two sides are horizontal — use the trapezoid area formula.'],
    timeEstimate: 70,
  };
};

// ── Q33-style MC: fraction-dimension prism, partially filled ────────────
export const genFractionVolume: ProblemFactory = (rng) => {
  const a = randInt(rng, 2, 6); // length = a + 1/4
  const b = randInt(rng, 2, 5); // width  = b + 1/2
  const c = randInt(rng, 1, 4); // height = c + 1/2
  const nf = (4 * a + 1) * (2 * b + 1) * (2 * c + 1); // full volume = nf/16
  const n34 = 3 * nf; // 3/4 full → 3nf/64
  const correct = mixedLatex(n34, 64);
  const m = mcUnique(rng, `${correct} \\text{ cubic inches}`, [
    `${mixedLatex(nf, 16)} \\text{ cubic inches}`, // forgot the 3/4
    `${mixedLatex(nf, 64)} \\text{ cubic inches}`, // 1/4 instead
    `${mixedLatex(n34 + 64, 64)} \\text{ cubic inches}`, // off by one unit
  ], (k) => `${mixedLatex(n34 + 64 * (k + 1), 64)} \\text{ cubic inches}`);
  return {
    itemType: 'MC',
    context: `A rectangular prism measures ${a} 1/4 inches by ${b} 1/2 inches by ${c} 1/2 inches. It is 3/4 full of sand. What is the volume of the sand, in cubic inches?`,
    question: `V = \\frac{3}{4} \\times ${a} \\frac{1}{4} \\times ${b} \\frac{1}{2} \\times ${c} \\frac{1}{2}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Convert to improper fractions.', math: `\\frac{${4 * a + 1}}{4} \\times \\frac{${2 * b + 1}}{2} \\times \\frac{${2 * c + 1}}{2} = \\frac{${nf}}{16}` },
      { number: 2, description: 'Multiply by 3/4.', math: `\\frac{3}{4} \\times \\frac{${nf}}{16} = \\frac{${n34}}{64} = ${correct}` },
    ],
    hints: ['Find the full volume first, then multiply by 3/4.'],
    timeEstimate: 90,
  };
};

// ── Q42-style MC + VIS stem: net of 4 triangles → surface area ──────────
export const genTriangleNetSA: ProblemFactory = (rng) => {
  const base = randInt(rng, 8, 14);
  const height = randInt(rng, 8, 20);
  const sa = 4 * (0.5 * base * height); // = 2bh
  if (!Number.isInteger(sa)) return genTriangleNetSA(rng, 'medium');
  const svg = triangleNetSvg(base, height, 'cm');
  const m = mcUnique(rng, `${num(sa)} \\text{ square centimeters}`, [
    `${num(sa / 2)} \\text{ square centimeters}`,
    `${num(base * height)} \\text{ square centimeters}`,
    `${num(sa + base)} \\text{ square centimeters}`,
  ], (k) => `${num(sa + 20 * k)} \\text{ square centimeters}`);
  return {
    itemType: 'MC',
    context: 'This shows a net made of 4 congruent triangles. What is the total surface area of the figure the net forms?',
    question: '\\text{surface area} = ?',
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Each triangle has area ½ × ${base} × ${height} = ${0.5 * base * height} cm².`, math: `A_{\\triangle} = \\frac{1}{2}(${base})(${height}) = ${0.5 * base * height}` },
      { number: 2, description: 'The net has 4 congruent triangles.', math: `SA = 4 \\times ${0.5 * base * height} = ${num(sa)}` },
    ],
    hints: ['Find one triangle’s area, then multiply by 4.'],
    timeEstimate: 60,
  };
};

// ── Bonus MC + VIS stem: cube net → surface area ────────────────────────
export const genCubeNetSA: ProblemFactory = (rng) => {
  const s = randInt(rng, 2, 6);
  const unit = choice(rng, ['in', 'cm', 'm'] as const);
  const sa = 6 * s * s;
  const svg = prismNetSvg(s, s, s, unit);
  const sqUnit = unit === 'm' ? 'square meters' : unit === 'cm' ? 'square centimeters' : 'square inches';
  const m = mcUnique(rng, `${sa} \\text{ ${sqUnit}}`, [
    `${4 * s * s} \\text{ ${sqUnit}}`,
    `${s * s * s} \\text{ ${sqUnit}}`,
    `${12 * s} \\text{ ${sqUnit}}`,
  ], (k) => `${sa + 12 * k} \\text{ ${sqUnit}}`);
  return {
    itemType: 'MC',
    context: 'This shows the net of a cube. What is the surface area of the cube?',
    question: '\\text{surface area} = ?',
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `A cube has 6 identical square faces with side ${s}.`, math: `SA = 6 \\times ${s}^2 = ${sa}` },
    ],
    hints: ['Count 6 faces in the net, each a square.'],
    timeEstimate: 50,
  };
};

export const geometryFactories: ProblemFactory[] = [
  genCoordDistanceHorizontal,
  genPrismNetSA,
  genSquarePrismNetSA,
  genTrapezoidArea,
  genFractionVolume,
  genTriangleNetSA,
  genCubeNetSA,
];
