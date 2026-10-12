import { appDiffProblemBank } from './problems/applicationsDerivatives';
import { appIntProblemBank } from './problems/applicationsIntegration';
import { diffEqProblemBank } from './problems/differentialEquations';
import { seriesProblemBank } from './problems/sequencesSeries';
import { math1Factories } from './problems/math1';
import { math3Factories } from './problems/math3';
import { math7Factories } from './problems/math7';
import { math8Factories } from './problems/math8';
import { math6Factories } from './problems/math6';
import { mulberry32 } from './problems/math1/rng';

export type Subject = 'integration' | 'differentiation' | 'limits' | 'applications-derivatives' | 'applications-integration' | 'differential-equations' | 'sequences-series' | 'math1-eoc' | 'math3-eoc' | 'math6-eog' | 'math7-eog' | 'math8-eog';

export type IntegrationTechnique =
  | 'basic'
  | 'u-substitution'
  | 'parts'
  | 'trigonometric'
  | 'trig-substitution'
  | 'partial-fractions'
  | 'improper'
  | 'mixed';

export type DifferentiationTechnique =
  | 'basic-diff'
  | 'product-rule'
  | 'quotient-rule'
  | 'chain-rule'
  | 'implicit'
  | 'logarithmic'
  | 'trig-derivatives'
  | 'higher-order'
  | 'mixed-diff';

export type Technique = IntegrationTechnique | DifferentiationTechnique | LimitTechnique | AppDerivativesTechnique | AppIntegrationTechnique | DiffEqTechnique | SeriesTechnique | Math1Technique | Math3Technique | Math6Technique | Math7Technique | Math8Technique;
export type LimitTechnique =
  | 'direct-substitution'
  | 'factoring'
  | 'rationalizing'
  | 'special-trig'
  | 'lhopital'
  | 'infinite-limits'
  | 'limits-at-infinity'
  | 'mixed-limits';

export type AppDerivativesTechnique =
  | 'optimization'
  | 'related-rates'
  | 'curve-sketching'
  | 'mvt'
  | 'linear-approximation'
  | 'motion'
  | 'economics'
  | 'mixed-appdiff';

export type AppIntegrationTechnique =
  | 'area-between-curves'
  | 'volumes'
  | 'arc-length'
  | 'surface-area'
  | 'work'
  | 'center-of-mass'
  | 'averages-probability'
  | 'mixed-appint';

export type DiffEqTechnique =
  | 'separable'
  | 'linear-first-order'
  | 'homogeneous'
  | 'exact'
  | 'second-order'
  | 'undetermined-coefficients'
  | 'variation-of-parameters'
  | 'laplace'
  | 'mixed-diffeq';

export type SeriesTechnique =
  | 'geometric-series'
  | 'p-series-telescoping'
  | 'divergence-test'
  | 'ratio-test'
  | 'root-test'
  | 'comparison-tests'
  | 'alternating-series'
  | 'power-series'
  | 'mixed-series';

export type Math1Technique =
  | 'm1-linear-equations'
  | 'm1-systems'
  | 'm1-functions'
  | 'm1-quadratics-polynomials'
  | 'm1-exponentials'
  | 'm1-exponents-geometry'
  | 'm1-statistics'
  | 'mixed-m1';

export type Math3Technique =
  | 'm3-polynomials'
  | 'm3-rational-expressions'
  | 'm3-exponential-logs'
  | 'm3-functions-transformations'
  | 'm3-geometry'
  | 'm3-statistics'
  | 'mixed-m3';

export type Math7Technique =
  | 'g7-ratios-proportions'
  | 'g7-expressions-equations'
  | 'g7-numbers-operations'
  | 'g7-geometry'
  | 'g7-statistics'
  | 'g7-probability'
  | 'mixed-g7';

export type Math6Technique =
  | 'g6-ratios'
  | 'g6-expressions-equations'
  | 'g6-number-system'
  | 'g6-geometry'
  | 'g6-statistics'
  | 'mixed-g6';

export type Math8Technique =
  | 'g8-functions'
  | 'g8-expressions-equations'
  | 'g8-geometry'
  | 'g8-statistics-probability'
  | 'g8-number-system'
  | 'mixed-g8';

/** EOC item formats. 'FR' = free response (default, calculus subjects),
 *  'MC' = four-choice selection, 'GR' = gridded numeric response. */
export type ItemType = 'FR' | 'MC' | 'GR';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface SolutionStep {
  number: number;
  description: string;
  math: string;
}

export interface Problem {
  id: string;
  subject: Subject;
  technique: Technique;
  difficulty: Difficulty;
  question: string;
  answer: string;
  steps: SolutionStep[];
  hints: string[];
  timeEstimate: number;
  itemType?: ItemType;
  /** MC only: the four choice strings (answer equals one of them). */
  choices?: string[];
  /** EOC word problems: plain-prose paragraph(s) rendered above the math. */
  context?: string;
  /** Inline SVG rendered beneath the question (e.g. dot-pattern figures). */
  stemSvg?: string;
  /** MC only: per-choice inline SVG (index-aligned with choices); null = text-only choice. */
  svgChoices?: (string | null)[];
}

export interface ProblemTemplate {
  question: string;
  answer: string;
  steps: SolutionStep[];
  hints: string[];
  timeEstimate: number;
  itemType?: ItemType;
  choices?: string[];
  context?: string;
  stemSvg?: string;
  svgChoices?: (string | null)[];
}

/** Procedural problem factory for EOC subjects: seeded rng -> fresh original item. */
export type ProblemFactory = (rng: () => number, difficulty: Difficulty) => ProblemTemplate;

// ─────────────────────────────────────────────────────────────────────────────
// BASIC INTEGRATION
// ─────────────────────────────────────────────────────────────────────────────

const basicEasy: ProblemTemplate[] = [
  {
    question: "\\int x^3 \\, dx",
    answer: "\\frac{x^4}{4} + C",
    steps: [
      { number: 1, description: "Apply the power rule for integration", math: "\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C" },
      { number: 2, description: "Here n = 3, so we increment the exponent and divide", math: "\\int x^3 \\, dx = \\frac{x^{3+1}}{3+1} + C = \\frac{x^4}{4} + C" },
    ],
    hints: ["Use the power rule: \\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C"],
    timeEstimate: 30,
  },
  {
    question: "\\int 5x^2 \\, dx",
    answer: "\\frac{5x^3}{3} + C",
    steps: [
      { number: 1, description: "Factor out the constant 5", math: "5 \\int x^2 \\, dx" },
      { number: 2, description: "Apply the power rule with n = 2", math: "5 \\cdot \\frac{x^3}{3} + C = \\frac{5x^3}{3} + C" },
    ],
    hints: ["Factor out the constant first, then apply the power rule"],
    timeEstimate: 30,
  },
  {
    question: "\\int \\frac{1}{x^2} \\, dx",
    answer: "-\\frac{1}{x} + C",
    steps: [
      { number: 1, description: "Rewrite using negative exponent", math: "\\int x^{-2} \\, dx" },
      { number: 2, description: "Apply the power rule", math: "\\frac{x^{-1}}{-1} + C = -x^{-1} + C" },
      { number: 3, description: "Simplify", math: "-\\frac{1}{x} + C" },
    ],
    hints: ["Rewrite \\frac{1}{x^2} as x^{-2}, then use the power rule"],
    timeEstimate: 45,
  },
  {
    question: "\\int (x^2 + 3x) \\, dx",
    answer: "\\frac{x^3}{3} + \\frac{3x^2}{2} + C",
    steps: [
      { number: 1, description: "Integrate term by term using the sum rule", math: "\\int x^2 \\, dx + \\int 3x \\, dx" },
      { number: 2, description: "Apply power rule to each term", math: "\\frac{x^3}{3} + \\frac{3x^2}{2} + C" },
    ],
    hints: ["Integrate each term separately using the sum rule"],
    timeEstimate: 45,
  },
];

const basicMedium: ProblemTemplate[] = [
  {
    question: "\\int \\sqrt{x} \\, dx",
    answer: "\\frac{2x^{3/2}}{3} + C",
    steps: [
      { number: 1, description: "Rewrite the square root as a power", math: "\\int x^{1/2} \\, dx" },
      { number: 2, description: "Apply the power rule", math: "\\frac{x^{3/2}}{3/2} + C = \\frac{2x^{3/2}}{3} + C" },
    ],
    hints: ["Rewrite \\sqrt{x} as x^{1/2}"],
    timeEstimate: 60,
  },
  {
    question: "\\int \\frac{x^3 + 2x^2 - x + 1}{x} \\, dx",
    answer: "\\frac{x^3}{3} + 2x^2 - x + \\ln|x| + C",
    steps: [
      { number: 1, description: "Divide each term by x", math: "\\int \\left(x^2 + 2x - 1 + \\frac{1}{x}\\right) \\, dx" },
      { number: 2, description: "Integrate term by term", math: "\\frac{x^3}{3} + x^2 - x + \\ln|x| + C" },
    ],
    hints: ["Divide each term in the numerator by x first"],
    timeEstimate: 90,
  },
  {
    question: "\\int (3x - 1)^2 \\, dx",
    answer: "3x^3 - 3x^2 + x + C",
    steps: [
      { number: 1, description: "Expand the binomial", math: "(3x - 1)^2 = 9x^2 - 6x + 1" },
      { number: 2, description: "Integrate term by term", math: "\\int (9x^2 - 6x + 1) \\, dx = 3x^3 - 3x^2 + x + C" },
    ],
    hints: ["Expand (3x-1)^2 first, then integrate term by term"],
    timeEstimate: 75,
  },
];

