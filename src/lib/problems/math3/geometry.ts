// m3-geometry: area models, quadrilateral properties, circle equations,
// arcs & angles (degrees and radians), circle diagrams, volume scaling.
// Covers released items 17-21, 25, 43, 45-49 (original items only).

import type { ProblemFactory } from '../../problemGenerator';
import { choice, randInt } from '../math1/rng';
import { frac, linExpr, mc, num } from '../math1/latex';
import { circleDiagramSvg } from './svg';

// ── Q17-style: annulus area (G-MG.1) ────────────────────────────────────
export const genAnnulus: ProblemFactory = (rng) => {
  const R = randInt(rng, 50, 100);
  const r = randInt(rng, 20, R - 10);
  const area = R * R - r * r;
  const correct = `${num(area)}\\pi`;
  const m = mc(rng, correct, [
    `${num((R - r) * (R - r))}\\pi`,
    `${num(2 * (R - r))}\\pi`,
    `${num((R - r) * (R - r) * 4)}\\pi`,
    `${num(area * 2)}\\pi`,
  ]);
  return {
    itemType: 'MC',
    context: `A park has a circular path. The outer edge of the path has a diameter of ${2 * R} meters. The inner edge has a diameter of ${2 * r} meters. What is the area, in square meters, of the path?`,
    question: `A = \\pi R^2 - \\pi r^2`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `The radii are ${R} and ${r}.`, math: `A = \\pi(${R}^2) - \\pi(${r}^2)` },
      { number: 2, description: 'Compute.', math: `A = ${correct}` },
    ],
    hints: ['Area of path = outer circle area - inner circle area. Use radii, not diameters.'],
    timeEstimate: 75,
  };
};

// ── Q18-style: regular hexagon area -> unit cost (G-MG.1) ───────────────
export const genHexagonCost: ProblemFactory = (rng) => {
  const s = choice(rng, [6, 8, 9, 10, 12]);
  const cost = randInt(rng, 8, 30) + 0.5;
  const area = (3 * Math.sqrt(3) / 2) * s * s;
  const per = cost / area;
  const fmt = (v: number) => `\\$${v.toFixed(2)}`;
  const correct = fmt(per);
  const m = mc(rng, correct, [fmt(per * 2), fmt(per / 2), fmt(cost / (6 * s)), fmt(per + 0.05)]);
  return {
    itemType: 'MC',
    context: `A person painted the front side of a sign in the shape of a regular hexagon. Each edge of the sign measures ${s} inches. The paint cost a total of $${cost.toFixed(2)}. Approximately how much was spent on paint per square inch?`,
    question: `A_{hex} = \\frac{3\\sqrt{3}}{2} s^2`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Area of a regular hexagon with side ${s}.`, math: `A = \\frac{3\\sqrt{3}}{2}(${s})^2 \\approx ${num(Math.round(area * 10) / 10)}` },
      { number: 2, description: 'Divide total cost by area.', math: `\\frac{${cost.toFixed(2)}}{${num(Math.round(area * 10) / 10)}} \\approx ${correct}` },
    ],
    hints: ['A regular hexagon is 6 equilateral triangles.'],
    timeEstimate: 90,
  };
};

// ── Q19-style: rhombus perimeter from half-diagonals (G-CO.14) ──────────
const TRIPLES: [number, number, number][] = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 12, 15], [20, 21, 29]];
export const genRhombusPerimeter: ProblemFactory = (rng) => {
  const [p, q, side] = choice(rng, TRIPLES);
  const perim = 4 * side;
  const m = mc(rng, `${perim}`, [`${2 * (p + q)}`, `${2 * side + p}`, `${perim - 4}`, `${perim + 8}`].map((s) => `${s} \\text{ units}`));
  return {
    itemType: 'MC',
    context: `Rhombus MPRT is shown. Point E is where the diagonals intersect. The distance from M to E is ${p} units. The distance from P to E is ${q} units. What is the perimeter of MPRT?`,
    question: `\\text{side} = \\sqrt{${p}^2 + ${q}^2}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Diagonals of a rhombus bisect each other at right angles, so each side is the hypotenuse of a right triangle with legs equal to the half-diagonals.', math: `\\text{side} = \\sqrt{${p * p} + ${q * q}} = ${side}` },
      { number: 2, description: 'All four sides are equal.', math: `P = 4(${side}) = ${perim}` },
    ],
    hints: ['The half-diagonals are the legs of a right triangle whose hypotenuse is one side.'],
    timeEstimate: 75,
  };
};

