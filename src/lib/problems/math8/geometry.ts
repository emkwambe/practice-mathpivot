// g8-geometry: coordinate transformations (with plane diagrams), angle
// relationships, Pythagorean theorem, distance formula, volumes.
// Covers released items 7, 19, 20, 22, 24, 26, 30, 32, 35, 39, 41, 43 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt, shuffle } from '../math1/rng';
import { linExpr, mc, num } from '../math1/latex';
import { exteriorAngleSvg, polygonPlaneSvg, transversalSvg, type PlanePoint } from './svg';

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

const TRIPLES: [number, number, number][] = [
  [3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [7, 24, 25], [12, 16, 20], [10, 24, 26],
];

const coord = (x: number, y: number) => `(${x}, ${y})`;

// ── Q7-style MC + VIS stem: identify the FIRST transformation ───────────
export const genTransformSequenceId: ProblemFactory = (rng) => {
  // small triangle T1 → [first transform] → intermediate → dilation ×2 at origin + translate → T2
  // Simplify to a known sequence: T1 dilated ×k about origin = T2 (drawn); ask which single transformation maps T1 to T2.
  const k = choice(rng, [2, 3]);
  const base: PlanePoint[] = [
    { label: 'P', x: randInt(rng, 1, 2), y: randInt(rng, 1, 2) },
    { label: 'Q', x: randInt(rng, 2, 3), y: randInt(rng, 1, 2) },
    { label: 'R', x: randInt(rng, 1, 2), y: randInt(rng, 2, 3) },
  ];
  const scaled = base.map((p) => ({ x: p.x * k, y: p.y * k }));
  const svg = polygonPlaneSvg(scaled, { dashed: base });
  const correct = `a dilation by a scale factor of ${k} centered at the origin`;
  const m = mcUnique(rng, correct, [
    `a dilation by a scale factor of ${k + 1} centered at the origin`,
    `a translation ${k} units right and ${k} units up`,
    `a reflection over the x-axis followed by a dilation by a scale factor of ${k}`,
  ], (kk) => `a dilation by a scale factor of ${k} centered at (${kk}, 0)`);
  return {
    itemType: 'MC',
    context: 'Triangle PQR (dashed) is transformed into the larger triangle shown. Which single transformation maps PQR onto the larger triangle?',
    question: '\\text{transformation?}',
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Each image coordinate is exactly k times the original.', math: `(${base[0].x}, ${base[0].y}) \\to (${scaled[0].x}, ${scaled[0].y})` },
      { number: 2, description: 'That is a dilation centered at the origin.', math: `k = ${k}` },
    ],
    hints: ['Compare the coordinates of one vertex and its image.'],
    timeEstimate: 75,
  };
};

// ── Q22-style MC + VIS choices: which graph shows the dilation ──────────
export const genDilationChoice: ProblemFactory = (rng) => {
  const k = choice(rng, [2, 3]);
  const base: PlanePoint[] = [
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 2, y: 2 },
    { x: 1, y: 3 },
  ];
  const correctImg = base.map((p) => ({ x: p.x * k, y: p.y * k }));
  const shifted = base.map((p) => ({ x: p.x + k, y: p.y + k }));
  const scaledShifted = base.map((p) => ({ x: p.x * k + 1, y: p.y * k + 1 }));
  const reflected = base.map((p) => ({ x: p.x * k, y: -p.y * k }));
  const correctIdx = randInt(rng, 0, 3);
  const imgs = shuffle(rng, [shifted, scaledShifted, reflected]);
  const svgs: string[] = [];
  let ii = 0;
  for (let i = 0; i < 4; i++) svgs.push(polygonPlaneSvg(i === correctIdx ? correctImg : imgs[ii++], { range: 7, dashed: base }));
  const letters = ['A', 'B', 'C', 'D'];
  return {
    itemType: 'MC',
    context: `Quadrilateral ABCD (dashed) is dilated by a scale factor of ${k} centered at the origin. Which graph shows the image?`,
    question: `k = ${k}`,
    svgChoices: svgs,
    answer: letters[correctIdx],
    choices: letters,
    steps: [
      { number: 1, description: 'Multiply every coordinate by the scale factor.', math: `(1, 1) \\to (${k}, ${k}),\\; (1, 3) \\to (${k}, ${3 * k})` },
    ],
    hints: ['A dilation about the origin multiplies both coordinates — no shifting.'],
    timeEstimate: 60,
  };
};