const basicHard: ProblemTemplate[] = [
  {
    question: "\\int \\frac{x^4 - 1}{x^2 + 1} \\, dx",
    answer: "\\frac{x^3}{3} - x + C",
    steps: [
      { number: 1, description: "Factor the numerator as difference of squares", math: "x^4 - 1 = (x^2 + 1)(x^2 - 1)" },
      { number: 2, description: "Simplify the fraction", math: "\\int \\frac{(x^2+1)(x^2-1)}{x^2+1} \\, dx = \\int (x^2 - 1) \\, dx" },
      { number: 3, description: "Integrate term by term", math: "\\frac{x^3}{3} - x + C" },
    ],
    hints: ["Factor x^4 - 1 using difference of squares"],
    timeEstimate: 120,
  },
  {
    question: "\\int \\left(\\sqrt[3]{x} + \\frac{1}{\\sqrt{x}}\\right) \\, dx",
    answer: "\\frac{3x^{4/3}}{4} + 2\\sqrt{x} + C",
    steps: [
      { number: 1, description: "Rewrite in exponent form", math: "\\int \\left(x^{1/3} + x^{-1/2}\\right) \\, dx" },
      { number: 2, description: "Apply power rule to each term", math: "\\frac{x^{4/3}}{4/3} + \\frac{x^{1/2}}{1/2} + C" },
      { number: 3, description: "Simplify", math: "\\frac{3x^{4/3}}{4} + 2x^{1/2} + C = \\frac{3x^{4/3}}{4} + 2\\sqrt{x} + C" },
    ],
    hints: ["Rewrite roots as fractional exponents"],
    timeEstimate: 120,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// U-SUBSTITUTION
// ─────────────────────────────────────────────────────────────────────────────

const uSubEasy: ProblemTemplate[] = [
  {
    question: "\\int 2x \\cos(x^2) \\, dx",
    answer: "\\sin(x^2) + C",
    steps: [
      { number: 1, description: "Let u = x², then du = 2x dx", math: "u = x^2, \\quad du = 2x \\, dx" },
      { number: 2, description: "Substitute into the integral", math: "\\int \\cos(u) \\, du" },
      { number: 3, description: "Integrate and substitute back", math: "\\sin(u) + C = \\sin(x^2) + C" },
    ],
    hints: ["Try u = x². What's du?"],
    timeEstimate: 60,
  },
  {
    question: "\\int x e^{x^2} \\, dx",
    answer: "\\frac{1}{2}e^{x^2} + C",
    steps: [
      { number: 1, description: "Let u = x², then du = 2x dx, so x dx = du/2", math: "u = x^2, \\quad du = 2x \\, dx" },
      { number: 2, description: "Substitute", math: "\\frac{1}{2}\\int e^u \\, du = \\frac{1}{2}e^u + C" },
      { number: 3, description: "Substitute back", math: "\\frac{1}{2}e^{x^2} + C" },
    ],
    hints: ["Try u = x²"],
    timeEstimate: 60,
  },
  {
    question: "\\int \\frac{2x}{x^2 + 1} \\, dx",
    answer: "\\ln|x^2 + 1| + C",
    steps: [
      { number: 1, description: "Let u = x² + 1, then du = 2x dx", math: "u = x^2 + 1, \\quad du = 2x \\, dx" },
      { number: 2, description: "Substitute", math: "\\int \\frac{1}{u} \\, du = \\ln|u| + C" },
      { number: 3, description: "Substitute back", math: "\\ln|x^2 + 1| + C" },
    ],
    hints: ["Try u = x² + 1. Notice du = 2x dx."],
    timeEstimate: 60,
  },
];

const uSubMedium: ProblemTemplate[] = [
  {
    question: "\\int x^2 (x^3 + 2)^4 \\, dx",
    answer: "\\frac{(x^3 + 2)^5}{15} + C",
    steps: [
      { number: 1, description: "Let u = x³ + 2, then du = 3x² dx", math: "u = x^3 + 2, \\quad du = 3x^2 \\, dx" },
      { number: 2, description: "Solve for x² dx = du/3", math: "x^2 \\, dx = \\frac{du}{3}" },
      { number: 3, description: "Substitute", math: "\\frac{1}{3}\\int u^4 \\, du = \\frac{1}{3} \\cdot \\frac{u^5}{5} + C" },
      { number: 4, description: "Substitute back", math: "\\frac{(x^3 + 2)^5}{15} + C" },
    ],
    hints: ["Try u = x³ + 2"],
    timeEstimate: 90,
  },
  {
    question: "\\int \\frac{\\ln x}{x} \\, dx",
    answer: "\\frac{(\\ln x)^2}{2} + C",
    steps: [
      { number: 1, description: "Let u = ln x, then du = dx/x", math: "u = \\ln x, \\quad du = \\frac{1}{x} \\, dx" },
      { number: 2, description: "Substitute", math: "\\int u \\, du = \\frac{u^2}{2} + C" },
      { number: 3, description: "Substitute back", math: "\\frac{(\\ln x)^2}{2} + C" },
    ],
    hints: ["Try u = ln x"],
    timeEstimate: 75,
  },
  {
    question: "\\int \\tan x \\, dx",
    answer: "-\\ln|\\cos x| + C",
    steps: [
      { number: 1, description: "Rewrite tan x as sin x / cos x", math: "\\int \\frac{\\sin x}{\\cos x} \\, dx" },
      { number: 2, description: "Let u = cos x, then du = -sin x dx", math: "u = \\cos x, \\quad du = -\\sin x \\, dx" },
      { number: 3, description: "Substitute", math: "-\\int \\frac{1}{u} \\, du = -\\ln|u| + C" },
      { number: 4, description: "Substitute back", math: "-\\ln|\\cos x| + C = \\ln|\\sec x| + C" },
    ],
    hints: ["Rewrite tan x as sin x / cos x, then try u = cos x"],
    timeEstimate: 90,
  },
];

const uSubHard: ProblemTemplate[] = [
  {
    question: "\\int \\frac{e^{\\sqrt{x}}}{\\sqrt{x}} \\, dx",
    answer: "2e^{\\sqrt{x}} + C",
    steps: [
      { number: 1, description: "Let u = √x, then du = dx/(2√x), so dx/√x = 2 du", math: "u = \\sqrt{x}, \\quad du = \\frac{1}{2\\sqrt{x}} \\, dx" },
      { number: 2, description: "Substitute", math: "2\\int e^u \\, du = 2e^u + C" },
      { number: 3, description: "Substitute back", math: "2e^{\\sqrt{x}} + C" },
    ],
    hints: ["Try u = √x"],
    timeEstimate: 120,
  },
  {
    question: "\\int \\frac{x}{\\sqrt{1 - x^2}} \\, dx",
    answer: "-\\sqrt{1 - x^2} + C",
    steps: [
      { number: 1, description: "Let u = 1 - x², then du = -2x dx", math: "u = 1 - x^2, \\quad du = -2x \\, dx" },
      { number: 2, description: "Solve for x dx = -du/2", math: "x \\, dx = -\\frac{du}{2}" },
      { number: 3, description: "Substitute", math: "-\\frac{1}{2}\\int u^{-1/2} \\, du = -\\frac{1}{2} \\cdot 2u^{1/2} + C" },
      { number: 4, description: "Substitute back", math: "-\\sqrt{1 - x^2} + C" },
    ],
    hints: ["Try u = 1 - x²"],
    timeEstimate: 120,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// INTEGRATION BY PARTS
// ─────────────────────────────────────────────────────────────────────────────

const partsEasy: ProblemTemplate[] = [
  {
    question: "\\int x e^x \\, dx",
    answer: "xe^x - e^x + C",
    steps: [
      { number: 1, description: "Choose u and dv using LIATE", math: "u = x, \\quad dv = e^x \\, dx" },
      { number: 2, description: "Compute du and v", math: "du = dx, \\quad v = e^x" },
      { number: 3, description: "Apply integration by parts formula: ∫u dv = uv - ∫v du", math: "xe^x - \\int e^x \\, dx" },
      { number: 4, description: "Evaluate the remaining integral", math: "xe^x - e^x + C" },
    ],
    hints: ["Use LIATE: choose u = x (algebraic), dv = eˣ dx"],
    timeEstimate: 90,
  },
  {
    question: "\\int x \\sin x \\, dx",
    answer: "-x \\cos x + \\sin x + C",
    steps: [
      { number: 1, description: "Choose u = x, dv = sin x dx", math: "u = x, \\quad dv = \\sin x \\, dx" },
      { number: 2, description: "Compute du = dx, v = -cos x", math: "du = dx, \\quad v = -\\cos x" },
      { number: 3, description: "Apply formula", math: "-x\\cos x + \\int \\cos x \\, dx" },
      { number: 4, description: "Evaluate", math: "-x\\cos x + \\sin x + C" },
    ],
    hints: ["Choose u = x, dv = sin x dx"],
    timeEstimate: 90,
  },
];

const partsMedium: ProblemTemplate[] = [
  {
    question: "\\int x^2 e^x \\, dx",
    answer: "x^2e^x - 2xe^x + 2e^x + C",
    steps: [
      { number: 1, description: "First application: u = x², dv = eˣ dx", math: "u = x^2, \\quad dv = e^x \\, dx" },
      { number: 2, description: "du = 2x dx, v = eˣ. Apply formula", math: "x^2e^x - 2\\int xe^x \\, dx" },
      { number: 3, description: "Second integration by parts on ∫xeˣ dx", math: "\\int xe^x \\, dx = xe^x - e^x" },
      { number: 4, description: "Combine results", math: "x^2e^x - 2(xe^x - e^x) + C = x^2e^x - 2xe^x + 2e^x + C" },
    ],
    hints: ["You'll need to apply integration by parts twice", "For the first round, choose u = x²"],
    timeEstimate: 150,
  },
  {
    question: "\\int x \\ln x \\, dx",
    answer: "\\frac{x^2 \\ln x}{2} - \\frac{x^2}{4} + C",
    steps: [
      { number: 1, description: "Choose u = ln x, dv = x dx (logarithmic outranks algebraic in LIATE)", math: "u = \\ln x, \\quad dv = x \\, dx" },
      { number: 2, description: "Compute du = dx/x, v = x²/2", math: "du = \\frac{1}{x} \\, dx, \\quad v = \\frac{x^2}{2}" },
      { number: 3, description: "Apply formula", math: "\\frac{x^2 \\ln x}{2} - \\int \\frac{x}{2} \\, dx" },
      { number: 4, description: "Evaluate", math: "\\frac{x^2 \\ln x}{2} - \\frac{x^2}{4} + C" },
    ],
    hints: ["Use LIATE: u = ln x (logarithmic outranks algebraic)"],
    timeEstimate: 120,
  },
  {
    question: "\\int e^x \\sin x \\, dx",
    answer: "\\frac{e^x(\\sin x - \\cos x)}{2} + C",
    steps: [
      { number: 1, description: "Let I = ∫eˣ sin x dx. Choose u = sin x, dv = eˣ dx", math: "u = \\sin x, \\quad dv = e^x \\, dx" },
      { number: 2, description: "Apply parts once", math: "I = e^x\\sin x - \\int e^x \\cos x \\, dx" },
      { number: 3, description: "Apply parts again to the new integral with u = cos x", math: "\\int e^x \\cos x \\, dx = e^x\\cos x + \\int e^x \\sin x \\, dx = e^x\\cos x + I" },
      { number: 4, description: "Substitute back: I = eˣsin x - (eˣcos x + I)", math: "2I = e^x(\\sin x - \\cos x)" },
      { number: 5, description: "Solve for I", math: "I = \\frac{e^x(\\sin x - \\cos x)}{2} + C" },
    ],
    hints: ["This requires two rounds of integration by parts", "The original integral will reappear — solve for it algebraically"],
    timeEstimate: 180,
  },
];

const partsHard: ProblemTemplate[] = [
  {
    question: "\\int x^2 \\sin(2x) \\, dx",
    answer: "-\\frac{x^2\\cos(2x)}{2} + \\frac{x\\sin(2x)}{2} + \\frac{\\cos(2x)}{4} + C",
    steps: [
      { number: 1, description: "First parts: u = x², dv = sin(2x) dx", math: "u = x^2, \\quad dv = \\sin(2x) \\, dx" },
      { number: 2, description: "du = 2x dx, v = -cos(2x)/2", math: "-\\frac{x^2\\cos(2x)}{2} + \\int x\\cos(2x) \\, dx" },
      { number: 3, description: "Second parts on remaining integral: u = x, dv = cos(2x) dx", math: "\\int x\\cos(2x) \\, dx = \\frac{x\\sin(2x)}{2} - \\frac{1}{2}\\int \\sin(2x) \\, dx" },
      { number: 4, description: "Evaluate the final integral", math: "= \\frac{x\\sin(2x)}{2} + \\frac{\\cos(2x)}{4}" },
      { number: 5, description: "Combine all terms", math: "-\\frac{x^2\\cos(2x)}{2} + \\frac{x\\sin(2x)}{2} + \\frac{\\cos(2x)}{4} + C" },
    ],
    hints: ["Apply integration by parts twice", "First u = x², then u = x"],
    timeEstimate: 240,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TRIGONOMETRIC INTEGRALS
// ─────────────────────────────────────────────────────────────────────────────

const trigEasy: ProblemTemplate[] = [
  {
    question: "\\int \\sin(3x) \\, dx",
    answer: "-\\frac{\\cos(3x)}{3} + C",
    steps: [
      { number: 1, description: "Use the basic integral of sine with chain rule", math: "\\int \\sin(ax) \\, dx = -\\frac{\\cos(ax)}{a} + C" },
      { number: 2, description: "Here a = 3", math: "-\\frac{\\cos(3x)}{3} + C" },
    ],
    hints: ["Use the formula ∫sin(ax) dx = -cos(ax)/a + C"],
    timeEstimate: 30,
  },
  {
    question: "\\int \\cos^2 x \\, dx",
    answer: "\\frac{x}{2} + \\frac{\\sin(2x)}{4} + C",
    steps: [
      { number: 1, description: "Use the half-angle identity", math: "\\cos^2 x = \\frac{1 + \\cos(2x)}{2}" },
      { number: 2, description: "Split the integral", math: "\\frac{1}{2}\\int dx + \\frac{1}{2}\\int \\cos(2x) \\, dx" },
      { number: 3, description: "Evaluate each part", math: "\\frac{x}{2} + \\frac{\\sin(2x)}{4} + C" },
    ],
    hints: ["Use the half-angle identity: cos²x = (1 + cos(2x))/2"],
    timeEstimate: 90,
  },
];

const trigMedium: ProblemTemplate[] = [
  {
    question: "\\int \\sin^3 x \\, dx",
    answer: "-\\cos x + \\frac{\\cos^3 x}{3} + C",
    steps: [
      { number: 1, description: "Factor out one sin x and use identity sin²x = 1 - cos²x", math: "\\int \\sin^2 x \\cdot \\sin x \\, dx = \\int (1 - \\cos^2 x)\\sin x \\, dx" },
      { number: 2, description: "Let u = cos x, du = -sin x dx", math: "u = \\cos x, \\quad du = -\\sin x \\, dx" },
      { number: 3, description: "Substitute", math: "-\\int (1 - u^2) \\, du = -u + \\frac{u^3}{3} + C" },
      { number: 4, description: "Substitute back", math: "-\\cos x + \\frac{\\cos^3 x}{3} + C" },
    ],
    hints: ["Factor sin³x = sin²x · sin x, then use sin²x = 1 - cos²x"],
    timeEstimate: 120,
  },
  {
    question: "\\int \\sin^2 x \\cos^3 x \\, dx",
    answer: "\\frac{\\sin^3 x}{3} - \\frac{\\sin^5 x}{5} + C",
    steps: [
      { number: 1, description: "Factor out one cos x, rewrite cos²x = 1 - sin²x", math: "\\int \\sin^2 x \\cos^2 x \\cdot \\cos x \\, dx = \\int \\sin^2 x (1 - \\sin^2 x)\\cos x \\, dx" },
      { number: 2, description: "Let u = sin x, du = cos x dx", math: "u = \\sin x, \\quad du = \\cos x \\, dx" },
      { number: 3, description: "Substitute and expand", math: "\\int u^2(1 - u^2) \\, du = \\int (u^2 - u^4) \\, du" },
      { number: 4, description: "Integrate", math: "\\frac{u^3}{3} - \\frac{u^5}{5} + C = \\frac{\\sin^3 x}{3} - \\frac{\\sin^5 x}{5} + C" },
    ],
    hints: ["Factor out one cos x and use cos²x = 1 - sin²x"],
    timeEstimate: 120,
  },
  {
    question: "\\int \\tan^2 x \\, dx",
    answer: "\\tan x - x + C",
    steps: [
      { number: 1, description: "Use the identity tan²x = sec²x - 1", math: "\\tan^2 x = \\sec^2 x - 1" },
      { number: 2, description: "Split the integral", math: "\\int \\sec^2 x \\, dx - \\int dx" },
      { number: 3, description: "Evaluate", math: "\\tan x - x + C" },
    ],
    hints: ["Use the identity: tan²x + 1 = sec²x"],
    timeEstimate: 90,
  },
];

const trigHard: ProblemTemplate[] = [
  {
    question: "\\int \\sin(3x) \\cos(2x) \\, dx",
    answer: "-\\frac{\\cos(5x)}{10} - \\frac{\\cos x}{2} + C",
    steps: [
      { number: 1, description: "Use product-to-sum formula", math: "\\sin A \\cos B = \\frac{1}{2}[\\sin(A+B) + \\sin(A-B)]" },
      { number: 2, description: "Apply with A = 3x, B = 2x", math: "\\sin(3x)\\cos(2x) = \\frac{1}{2}[\\sin(5x) + \\sin x]" },
      { number: 3, description: "Integrate term by term", math: "\\frac{1}{2}\\left[-\\frac{\\cos(5x)}{5} - \\cos x\\right] + C" },
      { number: 4, description: "Simplify", math: "-\\frac{\\cos(5x)}{10} - \\frac{\\cos x}{2} + C" },
    ],
    hints: ["Use the product-to-sum identity: sin A cos B = ½[sin(A+B) + sin(A-B)]"],
    timeEstimate: 180,
  },
  {
    question: "\\int \\sec^4 x \\, dx",
    answer: "\\tan x + \\frac{\\tan^3 x}{3} + C",
    steps: [
      { number: 1, description: "Factor sec⁴x = sec²x · sec²x and use identity sec²x = 1 + tan²x", math: "\\int \\sec^2 x (1 + \\tan^2 x) \\, dx" },
      { number: 2, description: "Let u = tan x, du = sec²x dx", math: "u = \\tan x, \\quad du = \\sec^2 x \\, dx" },
      { number: 3, description: "Substitute", math: "\\int (1 + u^2) \\, du = u + \\frac{u^3}{3} + C" },
      { number: 4, description: "Substitute back", math: "\\tan x + \\frac{\\tan^3 x}{3} + C" },
    ],
    hints: ["Factor out sec²x and use sec²x = 1 + tan²x"],
    timeEstimate: 150,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TRIGONOMETRIC SUBSTITUTION
// ─────────────────────────────────────────────────────────────────────────────

const trigSubEasy: ProblemTemplate[] = [
  {
    question: "\\int \\frac{1}{\\sqrt{1 - x^2}} \\, dx",
    answer: "\\arcsin x + C",
    steps: [
      { number: 1, description: "Recognize the standard form — this is the derivative of arcsin", math: "\\int \\frac{1}{\\sqrt{1 - x^2}} \\, dx = \\arcsin x + C" },
    ],
    hints: ["This is a standard integral that gives arcsin"],
    timeEstimate: 30,
  },
  {
    question: "\\int \\frac{x}{\\sqrt{1 - x^2}} \\, dx",
    answer: "-\\sqrt{1 - x^2} + C",
    steps: [
      { number: 1, description: "Let x = sin θ, dx = cos θ dθ", math: "x = \\sin \\theta, \\quad dx = \\cos \\theta \\, d\\theta" },
      { number: 2, description: "Substitute and simplify using √(1 - sin²θ) = cos θ", math: "\\int \\frac{\\sin \\theta \\cos \\theta}{\\cos \\theta} \\, d\\theta = \\int \\sin \\theta \\, d\\theta" },
      { number: 3, description: "Evaluate and back-substitute", math: "-\\cos \\theta + C = -\\sqrt{1 - x^2} + C" },
    ],
    hints: ["Use x = sin θ, or alternatively use u-substitution with u = 1 - x²"],
    timeEstimate: 90,
  },
];

const trigSubMedium: ProblemTemplate[] = [
  {
    question: "\\int \\frac{1}{\\sqrt{4 - x^2}} \\, dx",
    answer: "\\arcsin\\left(\\frac{x}{2}\\right) + C",
    steps: [
      { number: 1, description: "Factor out 4 from the radical", math: "\\int \\frac{1}{2\\sqrt{1 - (x/2)^2}} \\, dx" },
      { number: 2, description: "Let u = x/2, du = dx/2", math: "u = \\frac{x}{2}, \\quad du = \\frac{dx}{2}" },
      { number: 3, description: "This becomes the standard arcsin form", math: "\\int \\frac{1}{\\sqrt{1 - u^2}} \\, du = \\arcsin u + C" },
      { number: 4, description: "Substitute back", math: "\\arcsin\\left(\\frac{x}{2}\\right) + C" },
    ],
    hints: ["Factor out the 4: √(4-x²) = 2√(1-(x/2)²)"],
    timeEstimate: 120,
  },
  {
    question: "\\int \\frac{1}{x^2\\sqrt{x^2 + 4}} \\, dx",
    answer: "-\\frac{\\sqrt{x^2 + 4}}{4x} + C",
    steps: [
      { number: 1, description: "Let x = 2 tan θ, dx = 2 sec²θ dθ", math: "x = 2\\tan\\theta, \\quad dx = 2\\sec^2\\theta \\, d\\theta" },
      { number: 2, description: "Substitute: √(x²+4) = √(4tan²θ+4) = 2sec θ", math: "\\int \\frac{2\\sec^2\\theta}{4\\tan^2\\theta \\cdot 2\\sec\\theta} \\, d\\theta = \\frac{1}{4}\\int \\frac{\\sec\\theta}{\\tan^2\\theta} \\, d\\theta" },
      { number: 3, description: "Simplify using sec θ/tan²θ = cos θ/sin²θ", math: "\\frac{1}{4}\\int \\frac{\\cos\\theta}{\\sin^2\\theta} \\, d\\theta" },
      { number: 4, description: "Let u = sin θ, result is -1/(4sin θ)", math: "-\\frac{1}{4\\sin\\theta} + C" },
      { number: 5, description: "Construct right triangle: opposite = x, adjacent = 2, hypotenuse = √(x²+4)", math: "\\sin\\theta = \\frac{x}{\\sqrt{x^2+4}} \\Rightarrow -\\frac{\\sqrt{x^2+4}}{4x} + C" },
    ],
    hints: ["Use x = 2 tan θ for √(x²+4) form", "Draw a right triangle to convert back"],
    timeEstimate: 240,
  },
];

const trigSubHard: ProblemTemplate[] = [
  {
    question: "\\int \\frac{1}{(x^2 + 1)^{3/2}} \\, dx",
    answer: "\\frac{x}{\\sqrt{x^2 + 1}} + C",
    steps: [
      { number: 1, description: "Let x = tan θ, dx = sec²θ dθ", math: "x = \\tan\\theta, \\quad dx = \\sec^2\\theta \\, d\\theta" },
      { number: 2, description: "Note (x²+1)^{3/2} = (sec²θ)^{3/2} = sec³θ", math: "(x^2+1)^{3/2} = (\\sec^2\\theta)^{3/2} = \\sec^3\\theta" },
      { number: 3, description: "Substitute", math: "\\int \\frac{\\sec^2\\theta}{\\sec^3\\theta} \\, d\\theta = \\int \\cos\\theta \\, d\\theta = \\sin\\theta + C" },
      { number: 4, description: "From the triangle: sin θ = x/√(x²+1)", math: "\\frac{x}{\\sqrt{x^2+1}} + C" },
    ],
    hints: ["Use x = tan θ, then (x²+1)^{3/2} becomes sec³θ"],
    timeEstimate: 180,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PARTIAL FRACTIONS
// ─────────────────────────────────────────────────────────────────────────────

const partialEasy: ProblemTemplate[] = [
  {
    question: "\\int \\frac{1}{x^2 - 1} \\, dx",
    answer: "\\frac{1}{2}\\ln\\left|\\frac{x-1}{x+1}\\right| + C",
    steps: [
      { number: 1, description: "Factor the denominator", math: "x^2 - 1 = (x-1)(x+1)" },
      { number: 2, description: "Set up partial fractions", math: "\\frac{1}{(x-1)(x+1)} = \\frac{A}{x-1} + \\frac{B}{x+1}" },
      { number: 3, description: "Solve: 1 = A(x+1) + B(x-1). At x=1: A=½; at x=-1: B=-½", math: "A = \\frac{1}{2}, \\quad B = -\\frac{1}{2}" },
      { number: 4, description: "Integrate", math: "\\frac{1}{2}\\ln|x-1| - \\frac{1}{2}\\ln|x+1| + C = \\frac{1}{2}\\ln\\left|\\frac{x-1}{x+1}\\right| + C" },
    ],
    hints: ["Factor as (x-1)(x+1), then set up partial fractions"],
    timeEstimate: 120,
  },
  {
    question: "\\int \\frac{3x + 5}{x^2 + 3x + 2} \\, dx",
    answer: "\\ln|x+1| + 2\\ln|x+2| + C",
    steps: [
      { number: 1, description: "Factor the denominator", math: "x^2 + 3x + 2 = (x+1)(x+2)" },
      { number: 2, description: "Set up partial fractions", math: "\\frac{3x+5}{(x+1)(x+2)} = \\frac{A}{x+1} + \\frac{B}{x+2}" },
      { number: 3, description: "Solve: 3x+5 = A(x+2) + B(x+1). At x=-1: A=2; at x=-2: B=1", math: "A = 2, \\quad B = 1" },
      { number: 4, description: "Integrate", math: "2\\ln|x+1| + \\ln|x+2| + C" },
    ],
    hints: ["Factor the denominator, then use partial fractions"],
    timeEstimate: 120,
  },
];

const partialMedium: ProblemTemplate[] = [
  {
    question: "\\int \\frac{x^2 + 1}{x(x-1)^2} \\, dx",
    answer: "\\ln|x| + 2\\ln|x-1| - \\frac{2}{x-1} + C",
    steps: [
      { number: 1, description: "Set up partial fractions with repeated factor", math: "\\frac{x^2+1}{x(x-1)^2} = \\frac{A}{x} + \\frac{B}{x-1} + \\frac{C}{(x-1)^2}" },
      { number: 2, description: "Solve: x²+1 = A(x-1)² + Bx(x-1) + Cx", math: "A = 1, \\quad B = 0, \\quad C = 2" },
      { number: 3, description: "Rewrite and integrate each term", math: "\\int \\frac{1}{x} \\, dx + \\int \\frac{2}{(x-1)^2} \\, dx" },
      { number: 4, description: "Evaluate", math: "\\ln|x| - \\frac{2}{x-1} + C" },
    ],
    hints: ["For repeated factors, include terms for each power"],
    timeEstimate: 180,
  },
  {
    question: "\\int \\frac{2x^2 - x + 1}{(x-1)(x^2 + 1)} \\, dx",
    answer: "\\ln|x-1| + \\frac{1}{2}\\ln(x^2+1) + C",
    steps: [
      { number: 1, description: "Set up partial fractions", math: "\\frac{2x^2-x+1}{(x-1)(x^2+1)} = \\frac{A}{x-1} + \\frac{Bx+C}{x^2+1}" },
      { number: 2, description: "Solve for A, B, C", math: "A = 1, \\quad B = 1, \\quad C = 0" },
      { number: 3, description: "Split into two integrals", math: "\\int \\frac{1}{x-1} \\, dx + \\int \\frac{x}{x^2+1} \\, dx" },
      { number: 4, description: "Evaluate each", math: "\\ln|x-1| + \\frac{1}{2}\\ln(x^2+1) + C" },
    ],
    hints: ["For irreducible quadratics, the numerator is linear: Bx+C"],
    timeEstimate: 180,
  },
];

const partialHard: ProblemTemplate[] = [
  {
    question: "\\int \\frac{x^3 + 2x^2 + 3x + 1}{x^2(x^2 + 1)} \\, dx",
    answer: "\\ln|x| - \\frac{1}{x} + \\frac{1}{2}\\ln(x^2+1) + C",
    steps: [
      { number: 1, description: "Set up partial fractions", math: "\\frac{x^3+2x^2+3x+1}{x^2(x^2+1)} = \\frac{A}{x} + \\frac{B}{x^2} + \\frac{Cx+D}{x^2+1}" },
      { number: 2, description: "Solve for coefficients", math: "A = 1, \\quad B = -1, \\quad C = 0, \\quad D = 2" },
      { number: 3, description: "Split and integrate each term", math: "\\int \\frac{1}{x} \\, dx - \\int \\frac{1}{x^2} \\, dx + \\int \\frac{2}{x^2+1} \\, dx" },
      { number: 4, description: "Evaluate", math: "\\ln|x| + \\frac{1}{x} + 2\\arctan x + C" },
    ],
    hints: ["Include terms for all powers of repeated factors"],
    timeEstimate: 240,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// IMPROPER INTEGRALS
// ─────────────────────────────────────────────────────────────────────────────

const improperEasy: ProblemTemplate[] = [
  {
    question: "\\int_1^{\\infty} \\frac{1}{x^2} \\, dx",
    answer: "1",
    steps: [
      { number: 1, description: "Rewrite as a limit", math: "\\lim_{b \\to \\infty} \\int_1^b \\frac{1}{x^2} \\, dx" },
      { number: 2, description: "Evaluate the integral", math: "\\lim_{b \\to \\infty} \\left[-\\frac{1}{x}\\right]_1^b = \\lim_{b \\to \\infty} \\left(-\\frac{1}{b} + 1\\right)" },
      { number: 3, description: "Take the limit", math: "0 + 1 = 1" },
    ],
    hints: ["Rewrite as a limit: lim(b→∞) ∫₁ᵇ"],
    timeEstimate: 90,
  },
  {
    question: "\\int_0^{1} \\frac{1}{\\sqrt{x}} \\, dx",
    answer: "2",
    steps: [
      { number: 1, description: "This is improper at x = 0. Rewrite as a limit", math: "\\lim_{a \\to 0^+} \\int_a^1 x^{-1/2} \\, dx" },
      { number: 2, description: "Evaluate", math: "\\lim_{a \\to 0^+} \\left[2\\sqrt{x}\\right]_a^1 = \\lim_{a \\to 0^+} (2 - 2\\sqrt{a})" },
      { number: 3, description: "Take the limit", math: "2 - 0 = 2" },
    ],
    hints: ["The integrand is undefined at x=0, so use a limit"],
    timeEstimate: 90,
  },
];

const improperMedium: ProblemTemplate[] = [
  {
    question: "\\int_0^{\\infty} e^{-x} \\, dx",
    answer: "1",
    steps: [
      { number: 1, description: "Rewrite as a limit", math: "\\lim_{b \\to \\infty} \\int_0^b e^{-x} \\, dx" },
      { number: 2, description: "Evaluate", math: "\\lim_{b \\to \\infty} \\left[-e^{-x}\\right]_0^b = \\lim_{b \\to \\infty} (-e^{-b} + 1)" },
      { number: 3, description: "Take the limit: e^{-b} → 0 as b → ∞", math: "0 + 1 = 1" },
    ],
    hints: ["Evaluate as lim(b→∞) and note that e^{-b} → 0"],
    timeEstimate: 90,
  },
  {
    question: "\\int_{-\\infty}^{\\infty} \\frac{1}{1+x^2} \\, dx",
    answer: "\\pi",
    steps: [
      { number: 1, description: "Split at 0 and write as two limits", math: "\\int_{-\\infty}^0 + \\int_0^{\\infty} = \\lim_{a\\to-\\infty}\\int_a^0 + \\lim_{b\\to\\infty}\\int_0^b" },
      { number: 2, description: "The antiderivative is arctan x", math: "\\left[\\arctan x\\right]_{-\\infty}^{\\infty}" },
      { number: 3, description: "Evaluate the limits", math: "\\lim_{x\\to\\infty}\\arctan x - \\lim_{x\\to-\\infty}\\arctan x = \\frac{\\pi}{2} - \\left(-\\frac{\\pi}{2}\\right) = \\pi" },
    ],
    hints: ["The antiderivative of 1/(1+x²) is arctan x"],
    timeEstimate: 120,
  },
];

const improperHard: ProblemTemplate[] = [
  {
    question: "\\int_1^{\\infty} \\frac{\\ln x}{x^2} \\, dx",
    answer: "1",
    steps: [
      { number: 1, description: "Rewrite as limit", math: "\\lim_{b \\to \\infty} \\int_1^b \\frac{\\ln x}{x^2} \\, dx" },
      { number: 2, description: "Use integration by parts: u = ln x, dv = dx/x²", math: "u = \\ln x, \\quad dv = \\frac{dx}{x^2}" },
      { number: 3, description: "du = dx/x, v = -1/x", math: "\\left[-\\frac{\\ln x}{x}\\right]_1^b + \\int_1^b \\frac{1}{x^2} \\, dx" },
      { number: 4, description: "Evaluate both parts and take the limit", math: "\\lim_{b\\to\\infty}\\left(-\\frac{\\ln b}{b} + 0\\right) + \\left[-\\frac{1}{x}\\right]_1^b = 0 + 1 = 1" },
    ],
    hints: ["Use integration by parts with u = ln x"],
    timeEstimate: 180,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROBLEM BANK
// ─────────────────────────────────────────────────────────────────────────────

const problemBank: Record<IntegrationTechnique, Record<Difficulty, ProblemTemplate[]>> = {
  'basic': {
    easy: basicEasy,
    medium: basicMedium,
    hard: basicHard,
  },
  'u-substitution': {
    easy: uSubEasy,
    medium: uSubMedium,
    hard: uSubHard,
  },
  'parts': {
    easy: partsEasy,
    medium: partsMedium,
    hard: partsHard,
  },
  'trigonometric': {
    easy: trigEasy,
    medium: trigMedium,
    hard: trigHard,
  },
  'trig-substitution': {
    easy: trigSubEasy,
    medium: trigSubMedium,
    hard: trigSubHard,
  },
  'partial-fractions': {
    easy: partialEasy,
    medium: partialMedium,
    hard: partialHard,
  },
  'improper': {
    easy: improperEasy,
    medium: improperMedium,
    hard: improperHard,
  },
  'mixed': {
    easy: [],
    medium: [],
    hard: [],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Simple hash function to deterministically select a problem from the bank.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function getTechniquesForMixed(_difficulty: Difficulty): IntegrationTechnique[] {
  return ['basic', 'u-substitution', 'parts', 'trigonometric', 'trig-substitution', 'partial-fractions', 'improper'];
}
// ────────────────────────────────────────────────────────────────────────────────
// DIFFERENTIATION PROBLEM BANKS
// ────────────────────────────────────────────────────────────────────────────────


const diffBasicEasy: ProblemTemplate[] = [
  {
    question: "\\frac{d}{dx}(x^5)",
    answer: "5x^4",
    steps: [
      { number: 1, description: "Apply the power rule: bring down the exponent and subtract 1", math: "\\frac{d}{dx}(x^n) = nx^{n-1}" },
      { number: 2, description: "Here n = 5, so we bring down 5 and reduce the exponent by 1", math: "\\frac{d}{dx}(x^5) = 5x^{5-1} = 5x^4" }
    ],
    hints: ["Use the power rule: bring the exponent down as a coefficient, then subtract 1 from the exponent"],
    timeEstimate: 20,
  },
  {
    question: "\\frac{d}{dx}(3x^4)",
    answer: "12x^3",
    steps: [
      { number: 1, description: "Apply the constant multiple rule", math: "\\frac{d}{dx}[c \\cdot f(x)] = c \\cdot f'(x)" },
      { number: 2, description: "Factor out the constant 3, then differentiate x⁴", math: "3 \\cdot \\frac{d}{dx}(x^4) = 3 \\cdot 4x^3 = 12x^3" }
    ],
    hints: ["Factor out the constant, then apply the power rule to x⁴"],
    timeEstimate: 25,
  },
  {
    question: "\\frac{d}{dx}(7x + 2)",
    answer: "7",
    steps: [
      { number: 1, description: "Differentiate term by term using the sum rule", math: "\\frac{d}{dx}(7x) + \\frac{d}{dx}(2)" },
      { number: 2, description: "The derivative of 7x is 7, and the derivative of a constant is 0", math: "7 + 0 = 7" }
    ],
    hints: ["Differentiate each term separately. Remember: the derivative of a constant is 0."],
    timeEstimate: 20,
  },
  {
    question: "\\frac{d}{dx}(x^{-3})",
    answer: "-3x^{-4}",
    steps: [
      { number: 1, description: "Apply the power rule with n = -3", math: "\\frac{d}{dx}(x^n) = nx^{n-1}" },
      { number: 2, description: "Bring down -3 and subtract 1 from the exponent", math: "-3 \\cdot x^{-3-1} = -3x^{-4}" }
    ],
    hints: ["The power rule works for negative exponents too: bring down -3, then subtract 1 from -3."],
    timeEstimate: 30,
  },
  {
    question: "\\frac{d}{dx}(\\sqrt{x})",
    answer: "\\frac{1}{2\\sqrt{x}}",
    steps: [
      { number: 1, description: "Rewrite the square root as a power", math: "\\sqrt{x} = x^{1/2}" },
      { number: 2, description: "Apply the power rule with n = 1/2", math: "\\frac{d}{dx}(x^{1/2}) = \\frac{1}{2}x^{1/2 - 1} = \\frac{1}{2}x^{-1/2}" },
      { number: 3, description: "Simplify the negative exponent back to radical form", math: "\\frac{1}{2}x^{-1/2} = \\frac{1}{2\\sqrt{x}}" }
    ],
    hints: ["Rewrite √x as x^(1/2), then apply the power rule."],
    timeEstimate: 35,
  },
  {
    question: "\\frac{d}{dx}\\left(\\frac{2}{x^3}\\right)",
    answer: "-\\frac{6}{x^4}",
    steps: [
      { number: 1, description: "Rewrite using negative exponent", math: "\\frac{2}{x^3} = 2x^{-3}" },
      { number: 2, description: "Apply constant multiple and power rule", math: "2 \\cdot (-3)x^{-3-1} = -6x^{-4}" },
      { number: 3, description: "Rewrite with positive exponent in denominator", math: "-\\frac{6}{x^4}" }
    ],
    hints: ["Rewrite as 2x⁻³ first, then apply the power rule."],
    timeEstimate: 35,
  },
];

const diffBasicMedium: ProblemTemplate[] = [
  {
    question: "\\frac{d}{dx}(x^3 - 4x^2 + 7x - 2)",
    answer: "3x^2 - 8x + 7",
    steps: [
      { number: 1, description: "Differentiate each term using the sum/difference rule", math: "\\frac{d}{dx}(x^3) - \\frac{d}{dx}(4x^2) + \\frac{d}{dx}(7x) - \\frac{d}{dx}(2)" },
      { number: 2, description: "Apply the power rule to each term", math: "3x^2 - 8x + 7 - 0 = 3x^2 - 8x + 7" }
    ],
    hints: ["Differentiate each term separately using the power rule."],
    timeEstimate: 40,
  },
  {
    question: "\\frac{d}{dx}\\left(\\frac{3}{\\sqrt{x}}\\right)",
    answer: "-\\frac{3}{2x^{3/2}}",
    steps: [
      { number: 1, description: "Rewrite using exponent notation", math: "\\frac{3}{\\sqrt{x}} = 3x^{-1/2}" },
      { number: 2, description: "Apply the power rule", math: "3 \\cdot (-\\frac{1}{2})x^{-1/2 - 1} = -\\frac{3}{2}x^{-3/2}" },
      { number: 3, description: "Rewrite in radical form", math: "-\\frac{3}{2x^{3/2}}" }
    ],
    hints: ["Rewrite as 3x^(-1/2), then apply the power rule."],
    timeEstimate: 50,
  },
  {
    question: "\\frac{d}{dx}\\left(\\sqrt[3]{x^2}\\right)",
    answer: "\\frac{2}{3}x^{-1/3}",
    steps: [
      { number: 1, description: "Rewrite using rational exponent", math: "\\sqrt[3]{x^2} = x^{2/3}" },
      { number: 2, description: "Apply the power rule", math: "\\frac{2}{3}x^{2/3 - 1} = \\frac{2}{3}x^{-1/3}" }
    ],
    hints: ["Cube root is the same as exponent 1/3, so ∛(x²) = x^(2/3)."],
    timeEstimate: 45,
  },
  {
    question: "\\frac{d}{dx}\\left(\\frac{x^4 + 2x}{x}\\right)",
    answer: "2x + \\frac{2}{x^2}",
    steps: [
      { number: 1, description: "Simplify by dividing each term by x", math: "\\frac{x^4}{x} + \\frac{2x}{x} = x^3 + 2" },
      { number: 2, description: "Differentiate the simplified expression", math: "\\frac{d}{dx}(x^3 + 2) = 3x^2" }
    ],
    hints: ["Simplify the expression first by dividing each term by x."],
    timeEstimate: 45,
  },
  {
    question: "\\frac{d}{dx}(e^{x})",
    answer: "e^{x}",
    steps: [
      { number: 1, description: "Recall the special derivative of eˣ", math: "\\frac{d}{dx}(e^x) = e^x" }
    ],
    hints: ["The exponential function eˣ is its own derivative."],
    timeEstimate: 15,
  },
  {
    question: "\\frac{d}{dx}(\\ln x)",
    answer: "\\frac{1}{x}",
    steps: [
      { number: 1, description: "Recall the derivative of the natural logarithm", math: "\\frac{d}{dx}(\\ln x) = \\frac{1}{x}" }
    ],
    hints: ["The derivative of ln(x) is 1/x."],
    timeEstimate: 15,
  },
];

const diffBasicHard: ProblemTemplate[] = [
  {
    question: "\\frac{d}{dx}\\left(\\frac{2x^3 - 5x + 1}{x^2}\\right)",
    answer: "2 + \\frac{5}{x^2} - \\frac{2}{x^3}",
    steps: [
      { number: 1, description: "Divide each term by x²", math: "\\frac{2x^3}{x^2} - \\frac{5x}{x^2} + \\frac{1}{x^2} = 2x - 5x^{-1} + x^{-2}" },
      { number: 2, description: "Differentiate term by term", math: "2 - (-5)x^{-2} + (-2)x^{-3} = 2 + 5x^{-2} - 2x^{-3}" },
      { number: 3, description: "Rewrite with positive exponents", math: "2 + \\frac{5}{x^2} - \\frac{2}{x^3}" }
    ],
    hints: ["Simplify by dividing each term by x² first, then differentiate."],
    timeEstimate: 60,
  },
  {
    question: "\\frac{d}{dx}\\left(x^2 \\cdot \\sqrt{x}\\right)",
    answer: "\\frac{5}{2}x^{3/2}",
    steps: [
      { number: 1, description: "Rewrite as a single power", math: "x^2 \\cdot x^{1/2} = x^{5/2}" },
      { number: 2, description: "Apply the power rule", math: "\\frac{5}{2}x^{5/2 - 1} = \\frac{5}{2}x^{3/2}" }
    ],
    hints: ["Combine the exponents first: x² · x^(1/2) = x^(5/2)."],
    timeEstimate: 50,
  },
  {
    question: "\\frac{d}{dx}\\left(\\frac{1}{\\sqrt[3]{x}} + 3x^{-2}\\right)",
    answer: "-\\frac{1}{3}x^{-4/3} - 6x^{-3}",
    steps: [
      { number: 1, description: "Rewrite using exponents", math: "x^{-1/3} + 3x^{-2}" },
      { number: 2, description: "Differentiate term by term", math: "-\\frac{1}{3}x^{-4/3} + 3(-2)x^{-3} = -\\frac{1}{3}x^{-4/3} - 6x^{-3}" }
    ],
    hints: ["Rewrite cube root as x^(-1/3), then apply the power rule to each term."],
    timeEstimate: 60,
  },
  {
    question: "\\frac{d}{dx}(a^x)",
    answer: "a^x \\ln a",
    steps: [
      { number: 1, description: "Recall the general exponential derivative formula", math: "\\frac{d}{dx}(a^x) = a^x \\ln a" }
    ],
    hints: ["For any base a > 0, the derivative of aˣ is aˣ · ln(a)."],
    timeEstimate: 20,
  },
  {
    question: "\\frac{d}{dx}(\\log_a x)",
    answer: "\\frac{1}{x \\ln a}",
    steps: [
      { number: 1, description: "Use the change of base formula or recall the general logarithm derivative", math: "\\frac{d}{dx}(\\log_a x) = \\frac{1}{x \\ln a}" }
    ],
    hints: ["The derivative of logₐ(x) is 1/(x · ln a)."],
    timeEstimate: 20,
  },
];

const diffProductEasy: ProblemTemplate[] = [
  {
    question: "\\frac{d}{dx}(x^2 \\cdot e^x)",
    answer: "e^x(x^2 + 2x)",
    steps: [
      { number: 1, description: "Identify u and v for the product rule", math: "u = x^2, \\quad v = e^x" },
      { number: 2, description: "Find the derivatives of u and v", math: "u' = 2x, \\quad v' = e^x" },
      { number: 3, description: "Apply the product rule: (uv)' = u'v + uv'", math: "(2x)(e^x) + (x^2)(e^x) = e^x(2x + x^2)" }
    ],
    hints: ["Use the product rule: (fg)' = f'g + fg'. Let f = x² and g = eˣ."],
    timeEstimate: 50,
  },
  {
    question: "\\frac{d}{dx}(x \\cdot \\ln x)",
    answer: "\\ln x + 1",
    steps: [
      { number: 1, description: "Identify u and v", math: "u = x, \\quad v = \\ln x" },
      { number: 2, description: "Find derivatives", math: "u' = 1, \\quad v' = \\frac{1}{x}" },
      { number: 3, description: "Apply the product rule", math: "(1)(\\ln x) + (x)(\\frac{1}{x}) = \\ln x + 1" }
    ],
    hints: ["Product rule: (x · ln x)' = (1)(ln x) + x(1/x)."],
    timeEstimate: 45,
  },
  {
    question: "\\frac{d}{dx}(3x \\cdot \\sin x)",
    answer: "3\\sin x + 3x\\cos x",
    steps: [
      { number: 1, description: "Identify u and v", math: "u = 3x, \\quad v = \\sin x" },
      { number: 2, description: "Find derivatives", math: "u' = 3, \\quad v' = \\cos x" },
      { number: 3, description: "Apply the product rule", math: "3\\sin x + 3x\\cos x" }
    ],
    hints: ["Let u = 3x and v = sin(x). Then u' = 3 and v' = cos(x)."],
    timeEstimate: 45,
  },
  {
    question: "\\frac{d}{dx}(x^3 \\cdot \\cos x)",
    answer: "3x^2\\cos x - x^3\\sin x",
    steps: [
      { number: 1, description: "Identify u and v", math: "u = x^3, \\quad v = \\cos x" },
      { number: 2, description: "Find derivatives", math: "u' = 3x^2, \\quad v' = -\\sin x" },
      { number: 3, description: "Apply the product rule", math: "3x^2\\cos x + x^3(-\\sin x) = 3x^2\\cos x - x^3\\sin x" }
    ],
    hints: ["Remember: the derivative of cos(x) is -sin(x)."],
    timeEstimate: 50,
  },
];

const diffProductMedium: ProblemTemplate[] = [
  {
    question: "\\frac{d}{dx}(x^2 \\cdot \\ln x \\cdot e^x)",
    answer: "2x \\ln x \\cdot e^x + x \\cdot e^x + x^2 \\ln x \\cdot e^x",
    steps: [
      { number: 1, description: "Group as (x² · ln x) · eˣ and apply product rule to the outer product", math: "\\frac{d}{dx}[(x^2 \\ln x) \\cdot e^x] = \\frac{d}{dx}(x^2 \\ln x) \\cdot e^x + (x^2 \\ln x) \\cdot e^x" },
      { number: 2, description: "Find d/dx(x² · ln x) using product rule again", math: "\\frac{d}{dx}(x^2 \\ln x) = 2x \\ln x + x^2 \\cdot \\frac{1}{x} = 2x \\ln x + x" },
      { number: 3, description: "Combine all terms", math: "(2x \\ln x + x)e^x + x^2 \\ln x \\cdot e^x" }
    ],
    hints: ["Group two factors together first, then apply product rule twice."],
    timeEstimate: 70,
  },
  {
    question: "\\frac{d}{dx}(e^x \\cdot \\sin x)",
    answer: "e^x(\\sin x + \\cos x)",
    steps: [
      { number: 1, description: "Identify u and v", math: "u = e^x, \\quad v = \\sin x" },
      { number: 2, description: "Find derivatives", math: "u' = e^x, \\quad v' = \\cos x" },
      { number: 3, description: "Apply the product rule and factor", math: "e^x\\sin x + e^x\\cos x = e^x(\\sin x + \\cos x)" }
    ],
    hints: ["Factor out eˣ after applying the product rule."],
    timeEstimate: 50,
  },
  {
    question: "\\frac{d}{dx}(x^n \\cdot \\ln x)",
    answer: "x^{n-1}(n \\ln x + 1)",
    steps: [
      { number: 1, description: "Identify u and v", math: "u = x^n, \\quad v = \\ln x" },
      { number: 2, description: "Find derivatives", math: "u' = nx^{n-1}, \\quad v' = \\frac{1}{x}" },
      { number: 3, description: "Apply product rule and simplify", math: "nx^{n-1}\\ln x + x^n \\cdot \\frac{1}{x} = nx^{n-1}\\ln x + x^{n-1} = x^{n-1}(n\\ln x + 1)" }
    ],
    hints: ["Factor out x^(n-1) from both terms."],
    timeEstimate: 60,
  },
  {
    question: "\\frac{d}{dx}[(x^2 + 1)(x^3 - 2x)]",
    answer: "5x^4 - 3x^2 - 2",
    steps: [
      { number: 1, description: "Identify u and v", math: "u = x^2 + 1, \\quad v = x^3 - 2x" },
      { number: 2, description: "Find derivatives", math: "u' = 2x, \\quad v' = 3x^2 - 2" },
      { number: 3, description: "Apply product rule", math: "2x(x^3 - 2x) + (x^2 + 1)(3x^2 - 2)" },
      { number: 4, description: "Expand and combine like terms", math: "2x^4 - 4x^2 + 3x^4 - 2x^2 + 3x^2 - 2 = 5x^4 - 3x^2 - 2" }
    ],
    hints: ["After applying the product rule, carefully expand and combine like terms."],
    timeEstimate: 70,
  },
];

const diffProductHard: ProblemTemplate[] = [
  {
    question: "\\frac{d}{dx}[(x^2 + 1)(x + 2)(3x - 1)]",
    answer: "12x^3 + 15x^2 - 2",
    steps: [
      { number: 1, description: "Group (x² + 1)(x + 2) and apply product rule with (3x - 1)", math: "\\frac{d}{dx}[(x^2+1)(x+2)] \\cdot (3x-1) + (x^2+1)(x+2) \\cdot 3" },
      { number: 2, description: "Find d/dx[(x²+1)(x+2)] using product rule", math: "2x(x+2) + (x^2+1)(1) = 3x^2 + 4x + 1" },
      { number: 3, description: "Substitute back and expand", math: "(3x^2 + 4x + 1)(3x - 1) + 3(x^2+1)(x+2)" },
      { number: 4, description: "Expand and simplify", math: "9x^3 - 3x^2 + 12x^2 - 4x + 3x - 1 + 3x^3 + 6x^2 + 3x + 6 = 12x^3 + 15x^2 + 2x + 5" }
    ],
    hints: ["Group two factors together, then apply product rule step by step."],
    timeEstimate: 90,
  },
  {
    question: "\\frac{d}{dx}(x \\cdot e^x \\cdot \\sin x)",
    answer: "e^x(\\sin x + x\\sin x + x\\cos x)",
    steps: [
      { number: 1, description: "Group x·eˣ and apply product rule with sin x", math: "\\frac{d}{dx}(x e^x) \\cdot \\sin x + x e^x \\cdot \\cos x" },
      { number: 2, description: "Find d/dx(x·eˣ) using product rule", math: "e^x + x e^x = e^x(1 + x)" },
      { number: 3, description: "Substitute and factor out eˣ", math: "e^x(1+x)\\sin x + x e^x \\cos x = e^x[(1+x)\\sin x + x\\cos x]" }
    ],
    hints: ["Group x·eˣ first, find its derivative, then apply product rule again."],
    timeEstimate: 80,
  },
];

const diffQuotientEasy: ProblemTemplate[] = [
  {
    question: "\\frac{d}{dx}\\left(\\frac{x^2}{x+1}\\right)",
    answer: "\\frac{x^2 + 2x}{(x+1)^2}",
    steps: [
      { number: 1, description: "Identify u and v for the quotient rule", math: "u = x^2, \\quad v = x + 1" },
      { number: 2, description: "Find derivatives", math: "u' = 2x, \\quad v' = 1" },
      { number: 3, description: "Apply quotient rule: (u/v)' = (u'v - uv')/v²", math: "\\frac{2x(x+1) - x^2(1)}{(x+1)^2} = \\frac{2x^2 + 2x - x^2}{(x+1)^2} = \\frac{x^2 + 2x}{(x+1)^2}" }
    ],
    hints: ["Quotient rule: (f/g)' = (f'g - fg')/g². Here f = x², g = x+1."],
    timeEstimate: 55,
  },
  {
    question: "\\frac{d}{dx}\\left(\\frac{e^x}{x}\\right)",
    answer: "\\frac{e^x(x - 1)}{x^2}",
    steps: [
      { number: 1, description: "Identify u and v", math: "u = e^x, \\quad v = x" },
      { number: 2, description: "Find derivatives", math: "u' = e^x, \\quad v' = 1" },
      { number: 3, description: "Apply quotient rule and factor", math: "\\frac{e^x \\cdot x - e^x \\cdot 1}{x^2} = \\frac{e^x(x - 1)}{x^2}" }
    ],
    hints: ["Factor out eˣ from the numerator after applying the quotient rule."],
    timeEstimate: 50,
  },
  {
    question: "\\frac{d}{dx}\\left(\\frac{\\sin x}{x^2}\\right)",
    answer: "\\frac{x\\cos x - 2\\sin x}{x^3}",
    steps: [
      { number: 1, description: "Identify u and v", math: "u = \\sin x, \\quad v = x^2" },
      { number: 2, description: "Find derivatives", math: "u' = \\cos x, \\quad v' = 2x" },
      { number: 3, description: "Apply quotient rule and simplify", math: "\\frac{\\cos x \\cdot x^2 - \\sin x \\cdot 2x}{x^4} = \\frac{x(x\\cos x - 2\\sin x)}{x^4} = \\frac{x\\cos x - 2\\sin x}{x^3}" }
    ],
    hints: ["Factor out x from the numerator and cancel with denominator."],
    timeEstimate: 60,
  },
  {
    question: "\\frac{d}{dx}\\left(\\frac{1}{x^2 + 1}\\right)",
    answer: "-\\frac{2x}{(x^2 + 1)^2}",
    steps: [
      { number: 1, description: "Rewrite as a quotient", math: "\\frac{d}{dx}\\left(\\frac{1}{x^2 + 1}\\right)" },
      { number: 2, description: "Identify u = 1, v = x² + 1", math: "u' = 0, \\quad v' = 2x" },
      { number: 3, description: "Apply quotient rule", math: "\\frac{0(x^2+1) - 1(2x)}{(x^2+1)^2} = \\frac{-2x}{(x^2+1)^2}" }
    ],
    hints: ["u = 1, so u' = 0. This simplifies the numerator significantly."],
    timeEstimate: 45,
  },
];

const diffQuotientMedium: ProblemTemplate[] = [
  {
    question: "\\frac{d}{dx}\\left(\\frac{x^2 + 1}{x^3 - x}\\right)",
    answer: "\\frac{-x^4 - 4x^2 + 1}{(x^3 - x)^2}",
    steps: [
      { number: 1, description: "Identify u and v", math: "u = x^2 + 1, \\quad v = x^3 - x" },
      { number: 2, description: "Find derivatives", math: "u' = 2x, \\quad v' = 3x^2 - 1" },
      { number: 3, description: "Apply quotient rule", math: "\\frac{2x(x^3-x) - (x^2+1)(3x^2-1)}{(x^3-x)^2}" },
      { number: 4, description: "Expand and simplify numerator", math: "2x^4 - 2x^2 - 3x^4 + x^2 - 3x^2 + 1 = -x^4 - 4x^2 + 1" }
    ],
    hints: ["Carefully expand the numerator: 2x(x³-x) = 2x⁴ - 2x², and (x²+1)(3x²-1) = 3x⁴ - x² + 3x² - 1."],
    timeEstimate: 80,
  },
  {
    question: "\\frac{d}{dx}\\left(\\frac{\\ln x}{x^2}\\right)",
    answer: "\\frac{1 - 2\\ln x}{x^3}",
    steps: [
      { number: 1, description: "Identify u and v", math: "u = \\ln x, \\quad v = x^2" },
      { number: 2, description: "Find derivatives", math: "u' = \\frac{1}{x}, \\quad v' = 2x" },
      { number: 3, description: "Apply quotient rule", math: "\\frac{\\frac{1}{x} \\cdot x^2 - \\ln x \\cdot 2x}{x^4} = \\frac{x - 2x\\ln x}{x^4}" },
      { number: 4, description: "Simplify by factoring x from numerator", math: "\\frac{x(1 - 2\\ln x)}{x^4} = \\frac{1 - 2\\ln x}{x^3}" }
    ],
    hints: ["After applying the quotient rule, factor x from the numerator and cancel."],
    timeEstimate: 70,
  },
  {
    question: "\\frac{d}{dx}\\left(\\frac{x}{e^x}\\right)",
    answer: "\\frac{1 - x}{e^x}",
    steps: [
      { number: 1, description: "Identify u and v", math: "u = x, \\quad v = e^x" },
      { number: 2, description: "Find derivatives", math: "u' = 1, \\quad v' = e^x" },
      { number: 3, description: "Apply quotient rule and simplify", math: "\\frac{1 \\cdot e^x - x \\cdot e^x}{e^{2x}} = \\frac{e^x(1 - x)}{e^{2x}} = \\frac{1 - x}{e^x}" }
    ],
    hints: ["Factor out eˣ from the numerator, then cancel with denominator."],
    timeEstimate: 55,
  },
];

const diffQuotientHard: ProblemTemplate[] = [
  {
    question: "\\frac{d}{dx}\\left(\\frac{x^2 \\sin x}{x + 1}\\right)",
    answer: "\\frac{(2x\\sin x + x^2\\cos x)(x+1) - x^2\\sin x}{(x+1)^2}",
    steps: [
      { number: 1, description: "First find derivative of numerator x² sin x using product rule", math: "\\frac{d}{dx}(x^2 \\sin x) = 2x\\sin x + x^2\\cos x" },
      { number: 2, description: "Apply quotient rule with u = x² sin x, v = x + 1", math: "\\frac{(2x\\sin x + x^2\\cos x)(x+1) - x^2\\sin x \\cdot 1}{(x+1)^2}" }
    ],
    hints: ["First use product rule on the numerator x²·sin(x), then apply quotient rule."],
    timeEstimate: 90,
  },
  {
    question: "\\frac{d}{dx}\\left(\\frac{e^x}{x^2 + 1}\\right)",
    answer: "\\frac{e^x(x^2 - 2x + 1)}{(x^2 + 1)^2}",
    steps: [
      { number: 1, description: "Identify u and v", math: "u = e^x, \\quad v = x^2 + 1" },
      { number: 2, description: "Find derivatives", math: "u' = e^x, \\quad v' = 2x" },
      { number: 3, description: "Apply quotient rule and factor out eˣ", math: "\\frac{e^x(x^2+1) - e^x(2x)}{(x^2+1)^2} = \\frac{e^x(x^2 - 2x + 1)}{(x^2+1)^2}" }
    ],
    hints: ["Factor out eˣ from the numerator after applying the quotient rule."],
    timeEstimate: 70,
  },
];

const diffChainEasy: ProblemTemplate[] = [
  {
    question: "\\frac{d}{dx}\\sin(3x)",
    answer: "3\\cos(3x)",
    steps: [
      { number: 1, description: "Identify outer and inner functions", math: "f(u) = \\sin u, \\quad u = 3x" },
      { number: 2, description: "Find derivatives", math: "f'(u) = \\cos u, \\quad u' = 3" },
      { number: 3, description: "Apply chain rule: f'(g(x))·g'(x)", math: "\\cos(3x) \\cdot 3 = 3\\cos(3x)" }
    ],
    hints: ["Chain rule: d/dx[sin(3x)] = cos(3x) · d/dx(3x) = cos(3x) · 3."],
    timeEstimate: 35,
  },
  {
    question: "\\frac{d}{dx}(x^2 + 1)^5",
    answer: "10x(x^2 + 1)^4",
    steps: [
      { number: 1, description: "Identify outer and inner functions", math: "f(u) = u^5, \\quad u = x^2 + 1" },
      { number: 2, description: "Find derivatives", math: "f'(u) = 5u^4, \\quad u' = 2x" },
      { number: 3, description: "Apply chain rule", math: "5(x^2+1)^4 \\cdot 2x = 10x(x^2+1)^4" }
    ],
    hints: ["Outer function: u⁵, inner function: x² + 1. Multiply by the derivative of the inner function."],
    timeEstimate: 40,
  },
  {
    question: "\\frac{d}{dx}e^{2x}",
    answer: "2e^{2x}",
    steps: [
      { number: 1, description: "Identify outer and inner functions", math: "f(u) = e^u, \\quad u = 2x" },
      { number: 2, description: "Find derivatives", math: "f'(u) = e^u, \\quad u' = 2" },
      { number: 3, description: "Apply chain rule", math: "e^{2x} \\cdot 2 = 2e^{2x}" }
    ],
    hints: ["The derivative of e^u is e^u · u'. Here u = 2x, so u' = 2."],
    timeEstimate: 30,
  },
  {
    question: "\\frac{d}{dx}\\ln(5x)",
    answer: "\\frac{1}{x}",
    steps: [
      { number: 1, description: "Identify outer and inner functions", math: "f(u) = \\ln u, \\quad u = 5x" },
      { number: 2, description: "Find derivatives", math: "f'(u) = \\frac{1}{u}, \\quad u' = 5" },
      { number: 3, description: "Apply chain rule", math: "\\frac{1}{5x} \\cdot 5 = \\frac{5}{5x} = \\frac{1}{x}" }
    ],
    hints: ["d/dx[ln(u)] = u'/u. Here u = 5x, so u' = 5."],
    timeEstimate: 35,
  },
  {
    question: "\\frac{d}{dx}\\cos(x^3)",
    answer: "-3x^2\\sin(x^3)",
    steps: [
      { number: 1, description: "Identify outer and inner functions", math: "f(u) = \\cos u, \\quad u = x^3" },
      { number: 2, description: "Find derivatives", math: "f'(u) = -\\sin u, \\quad u' = 3x^2" },
      { number: 3, description: "Apply chain rule", math: "-\\sin(x^3) \\cdot 3x^2 = -3x^2\\sin(x^3)" }
    ],
    hints: ["Remember: the derivative of cos(u) is -sin(u) · u'."],
    timeEstimate: 35,
  },
];

const diffChainMedium: ProblemTemplate[] = [
  {
    question: "\\frac{d}{dx}\\sin^2(x)",
    answer: "2\\sin(x)\\cos(x) = \\sin(2x)",
    steps: [
      { number: 1, description: "Rewrite as (sin x)² and identify functions", math: "f(u) = u^2, \\quad u = \\sin x" },
      { number: 2, description: "Find derivatives", math: "f'(u) = 2u, \\quad u' = \\cos x" },
      { number: 3, description: "Apply chain rule", math: "2\\sin x \\cdot \\cos x = \\sin(2x)" }
    ],
    hints: ["Rewrite sin²(x) as (sin x)². Outer: u², inner: sin x."],
    timeEstimate: 45,
  },
  {
    question: "\\frac{d}{dx}e^{x^2 + 3x}",
    answer: "(2x + 3)e^{x^2 + 3x}",
    steps: [
      { number: 1, description: "Identify outer and inner functions", math: "f(u) = e^u, \\quad u = x^2 + 3x" },
      { number: 2, description: "Find derivatives", math: "f'(u) = e^u, \\quad u' = 2x + 3" },
      { number: 3, description: "Apply chain rule", math: "e^{x^2+3x} \\cdot (2x+3) = (2x+3)e^{x^2+3x}" }
    ],
    hints: ["The derivative of e^u is e^u · u'. Don't forget to multiply by the derivative of the exponent."],
    timeEstimate: 45,
  },
  {
    question: "\\frac{d}{dx}\\ln(x^2 + 1)",
    answer: "\\frac{2x}{x^2 + 1}",
    steps: [
      { number: 1, description: "Identify outer and inner functions", math: "f(u) = \\ln u, \\quad u = x^2 + 1" },
      { number: 2, description: "Find derivatives", math: "f'(u) = \\frac{1}{u}, \\quad u' = 2x" },
      { number: 3, description: "Apply chain rule", math: "\\frac{1}{x^2+1} \\cdot 2x = \\frac{2x}{x^2+1}" }
    ],
    hints: ["d/dx[ln(u)] = u'/u. The derivative of x²+1 is 2x."],
    timeEstimate: 40,
  },
  {
    question: "\\frac{d}{dx}\\sqrt{x^2 + 3x - 1}",
    answer: "\\frac{2x + 3}{2\\sqrt{x^2 + 3x - 1}}",
    steps: [
      { number: 1, description: "Rewrite as (x² + 3x - 1)^(1/2)", math: "f(u) = u^{1/2}, \\quad u = x^2 + 3x - 1" },
      { number: 2, description: "Find derivatives", math: "f'(u) = \\frac{1}{2}u^{-1/2}, \\quad u' = 2x + 3" },
      { number: 3, description: "Apply chain rule", math: "\\frac{1}{2}(x^2+3x-1)^{-1/2} \\cdot (2x+3) = \\frac{2x+3}{2\\sqrt{x^2+3x-1}}" }
    ],
    hints: ["Rewrite square root as exponent 1/2, then apply chain rule."],
    timeEstimate: 55,
  },
];

const diffChainHard: ProblemTemplate[] = [
  {
    question: "\\frac{d}{dx}\\sin(e^{x^2})",
    answer: "2x e^{x^2} \\cos(e^{x^2})",
    steps: [
      { number: 1, description: "Identify nested functions", math: "f(u) = \\sin u, \\quad u = e^v, \\quad v = x^2" },
      { number: 2, description: "Work from outside in", math: "\\cos(e^{x^2}) \\cdot \\frac{d}{dx}(e^{x^2})" },
      { number: 3, description: "Find d/dx(e^(x²)) using chain rule again", math: "e^{x^2} \\cdot 2x" },
      { number: 4, description: "Combine", math: "\\cos(e^{x^2}) \\cdot e^{x^2} \\cdot 2x = 2xe^{x^2}\\cos(e^{x^2})" }
    ],
    hints: ["This is a chain rule within a chain rule. Work from the outermost function inward."],
    timeEstimate: 80,
  },
  {
    question: "\\frac{d}{dx}\\left(\\ln(\\sin x)\\right)^3",
    answer: "\\frac{3(\\ln(\\sin x))^2 \\cos x}{\\sin x}",
    steps: [
      { number: 1, description: "Identify layers: outer = u³, middle = ln(v), inner = sin(x)", math: "f(u) = u^3, \\quad u = \\ln v, \\quad v = \\sin x" },
      { number: 2, description: "Apply chain rule step by step", math: "3(\\ln(\\sin x))^2 \\cdot \\frac{1}{\\sin x} \\cdot \\cos x" },
      { number: 3, description: "Simplify", math: "\\frac{3(\\ln(\\sin x))^2 \\cos x}{\\sin x}" }
    ],
    hints: ["Three layers: cube → ln → sin. Apply chain rule from outside in."],
    timeEstimate: 85,
  },
  {
    question: "\\frac{d}{dx}e^{\\sin(x^2)}",
    answer: "2x \\cos(x^2) e^{\\sin(x^2)}",
    steps: [
      { number: 1, description: "Identify layers", math: "f(u) = e^u, \\quad u = \\sin v, \\quad v = x^2" },
      { number: 2, description: "Apply chain rule", math: "e^{\\sin(x^2)} \\cdot \\cos(x^2) \\cdot 2x = 2x\\cos(x^2)e^{\\sin(x^2)}" }
    ],
    hints: ["Three nested functions: e^u, sin(v), x². Multiply all derivatives together."],
    timeEstimate: 70,
  },
];

const diffImplicitEasy: ProblemTemplate[] = [
  {
    question: "\\text{Find } \\frac{dy}{dx} \\text{ if } x^2 + y^2 = 25",
    answer: "-\\frac{x}{y}",
    steps: [
      { number: 1, description: "Differentiate both sides with respect to x", math: "\\frac{d}{dx}(x^2) + \\frac{d}{dx}(y^2) = \\frac{d}{dx}(25)" },
      { number: 2, description: "Use chain rule for y² since y is a function of x", math: "2x + 2y\\frac{dy}{dx} = 0" },
      { number: 3, description: "Solve for dy/dx", math: "2y\\frac{dy}{dx} = -2x \\Rightarrow \\frac{dy}{dx} = -\\frac{x}{y}" }
    ],
    hints: ["Remember: d/dx(y²) = 2y · dy/dx by the chain rule."],
    timeEstimate: 50,
  },
  {
    question: "\\text{Find } \\frac{dy}{dx} \\text{ if } x^3 + y^3 = 8",
    answer: "-\\frac{x^2}{y^2}",
    steps: [
      { number: 1, description: "Differentiate both sides with respect to x", math: "3x^2 + 3y^2\\frac{dy}{dx} = 0" },
      { number: 2, description: "Solve for dy/dx", math: "3y^2\\frac{dy}{dx} = -3x^2 \\Rightarrow \\frac{dy}{dx} = -\\frac{x^2}{y^2}" }
    ],
    hints: ["d/dx(y³) = 3y² · dy/dx. Isolate dy/dx after differentiating."],
    timeEstimate: 45,
  },
  {
    question: "\\text{Find } \\frac{dy}{dx} \\text{ if } xy = 4",
    answer: "-\\frac{y}{x}",
    steps: [
      { number: 1, description: "Differentiate both sides (use product rule for xy)", math: "y + x\\frac{dy}{dx} = 0" },
      { number: 2, description: "Solve for dy/dx", math: "x\\frac{dy}{dx} = -y \\Rightarrow \\frac{dy}{dx} = -\\frac{y}{x}" }
    ],
    hints: ["Use the product rule on xy: (xy)' = y + x·y'."],
    timeEstimate: 40,
  },
  {
    question: "\\text{Find } \\frac{dy}{dx} \\text{ if } x^2 + xy + y^2 = 7",
    answer: "-\\frac{2x + y}{x + 2y}",
    steps: [
      { number: 1, description: "Differentiate term by term", math: "2x + y + x\\frac{dy}{dx} + 2y\\frac{dy}{dx} = 0" },
      { number: 2, description: "Group terms with dy/dx", math: "(x + 2y)\\frac{dy}{dx} = -(2x + y)" },
      { number: 3, description: "Solve for dy/dx", math: "\\frac{dy}{dx} = -\\frac{2x + y}{x + 2y}" }
    ],
    hints: ["Use product rule for the xy term. Group all dy/dx terms together."],
    timeEstimate: 60,
  },
];

const diffImplicitMedium: ProblemTemplate[] = [
  {
    question: "\\text{Find } \\frac{dy}{dx} \\text{ if } \\sin y + \\cos x = 1",
    answer: "\\frac{\\sin x}{\\cos y}",
    steps: [
      { number: 1, description: "Differentiate both sides with respect to x", math: "\\cos y \\cdot \\frac{dy}{dx} - \\sin x = 0" },
      { number: 2, description: "Solve for dy/dx", math: "\\cos y \\cdot \\frac{dy}{dx} = \\sin x \\Rightarrow \\frac{dy}{dx} = \\frac{\\sin x}{\\cos y}" }
    ],
    hints: ["d/dx(sin y) = cos(y) · dy/dx by chain rule."],
    timeEstimate: 50,
  },
  {
    question: "\\text{Find } \\frac{dy}{dx} \\text{ if } e^y = x + y",
    answer: "\\frac{1}{e^y - 1}",
    steps: [
      { number: 1, description: "Differentiate both sides", math: "e^y \\frac{dy}{dx} = 1 + \\frac{dy}{dx}" },
      { number: 2, description: "Collect dy/dx terms", math: "e^y\\frac{dy}{dx} - \\frac{dy}{dx} = 1" },
      { number: 3, description: "Factor and solve", math: "\\frac{dy}{dx}(e^y - 1) = 1 \\Rightarrow \\frac{dy}{dx} = \\frac{1}{e^y - 1}" }
    ],
    hints: ["d/dx(e^y) = e^y · dy/dx. Collect all dy/dx terms on one side."],
    timeEstimate: 55,
  },
  {
    question: "\\text{Find } \\frac{dy}{dx} \\text{ if } x^2 y + y^3 = x",
    answer: "\\frac{1 - 2xy}{x^2 + 3y^2}",
    steps: [
      { number: 1, description: "Differentiate term by term (use product rule for x²y)", math: "2xy + x^2\\frac{dy}{dx} + 3y^2\\frac{dy}{dx} = 1" },
      { number: 2, description: "Group dy/dx terms", math: "(x^2 + 3y^2)\\frac{dy}{dx} = 1 - 2xy" },
      { number: 3, description: "Solve for dy/dx", math: "\\frac{dy}{dx} = \\frac{1 - 2xy}{x^2 + 3y^2}" }
    ],
    hints: ["Use product rule on x²y: (x²y)' = 2xy + x²·y'."],
    timeEstimate: 65,
  },
];

const diffImplicitHard: ProblemTemplate[] = [
  {
    question: "\\text{Find } \\frac{dy}{dx} \\text{ if } \\sin(x + y) = y^2 \\cos x",
    answer: "\\frac{y^2 \\sin x + \\cos(x+y)}{2y\\cos x - \\cos(x+y)}",
    steps: [
      { number: 1, description: "Differentiate both sides", math: "\\cos(x+y)(1 + \\frac{dy}{dx}) = 2y\\frac{dy}{dx}\\cos x - y^2\\sin x" },
      { number: 2, description: "Expand and collect dy/dx terms", math: "\\cos(x+y) + \\cos(x+y)\\frac{dy}{dx} = 2y\\cos x\\frac{dy}{dx} - y^2\\sin x" },
      { number: 3, description: "Group terms", math: "\\cos(x+y)\\frac{dy}{dx} - 2y\\cos x\\frac{dy}{dx} = -y^2\\sin x - \\cos(x+y)" },
      { number: 4, description: "Factor and solve", math: "\\frac{dy}{dx}(\\cos(x+y) - 2y\\cos x) = -(y^2\\sin x + \\cos(x+y))" },
      { number: 5, description: "Final answer", math: "\\frac{dy}{dx} = \\frac{y^2\\sin x + \\cos(x+y)}{2y\\cos x - \\cos(x+y)}" }
    ],
    hints: ["Use product rule on the right side y²·cos(x), and chain rule on sin(x+y)."],
    timeEstimate: 100,
  },
  {
    question: "\\text{Find } \\frac{dy}{dx} \\text{ if } \\ln(x + y) = x^2 y",
    answer: "\\frac{2xy(x+y) - 1}{1 - x^2(x+y)}",
    steps: [
      { number: 1, description: "Differentiate both sides", math: "\\frac{1 + \\frac{dy}{dx}}{x+y} = 2xy + x^2\\frac{dy}{dx}" },
      { number: 2, description: "Multiply both sides by (x+y)", math: "1 + \\frac{dy}{dx} = 2xy(x+y) + x^2(x+y)\\frac{dy}{dx}" },
      { number: 3, description: "Collect dy/dx terms", math: "\\frac{dy}{dx} - x^2(x+y)\\frac{dy}{dx} = 2xy(x+y) - 1" },
      { number: 4, description: "Factor and solve", math: "\\frac{dy}{dx}[1 - x^2(x+y)] = 2xy(x+y) - 1" },
      { number: 5, description: "Final answer", math: "\\frac{dy}{dx} = \\frac{2xy(x+y) - 1}{1 - x^2(x+y)}" }
    ],
    hints: ["Multiply through by (x+y) to clear the fraction before collecting dy/dx."],
    timeEstimate: 100,
  },
];

const diffLogarithmicEasy: ProblemTemplate[] = [
  {
    question: "\\text{Find } \\frac{dy}{dx} \\text{ if } y = x^x",
    answer: "x^x(\\ln x + 1)",
    steps: [
      { number: 1, description: "Take the natural logarithm of both sides", math: "\\ln y = \\ln(x^x) = x\\ln x" },
      { number: 2, description: "Differentiate implicitly with respect to x (use product rule on the right)", math: "\\frac{1}{y}\\frac{dy}{dx} = \\ln x + x \\cdot \\frac{1}{x} = \\ln x + 1" },
      { number: 3, description: "Solve for dy/dx", math: "\\frac{dy}{dx} = y(\\ln x + 1) = x^x(\\ln x + 1)" }
    ],
    hints: ["Take ln of both sides, then differentiate implicitly. Remember d/dx[ln(y)] = y'/y."],
    timeEstimate: 55,
  },
  {
    question: "\\text{Find } \\frac{dy}{dx} \\text{ if } y = \\sqrt[3]{\\frac{x+1}{x-1}}",
    answer: "-\\frac{2}{3(x-1)^2}\\left(\\frac{x+1}{x-1}\\right)^{-2/3}",
    steps: [
      { number: 1, description: "Take ln of both sides and simplify using log laws", math: "\\ln y = \\frac{1}{3}[\\ln(x+1) - \\ln(x-1)]" },
      { number: 2, description: "Differentiate both sides", math: "\\frac{1}{y}\\frac{dy}{dx} = \\frac{1}{3}\\left[\\frac{1}{x+1} - \\frac{1}{x-1}\\right]" },
      { number: 3, description: "Simplify the bracket", math: "\\frac{1}{x+1} - \\frac{1}{x-1} = \\frac{(x-1) - (x+1)}{(x+1)(x-1)} = \\frac{-2}{x^2 - 1}" },
      { number: 4, description: "Solve for dy/dx", math: "\\frac{dy}{dx} = y \\cdot \\frac{1}{3} \\cdot \\frac{-2}{x^2-1} = -\\frac{2y}{3(x^2-1)}" }
    ],
    hints: ["Use log laws to simplify ln(y) before differentiating."],
    timeEstimate: 70,
  },
  {
    question: "\\text{Find } \\frac{dy}{dx} \\text{ if } y = (x^2 + 1)^{\\sin x}",
    answer: "(x^2+1)^{\\sin x}\\left[\\cos x \\ln(x^2+1) + \\frac{2x\\sin x}{x^2+1}\\right]",
    steps: [
      { number: 1, description: "Take ln of both sides", math: "\\ln y = \\sin x \\cdot \\ln(x^2 + 1)" },
      { number: 2, description: "Differentiate using product rule on the right", math: "\\frac{1}{y}\\frac{dy}{dx} = \\cos x \\cdot \\ln(x^2+1) + \\sin x \\cdot \\frac{2x}{x^2+1}" },
      { number: 3, description: "Solve for dy/dx", math: "\\frac{dy}{dx} = y\\left[\\cos x \\ln(x^2+1) + \\frac{2x\\sin x}{x^2+1}\\right]" }
    ],
    hints: ["Take ln of both sides, use product rule when differentiating the right side."],
    timeEstimate: 75,
  },
];

const diffLogarithmicMedium: ProblemTemplate[] = [
  {
    question: "\\text{Find } \\frac{dy}{dx} \\text{ if } y = x^{x^2}",
    answer: "x^{x^2} \\cdot x(2\\ln x + 1)",
    steps: [
      { number: 1, description: "Take ln of both sides", math: "\\ln y = x^2 \\ln x" },
      { number: 2, description: "Differentiate using product rule", math: "\\frac{1}{y}\\frac{dy}{dx} = 2x\\ln x + x^2 \\cdot \\frac{1}{x} = 2x\\ln x + x" },
      { number: 3, description: "Factor and solve", math: "\\frac{dy}{dx} = y \\cdot x(2\\ln x + 1) = x^{x^2} \\cdot x(2\\ln x + 1)" }
    ],
    hints: ["After taking ln, use product rule on x²·ln(x)."],
    timeEstimate: 65,
  },
  {
    question: "\\text{Find } \\frac{dy}{dx} \\text{ if } y = \\frac{x^{3/4}\\sqrt{x^2+1}}{(3x+2)^5}",
    answer: "y\\left[\\frac{3}{4x} + \\frac{x}{x^2+1} - \\frac{15}{3x+2}\\right]",
    steps: [
      { number: 1, description: "Take ln and simplify using log laws", math: "\\ln y = \\frac{3}{4}\\ln x + \\frac{1}{2}\\ln(x^2+1) - 5\\ln(3x+2)" },
      { number: 2, description: "Differentiate term by term", math: "\\frac{1}{y}\\frac{dy}{dx} = \\frac{3}{4x} + \\frac{x}{x^2+1} - \\frac{15}{3x+2}" },
      { number: 3, description: "Solve for dy/dx", math: "\\frac{dy}{dx} = y\\left[\\frac{3}{4x} + \\frac{x}{x^2+1} - \\frac{15}{3x+2}\\right]" }
    ],
    hints: ["Use log laws to break the product/quotient into a sum of simpler logs."],
    timeEstimate: 80,
  },
];

const diffLogarithmicHard: ProblemTemplate[] = [
  {
    question: "\\text{Find } \\frac{dy}{dx} \\text{ if } y = (\\sin x)^{\\cos x}",
    answer: "(\\sin x)^{\\cos x}\\left[-\\sin x \\ln(\\sin x) + \\frac{\\cos^2 x}{\\sin x}\\right]",
    steps: [
      { number: 1, description: "Take ln of both sides", math: "\\ln y = \\cos x \\cdot \\ln(\\sin x)" },
      { number: 2, description: "Differentiate using product rule", math: "\\frac{1}{y}\\frac{dy}{dx} = -\\sin x \\ln(\\sin x) + \\cos x \\cdot \\frac{\\cos x}{\\sin x}" },
      { number: 3, description: "Simplify", math: "\\frac{dy}{dx} = y\\left[-\\sin x \\ln(\\sin x) + \\frac{\\cos^2 x}{\\sin x}\\right]" }
    ],
    hints: ["The derivative of cos(x) is -sin(x), and the derivative of ln(sin x) is cos(x)/sin(x)."],
    timeEstimate: 85,
  },
  {
    question: "\\text{Find } \\frac{dy}{dx} \\text{ if } y = x^{e^x}",
    answer: "x^{e^x} \\cdot e^x \\left(\\ln x + \\frac{1}{x}\\right)",
    steps: [
      { number: 1, description: "Take ln of both sides", math: "\\ln y = e^x \\ln x" },
      { number: 2, description: "Differentiate using product rule", math: "\\frac{1}{y}\\frac{dy}{dx} = e^x\\ln x + e^x \\cdot \\frac{1}{x} = e^x\\left(\\ln x + \\frac{1}{x}\\right)" },
      { number: 3, description: "Solve for dy/dx", math: "\\frac{dy}{dx} = x^{e^x} \\cdot e^x\\left(\\ln x + \\frac{1}{x}\\right)" }
    ],
    hints: ["d/dx(e^x) = e^x. Use product rule on e^x · ln(x)."],
    timeEstimate: 75,
  },
];

const diffTrigEasy: ProblemTemplate[] = [
  {
    question: "\\frac{d}{dx}(\\tan x)",
    answer: "\\sec^2 x",
    steps: [
      { number: 1, description: "Recall the derivative of tangent", math: "\\frac{d}{dx}(\\tan x) = \\sec^2 x" }
    ],
    hints: ["The derivative of tan(x) is sec²(x)."],
    timeEstimate: 15,
  },
  {
    question: "\\frac{d}{dx}(\\sec x)",
    answer: "\\sec x \\tan x",
    steps: [
      { number: 1, description: "Recall the derivative of secant", math: "\\frac{d}{dx}(\\sec x) = \\sec x \\tan x" }
    ],
    hints: ["The derivative of sec(x) is sec(x)·tan(x)."],
    timeEstimate: 15,
  },
  {
    question: "\\frac{d}{dx}(x \\tan x)",
    answer: "\\tan x + x\\sec^2 x",
    steps: [
      { number: 1, description: "Apply product rule", math: "u = x, \\quad v = \\tan x" },
      { number: 2, description: "Find derivatives and apply formula", math: "1 \\cdot \\tan x + x \\cdot \\sec^2 x = \\tan x + x\\sec^2 x" }
    ],
    hints: ["Use product rule: (x·tan x)' = tan x + x·sec²x."],
    timeEstimate: 35,
  },
  {
    question: "\\frac{d}{dx}(\\sin^2 x + \\cos^2 x)",
    answer: "0",
    steps: [
      { number: 1, description: "Note that sin²x + cos²x = 1 (Pythagorean identity)", math: "\\sin^2 x + \\cos^2 x = 1" },
      { number: 2, description: "The derivative of a constant is 0", math: "\\frac{d}{dx}(1) = 0" }
    ],
    hints: ["Remember the identity: sin²(x) + cos²(x) = 1. The derivative of 1 is 0."],
    timeEstimate: 20,
  },
  {
    question: "\\frac{d}{dx}(x^2 \\sin x)",
    answer: "2x\\sin x + x^2\\cos x",
    steps: [
      { number: 1, description: "Apply product rule", math: "u = x^2, \\quad v = \\sin x" },
      { number: 2, description: "Find derivatives", math: "u' = 2x, \\quad v' = \\cos x" },
      { number: 3, description: "Apply formula", math: "2x\\sin x + x^2\\cos x" }
    ],
    hints: ["Product rule: (x²·sin x)' = 2x·sin x + x²·cos x."],
    timeEstimate: 35,
  },
];

const diffTrigMedium: ProblemTemplate[] = [
  {
    question: "\\frac{d}{dx}(\\sin x \\cdot \\cos x)",
    answer: "\\cos^2 x - \\sin^2 x = \\cos(2x)",
    steps: [
      { number: 1, description: "Apply product rule", math: "u = \\sin x, \\quad v = \\cos x" },
      { number: 2, description: "Find derivatives", math: "u' = \\cos x, \\quad v' = -\\sin x" },
      { number: 3, description: "Apply formula and simplify using double-angle identity", math: "\\cos x \\cdot \\cos x + \\sin x \\cdot (-\\sin x) = \\cos^2 x - \\sin^2 x = \\cos(2x)" }
    ],
    hints: ["After applying product rule, use the identity cos²x - sin²x = cos(2x)."],
    timeEstimate: 50,
  },
  {
    question: "\\frac{d}{dx}(\\tan^2 x)",
    answer: "2\\tan x \\sec^2 x",
    steps: [
      { number: 1, description: "Use chain rule with outer u² and inner tan x", math: "f(u) = u^2, \\quad u = \\tan x" },
      { number: 2, description: "Apply chain rule", math: "2\\tan x \\cdot \\sec^2 x = 2\\tan x \\sec^2 x" }
    ],
    hints: ["Chain rule: d/dx[tan²x] = 2·tan x · d/dx[tan x] = 2·tan x·sec²x."],
    timeEstimate: 40,
  },
  {
    question: "\\frac{d}{dx}\\left(\\frac{\\sin x}{1 + \\cos x}\\right)",
    answer: "\\frac{1}{1 + \\cos x}",
    steps: [
      { number: 1, description: "Apply quotient rule", math: "u = \\sin x, \\quad v = 1 + \\cos x" },
      { number: 2, description: "Find derivatives", math: "u' = \\cos x, \\quad v' = -\\sin x" },
      { number: 3, description: "Apply formula and simplify using sin²x + cos²x = 1", math: "\\frac{\\cos x(1+\\cos x) - \\sin x(-\\sin x)}{(1+\\cos x)^2} = \\frac{\\cos x + \\cos^2 x + \\sin^2 x}{(1+\\cos x)^2} = \\frac{1 + \\cos x}{(1+\\cos x)^2} = \\frac{1}{1+\\cos x}" }
    ],
    hints: ["Simplify using sin²x + cos²x = 1 in the numerator."],
    timeEstimate: 70,
  },
  {
    question: "\\frac{d}{dx}(\\sin(2x) + \\cos(3x))",
    answer: "2\\cos(2x) - 3\\sin(3x)",
    steps: [
      { number: 1, description: "Differentiate each term using chain rule", math: "\\frac{d}{dx}\\sin(2x) + \\frac{d}{dx}\\cos(3x)" },
      { number: 2, description: "Apply chain rule to each", math: "\\cos(2x) \\cdot 2 + (-\\sin(3x)) \\cdot 3 = 2\\cos(2x) - 3\\sin(3x)" }
    ],
    hints: ["Don't forget to multiply by the derivative of the inner function (2 and 3 respectively)."],
    timeEstimate: 45,
  },
];

const diffTrigHard: ProblemTemplate[] = [
  {
    question: "\\frac{d}{dx}(\\sec^3(x^2))",
    answer: "6x \\sec^3(x^2) \\tan(x^2)",
    steps: [
      { number: 1, description: "Identify layers: outer = u³, middle = sec(v), inner = x²", math: "f(u) = u^3, \\quad u = \\sec v, \\quad v = x^2" },
      { number: 2, description: "Apply chain rule step by step", math: "3\\sec^2(x^2) \\cdot \\sec(x^2)\\tan(x^2) \\cdot 2x" },
      { number: 3, description: "Simplify", math: "6x\\sec^3(x^2)\\tan(x^2)" }
    ],
    hints: ["Three layers: cube → sec → x². Work from outside in."],
    timeEstimate: 75,
  },
  {
    question: "\\frac{d}{dx}\\left(\\frac{1 - \\tan x}{1 + \\tan x}\\right)",
    answer: "-\\frac{2\\sec^2 x}{(1 + \\tan x)^2}",
    steps: [
      { number: 1, description: "Apply quotient rule", math: "u = 1 - \\tan x, \\quad v = 1 + \\tan x" },
      { number: 2, description: "Find derivatives", math: "u' = -\\sec^2 x, \\quad v' = \\sec^2 x" },
      { number: 3, description: "Apply formula and simplify", math: "\\frac{-\\sec^2 x(1+\\tan x) - (1-\\tan x)\\sec^2 x}{(1+\\tan x)^2} = \\frac{-\\sec^2 x - \\sec^2 x}{(1+\\tan x)^2} = -\\frac{2\\sec^2 x}{(1+\\tan x)^2}" }
    ],
    hints: ["The tan x terms cancel out in the numerator after expanding."],
    timeEstimate: 80,
  },
];

const diffHigherEasy: ProblemTemplate[] = [
  {
    question: "\\text{Find } f''(x) \\text{ if } f(x) = x^4",
    answer: "12x^2",
    steps: [
      { number: 1, description: "Find the first derivative", math: "f'(x) = 4x^3" },
      { number: 2, description: "Find the second derivative by differentiating again", math: "f''(x) = 12x^2" }
    ],
    hints: ["Differentiate twice: f'(x) = 4x³, then f''(x) = 12x²."],
    timeEstimate: 30,
  },
  {
    question: "\\text{Find } f'''(x) \\text{ if } f(x) = e^x",
    answer: "e^x",
    steps: [
      { number: 1, description: "The derivative of eˣ is always eˣ", math: "f'(x) = e^x, \\quad f''(x) = e^x, \\quad f'''(x) = e^x" }
    ],
    hints: ["Every derivative of eˣ is eˣ."],
    timeEstimate: 15,
  },
  {
    question: "\\text{Find } f''(x) \\text{ if } f(x) = \\sin x",
    answer: "-\\sin x",
    steps: [
      { number: 1, description: "Find the first derivative", math: "f'(x) = \\cos x" },
      { number: 2, description: "Find the second derivative", math: "f''(x) = -\\sin x" }
    ],
    hints: ["f'(x) = cos(x), f''(x) = -sin(x). The derivatives of sin cycle every 4 steps."],
    timeEstimate: 25,
  },
  {
    question: "\\text{Find } f''(x) \\text{ if } f(x) = 3x^3 - 2x^2 + x - 5",
    answer: "18x - 4",
    steps: [
      { number: 1, description: "Find the first derivative", math: "f'(x) = 9x^2 - 4x + 1" },
      { number: 2, description: "Find the second derivative", math: "f''(x) = 18x - 4" }
    ],
    hints: ["Differentiate term by term, twice."],
    timeEstimate: 35,
  },
];

const diffHigherMedium: ProblemTemplate[] = [
  {
    question: "\\text{Find } f''(x) \\text{ if } f(x) = x^2 \\ln x",
    answer: "2\\ln x + 3",
    steps: [
      { number: 1, description: "Find f'(x) using product rule", math: "f'(x) = 2x\\ln x + x^2 \\cdot \\frac{1}{x} = 2x\\ln x + x" },
      { number: 2, description: "Find f''(x) by differentiating each term", math: "f''(x) = 2\\ln x + 2x \\cdot \\frac{1}{x} + 1 = 2\\ln x + 2 + 1 = 2\\ln x + 3" }
    ],
    hints: ["Use product rule for f'(x), then differentiate again."],
    timeEstimate: 60,
  },
  {
    question: "\\text{Find } f''(x) \\text{ if } f(x) = \\frac{1}{x}",
    answer: "\\frac{2}{x^3}",
    steps: [
      { number: 1, description: "Rewrite and find f'(x)", math: "f(x) = x^{-1}, \\quad f'(x) = -x^{-2} = -\\frac{1}{x^2}" },
      { number: 2, description: "Find f''(x)", math: "f''(x) = 2x^{-3} = \\frac{2}{x^3}" }
    ],
    hints: ["Rewrite 1/x as x⁻¹, then apply power rule twice."],
    timeEstimate: 40,
  },
  {
    question: "\\text{Find } f^{(4)}(x) \\text{ if } f(x) = \\sin x",
    answer: "\\sin x",
    steps: [
      { number: 1, description: "The derivatives of sin(x) cycle every 4", math: "f'(x) = \\cos x, \\quad f''(x) = -\\sin x, \\quad f'''(x) = -\\cos x, \\quad f^{(4)}(x) = \\sin x" }
    ],
    hints: ["The derivatives of sin cycle: sin → cos → -sin → -cos → sin..."],
    timeEstimate: 30,
  },
  {
    question: "\\text{Find } f''(x) \\text{ if } f(x) = e^{x^2}",
    answer: "2e^{x^2}(2x^2 + 1)",
    steps: [
      { number: 1, description: "Find f'(x) using chain rule", math: "f'(x) = e^{x^2} \\cdot 2x = 2xe^{x^2}" },
      { number: 2, description: "Find f''(x) using product rule", math: "f''(x) = 2e^{x^2} + 2x \\cdot e^{x^2} \\cdot 2x = 2e^{x^2} + 4x^2e^{x^2} = 2e^{x^2}(1 + 2x^2)" }
    ],
    hints: ["f'(x) requires chain rule. f''(x) requires product rule on 2x·e^(x²)."],
    timeEstimate: 70,
  },
];

const diffHigherHard: ProblemTemplate[] = [
  {
    question: "\\text{Find } f''(x) \\text{ if } f(x) = x^2 e^x",
    answer: "e^x(x^2 + 4x + 2)",
    steps: [
      { number: 1, description: "Find f'(x) using product rule", math: "f'(x) = 2xe^x + x^2e^x = e^x(x^2 + 2x)" },
      { number: 2, description: "Find f''(x) using product rule again", math: "f''(x) = e^x(x^2 + 2x) + e^x(2x + 2) = e^x(x^2 + 4x + 2)" }
    ],
    hints: ["Use product rule twice. Factor out eˣ when possible to simplify."],
    timeEstimate: 65,
  },
  {
    question: "\\text{Find the nth derivative of } f(x) = \\frac{1}{x}",
    answer: "(-1)^n \\frac{n!}{x^{n+1}}",
    steps: [
      { number: 1, description: "Compute first few derivatives to find the pattern", math: "f'(x) = -x^{-2}, \\quad f''(x) = 2x^{-3}, \\quad f'''(x) = -6x^{-4}" },
      { number: 2, description: "Observe the pattern: alternating signs and factorial coefficients", math: "f^{(n)}(x) = (-1)^n \\frac{n!}{x^{n+1}}" }
    ],
    hints: ["Compute f', f'', f''' and look for a pattern in the coefficients and signs."],
    timeEstimate: 70,
  },
  {
    question: "\\text{Find } f''(x) \\text{ if } f(x) = \\ln(x^2 + 1)",
    answer: "\\frac{2(1 - x^2)}{(x^2 + 1)^2}",
    steps: [
      { number: 1, description: "Find f'(x) using chain rule", math: "f'(x) = \\frac{2x}{x^2 + 1}" },
      { number: 2, description: "Find f''(x) using quotient rule", math: "f''(x) = \\frac{2(x^2+1) - 2x(2x)}{(x^2+1)^2} = \\frac{2x^2 + 2 - 4x^2}{(x^2+1)^2} = \\frac{2 - 2x^2}{(x^2+1)^2} = \\frac{2(1-x^2)}{(x^2+1)^2}" }
    ],
    hints: ["f'(x) uses chain rule. f''(x) uses quotient rule on 2x/(x²+1)."],
    timeEstimate: 75,
  },
];

const diffProblemBank: Record<DifferentiationTechnique, Record<Difficulty, ProblemTemplate[]>> = {
  'basic-diff': {
    easy: diffBasicEasy,
    medium: diffBasicMedium,
    hard: diffBasicHard,
  },
  'product-rule': {
    easy: diffProductEasy,
    medium: diffProductMedium,
    hard: diffProductHard,
  },
  'quotient-rule': {
    easy: diffQuotientEasy,
    medium: diffQuotientMedium,
    hard: diffQuotientHard,
  },
  'chain-rule': {
    easy: diffChainEasy,
    medium: diffChainMedium,
    hard: diffChainHard,
  },
  'implicit': {
    easy: diffImplicitEasy,
    medium: diffImplicitMedium,
    hard: diffImplicitHard,
  },
  'logarithmic': {
    easy: diffLogarithmicEasy,
    medium: diffLogarithmicMedium,
    hard: diffLogarithmicHard,
  },
  'trig-derivatives': {
    easy: diffTrigEasy,
    medium: diffTrigMedium,
    hard: diffTrigHard,
  },
  'higher-order': {
    easy: diffHigherEasy,
    medium: diffHigherMedium,
    hard: diffHigherHard,
  },
  'mixed-diff': {
    easy: [],
    medium: [],
    hard: [],
  },
};
// ─────────────────────────────────────────────────────────────────────────────
// DIFFERENTIATION TECHNIQUE INFO
// ─────────────────────────────────────────────────────────────────────────────

export function getDifferentiationTechniques(): { id: DifferentiationTechnique; name: string; description: string; example: string; icon: string; subtopics: string[] }[] {
  return [
    {
      id: 'basic-diff',
      name: 'Basic Differentiation',
      description: 'Power rule, constants, sums',
      example: '\\frac{d}{dx}(x^n) = nx^{n-1}',
      icon: 'Zap',
      subtopics: ['Power Rule', 'Constant Multiple', 'Sum/Difference Rule'],
    },
    {
      id: 'product-rule',
      name: 'Product Rule',
      description: 'Derivative of products',
      example: "\\frac{d}{dx}(uv) = u'v + uv'",
      icon: 'GitBranch',
      subtopics: ['Two Factors', 'Three+ Factors', 'Product with Chain'],
    },
    {
      id: 'quotient-rule',
      name: 'Quotient Rule',
      description: 'Derivative of quotients',
      example: "\\frac{d}{dx}\\left(\\frac{u}{v}\\right) = \\frac{u'v - uv'}{v^2}",
      icon: 'Split',
      subtopics: ['Simple Quotients', 'Complex Numerators', 'Nested Quotients'],
    },
    {
      id: 'chain-rule',
      name: 'Chain Rule',
      description: 'Composite functions',
      example: "\\frac{d}{dx}f(g(x)) = f'(g(x)) \\cdot g'(x)",
      icon: 'ArrowRight',
      subtopics: ['Single Layer', 'Double Layer', 'Mixed Rules'],
    },
    {
      id: 'implicit',
      name: 'Implicit Differentiation',
      description: 'Implicitly defined functions',
      example: '\\frac{d}{dx}(x^2 + y^2) = 2x + 2y\\frac{dy}{dx}',
      icon: 'RefreshCw',
      subtopics: ['Polynomial', 'Trigonometric', 'Exponential/Log'],
    },
    {
      id: 'logarithmic',
      name: 'Logarithmic Differentiation',
      description: 'Using ln to simplify',
      example: "\\ln y = \\ln f(x) \\Rightarrow \\frac{y'}{y} = \\frac{f'(x)}{f(x)}",
      icon: 'Infinity',
      subtopics: ['Variable Exponents', 'Complex Products', 'Roots/Powers'],
    },
    {
      id: 'trig-derivatives',
      name: 'Trigonometric Derivatives',
      description: 'Derivatives of trig functions',
      example: '\\frac{d}{dx}(\\sin x) = \\cos x',
      icon: 'Triangle',
      subtopics: ['Basic Trig', 'Trig with Chain', 'Trig Combinations'],
    },
    {
      id: 'higher-order',
      name: 'Higher-Order Derivatives',
      description: 'Second, third, nth derivatives',
      example: 'f^{\\prime\\prime}(x), f^{(3)}(x)',
      icon: 'Target',
      subtopics: ['Second Derivative', 'Third Derivative', 'nth Derivative Patterns'],
    },
    {
      id: 'mixed-diff',
      name: 'Mixed Practice',
      description: 'All techniques combined',
      example: '\\text{Random selection}',
      icon: 'Shuffle',
      subtopics: ['All Techniques', 'Adaptive Difficulty', 'Exam Simulation'],
    },
  ];
}

function getDiffTechniquesForMixed(_difficulty: Difficulty): DifferentiationTechnique[] {
  return ['basic-diff', 'product-rule', 'quotient-rule', 'chain-rule', 'implicit', 'logarithmic', 'trig-derivatives', 'higher-order'];
}

// ─────────────────────────────────────────────────────────────────────────────
// LIMITS PROBLEM BANKS
// ─────────────────────────────────────────────────────────────────────────────

const limitDirectEasy: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to 2} (x^2 + 3x - 1)",
    answer: "9",
    steps: [
      { number: 1, description: "Substitute x = 2 directly into the expression", math: "2^2 + 3(2) - 1" },
      { number: 2, description: "Simplify", math: "4 + 6 - 1 = 9" },
    ],
    hints: ["Try plugging in x = 2 directly"],
    timeEstimate: 30,
  },
  {
    question: "\\lim_{x \\to 0} \\cos(x)",
    answer: "1",
    steps: [
      { number: 1, description: "Cosine is continuous everywhere", math: "\\cos(0) = 1" },
    ],
    hints: ["Cosine is continuous at x = 0"],
    timeEstimate: 20,
  },
  {
    question: "\\lim_{x \\to 1} (x^3 - 2x + 5)",
    answer: "4",
    steps: [
      { number: 1, description: "Substitute x = 1", math: "1^3 - 2(1) + 5" },
      { number: 2, description: "Simplify", math: "1 - 2 + 5 = 4" },
    ],
    hints: ["Polynomials are continuous everywhere — just plug in"],
    timeEstimate: 30,
  },
];

const limitDirectMedium: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to \\pi/4} (\\sin(x) + \\cos(x))",
    answer: "\\sqrt{2}",
    steps: [
      { number: 1, description: "Substitute x = π/4", math: "\\sin(\\pi/4) + \\cos(\\pi/4)" },
      { number: 2, description: "Evaluate each trig function", math: "\\frac{\\sqrt{2}}{2} + \\frac{\\sqrt{2}}{2}" },
      { number: 3, description: "Simplify", math: "\\sqrt{2}" },
    ],
    hints: ["sin(π/4) = cos(π/4) = √2/2"],
    timeEstimate: 45,
  },
  {
    question: "\\lim_{x \\to 0} (e^x + 1)",
    answer: "2",
    steps: [
      { number: 1, description: "Exponential is continuous at 0", math: "e^0 + 1" },
      { number: 2, description: "Simplify", math: "1 + 1 = 2" },
    ],
    hints: ["e^0 = 1"],
    timeEstimate: 30,
  },
  {
    question: "\\lim_{x \\to 2} \\frac{x+1}{x-1}",
    answer: "3",
    steps: [
      { number: 1, description: "Substitute x = 2 (denominator ≠ 0)", math: "\\frac{2+1}{2-1}" },
      { number: 2, description: "Simplify", math: "\\frac{3}{1} = 3" },
    ],
    hints: ["Check that the denominator is not zero before substituting"],
    timeEstimate: 30,
  },
];

const limitDirectHard: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to 0} \\frac{\\sin(x) \\cdot \\cos(x) + x^2}{x + 1}",
    answer: "0",
    steps: [
      { number: 1, description: "Evaluate the numerator by substitution", math: "\\sin(0) \\cdot \\cos(0) + 0^2 = 0 \\cdot 1 + 0 = 0" },
      { number: 2, description: "Evaluate the denominator", math: "0 + 1 = 1" },
      { number: 3, description: "Divide", math: "\\frac{0}{1} = 0" },
    ],
    hints: ["Evaluate numerator and denominator separately, then divide"],
    timeEstimate: 60,
  },
  {
    question: "\\lim_{x \\to 0} \\ln(e^x + 1)",
    answer: "ln(2)",
    steps: [
      { number: 1, description: "Substitute x = 0 inside the logarithm", math: "\\ln(e^0 + 1) = \\ln(1 + 1)" },
      { number: 2, description: "Simplify", math: "\\ln(2)" },
    ],
    hints: ["e^0 = 1, so the argument of ln becomes 2"],
    timeEstimate: 45,
  },
  {
    question: "\\lim_{x \\to \\pi/2} (x \\cdot \\cos(x))",
    answer: "0",
    steps: [
      { number: 1, description: "Substitute x = π/2", math: "\\frac{\\pi}{2} \\cdot \\cos(\\pi/2)" },
      { number: 2, description: "cos(π/2) = 0", math: "\\frac{\\pi}{2} \\cdot 0 = 0" },
    ],
    hints: ["cos(π/2) = 0, so the entire product is 0"],
    timeEstimate: 45,
  },
];

const limitFactoringEasy: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}",
    answer: "4",
    steps: [
      { number: 1, description: "Factor the numerator as difference of squares", math: "\\frac{(x-2)(x+2)}{x-2}" },
      { number: 2, description: "Cancel the common factor (x ≠ 2)", math: "x + 2" },
      { number: 3, description: "Substitute x = 2", math: "2 + 2 = 4" },
    ],
    hints: ["Factor x² - 4 as (x-2)(x+2), then cancel"],
    timeEstimate: 45,
  },
  {
    question: "\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}",
    answer: "6",
    steps: [
      { number: 1, description: "Factor the numerator", math: "\\frac{(x-3)(x+3)}{x-3}" },
      { number: 2, description: "Cancel (x-3)", math: "x + 3" },
      { number: 3, description: "Substitute x = 3", math: "3 + 3 = 6" },
    ],
    hints: ["x² - 9 = (x-3)(x+3)"],
    timeEstimate: 45,
  },
  {
    question: "\\lim_{x \\to -1} \\frac{x^2 - 1}{x + 1}",
    answer: "-2",
    steps: [
      { number: 1, description: "Factor the numerator", math: "\\frac{(x-1)(x+1)}{x+1}" },
      { number: 2, description: "Cancel (x+1)", math: "x - 1" },
      { number: 3, description: "Substitute x = -1", math: "-1 - 1 = -2" },
    ],
    hints: ["x² - 1 = (x-1)(x+1)"],
    timeEstimate: 45,
  },
];

const limitFactoringMedium: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to 1} \\frac{x^3 - 1}{x - 1}",
    answer: "3",
    steps: [
      { number: 1, description: "Factor as difference of cubes", math: "\\frac{(x-1)(x^2+x+1)}{x-1}" },
      { number: 2, description: "Cancel (x-1)", math: "x^2 + x + 1" },
      { number: 3, description: "Substitute x = 1", math: "1 + 1 + 1 = 3" },
    ],
    hints: ["x³ - 1 = (x-1)(x²+x+1)"],
    timeEstimate: 60,
  },
  {
    question: "\\lim_{x \\to -2} \\frac{x^2 + x - 2}{x + 2}",
    answer: "-3",
    steps: [
      { number: 1, description: "Factor the numerator", math: "\\frac{(x+2)(x-1)}{x+2}" },
      { number: 2, description: "Cancel (x+2)", math: "x - 1" },
      { number: 3, description: "Substitute x = -2", math: "-2 - 1 = -3" },
    ],
    hints: ["Factor x² + x - 2 = (x+2)(x-1)"],
    timeEstimate: 60,
  },
  {
    question: "\\lim_{x \\to 2} \\frac{x^2 - 3x + 2}{x - 2}",
    answer: "1",
    steps: [
      { number: 1, description: "Factor the numerator", math: "\\frac{(x-2)(x-1)}{x-2}" },
      { number: 2, description: "Cancel (x-2)", math: "x - 1" },
      { number: 3, description: "Substitute x = 2", math: "2 - 1 = 1" },
    ],
    hints: ["x² - 3x + 2 = (x-2)(x-1)"],
    timeEstimate: 60,
  },
];

const limitFactoringHard: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to 2} \\frac{x^3 - 8}{x^2 - 4}",
    answer: "3",
    steps: [
      { number: 1, description: "Factor numerator (diff. of cubes) and denominator (diff. of squares)", math: "\\frac{(x-2)(x^2+2x+4)}{(x-2)(x+2)}" },
      { number: 2, description: "Cancel (x-2)", math: "\\frac{x^2+2x+4}{x+2}" },
      { number: 3, description: "Substitute x = 2", math: "\\frac{4+4+4}{4} = \\frac{12}{4} = 3" },
    ],
    hints: ["x³ - 8 = (x-2)(x²+2x+4) and x² - 4 = (x-2)(x+2)"],
    timeEstimate: 90,
  },
  {
    question: "\\lim_{x \\to 1} \\frac{x^3 + x^2 - 2x}{x^2 - 1}",
    answer: "3/2",
    steps: [
      { number: 1, description: "Factor out x from numerator and factor denominator", math: "\\frac{x(x^2+x-2)}{(x-1)(x+1)} = \\frac{x(x+2)(x-1)}{(x-1)(x+1)}" },
      { number: 2, description: "Cancel (x-1)", math: "\\frac{x(x+2)}{x+1}" },
      { number: 3, description: "Substitute x = 1", math: "\\frac{1(3)}{2} = \\frac{3}{2}" },
    ],
    hints: ["Factor numerator: x(x²+x-2) = x(x+2)(x-1)"],
    timeEstimate: 90,
  },
  {
    question: "\\lim_{x \\to -3} \\frac{x^2 + 5x + 6}{x^2 - 9}",
    answer: "-1/6",
    steps: [
      { number: 1, description: "Factor both numerator and denominator", math: "\\frac{(x+2)(x+3)}{(x-3)(x+3)}" },
      { number: 2, description: "Cancel (x+3)", math: "\\frac{x+2}{x-3}" },
      { number: 3, description: "Substitute x = -3", math: "\\frac{-3+2}{-3-3} = \\frac{-1}{-6} = \\frac{1}{6}" },
    ],
    hints: ["x² + 5x + 6 = (x+2)(x+3) and x² - 9 = (x-3)(x+3)"],
    timeEstimate: 90,
  },
];