// ── Q20-style: inscribed angle -> arc measure, gridded (G-C.2) — VISUAL ─
export const genArcFromInscribed: ProblemFactory = (rng) => {
  const theta = choice(rng, [25, 30, 35, 40, 45, 50, 55, 60, 65]);
  const arc = 2 * theta;
  // P on the major arc, M and R the arc endpoints
  const mDeg = 200;
  const rDeg = 200 + arc;
  const pDeg = 20;
  const svg = circleDiagramSvg({
    points: [
      { label: 'M', deg: mDeg },
      { label: 'R', deg: rDeg },
      { label: 'P', deg: pDeg },
    ],
    segments: [['P', 'M'], ['P', 'R']],
    angleArc: { at: 'P', from: 'M', to: 'R', text: `${theta}°` },
  });
  return {
    itemType: 'GR',
    context: 'A diagram is shown. What is the measure of minor arc MR, in degrees?',
    question: `\\angle MPR = ${theta}^\\circ \\Rightarrow \\overset{\\frown}{MR} = \\ ?`,
    stemSvg: svg,
    answer: num(arc),
    steps: [
      { number: 1, description: 'An inscribed angle is half the measure of its intercepted arc.', math: `\\overset{\\frown}{MR} = 2(${theta}^\\circ) = ${arc}^\\circ` },
    ],
    hints: ['Arc measure = 2 x inscribed angle.'],
    timeEstimate: 60,
  };
};

// ── Q21-style: radius from circle equation, gridded (G-GPE.1) ───────────
export const genCircleRadius: ProblemFactory = (rng) => {
  const h = randInt(rng, -6, 6);
  const k = randInt(rng, -6, 6);
  const r = randInt(rng, 2, 9);
  const D = -2 * h;
  const E = -2 * k;
  const F = h * h + k * k - r * r;
  const term = (coef: number, v: string) =>
    coef === 0 ? '' : ` ${coef > 0 ? '+' : '-'} ${Math.abs(coef) === 1 && v ? '' : Math.abs(coef)}${v}`;
  const eq = `x^2 + y^2${term(D, 'x')}${term(E, 'y')}${term(F, '')} = 0`;
  return {
    itemType: 'GR',
    context: 'The equation of a circle is shown. What is the length, in units, of the radius?',
    question: eq,
    answer: num(r),
    steps: [
      { number: 1, description: 'Complete the square in x and y.', math: `(x ${h >= 0 ? '-' : '+'} ${Math.abs(h)})^2 + (y ${k >= 0 ? '-' : '+'} ${Math.abs(k)})^2 = ${r * r}` },
      { number: 2, description: 'The radius is the square root of the right side.', math: `r = \\sqrt{${r * r}} = ${r}` },
    ],
    hints: ['Complete the square to reach standard form (x - h)^2 + (y - k)^2 = r^2.'],
    timeEstimate: 90,
  };
};

