// ─────────────────────────────────────────────────────────────────────────────
// DIFFERENTIAL EQUATIONS PROBLEM BANK (Phase 3 — EXPANSION_PLAN.md)
//
// Separable, linear first-order, homogeneous-coefficient, exact, second-order
// constant coefficients, undetermined coefficients, variation of parameters,
// and Laplace transforms. Answers avoid arbitrary constants (IVPs, particular
// solutions, or point evaluations) so the hybrid math.js checker can verify
// them. All LaTeX backslashes are doubled.
// ─────────────────────────────────────────────────────────────────────────────

import type { Difficulty, DiffEqTechnique, ProblemTemplate } from '../problemGenerator';

// ═══════════════════════════════════════════════════════════════════════════
// SEPARABLE EQUATIONS
// ═══════════════════════════════════════════════════════════════════════════

const separableEasy: ProblemTemplate[] = [
  {
    question: "\\text{Solve the initial value problem } \\frac{dy}{dx} = 3x^2\\text{, } y(0) = 1\\text{.}",
    answer: "x^3 + 1",
    steps: [
      { number: 1, description: "Integrate both sides with respect to x", math: "y = \\int 3x^2 \\, dx = x^3 + C" },
      { number: 2, description: "Apply y(0) = 1", math: "1 = 0 + C \\Rightarrow y = x^3 + 1" },
    ],
    hints: ["This is direct integration — no separation needed"],
    timeEstimate: 90,
  },
  {
    question: "\\text{Solve the initial value problem } \\frac{dy}{dx} = y\\text{, } y(0) = 5\\text{.}",
    answer: "5e^x",
    steps: [
      { number: 1, description: "Separate variables and integrate", math: "\\frac{dy}{y} = dx \\Rightarrow \\ln(y) = x + C" },
      { number: 2, description: "Exponentiate and apply y(0) = 5", math: "y = Ae^x, \\quad 5 = A \\Rightarrow y = 5e^x" },
    ],
    hints: ["Divide both sides by y before integrating"],
    timeEstimate: 90,
  },
  {
    question: "\\text{Solve } \\frac{dy}{dx} = \\frac{x}{y}\\text{ with } y(0) = 3\\text{, and find } y(4)\\text{ (take the positive branch).}",
    answer: "5",
    steps: [
      { number: 1, description: "Separate variables", math: "y \\, dy = x \\, dx" },
      { number: 2, description: "Integrate both sides", math: "\\frac{y^2}{2} = \\frac{x^2}{2} + C" },
      { number: 3, description: "Apply y(0) = 3, then evaluate at x = 4", math: "C = \\frac{9}{2} \\Rightarrow y^2 = x^2 + 9 \\Rightarrow y(4) = \\sqrt{25} = 5" },
    ],
    hints: ["Multiply both sides by y dx", "You get y^2 = x^2 + 9"],
    timeEstimate: 150,
  },
];

const separableMedium: ProblemTemplate[] = [
  {
    question: "\\text{Solve the initial value problem } \\frac{dy}{dx} = 2xy\\text{, } y(0) = 3\\text{.}",
    answer: "3e^{x^2}",
    steps: [
      { number: 1, description: "Separate variables", math: "\\frac{dy}{y} = 2x \\, dx" },
      { number: 2, description: "Integrate both sides", math: "\\ln(y) = x^2 + C" },
      { number: 3, description: "Exponentiate and apply y(0) = 3", math: "y = Ae^{x^2}, \\quad 3 = A \\Rightarrow y = 3e^{x^2}" },
    ],
    hints: ["Divide by y, then integrate 2x"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Solve } \\frac{dy}{dx} = y^2\\text{ with } y(0) = 1\\text{, and find } y(-1)\\text{.}",
    answer: "\\frac{1}{2}",
    steps: [
      { number: 1, description: "Separate variables", math: "\\frac{dy}{y^2} = dx" },
      { number: 2, description: "Integrate both sides", math: "-\\frac{1}{y} = x + C" },
      { number: 3, description: "Apply y(0) = 1, then evaluate at x = -1", math: "C = -1 \\Rightarrow y = \\frac{1}{1 - x} \\Rightarrow y(-1) = \\frac{1}{2}" },
    ],
    hints: ["The integral of 1/y^2 is -1/y", "Solve for y explicitly before evaluating"],
    timeEstimate: 180,
  },
  {
    question: "\\text{Solve } \\frac{dy}{dx} = 1 + y^2\\text{ with } y(0) = 0\\text{, and find } y\\!\\left(\\frac{\\pi}{4}\\right)\\text{.}",
    answer: "1",
    steps: [
      { number: 1, description: "Separate variables", math: "\\frac{dy}{1 + y^2} = dx" },
      { number: 2, description: "Integrate — recognize the arctangent form", math: "\\arctan(y) = x + C" },
      { number: 3, description: "Apply y(0) = 0, then evaluate", math: "C = 0 \\Rightarrow y = \\tan(x) \\Rightarrow y\\!\\left(\\frac{\\pi}{4}\\right) = 1" },
    ],
    hints: ["Recall that the integral of 1/(1 + y^2) is arctan(y)"],
    timeEstimate: 180,
  },
];