const limitRationalizingEasy: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to 0} \\frac{\\sqrt{x+4} - 2}{x}",
    answer: "1/4",
    steps: [
      { number: 1, description: "Multiply numerator and denominator by the conjugate", math: "\\frac{(\\sqrt{x+4} - 2)(\\sqrt{x+4} + 2)}{x(\\sqrt{x+4} + 2)}" },
      { number: 2, description: "Simplify the numerator", math: "\\frac{(x+4) - 4}{x(\\sqrt{x+4} + 2)} = \\frac{x}{x(\\sqrt{x+4} + 2)}" },
      { number: 3, description: "Cancel x and substitute", math: "\\frac{1}{\\sqrt{4} + 2} = \\frac{1}{4}" },
    ],
    hints: ["Multiply by the conjugate √(x+4) + 2"],
    timeEstimate: 75,
  },
  {
    question: "\\lim_{x \\to 0} \\frac{\\sqrt{x+1} - 1}{x}",
    answer: "1/2",
    steps: [
      { number: 1, description: "Multiply by the conjugate", math: "\\frac{(\\sqrt{x+1} - 1)(\\sqrt{x+1} + 1)}{x(\\sqrt{x+1} + 1)}" },
      { number: 2, description: "Simplify", math: "\\frac{x}{x(\\sqrt{x+1} + 1)}" },
      { number: 3, description: "Cancel x and substitute", math: "\\frac{1}{\\sqrt{1} + 1} = \\frac{1}{2}" },
    ],
    hints: ["The conjugate of √(x+1) - 1 is √(x+1) + 1"],
    timeEstimate: 75,
  },
  {
    question: "\\lim_{x \\to 4} \\frac{\\sqrt{x} - 2}{x - 4}",
    answer: "1/4",
    steps: [
      { number: 1, description: "Multiply by the conjugate", math: "\\frac{(\\sqrt{x} - 2)(\\sqrt{x} + 2)}{(x-4)(\\sqrt{x} + 2)}" },
      { number: 2, description: "Simplify", math: "\\frac{x - 4}{(x-4)(\\sqrt{x} + 2)}" },
      { number: 3, description: "Cancel and substitute", math: "\\frac{1}{\\sqrt{4} + 2} = \\frac{1}{4}" },
    ],
    hints: ["The conjugate of √x - 2 is √x + 2"],
    timeEstimate: 75,
  },
];