// ── Q25-style: arc length -> central angle in radians (F-TF.1) ──────────
export const genArcRadians: ProblemFactory = (rng) => {
  const C = choice(rng, [8, 10, 12, 16, 18, 20]); // circumference = Cπ
  const sN = randInt(rng, 1, C - 1);
  // theta = s/r = (sN π)/(C/2) = (2 sN / C) π
  const piTimes = (t: string) =>
    t === '1' ? '\\pi' : t === '-1' ? '-\\pi' : t.includes('\\frac') ? `${t} \\pi` : `${t}\\pi`;
  const correctTex = piTimes(frac(2 * sN, C));
  const m = mc(rng, correctTex, [
    piTimes(frac(sN, C)),
    piTimes(frac(4 * sN, C)),
    `${num(2 * sN)}\\pi`,
    piTimes(frac(2 * sN, C + 2)),
  ]);
  return {
    itemType: 'MC',
    context: `The circumference of circle Y is ${C}π cm, and the length of arc XZ is ${sN}π cm. What is the measure of angle XYZ in radians?`,
    question: `\\theta = \\frac{s}{r}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Circumference ${C}π means the radius is ${C / 2}.`, math: `2\\pi r = ${C}\\pi \\Rightarrow r = ${C / 2}` },
      { number: 2, description: 'Angle = arc / radius.', math: `\\theta = \\frac{${sN}\\pi}{${C / 2}} = ${correctTex}` },
    ],
    hints: ['Radians = arc length divided by radius.'],
    timeEstimate: 75,
  };
};

// ── Q43-style: central angle -> inscribed angle, gridded (G-C.2) — VISUAL
export const genInscribedFromCentral: ProblemFactory = (rng) => {
  const central = choice(rng, [70, 80, 90, 100, 110, 120, 130, 140]);
  const inscribed = central / 2;
  const gDeg = 160;
  const fDeg = 160 + central;
  const mDegC = 30;
  const svg = circleDiagramSvg({
    points: [
      { label: 'G', deg: gDeg },
      { label: 'F', deg: fDeg },
      { label: 'M', deg: mDegC },
    ],
    segments: [['O', 'G'], ['O', 'F'], ['M', 'G'], ['M', 'F']],
    angleArc: { at: 'O', from: 'G', to: 'F', text: `${central}°` },
    labels: [{ text: 'O', deg: 0, dist: 0 }],
  });
  // label O separately since dist 0 needs custom text position
  const svgWithO = svg.replace('</svg>', `<text x="120" y="112" text-anchor="middle" font-size="13" font-family="inherit" fill="currentColor">O</text></svg>`);
  return {
    itemType: 'GR',
    context: 'A figure is shown. O is the center of the circle. What is the measure of angle GMF, in degrees?',
    question: `\\angle GOF = ${central}^\\circ \\Rightarrow \\angle GMF = \\ ?`,
    stemSvg: svgWithO,
    answer: num(inscribed),
    steps: [
      { number: 1, description: 'An inscribed angle is half the central angle that intercepts the same arc.', math: `\\angle GMF = \\frac{${central}^\\circ}{2} = ${inscribed}^\\circ` },
    ],
    hints: ['Inscribed angle = half the central angle on the same arc.'],
    timeEstimate: 60,
  };
};