// ── Q43-style MC + VIS stem: reflect then translate → image coords ──────
export const genReflectTranslate: ProblemFactory = (rng) => {
  const P: PlanePoint = { label: 'P', x: -randInt(rng, 2, 4), y: -randInt(rng, 2, 5) };
  const Q: PlanePoint = { label: 'Q', x: -randInt(rng, 4, 5), y: randInt(rng, 3, 5) };
  const R: PlanePoint = { label: 'R', x: randInt(rng, 1, 3), y: -randInt(rng, 1, 2) };
  const t = randInt(rng, 1, 4); // translate right t
  const svg = polygonPlaneSvg([P, Q, R]);
  // reflect over y-axis: (x,y) → (−x,y); then translate right t: (x+t, y)
  const ans = { x: -P.x + t, y: P.y };
  const correct = coord(ans.x, ans.y);
  const m = mcUnique(rng, correct, [
    coord(P.x + t, P.y),           // forgot reflection
    coord(-P.x - t, P.y),          // translated the wrong way
    coord(-P.x + t, -P.y),         // flipped y too
  ], (k) => coord(ans.x + k, ans.y));
  return {
    itemType: 'MC',
    context: `Triangle PQR is shown. The triangle is reflected over the y-axis and then translated ${t} unit${t > 1 ? 's' : ''} to the right, resulting in triangle P′Q′R′. What are the coordinates of P′?`,
    question: `(${P.x}, ${P.y}) \\to (\\,?,\\,?)`,
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Reflect P over the y-axis (negate x).', math: `(${P.x}, ${P.y}) \\to (${-P.x}, ${P.y})` },
      { number: 2, description: `Translate ${t} right (add to x).`, math: `\\to ${correct}` },
    ],
    hints: ['Reflection over the y-axis changes only the sign of x.'],
    timeEstimate: 75,
  };
};

// ── Q19-style GR + VIS: parallel lines + transversal, equal angles ──────
export const genParallelTransversal: ProblemFactory = (rng) => {
  const a = choice(rng, [2, 3, 4]);
  const b = randInt(rng, 2, 20);
  const c = a + choice(rng, [1, 2, 3]);
  // (a x + b) = (c x − d) → x = (b + d)/(c − a); want integer x and angle
  const d = randInt(rng, 100, 140);
  const x0num = b + d;
  if (x0num % (c - a) !== 0) return genParallelTransversal(rng, 'medium');
  const x0 = x0num / (c - a);
  const angle = a * x0 + b;
  if (angle <= 0 || angle >= 180) return genParallelTransversal(rng, 'medium');
  const svg = transversalSvg(`(${linExpr(a, b)})°`, `(${linExpr(c, -d)})°`);
  return {
    itemType: 'GR',
    context: 'Lines l and m are parallel. The two labeled angles are alternate exterior angles. What is the measure, in degrees, of the labeled angle? Write only the number in the box.',
    question: `${linExpr(a, b)} = ${linExpr(c, -d)}`,
    stemSvg: svg,
    answer: num(angle),
    steps: [
      { number: 1, description: 'Alternate exterior angles are equal.', math: `${linExpr(a, b)} = ${linExpr(c, -d)}` },
      { number: 2, description: 'Solve for x.', math: `x = ${x0}` },
      { number: 3, description: 'Substitute back for the angle.', math: `${a}(${x0}) + ${b} = ${angle}°` },
    ],
    hints: ['Alternate exterior angles are congruent — set the expressions equal.'],
    timeEstimate: 90,
  };
};

// ── Q41-style MC + VIS: exterior angle = sum of remote interiors ────────
export const genExteriorAngle: ProblemFactory = (rng) => {
  const a = choice(rng, [2, 4]);
  const b = randInt(rng, 5, 20);
  const c = choice(rng, [2, 3]);
  const d = randInt(rng, 2, 12);
  // (a x + b) + (c x + d) = (e x − f); choose e, f so x is a nice integer
  const e = a + c + 2;
  const x0 = randInt(rng, 3, 9);
  const ext = (a + c) * x0 + b + d;
  const f = e * x0 - ext; // (e x − f) = ext at x0
  if (f <= 0) return genExteriorAngle(rng, 'medium');
  const svg = exteriorAngleSvg(`(${linExpr(a, b)})°`, `(${linExpr(c, d)})°`, `(${linExpr(e, -f)})°`);
  const correct = num(ext);
  const m = mcUnique(rng, correct, [
    num(ext - 2 * x0),
    num(180 - ext),
    num(e * x0 + f),
  ], (k) => num(ext + 6 * k));
  return {
    itemType: 'MC',
    context: 'What is the measure, in degrees, of the exterior angle shown?',
    question: `(${linExpr(a, b)}) + (${linExpr(c, d)}) = (${linExpr(e, -f)})`,
    stemSvg: svg,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Exterior angle = sum of the two remote interior angles.', math: `${linExpr(a + c, b + d)} = ${linExpr(e, -f)}` },
      { number: 2, description: 'Solve for x.', math: `x = ${x0}` },
      { number: 3, description: 'Evaluate the exterior angle.', math: `${ext}°` },
    ],
    hints: ['Exterior angle theorem: outside angle = sum of the two far inside angles.'],
    timeEstimate: 90,
  };
};