const limitRationalizingMedium: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to 0} \\frac{\\sqrt{x^2+9} - 3}{x^2}",
    answer: "1/6",
    steps: [
      { number: 1, description: "Multiply by the conjugate", math: "\\frac{(\\sqrt{x^2+9} - 3)(\\sqrt{x^2+9} + 3)}{x^2(\\sqrt{x^2+9} + 3)}" },
      { number: 2, description: "Simplify the numerator", math: "\\frac{x^2}{x^2(\\sqrt{x^2+9} + 3)}" },
      { number: 3, description: "Cancel x² and substitute", math: "\\frac{1}{\\sqrt{9} + 3} = \\frac{1}{6}" },
    ],
    hints: ["Multiply by √(x²+9) + 3"],
    timeEstimate: 90,
  },
  {
    question: "\\lim_{x \\to 0} \\frac{\\sqrt{x+9} - 3}{x}",
    answer: "1/6",
    steps: [
      { number: 1, description: "Multiply by the conjugate", math: "\\frac{(\\sqrt{x+9} - 3)(\\sqrt{x+9} + 3)}{x(\\sqrt{x+9} + 3)}" },
      { number: 2, description: "Simplify", math: "\\frac{x}{x(\\sqrt{x+9} + 3)}" },
      { number: 3, description: "Cancel and substitute", math: "\\frac{1}{3+3} = \\frac{1}{6}" },
    ],
    hints: ["Use the conjugate √(x+9) + 3"],
    timeEstimate: 90,
  },
  {
    question: "\\lim_{x \\to 0} \\left(\\frac{1}{x} - \\frac{1}{x^2+x}\\right)",
    answer: "1",
    steps: [
      { number: 1, description: "Combine the fractions", math: "\\frac{x^2+x - x}{x(x^2+x)} = \\frac{x^2}{x^2(x+1)}" },
      { number: 2, description: "Simplify", math: "\\frac{1}{x+1}" },
      { number: 3, description: "Substitute x = 0", math: "\\frac{1}{1} = 1" },
    ],
    hints: ["Find a common denominator and combine"],
    timeEstimate: 90,
  },
];