// ── Q45-style: circle equation from diameter endpoints (G-GPE.1) ────────
export const genCircleFromDiameter: ProblemFactory = (rng) => {
  const x1 = randInt(rng, -4, 2);
  const x2 = x1 + 2 * randInt(rng, 1, 4);
  const y1 = randInt(rng, -3, 3);
  const y2 = y1 + (rng() < 0.5 ? 0 : 2 * randInt(rng, 1, 3));
  const h = (x1 + x2) / 2;
  const k = (y1 + y2) / 2;
  const r2 = ((x2 - x1) / 2) ** 2 + ((y2 - y1) / 2) ** 2;
  // x^2 + y^2 - 2h x - 2k y + (h^2 + k^2 - r^2) = 0
  const D = -2 * h;
  const E = -2 * k;
  const F = Math.round(h * h + k * k - r2);
  const term = (coef: number, v: string) =>
    coef === 0 ? '' : ` ${coef > 0 ? '+' : '-'} ${Math.abs(coef) === 1 && v ? '' : Math.abs(coef)}${v}`;
  const eq = (d: number, e: number, f: number) => `x^2 + y^2${term(d, 'x')}${term(e, 'y')}${term(f, '')} = 0`;
  const correct = eq(D, E, F);
  const distractors = [
    eq(-D, -E, F),
    eq(D, E, F - Math.round(r2)),
    eq(D * 2, E * 2, F),
    eq(D, E, -F === 0 ? F + 4 : -F),
  ];
  if (new Set([correct, ...distractors]).size < 5) return genCircleFromDiameter(rng, 'medium');
  const m = mc(rng, correct, distractors);
  return {
    itemType: 'MC',
    context: `The endpoints of a diameter of a circle are located at (${x1}, ${y1}) and (${x2}, ${y2}). Which is an equation of the circle?`,
    question: `\\text{center} = \\left(${num(h)}, ${num(k)}\\right),\\quad r^2 = ${num(r2)}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'The center is the midpoint of the diameter; r^2 is the squared half-distance.', math: `(x ${h >= 0 ? '-' : '+'} ${num(Math.abs(h))})^2 + (y ${k >= 0 ? '-' : '+'} ${num(Math.abs(k))})^2 = ${num(r2)}` },
      { number: 2, description: 'Expand to general form.', math: correct },
    ],
    hints: ['Midpoint gives the center; half the diameter length gives the radius.'],
    timeEstimate: 105,
  };
};

// ── Q46-style: circumcenter geometry (G-CO.14) ──────────────────────────
export const genCircumcenter: ProblemFactory = (rng) => {
  const [m, EK, R] = choice(rng, TRIPLES); // legs m & EK, hypotenuse R
  const c = randInt(rng, 4, 16);
  // EK = 2x - c  ->  x = (EK + c)/2  (keep c and EK same parity for integer x)
  if ((EK + c) % 2 !== 0) return genCircumcenter(rng, 'medium');
  const x = (EK + c) / 2;
  const correct = num(x);
  const mm = mc(rng, correct, [num(x + 2), num(x - 2), num(EK + c), num((R + c) / 2 === x ? x + 4 : Math.round((R + c) / 2))]);
  return {
    itemType: 'MC',
    context: `Point E is the circumcenter of triangle MRS. K is the midpoint of MR. The measure of MK is ${m} units. The measure of RE is ${R} units. EK measures (2x - ${c}) units. What is the value of x?`,
    question: `(2x - ${c})^2 + ${m}^2 = ${R}^2`,
    answer: mm.answer,
    choices: mm.choices,
    steps: [
      { number: 1, description: 'The circumcenter is equidistant from all vertices, and EK is perpendicular to MR at its midpoint — a right triangle.', math: `EK = \\sqrt{${R}^2 - ${m}^2} = \\sqrt{${R * R - m * m}} = ${EK}` },
      { number: 2, description: 'Set the expression equal and solve.', math: `2x - ${c} = ${EK} \\Rightarrow x = ${correct}` },
    ],
    hints: ['RE is the circumradius; triangle MKE is a right triangle.'],
    timeEstimate: 90,
  };
};

// ── Q47-style: arc length -> central angle in degrees (G-C.5) ───────────
export const genCentralAngleDeg: ProblemFactory = (rng) => {
  const r = choice(rng, [8, 10, 12, 16, 20]);
  const s = randInt(rng, 2, 12);
  const deg = Math.round((s / r) * (180 / Math.PI));
  const correct = `${deg}^\\circ`;
  const m = mc(rng, correct, [
    `${Math.round(deg * 2)}^\\circ`,
    `${Math.max(5, Math.round(deg / 2))}^\\circ`,
    `${deg + 15}^\\circ`,
    `${Math.round((s / (2 * r)) * (180 / Math.PI))}^\\circ`,
  ]);
  return {
    itemType: 'MC',
    context: `A circle has a diameter of ${2 * r} meters. An arc on that circle has a length of ${s} meters. What is the approximate measure of the central angle that corresponds to the arc?`,
    question: `\\theta = \\frac{s}{r} \\cdot \\frac{180}{\\pi}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: `Radius is ${r}. Angle in radians is s/r.`, math: `\\theta = \\frac{${s}}{${r}} = ${num(Math.round((s / r) * 1000) / 1000)} \\text{ rad}` },
      { number: 2, description: 'Convert to degrees.', math: `\\theta \\approx ${deg}^\\circ` },
    ],
    hints: ['theta(rad) = arc / radius; multiply by 180/pi for degrees.'],
    timeEstimate: 75,
  };
};