const separableHard: ProblemTemplate[] = [
  {
    question: "\\text{Solve } \\frac{dy}{dx} = xy^2\\text{ with } y(0) = -1\\text{, and find } y(2)\\text{.}",
    answer: "-\\frac{1}{3}",
    steps: [
      { number: 1, description: "Separate variables", math: "\\frac{dy}{y^2} = x \\, dx" },
      { number: 2, description: "Integrate both sides", math: "-\\frac{1}{y} = \\frac{x^2}{2} + C" },
      { number: 3, description: "Apply y(0) = -1 and solve for y", math: "C = 1 \\Rightarrow y = -\\frac{2}{x^2 + 2} \\Rightarrow y(2) = -\\frac{2}{6} = -\\frac{1}{3}" },
    ],
    hints: ["Watch the sign: -1/y at y = -1 gives C = 1"],
    timeEstimate: 240,
  },
  {
    question: "\\text{A population satisfies } \\frac{dP}{dt} = P\\text{ with } P(0) = 100\\text{.} \\\\ \\text{Find } P(\\ln(2))\\text{.}",
    answer: "200",
    steps: [
      { number: 1, description: "Solve the exponential growth equation", math: "P = 100e^{t}" },
      { number: 2, description: "Evaluate at t = ln(2)", math: "P(\\ln(2)) = 100e^{\\ln(2)} = 100 \\cdot 2 = 200" },
    ],
    hints: ["e raised to ln(2) is exactly 2"],
    timeEstimate: 180,
  },
  {
    question: "\\text{Solve } \\frac{dy}{dx} = y^2 - 1\\text{ with } y(0) = 0\\text{, and find } y\\!\\left(\\frac{\\ln(3)}{2}\\right)\\text{.}",
    answer: "-\\frac{1}{2}",
    steps: [
      { number: 1, description: "Separate variables and use partial fractions", math: "\\frac{dy}{(y-1)(y+1)} = dx \\Rightarrow \\frac{1}{2} \\ln\\left| \\frac{y - 1}{y + 1} \\right| = x + C" },
      { number: 2, description: "Apply y(0) = 0", math: "C = 0 \\Rightarrow \\frac{y - 1}{y + 1} = -e^{2x}" },
      { number: 3, description: "Evaluate at x = ln(3)/2, where e^{2x} = 3", math: "\\frac{y - 1}{y + 1} = -3 \\Rightarrow y - 1 = -3y - 3 \\Rightarrow 4y = -2 \\Rightarrow y = -\\frac{1}{2}" },
    ],
    hints: ["Partial fractions split 1/(y^2 - 1)", "At the target x value, e^{2x} = 3"],
    timeEstimate: 300,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// LINEAR FIRST-ORDER EQUATIONS (INTEGRATING FACTOR)
// ═══════════════════════════════════════════════════════════════════════════

const linearEasy: ProblemTemplate[] = [
  {
    question: "\\text{Solve the initial value problem } y' + y = 2\\text{, } y(0) = 3\\text{.}",
    answer: "2 + e^{-x}",
    steps: [
      { number: 1, description: "The integrating factor is e^x", math: "(y e^x)' = 2e^x" },
      { number: 2, description: "Integrate and solve for y", math: "y e^x = 2e^x + C \\Rightarrow y = 2 + Ce^{-x}" },
      { number: 3, description: "Apply y(0) = 3", math: "3 = 2 + C \\Rightarrow y = 2 + e^{-x}" },
    ],
    hints: ["Multiply through by the integrating factor e^x"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Solve the initial value problem } y' + 2y = 0\\text{, } y(0) = 3\\text{.}",
    answer: "3e^{-2x}",
    steps: [
      { number: 1, description: "The integrating factor is e^{2x}", math: "(y e^{2x})' = 0" },
      { number: 2, description: "Integrate and apply y(0) = 3", math: "y e^{2x} = C = 3 \\Rightarrow y = 3e^{-2x}" },
    ],
    hints: ["This is exponential decay with rate 2"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Solve the initial value problem } y' + y = e^{-x}\\text{, } y(0) = 1\\text{.}",
    answer: "(x+1)e^{-x}",
    steps: [
      { number: 1, description: "Multiply by the integrating factor e^x", math: "(y e^x)' = 1" },
      { number: 2, description: "Integrate", math: "y e^x = x + C" },
      { number: 3, description: "Apply y(0) = 1", math: "1 = C \\Rightarrow y = (x + 1)e^{-x}" },
    ],
    hints: ["The right side e^{-x} matches the homogeneous rate — expect an x factor"],
    timeEstimate: 180,
  },
];

const linearMedium: ProblemTemplate[] = [
  {
    question: "\\text{Solve } y' + \\frac{1}{x} y = x\\text{ for } x > 0\\text{ with } y(1) = 1\\text{, and find } y(2)\\text{.}",
    answer: "\\frac{5}{3}",
    steps: [
      { number: 1, description: "The integrating factor is x", math: "(xy)' = x^2" },
      { number: 2, description: "Integrate", math: "xy = \\frac{x^3}{3} + C \\Rightarrow y = \\frac{x^2}{3} + \\frac{C}{x}" },
      { number: 3, description: "Apply y(1) = 1, then evaluate at x = 2", math: "C = \\frac{2}{3} \\Rightarrow y(2) = \\frac{4}{3} + \\frac{1}{3} = \\frac{5}{3}" },
    ],
    hints: ["The integrating factor is e^{ln x} = x"],
    timeEstimate: 210,
  },
  {
    question: "\\text{Solve } y' - 2y = e^{2x}\\text{ with } y(0) = 2\\text{, and find } y(1)\\text{.}",
    answer: "3e^2",
    steps: [
      { number: 1, description: "The integrating factor is e^{-2x}", math: "(y e^{-2x})' = 1" },
      { number: 2, description: "Integrate", math: "y e^{-2x} = x + C \\Rightarrow y = (x + C)e^{2x}" },
      { number: 3, description: "Apply y(0) = 2, then evaluate at x = 1", math: "C = 2 \\Rightarrow y(1) = 3e^2" },
    ],
    hints: ["Resonance: the forcing e^{2x} matches the homogeneous rate"],
    timeEstimate: 210,
  },
  {
    question: "\\text{Solve the initial value problem } y' + 3y = 6\\text{, } y(0) = 5\\text{.}",
    answer: "2 + 3e^{-3x}",
    steps: [
      { number: 1, description: "The integrating factor is e^{3x}", math: "(y e^{3x})' = 6e^{3x}" },
      { number: 2, description: "Integrate and solve for y", math: "y e^{3x} = 2e^{3x} + C \\Rightarrow y = 2 + Ce^{-3x}" },
      { number: 3, description: "Apply y(0) = 5", math: "5 = 2 + C \\Rightarrow y = 2 + 3e^{-3x}" },
    ],
    hints: ["The steady-state value is 6/3 = 2"],
    timeEstimate: 180,
  },
];

const linearHard: ProblemTemplate[] = [
  {
    question: "\\text{Solve } y' + 2xy = 2x\\text{ with } y(0) = 3\\text{, and find } y(1)\\text{.}",
    answer: "1 + \\frac{2}{e}",
    steps: [
      { number: 1, description: "The integrating factor is e^{x^2}", math: "(y e^{x^2})' = 2x e^{x^2}" },
      { number: 2, description: "Integrate — substitute u = x^2", math: "y e^{x^2} = e^{x^2} + C \\Rightarrow y = 1 + Ce^{-x^2}" },
      { number: 3, description: "Apply y(0) = 3, then evaluate at x = 1", math: "C = 2 \\Rightarrow y(1) = 1 + 2e^{-1} = 1 + \\frac{2}{e}" },
    ],
    hints: ["The integrating factor is e^{x^2}, not e^{2x}"],
    timeEstimate: 270,
  },
  {
    question: "\\text{Solve the initial value problem } y' - y = x\\text{, } y(0) = 1\\text{.}",
    answer: "2e^x - x - 1",
    steps: [
      { number: 1, description: "The integrating factor is e^{-x}", math: "(y e^{-x})' = x e^{-x}" },
      { number: 2, description: "Integrate by parts", math: "y e^{-x} = -x e^{-x} - e^{-x} + C \\Rightarrow y = -x - 1 + Ce^x" },
      { number: 3, description: "Apply y(0) = 1", math: "1 = -1 + C \\Rightarrow y = 2e^x - x - 1" },
    ],
    hints: ["Integrate x e^{-x} by parts"],
    timeEstimate: 270,
  },
  {
    question: "\\text{Solve } xy' + 2y = x^3\\text{ for } x > 0\\text{ with } y(1) = 1\\text{, and find } y(2)\\text{.}",
    answer: "\\frac{9}{5}",
    steps: [
      { number: 1, description: "Divide by x to get standard form", math: "y' + \\frac{2}{x} y = x^2" },
      { number: 2, description: "The integrating factor is x^2", math: "(x^2 y)' = x^4 \\Rightarrow x^2 y = \\frac{x^5}{5} + C" },
      { number: 3, description: "Apply y(1) = 1, then evaluate at x = 2", math: "C = \\frac{4}{5} \\Rightarrow y(2) = \\frac{8}{5} + \\frac{1}{5} = \\frac{9}{5}" },
    ],
    hints: ["First divide through by x", "The integrating factor is x^2"],
    timeEstimate: 270,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// HOMOGENEOUS-COEFFICIENT EQUATIONS (v = y/x SUBSTITUTION)
// ═══════════════════════════════════════════════════════════════════════════

const homogeneousEasy: ProblemTemplate[] = [
  {
    question: "\\text{Solve } \\frac{dy}{dx} = \\frac{y}{x}\\text{ with } y(1) = 2\\text{, and find } y(4)\\text{.}",
    answer: "8",
    steps: [
      { number: 1, description: "Substitute v = y/x, so y' = v + xv'", math: "v + xv' = v \\Rightarrow xv' = 0" },
      { number: 2, description: "v is constant; apply y(1) = 2", math: "v = 2 \\Rightarrow y = 2x" },
      { number: 3, description: "Evaluate at x = 4", math: "y(4) = 8" },
    ],
    hints: ["The right side is already a function of y/x alone"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Solve } \\frac{dy}{dx} = \\frac{x + y}{x}\\text{ with } y(1) = 0\\text{, and find } y(e)\\text{.}",
    answer: "e",
    steps: [
      { number: 1, description: "Rewrite as 1 + y/x and substitute v = y/x", math: "v + xv' = 1 + v \\Rightarrow xv' = 1" },
      { number: 2, description: "Integrate", math: "v = \\ln(x) + C" },
      { number: 3, description: "Apply y(1) = 0, then evaluate at x = e", math: "C = 0 \\Rightarrow y = x \\ln(x) \\Rightarrow y(e) = e" },
    ],
    hints: ["Divide the right side out: (x + y)/x = 1 + y/x"],
    timeEstimate: 180,
  },
  {
    question: "\\text{Solve } \\frac{dy}{dx} = \\frac{x^2 + y^2}{2xy}\\text{ with } y(1) = 0\\text{, and find } y^2\\text{ when } x = 2\\text{.}",
    answer: "2",
    steps: [
      { number: 1, description: "Substitute v = y/x", math: "v + xv' = \\frac{1 + v^2}{2v} \\Rightarrow xv' = \\frac{1 - v^2}{2v}" },
      { number: 2, description: "Separate and integrate", math: "\\frac{2v \\, dv}{1 - v^2} = \\frac{dx}{x} \\Rightarrow -\\ln|1 - v^2| = \\ln(x) + C" },
      { number: 3, description: "Apply v(1) = 0, then evaluate at x = 2", math: "1 - \\frac{y^2}{x^2} = \\frac{1}{x} \\Rightarrow 1 - \\frac{y^2}{4} = \\frac{1}{2} \\Rightarrow y^2 = 2" },
    ],
    hints: ["Divide numerator and denominator by x^2 to see the v form", "The question asks for y^2, so no sign choice is needed"],
    timeEstimate: 270,
  },
];

const homogeneousMedium: ProblemTemplate[] = [
  {
    question: "\\text{Solve } \\frac{dy}{dx} = \\frac{x^2 + y^2}{2xy}\\text{ with } y(1) = 0\\text{, and find } y^2\\text{ when } x = 4\\text{.}",
    answer: "12",
    steps: [
      { number: 1, description: "Substitute v = y/x and separate", math: "\\frac{2v \\, dv}{1 - v^2} = \\frac{dx}{x} \\Rightarrow 1 - v^2 = \\frac{C}{x}" },
      { number: 2, description: "Apply v(1) = 0", math: "C = 1 \\Rightarrow 1 - \\frac{y^2}{x^2} = \\frac{1}{x}" },
      { number: 3, description: "Evaluate at x = 4", math: "\\frac{y^2}{16} = \\frac{3}{4} \\Rightarrow y^2 = 12" },
    ],
    hints: ["Same equation, farther evaluation point — redo the constant"],
    timeEstimate: 270,
  },
  {
    question: "\\text{Solve } \\frac{dy}{dx} = \\frac{y^2 + xy}{x^2}\\text{ with } y(1) = -1\\text{, and find } y(e)\\text{.}",
    answer: "-\\frac{e}{2}",
    steps: [
      { number: 1, description: "Substitute v = y/x", math: "v + xv' = v^2 + v \\Rightarrow xv' = v^2" },
      { number: 2, description: "Separate and integrate", math: "\\frac{dv}{v^2} = \\frac{dx}{x} \\Rightarrow -\\frac{1}{v} = \\ln(x) + C" },
      { number: 3, description: "Apply v(1) = -1, then evaluate at x = e", math: "C = 1 \\Rightarrow -\\frac{1}{v} = 2 \\Rightarrow v = -\\frac{1}{2} \\Rightarrow y(e) = -\\frac{e}{2}" },
    ],
    hints: ["Divide by x^2: the right side is (y/x)^2 + (y/x)"],
    timeEstimate: 270,
  },
  {
    question: "\\text{Solve } \\frac{dy}{dx} = \\frac{3x - y}{x}\\text{ with } y(1) = 1\\text{, and find } y(2)\\text{.}",
    answer: "\\frac{11}{4}",
    steps: [
      { number: 1, description: "Substitute v = y/x", math: "v + xv' = 3 - v \\Rightarrow xv' = 3 - 2v" },
      { number: 2, description: "Separate and integrate", math: "\\frac{dv}{3 - 2v} = \\frac{dx}{x} \\Rightarrow 3 - 2v = \\frac{C}{x^2}" },
      { number: 3, description: "Apply v(1) = 1, then evaluate at x = 2", math: "C = 1 \\Rightarrow y = \\frac{3x - x^{-1}}{2} \\Rightarrow y(2) = \\frac{6 - \\frac{1}{2}}{2} = \\frac{11}{4}" },
    ],
    hints: ["Rewrite as 3 - y/x before substituting"],
    timeEstimate: 300,
  },
];

const homogeneousHard: ProblemTemplate[] = [
  {
    question: "\\text{Solve } \\frac{dy}{dx} = \\frac{x^2 + y^2}{xy}\\text{ with } y(1) = 2\\text{, and find } y^2\\text{ when } x = e\\text{.}",
    answer: "6e^2",
    steps: [
      { number: 1, description: "Substitute v = y/x", math: "v + xv' = \\frac{1}{v} + v \\Rightarrow xv' = \\frac{1}{v}" },
      { number: 2, description: "Separate and integrate", math: "v \\, dv = \\frac{dx}{x} \\Rightarrow \\frac{v^2}{2} = \\ln(x) + C" },
      { number: 3, description: "Apply v(1) = 2, then evaluate at x = e", math: "C = 2 \\Rightarrow y^2 = 2x^2 \\ln(x) + 4x^2 \\Rightarrow y^2(e) = 2e^2 + 4e^2 = 6e^2" },
    ],
    hints: ["The v terms cancel on the right side"],
    timeEstimate: 300,
  },
  {
    question: "\\text{Solve } \\frac{dy}{dx} = \\frac{x^2 + 3y^2}{2xy}\\text{ with } y(1) = 1\\text{, and find } y^2\\text{ when } x = 2\\text{.}",
    answer: "12",
    steps: [
      { number: 1, description: "Substitute v = y/x", math: "v + xv' = \\frac{1 + 3v^2}{2v} \\Rightarrow xv' = \\frac{1 + v^2}{2v}" },
      { number: 2, description: "Separate and integrate", math: "\\frac{2v \\, dv}{1 + v^2} = \\frac{dx}{x} \\Rightarrow \\ln(1 + v^2) = \\ln(x) + C" },
      { number: 3, description: "Apply v(1) = 1, then evaluate at x = 2", math: "1 + v^2 = 2x \\Rightarrow y^2 = 2x^3 - x^2 \\Rightarrow y^2(2) = 16 - 4 = 12" },
    ],
    hints: ["The integral of 2v/(1 + v^2) is ln(1 + v^2)"],
    timeEstimate: 300,
  },
  {
    question: "\\text{Solve } \\frac{dy}{dx} = \\frac{y}{x} + \\left(\\frac{y}{x}\\right)^2\\text{ with } y(1) = 2\\text{, and find } y(e)\\text{.}",
    answer: "-2e",
    steps: [
      { number: 1, description: "Substitute v = y/x", math: "v + xv' = v + v^2 \\Rightarrow xv' = v^2" },
      { number: 2, description: "Separate and integrate", math: "-\\frac{1}{v} = \\ln(x) + C" },
      { number: 3, description: "Apply v(1) = 2, then evaluate at x = e", math: "C = -\\frac{1}{2} \\Rightarrow -\\frac{x}{y} = \\ln(x) - \\frac{1}{2} \\Rightarrow -\\frac{e}{y} = \\frac{1}{2} \\Rightarrow y = -2e" },
    ],
    hints: ["The v terms cancel, leaving xv' = v^2"],
    timeEstimate: 300,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// EXACT EQUATIONS
// ═══════════════════════════════════════════════════════════════════════════

const exactEasy: ProblemTemplate[] = [
  {
    question: "\\text{The equation } (2x + y) \\, dx + (x + 2y) \\, dy = 0\\text{ is exact, with potential} \\\\ F(x, y) = x^2 + xy + y^2\\text{. The solution through } (0, 2)\\text{ satisfies } F = k\\text{. Find } k\\text{.}",
    answer: "4",
    steps: [
      { number: 1, description: "Verify exactness", math: "\\frac{\\partial M}{\\partial y} = 1 = \\frac{\\partial N}{\\partial x}" },
      { number: 2, description: "Solutions satisfy F(x, y) = constant", math: "F(0, 2) = 0 + 0 + 4 = 4" },
    ],
    hints: ["Evaluate the potential function at the given point"],
    timeEstimate: 120,
  },
  {
    question: "\\text{The equation } 2xy \\, dx + (x^2 + 1) \\, dy = 0\\text{ is exact, with potential} \\\\ F(x, y) = x^2 y + y\\text{. The solution through } (1, 1)\\text{ satisfies } F = k\\text{. Find } k\\text{.}",
    answer: "2",
    steps: [
      { number: 1, description: "Verify exactness", math: "\\frac{\\partial M}{\\partial y} = 2x = \\frac{\\partial N}{\\partial x}" },
      { number: 2, description: "Evaluate F at (1, 1)", math: "F(1, 1) = 1 + 1 = 2" },
    ],
    hints: ["Plug the point into the potential function"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Is the equation } y \\, dx + x \\, dy = 0\\text{ exact? Answer: exact or not exact.}",
    answer: "exact",
    steps: [
      { number: 1, description: "Check the partial derivatives", math: "M = y \\Rightarrow M_y = 1, \\quad N = x \\Rightarrow N_x = 1" },
      { number: 2, description: "The partials match, so the equation is exact", math: "F(x, y) = xy = C" },
    ],
    hints: ["Compare the y-derivative of M with the x-derivative of N"],
    timeEstimate: 90,
  },
];

const exactMedium: ProblemTemplate[] = [
  {
    question: "\\text{The equation } (3x^2 y + 2) \\, dx + (x^3 + 2y) \\, dy = 0\\text{ is exact, with potential} \\\\ F(x, y) = x^3 y + 2x + y^2\\text{. The solution through } (1, 1)\\text{ satisfies } F = k\\text{. Find } k\\text{.}",
    answer: "4",
    steps: [
      { number: 1, description: "Verify exactness", math: "M_y = 3x^2 = N_x" },
      { number: 2, description: "Evaluate F at (1, 1)", math: "F(1, 1) = 1 + 2 + 1 = 4" },
    ],
    hints: ["Evaluate the potential at the given point"],
    timeEstimate: 150,
  },
  {
    question: "\\text{The equation } (y e^x + 2x) \\, dx + e^x \\, dy = 0\\text{ is exact, with potential} \\\\ F(x, y) = y e^x + x^2\\text{. The solution through } (0, 3)\\text{ satisfies } F = k\\text{. Find } k\\text{.}",
    answer: "3",
    steps: [
      { number: 1, description: "Verify exactness", math: "M_y = e^x = N_x" },
      { number: 2, description: "Evaluate F at (0, 3)", math: "F(0, 3) = 3e^0 + 0 = 3" },
    ],
    hints: ["e^0 = 1"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Is the equation } y \\, dx + 2x \\, dy = 0\\text{ exact? Answer: exact or not exact.}",
    answer: "not exact",
    steps: [
      { number: 1, description: "Check the partial derivatives", math: "M_y = 1, \\quad N_x = 2" },
      { number: 2, description: "The partials differ, so the equation is not exact", math: "1 \\neq 2 \\Rightarrow \\text{an integrating factor is needed}" },
    ],
    hints: ["Compare the y-derivative of M with the x-derivative of N"],
    timeEstimate: 90,
  },
];

const exactHard: ProblemTemplate[] = [
  {
    question: "\\text{The equation } (2xy + y^2) \\, dx + (x^2 + 2xy) \\, dy = 0\\text{ is exact, with potential} \\\\ F(x, y) = x^2 y + xy^2\\text{. The solution through } (1, 1)\\text{ passes through } x = 1\\text{ again} \\\\ \\text{at another point. Find the positive value of } y\\text{ on this curve when } x = 1\\text{.}",
    answer: "1",
    steps: [
      { number: 1, description: "The curve satisfies F = F(1, 1) = 2", math: "x^2 y + xy^2 = 2" },
      { number: 2, description: "Set x = 1 and solve", math: "y + y^2 = 2 \\Rightarrow y^2 + y - 2 = 0 \\Rightarrow (y + 2)(y - 1) = 0" },
      { number: 3, description: "Take the positive root", math: "y = 1" },
    ],
    hints: ["Set x = 1 in x^2 y + xy^2 = 2 and solve the quadratic"],
    timeEstimate: 240,
  },
  {
    question: "\\text{The equation } (3x^2 + 6xy^2) \\, dx + (6x^2 y + 4y^3) \\, dy = 0\\text{ is exact, with potential} \\\\ F(x, y) = x^3 + 3x^2 y^2 + y^4\\text{. The solution through } (1, 1)\\text{ crosses } x = 0\\text{.} \\\\ \\text{Find the positive value of } y\\text{ there (give an exact expression).}",
    answer: "5^{1/4}",
    steps: [
      { number: 1, description: "The curve satisfies F = F(1, 1)", math: "x^3 + 3x^2 y^2 + y^4 = 1 + 3 + 1 = 5" },
      { number: 2, description: "Set x = 0 and solve", math: "y^4 = 5 \\Rightarrow y = 5^{1/4}" },
    ],
    hints: ["At x = 0 only the y^4 term survives"],
    timeEstimate: 240,
  },
  {
    question: "\\text{The equation } (x + y^2) \\, dx + (2xy + 3y^2) \\, dy = 0\\text{ is exact, with potential} \\\\ F(x, y) = \\frac{x^2}{2} + xy^2 + y^3\\text{. The solution through } (1, 0)\\text{ satisfies } F = k\\text{. Find } k\\text{.}",
    answer: "\\frac{1}{2}",
    steps: [
      { number: 1, description: "Verify exactness", math: "M_y = 2y = N_x" },
      { number: 2, description: "Evaluate F at (1, 0)", math: "F(1, 0) = \\frac{1}{2} + 0 + 0 = \\frac{1}{2}" },
    ],
    hints: ["Evaluate the potential at the given point"],
    timeEstimate: 180,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// SECOND-ORDER CONSTANT COEFFICIENTS (HOMOGENEOUS)
// ═══════════════════════════════════════════════════════════════════════════

const secondOrderEasy: ProblemTemplate[] = [
  {
    question: "\\text{Solve } y'' - 3y' + 2y = 0\\text{ with } y(0) = 2\\text{, } y'(0) = 3\\text{.}",
    answer: "e^x + e^{2x}",
    steps: [
      { number: 1, description: "Solve the characteristic equation", math: "r^2 - 3r + 2 = 0 \\Rightarrow r = 1, \\; 2" },
      { number: 2, description: "Write the general solution", math: "y = C_1 e^x + C_2 e^{2x}" },
      { number: 3, description: "Apply the initial conditions", math: "C_1 + C_2 = 2, \\quad C_1 + 2C_2 = 3 \\Rightarrow C_1 = C_2 = 1 \\Rightarrow y = e^x + e^{2x}" },
    ],
    hints: ["Factor r^2 - 3r + 2"],
    timeEstimate: 210,
  },
  {
    question: "\\text{Solve } y'' - 4y = 0\\text{ with } y(0) = 2\\text{, } y'(0) = 0\\text{.}",
    answer: "e^{2x} + e^{-2x}",
    steps: [
      { number: 1, description: "Solve the characteristic equation", math: "r^2 - 4 = 0 \\Rightarrow r = \\pm 2" },
      { number: 2, description: "Write the general solution", math: "y = C_1 e^{2x} + C_2 e^{-2x}" },
      { number: 3, description: "Apply the initial conditions", math: "C_1 + C_2 = 2, \\quad 2C_1 - 2C_2 = 0 \\Rightarrow C_1 = C_2 = 1 \\Rightarrow y = e^{2x} + e^{-2x}" },
    ],
    hints: ["This solution is 2cosh(2x) in disguise"],
    timeEstimate: 210,
  },
  {
    question: "\\text{Solve } y'' + y = 0\\text{ with } y(0) = 1\\text{, } y'(0) = 0\\text{.}",
    answer: "\\cos(x)",
    steps: [
      { number: 1, description: "Solve the characteristic equation", math: "r^2 + 1 = 0 \\Rightarrow r = \\pm i" },
      { number: 2, description: "Write the general solution", math: "y = C_1 \\cos(x) + C_2 \\sin(x)" },
      { number: 3, description: "Apply the initial conditions", math: "C_1 = 1, \\quad C_2 = 0 \\Rightarrow y = \\cos(x)" },
    ],
    hints: ["Pure imaginary roots give sines and cosines"],
    timeEstimate: 180,
  },
];

const secondOrderMedium: ProblemTemplate[] = [
  {
    question: "\\text{Solve } y'' - y = 0\\text{ with } y(0) = 0\\text{, } y'(0) = 2\\text{.}",
    answer: "e^x - e^{-x}",
    steps: [
      { number: 1, description: "Solve the characteristic equation", math: "r^2 - 1 = 0 \\Rightarrow r = \\pm 1" },
      { number: 2, description: "Apply the initial conditions", math: "C_1 + C_2 = 0, \\quad C_1 - C_2 = 2 \\Rightarrow C_1 = 1, \\; C_2 = -1 \\Rightarrow y = e^x - e^{-x}" },
    ],
    hints: ["This solution is 2sinh(x) in disguise"],
    timeEstimate: 210,
  },
  {
    question: "\\text{Solve } y'' + 2y' + y = 0\\text{ with } y(0) = 1\\text{, } y'(0) = 0\\text{.}",
    answer: "(1+x)e^{-x}",
    steps: [
      { number: 1, description: "Solve the characteristic equation — repeated root", math: "r^2 + 2r + 1 = 0 \\Rightarrow r = -1 \\text{ (double)}" },
      { number: 2, description: "Write the general solution", math: "y = (C_1 + C_2 x)e^{-x}" },
      { number: 3, description: "Apply the initial conditions", math: "C_1 = 1, \\quad C_2 - C_1 = 0 \\Rightarrow C_2 = 1 \\Rightarrow y = (1 + x)e^{-x}" },
    ],
    hints: ["A repeated root needs an extra factor of x"],
    timeEstimate: 240,
  },
  {
    question: "\\text{Solve } y'' + 4y = 0\\text{ with } y(0) = 0\\text{, } y'(0) = 4\\text{.}",
    answer: "2\\sin(2x)",
    steps: [
      { number: 1, description: "Solve the characteristic equation", math: "r^2 + 4 = 0 \\Rightarrow r = \\pm 2i" },
      { number: 2, description: "Write the general solution", math: "y = C_1 \\cos(2x) + C_2 \\sin(2x)" },
      { number: 3, description: "Apply the initial conditions", math: "C_1 = 0, \\quad 2C_2 = 4 \\Rightarrow C_2 = 2 \\Rightarrow y = 2\\sin(2x)" },
    ],
    hints: ["The frequency is 2, not 4"],
    timeEstimate: 210,
  },
];

const secondOrderHard: ProblemTemplate[] = [
  {
    question: "\\text{Solve } y'' - 2y' + 2y = 0\\text{ with } y(0) = 1\\text{, } y'(0) = 1\\text{, and find } y(\\pi)\\text{.}",
    answer: "-e^{\\pi}",
    steps: [
      { number: 1, description: "Solve the characteristic equation — complex roots", math: "r^2 - 2r + 2 = 0 \\Rightarrow r = 1 \\pm i" },
      { number: 2, description: "Write the general solution", math: "y = e^x (C_1 \\cos(x) + C_2 \\sin(x))" },
      { number: 3, description: "Apply the initial conditions", math: "C_1 = 1, \\quad C_1 + C_2 = 1 \\Rightarrow C_2 = 0 \\Rightarrow y = e^x \\cos(x)" },
      { number: 4, description: "Evaluate at x = pi", math: "y(\\pi) = e^{\\pi} \\cos(\\pi) = -e^{\\pi}" },
    ],
    hints: ["Complex roots a ± bi give e^{ax}(C1 cos bx + C2 sin bx)", "cos(pi) = -1"],
    timeEstimate: 300,
  },
  {
    question: "\\text{Solve } y'' - 6y' + 9y = 0\\text{ with } y(0) = 2\\text{, } y'(0) = 7\\text{, and find } y(1)\\text{.}",
    answer: "3e^3",
    steps: [
      { number: 1, description: "Solve the characteristic equation — repeated root", math: "r^2 - 6r + 9 = 0 \\Rightarrow r = 3 \\text{ (double)}" },
      { number: 2, description: "Write the general solution", math: "y = (C_1 + C_2 x)e^{3x}" },
      { number: 3, description: "Apply the initial conditions", math: "C_1 = 2, \\quad C_2 + 3C_1 = 7 \\Rightarrow C_2 = 1 \\Rightarrow y = (2 + x)e^{3x}" },
      { number: 4, description: "Evaluate at x = 1", math: "y(1) = 3e^3" },
    ],
    hints: ["y'(0) involves both C2 and 3C1"],
    timeEstimate: 300,
  },
  {
    question: "\\text{Solve } y'' + y' - 6y = 0\\text{ with } y(0) = 1\\text{, } y'(0) = 2\\text{.}",
    answer: "e^{2x}",
    steps: [
      { number: 1, description: "Solve the characteristic equation", math: "r^2 + r - 6 = 0 \\Rightarrow r = 2, \\; -3" },
      { number: 2, description: "Write the general solution", math: "y = C_1 e^{2x} + C_2 e^{-3x}" },
      { number: 3, description: "Apply the initial conditions", math: "C_1 + C_2 = 1, \\quad 2C_1 - 3C_2 = 2 \\Rightarrow C_1 = 1, \\; C_2 = 0 \\Rightarrow y = e^{2x}" },
    ],
    hints: ["Factor r^2 + r - 6"],
    timeEstimate: 240,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// UNDETERMINED COEFFICIENTS
// ═══════════════════════════════════════════════════════════════════════════

const undeterminedEasy: ProblemTemplate[] = [
  {
    question: "\\text{Find a particular solution of } y'' + y = x^2\\text{.}",
    answer: "x^2 - 2",
    steps: [
      { number: 1, description: "Try a quadratic y_p = ax^2 + bx + c", math: "y_p'' = 2a" },
      { number: 2, description: "Substitute into the equation", math: "2a + ax^2 + bx + c = x^2" },
      { number: 3, description: "Match coefficients", math: "a = 1, \\; b = 0, \\; c = -2 \\Rightarrow y_p = x^2 - 2" },
    ],
    hints: ["Match the forcing term's polynomial degree"],
    timeEstimate: 210,
  },
  {
    question: "\\text{Find a particular solution of } y'' - y = e^{3x}\\text{.}",
    answer: "\\frac{e^{3x}}{8}",
    steps: [
      { number: 1, description: "Try y_p = ae^{3x}", math: "y_p'' = 9ae^{3x}" },
      { number: 2, description: "Substitute and solve for a", math: "9ae^{3x} - ae^{3x} = e^{3x} \\Rightarrow 8a = 1 \\Rightarrow a = \\frac{1}{8}" },
    ],
    hints: ["3 is not a root of r^2 - 1, so no extra x factor is needed"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Find a particular solution of } y'' + 3y' + 2y = 4\\text{.}",
    answer: "2",
    steps: [
      { number: 1, description: "Try a constant y_p = c", math: "y_p' = y_p'' = 0" },
      { number: 2, description: "Substitute and solve", math: "2c = 4 \\Rightarrow c = 2" },
    ],
    hints: ["Constant forcing suggests a constant trial solution"],
    timeEstimate: 90,
  },
];

const undeterminedMedium: ProblemTemplate[] = [
  {
    question: "\\text{Find a particular solution of } y'' + y' = x\\text{.}",
    answer: "\\frac{x^2}{2} - x",
    steps: [
      { number: 1, description: "A plain linear trial fails (y' = b, y'' = 0 gives b = x). Try y_p = ax^2 + bx", math: "y_p' = 2ax + b, \\quad y_p'' = 2a" },
      { number: 2, description: "Substitute into the equation", math: "2a + 2ax + b = x" },
      { number: 3, description: "Match coefficients", math: "2a = 1 \\Rightarrow a = \\frac{1}{2}, \\quad 2a + b = 0 \\Rightarrow b = -1 \\Rightarrow y_p = \\frac{x^2}{2} - x" },
    ],
    hints: ["Multiply the usual trial by x when the forcing matches a homogeneous solution"],
    timeEstimate: 240,
  },
  {
    question: "\\text{For } y'' - 4y = 8e^{2x}\\text{, a particular solution has the form } y_p = axe^{2x}\\text{. Find } a\\text{.}",
    answer: "2",
    steps: [
      { number: 1, description: "Differentiate y_p = axe^{2x}", math: "y_p' = ae^{2x}(1 + 2x), \\quad y_p'' = ae^{2x}(4 + 4x)" },
      { number: 2, description: "Substitute into the equation", math: "ae^{2x}(4 + 4x) - 4axe^{2x} = 8e^{2x}" },
      { number: 3, description: "The x terms cancel (resonance); solve for a", math: "4a = 8 \\Rightarrow a = 2" },
    ],
    hints: ["e^{2x} solves the homogeneous equation — hence the extra x"],
    timeEstimate: 240,
  },
  {
    question: "\\text{Find a particular solution of } y'' + 2y' + y = 6e^x\\text{.}",
    answer: "\\frac{3}{2}e^x",
    steps: [
      { number: 1, description: "Try y_p = ae^x", math: "y_p' = ae^x, \\quad y_p'' = ae^x" },
      { number: 2, description: "Substitute and solve for a", math: "ae^x + 2ae^x + ae^x = 6e^x \\Rightarrow 4a = 6 \\Rightarrow a = \\frac{3}{2}" },
    ],
    hints: ["1 is not a root of r^2 + 2r + 1"],
    timeEstimate: 180,
  },
];

const undeterminedHard: ProblemTemplate[] = [
  {
    question: "\\text{For } y'' + y = \\sin(x)\\text{, a particular solution has the form } y_p = ax\\cos(x)\\text{. Find } a\\text{.}",
    answer: "-\\frac{1}{2}",
    steps: [
      { number: 1, description: "Differentiate y_p = ax cos(x)", math: "y_p' = a\\cos(x) - ax\\sin(x), \\quad y_p'' = -2a\\sin(x) - ax\\cos(x)" },
      { number: 2, description: "Substitute into the equation", math: "-2a\\sin(x) - ax\\cos(x) + ax\\cos(x) = \\sin(x)" },
      { number: 3, description: "Solve for a", math: "-2a = 1 \\Rightarrow a = -\\frac{1}{2}" },
    ],
    hints: ["sin(x) solves the homogeneous equation — resonance requires the x factor"],
    timeEstimate: 270,
  },
  {
    question: "\\text{Find a particular solution of } y'' - 3y' + 2y = 2x^2\\text{.}",
    answer: "x^2 + 3x + \\frac{7}{2}",
    steps: [
      { number: 1, description: "Try y_p = ax^2 + bx + c", math: "y_p' = 2ax + b, \\quad y_p'' = 2a" },
      { number: 2, description: "Substitute into the equation", math: "2a - 3(2ax + b) + 2(ax^2 + bx + c) = 2x^2" },
      { number: 3, description: "Match coefficients", math: "2a = 2 \\Rightarrow a = 1, \\quad -6a + 2b = 0 \\Rightarrow b = 3, \\quad 2a - 3b + 2c = 0 \\Rightarrow c = \\frac{7}{2}" },
    ],
    hints: ["Match x^2, x, and constant terms separately"],
    timeEstimate: 300,
  },
  {
    question: "\\text{For } y'' + 4y = 8\\cos(2x)\\text{, a particular solution has the form } y_p = ax\\sin(2x)\\text{. Find } a\\text{.}",
    answer: "2",
    steps: [
      { number: 1, description: "Differentiate y_p = ax sin(2x)", math: "y_p' = a\\sin(2x) + 2ax\\cos(2x), \\quad y_p'' = 4a\\cos(2x) - 4ax\\sin(2x)" },
      { number: 2, description: "Substitute into the equation", math: "4a\\cos(2x) - 4ax\\sin(2x) + 4ax\\sin(2x) = 8\\cos(2x)" },
      { number: 3, description: "Solve for a", math: "4a = 8 \\Rightarrow a = 2" },
    ],
    hints: ["cos(2x) solves the homogeneous equation — resonance again"],
    timeEstimate: 270,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// VARIATION OF PARAMETERS
// ═══════════════════════════════════════════════════════════════════════════

const variationEasy: ProblemTemplate[] = [
  {
    question: "\\text{Using variation of parameters, } y'' - y' - 2y = e^{3x}\\text{ has a particular solution } y_p\\text{. Find } y_p(0)\\text{.}",
    answer: "\\frac{1}{4}",
    steps: [
      { number: 1, description: "Homogeneous solutions and Wronskian", math: "y_1 = e^{2x}, \\; y_2 = e^{-x}, \\quad W = -3e^x" },
      { number: 2, description: "Compute u_1 and u_2", math: "u_1' = -\\frac{y_2 f}{W} = \\frac{e^x}{3} \\Rightarrow u_1 = \\frac{e^x}{3}, \\quad u_2' = \\frac{y_1 f}{W} = -\\frac{e^{4x}}{3} \\Rightarrow u_2 = -\\frac{e^{4x}}{12}" },
      { number: 3, description: "Assemble y_p and evaluate", math: "y_p = \\frac{e^{3x}}{3} - \\frac{e^{3x}}{12} = \\frac{e^{3x}}{4} \\Rightarrow y_p(0) = \\frac{1}{4}" },
    ],
    hints: ["W = y1 y2' - y1' y2"],
    timeEstimate: 300,
  },
  {
    question: "\\text{Using variation of parameters, } y'' - y = e^x\\text{ has a particular solution } y_p\\text{. Find } y_p(1)\\text{.}",
    answer: "\\frac{e}{4}",
    steps: [
      { number: 1, description: "Homogeneous solutions and Wronskian", math: "y_1 = e^x, \\; y_2 = e^{-x}, \\quad W = -2" },
      { number: 2, description: "Compute u_1 and u_2", math: "u_1' = \\frac{1}{2} \\Rightarrow u_1 = \\frac{x}{2}, \\quad u_2' = -\\frac{e^{2x}}{2} \\Rightarrow u_2 = -\\frac{e^{2x}}{4}" },
      { number: 3, description: "Assemble y_p and evaluate", math: "y_p = \\frac{xe^x}{2} - \\frac{e^x}{4} \\Rightarrow y_p(1) = \\frac{e}{2} - \\frac{e}{4} = \\frac{e}{4}" },
    ],
    hints: ["e^x solves the homogeneous equation — expect resonance"],
    timeEstimate: 300,
  },
  {
    question: "\\text{Using variation of parameters (or inspection), find the constant particular} \\\\ \\text{solution of } y'' + 4y = 4\\text{.}",
    answer: "1",
    steps: [
      { number: 1, description: "Try y_p = c", math: "y_p'' = 0" },
      { number: 2, description: "Substitute and solve", math: "4c = 4 \\Rightarrow c = 1" },
    ],
    hints: ["Constant forcing, and y = c is not in the homogeneous solution space"],
    timeEstimate: 120,
  },
];

const variationMedium: ProblemTemplate[] = [
  {
    question: "\\text{Using variation of parameters, } y'' - 3y' + 2y = e^{3x}\\text{ has a particular solution } y_p\\text{. Find } y_p(0)\\text{.}",
    answer: "\\frac{1}{2}",
    steps: [
      { number: 1, description: "Homogeneous solutions and Wronskian", math: "y_1 = e^x, \\; y_2 = e^{2x}, \\quad W = e^{3x}" },
      { number: 2, description: "Compute u_1 and u_2", math: "u_1' = -\\frac{e^{2x} e^{3x}}{e^{3x}} = -e^{2x} \\Rightarrow u_1 = -\\frac{e^{2x}}{2}, \\quad u_2' = \\frac{e^x e^{3x}}{e^{3x}} = e^x \\Rightarrow u_2 = e^x" },
      { number: 3, description: "Assemble y_p and evaluate", math: "y_p = -\\frac{e^{3x}}{2} + e^{3x} = \\frac{e^{3x}}{2} \\Rightarrow y_p(0) = \\frac{1}{2}" },
    ],
    hints: ["W(e^x, e^{2x}) = e^{3x}"],
    timeEstimate: 300,
  },
  {
    question: "\\text{Using variation of parameters, } y'' + y = \\sin(x)\\text{ has a particular solution} \\\\ y_p = -\\frac{x}{2}\\cos(x)\\text{. Find } y_p(\\pi)\\text{.}",
    answer: "\\frac{\\pi}{2}",
    steps: [
      { number: 1, description: "Verify the form — sin(x) is resonant with the homogeneous solution", math: "y_p = -\\frac{x}{2}\\cos(x)" },
      { number: 2, description: "Evaluate at x = pi", math: "y_p(\\pi) = -\\frac{\\pi}{2}\\cos(\\pi) = -\\frac{\\pi}{2}(-1) = \\frac{\\pi}{2}" },
    ],
    hints: ["cos(pi) = -1"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Using variation of parameters, } y'' - 4y' + 4y = \\frac{e^{2x}}{x^2}\\text{ (}x > 0\\text{) has a particular} \\\\ \\text{solution } y_p = -e^{2x}(\\ln(x) + 1)\\text{. Find } y_p(1)\\text{.}",
    answer: "-e^2",
    steps: [
      { number: 1, description: "Homogeneous solutions and Wronskian", math: "y_1 = e^{2x}, \\; y_2 = xe^{2x}, \\quad W = e^{4x}" },
      { number: 2, description: "Compute u_1 and u_2", math: "u_1' = -\\frac{1}{x} \\Rightarrow u_1 = -\\ln(x), \\quad u_2' = \\frac{1}{x^2} \\Rightarrow u_2 = -\\frac{1}{x}" },
      { number: 3, description: "Assemble y_p and evaluate at x = 1", math: "y_p = -e^{2x}\\ln(x) - e^{2x} \\Rightarrow y_p(1) = -e^2(0 + 1) = -e^2" },
    ],
    hints: ["ln(1) = 0"],
    timeEstimate: 330,
  },
];

const variationHard: ProblemTemplate[] = [
  {
    question: "\\text{Using variation of parameters, } y'' - 2y' + y = \\frac{e^x}{x}\\text{ (}x > 0\\text{) has a particular} \\\\ \\text{solution } y_p = xe^x(\\ln(x) - 1)\\text{. Find } y_p(1)\\text{.}",
    answer: "-e",
    steps: [
      { number: 1, description: "Homogeneous solutions and Wronskian", math: "y_1 = e^x, \\; y_2 = xe^x, \\quad W = e^{2x}" },
      { number: 2, description: "Compute u_1 and u_2", math: "u_1' = -1 \\Rightarrow u_1 = -x, \\quad u_2' = \\frac{1}{x} \\Rightarrow u_2 = \\ln(x)" },
      { number: 3, description: "Assemble y_p and evaluate at x = 1", math: "y_p = -xe^x + xe^x \\ln(x) \\Rightarrow y_p(1) = e(-1 + 0) = -e" },
    ],
    hints: ["ln(1) = 0"],
    timeEstimate: 330,
  },
  {
    question: "\\text{Using variation of parameters, } y'' + y' = e^{-x}\\text{ has a particular solution } y_p\\text{. Find } y_p(0)\\text{.}",
    answer: "-1",
    steps: [
      { number: 1, description: "Homogeneous solutions and Wronskian", math: "y_1 = 1, \\; y_2 = e^{-x}, \\quad W = -e^{-x}" },
      { number: 2, description: "Compute u_1 and u_2", math: "u_1' = -\\frac{e^{-x} e^{-x}}{-e^{-x}} = e^{-x} \\Rightarrow u_1 = -e^{-x}, \\quad u_2' = \\frac{e^{-x}}{-e^{-x}} = -1 \\Rightarrow u_2 = -x" },
      { number: 3, description: "Assemble y_p and evaluate", math: "y_p = -e^{-x} - xe^{-x} \\Rightarrow y_p(0) = -1" },
    ],
    hints: ["One homogeneous solution is the constant 1"],
    timeEstimate: 300,
  },
  {
    question: "\\text{Using variation of parameters, } y'' - y = e^{-x}\\text{ has a particular solution} \\\\ y_p = -\\frac{x}{2}e^{-x}\\text{. Find } y_p(\\ln(2))\\text{.}",
    answer: "-\\frac{\\ln(2)}{4}",
    steps: [
      { number: 1, description: "Verify the form — e^{-x} is resonant with the homogeneous solution", math: "y_p = -\\frac{x}{2}e^{-x}" },
      { number: 2, description: "Evaluate at x = ln(2)", math: "y_p(\\ln(2)) = -\\frac{\\ln(2)}{2} \\cdot e^{-\\ln(2)} = -\\frac{\\ln(2)}{2} \\cdot \\frac{1}{2} = -\\frac{\\ln(2)}{4}" },
    ],
    hints: ["e^{-ln(2)} = 1/2"],
    timeEstimate: 210,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// LAPLACE TRANSFORMS
// ═══════════════════════════════════════════════════════════════════════════

const laplaceEasy: ProblemTemplate[] = [
  {
    question: "\\text{Let } F(s) = \\mathcal{L}\\{f\\}\\text{ be the Laplace transform of } f(x) = x^2\\text{. Find } F(2)\\text{.}",
    answer: "\\frac{1}{4}",
    steps: [
      { number: 1, description: "Recall the transform of a power", math: "\\mathcal{L}\\{x^2\\} = \\frac{2}{s^3}" },
      { number: 2, description: "Evaluate at s = 2", math: "F(2) = \\frac{2}{8} = \\frac{1}{4}" },
    ],
    hints: ["L{x^n} = n! / s^{n+1}"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Let } F(s) = \\mathcal{L}\\{f\\}\\text{ where } f(x) = e^{3x}\\text{. Find } F(4)\\text{.}",
    answer: "1",
    steps: [
      { number: 1, description: "Recall the exponential transform", math: "\\mathcal{L}\\{e^{3x}\\} = \\frac{1}{s - 3}" },
      { number: 2, description: "Evaluate at s = 4", math: "F(4) = \\frac{1}{4 - 3} = 1" },
    ],
    hints: ["L{e^{ax}} = 1/(s - a)"],
    timeEstimate: 90,
  },
  {
    question: "\\text{Let } F(s) = \\mathcal{L}\\{f\\}\\text{ where } f(x) = \\sin(2x)\\text{. Find } F(0)\\text{.}",
    answer: "\\frac{1}{2}",
    steps: [
      { number: 1, description: "Recall the sine transform", math: "\\mathcal{L}\\{\\sin(2x)\\} = \\frac{2}{s^2 + 4}" },
      { number: 2, description: "Evaluate at s = 0", math: "F(0) = \\frac{2}{4} = \\frac{1}{2}" },
    ],
    hints: ["L{sin(ax)} = a/(s^2 + a^2)"],
    timeEstimate: 120,
  },
];

const laplaceMedium: ProblemTemplate[] = [
  {
    question: "\\text{Let } f\\text{ be the inverse Laplace transform of } F(s) = \\frac{1}{s - 2}\\text{,} \\\\ \\text{written as a function of } x\\text{. Find } f(1)\\text{.}",
    answer: "e^2",
    steps: [
      { number: 1, description: "Identify the inverse transform", math: "\\mathcal{L}^{-1}\\left\\{ \\frac{1}{s - 2} \\right\\} = e^{2x}" },
      { number: 2, description: "Evaluate at x = 1", math: "f(1) = e^2" },
    ],
    hints: ["1/(s - a) comes from e^{ax}"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Let } f\\text{ be the inverse Laplace transform of } F(s) = \\frac{6}{s^4}\\text{,} \\\\ \\text{written as a function of } x\\text{. Find } f(2)\\text{.}",
    answer: "8",
    steps: [
      { number: 1, description: "Identify the inverse transform", math: "\\mathcal{L}^{-1}\\left\\{ \\frac{6}{s^4} \\right\\} = x^3 \\quad \\left(\\text{since } \\mathcal{L}\\{x^3\\} = \\frac{6}{s^4}\\right)" },
      { number: 2, description: "Evaluate at x = 2", math: "f(2) = 8" },
    ],
    hints: ["3! = 6"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Let } f\\text{ be the inverse Laplace transform of } F(s) = \\frac{s}{s^2 + 9}\\text{,} \\\\ \\text{written as a function of } x\\text{. Find } f\\!\\left(\\frac{\\pi}{3}\\right)\\text{.}",
    answer: "-1",
    steps: [
      { number: 1, description: "Identify the inverse transform", math: "\\mathcal{L}^{-1}\\left\\{ \\frac{s}{s^2 + 9} \\right\\} = \\cos(3x)" },
      { number: 2, description: "Evaluate at x = pi/3", math: "f\\!\\left(\\frac{\\pi}{3}\\right) = \\cos(\\pi) = -1" },
    ],
    hints: ["s/(s^2 + a^2) comes from cos(ax)"],
    timeEstimate: 150,
  },
];

const laplaceHard: ProblemTemplate[] = [
  {
    question: "\\text{Let } F(s) = \\mathcal{L}\\{f\\}\\text{ where } f(x) = xe^{2x}\\text{. Find } F(3)\\text{.}",
    answer: "1",
    steps: [
      { number: 1, description: "Use the first shifting theorem", math: "\\mathcal{L}\\{xe^{2x}\\} = \\frac{1}{(s - 2)^2}" },
      { number: 2, description: "Evaluate at s = 3", math: "F(3) = \\frac{1}{(3 - 2)^2} = 1" },
    ],
    hints: ["Multiplication by x shifts and differentiates: L{x f(x)} = -F'(s)"],
    timeEstimate: 210,
  },
  {
    question: "\\text{Let } f\\text{ be the inverse Laplace transform of } F(s) = \\frac{1}{s^2 + 2s + 5}\\text{,} \\\\ \\text{written as a function of } x\\text{. Find } f\\!\\left(\\frac{\\pi}{4}\\right)\\text{.}",
    answer: "\\frac{e^{-\\pi/4}}{2}",
    steps: [
      { number: 1, description: "Complete the square", math: "s^2 + 2s + 5 = (s + 1)^2 + 4" },
      { number: 2, description: "Identify the shifted inverse transform", math: "\\mathcal{L}^{-1}\\left\\{ \\frac{1}{(s + 1)^2 + 4} \\right\\} = \\frac{1}{2} e^{-x} \\sin(2x)" },
      { number: 3, description: "Evaluate at x = pi/4", math: "f\\!\\left(\\frac{\\pi}{4}\\right) = \\frac{1}{2} e^{-\\pi/4} \\sin\\!\\left(\\frac{\\pi}{2}\\right) = \\frac{e^{-\\pi/4}}{2}" },
    ],
    hints: ["Complete the square, then use the shifting theorem", "sin(pi/2) = 1"],
    timeEstimate: 300,
  },
  {
    question: "\\text{Use the Laplace transform to solve } y' + y = 0\\text{, } y(0) = 3\\text{,} \\\\ \\text{and find } y(\\ln(3))\\text{.}",
    answer: "1",
    steps: [
      { number: 1, description: "Transform both sides", math: "sY - y(0) + Y = 0 \\Rightarrow Y(s) = \\frac{3}{s + 1}" },
      { number: 2, description: "Invert the transform", math: "y = 3e^{-x}" },
      { number: 3, description: "Evaluate at x = ln(3)", math: "y(\\ln(3)) = 3e^{-\\ln(3)} = 3 \\cdot \\frac{1}{3} = 1" },
    ],
    hints: ["L{y'} = sY - y(0)", "e^{-ln(3)} = 1/3"],
    timeEstimate: 240,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// BANK EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const diffEqProblemBank: Record<DiffEqTechnique, Record<Difficulty, ProblemTemplate[]>> = {
  'separable': {
    easy: separableEasy,
    medium: separableMedium,
    hard: separableHard,
  },
  'linear-first-order': {
    easy: linearEasy,
    medium: linearMedium,
    hard: linearHard,
  },
  'homogeneous': {
    easy: homogeneousEasy,
    medium: homogeneousMedium,
    hard: homogeneousHard,
  },
  'exact': {
    easy: exactEasy,
    medium: exactMedium,
    hard: exactHard,
  },
  'second-order': {
    easy: secondOrderEasy,
    medium: secondOrderMedium,
    hard: secondOrderHard,
  },
  'undetermined-coefficients': {
    easy: undeterminedEasy,
    medium: undeterminedMedium,
    hard: undeterminedHard,
  },
  'variation-of-parameters': {
    easy: variationEasy,
    medium: variationMedium,
    hard: variationHard,
  },
  'laplace': {
    easy: laplaceEasy,
    medium: laplaceMedium,
    hard: laplaceHard,
  },
  'mixed-diffeq': {
    easy: [],
    medium: [],
    hard: [],
  },
};
