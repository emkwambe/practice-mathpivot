// ─────────────────────────────────────────────────────────────────────────────
// APPLICATIONS OF INTEGRATION PROBLEM BANK (Phase 2 — EXPANSION_PLAN.md)
//
// Area between curves, volumes of revolution, arc length, surface area,
// work & physics, center of mass, and average value / probability.
// Answers are numeric or simple expressions (with \\pi or fractions) so the
// hybrid math.js checker can verify them. All LaTeX backslashes are doubled.
// ─────────────────────────────────────────────────────────────────────────────

import type { Difficulty, AppIntegrationTechnique, ProblemTemplate } from '../problemGenerator';

// ═══════════════════════════════════════════════════════════════════════════
// AREA BETWEEN CURVES
// ═══════════════════════════════════════════════════════════════════════════

const areaEasy: ProblemTemplate[] = [
  {
    question: "\\text{Find the area of the region bounded by } y = x^2\\text{, the } x\\text{-axis,} \\\\ \\text{and the lines } x = 0 \\text{ and } x = 2\\text{.}",
    answer: "\\frac{8}{3}",
    steps: [
      { number: 1, description: "Set up the definite integral of the top function", math: "A = \\int_0^2 x^2 \\, dx" },
      { number: 2, description: "Integrate with the power rule", math: "A = \\left[ \\frac{x^3}{3} \\right]_0^2 = \\frac{8}{3}" },
    ],
    hints: ["Area = integral of (top − bottom); here the bottom is y = 0"],
    timeEstimate: 90,
  },
  {
    question: "\\text{Find the area of the region enclosed by } y = x \\text{ and } y = x^2\\text{.}",
    answer: "\\frac{1}{6}",
    steps: [
      { number: 1, description: "Find the intersection points", math: "x = x^2 \\Rightarrow x = 0, \\; 1" },
      { number: 2, description: "On [0, 1], the line is above the parabola", math: "A = \\int_0^1 (x - x^2) \\, dx" },
      { number: 3, description: "Integrate", math: "A = \\left[ \\frac{x^2}{2} - \\frac{x^3}{3} \\right]_0^1 = \\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6}" },
    ],
    hints: ["Find where the curves intersect first", "Top minus bottom: x − x^2 on [0, 1]"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Find the area of the region bounded by } y = x^2 + 1\\text{, the } x\\text{-axis,} \\\\ x = 0 \\text{, and } x = 1\\text{.}",
    answer: "\\frac{4}{3}",
    steps: [
      { number: 1, description: "Set up the integral", math: "A = \\int_0^1 (x^2 + 1) \\, dx" },
      { number: 2, description: "Integrate term by term", math: "A = \\left[ \\frac{x^3}{3} + x \\right]_0^1 = \\frac{1}{3} + 1 = \\frac{4}{3}" },
    ],
    hints: ["Integrate x^2 + 1 from 0 to 1"],
    timeEstimate: 90,
  },
];

const areaMedium: ProblemTemplate[] = [
  {
    question: "\\text{Find the area of the region enclosed by } y = x^2 \\text{ and } y = 2x\\text{.}",
    answer: "\\frac{4}{3}",
    steps: [
      { number: 1, description: "Find the intersection points", math: "x^2 = 2x \\Rightarrow x = 0, \\; 2" },
      { number: 2, description: "On [0, 2], the line is above the parabola", math: "A = \\int_0^2 (2x - x^2) \\, dx" },
      { number: 3, description: "Integrate", math: "A = \\left[ x^2 - \\frac{x^3}{3} \\right]_0^2 = 4 - \\frac{8}{3} = \\frac{4}{3}" },
    ],
    hints: ["Intersections at x = 0 and x = 2", "Top minus bottom: 2x − x^2"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Find the area of the region bounded by } y = x^2 - 2x \\text{ and the } x\\text{-axis} \\\\ \\text{on the interval } [0, 2]\\text{.}",
    answer: "\\frac{4}{3}",
    steps: [
      { number: 1, description: "On [0, 2] the parabola lies below the x-axis, so area uses the absolute value", math: "A = \\int_0^2 \\left[ 0 - (x^2 - 2x) \\right] dx = \\int_0^2 (2x - x^2) \\, dx" },
      { number: 2, description: "Integrate", math: "A = \\left[ x^2 - \\frac{x^3}{3} \\right]_0^2 = 4 - \\frac{8}{3} = \\frac{4}{3}" },
    ],
    hints: ["Check the sign of the curve on [0, 2] — it is below the axis", "Area is always positive: integrate (top − bottom)"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Find the area of the region enclosed by } y = \\sqrt{x} \\text{ and } y = x^2\\text{.}",
    answer: "\\frac{1}{3}",
    steps: [
      { number: 1, description: "Find the intersection points", math: "\\sqrt{x} = x^2 \\Rightarrow x = 0, \\; 1" },
      { number: 2, description: "On [0, 1], the square root curve is on top", math: "A = \\int_0^1 (\\sqrt{x} - x^2) \\, dx" },
      { number: 3, description: "Integrate", math: "A = \\left[ \\frac{2}{3}x^{3/2} - \\frac{x^3}{3} \\right]_0^1 = \\frac{2}{3} - \\frac{1}{3} = \\frac{1}{3}" },
    ],
    hints: ["Rewrite \\sqrt{x} as x^{1/2} to integrate", "Intersections at x = 0 and x = 1"],
    timeEstimate: 180,
  },
];