// ── Q48-style: volume scale factor (G-GMD.3) ────────────────────────────
export const genVolumeScale: ProblemFactory = (rng) => {
  const k = choice(rng, [2, 3, 5]);
  const word = k === 2 ? 'doubled' : k === 3 ? 'tripled' : 'multiplied by 5';
  const correct = `\\sqrt[3]{${k}}`;
  const m = mc(rng, correct, [
    `\\frac{${k}}{3}`,
    `\\sqrt{${k}}`,
    `${k}`,
    `\\frac{1}{3}`,
  ]);
  return {
    itemType: 'MC',
    context: `The volume of a cube was ${word} by increasing the side length. By what factor did the side length increase?`,
    question: `s^3 \\to ${k}s^3`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'If the side scales by factor f, the volume scales by f^3.', math: `f^3 = ${k} \\Rightarrow f = \\sqrt[3]{${k}}` },
    ],
    hints: ['Volume scales with the cube of the side length.'],
    timeEstimate: 60,
  };
};

// ── Q49-style: rectangle diagonals bisect (G-CO.14) ─────────────────────
export const genRectangleDiagonals: ProblemFactory = (rng) => {
  const x0 = randInt(rng, 1, 6);
  const a = choice(rng, [5, 7, 3]);
  const c2 = choice(rng, [4, 6, 2]);
  const b = 2 * randInt(rng, 1, 8); // even so (a x0 + b) parity controllable below
  // RZ = RT/2:  c2 x0 + d = (a x0 + b)/2  ->  d = (a x0 + b)/2 - c2 x0
  const half = (a * x0 + b) / 2;
  const d = half - c2 * x0;
  if (!Number.isInteger(d) || !Number.isInteger(half) || d <= 0) return genRectangleDiagonals(rng, 'medium');
  const uz = c2 * x0 + d;
  const correct = `${uz} \\text{ units}`;
  const m = mc(rng, correct, [
    `${x0} \\text{ units}`,
    `${half * 2} \\text{ units}`,
    `${uz * 2} \\text{ units}`,
    `${Math.abs(uz - 5)} \\text{ units}`,
  ]);
  return {
    itemType: 'MC',
    context: `Rectangle URST has diagonals RT and SU that intersect at point Z. The measure of segment RT equals ${linExpr(a, b)}. The measure of segment RZ equals ${linExpr(c2, d)}. What is the distance from point U to point Z?`,
    question: `UZ = SZ = \\frac{RT}{2}`,
    answer: m.answer,
    choices: m.choices,
    steps: [
      { number: 1, description: 'Diagonals of a rectangle are equal and bisect each other, so RZ = RT/2.', math: `${linExpr(c2, d)} = \\frac{${linExpr(a, b)}}{2} \\Rightarrow x = ${x0}` },
      { number: 2, description: `UZ equals half the diagonal as well.`, math: `UZ = ${c2}(${x0}) + ${d} = ${uz}` },
    ],
    hints: ['In a rectangle the diagonals are congruent and bisect each other — all four half-segments are equal.'],
    timeEstimate: 90,
  };
};

export const geometryFactories: ProblemFactory[] = [
  genAnnulus,
  genHexagonCost,
  genRhombusPerimeter,
  genArcFromInscribed,
  genCircleRadius,
  genArcRadians,
  genInscribedFromCentral,
  genCircleFromDiameter,
  genCircumcenter,
  genCentralAngleDeg,
  genVolumeScale,
  genRectangleDiagonals,
];