const limitRationalizingHard: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to 0} \\frac{\\sqrt{1+x} - \\sqrt{1-x}}{x}",
    answer: "1",
    steps: [
      { number: 1, description: "Multiply by the conjugate of the entire numerator", math: "\\frac{(\\sqrt{1+x} - \\sqrt{1-x})(\\sqrt{1+x} + \\sqrt{1-x})}{x(\\sqrt{1+x} + \\sqrt{1-x})}" },
      { number: 2, description: "Simplify the numerator using (a-b)(a+b) = a² - b²", math: "\\frac{(1+x) - (1-x)}{x(\\sqrt{1+x} + \\sqrt{1-x})} = \\frac{2x}{x(\\sqrt{1+x} + \\sqrt{1-x})}" },
      { number: 3, description: "Cancel x and substitute", math: "\\frac{2}{\\sqrt{1} + \\sqrt{1}} = \\frac{2}{2} = 1" },
    ],
    hints: ["The conjugate is √(1+x) + √(1-x)"],
    timeEstimate: 120,
  },
  {
    question: "\\lim_{x \\to 4} \\frac{3 - \\sqrt{x+5}}{x - 4}",
    answer: "-1/6",
    steps: [
      { number: 1, description: "Multiply by the conjugate 3 + √(x+5)", math: "\\frac{(3 - \\sqrt{x+5})(3 + \\sqrt{x+5})}{(x-4)(3 + \\sqrt{x+5})}" },
      { number: 2, description: "Simplify: 9 - (x+5) = 4 - x = -(x-4)", math: "\\frac{-(x-4)}{(x-4)(3 + \\sqrt{x+5})}" },
      { number: 3, description: "Cancel (x-4) and substitute", math: "\\frac{-1}{3 + \\sqrt{9}} = \\frac{-1}{6}" },
    ],
    hints: ["After rationalizing, 9 - (x+5) = 4 - x = -(x-4)"],
    timeEstimate: 120,
  },
  {
    question: "\\lim_{x \\to 0} \\frac{\\sqrt{x^2+1} - 1}{\\sqrt{x^2+4} - 2}",
    answer: "2",
    steps: [
      { number: 1, description: "Rationalize both numerator and denominator", math: "\\frac{(\\sqrt{x^2+1}-1)(\\sqrt{x^2+1}+1)}{(\\sqrt{x^2+4}-2)(\\sqrt{x^2+4}+2)} \\cdot \\frac{\\sqrt{x^2+4}+2}{\\sqrt{x^2+1}+1}" },
      { number: 2, description: "Simplify each", math: "\\frac{x^2}{x^2} \\cdot \\frac{\\sqrt{x^2+4}+2}{\\sqrt{x^2+1}+1}" },
      { number: 3, description: "Cancel x² and substitute", math: "\\frac{2+2}{1+1} = \\frac{4}{2} = 2" },
    ],
    hints: ["Rationalize both the numerator and the denominator separately"],
    timeEstimate: 150,
  },
];