const areaHard: ProblemTemplate[] = [
  {
    question: "\\text{Find the area of the region enclosed by } y = x^2 \\text{ and } y = 8 - x^2\\text{.}",
    answer: "\\frac{64}{3}",
    steps: [
      { number: 1, description: "Find the intersection points", math: "x^2 = 8 - x^2 \\Rightarrow x^2 = 4 \\Rightarrow x = \\pm 2" },
      { number: 2, description: "Set up the integral (the downward parabola is on top)", math: "A = \\int_{-2}^{2} \\left[ (8 - x^2) - x^2 \\right] dx = \\int_{-2}^{2} (8 - 2x^2) \\, dx" },
      { number: 3, description: "Use symmetry and integrate", math: "A = 2 \\int_0^2 (8 - 2x^2) \\, dx = 2 \\left[ 8x - \\frac{2x^3}{3} \\right]_0^2 = 2 \\left( 16 - \\frac{16}{3} \\right) = \\frac{64}{3}" },
    ],
    hints: ["Intersections at x = ±2", "Use symmetry: double the integral from 0 to 2"],
    timeEstimate: 240,
  },
  {
    question: "\\text{Find the total area of the regions enclosed by } y = x^3 \\text{ and } y = x\\text{.}",
    answer: "\\frac{1}{2}",
    steps: [
      { number: 1, description: "Find the intersection points", math: "x^3 = x \\Rightarrow x = -1, \\; 0, \\; 1" },
      { number: 2, description: "By symmetry, compute the area on [0, 1] and double it", math: "A = 2 \\int_0^1 (x - x^3) \\, dx" },
      { number: 3, description: "Integrate", math: "A = 2 \\left[ \\frac{x^2}{2} - \\frac{x^4}{4} \\right]_0^1 = 2 \\left( \\frac{1}{2} - \\frac{1}{4} \\right) = \\frac{1}{2}" },
    ],
    hints: ["Three intersection points split the region into two symmetric pieces", "On [0, 1], x is above x^3"],
    timeEstimate: 240,
  },
  {
    question: "\\text{Find the area of the region enclosed by } x = y^2 \\text{ and } x = 2 - y^2 \\\\ \\text{(integrate with respect to } y\\text{).}",
    answer: "\\frac{8}{3}",
    steps: [
      { number: 1, description: "Find the intersection points", math: "y^2 = 2 - y^2 \\Rightarrow y = \\pm 1" },
      { number: 2, description: "Set up the integral with horizontal slices (right curve minus left curve)", math: "A = \\int_{-1}^{1} \\left[ (2 - y^2) - y^2 \\right] dy = \\int_{-1}^{1} (2 - 2y^2) \\, dy" },
      { number: 3, description: "Use symmetry and integrate", math: "A = 2 \\left[ 2y - \\frac{2y^3}{3} \\right]_0^1 = 2 \\left( 2 - \\frac{2}{3} \\right) = \\frac{8}{3}" },
    ],
    hints: ["Horizontal slices: right − left, integrate in y", "Intersections at y = ±1"],
    timeEstimate: 240,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// VOLUMES OF REVOLUTION
// ═══════════════════════════════════════════════════════════════════════════

const volumesEasy: ProblemTemplate[] = [
  {
    question: "\\text{The region under } y = \\sqrt{x} \\text{ on } [0, 4] \\text{ is revolved about the } x\\text{-axis.} \\\\ \\text{Find the volume.}",
    answer: "8\\pi",
    steps: [
      { number: 1, description: "Disk method: square the function", math: "V = \\pi \\int_0^4 (\\sqrt{x})^2 \\, dx = \\pi \\int_0^4 x \\, dx" },
      { number: 2, description: "Integrate", math: "V = \\pi \\left[ \\frac{x^2}{2} \\right]_0^4 = 8\\pi" },
    ],
    hints: ["Disk method: V = \\pi \\int [f(x)]^2 dx"],
    timeEstimate: 120,
  },
  {
    question: "\\text{The region under } y = x \\text{ on } [0, 2] \\text{ is revolved about the } x\\text{-axis.} \\\\ \\text{Find the volume.}",
    answer: "\\frac{8\\pi}{3}",
    steps: [
      { number: 1, description: "Disk method", math: "V = \\pi \\int_0^2 x^2 \\, dx" },
      { number: 2, description: "Integrate", math: "V = \\pi \\left[ \\frac{x^3}{3} \\right]_0^2 = \\frac{8\\pi}{3}" },
    ],
    hints: ["V = \\pi \\int x^2 dx from 0 to 2"],
    timeEstimate: 120,
  },
  {
    question: "\\text{The region under } y = 2 \\text{ on } [0, 3] \\text{ is revolved about the } x\\text{-axis.} \\\\ \\text{Find the volume of the resulting cylinder.}",
    answer: "12\\pi",
    steps: [
      { number: 1, description: "Disk method with constant radius 2", math: "V = \\pi \\int_0^3 4 \\, dx" },
      { number: 2, description: "Integrate", math: "V = \\pi \\left[ 4x \\right]_0^3 = 12\\pi" },
    ],
    hints: ["This is a cylinder: V = \\pi r^2 h = \\pi (4)(3)"],
    timeEstimate: 90,
  },
];

const volumesMedium: ProblemTemplate[] = [
  {
    question: "\\text{The region under } y = x^2 \\text{ on } [0, 2] \\text{ is revolved about the } x\\text{-axis.} \\\\ \\text{Find the volume.}",
    answer: "\\frac{32\\pi}{5}",
    steps: [
      { number: 1, description: "Disk method: square the function", math: "V = \\pi \\int_0^2 (x^2)^2 \\, dx = \\pi \\int_0^2 x^4 \\, dx" },
      { number: 2, description: "Integrate", math: "V = \\pi \\left[ \\frac{x^5}{5} \\right]_0^2 = \\frac{32\\pi}{5}" },
    ],
    hints: ["(x^2)^2 = x^4 — don't forget to square the radius"],
    timeEstimate: 150,
  },
  {
    question: "\\text{The region between } y = x \\text{ and } y = x^2 \\text{ on } [0, 1] \\text{ is revolved about} \\\\ \\text{the } x\\text{-axis. Find the volume (washer method).}",
    answer: "\\frac{2\\pi}{15}",
    steps: [
      { number: 1, description: "Washer method: outer radius x, inner radius x^2", math: "V = \\pi \\int_0^1 \\left[ x^2 - (x^2)^2 \\right] dx = \\pi \\int_0^1 (x^2 - x^4) \\, dx" },
      { number: 2, description: "Integrate", math: "V = \\pi \\left[ \\frac{x^3}{3} - \\frac{x^5}{5} \\right]_0^1 = \\pi \\left( \\frac{1}{3} - \\frac{1}{5} \\right) = \\frac{2\\pi}{15}" },
    ],
    hints: ["Washer: V = \\pi \\int (R^2 - r^2) dx", "Outer radius is the line y = x"],
    timeEstimate: 210,
  },
  {
    question: "\\text{The region under } y = x^2 \\text{ on } [0, 1] \\text{ is revolved about the } y\\text{-axis.} \\\\ \\text{Find the volume using cylindrical shells.}",
    answer: "\\frac{\\pi}{2}",
    steps: [
      { number: 1, description: "Shell method: radius x, height x^2", math: "V = 2\\pi \\int_0^1 x \\cdot x^2 \\, dx = 2\\pi \\int_0^1 x^3 \\, dx" },
      { number: 2, description: "Integrate", math: "V = 2\\pi \\left[ \\frac{x^4}{4} \\right]_0^1 = \\frac{\\pi}{2}" },
    ],
    hints: ["Shells about the y-axis: V = 2\\pi \\int x \\cdot f(x) \\, dx"],
    timeEstimate: 210,
  },
];

const volumesHard: ProblemTemplate[] = [
  {
    question: "\\text{The region under } y = \\sqrt{x} \\text{ on } [0, 4] \\text{ is revolved about the } y\\text{-axis.} \\\\ \\text{Find the volume.}",
    answer: "\\frac{128\\pi}{5}",
    steps: [
      { number: 1, description: "Solve for x in terms of y; when x goes 0 to 4, y goes 0 to 2", math: "x = y^2, \\quad 0 \\le y \\le 2" },
      { number: 2, description: "Washer method in y: outer radius 4, inner radius y^2", math: "V = \\pi \\int_0^2 \\left[ 16 - (y^2)^2 \\right] dy = \\pi \\int_0^2 (16 - y^4) \\, dy" },
      { number: 3, description: "Integrate", math: "V = \\pi \\left[ 16y - \\frac{y^5}{5} \\right]_0^2 = \\pi \\left( 32 - \\frac{32}{5} \\right) = \\frac{128\\pi}{5}" },
    ],
    hints: ["Integrate in y: washers with outer radius 4 and inner radius x = y^2", "The y-range is 0 to 2"],
    timeEstimate: 270,
  },
  {
    question: "\\text{The region under } y = x^3 \\text{ on } [0, 1] \\text{ is revolved about the } x\\text{-axis.} \\\\ \\text{Find the volume.}",
    answer: "\\frac{\\pi}{7}",
    steps: [
      { number: 1, description: "Disk method: square the function", math: "V = \\pi \\int_0^1 (x^3)^2 \\, dx = \\pi \\int_0^1 x^6 \\, dx" },
      { number: 2, description: "Integrate", math: "V = \\pi \\left[ \\frac{x^7}{7} \\right]_0^1 = \\frac{\\pi}{7}" },
    ],
    hints: ["(x^3)^2 = x^6"],
    timeEstimate: 150,
  },
  {
    question: "\\text{The region between } y = 2x \\text{ and } y = x^2 \\text{ on } [0, 2] \\text{ is revolved about} \\\\ \\text{the } x\\text{-axis. Find the volume (washer method).}",
    answer: "\\frac{64\\pi}{15}",
    steps: [
      { number: 1, description: "Outer radius 2x, inner radius x^2", math: "V = \\pi \\int_0^2 \\left[ (2x)^2 - (x^2)^2 \\right] dx = \\pi \\int_0^2 (4x^2 - x^4) \\, dx" },
      { number: 2, description: "Integrate", math: "V = \\pi \\left[ \\frac{4x^3}{3} - \\frac{x^5}{5} \\right]_0^2 = \\pi \\left( \\frac{32}{3} - \\frac{32}{5} \\right) = \\frac{64\\pi}{15}" },
    ],
    hints: ["Washer: V = \\pi \\int (R^2 - r^2) dx with R = 2x and r = x^2"],
    timeEstimate: 240,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// ARC LENGTH
// ═══════════════════════════════════════════════════════════════════════════

const arcLengthEasy: ProblemTemplate[] = [
  {
    question: "\\text{Find the arc length of } y = \\frac{3}{4}x \\text{ from } x = 0 \\text{ to } x = 4\\text{.}",
    answer: "5",
    steps: [
      { number: 1, description: "Compute the derivative", math: "y' = \\frac{3}{4}" },
      { number: 2, description: "Set up the arc length integral", math: "L = \\int_0^4 \\sqrt{1 + \\frac{9}{16}} \\, dx = \\int_0^4 \\frac{5}{4} \\, dx" },
      { number: 3, description: "Integrate (this is a 3-4-5 right triangle)", math: "L = \\frac{5}{4} \\cdot 4 = 5" },
    ],
    hints: ["L = \\int \\sqrt{1 + (y')^2} dx", "1 + 9/16 = 25/16, a perfect square"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Find the arc length of } y = \\frac{4}{3}x \\text{ from } x = 0 \\text{ to } x = 3\\text{.}",
    answer: "5",
    steps: [
      { number: 1, description: "Compute the derivative", math: "y' = \\frac{4}{3}" },
      { number: 2, description: "Set up the arc length integral", math: "L = \\int_0^3 \\sqrt{1 + \\frac{16}{9}} \\, dx = \\int_0^3 \\frac{5}{3} \\, dx" },
      { number: 3, description: "Integrate", math: "L = \\frac{5}{3} \\cdot 3 = 5" },
    ],
    hints: ["1 + 16/9 = 25/9, a perfect square"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Find the arc length of the semicircle } y = \\sqrt{9 - x^2} \\text{ (radius 3).}",
    answer: "3\\pi",
    steps: [
      { number: 1, description: "The arc length of a semicircle is half the circumference", math: "L = \\frac{1}{2} (2\\pi r) = \\pi r" },
      { number: 2, description: "Substitute r = 3", math: "L = 3\\pi" },
    ],
    hints: ["A semicircle is half of a full circumference 2\\pi r"],
    timeEstimate: 90,
  },
];

const arcLengthMedium: ProblemTemplate[] = [
  {
    question: "\\text{Find the arc length of } y = \\frac{2}{3}x^{3/2} \\text{ from } x = 0 \\text{ to } x = 3\\text{.}",
    answer: "\\frac{14}{3}",
    steps: [
      { number: 1, description: "Compute the derivative", math: "y' = x^{1/2} = \\sqrt{x}" },
      { number: 2, description: "Set up the arc length integral", math: "L = \\int_0^3 \\sqrt{1 + x} \\, dx" },
      { number: 3, description: "Integrate using the power rule on (1 + x)^{1/2}", math: "L = \\left[ \\frac{2}{3}(1 + x)^{3/2} \\right]_0^3 = \\frac{2}{3}(8 - 1) = \\frac{14}{3}" },
    ],
    hints: ["y' = \\sqrt{x}, so 1 + (y')^2 = 1 + x", "Integrate (1 + x)^{1/2}"],
    timeEstimate: 210,
  },
  {
    question: "\\text{Find the arc length of } y = \\frac{x^3}{3} + \\frac{1}{4x} \\text{ from } x = 1 \\text{ to } x = 2\\text{.}",
    answer: "\\frac{59}{24}",
    steps: [
      { number: 1, description: "Compute the derivative", math: "y' = x^2 - \\frac{1}{4x^2}" },
      { number: 2, description: "Recognize the perfect square", math: "1 + (y')^2 = \\left( x^2 + \\frac{1}{4x^2} \\right)^2" },
      { number: 3, description: "Integrate the simplified form", math: "L = \\int_1^2 \\left( x^2 + \\frac{1}{4}x^{-2} \\right) dx = \\left[ \\frac{x^3}{3} - \\frac{1}{4x} \\right]_1^2" },
      { number: 4, description: "Evaluate", math: "L = \\left( \\frac{8}{3} - \\frac{1}{8} \\right) - \\left( \\frac{1}{3} - \\frac{1}{4} \\right) = \\frac{7}{3} + \\frac{1}{8} = \\frac{59}{24}" },
    ],
    hints: ["Check whether 1 + (y')^2 is a perfect square: (a + b)^2 = a^2 + 2ab + b^2", "Here 2ab = 2 · x^2 · 1/(4x^2) = 1/2, matching the cross term"],
    timeEstimate: 270,
  },
  {
    question: "\\text{Find the arc length of } y = \\frac{2}{3}x^{3/2} \\text{ from } x = 0 \\text{ to } x = 15\\text{.}",
    answer: "42",
    steps: [
      { number: 1, description: "Compute the derivative and set up the integral", math: "y' = \\sqrt{x} \\Rightarrow L = \\int_0^{15} \\sqrt{1 + x} \\, dx" },
      { number: 2, description: "Integrate", math: "L = \\left[ \\frac{2}{3}(1 + x)^{3/2} \\right]_0^{15} = \\frac{2}{3}(64 - 1) = 42" },
    ],
    hints: ["1 + (y')^2 = 1 + x", "(1 + 15)^{3/2} = 64"],
    timeEstimate: 180,
  },
];

const arcLengthHard: ProblemTemplate[] = [
  {
    question: "\\text{Find the arc length of } y = \\frac{x^3}{3} + \\frac{1}{4x} \\text{ from } x = 1 \\text{ to } x = 3\\text{.}",
    answer: "\\frac{53}{6}",
    steps: [
      { number: 1, description: "As before, 1 + (y')^2 is a perfect square", math: "L = \\int_1^3 \\left( x^2 + \\frac{1}{4x^2} \\right) dx" },
      { number: 2, description: "Integrate", math: "L = \\left[ \\frac{x^3}{3} - \\frac{1}{4x} \\right]_1^3" },
      { number: 3, description: "Evaluate", math: "L = \\left( 9 - \\frac{1}{12} \\right) - \\left( \\frac{1}{3} - \\frac{1}{4} \\right) = 9 - \\frac{1}{6} = \\frac{53}{6}" },
    ],
    hints: ["Same perfect-square trick: 1 + (y')^2 = (x^2 + 1/(4x^2))^2"],
    timeEstimate: 240,
  },
  {
    question: "\\text{Find the arc length of } y = \\frac{2}{3}x^{3/2} \\text{ from } x = 3 \\text{ to } x = 8\\text{.}",
    answer: "\\frac{38}{3}",
    steps: [
      { number: 1, description: "Set up the integral", math: "L = \\int_3^8 \\sqrt{1 + x} \\, dx" },
      { number: 2, description: "Integrate", math: "L = \\left[ \\frac{2}{3}(1 + x)^{3/2} \\right]_3^8 = \\frac{2}{3}(27 - 8) = \\frac{38}{3}" },
    ],
    hints: ["(1 + 8)^{3/2} = 27 and (1 + 3)^{3/2} = 8"],
    timeEstimate: 180,
  },
  {
    question: "\\text{Use the circumference formula to find the arc length of a full circle} \\\\ \\text{of radius } 2\\text{.}",
    answer: "4\\pi",
    steps: [
      { number: 1, description: "Circumference formula", math: "C = 2\\pi r" },
      { number: 2, description: "Substitute r = 2", math: "C = 4\\pi" },
    ],
    hints: ["C = 2\\pi r"],
    timeEstimate: 60,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// SURFACE AREA OF REVOLUTION
// ═══════════════════════════════════════════════════════════════════════════

const surfaceAreaEasy: ProblemTemplate[] = [
  {
    question: "\\text{Find the surface area of a sphere of radius } 2 \\text{ (surface area formula).}",
    answer: "16\\pi",
    steps: [
      { number: 1, description: "Surface area of a sphere", math: "S = 4\\pi r^2" },
      { number: 2, description: "Substitute r = 2", math: "S = 4\\pi (4) = 16\\pi" },
    ],
    hints: ["S = 4\\pi r^2"],
    timeEstimate: 60,
  },
  {
    question: "\\text{The upper half of the sphere } x^2 + y^2 = 9 \\text{ is a hemisphere of radius 3.} \\\\ \\text{Find its curved surface area.}",
    answer: "18\\pi",
    steps: [
      { number: 1, description: "A hemisphere has half the surface area of a full sphere", math: "S = \\frac{1}{2} \\cdot 4\\pi r^2 = 2\\pi r^2" },
      { number: 2, description: "Substitute r = 3", math: "S = 2\\pi (9) = 18\\pi" },
    ],
    hints: ["Hemisphere = half of 4\\pi r^2"],
    timeEstimate: 90,
  },
  {
    question: "\\text{The curve } y = \\sqrt{x} \\text{ on } [0, 2] \\text{ is revolved about the } x\\text{-axis.} \\\\ \\text{Find the surface area.}",
    answer: "\\frac{13\\pi}{3}",
    steps: [
      { number: 1, description: "Compute the derivative", math: "y' = \\frac{1}{2\\sqrt{x}}" },
      { number: 2, description: "Simplify the integrand", math: "S = 2\\pi \\int_0^2 \\sqrt{x} \\sqrt{1 + \\frac{1}{4x}} \\, dx = 2\\pi \\int_0^2 \\sqrt{x + \\frac{1}{4}} \\, dx" },
      { number: 3, description: "Integrate", math: "S = 2\\pi \\left[ \\frac{2}{3} \\left( x + \\frac{1}{4} \\right)^{3/2} \\right]_0^2 = \\frac{4\\pi}{3} \\left( \\frac{27}{8} - \\frac{1}{8} \\right) = \\frac{13\\pi}{3}" },
    ],
    hints: ["Multiply the square roots: \\sqrt{x} · \\sqrt{1 + 1/(4x)} = \\sqrt{x + 1/4}", "(9/4)^{3/2} = 27/8 and (1/4)^{3/2} = 1/8"],
    timeEstimate: 270,
  },
];

const surfaceAreaMedium: ProblemTemplate[] = [
  {
    question: "\\text{The curve } y = 2\\sqrt{x} \\text{ on } [0, 3] \\text{ is revolved about the } x\\text{-axis.} \\\\ \\text{Find the surface area.}",
    answer: "\\frac{56\\pi}{3}",
    steps: [
      { number: 1, description: "Compute the derivative", math: "y' = \\frac{1}{\\sqrt{x}}" },
      { number: 2, description: "Simplify the integrand", math: "S = 2\\pi \\int_0^3 2\\sqrt{x} \\sqrt{1 + \\frac{1}{x}} \\, dx = 4\\pi \\int_0^3 \\sqrt{x + 1} \\, dx" },
      { number: 3, description: "Integrate", math: "S = 4\\pi \\left[ \\frac{2}{3}(x + 1)^{3/2} \\right]_0^3 = \\frac{8\\pi}{3}(8 - 1) = \\frac{56\\pi}{3}" },
    ],
    hints: ["\\sqrt{x} · \\sqrt{1 + 1/x} = \\sqrt{x + 1}", "(3 + 1)^{3/2} = 8"],
    timeEstimate: 240,
  },
  {
    question: "\\text{The line } y = \\frac{3}{4}x \\text{ on } [0, 4] \\text{ is revolved about the } x\\text{-axis,} \\\\ \\text{forming a cone. Find its lateral surface area.}",
    answer: "15\\pi",
    steps: [
      { number: 1, description: "Identify the cone dimensions: radius at x = 4 and slant height", math: "r = 3, \\quad \\ell = \\sqrt{4^2 + 3^2} = 5" },
      { number: 2, description: "Lateral surface area of a cone", math: "S = \\pi r \\ell = \\pi (3)(5) = 15\\pi" },
    ],
    hints: ["Cone lateral area = \\pi r \\ell where \\ell is the slant height", "The slant height is the arc length of the generating line"],
    timeEstimate: 150,
  },
  {
    question: "\\text{A zone of a sphere of radius } 5 \\text{ between } x = 1 \\text{ and } x = 3 \\text{ is formed by} \\\\ \\text{revolution. Its area equals } 2\\pi r h \\text{ where } h \\text{ is the zone height. Find it.}",
    answer: "20\\pi",
    steps: [
      { number: 1, description: "Zone area formula (remarkably depends only on height)", math: "S = 2\\pi r h" },
      { number: 2, description: "Here r = 5 and h = 3 - 1 = 2", math: "S = 2\\pi (5)(2) = 20\\pi" },
    ],
    hints: ["A spherical zone has area 2\\pi r h regardless of where it sits on the sphere"],
    timeEstimate: 120,
  },
];

const surfaceAreaHard: ProblemTemplate[] = [
  {
    question: "\\text{A spherical zone of radius } 10 \\text{ between } x = 2 \\text{ and } x = 5 \\text{ has area} \\\\ 2\\pi r h\\text{. Find the area.}",
    answer: "60\\pi",
    steps: [
      { number: 1, description: "Zone height", math: "h = 5 - 2 = 3" },
      { number: 2, description: "Apply the zone formula", math: "S = 2\\pi (10)(3) = 60\\pi" },
    ],
    hints: ["S = 2\\pi r h with h = 3"],
    timeEstimate: 90,
  },
  {
    question: "\\text{The curve } y = 2\\sqrt{x} \\text{ on } [3, 8] \\text{ is revolved about the } x\\text{-axis.} \\\\ \\text{Find the surface area.}",
    answer: "\\frac{152\\pi}{3}",
    steps: [
      { number: 1, description: "As before, the integrand simplifies", math: "S = 4\\pi \\int_3^8 \\sqrt{x + 1} \\, dx" },
      { number: 2, description: "Integrate", math: "S = \\frac{8\\pi}{3} \\left[ (x + 1)^{3/2} \\right]_3^8 = \\frac{8\\pi}{3}(27 - 8) = \\frac{152\\pi}{3}" },
    ],
    hints: ["(8 + 1)^{3/2} = 27 and (3 + 1)^{3/2} = 8"],
    timeEstimate: 240,
  },
  {
    question: "\\text{The line } y = \\frac{4}{3}x \\text{ on } [0, 3] \\text{ is revolved about the } x\\text{-axis,} \\\\ \\text{forming a cone. Find its lateral surface area.}",
    answer: "20\\pi",
    steps: [
      { number: 1, description: "Cone dimensions at x = 3", math: "r = 4, \\quad \\ell = \\sqrt{3^2 + 4^2} = 5" },
      { number: 2, description: "Lateral surface area", math: "S = \\pi r \\ell = \\pi (4)(5) = 20\\pi" },
    ],
    hints: ["3-4-5 right triangle gives the slant height"],
    timeEstimate: 150,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// WORK & PHYSICS
// ═══════════════════════════════════════════════════════════════════════════

const workEasy: ProblemTemplate[] = [
  {
    question: "\\text{A spring with spring constant } k = 20 \\text{ N/m is stretched } 0.5 \\text{ m} \\\\ \\text{from its natural length. Find the work done (in joules).}",
    answer: "2.5",
    steps: [
      { number: 1, description: "Hooke's Law: F(x) = kx, so work is the integral of force", math: "W = \\int_0^{0.5} 20x \\, dx" },
      { number: 2, description: "Integrate", math: "W = \\left[ 10x^2 \\right]_0^{0.5} = 10(0.25) = 2.5 \\text{ J}" },
    ],
    hints: ["W = \\int kx \\, dx from 0 to 0.5"],
    timeEstimate: 120,
  },
  {
    question: "\\text{A constant force of } 30 \\text{ N moves an object } 4 \\text{ m.} \\\\ \\text{Find the work done (in joules).}",
    answer: "120",
    steps: [
      { number: 1, description: "Work with constant force", math: "W = F \\cdot d = 30 \\cdot 4 = 120 \\text{ J}" },
    ],
    hints: ["For constant force, W = F · d"],
    timeEstimate: 60,
  },
  {
    question: "\\text{A spring with } k = 8 \\text{ N/m is stretched } 1 \\text{ m from its natural length.} \\\\ \\text{Find the work done (in joules).}",
    answer: "4",
    steps: [
      { number: 1, description: "Set up the work integral", math: "W = \\int_0^1 8x \\, dx" },
      { number: 2, description: "Integrate", math: "W = \\left[ 4x^2 \\right]_0^1 = 4 \\text{ J}" },
    ],
    hints: ["W = \\int_0^1 8x \\, dx"],
    timeEstimate: 90,
  },
];

const workMedium: ProblemTemplate[] = [
  {
    question: "\\text{A force of } 40 \\text{ N stretches a spring } 0.8 \\text{ m from its natural length.} \\\\ \\text{Find the work (in joules) needed to stretch it from } 0.4 \\text{ m to } 0.8 \\text{ m.}",
    answer: "12",
    steps: [
      { number: 1, description: "Find the spring constant from the given data", math: "40 = k(0.8) \\Rightarrow k = 50 \\text{ N/m}" },
      { number: 2, description: "Set up the work integral over the requested interval", math: "W = \\int_{0.4}^{0.8} 50x \\, dx" },
      { number: 3, description: "Integrate", math: "W = \\left[ 25x^2 \\right]_{0.4}^{0.8} = 25(0.64 - 0.16) = 12 \\text{ J}" },
    ],
    hints: ["Use Hooke's Law to find k first", "Integrate over [0.4, 0.8], not from 0"],
    timeEstimate: 210,
  },
  {
    question: "\\text{A } 20 \\text{ m cable weighing } 50 \\text{ N/m hangs from a winch. Find the work (in joules)} \\\\ \\text{required to wind up the entire cable.}",
    answer: "10000",
    steps: [
      { number: 1, description: "A segment at height x must be lifted x meters; weight per meter is 50 N", math: "W = \\int_0^{20} 50x \\, dx" },
      { number: 2, description: "Integrate", math: "W = \\left[ 25x^2 \\right]_0^{20} = 25(400) = 10000 \\text{ J}" },
    ],
    hints: ["Slice the cable: a piece at depth x is lifted x meters"],
    timeEstimate: 210,
  },
  {
    question: "\\text{A } 15 \\text{ m rope weighing } 3 \\text{ N/m has a } 100 \\text{ N load attached at the end.} \\\\ \\text{Find the total work (in joules) to pull the rope and load up 15 m.}",
    answer: "1837.5",
    steps: [
      { number: 1, description: "Work for the constant load", math: "W_{\\text{load}} = 100 \\cdot 15 = 1500" },
      { number: 2, description: "Work for the rope (each slice at depth x is lifted x meters)", math: "W_{\\text{rope}} = \\int_0^{15} 3x \\, dx = \\left[ \\frac{3x^2}{2} \\right]_0^{15} = 337.5" },
      { number: 3, description: "Add both contributions", math: "W = 1500 + 337.5 = 1837.5 \\text{ J}" },
    ],
    hints: ["Split into load work plus rope work", "The rope part is \\int 3x dx"],
    timeEstimate: 240,
  },
];

const workHard: ProblemTemplate[] = [
  {
    question: "\\text{A cylindrical tank of radius } 2 \\text{ m and height } 6 \\text{ m is full of water} \\\\ \\text{(weight density } 9800 \\text{ N/m}^3\\text{). Find the work (in joules) to pump all the} \\\\ \\text{water out over the top. Leave your answer in terms of } \\pi\\text{.}",
    answer: "705600\\pi",
    steps: [
      { number: 1, description: "A slice at height y has volume \\pi r^2 dy and must be lifted (6 - y)... with y measured from the bottom", math: "W = \\int_0^6 9800 \\cdot \\pi (2)^2 \\cdot (6 - y) \\, dy" },
      { number: 2, description: "Factor out constants", math: "W = 39200\\pi \\int_0^6 (6 - y) \\, dy" },
      { number: 3, description: "Integrate", math: "W = 39200\\pi \\left[ 6y - \\frac{y^2}{2} \\right]_0^6 = 39200\\pi (36 - 18) = 705600\\pi \\text{ J}" },
    ],
    hints: ["Weight of a slice = density × \\pi r^2 × thickness; distance = 6 − y", "\\int_0^6 (6 - y) dy = 18"],
    timeEstimate: 300,
  },
  {
    question: "\\text{A force of } 60 \\text{ N stretches a spring } 0.2 \\text{ m. Find the work (in joules)} \\\\ \\text{needed to stretch it from } 0.2 \\text{ m to } 0.4 \\text{ m beyond its natural length.}",
    answer: "18",
    steps: [
      { number: 1, description: "Find the spring constant", math: "60 = k(0.2) \\Rightarrow k = 300 \\text{ N/m}" },
      { number: 2, description: "Set up the work integral", math: "W = \\int_{0.2}^{0.4} 300x \\, dx" },
      { number: 3, description: "Integrate", math: "W = \\left[ 150x^2 \\right]_{0.2}^{0.4} = 150(0.16 - 0.04) = 18 \\text{ J}" },
    ],
    hints: ["k = 300; integrate from 0.2 to 0.4"],
    timeEstimate: 210,
  },
  {
    question: "\\text{A } 40 \\text{ m chain weighing } 19.6 \\text{ N/m hangs over the edge of a building.} \\\\ \\text{Find the work (in joules) to pull the entire chain to the top.}",
    answer: "15680",
    steps: [
      { number: 1, description: "A slice at depth x must be lifted x meters", math: "W = \\int_0^{40} 19.6x \\, dx" },
      { number: 2, description: "Integrate", math: "W = \\left[ 9.8x^2 \\right]_0^{40} = 9.8(1600) = 15680 \\text{ J}" },
    ],
    hints: ["Same slicing idea as the cable problem", "19.6/2 = 9.8"],
    timeEstimate: 180,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// CENTER OF MASS
// ═══════════════════════════════════════════════════════════════════════════

const centerOfMassEasy: ProblemTemplate[] = [
  {
    question: "\\text{Masses of } 2 \\text{ kg and } 3 \\text{ kg sit at } x = 1 \\text{ and } x = 5 \\text{ on a rod.} \\\\ \\text{Find the center of mass } \\bar{x}\\text{.}",
    answer: "3.4",
    steps: [
      { number: 1, description: "Total moment over total mass", math: "\\bar{x} = \\frac{2(1) + 3(5)}{2 + 3}" },
      { number: 2, description: "Compute", math: "\\bar{x} = \\frac{17}{5} = 3.4" },
    ],
    hints: ["\\bar{x} = \\frac{\\sum m_i x_i}{\\sum m_i}"],
    timeEstimate: 90,
  },
  {
    question: "\\text{Masses of } 1\\text{, } 2\\text{, and } 3 \\text{ kg sit at } x = 0\\text{, } x = 2\\text{, and } x = 6\\text{.} \\\\ \\text{Find the center of mass } \\bar{x}\\text{.}",
    answer: "\\frac{11}{3}",
    steps: [
      { number: 1, description: "Total moment over total mass", math: "\\bar{x} = \\frac{1(0) + 2(2) + 3(6)}{1 + 2 + 3} = \\frac{22}{6}" },
      { number: 2, description: "Simplify", math: "\\bar{x} = \\frac{11}{3}" },
    ],
    hints: ["Moment = sum of m_i x_i = 22"],
    timeEstimate: 90,
  },
  {
    question: "\\text{A uniform rod extends from } x = 0 \\text{ to } x = 8\\text{. Find its center of mass.}",
    answer: "4",
    steps: [
      { number: 1, description: "For a uniform object, the center of mass is the midpoint", math: "\\bar{x} = \\frac{0 + 8}{2} = 4" },
    ],
    hints: ["Uniform density means the balance point is the midpoint"],
    timeEstimate: 60,
  },
];

const centerOfMassMedium: ProblemTemplate[] = [
  {
    question: "\\text{Find the } x\\text{-coordinate of the centroid of the region under } y = x \\\\ \\text{on } [0, 4]\\text{.}",
    answer: "\\frac{8}{3}",
    steps: [
      { number: 1, description: "Area of the region", math: "A = \\int_0^4 x \\, dx = 8" },
      { number: 2, description: "Moment about the y-axis", math: "M_y = \\int_0^4 x \\cdot x \\, dx = \\frac{64}{3}" },
      { number: 3, description: "Divide", math: "\\bar{x} = \\frac{M_y}{A} = \\frac{64/3}{8} = \\frac{8}{3}" },
    ],
    hints: ["\\bar{x} = \\frac{1}{A} \\int x f(x) \\, dx", "A = 8 here"],
    timeEstimate: 210,
  },
  {
    question: "\\text{Find the } x\\text{-coordinate of the centroid of the region under } y = x^2 \\\\ \\text{on } [0, 3]\\text{.}",
    answer: "\\frac{9}{4}",
    steps: [
      { number: 1, description: "Area of the region", math: "A = \\int_0^3 x^2 \\, dx = 9" },
      { number: 2, description: "Moment about the y-axis", math: "M_y = \\int_0^3 x^3 \\, dx = \\frac{81}{4}" },
      { number: 3, description: "Divide", math: "\\bar{x} = \\frac{81/4}{9} = \\frac{9}{4}" },
    ],
    hints: ["\\bar{x} = \\frac{1}{A} \\int_0^3 x \\cdot x^2 \\, dx"],
    timeEstimate: 210,
  },
  {
    question: "\\text{Find the } y\\text{-coordinate of the centroid of the region under } y = x \\\\ \\text{on } [0, 2]\\text{.}",
    answer: "\\frac{2}{3}",
    steps: [
      { number: 1, description: "Area of the region", math: "A = \\int_0^2 x \\, dx = 2" },
      { number: 2, description: "Moment about the x-axis uses half the square of the height", math: "M_x = \\frac{1}{2} \\int_0^2 x^2 \\, dx = \\frac{4}{3}" },
      { number: 3, description: "Divide", math: "\\bar{y} = \\frac{M_x}{A} = \\frac{4/3}{2} = \\frac{2}{3}" },
    ],
    hints: ["\\bar{y} = \\frac{1}{A} \\cdot \\frac{1}{2} \\int [f(x)]^2 \\, dx"],
    timeEstimate: 240,
  },
];

const centerOfMassHard: ProblemTemplate[] = [
  {
    question: "\\text{Find the } y\\text{-coordinate of the centroid of the region bounded by} \\\\ y = 4 - x^2 \\text{ and the } x\\text{-axis.}",
    answer: "\\frac{8}{5}",
    steps: [
      { number: 1, description: "The region spans [-2, 2]; compute its area", math: "A = \\int_{-2}^{2} (4 - x^2) \\, dx = \\frac{32}{3}" },
      { number: 2, description: "Moment about the x-axis", math: "M_x = \\frac{1}{2} \\int_{-2}^{2} (4 - x^2)^2 \\, dx = \\frac{1}{2} \\int_{-2}^{2} (16 - 8x^2 + x^4) \\, dx = \\frac{256}{15}" },
      { number: 3, description: "Divide", math: "\\bar{y} = \\frac{256/15}{32/3} = \\frac{256}{15} \\cdot \\frac{3}{32} = \\frac{8}{5}" },
    ],
    hints: ["By symmetry \\bar{x} = 0; only \\bar{y} needs computation", "M_x = \\frac{1}{2} \\int (4 - x^2)^2 dx — expand the square"],
    timeEstimate: 300,
  },
  {
    question: "\\text{Find the } x\\text{-coordinate of the centroid of the region under } y = \\sqrt{x} \\\\ \\text{on } [0, 4]\\text{.}",
    answer: "\\frac{12}{5}",
    steps: [
      { number: 1, description: "Area of the region", math: "A = \\int_0^4 x^{1/2} \\, dx = \\frac{2}{3}(8) = \\frac{16}{3}" },
      { number: 2, description: "Moment about the y-axis", math: "M_y = \\int_0^4 x^{3/2} \\, dx = \\frac{2}{5}(32) = \\frac{64}{5}" },
      { number: 3, description: "Divide", math: "\\bar{x} = \\frac{64/5}{16/3} = \\frac{64}{5} \\cdot \\frac{3}{16} = \\frac{12}{5}" },
    ],
    hints: ["x^{3/2} integrates to (2/5)x^{5/2}", "4^{5/2} = 32"],
    timeEstimate: 240,
  },
  {
    question: "\\text{A rod on } [0, 3] \\text{ has linear density } \\rho(x) = x\\text{. Find its center of mass.}",
    answer: "2",
    steps: [
      { number: 1, description: "Total mass", math: "m = \\int_0^3 x \\, dx = \\frac{9}{2}" },
      { number: 2, description: "Total moment", math: "M = \\int_0^3 x \\cdot x \\, dx = \\frac{27}{3} = 9" },
      { number: 3, description: "Divide", math: "\\bar{x} = \\frac{M}{m} = \\frac{9}{9/2} = 2" },
    ],
    hints: ["\\bar{x} = \\frac{\\int x \\rho(x) \\, dx}{\\int \\rho(x) \\, dx}"],
    timeEstimate: 180,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// AVERAGE VALUE & PROBABILITY
// ═══════════════════════════════════════════════════════════════════════════

const averagesEasy: ProblemTemplate[] = [
  {
    question: "\\text{Find the average value of } f(x) = x^2 \\text{ on the interval } [0, 3]\\text{.}",
    answer: "3",
    steps: [
      { number: 1, description: "Average value formula", math: "f_{\\text{avg}} = \\frac{1}{3 - 0} \\int_0^3 x^2 \\, dx" },
      { number: 2, description: "Integrate and divide", math: "f_{\\text{avg}} = \\frac{1}{3} \\cdot 9 = 3" },
    ],
    hints: ["f_{avg} = \\frac{1}{b - a} \\int_a^b f(x) \\, dx"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Find the average value of } f(x) = \\sin(x) \\text{ on the interval } [0, \\pi]\\text{.}",
    answer: "\\frac{2}{\\pi}",
    steps: [
      { number: 1, description: "Average value formula", math: "f_{\\text{avg}} = \\frac{1}{\\pi} \\int_0^{\\pi} \\sin(x) \\, dx" },
      { number: 2, description: "Integrate", math: "f_{\\text{avg}} = \\frac{1}{\\pi} \\left[ -\\cos(x) \\right]_0^{\\pi} = \\frac{1}{\\pi}(1 + 1) = \\frac{2}{\\pi}" },
    ],
    hints: ["\\int_0^{\\pi} \\sin(x) dx = 2"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Find the average value of } f(x) = 2x + 1 \\text{ on the interval } [0, 2]\\text{.}",
    answer: "3",
    steps: [
      { number: 1, description: "Integrate over the interval", math: "\\int_0^2 (2x + 1) \\, dx = \\left[ x^2 + x \\right]_0^2 = 6" },
      { number: 2, description: "Divide by the interval length", math: "f_{\\text{avg}} = \\frac{6}{2} = 3" },
    ],
    hints: ["Divide the integral by (b − a) = 2"],
    timeEstimate: 120,
  },
];

const averagesMedium: ProblemTemplate[] = [
  {
    question: "\\text{Find the average value of } f(x) = x^3 \\text{ on the interval } [0, 2]\\text{.}",
    answer: "2",
    steps: [
      { number: 1, description: "Integrate", math: "\\int_0^2 x^3 \\, dx = \\frac{16}{4} = 4" },
      { number: 2, description: "Divide by the interval length", math: "f_{\\text{avg}} = \\frac{4}{2} = 2" },
    ],
    hints: ["\\int_0^2 x^3 dx = 4; then divide by 2"],
    timeEstimate: 120,
  },
  {
    question: "\\text{The function } f(x) = kx \\text{ is a probability density function on } [0, 4]\\text{.} \\\\ \\text{Find the value of } k\\text{.}",
    answer: "\\frac{1}{8}",
    steps: [
      { number: 1, description: "A pdf must integrate to 1", math: "\\int_0^4 kx \\, dx = 1" },
      { number: 2, description: "Integrate", math: "\\left[ \\frac{kx^2}{2} \\right]_0^4 = 8k" },
      { number: 3, description: "Solve for k", math: "8k = 1 \\Rightarrow k = \\frac{1}{8}" },
    ],
    hints: ["Total probability must equal 1", "\\int_0^4 x dx = 8"],
    timeEstimate: 180,
  },
  {
    question: "\\text{A random variable has density } f(x) = \\frac{3}{64}x^2 \\text{ on } [0, 4]\\text{.} \\\\ \\text{Find its expected value } E[X]\\text{.}",
    answer: "3",
    steps: [
      { number: 1, description: "Expected value is x weighted by the density", math: "E[X] = \\int_0^4 x \\cdot \\frac{3}{64}x^2 \\, dx = \\frac{3}{64} \\int_0^4 x^3 \\, dx" },
      { number: 2, description: "Integrate", math: "E[X] = \\frac{3}{64} \\cdot \\frac{256}{4} = \\frac{3}{64} \\cdot 64 = 3" },
    ],
    hints: ["E[X] = \\int x f(x) dx", "\\int_0^4 x^3 dx = 64"],
    timeEstimate: 210,
  },
];

const averagesHard: ProblemTemplate[] = [
  {
    question: "\\text{Find the value of } c \\text{ in } (0, 3) \\text{ where } f(x) = 2x \\text{ equals its average} \\\\ \\text{value on } [0, 3] \\text{ (Mean Value Theorem for Integrals).}",
    answer: "\\frac{3}{2}",
    steps: [
      { number: 1, description: "Compute the average value", math: "f_{\\text{avg}} = \\frac{1}{3} \\int_0^3 2x \\, dx = \\frac{9}{3} = 3" },
      { number: 2, description: "Set f(c) equal to the average", math: "2c = 3 \\Rightarrow c = \\frac{3}{2}" },
    ],
    hints: ["Find f_avg first, then solve f(c) = f_avg"],
    timeEstimate: 150,
  },
  {
    question: "\\text{A random variable has exponential density } f(x) = \\frac{1}{2}e^{-x/2} \\text{ on } [0, \\infty)\\text{.} \\\\ \\text{Find its expected value } E[X]\\text{.}",
    answer: "2",
    steps: [
      { number: 1, description: "Set up the expected value integral", math: "E[X] = \\int_0^{\\infty} \\frac{x}{2} e^{-x/2} \\, dx" },
      { number: 2, description: "Integrate by parts with u = x and dv = (1/2)e^{-x/2} dx", math: "E[X] = \\left[ -x e^{-x/2} \\right]_0^{\\infty} + \\int_0^{\\infty} e^{-x/2} \\, dx" },
      { number: 3, description: "Evaluate both pieces", math: "E[X] = 0 + \\left[ -2e^{-x/2} \\right]_0^{\\infty} = 2" },
    ],
    hints: ["Integration by parts: u = x", "The exponential terms vanish at infinity"],
    timeEstimate: 270,
  },
  {
    question: "\\text{A random variable has density } f(x) = \\frac{3}{4}x(2 - x) \\text{ on } [0, 2]\\text{.} \\\\ \\text{Find its variance } \\text{Var}(X)\\text{.}",
    answer: "\\frac{1}{5}",
    steps: [
      { number: 1, description: "Expected value (the density is symmetric about x = 1)", math: "E[X] = \\frac{3}{4} \\int_0^2 (2x^2 - x^3) \\, dx = \\frac{3}{4} \\left( \\frac{16}{3} - 4 \\right) = 1" },
      { number: 2, description: "Second moment", math: "E[X^2] = \\frac{3}{4} \\int_0^2 (2x^3 - x^4) \\, dx = \\frac{3}{4} \\left( 8 - \\frac{32}{5} \\right) = \\frac{6}{5}" },
      { number: 3, description: "Variance = second moment minus the square of the mean", math: "\\text{Var}(X) = \\frac{6}{5} - 1^2 = \\frac{1}{5}" },
    ],
    hints: ["Var(X) = E[X^2] − (E[X])^2", "E[X] = 1 by symmetry"],
    timeEstimate: 300,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// BANK EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const appIntProblemBank: Record<AppIntegrationTechnique, Record<Difficulty, ProblemTemplate[]>> = {
  'area-between-curves': {
    easy: areaEasy,
    medium: areaMedium,
    hard: areaHard,
  },
  'volumes': {
    easy: volumesEasy,
    medium: volumesMedium,
    hard: volumesHard,
  },
  'arc-length': {
    easy: arcLengthEasy,
    medium: arcLengthMedium,
    hard: arcLengthHard,
  },
  'surface-area': {
    easy: surfaceAreaEasy,
    medium: surfaceAreaMedium,
    hard: surfaceAreaHard,
  },
  'work': {
    easy: workEasy,
    medium: workMedium,
    hard: workHard,
  },
  'center-of-mass': {
    easy: centerOfMassEasy,
    medium: centerOfMassMedium,
    hard: centerOfMassHard,
  },
  'averages-probability': {
    easy: averagesEasy,
    medium: averagesMedium,
    hard: averagesHard,
  },
  'mixed-appint': {
    easy: [],
    medium: [],
    hard: [],
  },
};