// ── Q20-style GR: exact distance between two points ─────────────────────
export const genDistanceExact: ProblemFactory = (rng) => {
  const [a, b, c] = choice(rng, TRIPLES);
  const x1 = randInt(rng, -6, 2);
  const y1 = randInt(rng, -4, 4);
  const sx = choice(rng, [1, -1]);
  const sy = choice(rng, [1, -1]);
  const x2 = x1 + sx * a;
  const y2 = y1 + sy * b;
  return {
    itemType: 'GR',
    context: `What is the distance between the points (${x1}, ${y1}) and (${x2}, ${y2})?`,
    question: `d = \\sqrt{(${x2} - (${x1}))^2 + (${y2} - (${y1}))^2}`,
    answer: num(c),
    steps: [
      { number: 1, description: 'Distance formula.', math: `\\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}} = ${c}` },
    ],
    hints: ['The differences form a Pythagorean triple.'],
    timeEstimate: 75,
  };
};

// ── Q24-style MC: approximate distance between two points ───────────────
export const genDistanceApprox: ProblemFactory = (rng) => {
  const dx = randInt(rng, 5, 9);
  const dy = randInt(rng, 5, 9);
  const d2 = dx * dx + dy * dy;
  const approx = Math.round(Math.sqrt(d2) * 10) / 10;
  const x1 = randInt(rng, -4, 2);
  const y1 = randInt(rng, -4, 2);
  const m = mcUnique(rng, num(approx), [
    num(Math.round((approx + 1) * 10) / 10),
    num(Math.round((approx - 1) * 10) / 10),
    num(Math.round(Math.sqrt(d2) * 10) / 10 + 2),
  ], (k) => num(Math.round((approx + 1 + 0.5 * k) * 10) / 10));
  return {
    itemType: 'MC',
    context: `Which value is closest to the distance between (${x1}, ${y1}) and (${x1 + dx}, ${y1 + dy})?`,
    question: `\\sqrt{${d2}} \\approx \\,?`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Distance formula.', math: `\\sqrt{${dx}^2 + ${dy}^2} = \\sqrt{${d2}} \\approx ${approx}` },
    ],
    hints: [`${d2} lies between two perfect squares — estimate, then refine.`],
    timeEstimate: 75,
  };
};

// ── Q26-style MC: diagonal path across a rectangular park + cost ────────
export const genPythagoreanDiagonalCost: ProblemFactory = (rng) => {
  const [a, b, c] = choice(rng, [[120, 160, 200], [150, 200, 250], [180, 240, 300], [200, 320, 377]] as const);
  const rate = choice(rng, [8.5, 9.75, 10.5, 12.25]);
  // path diagonal c; cost = c × width w × rate; keep simple: path area = c × w
  const w = choice(rng, [3, 4, 5]);
  const cost = c * w * rate;
  const m = mcUnique(rng, `\\$${Math.round(cost).toLocaleString('en-US')}`, [
    `\\$${Math.round(a * w * rate).toLocaleString('en-US')}`,
    `\\$${Math.round((a + b) * w * rate).toLocaleString('en-US')}`,
    `\\$${Math.round(cost + 500).toLocaleString('en-US')}`,
  ], (k) => `\\$${Math.round(cost + 750 * k).toLocaleString('en-US')}`);
  return {
    itemType: 'MC',
    context: `A rectangular park measures ${a} yards by ${b} yards. A straight path ${w} yards wide runs diagonally from one corner to the opposite corner. The path costs $${rate} per square yard to pave. About how much will the path cost?`,
    question: `\\text{diagonal} = \\sqrt{${a}^2 + ${b}^2}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Diagonal length (Pythagorean theorem).', math: `\\sqrt{${a * a} + ${b * b}} \\approx ${c}` },
      { number: 2, description: 'Area × rate.', math: `${c} \\times ${w} \\times ${rate} \\approx ${Math.round(cost)}` },
    ],
    hints: ['Find the diagonal first, then multiply by width and rate.'],
    timeEstimate: 120,
  };
};

// ── Q30-style MC: tower + guy wire ──────────────────────────────────────
export const genPythagoreanTowerWire: ProblemFactory = (rng) => {
  const [a, b, c] = choice(rng, TRIPLES.map(([x, y, z]) => [x * 10, y * 10, z * 10] as [number, number, number]).concat([[72, 140, 157]]));
  const m = mcUnique(rng, num(c), [
    num(c + 10),
    num(Math.max(c - 10, 10)),
    num(a + b),
  ], (k) => num(c + 15 * k));
  return {
    itemType: 'MC',
    context: `A tower is ${b} feet tall. A support wire runs from the top of the tower to a point on the ground ${a} feet from the base. About how long is the wire, in feet?`,
    question: `\\sqrt{${a}^2 + ${b}^2}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'The tower, ground, and wire form a right triangle.', math: `\\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}} \\approx ${c}` },
    ],
    hints: ['The wire is the hypotenuse.'],
    timeEstimate: 75,
  };
};