const limitSpecialTrigEasy: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to 0} \\frac{\\sin(3x)}{x}",
    answer: "3",
    steps: [
      { number: 1, description: "Use the standard limit: lim sin(u)/u = 1 as u→0", math: "\\lim_{x \\to 0} \\frac{\\sin(3x)}{x} = \\lim_{x \\to 0} \\frac{3\\sin(3x)}{3x}" },
      { number: 2, description: "Let u = 3x, so as x→0, u→0", math: "3 \\cdot \\lim_{u \\to 0} \\frac{\\sin(u)}{u} = 3 \\cdot 1" },
      { number: 3, description: "Simplify", math: "3" },
    ],
    hints: ["Use the special limit: lim sin(u)/u = 1 as u→0"],
    timeEstimate: 60,
  },
  {
    question: "\\lim_{x \\to 0} \\frac{\\tan(x)}{x}",
    answer: "1",
    steps: [
      { number: 1, description: "Write tan as sin/cos", math: "\\lim_{x \\to 0} \\frac{\\sin(x)}{x \\cdot \\cos(x)}" },
      { number: 2, description: "Separate the limits", math: "\\left(\\lim_{x \\to 0} \\frac{\\sin(x)}{x}\\right) \\cdot \\left(\\lim_{x \\to 0} \\frac{1}{\\cos(x)}\\right)" },
      { number: 3, description: "Evaluate each limit", math: "1 \\cdot \\frac{1}{1} = 1" },
    ],
    hints: ["Write tan(x) = sin(x)/cos(x) and use the special limit"],
    timeEstimate: 60,
  },
  {
    question: "\\lim_{x \\to 0} \\frac{\\sin(5x)}{\\sin(2x)}",
    answer: "5/2",
    steps: [
      { number: 1, description: "Rewrite to use the special limit", math: "\\lim_{x \\to 0} \\frac{\\sin(5x)}{5x} \\cdot \\frac{2x}{\\sin(2x)} \\cdot \\frac{5x}{2x}" },
      { number: 2, description: "Evaluate the standard limits", math: "1 \\cdot 1 \\cdot \\frac{5}{2}" },
      { number: 3, description: "Simplify", math: "\\frac{5}{2}" },
    ],
    hints: ["Multiply and divide by 5x and 2x to create the standard form"],
    timeEstimate: 75,
  },
];

const limitSpecialTrigMedium: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x^2}",
    answer: "1/2",
    steps: [
      { number: 1, description: "Multiply numerator and denominator by (1 + cos x)", math: "\\lim_{x \\to 0} \\frac{(1 - \\cos(x))(1 + \\cos(x))}{x^2(1 + \\cos(x))}" },
      { number: 2, description: "Use 1 - cos²x = sin²x", math: "\\lim_{x \\to 0} \\frac{\\sin^2(x)}{x^2(1 + \\cos(x))}" },
      { number: 3, description: "Separate as (sin x / x)² · 1/(1+cos x)", math: "\\left(\\lim_{x \\to 0} \\frac{\\sin(x)}{x}\\right)^2 \\cdot \\lim_{x \\to 0} \\frac{1}{1 + \\cos(x)}" },
      { number: 4, description: "Evaluate", math: "1^2 \\cdot \\frac{1}{2} = \\frac{1}{2}" },
    ],
    hints: ["Multiply by (1+cos x)/(1+cos x) and use the identity 1-cos²x = sin²x"],
    timeEstimate: 90,
  },
  {
    question: "\\lim_{x \\to 0} \\frac{1 - \\cos(2x)}{x^2}",
    answer: "2",
    steps: [
      { number: 1, description: "Multiply by the conjugate (1 + cos(2x))", math: "\\lim_{x \\to 0} \\frac{\\sin^2(2x)}{x^2(1 + \\cos(2x))}" },
      { number: 2, description: "Rewrite sin²(2x)/x² as 4·(sin(2x)/2x)²", math: "\\lim_{x \\to 0} 4 \\cdot \\left(\\frac{\\sin(2x)}{2x}\\right)^2 \\cdot \\frac{1}{1 + \\cos(2x)}" },
      { number: 3, description: "Evaluate each part", math: "4 \\cdot 1^2 \\cdot \\frac{1}{2} = 2" },
    ],
    hints: ["Use the same trick as (1-cos x)/x², but with 2x"],
    timeEstimate: 90,
  },
  {
    question: "\\lim_{x \\to 0} \\frac{\\tan(3x)}{\\sin(5x)}",
    answer: "3/5",
    steps: [
      { number: 1, description: "Write tan as sin/cos", math: "\\lim_{x \\to 0} \\frac{\\sin(3x)}{\\cos(3x) \\cdot \\sin(5x)}" },
      { number: 2, description: "Rearrange to create standard forms", math: "\\lim_{x \\to 0} \\frac{\\sin(3x)}{3x} \\cdot \\frac{5x}{\\sin(5x)} \\cdot \\frac{3x}{5x} \\cdot \\frac{1}{\\cos(3x)}" },
      { number: 3, description: "Evaluate each limit", math: "1 \\cdot 1 \\cdot \\frac{3}{5} \\cdot 1 = \\frac{3}{5}" },
    ],
    hints: ["Write tan(3x) = sin(3x)/cos(3x), then create sin(u)/u forms"],
    timeEstimate: 90,
  },
];

const limitSpecialTrigHard: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to 0} \\frac{\\sin(x) - x}{x^3}",
    answer: "-1/6",
    steps: [
      { number: 1, description: "This is a 0/0 indeterminate form — apply L'Hôpital's Rule", math: "\\lim_{x \\to 0} \\frac{\\cos(x) - 1}{3x^2}" },
      { number: 2, description: "Still 0/0 — apply L'Hôpital again", math: "\\lim_{x \\to 0} \\frac{-\\sin(x)}{6x}" },
      { number: 3, description: "Still 0/0 — apply L'Hôpital once more", math: "\\lim_{x \\to 0} \\frac{-\\cos(x)}{6} = \\frac{-1}{6}" },
    ],
    hints: ["This requires L'Hôpital's Rule applied three times"],
    timeEstimate: 120,
  },
  {
    question: "\\lim_{x \\to 0} \\frac{x \\cdot \\sin(x)}{1 - \\cos(x)}",
    answer: "2",
    steps: [
      { number: 1, description: "Multiply numerator and denominator by (1 + cos x)", math: "\\lim_{x \\to 0} \\frac{x \\cdot \\sin(x)(1 + \\cos(x))}{1 - \\cos^2(x)} = \\lim_{x \\to 0} \\frac{x \\cdot \\sin(x)(1 + \\cos(x))}{\\sin^2(x)}" },
      { number: 2, description: "Simplify", math: "\\lim_{x \\to 0} \\frac{x(1 + \\cos(x))}{\\sin(x)}" },
      { number: 3, description: "Separate as (x/sin x)·(1+cos x)", math: "\\lim_{x \\to 0} \\frac{x}{\\sin(x)} \\cdot \\lim_{x \\to 0}(1 + \\cos(x))" },
      { number: 4, description: "Evaluate", math: "1 \\cdot 2 = 2" },
    ],
    hints: ["Multiply by (1+cos x)/(1+cos x) to use the identity 1-cos²x = sin²x"],
    timeEstimate: 120,
  },
  {
    question: "\\lim_{x \\to 0} \\frac{1 - \\cos(x) \\cdot \\cos(2x)}{x^2}",
    answer: "5/2",
    steps: [
      { number: 1, description: "Rewrite the numerator", math: "1 - \\cos(x) \\cdot \\cos(2x) = 1 - \\cos(x) + \\cos(x) - \\cos(x) \\cdot \\cos(2x)" },
      { number: 2, description: "Split into two limits", math: "\\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x^2} + \\lim_{x \\to 0} \\frac{\\cos(x)(1 - \\cos(2x))}{x^2}" },
      { number: 3, description: "First limit = 1/2. For second, use 1-cos(2x) = 2sin²x", math: "\\frac{1}{2} + \\lim_{x \\to 0} \\cos(x) \\cdot \\frac{2\\sin^2(x)}{x^2}" },
      { number: 4, description: "Evaluate", math: "\\frac{1}{2} + 2 \\cdot 1 = \\frac{5}{2}" },
    ],
    hints: ["Split using 1 - cos(x)cos(2x) = (1-cos x) + cos x(1-cos(2x))"],
    timeEstimate: 150,
  },
];

const limitLhopitalEasy: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to 0} \\frac{\\sin(x)}{x}",
    answer: "1",
    steps: [
      { number: 1, description: "Verify 0/0 form", math: "\\frac{\\sin(0)}{0} = \\frac{0}{0}" },
      { number: 2, description: "Apply L'Hôpital's Rule: differentiate numerator and denominator", math: "\\lim_{x \\to 0} \\frac{\\cos(x)}{1}" },
      { number: 3, description: "Substitute x = 0", math: "\\cos(0) = 1" },
    ],
    hints: ["This is a 0/0 form — apply L'Hôpital's Rule"],
    timeEstimate: 45,
  },
  {
    question: "\\lim_{x \\to 0} \\frac{e^x - 1}{x}",
    answer: "1",
    steps: [
      { number: 1, description: "Verify 0/0 form", math: "\\frac{e^0 - 1}{0} = \\frac{0}{0}" },
      { number: 2, description: "Apply L'Hôpital's Rule", math: "\\lim_{x \\to 0} \\frac{e^x}{1}" },
      { number: 3, description: "Substitute", math: "e^0 = 1" },
    ],
    hints: ["Differentiate top and bottom separately"],
    timeEstimate: 45,
  },
  {
    question: "\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1}",
    answer: "2",
    steps: [
      { number: 1, description: "Verify 0/0 form", math: "\\frac{1-1}{1-1} = \\frac{0}{0}" },
      { number: 2, description: "Apply L'Hôpital's Rule", math: "\\lim_{x \\to 1} \\frac{2x}{1}" },
      { number: 3, description: "Substitute", math: "2(1) = 2" },
    ],
    hints: ["Differentiate: d/dx(x²-1) = 2x and d/dx(x-1) = 1"],
    timeEstimate: 45,
  },
];

const limitLhopitalMedium: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to \\infty} \\frac{\\ln(x)}{x}",
    answer: "0",
    steps: [
      { number: 1, description: "Verify ∞/∞ form", math: "\\frac{\\infty}{\\infty}" },
      { number: 2, description: "Apply L'Hôpital's Rule", math: "\\lim_{x \\to \\infty} \\frac{1/x}{1}" },
      { number: 3, description: "Simplify", math: "\\lim_{x \\to \\infty} \\frac{1}{x} = 0" },
    ],
    hints: ["∞/∞ form — differentiate ln(x) and x"],
    timeEstimate: 60,
  },
  {
    question: "\\lim_{x \\to 1} \\frac{x^3 - 1}{x^2 - 1}",
    answer: "3/2",
    steps: [
      { number: 1, description: "Verify 0/0 form", math: "\\frac{0}{0}" },
      { number: 2, description: "Apply L'Hôpital's Rule", math: "\\lim_{x \\to 1} \\frac{3x^2}{2x}" },
      { number: 3, description: "Simplify and substitute", math: "\\frac{3(1)}{2} = \\frac{3}{2}" },
    ],
    hints: ["Differentiate: d/dx(x³-1) = 3x² and d/dx(x²-1) = 2x"],
    timeEstimate: 60,
  },
  {
    question: "\\lim_{x \\to 0} \\frac{e^x - e^{-x}}{x}",
    answer: "2",
    steps: [
      { number: 1, description: "Verify 0/0 form", math: "\\frac{1 - 1}{0} = \\frac{0}{0}" },
      { number: 2, description: "Apply L'Hôpital's Rule", math: "\\lim_{x \\to 0} \\frac{e^x + e^{-x}}{1}" },
      { number: 3, description: "Substitute", math: "1 + 1 = 2" },
    ],
    hints: ["d/dx(e⁻ˣ) = -e⁻ˣ, so the derivative of eˣ - e⁻ˣ is eˣ + e⁻ˣ"],
    timeEstimate: 60,
  },
];

const limitLhopitalHard: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to 0} \\frac{e^x - e^{-x} - 2x}{x - \\sin(x)}",
    answer: "1",
    steps: [
      { number: 1, description: "Verify 0/0 form", math: "\\frac{1 - 1 - 0}{0 - 0} = \\frac{0}{0}" },
      { number: 2, description: "Apply L'Hôpital (1st time)", math: "\\lim_{x \\to 0} \\frac{e^x + e^{-x} - 2}{1 - \\cos(x)} = \\frac{0}{0}" },
      { number: 3, description: "Apply L'Hôpital (2nd time)", math: "\\lim_{x \\to 0} \\frac{e^x - e^{-x}}{\\sin(x)} = \\frac{0}{0}" },
      { number: 4, description: "Apply L'Hôpital (3rd time)", math: "\\lim_{x \\to 0} \\frac{e^x + e^{-x}}{\\cos(x)} = \\frac{2}{1} = 2" },
    ],
    hints: ["This requires applying L'Hôpital's Rule three times"],
    timeEstimate: 150,
  },
  {
    question: "\\lim_{x \\to \\infty} \\frac{x^2}{e^x}",
    answer: "0",
    steps: [
      { number: 1, description: "Verify ∞/∞ form", math: "\\frac{\\infty}{\\infty}" },
      { number: 2, description: "Apply L'Hôpital's Rule (1st time)", math: "\\lim_{x \\to \\infty} \\frac{2x}{e^x} = \\frac{\\infty}{\\infty}" },
      { number: 3, description: "Apply L'Hôpital's Rule (2nd time)", math: "\\lim_{x \\to \\infty} \\frac{2}{e^x} = \\frac{2}{\\infty} = 0" },
    ],
    hints: ["Apply L'Hôpital twice — the exponential always wins"],
    timeEstimate: 90,
  },
  {
    question: "\\lim_{x \\to \\infty} \\frac{x}{\\ln(x)}",
    answer: "infinity",
    steps: [
      { number: 1, description: "Verify ∞/∞ form", math: "\\frac{\\infty}{\\infty}" },
      { number: 2, description: "Apply L'Hôpital's Rule", math: "\\lim_{x \\to \\infty} \\frac{1}{1/x} = \\lim_{x \\to \\infty} x" },
      { number: 3, description: "Evaluate", math: "\\infty" },
    ],
    hints: ["After L'Hôpital, you get x which approaches infinity"],
    timeEstimate: 60,
  },
];

const limitInfiniteEasy: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to 0^+} \\frac{1}{x}",
    answer: "infinity",
    steps: [
      { number: 1, description: "As x approaches 0 from the right, 1/x becomes very large positive", math: "\\frac{1}{0.001} = 1000, \\quad \\frac{1}{0.0001} = 10000" },
      { number: 2, description: "The limit approaches positive infinity", math: "+\\infty" },
    ],
    hints: ["As x gets closer to 0 from the positive side, 1/x grows without bound"],
    timeEstimate: 30,
  },
  {
    question: "\\lim_{x \\to 2^+} \\frac{1}{x-2}",
    answer: "infinity",
    steps: [
      { number: 1, description: "As x approaches 2 from the right, x-2 is a small positive number", math: "x - 2 > 0 \\text{ for } x > 2" },
      { number: 2, description: "A positive constant divided by a very small positive number is very large", math: "+\\infty" },
    ],
    hints: ["x-2 is positive and very small when x is slightly greater than 2"],
    timeEstimate: 30,
  },
  {
    question: "\\lim_{x \\to 0^-} \\frac{1}{x}",
    answer: "-infinity",
    steps: [
      { number: 1, description: "As x approaches 0 from the left, x is negative and very small", math: "\\frac{1}{-0.001} = -1000" },
      { number: 2, description: "The limit approaches negative infinity", math: "-\\infty" },
    ],
    hints: ["From the left, x is negative, so 1/x is negative and large in magnitude"],
    timeEstimate: 30,
  },
];

const limitInfiniteMedium: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to 1} \\frac{1}{(x-1)^2}",
    answer: "infinity",
    steps: [
      { number: 1, description: "As x approaches 1, (x-1)² is always positive and very small", math: "(x-1)^2 > 0 \\text{ for all } x \\neq 1" },
      { number: 2, description: "1 divided by a very small positive number is very large", math: "+\\infty" },
    ],
    hints: ["(x-1)² is always positive, so the sign doesn't change"],
    timeEstimate: 45,
  },
  {
    question: "\\lim_{x \\to 3^-} \\frac{1}{x-3}",
    answer: "-infinity",
    steps: [
      { number: 1, description: "As x approaches 3 from the left, x-3 is negative and small", math: "x - 3 < 0 \\text{ for } x < 3" },
      { number: 2, description: "1 divided by a small negative number is a large negative number", math: "-\\infty" },
    ],
    hints: ["From the left, x-3 is negative"],
    timeEstimate: 45,
  },
  {
    question: "\\lim_{x \\to -1^+} \\frac{x+2}{x+1}",
    answer: "infinity",
    steps: [
      { number: 1, description: "As x approaches -1 from the right, numerator → 1", math: "x + 2 \\to 1" },
      { number: 2, description: "Denominator x+1 is positive and very small", math: "x + 1 > 0 \\text{ for } x > -1" },
      { number: 3, description: "Positive divided by small positive → +∞", math: "+\\infty" },
    ],
    hints: ["Check the sign of the denominator from the right side"],
    timeEstimate: 60,
  },
];

const limitInfiniteHard: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to 2} \\frac{x^2 + 1}{(x-2)^2}",
    answer: "infinity",
    steps: [
      { number: 1, description: "Numerator approaches 5 as x→2", math: "2^2 + 1 = 5" },
      { number: 2, description: "Denominator (x-2)² approaches 0 from the positive side", math: "(x-2)^2 > 0 \\text{ for all } x \\neq 2" },
      { number: 3, description: "Positive constant over very small positive → +∞", math: "+\\infty" },
    ],
    hints: ["The denominator is squared, so it's always positive"],
    timeEstimate: 60,
  },
  {
    question: "\\lim_{x \\to 0} \\frac{1}{x^2}",
    answer: "infinity",
    steps: [
      { number: 1, description: "As x approaches 0, x² is positive and very small", math: "x^2 > 0 \\text{ for all } x \\neq 0" },
      { number: 2, description: "1 divided by a very small positive number is very large", math: "+\\infty" },
    ],
    hints: ["x² is always positive, so the two-sided limit is +∞"],
    timeEstimate: 30,
  },
  {
    question: "\\lim_{x \\to 1^+} \\frac{x^2 - 2x + 1}{|x-1|}",
    answer: "0",
    steps: [
      { number: 1, description: "Factor the numerator", math: "\\frac{(x-1)^2}{|x-1|}" },
      { number: 2, description: "For x > 1, |x-1| = x-1", math: "\\frac{(x-1)^2}{x-1} = x - 1" },
      { number: 3, description: "Take the limit", math: "1 - 1 = 0" },
    ],
    hints: ["For x > 1, the absolute value simplifies to x-1"],
    timeEstimate: 75,
  },
];

const limitInfinityEasy: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to \\infty} \\frac{1}{x}",
    answer: "0",
    steps: [
      { number: 1, description: "As x grows larger, 1/x becomes smaller", math: "\\frac{1}{1000} = 0.001, \\quad \\frac{1}{1000000} = 0.000001" },
      { number: 2, description: "The limit approaches 0", math: "0" },
    ],
    hints: ["As x gets very large, 1/x gets very close to 0"],
    timeEstimate: 20,
  },
  {
    question: "\\lim_{x \\to \\infty} \\left(3 + \\frac{1}{x^2}\\right)",
    answer: "3",
    steps: [
      { number: 1, description: "As x→∞, 1/x² → 0", math: "\\lim_{x \\to \\infty} \\frac{1}{x^2} = 0" },
      { number: 2, description: "Add the constant", math: "3 + 0 = 3" },
    ],
    hints: ["1/x² approaches 0 as x approaches infinity"],
    timeEstimate: 20,
  },
  {
    question: "\\lim_{x \\to \\infty} \\frac{5}{x^3}",
    answer: "0",
    steps: [
      { number: 1, description: "As x→∞, x³ grows without bound", math: "x^3 \\to \\infty" },
      { number: 2, description: "A constant divided by a very large number approaches 0", math: "0" },
    ],
    hints: ["The denominator grows much faster than the numerator"],
    timeEstimate: 20,
  },
];

const limitInfinityMedium: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to \\infty} \\frac{3x^2 + 2x - 1}{2x^2 + 5}",
    answer: "3/2",
    steps: [
      { number: 1, description: "Divide numerator and denominator by the highest power x²", math: "\\lim_{x \\to \\infty} \\frac{3 + \\frac{2}{x} - \\frac{1}{x^2}}{2 + \\frac{5}{x^2}}" },
      { number: 2, description: "As x→∞, all terms with x in the denominator approach 0", math: "\\frac{3 + 0 - 0}{2 + 0}" },
      { number: 3, description: "Simplify", math: "\\frac{3}{2}" },
    ],
    hints: ["Divide every term by x², the highest power in the denominator"],
    timeEstimate: 60,
  },
  {
    question: "\\lim_{x \\to \\infty} \\frac{2x + 1}{x^2 - 3}",
    answer: "0",
    steps: [
      { number: 1, description: "Divide by the highest power x²", math: "\\lim_{x \\to \\infty} \\frac{\\frac{2}{x} + \\frac{1}{x^2}}{1 - \\frac{3}{x^2}}" },
      { number: 2, description: "All fractional terms approach 0", math: "\\frac{0 + 0}{1 - 0}" },
      { number: 3, description: "Simplify", math: "0" },
    ],
    hints: ["The denominator has a higher degree than the numerator"],
    timeEstimate: 60,
  },
  {
    question: "\\lim_{x \\to \\infty} \\frac{x^3 - 2x}{4x^2 + 1}",
    answer: "infinity",
    steps: [
      { number: 1, description: "Divide by x³ (highest power in numerator)", math: "\\lim_{x \\to \\infty} \\frac{1 - \\frac{2}{x^2}}{\\frac{4}{x} + \\frac{1}{x^3}}" },
      { number: 2, description: "Numerator → 1, denominator → 0⁺", math: "\\frac{1}{0^+}" },
      { number: 3, description: "Positive divided by small positive → +∞", math: "+\\infty" },
    ],
    hints: ["The numerator has a higher degree than the denominator"],
    timeEstimate: 75,
  },
];

const limitInfinityHard: ProblemTemplate[] = [
  {
    question: "\\lim_{x \\to \\infty} \\left(\\sqrt{x^2 + 3x} - x\\right)",
    answer: "3/2",
    steps: [
      { number: 1, description: "Multiply by the conjugate", math: "\\lim_{x \\to \\infty} \\frac{(x^2 + 3x) - x^2}{\\sqrt{x^2 + 3x} + x} = \\lim_{x \\to \\infty} \\frac{3x}{\\sqrt{x^2 + 3x} + x}" },
      { number: 2, description: "Factor x from denominator: √(x²+3x) = x√(1+3/x)", math: "\\lim_{x \\to \\infty} \\frac{3x}{x(\\sqrt{1 + \\frac{3}{x}} + 1)}" },
      { number: 3, description: "Cancel x and let x→∞", math: "\\frac{3}{\\sqrt{1} + 1} = \\frac{3}{2}" },
    ],
    hints: ["Multiply by the conjugate √(x²+3x) + x, then factor x from the denominator"],
    timeEstimate: 120,
  },
  {
    question: "\\lim_{x \\to -\\infty} \\frac{x^3 + 2x}{x^2 - 1}",
    answer: "-infinity",
    steps: [
      { number: 1, description: "Divide by x²", math: "\\lim_{x \\to -\\infty} \\frac{x + \\frac{2}{x}}{1 - \\frac{1}{x^2}}" },
      { number: 2, description: "As x→-∞, x is large negative and the fractional terms → 0", math: "\\frac{-\\infty + 0}{1 - 0}" },
      { number: 3, description: "Simplify", math: "-\\infty" },
    ],
    hints: ["The leading term in the numerator is x³, which dominates as x→-∞"],
    timeEstimate: 75,
  },
  {
    question: "\\lim_{x \\to \\infty} \\frac{\\sqrt{x^2 + 1}}{2x + 3}",
    answer: "1/2",
    steps: [
      { number: 1, description: "Factor x from numerator and denominator", math: "\\lim_{x \\to \\infty} \\frac{x\\sqrt{1 + \\frac{1}{x^2}}}{x(2 + \\frac{3}{x})}" },
      { number: 2, description: "Cancel x", math: "\\lim_{x \\to \\infty} \\frac{\\sqrt{1 + \\frac{1}{x^2}}}{2 + \\frac{3}{x}}" },
      { number: 3, description: "Evaluate the limit", math: "\\frac{\\sqrt{1}}{2} = \\frac{1}{2}" },
    ],
    hints: ["Factor x out of √(x²+1) = x√(1+1/x²) for x > 0"],
    timeEstimate: 90,
  },
];