// ── Q39-style MC: ladder against a wall ─────────────────────────────────
export const genPythagoreanLadder: ProblemFactory = (rng) => {
  const [a, b, c] = choice(rng, TRIPLES);
  const m = mcUnique(rng, num(b), [
    num(c - a),
    num(Math.round(Math.sqrt(c * c + a * a) * 10) / 10),
    num(b + 2),
  ], (k) => num(b + k + 2));
  return {
    itemType: 'MC',
    context: `A ladder ${c} feet long leans against a wall with its base ${a} feet from the wall. How high up the wall does the ladder reach, to the nearest foot?`,
    question: `\\sqrt{${c}^2 - ${a}^2}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Here the ladder is the hypotenuse — subtract.', math: `\\sqrt{${c}^2 - ${a}^2} = \\sqrt{${c * c - a * a}} = ${b}` },
    ],
    hints: ['Height² = ladder² − base².'],
    timeEstimate: 60,
  };
};

// ── Q32-style MC: cone volume (π = 3.14) ────────────────────────────────
export const genConeVolume: ProblemFactory = (rng) => {
  const r = choice(rng, [3, 5, 6, 10]);
  const h = choice(rng, [3, 6, 9, 12]);
  const V = Math.round((3.14 * r * r * h) / 3);
  const m = mcUnique(rng, num(V), [
    num(Math.round(3.14 * r * r * h)),
    num(Math.round((3.14 * r * h) / 3)),
    num(V + Math.round(3.14 * r)),
  ], (k) => num(V + 31 * k));
  return {
    itemType: 'MC',
    context: `A cone has a radius of ${r} units and a height of ${h} units. Using 3.14 for π, what is the volume of the cone, in cubic units?`,
    question: `V = \\frac{1}{3}(3.14)(${r})^2(${h})`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Cone volume formula.', math: `V = \\frac{1}{3}\\pi r^2 h = \\frac{1}{3}(3.14)(${r * r})(${h}) = ${V}` },
    ],
    hints: ['Do not forget the ⅓ — that is the most common error.'],
    timeEstimate: 75,
  };
};

// ── Q35-style MC: cylinder volume from diameter (π = 3.14) ─────────────
export const genCylinderVolume: ProblemFactory = (rng) => {
  const d = choice(rng, [4, 6, 10, 12]);
  const r = d / 2;
  const h = choice(rng, [5, 7.5, 8, 10]);
  const V = Math.round(3.14 * r * r * h * 10) / 10;
  const m = mcUnique(rng, num(V), [
    num(Math.round(3.14 * d * d * h * 10) / 10),
    num(Math.round(3.14 * r * h * 10) / 10),
    num(Math.round((V + 3.14 * r * r) * 10) / 10),
  ], (k) => num(Math.round((V + 25 * k) * 10) / 10));
  return {
    itemType: 'MC',
    context: `A cylinder has a diameter of ${d} units and a height of ${h} units. Using 3.14 for π, what is the volume, in cubic units? Round to the nearest tenth.`,
    question: `V = (3.14)(${num(r)})^2(${h})`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Radius is half the diameter.', math: `r = ${num(r)}` },
      { number: 2, description: 'Cylinder volume formula.', math: `V = \\pi r^2 h = ${num(V)}` },
    ],
    hints: ['Diameter ÷ 2 = radius before squaring.'],
    timeEstimate: 75,
  };
};

export const geometryFactories: ProblemFactory[] = [
  genTransformSequenceId,
  genDilationChoice,
  genReflectTranslate,
  genParallelTransversal,
  genExteriorAngle,
  genDistanceExact,
  genDistanceApprox,
  genPythagoreanDiagonalCost,
  genPythagoreanTowerWire,
  genPythagoreanLadder,
  genConeVolume,
  genCylinderVolume,
];