const limitProblemBank: Record<LimitTechnique, Record<Difficulty, ProblemTemplate[]>> = {
  'direct-substitution': {
    easy: limitDirectEasy,
    medium: limitDirectMedium,
    hard: limitDirectHard,
  },
  'factoring': {
    easy: limitFactoringEasy,
    medium: limitFactoringMedium,
    hard: limitFactoringHard,
  },
  'rationalizing': {
    easy: limitRationalizingEasy,
    medium: limitRationalizingMedium,
    hard: limitRationalizingHard,
  },
  'special-trig': {
    easy: limitSpecialTrigEasy,
    medium: limitSpecialTrigMedium,
    hard: limitSpecialTrigHard,
  },
  'lhopital': {
    easy: limitLhopitalEasy,
    medium: limitLhopitalMedium,
    hard: limitLhopitalHard,
  },
  'infinite-limits': {
    easy: limitInfiniteEasy,
    medium: limitInfiniteMedium,
    hard: limitInfiniteHard,
  },
  'limits-at-infinity': {
    easy: limitInfinityEasy,
    medium: limitInfinityMedium,
    hard: limitInfinityHard,
  },
  'mixed-limits': {
    easy: [],
    medium: [],
    hard: [],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// LIMITS TECHNIQUE INFO
// ─────────────────────────────────────────────────────────────────────────────

export function getLimitTechniques(): { id: LimitTechnique; name: string; description: string; example: string; icon: string; subtopics: string[] }[] {
  return [
    {
      id: 'direct-substitution',
      name: 'Direct Substitution',
      description: 'Plug in the value for continuous functions',
      example: "\\lim_{x \\to 2} (x^2 + 3) = 7",
      icon: 'Zap',
      subtopics: ['Polynomials', 'Continuous Functions', 'Composition of Continuous Functions'],
    },
    {
      id: 'factoring',
      name: 'Factoring & Canceling',
      description: 'Factor and cancel common terms',
      example: "\\lim_{x \\to 2} \\frac{x^2-4}{x-2} = 4",
      icon: 'Split',
      subtopics: ['Difference of Squares', 'Difference of Cubes', 'Quadratic Factoring'],
    },
    {
      id: 'rationalizing',
      name: 'Rationalizing',
      description: 'Multiply by the conjugate to eliminate radicals',
      example: "\\lim_{x \\to 0} \\frac{\\sqrt{x+4}-2}{x} = \\frac{1}{4}",
      icon: 'RefreshCw',
      subtopics: ['Single Radical', 'Double Radical', 'Complex Fractions'],
    },
    {
      id: 'special-trig',
      name: 'Special Trig Limits',
      description: 'Use standard trigonometric limit formulas',
      example: "\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1",
      icon: 'Triangle',
      subtopics: ['sin(x)/x Form', '(1-cos x)/x² Form', 'Combining Trig Limits'],
    },
    {
      id: 'lhopital',
      name: "L'Hôpital's Rule",
      description: 'Differentiate numerator and denominator for 0/0 or ∞/∞',
      example: "\\lim_{x \\to 0} \\frac{e^x-1}{x} = 1",
      icon: 'GitBranch',
      subtopics: ['0/0 Forms', '∞/∞ Forms', "Repeated L'Hôpital"],
    },
    {
      id: 'infinite-limits',
      name: 'Infinite Limits',
      description: 'Behavior near vertical asymptotes',
      example: "\\lim_{x \\to 0^+} \\frac{1}{x} = +\\infty",
      icon: 'Infinity',
      subtopics: ['One-Sided Limits', 'Sign Analysis', 'Vertical Asymptotes'],
    },
    {
      id: 'limits-at-infinity',
      name: 'Limits at Infinity',
      description: 'End behavior and horizontal asymptotes',
      example: "\\lim_{x \\to \\infty} \\frac{1}{x} = 0",
      icon: 'ArrowRight',
      subtopics: ['Rational Functions', 'Radical Functions', 'Exponential vs Polynomial'],
    },
    {
      id: 'mixed-limits',
      name: 'Mixed Practice',
      description: 'All limit techniques combined',
      example: "Random selection",
      icon: 'Shuffle',
      subtopics: ['All Techniques', 'Adaptive Difficulty', 'Exam Simulation'],
    },
  ];
}

function getLimitTechniquesForMixed(_difficulty: Difficulty): LimitTechnique[] {
  return ['direct-substitution', 'factoring', 'rationalizing', 'special-trig', 'lhopital', 'infinite-limits', 'limits-at-infinity'];
}

function getAppDiffTechniquesForMixed(_difficulty: Difficulty): AppDerivativesTechnique[] {
  return ['optimization', 'related-rates', 'curve-sketching', 'mvt', 'linear-approximation', 'motion', 'economics'];
}

function getAppIntTechniquesForMixed(_difficulty: Difficulty): AppIntegrationTechnique[] {
  return ['area-between-curves', 'volumes', 'arc-length', 'surface-area', 'work', 'center-of-mass', 'averages-probability'];
}

function getDiffEqTechniquesForMixed(_difficulty: Difficulty): DiffEqTechnique[] {
  return ['separable', 'linear-first-order', 'homogeneous', 'exact', 'second-order', 'undetermined-coefficients', 'variation-of-parameters', 'laplace'];
}

function getSeriesTechniquesForMixed(_difficulty: Difficulty): SeriesTechnique[] {
  return ['geometric-series', 'p-series-telescoping', 'divergence-test', 'ratio-test', 'root-test', 'comparison-tests', 'alternating-series', 'power-series'];
}

/**
 * Get all available sequences-and-series techniques with their display info.
 */
export function getSeriesTechniques(): { id: SeriesTechnique; name: string; description: string; example: string; icon: string; subtopics: string[] }[] {
  return [
    {
      id: 'geometric-series',
      name: 'Geometric Series',
      description: 'Constant-ratio series and their exact sums',
      example: '\\sum_{n=0}^{\\infty} ar^n = \\frac{a}{1 - r}, \\quad |r| < 1',
      icon: 'Hash',
      subtopics: ['Sum Formula', 'Repeating Decimals', 'Word Problems'],
    },
    {
      id: 'p-series-telescoping',
      name: 'P-Series & Telescoping',
      description: 'The p-test and collapsing partial sums',
      example: '\\sum \\frac{1}{n^p} \\text{ converges iff } p > 1',
      icon: 'ListOrdered',
      subtopics: ['P-Test', 'Partial Fractions', 'Partial Sums'],
    },
    {
      id: 'divergence-test',
      name: 'Divergence Test',
      description: 'First check: do the terms approach zero?',
      example: '\\lim a_n \\neq 0 \\Rightarrow \\sum a_n \\text{ diverges}',
      icon: 'AlertTriangle',
      subtopics: ['Nth Term Limit', 'Inconclusive Cases', 'Classic Limits'],
    },
    {
      id: 'ratio-test',
      name: 'Ratio Test',
      description: 'Factorials and exponentials via term ratios',
      example: 'L = \\lim_{n \\to \\infty} \\left| \\frac{a_{n+1}}{a_n} \\right|',
      icon: 'Divide',
      subtopics: ['Factorials', 'Exponentials', 'Computing L'],
    },
    {
      id: 'root-test',
      name: 'Root Test',
      description: 'Nth-power terms via nth roots',
      example: 'L = \\lim_{n \\to \\infty} \\sqrt[n]{|a_n|}',
      icon: 'Sprout',
      subtopics: ['Nth-Power Forms', 'Standard Limits', 'Computing L'],
    },
    {
      id: 'comparison-tests',
      name: 'Comparison Tests',
      description: 'Direct and limit comparison against known series',
      example: 'a_n \\le b_n, \\; \\sum b_n \\text{ converges} \\Rightarrow \\sum a_n \\text{ converges}',
      icon: 'Scale',
      subtopics: ['Direct Comparison', 'Limit Comparison', 'Dominant Powers'],
    },
    {
      id: 'alternating-series',
      name: 'Alternating Series',
      description: 'AST, absolute vs conditional convergence, error bounds',
      example: '\\sum \\frac{(-1)^n}{n} \\text{ converges conditionally}',
      icon: 'ArrowLeftRight',
      subtopics: ['Alternating Series Test', 'Absolute vs Conditional', 'Error Estimation'],
    },
    {
      id: 'power-series',
      name: 'Power Series',
      description: 'Radius and interval of convergence, Taylor coefficients',
      example: '\\sum c_n (x - a)^n, \\quad R = \\lim \\left| \\frac{c_n}{c_{n+1}} \\right|',
      icon: 'Superscript',
      subtopics: ['Radius of Convergence', 'Interval & Endpoints', 'Maclaurin Coefficients'],
    },
    {
      id: 'mixed-series',
      name: 'Mixed Series',
      description: 'All series techniques combined',
      example: '\\text{Random selection}',
      icon: 'Shuffle',
      subtopics: ['All Techniques', 'Adaptive Difficulty', 'Exam Simulation'],
    },
  ];
}

/**
 * Get all available math1-eoc techniques with their display info.
 */
export function getMath1Techniques(): { id: Math1Technique; name: string; description: string; example: string; icon: string; subtopics: string[] }[] {
  return [
    {
      id: 'm1-linear-equations',
      name: 'Linear Equations',
      description: 'Solve, rearrange, and model with linear equations',
      example: '3(2x - 9) = 9(4x + 8)',
      icon: 'Equal',
      subtopics: ['Solve Multi-Step', 'Literal Equations', 'Budget Inequalities', 'Perimeter Problems'],
    },
    {
      id: 'm1-systems',
      name: 'Systems',
      description: 'Solve, model, and classify systems',
      example: '\\begin{cases} 2x + y = 7 \\\\ -2x + 3y = -3 \\end{cases}',
      icon: 'Layers',
      subtopics: ['Solve 2×2', 'Modeling Contexts', 'Inequality Systems', 'Number of Solutions'],
    },
    {
      id: 'm1-functions',
      name: 'Functions',
      description: 'Evaluate, interpret, and build functions',
      example: 'f(x) = 20x + 220',
      icon: 'Activity',
      subtopics: ['Evaluate f(x)', 'Slope & Intercept Meaning', 'Tables to Rules', 'Recursive to Explicit'],
    },
    {
      id: 'm1-quadratics-polynomials',
      name: 'Quadratics',
      description: 'Roots, vertices, factoring, and area models',
      example: 'x^2 - 22 = -6',
      icon: 'Spline',
      subtopics: ['Square Root Equations', 'Projectile Models', 'Factored Forms', 'Area Expressions'],
    },
    {
      id: 'm1-exponentials',
      name: 'Exponentials',
      description: 'Growth, decay, and linear-vs-exponential reasoning',
      example: 'f(x) = 1200(1.30)^x',
      icon: 'TrendingUp',
      subtopics: ['Growth Rate', 'Decay Evaluation', 'Model Identification', 'Intersections'],
    },
    {
      id: 'm1-exponents-geometry',
      name: 'Exponents & Geometry',
      description: 'Exponent laws and coordinate geometry',
      example: '((x^3)^5)^3 = x^m',
      icon: 'Superscript',
      subtopics: ['Exponent Laws', 'Perpendicular Lines', 'Midpoints', 'Parallelograms'],
    },
    {
      id: 'm1-statistics',
      name: 'Statistics',
      description: 'Correlation, best-fit lines, outliers, rate of change',
      example: 'r \\approx 0.994',
      icon: 'LineChart',
      subtopics: ['Correlation', 'Best-Fit Predictions', 'Outlier Effects', 'Average Rate of Change'],
    },
    {
      id: 'mixed-m1',
      name: 'Mixed Math 1',
      description: 'All Math 1 topics combined',
      example: '\\text{Random selection}',
      icon: 'Shuffle',
      subtopics: ['All Topics', 'Exam Format', 'EOC Simulation'],
    },
  ];
}

/**
 * Get all available math3-eoc techniques with their display info.
 */
export function getMath3Techniques(): { id: Math3Technique; name: string; description: string; example: string; icon: string; subtopics: string[] }[] {
  return [
    {
      id: 'm3-polynomials',
      name: 'Polynomials',
      description: 'Factor, divide, and build polynomials from zeros',
      example: '(4x^3 - 2x^2 + 10) \\div (x + 4)',
      icon: 'Superscript',
      subtopics: ['Difference of Squares', 'Long Division', 'Factor Theorem', 'Zeros & Vieta', 'Volume Models'],
    },
    {
      id: 'm3-rational-expressions',
      name: 'Rational Expressions',
      description: 'Discontinuities, operations, and rational equations',
      example: '\\frac{x - 2}{x + 2} - \\frac{x + 2}{x - 2}',
      icon: 'Equal',
      subtopics: ['Discontinuity', 'Add & Subtract', 'Rational Equations', 'Intersections'],
    },
    {
      id: 'm3-exponential-logs',
      name: 'Exponentials & Logs',
      description: 'Solve exponential equations with logarithms',
      example: '3^{x + 1} = 7',
      icon: 'TrendingUp',
      subtopics: ['Solve with Logs', 'Interpret a(1+r)^t', 'Growth Base Conversion', 'Rate Comparison', 'Graph ID'],
    },
    {
      id: 'm3-functions-transformations',
      name: 'Functions & Transformations',
      description: 'Translations, inverses, piecewise, end behavior',
      example: 'y = |x - 3| - 2',
      icon: 'Activity',
      subtopics: ['Translations', 'Inverse Functions', 'Piecewise Evaluation', 'Cubic Behavior', 'Graph Reading'],
    },
    {
      id: 'm3-geometry',
      name: 'Geometry',
      description: 'Circles, quadrilaterals, arcs, and volume scaling',
      example: 'x^2 + y^2 - 8x + 6y + 9 = 0',
      icon: 'Spline',
      subtopics: ['Circle Equations', 'Arcs & Angles', 'Quadrilateral Properties', 'Area Models', 'Scale Factors'],
    },
    {
      id: 'm3-statistics',
      name: 'Statistics',
      description: 'Sampling methods and valid conclusions',
      example: '\\text{random sample?}',
      icon: 'LineChart',
      subtopics: ['Population vs Sample', 'Random Sampling', 'Paired Comparisons'],
    },
    {
      id: 'mixed-m3',
      name: 'Mixed Math 3',
      description: 'All Math 3 topics combined',
      example: '\\text{Random selection}',
      icon: 'Shuffle',
      subtopics: ['All Topics', 'Exam Format', 'EOC Simulation'],
    },
  ];
}

/**
 * Get all available math7-eog techniques with their display info.
 */
export function getMath7Techniques(): { id: Math7Technique; name: string; description: string; example: string; icon: string; subtopics: string[] }[] {
  return [
    {
      id: 'g7-ratios-proportions',
      name: 'Ratios & Proportions',
      description: 'Unit rates, proportional graphs, and percent problems',
      example: '\\frac{1/9}{1/27} = 3 \\text{ mph}',
      icon: 'TrendingUp',
      subtopics: ['Unit Rates with Fractions', 'Graph → Equation', 'Percent & Tips', 'Ratio Chains'],
    },
    {
      id: 'g7-expressions-equations',
      name: 'Expressions & Equations',
      description: 'Simplify expressions and model with equations & inequalities',
      example: '-6(x + 4) - 4x',
      icon: 'Equal',
      subtopics: ['Combine Like Terms', 'Distribute Negatives', 'Inequalities', 'Word Problems'],
    },
    {
      id: 'g7-numbers-operations',
      name: 'Number Operations',
      description: 'Signed numbers, fraction arithmetic, and money problems',
      example: '\\frac{1}{4}\\left(\\frac{5}{2} - \\frac{3}{2}\\right)',
      icon: 'Calculator',
      subtopics: ['Signed Means', 'Fraction Expressions', 'Tax & Splitting', 'Rates'],
    },
    {
      id: 'g7-geometry',
      name: 'Geometry',
      description: 'Angles, triangles, circles, volume, and surface area',
      example: 'x + (3x + 10) = 90',
      icon: 'Triangle',
      subtopics: ['Triangle Inequality', 'Angle Chases', 'Sectors & Arcs', 'Volume & Surface Area'],
    },
    {
      id: 'g7-statistics',
      name: 'Statistics',
      description: 'Sampling, box plots, and comparing data sets',
      example: '\\text{IQR} = Q_3 - Q_1',
      icon: 'LineChart',
      subtopics: ['Survey Strategies', 'Box Plots', 'Mean & MAD', 'Simulations'],
    },
    {
      id: 'g7-probability',
      name: 'Probability',
      description: 'Compound events, spinners, and the counting principle',
      example: 'P(\\text{even and heads}) = \\frac{1}{4}',
      icon: 'Dices',
      subtopics: ['Compound Events', 'Spinners', 'Counting Principle', 'Complements'],
    },
    {
      id: 'mixed-g7',
      name: 'Mixed Math 7',
      description: 'All Grade 7 topics combined',
      example: '\\text{Random selection}',
      icon: 'Shuffle',
      subtopics: ['All Topics', 'Exam Format', 'EOG Simulation'],
    },
  ];
}

/**
 * Get all available math8-eog techniques with their display info.
 */
export function getMath8Techniques(): { id: Math8Technique; name: string; description: string; example: string; icon: string; subtopics: string[] }[] {
  return [
    {
      id: 'g8-functions',
      name: 'Functions',
      description: 'Identify functions, compare slopes and intercepts, read graphs',
      example: 'y = mx + b',
      icon: 'Activity',
      subtopics: ['Linear vs Nonlinear', 'Function or Not', 'Slope from Tables', 'Compare Rates', 'Story Graphs'],
    },
    {
      id: 'g8-expressions-equations',
      name: 'Expressions & Equations',
      description: 'Exponents, scientific notation, linear equations, systems',
      example: '3^{2} \\cdot 3^{5} \\div 3^{3}',
      icon: 'Superscript',
      subtopics: ['Exponent Rules', 'Scientific Notation', 'Multi-step Equations', 'Systems Word Problems'],
    },
    {
      id: 'g8-geometry',
      name: 'Geometry',
      description: 'Transformations, angles, Pythagorean theorem, volumes',
      example: '\\sqrt{3^2 + 4^2} = 5',
      icon: 'Triangle',
      subtopics: ['Dilations & Reflections', 'Parallel Lines', 'Exterior Angles', 'Distance', 'Cone & Cylinder Volume'],
    },
    {
      id: 'g8-statistics-probability',
      name: 'Statistics & Probability',
      description: 'Scatterplots, linear models, and two-way tables',
      example: '\\text{positive association?}',
      icon: 'LineChart',
      subtopics: ['Association', 'Best-Fit Models', 'Slope & Intercept Meaning', 'Two-Way Tables'],
    },
    {
      id: 'g8-number-system',
      name: 'Number System',
      description: 'Rational vs irrational and square-root estimation',
      example: '\\sqrt{172} \\approx 13',
      icon: 'Calculator',
      subtopics: ['Irrational Numbers', 'Root Estimation'],
    },
    {
      id: 'mixed-g8',
      name: 'Mixed Math 8',
      description: 'All Grade 8 topics combined',
      example: '\\text{Random selection}',
      icon: 'Shuffle',
      subtopics: ['All Topics', 'Exam Format', 'EOG Simulation'],
    },
  ];
}

/**
 * Get all available math6-eog techniques with their display info.
 */
export function getMath6Techniques(): { id: Math6Technique; name: string; description: string; example: string; icon: string; subtopics: string[] }[] {
  return [
    {
      id: 'g6-ratios',
      name: 'Ratios & Percents',
      description: 'Ratio tables, unit rates, equivalent ratios, percents of quantities',
      example: '3 : 4 = 9 : 12',
      icon: 'PieChart',
      subtopics: ['Part-to-Whole Ratios', 'Unit Rates', 'Proportional Tables', 'Percent of a Number', 'Percent from Scores'],
    },
    {
      id: 'g6-expressions-equations',
      name: 'Expressions & Equations',
      description: 'Powers of ten, phrases to expressions, distributive property, inequalities',
      example: '4y - 6',
      icon: 'Variable',
      subtopics: ['Powers of Ten', 'Phrase to Expression', 'Distributive Property', 'Inequality Graphs', 'y = kx from Graphs'],
    },
    {
      id: 'g6-number-system',
      name: 'The Number System',
      description: 'Integers, coordinate distance, decimal & fraction division, GCF and LCM',
      example: '-4 < -2',
      icon: 'Calculator',
      subtopics: ['Integer Inequalities', 'Coordinate Distance', 'Fraction Division', 'GCF & LCM', 'Number-Line Models'],
    },
    {
      id: 'g6-geometry',
      name: 'Geometry',
      description: 'Area on the coordinate plane, nets and surface area, fraction-dimension volume',
      example: 'SA = 2(lw + lh + wh)',
      icon: 'Box',
      subtopics: ['Polygon Area', 'Prism Nets', 'Triangle Nets', 'Fraction Volume'],
    },
    {
      id: 'g6-statistics',
      name: 'Statistics',
      description: 'Mean, missing scores for a target mean, box plots, dot plots',
      example: '\\text{mean} = \\frac{\\text{sum}}{n}',
      icon: 'BarChart3',
      subtopics: ['Mean', 'Target Average', 'Box Plots', 'Dot Plots'],
    },
    {
      id: 'mixed-g6',
      name: 'Mixed Math 6',
      description: 'All Grade 6 topics combined',
      example: '\\text{Random selection}',
      icon: 'Shuffle',
      subtopics: ['All Topics', 'Exam Format', 'EOG Simulation'],
    },
  ];
}

/**
 * Get all available differential-equations techniques with their display info.
 */
export function getDiffEqTechniques(): { id: DiffEqTechnique; name: string; description: string; example: string; icon: string; subtopics: string[] }[] {
  return [
    {
      id: 'separable',
      name: 'Separable Equations',
      description: 'Divide and integrate both sides',
      example: '\\frac{dy}{y} = 2x \\, dx \\Rightarrow \\ln(y) = x^2 + C',
      icon: 'Split',
      subtopics: ['Separation of Variables', 'Initial Value Problems', 'Growth & Decay', 'Partial Fractions'],
    },
    {
      id: 'linear-first-order',
      name: 'Linear First-Order',
      description: 'Integrating factor method',
      example: "y' + P(x)y = Q(x) \\Rightarrow \\mu = e^{\\int P dx}",
      icon: 'ArrowRight',
      subtopics: ['Integrating Factors', 'Standard Form', 'Resonant Forcing'],
    },
    {
      id: 'homogeneous',
      name: 'Homogeneous Equations',
      description: 'Substitution v = y/x for ratio equations',
      example: "y' = f\\!\\left(\\frac{y}{x}\\right) \\Rightarrow v + xv' = f(v)",
      icon: 'Repeat',
      subtopics: ['v = y/x Substitution', 'Ratio Forms', 'Implicit Solutions'],
    },
    {
      id: 'exact',
      name: 'Exact Equations',
      description: 'Potential functions and the exactness test',
      example: 'M \\, dx + N \\, dy = 0, \\quad M_y = N_x',
      icon: 'Equal',
      subtopics: ['Exactness Test', 'Potential Functions', 'Level Curves'],
    },
    {
      id: 'second-order',
      name: 'Second-Order Constant Coefficients',
      description: 'Characteristic equation: real, repeated, complex roots',
      example: "ar^2 + br + c = 0 \\Rightarrow y = C_1 e^{r_1 x} + C_2 e^{r_2 x}",
      icon: 'Layers',
      subtopics: ['Distinct Real Roots', 'Repeated Roots', 'Complex Roots', 'IVPs'],
    },
    {
      id: 'undetermined-coefficients',
      name: 'Undetermined Coefficients',
      description: 'Trial solutions for polynomial and exponential forcing',
      example: "y'' + y = x^2 \\Rightarrow y_p = ax^2 + bx + c",
      icon: 'Puzzle',
      subtopics: ['Polynomial Forcing', 'Exponential Forcing', 'Resonance Cases'],
    },
    {
      id: 'variation-of-parameters',
      name: 'Variation of Parameters',
      description: 'Wronskian method for general forcing terms',
      example: "y_p = u_1 y_1 + u_2 y_2, \\quad W = y_1 y_2' - y_1' y_2",
      icon: 'Waves',
      subtopics: ['Wronskians', 'u1 and u2 Integrals', 'Resonant Forcing'],
    },
    {
      id: 'laplace',
      name: 'Laplace Transforms',
      description: 'Transform, shift, and invert',
      example: '\\mathcal{L}\\{e^{ax}\\} = \\frac{1}{s - a}',
      icon: 'Sigma',
      subtopics: ['Basic Transforms', 'Inverse Transforms', 'Shifting Theorem', 'Solving IVPs'],
    },
    {
      id: 'mixed-diffeq',
      name: 'Mixed DiffEq',
      description: 'All differential equation techniques combined',
      example: '\\text{Random selection}',
      icon: 'Shuffle',
      subtopics: ['All Techniques', 'Adaptive Difficulty', 'Exam Simulation'],
    },
  ];
}

/**
 * Get all available applications-of-integration techniques with their display info.
 */
export function getAppIntegrationTechniques(): { id: AppIntegrationTechnique; name: string; description: string; example: string; icon: string; subtopics: string[] }[] {
  return [
    {
      id: 'area-between-curves',
      name: 'Area Between Curves',
      description: 'Vertical and horizontal slices between two functions',
      example: 'A = \\int_a^b [f(x) - g(x)] \\, dx',
      icon: 'Layers',
      subtopics: ['Top Minus Bottom', 'Finding Intersections', 'Horizontal Slices', 'Absolute Area'],
    },
    {
      id: 'volumes',
      name: 'Volumes of Revolution',
      description: 'Disk, washer, and shell methods',
      example: 'V = \\pi \\int_a^b [f(x)]^2 \\, dx',
      icon: 'Rotate3d',
      subtopics: ['Disk Method', 'Washer Method', 'Cylindrical Shells', 'About Either Axis'],
    },
    {
      id: 'arc-length',
      name: 'Arc Length',
      description: 'Length of a curve via the arc length integral',
      example: 'L = \\int_a^b \\sqrt{1 + (f\'(x))^2} \\, dx',
      icon: 'Spline',
      subtopics: ['Perfect-Square Integrands', 'Radical Curves', 'Circle Formulas'],
    },
    {
      id: 'surface-area',
      name: 'Surface Area',
      description: 'Surfaces of revolution: cones, spheres, zones',
      example: 'S = 2\\pi \\int_a^b f(x)\\sqrt{1 + (f\'(x))^2} \\, dx',
      icon: 'Globe',
      subtopics: ['Cones', 'Spheres & Zones', 'Radical Curves'],
    },
    {
      id: 'work',
      name: 'Work & Physics',
      description: 'Springs, lifting, and pumping problems',
      example: 'W = \\int_a^b F(x) \\, dx',
      icon: 'Weight',
      subtopics: ["Hooke's Law Springs", 'Lifting Cables & Chains', 'Pumping Tanks'],
    },
    {
      id: 'center-of-mass',
      name: 'Center of Mass',
      description: 'Balance points of masses, rods, and regions',
      example: '\\bar{x} = \\frac{1}{A} \\int_a^b x f(x) \\, dx',
      icon: 'Crosshair',
      subtopics: ['Point Masses', 'Variable Density', 'Centroids of Regions'],
    },
    {
      id: 'averages-probability',
      name: 'Averages & Probability',
      description: 'Average value, pdf normalization, expected value, variance',
      example: 'f_{\\text{avg}} = \\frac{1}{b - a} \\int_a^b f(x) \\, dx',
      icon: 'Percent',
      subtopics: ['Average Value', 'MVT for Integrals', 'Expected Value', 'Variance'],
    },
    {
      id: 'mixed-appint',
      name: 'Mixed Applications',
      description: 'All integration application techniques combined',
      example: '\\text{Random selection}',
      icon: 'Shuffle',
      subtopics: ['All Techniques', 'Adaptive Difficulty', 'Exam Simulation'],
    },
  ];
}

/**
 * Get all available applications-of-derivatives techniques with their display info.
 */
export function getAppDerivativesTechniques(): { id: AppDerivativesTechnique; name: string; description: string; example: string; icon: string; subtopics: string[] }[] {
  return [
    {
      id: 'optimization',
      name: 'Optimization',
      description: 'Maximize area, minimize cost, maximize volume',
      example: 'A(x) = 240x - 2x^2 \\Rightarrow A\'(x) = 0',
      icon: 'TrendingUp',
      subtopics: ['Area & Perimeter', 'Box Volume', 'Surface Area', 'Inscribed Shapes'],
    },
    {
      id: 'related-rates',
      name: 'Related Rates',
      description: 'Rates of change of connected quantities',
      example: 'x^2 + y^2 = 25 \\Rightarrow 2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0',
      icon: 'Activity',
      subtopics: ['Ladders & Shadows', 'Filling Tanks', 'Moving Objects', 'Expanding Shapes'],
    },
    {
      id: 'curve-sketching',
      name: 'Curve Sketching',
      description: 'Critical points, extrema, inflection points',
      example: "f'(x) = 0, \\quad f''(x) > 0 \\Rightarrow \\text{local min}",
      icon: 'LineChart',
      subtopics: ['First Derivative Test', 'Second Derivative Test', 'Inflection Points'],
    },
    {
      id: 'mvt',
      name: 'Mean Value Theorem',
      description: "Rolle's Theorem and finding guaranteed c values",
      example: "f'(c) = \\frac{f(b) - f(a)}{b - a}",
      icon: 'Equal',
      subtopics: ["Rolle's Theorem", 'Finding c', 'Real-World Interpretation'],
    },
    {
      id: 'linear-approximation',
      name: 'Linear Approximation',
      description: 'Estimate values with tangent lines',
      example: 'L(x) = f(a) + f\'(a)(x - a)',
      icon: 'Minus',
      subtopics: ['Linearization', 'Estimating Roots', 'Trig & Exponential Estimates'],
    },
    {
      id: 'motion',
      name: 'Motion',
      description: 'Position, velocity, acceleration, total distance',
      example: 'v(t) = s\'(t), \\quad a(t) = v\'(t)',
      icon: 'MoveRight',
      subtopics: ['Velocity & Acceleration', 'At Rest & Direction Changes', 'Total Distance', 'Projectiles'],
    },
    {
      id: 'economics',
      name: 'Economics',
      description: 'Marginal cost, revenue, profit optimization',
      example: "P'(x) = R'(x) - C'(x) = 0",
      icon: 'DollarSign',
      subtopics: ['Marginal Analysis', 'Profit Maximization', 'Average Cost', 'Demand Curves'],
    },
    {
      id: 'mixed-appdiff',
      name: 'Mixed Applications',
      description: 'All application techniques combined',
      example: '\\text{Random selection}',
      icon: 'Shuffle',
      subtopics: ['All Techniques', 'Adaptive Difficulty', 'Exam Simulation'],
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a problem for the given subject, technique, and difficulty.
 * Uses a seed-based selection so the same settings don't always return the same problem.
 */
export function generateProblem(
  subject: Subject,
  technique: Technique,
  difficulty: Difficulty,
  seed?: number
): Problem {
  const actualSeed = seed ?? Math.floor(Math.random() * 10000);

  let actualTechnique = technique;
  let actualDifficulty = difficulty;

  if (subject === 'integration') {
    // Handle 'mixed' by randomly selecting a technique
    if (technique === 'mixed') {
      const techniques = getTechniquesForMixed(difficulty);
      const techHash = hashString(`mixed-${difficulty}-${actualSeed}`);
      actualTechnique = techniques[techHash % techniques.length];
    }

    const bank = problemBank as Record<string, Record<Difficulty, ProblemTemplate[]>>;
    const templates = bank[actualTechnique][actualDifficulty];

    if (!templates || templates.length === 0) {
      return generateProblem('integration', 'basic', 'easy', 0);
    }

    const hash = hashString(`${actualTechnique}-${actualDifficulty}-${actualSeed}`);
    const index = hash % templates.length;
    const template = templates[index];
    const id = `int-${actualTechnique}-${actualDifficulty}-${hash}-${actualSeed}`;

    return {
      id,
      subject: 'integration',
      technique: actualTechnique,
      difficulty: actualDifficulty,
      question: template.question,
      answer: template.answer,
      steps: template.steps,
      hints: template.hints,
      timeEstimate: template.timeEstimate,
    };
  } else if (subject === 'differentiation') {
    // Differentiation
    if (technique === 'mixed-diff') {
      const techniques = getDiffTechniquesForMixed(difficulty);
      const techHash = hashString(`mixed-diff-${difficulty}-${actualSeed}`);
      actualTechnique = techniques[techHash % techniques.length];
    }

    const bank = diffProblemBank as Record<string, Record<Difficulty, ProblemTemplate[]>>;
    const templates = bank[actualTechnique][actualDifficulty];

    if (!templates || templates.length === 0) {
      return generateProblem('differentiation', 'basic-diff', 'easy', 0);
    }

    const hash = hashString(`diff-${actualTechnique}-${actualDifficulty}-${actualSeed}`);
    const index = hash % templates.length;
    const template = templates[index];
    const id = `diff-${actualTechnique}-${actualDifficulty}-${hash}-${actualSeed}`;

    return {
      id,
      subject: 'differentiation',
      technique: actualTechnique,
      difficulty: actualDifficulty,
      question: template.question,
      answer: template.answer,
      steps: template.steps,
      hints: template.hints,
      timeEstimate: template.timeEstimate,
    };
  } else if (subject === 'limits') {
    // Limits
    if (technique === 'mixed-limits') {
      const techniques = getLimitTechniquesForMixed(difficulty);
      const techHash = hashString(`mixed-limits-${difficulty}-${actualSeed}`);
      actualTechnique = techniques[techHash % techniques.length];
    }

    const bank = limitProblemBank as Record<string, Record<Difficulty, ProblemTemplate[]>>;
    const templates = bank[actualTechnique][actualDifficulty];

    if (!templates || templates.length === 0) {
      return generateProblem('limits', 'direct-substitution', 'easy', 0);
    }

    const hash = hashString(`lim-${actualTechnique}-${actualDifficulty}-${actualSeed}`);
    const index = hash % templates.length;
    const template = templates[index];
    const id = `lim-${actualTechnique}-${actualDifficulty}-${hash}-${actualSeed}`;

    return {
      id,
      subject: 'limits',
      technique: actualTechnique,
      difficulty: actualDifficulty,
      question: template.question,
      answer: template.answer,
      steps: template.steps,
      hints: template.hints,
      timeEstimate: template.timeEstimate,
    };
  } else if (subject === 'applications-derivatives') {
    // Applications of Derivatives
    if (technique === 'mixed-appdiff') {
      const techniques = getAppDiffTechniquesForMixed(difficulty);
      const techHash = hashString(`mixed-appdiff-${difficulty}-${actualSeed}`);
      actualTechnique = techniques[techHash % techniques.length];
    }

    const bank = appDiffProblemBank as Record<string, Record<Difficulty, ProblemTemplate[]>>;
    const templates = bank[actualTechnique][actualDifficulty];

    if (!templates || templates.length === 0) {
      return generateProblem('applications-derivatives', 'optimization', 'easy', 0);
    }

    const hash = hashString(`appdiff-${actualTechnique}-${actualDifficulty}-${actualSeed}`);
    const index = hash % templates.length;
    const template = templates[index];
    const id = `appdiff-${actualTechnique}-${actualDifficulty}-${hash}-${actualSeed}`;

    return {
      id,
      subject: 'applications-derivatives',
      technique: actualTechnique,
      difficulty: actualDifficulty,
      question: template.question,
      answer: template.answer,
      steps: template.steps,
      hints: template.hints,
      timeEstimate: template.timeEstimate,
    };
  } else if (subject === 'applications-integration') {
    // Applications of Integration
    if (technique === 'mixed-appint') {
      const techniques = getAppIntTechniquesForMixed(difficulty);
      const techHash = hashString(`mixed-appint-${difficulty}-${actualSeed}`);
      actualTechnique = techniques[techHash % techniques.length];
    }

    const bank = appIntProblemBank as Record<string, Record<Difficulty, ProblemTemplate[]>>;
    const templates = bank[actualTechnique][actualDifficulty];

    if (!templates || templates.length === 0) {
      return generateProblem('applications-integration', 'area-between-curves', 'easy', 0);
    }

    const hash = hashString(`appint-${actualTechnique}-${actualDifficulty}-${actualSeed}`);
    const index = hash % templates.length;
    const template = templates[index];
    const id = `appint-${actualTechnique}-${actualDifficulty}-${hash}-${actualSeed}`;

    return {
      id,
      subject: 'applications-integration',
      technique: actualTechnique,
      difficulty: actualDifficulty,
      question: template.question,
      answer: template.answer,
      steps: template.steps,
      hints: template.hints,
      timeEstimate: template.timeEstimate,
    };
  } else if (subject === 'differential-equations') {
    // Differential Equations
    if (technique === 'mixed-diffeq') {
      const techniques = getDiffEqTechniquesForMixed(difficulty);
      const techHash = hashString(`mixed-diffeq-${difficulty}-${actualSeed}`);
      actualTechnique = techniques[techHash % techniques.length];
    }

    const bank = diffEqProblemBank as Record<string, Record<Difficulty, ProblemTemplate[]>>;
    const templates = bank[actualTechnique][actualDifficulty];

    if (!templates || templates.length === 0) {
      return generateProblem('differential-equations', 'separable', 'easy', 0);
    }

    const hash = hashString(`diffeq-${actualTechnique}-${actualDifficulty}-${actualSeed}`);
    const index = hash % templates.length;
    const template = templates[index];
    const id = `diffeq-${actualTechnique}-${actualDifficulty}-${hash}-${actualSeed}`;

    return {
      id,
      subject: 'differential-equations',
      technique: actualTechnique,
      difficulty: actualDifficulty,
      question: template.question,
      answer: template.answer,
      steps: template.steps,
      hints: template.hints,
      timeEstimate: template.timeEstimate,
    };
  } else if (subject === 'sequences-series') {
    // Sequences & Series
    if (technique === 'mixed-series') {
      const techniques = getSeriesTechniquesForMixed(difficulty);
      const techHash = hashString(`mixed-series-${difficulty}-${actualSeed}`);
      actualTechnique = techniques[techHash % techniques.length];
    }

    const bank = seriesProblemBank as Record<string, Record<Difficulty, ProblemTemplate[]>>;
    const templates = bank[actualTechnique][actualDifficulty];

    if (!templates || templates.length === 0) {
      return generateProblem('sequences-series', 'geometric-series', 'easy', 0);
    }

    const hash = hashString(`series-${actualTechnique}-${actualDifficulty}-${actualSeed}`);
    const index = hash % templates.length;
    const template = templates[index];
    const id = `series-${actualTechnique}-${actualDifficulty}-${hash}-${actualSeed}`;

    return {
      id,
      subject: 'sequences-series',
      technique: actualTechnique,
      difficulty: actualDifficulty,
      question: template.question,
      answer: template.answer,
      steps: template.steps,
      hints: template.hints,
      timeEstimate: template.timeEstimate,
    };
  } else {
    // EOC/EOG subjects — procedural factories (unlimited original items)
    const isM1 = subject === 'math1-eoc';
    const isM6 = subject === 'math6-eog';
    const isM7 = subject === 'math7-eog';
    const isM8 = subject === 'math8-eog';
    const factoryMap: Record<string, ProblemFactory[]> = isM1 ? math1Factories : isM6 ? math6Factories : isM7 ? math7Factories : isM8 ? math8Factories : math3Factories;
    const mixedKey = isM1 ? 'mixed-m1' : isM6 ? 'mixed-g6' : isM7 ? 'mixed-g7' : isM8 ? 'mixed-g8' : 'mixed-m3';
    const fallbackTech = isM1 ? 'm1-linear-equations' : isM6 ? 'g6-ratios' : isM7 ? 'g7-ratios-proportions' : isM8 ? 'g8-functions' : 'm3-polynomials';

    if (technique === mixedKey) {
      const techniques = Object.keys(factoryMap);
      const techHash = hashString(`${mixedKey}-${difficulty}-${actualSeed}`);
      actualTechnique = techniques[techHash % techniques.length] as Technique;
    }

    const factories = factoryMap[actualTechnique];
    if (!factories || factories.length === 0) {
      return generateProblem(subject, fallbackTech as Technique, 'easy', 0);
    }

    const hash = hashString(`${subject}-${actualTechnique}-${actualDifficulty}-${actualSeed}`);
    const factory = factories[hash % factories.length];
    const rng = mulberry32(hash ^ (actualSeed * 2654435761));
    const template = factory(rng, actualDifficulty);
    const id = `${subject}-${actualTechnique}-${actualDifficulty}-${hash}-${actualSeed}`;

    return {
      id,
      subject,
      technique: actualTechnique,
      difficulty: actualDifficulty,
      question: template.question,
      answer: template.answer,
      steps: template.steps,
      hints: template.hints,
      timeEstimate: template.timeEstimate,
      itemType: template.itemType,
      choices: template.choices,
      context: template.context,
      stemSvg: template.stemSvg,
      svgChoices: template.svgChoices,
    };
  }
}

/**
 * Get all available integration techniques with their display info.
 */
export function getTechniques(): { id: IntegrationTechnique; name: string; description: string; example: string; icon: string; subtopics: string[] }[] {
  return [
    {
      id: 'basic',
      name: 'Basic Integration',
      description: 'Power rule, constants, sums',
      example: '\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C',
      icon: 'Zap',
      subtopics: ['Power Rule', 'Constant Multiple', 'Sum/Difference Rule'],
    },
    {
      id: 'u-substitution',
      name: 'U-Substitution',
      description: 'Reverse chain rule, change of variables',
      example: '\\int 2x \\cos(x^2) \\, dx',
      icon: 'ArrowRight',
      subtopics: ['Chain Rule Reversal', 'Linear Substitution', 'Exponential Forms'],
    },
    {
      id: 'parts',
      name: 'Integration by Parts',
      description: 'Product rule reversal, LIATE',
      example: '\\int x \\cdot e^x \\, dx',
      icon: 'GitBranch',
      subtopics: ['LIATE Strategy', 'Repeated Parts', 'Cyclic Integrals'],
    },
    {
      id: 'trigonometric',
      name: 'Trigonometric Integrals',
      description: 'Powers of sin/cos, identities',
      example: '\\int \\sin^3(x) \\cos^2(x) \\, dx',
      icon: 'RefreshCw',
      subtopics: ['Odd/Even Powers', 'Half-Angle Identities', 'Product-to-Sum'],
    },
    {
      id: 'trig-substitution',
      name: 'Trig Substitution',
      description: 'sqrt forms, triangle methods',
      example: '\\int \\frac{1}{\\sqrt{a^2-x^2}} \\, dx',
      icon: 'Triangle',
      subtopics: ['\sqrt{a²-x²} Form', '\sqrt{a²+x²} Form', '\sqrt{x²-a²} Form'],
    },
    {
      id: 'partial-fractions',
      name: 'Partial Fractions',
      description: 'Rational function decomposition',
      example: '\\int \\frac{1}{x^2-1} \\, dx',
      icon: 'Split',
      subtopics: ['Linear Factors', 'Repeated Factors', 'Irreducible Quadratics'],
    },
    {
      id: 'improper',
      name: 'Improper Integrals',
      description: 'Infinite bounds, discontinuities',
      example: '\\int_1^{\\infty} \\frac{1}{x^2} \\, dx',
      icon: 'Infinity',
      subtopics: ['Infinite Limits', 'Discontinuous Integrands', 'Comparison Test'],
    },
    {
      id: 'mixed',
      name: 'Mixed Practice',
      description: 'All techniques combined',
      example: '\\text{Random selection}',
      icon: 'Shuffle',
      subtopics: ['All Techniques', 'Adaptive Difficulty', 'Exam Simulation'],
    },
  ];
}

/**
 * Get the total number of problems available for a subject.
 */
export function getProblemCount(subject: Subject = 'integration'): number {
  let count = 0;
  if (subject === 'integration') {
    const techniques: IntegrationTechnique[] = ['basic', 'u-substitution', 'parts', 'trigonometric', 'trig-substitution', 'partial-fractions', 'improper'];
    for (const tech of techniques) {
      for (const diff of ['easy', 'medium', 'hard'] as Difficulty[]) {
        count += problemBank[tech][diff].length;
      }
    }
  } else if (subject === 'differentiation') {
    const techniques: DifferentiationTechnique[] = ['basic-diff', 'product-rule', 'quotient-rule', 'chain-rule', 'implicit', 'logarithmic', 'trig-derivatives', 'higher-order'];
    for (const tech of techniques) {
      for (const diff of ['easy', 'medium', 'hard'] as Difficulty[]) {
        count += diffProblemBank[tech][diff].length;
      }
    }
  } else if (subject === 'limits') {
    const techniques: LimitTechnique[] = ['direct-substitution', 'factoring', 'rationalizing', 'special-trig', 'lhopital', 'infinite-limits', 'limits-at-infinity'];
    for (const tech of techniques) {
      for (const diff of ['easy', 'medium', 'hard'] as Difficulty[]) {
        count += limitProblemBank[tech][diff].length;
      }
    }
  } else if (subject === 'applications-derivatives') {
    const techniques: AppDerivativesTechnique[] = ['optimization', 'related-rates', 'curve-sketching', 'mvt', 'linear-approximation', 'motion', 'economics'];
    for (const tech of techniques) {
      for (const diff of ['easy', 'medium', 'hard'] as Difficulty[]) {
        count += appDiffProblemBank[tech][diff].length;
      }
    }
  } else if (subject === 'applications-integration') {
    const techniques: AppIntegrationTechnique[] = ['area-between-curves', 'volumes', 'arc-length', 'surface-area', 'work', 'center-of-mass', 'averages-probability'];
    for (const tech of techniques) {
      for (const diff of ['easy', 'medium', 'hard'] as Difficulty[]) {
        count += appIntProblemBank[tech][diff].length;
      }
    }
  } else if (subject === 'differential-equations') {
    const techniques: DiffEqTechnique[] = ['separable', 'linear-first-order', 'homogeneous', 'exact', 'second-order', 'undetermined-coefficients', 'variation-of-parameters', 'laplace'];
    for (const tech of techniques) {
      for (const diff of ['easy', 'medium', 'hard'] as Difficulty[]) {
        count += diffEqProblemBank[tech][diff].length;
      }
    }
  } else if (subject === 'sequences-series') {
    const techniques: SeriesTechnique[] = ['geometric-series', 'p-series-telescoping', 'divergence-test', 'ratio-test', 'root-test', 'comparison-tests', 'alternating-series', 'power-series'];
    for (const tech of techniques) {
      for (const diff of ['easy', 'medium', 'hard'] as Difficulty[]) {
        count += seriesProblemBank[tech][diff].length;
      }
    }
  } else if (subject === 'math1-eoc') {
    // Math 1 EOC: procedural — variant count per factory
    for (const factories of Object.values(math1Factories)) {
      count += factories.length * 100;
    }
  } else if (subject === 'math7-eog') {
    // Math 7 EOG: procedural — variant count per factory
    for (const factories of Object.values(math7Factories)) {
      count += factories.length * 100;
    }
  } else if (subject === 'math6-eog') {
    // Math 6 EOG: procedural — variant count per factory
    for (const factories of Object.values(math6Factories)) {
      count += factories.length * 100;
    }
  } else if (subject === 'math8-eog') {
    // Math 8 EOG: procedural — variant count per factory
    for (const factories of Object.values(math8Factories)) {
      count += factories.length * 100;
    }
  } else {
    // Math 3 EOC: procedural — variant count per factory
    for (const factories of Object.values(math3Factories)) {
      count += factories.length * 100;
    }
  }
  return count;
}

/**
 * Get problems per technique count for a subject.
 */
export function getProblemsPerTechnique(subject: Subject = 'integration'): Record<string, number> {
  const result: Record<string, number> = {};
  if (subject === 'integration') {
    const techniques: IntegrationTechnique[] = ['basic', 'u-substitution', 'parts', 'trigonometric', 'trig-substitution', 'partial-fractions', 'improper', 'mixed'];
    for (const tech of techniques) {
      let count = 0;
      for (const diff of ['easy', 'medium', 'hard'] as Difficulty[]) {
        count += problemBank[tech][diff].length;
      }
      result[tech] = count;
    }
  } else if (subject === 'differentiation') {
    const techniques: DifferentiationTechnique[] = ['basic-diff', 'product-rule', 'quotient-rule', 'chain-rule', 'implicit', 'logarithmic', 'trig-derivatives', 'higher-order', 'mixed-diff'];
    for (const tech of techniques) {
      let count = 0;
      for (const diff of ['easy', 'medium', 'hard'] as Difficulty[]) {
        count += diffProblemBank[tech][diff].length;
      }
      result[tech] = count;
    }
  } else if (subject === 'limits') {
    const techniques: LimitTechnique[] = ['direct-substitution', 'factoring', 'rationalizing', 'special-trig', 'lhopital', 'infinite-limits', 'limits-at-infinity', 'mixed-limits'];
    for (const tech of techniques) {
      let count = 0;
      for (const diff of ['easy', 'medium', 'hard'] as Difficulty[]) {
        count += limitProblemBank[tech][diff].length;
      }
      result[tech] = count;
    }
  } else if (subject === 'applications-derivatives') {
    const techniques: AppDerivativesTechnique[] = ['optimization', 'related-rates', 'curve-sketching', 'mvt', 'linear-approximation', 'motion', 'economics', 'mixed-appdiff'];
    for (const tech of techniques) {
      let count = 0;
      for (const diff of ['easy', 'medium', 'hard'] as Difficulty[]) {
        count += appDiffProblemBank[tech][diff].length;
      }
      result[tech] = count;
    }
  } else if (subject === 'applications-integration') {
    const techniques: AppIntegrationTechnique[] = ['area-between-curves', 'volumes', 'arc-length', 'surface-area', 'work', 'center-of-mass', 'averages-probability', 'mixed-appint'];
    for (const tech of techniques) {
      let count = 0;
      for (const diff of ['easy', 'medium', 'hard'] as Difficulty[]) {
        count += appIntProblemBank[tech][diff].length;
      }
      result[tech] = count;
    }
  } else if (subject === 'differential-equations') {
    const techniques: DiffEqTechnique[] = ['separable', 'linear-first-order', 'homogeneous', 'exact', 'second-order', 'undetermined-coefficients', 'variation-of-parameters', 'laplace', 'mixed-diffeq'];
    for (const tech of techniques) {
      let count = 0;
      for (const diff of ['easy', 'medium', 'hard'] as Difficulty[]) {
        count += diffEqProblemBank[tech][diff].length;
      }
      result[tech] = count;
    }
  } else if (subject === 'sequences-series') {
    const techniques: SeriesTechnique[] = ['geometric-series', 'p-series-telescoping', 'divergence-test', 'ratio-test', 'root-test', 'comparison-tests', 'alternating-series', 'power-series', 'mixed-series'];
    for (const tech of techniques) {
      let count = 0;
      for (const diff of ['easy', 'medium', 'hard'] as Difficulty[]) {
        count += seriesProblemBank[tech][diff].length;
      }
      result[tech] = count;
    }
  } else if (subject === 'math1-eoc') {
    // Math 1 EOC: procedural factories — report the variant count per technique
    for (const [tech, factories] of Object.entries(math1Factories)) {
      result[tech] = factories.length * 100; // each factory yields unlimited seeded variants
    }
    result['mixed-m1'] = 700;
  } else if (subject === 'math7-eog') {
    // Math 7 EOG: procedural factories — report the variant count per technique
    for (const [tech, factories] of Object.entries(math7Factories)) {
      result[tech] = factories.length * 100;
    }
    result['mixed-g7'] = 600;
  } else if (subject === 'math6-eog') {
    // Math 6 EOG: procedural factories — report the variant count per technique
    for (const [tech, factories] of Object.entries(math6Factories)) {
      result[tech] = factories.length * 100;
    }
    result['mixed-g6'] = 600;
  } else if (subject === 'math8-eog') {
    // Math 8 EOG: procedural factories — report the variant count per technique
    for (const [tech, factories] of Object.entries(math8Factories)) {
      result[tech] = factories.length * 100;
    }
    result['mixed-g8'] = 500;
  } else {
    // Math 3 EOC: procedural factories — report the variant count per technique
    for (const [tech, factories] of Object.entries(math3Factories)) {
      result[tech] = factories.length * 100;
    }
    result['mixed-m3'] = 600;
  }
  return result;
}

/**
 * Get techniques for a subject.
 */
export function getTechniquesForSubject(subject: Subject): { id: string; name: string; description: string; example: string; icon: string; subtopics: string[] }[] {
  if (subject === 'integration') return getTechniques();
  if (subject === 'differentiation') return getDifferentiationTechniques();
  if (subject === 'limits') return getLimitTechniques();
  if (subject === 'applications-derivatives') return getAppDerivativesTechniques();
  if (subject === 'applications-integration') return getAppIntegrationTechniques();
  if (subject === 'differential-equations') return getDiffEqTechniques();
  if (subject === 'sequences-series') return getSeriesTechniques();
  if (subject === 'math1-eoc') return getMath1Techniques();
  if (subject === 'math6-eog') return getMath6Techniques();
  if (subject === 'math7-eog') return getMath7Techniques();
  if (subject === 'math8-eog') return getMath8Techniques();
  return getMath3Techniques();
}

/**
 * Check if a technique is valid for a subject.
 */
export function isValidTechnique(subject: Subject, technique: string): boolean {
  const techniques = getTechniquesForSubject(subject);
  return techniques.some(t => t.id === technique);
}
