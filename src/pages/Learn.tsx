import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  ArrowRight,
  GitBranch,
  RefreshCw,
  Triangle,
  Split,
  Infinity,
  Clock,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Target,
  X,
  Zap,
  TrendingUp,
  Activity,
  LineChart,
  Equal,
  Minus,
  MoveRight,
  DollarSign,
  Layers,
  Rotate3d,
  Spline,
  Globe,
  Weight,
  Crosshair,
  Percent,
  Repeat,
  Puzzle,
  Waves,
  Sigma,
  Hash,
  ListOrdered,
  AlertTriangle,
  Divide,
  Sprout,
  Scale,
  ArrowLeftRight,
  Superscript,
} from 'lucide-react'
import MathDisplay from '@/components/MathDisplay'
import type { Subject } from '@/lib/problemGenerator'
/* ─────────────────────── types ─────────────────────── */
interface SolutionStep {
  number: number
  description: string
  math: string
}
interface WorkedExample {
  problem: string
  problemDescription?: string
  steps: SolutionStep[]
  finalAnswer: string
}
interface TechniqueData {
  id: string
  title: string
  icon: React.ElementType
  description: string
  keyFormula: {
    label: string
    formula: string
    explanation: string
  }
  whenToUse: string[]
  examples: WorkedExample[]
  tips: string[]
}
/* ─────────────────────── easing ─────────────────────── */
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]
const easeOutQuart = [0.25, 1, 0.5, 1] as [number, number, number, number]
/* ─────────────────────── technique data ─────────────────────── */
const techniques: TechniqueData[] = [
  {
    id: 'basic',
    title: 'Basic Integration Rules',
    icon: BookOpen,
    description:
      'The foundation of all integration. Master the power rule, constant multiple rule, and sum/difference rule before moving to advanced techniques.',
    keyFormula: {
      label: 'Power Rule',
      formula: '\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)',
      explanation: 'Add one to the exponent, divide by the new exponent, and add the constant of integration.',
    },
    whenToUse: [
      'The integrand is a polynomial (sum of power terms).',
      'The integrand is a constant multiplied by a power of x.',
      'You can split the integrand into simpler terms using the sum/difference rule.',
      'Special cases: use ln for 1/x, e^x stays e^x, and a^x / ln(a) for exponential a^x.',
    ],
    examples: [
      {
        problem: '\\int 3x^2 \\, dx',
        steps: [
          { number: 1, description: 'Apply the constant multiple rule: pull the 3 outside.', math: '3 \\int x^2 \\, dx' },
          { number: 2, description: 'Apply the power rule: increase exponent by 1 and divide.', math: '3 \\cdot \\frac{x^3}{3} + C' },
          { number: 3, description: 'Simplify the coefficient.', math: 'x^3 + C' },
        ],
        finalAnswer: 'x^3 + C',
      },
      {
        problem: '\\int (x^3 + 2x) \\, dx',
        steps: [
          { number: 1, description: 'Split into two integrals using the sum rule.', math: '\\int x^3 \\, dx + \\int 2x \\, dx' },
          { number: 2, description: 'Integrate each term with the power rule.', math: '\\frac{x^4}{4} + x^2 + C' },
        ],
        finalAnswer: '\\frac{x^4}{4} + x^2 + C',
      },
      {
        problem: '\\int \\frac{1}{x} \\, dx',
        steps: [
          { number: 1, description: 'Recognize this as the special case n = -1 where the power rule does not apply.', math: '\\int \\frac{1}{x} \\, dx = \\ln|x| + C' },
        ],
        finalAnswer: '\\ln|x| + C',
      },
    ],
    tips: [
      'Never forget the constant of integration (+C) for indefinite integrals.',
      'The power rule fails when n = -1; use the natural log rule instead.',
      'Always check your answer by differentiating — you should recover the original integrand.',
    ],
  },
  {
    id: 'u-substitution',
    title: 'U-Substitution',
    icon: ArrowRight,
    description:
      'The reverse of the chain rule. When the integrand contains a composite function and the derivative of the inner function is present (up to a constant factor), u-substitution simplifies the integral.',
    keyFormula: {
      label: 'Substitution Formula',
      formula: '\\int f(g(x)) \\cdot g\'(x) \\, dx = \\int f(u) \\, du',
      explanation: 'Let u = g(x), then du = g\'(x)dx. Substitute, integrate with respect to u, then back-substitute.',
    },
    whenToUse: [
      'The integrand is a composite function multiplied by the derivative of the inner function.',
      'You can spot an inner function whose derivative also appears (up to a constant).',
      'Common patterns: x inside an exponent, x inside a trig function, x inside a root.',
    ],
    examples: [
      {
        problem: '\\int 2x \\cos(x^2) \\, dx',
        steps: [
          { number: 1, description: 'Identify the inner function and set u = x^2.', math: 'u = x^2' },
          { number: 2, description: 'Compute du = 2x dx, which is present in the integrand.', math: 'du = 2x \\, dx' },
          { number: 3, description: 'Substitute u and du into the integral.', math: '\\int \\cos(u) \\, du' },
          { number: 4, description: 'Integrate with respect to u.', math: '\\sin(u) + C' },
          { number: 5, description: 'Back-substitute u = x^2 to get the final answer.', math: '\\sin(x^2) + C' },
        ],
        finalAnswer: '\\sin(x^2) + C',
      },
      {
        problem: '\\int x \\cdot e^{x^2} \\, dx',
        steps: [
          { number: 1, description: 'Let u = x^2, the exponent of e.', math: 'u = x^2' },
          { number: 2, description: 'Then du = 2x dx, so x dx = du/2.', math: 'du = 2x \\, dx \\Rightarrow x \\, dx = \\frac{du}{2}' },
          { number: 3, description: 'Rewrite the integral in terms of u.', math: '\\frac{1}{2} \\int e^u \\, du' },
          { number: 4, description: 'Integrate e^u and multiply by 1/2.', math: '\\frac{1}{2} e^u + C' },
          { number: 5, description: 'Substitute back u = x^2.', math: '\\frac{1}{2} e^{x^2} + C' },
        ],
        finalAnswer: '\\frac{1}{2} e^{x^2} + C',
      },
      {
        problem: '\\int \\frac{3x^2}{x^3 + 1} \\, dx',
        steps: [
          { number: 1, description: 'Let u = x^3 + 1, the denominator.', math: 'u = x^3 + 1' },
          { number: 2, description: 'Then du = 3x^2 dx, which matches the numerator exactly.', math: 'du = 3x^2 \\, dx' },
          { number: 3, description: 'Substitute to get a simple logarithmic integral.', math: '\\int \\frac{1}{u} \\, du' },
          { number: 4, description: 'Integrate and substitute back.', math: '\\ln|u| + C = \\ln|x^3 + 1| + C' },
        ],
        finalAnswer: '\\ln|x^3 + 1| + C',
      },
    ],
    tips: [
      'Look for composite functions — the inner function becomes u.',
      'Check that the derivative of u appears (up to a constant factor) in the remaining integrand.',
      'If du does not appear after choosing u, try a different substitution or another technique.',
    ],
  },
  {
    id: 'parts',
    title: 'Integration by Parts',
    icon: GitBranch,
    description:
      'The reverse of the product rule. Use when integrating a product of two different function types. The LIATE strategy helps you choose which part to set as u.',
    keyFormula: {
      label: 'By Parts Formula',
      formula: '\\int u \\, dv = uv - \\int v \\, du',
      explanation: 'Choose u using LIATE (Log, Inverse trig, Algebraic, Trig, Exponential). dv is the rest.',
    },
    whenToUse: [
      'The integrand is a product of two different types of functions.',
      'One factor becomes simpler when differentiated (set as u).',
      'The other factor is easy to integrate (set as dv).',
      'Classic cases: x times e^x, x times ln(x), x times sin(x).',
    ],
    examples: [
      {
        problem: '\\int x \\cdot e^x \\, dx',
        steps: [
          { number: 1, description: 'Choose u and dv using LIATE (Algebraic before Exponential).', math: 'u = x, \\quad dv = e^x \\, dx' },
          { number: 2, description: 'Compute du and v.', math: 'du = dx, \\quad v = e^x' },
          { number: 3, description: 'Apply the by parts formula.', math: '\\int x e^x \\, dx = x e^x - \\int e^x \\, dx' },
          { number: 4, description: 'Evaluate the remaining integral.', math: 'x e^x - e^x + C' },
          { number: 5, description: 'Factor for a cleaner form.', math: 'e^x(x - 1) + C' },
        ],
        finalAnswer: 'e^x(x - 1) + C',
      },
      {
        problem: '\\int x \\ln(x) \\, dx',
        steps: [
          { number: 1, description: 'Using LIATE, Logarithmic comes before Algebraic, so set u = ln(x).', math: 'u = \\ln(x), \\quad dv = x \\, dx' },
          { number: 2, description: 'Compute du and v.', math: 'du = \\frac{1}{x} \\, dx, \\quad v = \\frac{x^2}{2}' },
          { number: 3, description: 'Apply the by parts formula.', math: '\\int x \\ln(x) \\, dx = \\frac{x^2}{2} \\ln(x) - \\int \\frac{x^2}{2} \\cdot \\frac{1}{x} \\, dx' },
          { number: 4, description: 'Simplify the remaining integral.', math: '\\frac{x^2}{2} \\ln(x) - \\frac{1}{2} \\int x \\, dx' },
          { number: 5, description: 'Integrate and simplify.', math: '\\frac{x^2}{2} \\ln(x) - \\frac{x^2}{4} + C' },
        ],
        finalAnswer: '\\frac{x^2}{2} \\ln(x) - \\frac{x^2}{4} + C',
      },
    ],
    tips: [
      'Use the LIATE mnemonic to pick u: Logarithmic > Inverse trig > Algebraic > Trigonometric > Exponential.',
      'Sometimes you need to apply integration by parts twice (e.g., x^2 e^x).',
      'In circular cases like e^x sin(x), applying by parts twice brings back the original integral — solve algebraically.',
    ],
  },
  {
    id: 'trigonometric',
    title: 'Trigonometric Integrals',
    icon: RefreshCw,
    description:
      'Integrals involving powers of sine, cosine, tangent, and secant. The strategy depends on whether the powers are odd or even, and Pythagorean identities are essential.',
    keyFormula: {
      label: 'General Form',
      formula: '\\int \\sin^m(x) \\cos^n(x) \\, dx',
      explanation: 'Strategy: if sin is odd, save one sin and convert rest to cos. If cos is odd, save one cos and convert rest to sin. If both even, use half-angle identities.',
    },
    whenToUse: [
      'The integrand contains powers of sine and cosine.',
      'The integrand contains powers of tangent and secant (use 1 + tan^2 = sec^2).',
      'Product-to-sum identities help with products like sin(mx)cos(nx).',
    ],
    examples: [
      {
        problem: '\\int \\sin^2(x) \\, dx',
        steps: [
          { number: 1, description: 'Use the half-angle identity for sin^2(x).', math: '\\sin^2(x) = \\frac{1 - \\cos(2x)}{2}' },
          { number: 2, description: 'Substitute and split the integral.', math: '\\int \\frac{1}{2} \\, dx - \\frac{1}{2} \\int \\cos(2x) \\, dx' },
          { number: 3, description: 'Integrate each term.', math: '\\frac{x}{2} - \\frac{\\sin(2x)}{4} + C' },
        ],
        finalAnswer: '\\frac{x}{2} - \\frac{\\sin(2x)}{4} + C',
      },
      {
        problem: '\\int \\tan(x) \\, dx',
        steps: [
          { number: 1, description: 'Rewrite tan(x) as sin(x)/cos(x).', math: '\\int \\frac{\\sin(x)}{\\cos(x)} \\, dx' },
          { number: 2, description: 'Let u = cos(x), so du = -sin(x)dx.', math: 'u = \\cos(x), \\quad du = -\\sin(x) \\, dx' },
          { number: 3, description: 'Substitute and integrate.', math: '-\\int \\frac{1}{u} \\, du = -\\ln|u| + C' },
          { number: 4, description: 'Back-substitute.', math: '-\\ln|\\cos(x)| + C = \\ln|\\sec(x)| + C' },
        ],
        finalAnswer: '\\ln|\\sec(x)| + C',
      },
      {
        problem: '\\int \\sin(3x) \\cos(2x) \\, dx',
        steps: [
          { number: 1, description: 'Use the product-to-sum identity: sin(A)cos(B) = (1/2)[sin(A-B) + sin(A+B)].', math: '\\sin(3x)\\cos(2x) = \\frac{1}{2}[\\sin(x) + \\sin(5x)]' },
          { number: 2, description: 'Split and integrate each sine term.', math: '\\frac{1}{2} \\int \\sin(x) \\, dx + \\frac{1}{2} \\int \\sin(5x) \\, dx' },
          { number: 3, description: 'Evaluate both integrals.', math: '-\\frac{\\cos(x)}{2} - \\frac{\\cos(5x)}{10} + C' },
        ],
        finalAnswer: '-\\frac{\\cos(x)}{2} - \\frac{\\cos(5x)}{10} + C',
      },
    ],
    tips: [
      'When one of sin/cos has an odd power, save one factor for du and convert the rest.',
      'When both powers are even, half-angle identities are your friend.',
      'For tan/sec integrals, the identity 1 + tan^2(x) = sec^2(x) is essential.',
    ],
  },
  {
    id: 'trig-substitution',
    title: 'Trigonometric Substitution',
    icon: Triangle,
    description:
      'Used when the integrand contains expressions of the form sqrt(a^2 - x^2), sqrt(a^2 + x^2), or sqrt(x^2 - a^2). A substitution with a trig function simplifies the radical.',
    keyFormula: {
      label: 'The Three Substitutions',
      formula: '\\sqrt{a^2 - x^2} \\to x = a\\sin(\\theta) \\quad \\sqrt{a^2 + x^2} \\to x = a\\tan(\\theta) \\quad \\sqrt{x^2 - a^2} \\to x = a\\sec(\\theta)',
      explanation: 'Each substitution leverages a Pythagorean identity to eliminate the square root. Always draw the reference triangle.',
    },
    whenToUse: [
      'The integrand contains sqrt(a^2 - x^2): use x = a sin(theta).',
      'The integrand contains sqrt(a^2 + x^2): use x = a tan(theta).',
      'The integrand contains sqrt(x^2 - a^2): use x = a sec(theta).',
      'After substitution, use Pythagorean identities to simplify the radical.',
    ],
    examples: [
      {
        problem: '\\int \\frac{1}{\\sqrt{9 - x^2}} \\, dx',
        steps: [
          { number: 1, description: 'Recognize sqrt(a^2 - x^2) with a = 3. Substitute x = 3sin(theta).', math: 'x = 3\\sin(\\theta), \\quad dx = 3\\cos(\\theta) \\, d\\theta' },
          { number: 2, description: 'Substitute into the radical.', math: '\\sqrt{9 - 9\\sin^2(\\theta)} = 3\\sqrt{1 - \\sin^2(\\theta)} = 3\\cos(\\theta)' },
          { number: 3, description: 'Rewrite the integral.', math: '\\int \\frac{3\\cos(\\theta)}{3\\cos(\\theta)} \\, d\\theta = \\int 1 \\, d\\theta' },
          { number: 4, description: 'Integrate.', math: '\\theta + C' },
          { number: 5, description: 'Substitute back: theta = arcsin(x/3).', math: '\\arcsin\\left(\\frac{x}{3}\\right) + C' },
        ],
        finalAnswer: '\\arcsin\\left(\\frac{x}{3}\\right) + C',
      },
      {
        problem: '\\int \\frac{1}{x^2 \\sqrt{x^2 + 4}} \\, dx',
        steps: [
          { number: 1, description: 'Recognize sqrt(x^2 + a^2) with a = 2. Substitute x = 2tan(theta).', math: 'x = 2\\tan(\\theta), \\quad dx = 2\\sec^2(\\theta) \\, d\\theta' },
          { number: 2, description: 'Simplify the radical using 1 + tan^2 = sec^2.', math: '\\sqrt{4\\tan^2(\\theta) + 4} = 2\\sec(\\theta)' },
          { number: 3, description: 'Rewrite the full integral.', math: '\\int \\frac{2\\sec^2(\\theta)}{4\\tan^2(\\theta) \\cdot 2\\sec(\\theta)} \\, d\\theta = \\frac{1}{4} \\int \\frac{\\sec(\\theta)}{\\tan^2(\\theta)} \\, d\\theta' },
          { number: 4, description: 'Simplify to sin and cos, then integrate.', math: '\\frac{1}{4} \\int \\frac{\\cos(\\theta)}{\\sin^2(\\theta)} \\, d\\theta = -\\frac{1}{4\\sin(\\theta)} + C' },
          { number: 5, description: 'From the triangle, sin(theta) = x / sqrt(x^2+4).', math: '-\\frac{\\sqrt{x^2 + 4}}{4x} + C' },
        ],
        finalAnswer: '-\\frac{\\sqrt{x^2 + 4}}{4x} + C',
      },
    ],
    tips: [
      'Always draw the reference triangle — it helps you substitute back to x at the end.',
      'Memorize the three forms: sqrt(a^2 - x^2), sqrt(a^2 + x^2), sqrt(x^2 - a^2).',
      'Do not forget to change dx to include the derivative of the substitution.',
    ],
  },
  {
    id: 'partial-fractions',
    title: 'Partial Fractions',
    icon: Split,
    description:
      'Decompose a rational function into simpler fractions that are easier to integrate. Factor the denominator completely, then write the decomposition with unknown coefficients.',
    keyFormula: {
      label: 'Decomposition (Distinct Linear)',
      formula: '\\frac{P(x)}{(x-a)(x-b)} = \\frac{A}{x-a} + \\frac{B}{x-b}',
      explanation: 'Solve for A and B by clearing denominators and equating coefficients or plugging in strategic x-values.',
    },
    whenToUse: [
      'The integrand is a rational function (polynomial / polynomial).',
      'The denominator can be factored into linear (or irreducible quadratic) factors.',
      'If the numerator degree is >= denominator degree, perform polynomial long division first.',
      'Repeated linear factors need separate terms for each power.',
    ],
    examples: [
      {
        problem: '\\int \\frac{3x + 1}{(x - 1)(x + 2)} \\, dx',
        steps: [
          { number: 1, description: 'Set up the partial fraction decomposition.', math: '\\frac{3x + 1}{(x-1)(x+2)} = \\frac{A}{x-1} + \\frac{B}{x+2}' },
          { number: 2, description: 'Multiply both sides by the denominator.', math: '3x + 1 = A(x+2) + B(x-1)' },
          { number: 3, description: 'Plug in x = 1 to find A.', math: 'x = 1: \\quad 4 = 3A \\Rightarrow A = \\frac{4}{3}' },
          { number: 4, description: 'Plug in x = -2 to find B.', math: 'x = -2: \\quad -5 = -3B \\Rightarrow B = \\frac{5}{3}' },
          { number: 5, description: 'Rewrite and integrate each term.', math: '\\frac{4}{3} \\int \\frac{1}{x-1} \\, dx + \\frac{5}{3} \\int \\frac{1}{x+2} \\, dx' },
          { number: 6, description: 'Evaluate both logarithmic integrals.', math: '\\frac{4}{3}\\ln|x-1| + \\frac{5}{3}\\ln|x+2| + C' },
        ],
        finalAnswer: '\\frac{4}{3}\\ln|x-1| + \\frac{5}{3}\\ln|x+2| + C',
      },
      {
        problem: '\\int \\frac{1}{x^2 - 1} \\, dx',
        steps: [
          { number: 1, description: 'Factor the denominator as a difference of squares.', math: 'x^2 - 1 = (x-1)(x+1)' },
          { number: 2, description: 'Set up the decomposition.', math: '\\frac{1}{(x-1)(x+1)} = \\frac{A}{x-1} + \\frac{B}{x+1}' },
          { number: 3, description: 'Clear denominators and solve for A and B.', math: '1 = A(x+1) + B(x-1)' },
          { number: 4, description: 'x = 1 gives A = 1/2; x = -1 gives B = -1/2.', math: 'A = \\frac{1}{2}, \\quad B = -\\frac{1}{2}' },
          { number: 5, description: 'Integrate each logarithmic term.', math: '\\frac{1}{2}\\ln|x-1| - \\frac{1}{2}\\ln|x+1| + C' },
        ],
        finalAnswer: '\\frac{1}{2}\\ln|x-1| - \\frac{1}{2}\\ln|x+1| + C',
      },
    ],
    tips: [
      'Always factor the denominator completely before setting up the decomposition.',
      'If the numerator has degree >= denominator, do polynomial long division first.',
      'For repeated linear factors like (x-a)^2, include A/(x-a) + B/(x-a)^2.',
    ],
  },
  {
    id: 'improper',
    title: 'Improper Integrals',
    icon: Infinity,
    description:
      'Integrals with infinite limits of integration or integrands that have infinite discontinuities within the interval. They are evaluated as limits of proper integrals.',
    keyFormula: {
      label: 'Type 1 (Infinite Limit)',
      formula: '\\int_a^{\\infty} f(x) \\, dx = \\lim_{t \\to \\infty} \\int_a^t f(x) \\, dx',
      explanation: 'Replace infinity with a variable limit t, evaluate the proper integral, then take the limit as t approaches infinity.',
    },
    whenToUse: [
      'One or both limits of integration are infinite.',
      'The integrand has a vertical asymptote within [a, b].',
      'Always split the integral at any discontinuity inside the interval.',
      'The p-test: integral of 1/x^p from 1 to infinity converges if p > 1.',
    ],
    examples: [
      {
        problem: '\\int_1^{\\infty} \\frac{1}{x^2} \\, dx',
        steps: [
          { number: 1, description: 'Replace the infinite limit with a variable limit.', math: '\\lim_{t \\to \\infty} \\int_1^t \\frac{1}{x^2} \\, dx' },
          { number: 2, description: 'Evaluate the proper integral using the power rule.', math: '\\lim_{t \\to \\infty} \\left[ -\\frac{1}{x} \\right]_1^t' },
          { number: 3, description: 'Substitute the bounds.', math: '\\lim_{t \\to \\infty} \\left( -\\frac{1}{t} + 1 \\right)' },
          { number: 4, description: 'Take the limit. As t goes to infinity, 1/t goes to 0.', math: '0 + 1 = 1' },
        ],
        finalAnswer: '1 \\quad \\text{(converges)}',
      },
      {
        problem: '\\int_0^1 \\frac{1}{\\sqrt{x}} \\, dx',
        steps: [
          { number: 1, description: 'The integrand has a vertical asymptote at x = 0. Rewrite as a limit.', math: '\\lim_{t \\to 0^+} \\int_t^1 x^{-1/2} \\, dx' },
          { number: 2, description: 'Integrate using the power rule.', math: '\\lim_{t \\to 0^+} \\left[ 2\\sqrt{x} \\right]_t^1' },
          { number: 3, description: 'Substitute the bounds.', math: '\\lim_{t \\to 0^+} (2 - 2\\sqrt{t})' },
          { number: 4, description: 'Take the limit. As t goes to 0+, sqrt(t) goes to 0.', math: '2 - 0 = 2' },
        ],
        finalAnswer: '2 \\quad \\text{(converges)}',
      },
    ],
    tips: [
      'Always use a limit — never write infinity as if it were a number you plug in.',
      'If the integrand is discontinuous inside [a, b], split at the discontinuity.',
      'p-series test: integral from 1 to infinity of 1/x^p converges if and only if p > 1.',
    ],
  },
]
/* ─────────────────────── quick reference formulas ─────────────────────── */
const diffTechniques: TechniqueData[] = [  {
    id: 'basic-diff',
    title: 'Basic Differentiation Rules',
    icon: BookOpen,
    description: 'Apply the power rule, constant rule, and sum/difference rules to differentiate polynomials and power functions.',
    keyFormula: {
      label: 'Apply the power rule, constant rule, and sum/difference rules to differentiate polynomials and power functions.',
      formula: '\\frac{d}{dx}(x^n) = nx^{n-1}',
      explanation: '',
    },
    whenToUse: [
      'You have a polynomial or power function to differentiate.',
      'The function involves constants, sums, or differences.',
      'You need to apply the power rule, constant rule, or sum/difference rule.',
    ],
    examples: [
      {
        problem: '\\frac{d}{dx}(5x^3 - 2x + 7)',
        steps: [
          { number: 1, description: 'Differentiate each term using the sum/difference rule.', math: '\\frac{d}{dx}(5x^3) - \\frac{d}{dx}(2x) + \\frac{d}{dx}(7)' },
          { number: 2, description: 'Apply the power rule and constant rule to each term.', math: '15x^2 - 2 + 0 = 15x^2 - 2' },
          ],
        finalAnswer: '15x^2 - 2 + 0 = 15x^2 - 2',
      },
      {
        problem: '\\frac{d}{dx}\\left(\\frac{3}{\\sqrt{x}}\\right)',
        steps: [
          { number: 1, description: 'Rewrite using a negative exponent.', math: '3x^{-1/2}' },
          { number: 2, description: 'Apply the power rule.', math: '3 \\cdot (-\\frac{1}{2})x^{-3/2} = -\\frac{3}{2}x^{-3/2}' },
          ],
        finalAnswer: '3 \\cdot (-\\frac{1}{2})x^{-3/2} = -\\frac{3}{2}x^{-3/2}',
      },
    ],
    tips: [
      'Rewrite radicals and reciprocals as powers before differentiating.',
      'The derivative of any constant is always zero.',
      'Check your answer by integrating it — you should get back the original function.',
    ],
  },
  {
    id: 'product-rule',
    title: 'Product Rule',
    icon: GitBranch,
    description: 'Use the product rule to differentiate functions that are products of two functions.',
    keyFormula: {
      label: 'Use the product rule to differentiate functions that are products of two functions.',
      formula: "\\frac{d}{dx}(uv) = u'v + uv'",
      explanation: '',
    },
    whenToUse: [
      'You have two functions multiplied together.',
      'The function is a product of an algebraic and transcendental function.',
      'Simple rules (power, chain) do not directly apply.',
    ],
    examples: [
      {
        problem: '\\frac{d}{dx}(x^2 \\cdot e^x)',
        steps: [
          { number: 1, description: 'Identify u and v.', math: 'u = x^2, \\quad v = e^x' },
          { number: 2, description: 'Find the derivatives of u and v.', math: "u' = 2x, \\quad v' = e^x" },
          { number: 3, description: 'Apply the product rule: (uv)\' = u\'v + uv\'.', math: '2x \\cdot e^x + x^2 \\cdot e^x = e^x(2x + x^2)' },
          ],
        finalAnswer: '2x \\cdot e^x + x^2 \\cdot e^x = e^x(2x + x^2)',
      },
      {
        problem: '\\frac{d}{dx}(x \\cdot \\ln x)',
        steps: [
          { number: 1, description: 'Identify u and v.', math: 'u = x, \\quad v = \\ln x' },
          { number: 2, description: 'Find derivatives.', math: "u' = 1, \\quad v' = \\frac{1}{x}" },
          { number: 3, description: 'Apply product rule and simplify.', math: '1 \\cdot \\ln x + x \\cdot \\frac{1}{x} = \\ln x + 1' },
          ],
        finalAnswer: '1 \\cdot \\ln x + x \\cdot \\frac{1}{x} = \\ln x + 1',
      },
    ],
    tips: [
      "Don't forget to differentiate both functions — a common error is only differentiating one.",
      'For products of three or more functions, group two together first.',
      'Look for opportunities to factor the final answer.',
    ],
  },
  {
    id: 'quotient-rule',
    title: 'Quotient Rule',
    icon: Split,
    description: 'Apply the quotient rule to differentiate rational functions and fractions.',
    keyFormula: {
      label: 'Apply the quotient rule to differentiate rational functions and fractions.',
      formula: "\\frac{d}{dx}\\left(\\frac{u}{v}\\right) = \\frac{u'v - uv'}{v^2}",
      explanation: '',
    },
    whenToUse: [
      'You have one function divided by another.',
      'The function is a rational function (polynomial divided by polynomial).',
      'The denominator is not a simple constant.',
    ],
    examples: [
      {
        problem: '\\frac{d}{dx}\\left(\\frac{x^2}{x+1}\\right)',
        steps: [
          { number: 1, description: 'Identify u and v.', math: 'u = x^2, \\quad v = x + 1' },
          { number: 2, description: 'Find derivatives.', math: "u' = 2x, \\quad v' = 1" },
          { number: 3, description: 'Apply quotient rule.', math: '\\frac{2x(x+1) - x^2(1)}{(x+1)^2} = \\frac{x^2 + 2x}{(x+1)^2}' },
          ],
        finalAnswer: '\\frac{2x(x+1) - x^2(1)}{(x+1)^2} = \\frac{x^2 + 2x}{(x+1)^2}',
      },
      {
        problem: '\\frac{d}{dx}\\left(\\frac{e^x}{x}\\right)',
        steps: [
          { number: 1, description: 'Identify u and v.', math: 'u = e^x, \\quad v = x' },
          { number: 2, description: 'Find derivatives.', math: "u' = e^x, \\quad v' = 1" },
          { number: 3, description: 'Apply quotient rule and factor.', math: '\\frac{e^x \\cdot x - e^x \\cdot 1}{x^2} = \\frac{e^x(x-1)}{x^2}' },
          ],
        finalAnswer: '\\frac{e^x \\cdot x - e^x \\cdot 1}{x^2} = \\frac{e^x(x-1)}{x^2}',
      },
    ],
    tips: [
      'The order matters: u\'v - uv\' (not uv\' - u\'v).',
      'Always simplify the numerator by expanding and combining like terms.',
      'If the numerator is 1, remember u = 1 means u\' = 0.',
    ],
  },
  {
    id: 'chain-rule',
    title: 'Chain Rule',
    icon: ArrowRight,
    description: 'Use the chain rule to differentiate composite functions.',
    keyFormula: {
      label: 'Use the chain rule to differentiate composite functions.',
      formula: "\\frac{d}{dx}f(g(x)) = f'(g(x)) \\cdot g'(x)",
      explanation: '',
    },
    whenToUse: [
      'You have a composite function (function inside a function).',
      'The function involves nested operations like sin(x²), e^(3x), or √(x+1).',
      'Basic rules do not apply directly to the overall function.',
    ],
    examples: [
      {
        problem: '\\frac{d}{dx}\\sin(3x)',
        steps: [
          { number: 1, description: 'Identify outer and inner functions.', math: 'f(u) = \\sin u, \\quad u = 3x' },
          { number: 2, description: 'Find derivatives.', math: "f'(u) = \\cos u, \\quad u' = 3" },
          { number: 3, description: 'Apply chain rule.', math: '\\cos(3x) \\cdot 3 = 3\\cos(3x)' },
          ],
        finalAnswer: '\\cos(3x) \\cdot 3 = 3\\cos(3x)',
      },
      {
        problem: '\\frac{d}{dx}(x^2 + 1)^5',
        steps: [
          { number: 1, description: 'Identify outer and inner functions.', math: 'f(u) = u^5, \\quad u = x^2 + 1' },
          { number: 2, description: 'Find derivatives.', math: "f'(u) = 5u^4, \\quad u' = 2x" },
          { number: 3, description: 'Apply chain rule.', math: '5(x^2+1)^4 \\cdot 2x = 10x(x^2+1)^4' },
          ],
        finalAnswer: '5(x^2+1)^4 \\cdot 2x = 10x(x^2+1)^4',
      },
    ],
    tips: [
      'Work from the outside in — differentiate the outer function first.',
      "Don't forget to multiply by the derivative of the inner function.",
      'For multiple layers, apply the chain rule repeatedly.',
    ],
  },
  {
    id: 'implicit',
    title: 'Implicit Differentiation',
    icon: RefreshCw,
    description: 'Differentiate implicitly defined functions without solving for y explicitly.',
    keyFormula: {
      label: 'Differentiate implicitly defined functions without solving for y explicitly.',
      formula: '\\frac{d}{dx}(y^n) = ny^{n-1} \\frac{dy}{dx}',
      explanation: '',
    },
    whenToUse: [
      'The equation defines y implicitly as a function of x.',
      'You cannot easily solve for y in terms of x.',
      'The equation involves both x and y mixed together.',
    ],
    examples: [
      {
        problem: '\\text{Find } \\frac{dy}{dx} \\text{ if } x^2 + y^2 = 25',
        steps: [
          { number: 1, description: 'Differentiate both sides with respect to x.', math: '2x + 2y\\frac{dy}{dx} = 0' },
          { number: 2, description: 'Solve for dy/dx.', math: '\\frac{dy}{dx} = -\\frac{x}{y}' },
          ],
        finalAnswer: '\\frac{dy}{dx} = -\\frac{x}{y}',
      },
      {
        problem: '\\text{Find } \\frac{dy}{dx} \\text{ if } xy = 4',
        steps: [
          { number: 1, description: 'Use product rule on xy.', math: 'y + x\\frac{dy}{dx} = 0' },
          { number: 2, description: 'Solve for dy/dx.', math: '\\frac{dy}{dx} = -\\frac{y}{x}' },
          ],
        finalAnswer: '\\frac{dy}{dx} = -\\frac{y}{x}',
      },
    ],
    tips: [
      'Remember: d/dx(y²) = 2y · dy/dx by the chain rule.',
      'Group all dy/dx terms on one side before solving.',
      'The final answer may contain both x and y — that is okay.',
    ],
  },
  {
    id: 'logarithmic',
    title: 'Logarithmic Differentiation',
    icon: Infinity,
    description: 'Simplify complex differentiation using logarithmic properties.',
    keyFormula: {
      label: 'Simplify complex differentiation using logarithmic properties.',
      formula: '\\ln y = \\ln f(x) \\Rightarrow \\frac{y\'}{y} = \\frac{f\'(x)}{f(x)}',
      explanation: '',
    },
    whenToUse: [
      'The function has a variable in both the base and the exponent (e.g., x^x).',
      'The function is a complex product or quotient of many terms.',
      'Direct application of product/quotient/chain rules is cumbersome.',
    ],
    examples: [
      {
        problem: '\\text{Find } \\frac{dy}{dx} \\text{ if } y = x^x',
        steps: [
          { number: 1, description: 'Take the natural logarithm of both sides.', math: '\\ln y = x \\ln x' },
          { number: 2, description: 'Differentiate implicitly (use product rule on right).', math: '\\frac{1}{y}\\frac{dy}{dx} = \\ln x + 1' },
          { number: 3, description: 'Solve for dy/dx.', math: '\\frac{dy}{dx} = y(\\ln x + 1) = x^x(\\ln x + 1)' },
          ],
        finalAnswer: '\\frac{dy}{dx} = y(\\ln x + 1) = x^x(\\ln x + 1)',
      },
      {
        problem: '\\text{Find } \\frac{dy}{dx} \\text{ if } y = (x^2+1)^{\\sin x}',
        steps: [
          { number: 1, description: 'Take ln of both sides.', math: '\\ln y = \\sin x \\cdot \\ln(x^2 + 1)' },
          { number: 2, description: 'Differentiate using product rule.', math: '\\frac{1}{y}\\frac{dy}{dx} = \\cos x \\ln(x^2+1) + \\sin x \\cdot \\frac{2x}{x^2+1}' },
          { number: 3, description: 'Solve for dy/dx.', math: '\\frac{dy}{dx} = y\\left[\\cos x \\ln(x^2+1) + \\frac{2x\\sin x}{x^2+1}\\right]' },
          ],
        finalAnswer: '\\frac{dy}{dx} = y\\left[\\cos x \\ln(x^2+1) + \\frac{2x\\sin x}{x^2+1}\\right]',
      },
    ],
    tips: [
      'This method is especially powerful for functions of the form f(x)^g(x).',
      'Use log laws to break complex products/quotients into sums before differentiating.',
      'Always substitute back for y at the end.',
    ],
  },
  {
    id: 'trig-derivatives',
    title: 'Trigonometric Derivatives',
    icon: Triangle,
    description: 'Differentiate basic trigonometric functions and their compositions.',
    keyFormula: {
      label: 'Differentiate basic trigonometric functions and their compositions.',
      formula: '\\frac{d}{dx}(\\sin x) = \\cos x, \\quad \\frac{d}{dx}(\\cos x) = -\\sin x',
      explanation: '',
    },
    whenToUse: [
      'The function involves trigonometric functions like sin, cos, tan.',
      'You need derivatives of trig functions with or without the chain rule.',
      'The function combines trig with algebraic or exponential functions.',
    ],
    examples: [
      {
        problem: '\\frac{d}{dx}(\\tan x)',
        steps: [
          { number: 1, description: 'Recall the derivative of tangent.', math: '\\frac{d}{dx}(\\tan x) = \\sec^2 x' },
          ],
        finalAnswer: '\\frac{d}{dx}(\\tan x) = \\sec^2 x',
      },
      {
        problem: '\\frac{d}{dx}(x^2 \\sin x)',
        steps: [
          { number: 1, description: 'Apply product rule.', math: 'u = x^2, \\quad v = \\sin x' },
          { number: 2, description: 'Find derivatives and combine.', math: '2x \\sin x + x^2 \\cos x' },
          ],
        finalAnswer: '2x \\sin x + x^2 \\cos x',
      },
    ],
    tips: [
      'Memorize the six basic trig derivatives: sin, cos, tan, cot, sec, csc.',
      'The derivatives of sin and cos cycle every four steps.',
      'Always watch for negative signs with cos and csc derivatives.',
    ],
  },
  {
    id: 'higher-order',
    title: 'Higher-Order Derivatives',
    icon: Target,
    description: 'Compute second, third, and higher derivatives of functions.',
    keyFormula: {
      label: 'Compute second, third, and higher derivatives of functions.',
      formula: 'f^{\\prime\\prime}(x) = \\frac{d^2y}{dx^2}, \\quad f^{(n)}(x)',
      explanation: '',
    },
    whenToUse: [
      'You need the second, third, or nth derivative of a function.',
      'Analyzing concavity requires the second derivative.',
      'Finding patterns in repeated differentiation.',
    ],
    examples: [
      {
        problem: '\\text{Find } f^{\\prime\\prime}(x) \\text{ if } f(x) = x^4',
        steps: [
          { number: 1, description: 'Find the first derivative.', math: "f'(x) = 4x^3" },
          { number: 2, description: 'Find the second derivative.', math: 'f^{\\prime\\prime}(x) = 12x^2' },
          ],
        finalAnswer: 'f^{\\prime\\prime}(x) = 12x^2',
      },
      {
        problem: '\\text{Find } f^{\\prime\\prime}(x) \\text{ if } f(x) = e^{x^2}',
        steps: [
          { number: 1, description: "Find f\'(x) using chain rule.", math: "f'(x) = 2xe^{x^2}" },
          { number: 2, description: "Find f\'\'(x) using product rule.", math: 'f^{\\prime\\prime}(x) = 2e^{x^2} + 4x^2e^{x^2} = 2e^{x^2}(1 + 2x^2)' },
          ],
        finalAnswer: 'f^{\\prime\\prime}(x) = 2e^{x^2} + 4x^2e^{x^2} = 2e^{x^2}(1 + 2x^2)',
      },
    ],
    tips: [
      'Each derivative builds on the previous one — check your work at each step.',
      'For e^x, every derivative is e^x. For sin(x), the derivatives cycle every 4.',
      'Higher-order derivatives often require combining multiple rules.',
    ],
  },
]

const limitTechniques: TechniqueData[] = [
  {
    id: 'direct-substitution',
    title: 'Direct Substitution',
    icon: Zap,
    description: 'Evaluate limits by plugging in the value for continuous functions.',
    keyFormula: {
      label: 'Direct Substitution',
      formula: '\\lim_{x \\to a} f(x) = f(a)',
      explanation: 'If f is continuous at a, the limit equals the function value.',
    },
    whenToUse: [
      'The function is a polynomial, rational, or composition of continuous functions.',
      'Plugging in the value does not produce an indeterminate form (0/0 or ∞/∞).',
      'You need a quick evaluation without advanced techniques.',
    ],
    examples: [
      {
        problem: '\\lim_{x \\to 2} (x^2 + 3x - 1)',
        steps: [
          { number: 1, description: 'Substitute x = 2 directly into the polynomial.', math: '2^2 + 3(2) - 1' },
          { number: 2, description: 'Simplify.', math: '4 + 6 - 1 = 9' },
        ],
        finalAnswer: '9',
      },
    ],
    tips: [
      'Polynomials are continuous everywhere — just plug in.',
      'Check that the denominator is not zero before substituting.',
      'Trigonometric, exponential, and logarithmic functions are continuous on their domains.',
    ],
  },
  {
    id: 'factoring',
    title: 'Factoring & Canceling',
    icon: Split,
    description: 'Factor the expression and cancel common terms to resolve 0/0 forms.',
    keyFormula: {
      label: 'Factoring',
      formula: '\\frac{x^2 - a^2}{x - a} = x + a, \\quad x \\neq a',
      explanation: 'Difference of squares, cubes, and other factorizations eliminate the zero factor.',
    },
    whenToUse: [
      'Direct substitution gives 0/0.',
      'The expression is a rational function that can be factored.',
      'You see a difference of squares, cubes, or other patterns.',
    ],
    examples: [
      {
        problem: '\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}',
        steps: [
          { number: 1, description: 'Factor the numerator as difference of squares.', math: '\\frac{(x-2)(x+2)}{x-2}' },
          { number: 2, description: 'Cancel the common factor (x ≠ 2).', math: 'x + 2' },
          { number: 3, description: 'Substitute x = 2.', math: '2 + 2 = 4' },
        ],
        finalAnswer: '4',
      },
    ],
    tips: [
      'Always check if the expression can be factored before using more advanced techniques.',
      'Common patterns: difference of squares, sum/difference of cubes, quadratic factoring.',
      'After canceling, the resulting function is often simpler to evaluate.',
    ],
  },
  {
    id: 'rationalizing',
    title: 'Rationalizing',
    icon: RefreshCw,
    description: 'Multiply by the conjugate to eliminate radicals and resolve indeterminate forms.',
    keyFormula: {
      label: 'Conjugate Multiplication',
      formula: '(\\sqrt{a} - \\sqrt{b})(\\sqrt{a} + \\sqrt{b}) = a - b',
      explanation: 'Multiplying by the conjugate eliminates radicals in the numerator or denominator.',
    },
    whenToUse: [
      'Direct substitution gives 0/0 and the expression contains square roots.',
      'You need to simplify a difference of radicals.',
      'The expression has a radical in the numerator or denominator.',
    ],
    examples: [
      {
        problem: '\\lim_{x \\to 0} \\frac{\\sqrt{x+4} - 2}{x}',
        steps: [
          { number: 1, description: 'Multiply numerator and denominator by the conjugate.', math: '\\frac{(\\sqrt{x+4} - 2)(\\sqrt{x+4} + 2)}{x(\\sqrt{x+4} + 2)}' },
          { number: 2, description: 'Simplify the numerator.', math: '\\frac{x}{x(\\sqrt{x+4} + 2)}' },
          { number: 3, description: 'Cancel x and substitute.', math: '\\frac{1}{\\sqrt{4} + 2} = \\frac{1}{4}' },
        ],
        finalAnswer: '\\frac{1}{4}',
      },
    ],
    tips: [
      'The conjugate of √(a) - b is √(a) + b.',
      'After rationalizing, look for common factors to cancel.',
      'This technique also works for complex fractions.',
    ],
  },
  {
    id: 'special-trig',
    title: 'Special Trig Limits',
    icon: Triangle,
    description: 'Use standard trigonometric limit formulas to evaluate trigonometric expressions.',
    keyFormula: {
      label: 'Special Limits',
      formula: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1, \\quad \\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2} = \\frac{1}{2}',
      explanation: 'These fundamental limits appear frequently and can be used with substitution and algebra.',
    },
    whenToUse: [
      'The limit involves trigonometric functions as x approaches 0.',
      'You see sin(x)/x or similar patterns.',
      'L\'Hôpital\'s Rule could be used but a special limit is faster.',
    ],
    examples: [
      {
        problem: '\\lim_{x \\to 0} \\frac{\\sin(3x)}{x}',
        steps: [
          { number: 1, description: 'Rewrite to create the standard form.', math: '\\lim_{x \\to 0} \\frac{3\\sin(3x)}{3x}' },
          { number: 2, description: 'Let u = 3x and use the special limit.', math: '3 \\cdot 1 = 3' },
        ],
        finalAnswer: '3',
      },
    ],
    tips: [
      'The standard form is sin(u)/u → 1 as u → 0.',
      'For (1-cos x)/x², multiply by the conjugate or use the half-angle identity.',
      'You can often combine multiple special limits in one problem.',
    ],
  },
  {
    id: 'lhopital',
    title: "L'Hôpital's Rule",
    icon: GitBranch,
    description: 'Differentiate numerator and denominator to resolve 0/0 or ∞/∞ indeterminate forms.',
    keyFormula: {
      label: "L'Hôpital's Rule",
      formula: '\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f\'(x)}{g\'(x)}',
      explanation: 'Valid when the original limit is 0/0 or ∞/∞. Can be applied repeatedly if needed.',
    },
    whenToUse: [
      'Direct substitution gives 0/0 or ∞/∞.',
      'Factoring and rationalizing do not simplify the expression.',
      'The functions are differentiable near the limit point.',
    ],
    examples: [
      {
        problem: '\\lim_{x \\to 0} \\frac{\\sin x}{x}',
        steps: [
          { number: 1, description: 'Verify 0/0 form.', math: '\\frac{\\sin(0)}{0} = \\frac{0}{0}' },
          { number: 2, description: 'Apply L\'Hôpital\'s Rule.', math: '\\lim_{x \\to 0} \\frac{\\cos x}{1}' },
          { number: 3, description: 'Substitute x = 0.', math: '\\cos(0) = 1' },
        ],
        finalAnswer: '1',
      },
    ],
    tips: [
      'Always verify the indeterminate form before applying L\'Hôpital\'s Rule.',
      'You may need to apply the rule multiple times.',
      'If the limit is still indeterminate after differentiation, apply again.',
    ],
  },
  {
    id: 'infinite-limits',
    title: 'Infinite Limits',
    icon: Infinity,
    description: 'Analyze behavior near vertical asymptotes and one-sided limits.',
    keyFormula: {
      label: 'Infinite Limit',
      formula: '\\lim_{x \\to a^+} \\frac{1}{x-a} = +\\infty, \\quad \\lim_{x \\to a^-} \\frac{1}{x-a} = -\\infty',
      explanation: 'The sign depends on the direction of approach and the sign of the denominator.',
    },
    whenToUse: [
      'The function has a vertical asymptote at the limit point.',
      'The denominator approaches zero while the numerator does not.',
      'You need to determine one-sided behavior.',
    ],
    examples: [
      {
        problem: '\\lim_{x \\to 0^+} \\frac{1}{x}',
        steps: [
          { number: 1, description: 'As x approaches 0 from the right, 1/x becomes very large positive.', math: '\\frac{1}{0.001} = 1000' },
          { number: 2, description: 'The limit approaches positive infinity.', math: '+\\infty' },
        ],
        finalAnswer: '\\infty',
      },
    ],
    tips: [
      'Always check the sign of the denominator from both sides.',
      'A squared denominator is always positive.',
      'Sketch the graph to verify your sign analysis.',
    ],
  },
  {
    id: 'limits-at-infinity',
    title: 'Limits at Infinity',
    icon: ArrowRight,
    description: 'Evaluate end behavior, horizontal asymptotes, and growth rates.',
    keyFormula: {
      label: 'Rational Functions at Infinity',
      formula: '\\lim_{x \\to \\infty} \\frac{a_n x^n + \\dots}{b_m x^m + \\dots} = \\begin{cases} \\frac{a_n}{b_m} & n=m \\ 0 & n<m \\ \\pm\\infty & n>m \\end{cases}',
      explanation: 'Compare the degrees of the numerator and denominator to determine the end behavior.',
    },
    whenToUse: [
      'The limit involves x approaching infinity or negative infinity.',
      'You have a rational function and need the horizontal asymptote.',
      'You are comparing growth rates of different functions.',
    ],
    examples: [
      {
        problem: '\\lim_{x \\to \\infty} \\frac{3x^2 + 2x - 1}{2x^2 + 5}',
        steps: [
          { number: 1, description: 'Divide numerator and denominator by the highest power x².', math: '\\lim_{x \\to \\infty} \\frac{3 + \\frac{2}{x} - \\frac{1}{x^2}}{2 + \\frac{5}{x^2}}' },
          { number: 2, description: 'As x→∞, fractional terms approach 0.', math: '\\frac{3 + 0 - 0}{2 + 0}' },
          { number: 3, description: 'Simplify.', math: '\\frac{3}{2}' },
        ],
        finalAnswer: '\\frac{3}{2}',
      },
    ],
    tips: [
      'For rational functions, divide by the highest power in the denominator.',
      'Exponential functions grow faster than any polynomial.',
      'For radicals, factor out the highest power inside the root.',
    ],
  },
]

const quickRefFormulas = [
  { name: 'Power Rule', latex: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C' },
  { name: 'Exponential', latex: '\\int e^x dx = e^x + C' },
  { name: 'General Exp', latex: '\\int a^x dx = \\frac{a^x}{\\ln a} + C' },
  { name: 'Natural Log', latex: '\\int \\frac{1}{x} dx = \\ln|x| + C' },
  { name: 'Sine', latex: '\\int \\sin(x) dx = -\\cos(x) + C' },
  { name: 'Cosine', latex: '\\int \\cos(x) dx = \\sin(x) + C' },
  { name: 'Tangent', latex: '\\int \\tan(x) dx = \\ln|\\sec(x)| + C' },
  { name: 'Secant Squared', latex: '\\int \\sec^2(x) dx = \\tan(x) + C' },
  { name: 'By Parts', latex: '\\int u \\, dv = uv - \\int v \\, du' },
  { name: 'u-Sub', latex: 'u = g(x), \\quad du = g\'(x)dx' },
]
/* ─────────────────────── animation variants ─────────────────────── */
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}
const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutQuart } },
}
/* ─────────────────────── WorkedExampleCard ─────────────────────── */
function WorkedExampleCard({ example, index }: { example: WorkedExample; index: number }) {
  const [showSolution, setShowSolution] = useState(false)
  return (
    <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[0.75rem] font-medium uppercase tracking-[0.05em] text-[#C9A86C]">
          Example {index + 1}
        </span>
      </div>
      {example.problemDescription && (
        <p className="text-[#8A8A8A] text-[0.875rem] mb-2">{example.problemDescription}</p>
      )}
      <div className="mb-4">
        <p className="text-[#8A8A8A] text-sm mb-2">Evaluate:</p>
        <div className="font-mono text-white text-[1.125rem]">
          <MathDisplay latex={example.problem} displayMode />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowSolution(!showSolution)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#333333] text-[0.875rem] font-medium text-[#8A8A8A] hover:text-white hover:border-[#555555] hover:bg-[rgba(255,255,255,0.03)] transition-all duration-200"
      >
        {showSolution ? (
          <>
            <ChevronUp size={16} />
            Hide Solution
          </>
        ) : (
          <>
            <ChevronDown size={16} />
            Show Solution
          </>
        )}
      </button>
      <AnimatePresence>
        {showSolution && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOutQuart }}
            className="overflow-hidden"
          >
            <div className="mt-5 space-y-4 border-t border-[#1F1F1F] pt-5">
              {example.steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.12, ease: easeOutQuart }}
                  className="flex gap-3"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[rgba(201,168,108,0.15)] flex items-center justify-center">
                    <span className="text-[0.75rem] font-medium text-[#C9A86C]">
                      {step.number}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#8A8A8A] text-[0.875rem] mb-1.5 leading-relaxed">
                      {step.description}
                    </p>
                    <div className="font-mono text-white text-[1rem] bg-[#1A1A1A] rounded-lg px-4 py-2.5 border border-[#1F1F1F]">
                      <MathDisplay latex={step.math} displayMode />
                    </div>
                  </div>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: example.steps.length * 0.12, ease: easeOutQuart }}
                className="mt-4 p-4 rounded-lg border border-[#C9A86C]/30 bg-[rgba(201,168,108,0.05)]"
              >
                <p className="text-[0.75rem] font-medium uppercase tracking-[0.05em] text-[#C9A86C] mb-1.5">
                  Final Answer
                </p>
                <div className="font-mono text-white text-[1.125rem]">
                  <MathDisplay latex={example.finalAnswer} displayMode />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
/* ─────────────────────── TechniqueSection ─────────────────────── */
function TechniqueSection({
  technique,
  isLast,
}: {
  technique: TechniqueData
  isLast: boolean
}) {
  const Icon = technique.icon
  return (
    <section id={technique.id} className="scroll-mt-[96px]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
      >
        {/* Section Header */}
        <motion.div variants={staggerItem} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Icon size={32} className="text-[#C9A86C]" />
            <h2 className="font-display text-[clamp(1.8rem,3vw,2.8rem)] text-white leading-tight tracking-[-0.01em]">
              {technique.title}
            </h2>
          </div>
          <p className="text-[1.125rem] text-[#8A8A8A] leading-[1.7] max-w-[680px]">
            {technique.description}
          </p>
        </motion.div>
        {/* Key Formula Box */}
        <motion.div
          variants={staggerItem}
          className="mb-8 bg-[#111111] border border-[#1F1F1F] rounded-xl p-6 hover:border-[#333333] transition-colors duration-200"
        >
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[#C9A86C] mb-3">
            {technique.keyFormula.label}
          </p>
          <div className="font-mono text-white text-[1.5rem] mb-3">
            <MathDisplay latex={technique.keyFormula.formula} displayMode />
          </div>
          <p className="text-[0.875rem] text-[#8A8A8A] leading-relaxed">
            {technique.keyFormula.explanation}
          </p>
        </motion.div>
        {/* When to Use */}
        <motion.div variants={staggerItem} className="mb-8">
          <h3 className="text-[1.5rem] font-semibold text-white mb-4">When to Use</h3>
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-3"
          >
            {technique.whenToUse.map((item, i) => (
              <motion.li
                key={i}
                variants={staggerItem}
                className="flex items-start gap-3"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgba(201,168,108,0.15)] flex items-center justify-center mt-0.5">
                  <span className="text-[0.75rem] font-medium text-[#C9A86C]">{i + 1}</span>
                </span>
                <span className="text-[#8A8A8A] leading-relaxed">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
        {/* Worked Examples */}
        <motion.div variants={staggerItem} className="mb-8">
          <h3 className="text-[1.5rem] font-semibold text-white mb-4">Worked Examples</h3>
          <div className="space-y-4">
            {technique.examples.map((ex, i) => (
              <WorkedExampleCard key={i} example={ex} index={i} />
            ))}
          </div>
        </motion.div>
        {/* Tips */}
        <motion.div variants={staggerItem} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={20} className="text-[#C9A86C]" />
            <h3 className="text-[1.5rem] font-semibold text-white">Pro Tips</h3>
          </div>
          <div className="space-y-2">
            {technique.tips.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-[rgba(201,168,108,0.03)]"
              >
                <span className="text-[#C9A86C] mt-0.5 select-none">•</span>
                <p className="text-[0.875rem] text-[#8A8A8A] leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      {/* Section Divider */}
      {!isLast && (
        <div className="flex items-center gap-6 py-8">
          <div className="flex-1 h-px bg-[#1F1F1F]" />
          <span className="text-[#555555] text-[1rem] select-none">∫</span>
          <div className="flex-1 h-px bg-[#1F1F1F]" />
        </div>
      )}
    </section>
  )
}
/* ─────────────────────── QuickReferenceCard ─────────────────────── */
function QuickReferenceCard() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
            className="mb-3 w-[340px] max-h-[480px] bg-[#111111] border border-[#1F1F1F] rounded-xl p-5 overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[1.25rem] font-semibold text-white">Quick Reference</h4>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#1F1F1F] text-[#8A8A8A] hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {quickRefFormulas.map((f, i) => (
                <div key={i}>
                  <p className="text-[0.875rem] text-[#8A8A8A] mb-1">{f.name}</p>
                  <div className="font-mono text-white text-[0.875rem]">
                    <MathDisplay latex={f.latex} displayMode />
                  </div>
                  {i < quickRefFormulas.length - 1 && (
                    <div className="mt-3 h-px bg-[#1F1F1F]" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full bg-[#E30614] text-white flex items-center justify-center shadow-[0_0_20px_rgba(227,6,20,0.3)] hover:bg-[#FF1A2E] transition-colors duration-200"
        aria-label="Toggle quick reference"
      >
        {isOpen ? <X size={20} /> : <BookOpen size={20} />}
      </motion.button>
    </div>
  )
}
/* ─────────────────────── Sidebar ─────────────────────── */
function LearnSidebar({ activeSection, techniques }: { activeSection: string; techniques: TechniqueData[] }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const handleClick = (id: string) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  /* Mobile dropdown */
  return (
    <>
      {/* Mobile dropdown toggle */}
      <div className="lg:hidden mb-6">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#111111] border border-[#1F1F1F] rounded-lg text-[#8A8A8A] hover:text-white transition-colors"
        >
          <span className="text-[0.875rem] font-medium">
            {techniques.find((t) => t.id === activeSection)?.title || 'Jump to Section'}
          </span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${mobileOpen ? 'rotate-180' : ''}`}
          />
        </button>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: easeOutQuart }}
              className="overflow-hidden"
            >
              <div className="mt-2 bg-[#111111] border border-[#1F1F1F] rounded-lg p-2 space-y-1">
                {techniques.map((t) => {
                  const Icon = t.icon
                  const isActive = t.id === activeSection
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleClick(t.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[0.875rem] font-medium transition-all duration-150 text-left ${
                        isActive
                          ? 'bg-[rgba(227,6,20,0.08)] text-white border-l-2 border-[#E30614]'
                          : 'text-[#8A8A8A] hover:bg-[rgba(255,255,255,0.03)] hover:text-white'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-[#C9A86C]' : 'text-[#555555]'} />
                      {t.title}
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => handleClick('quick-reference')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[0.875rem] font-medium transition-all duration-150 text-left ${
                    activeSection === 'quick-reference'
                      ? 'bg-[rgba(227,6,20,0.08)] text-white border-l-2 border-[#E30614]'
                      : 'text-[#8A8A8A] hover:bg-[rgba(255,255,255,0.03)] hover:text-white'
                  }`}
                >
                  <BookOpen size={16} className={activeSection === 'quick-reference' ? 'text-[#C9A86C]' : 'text-[#555555]'} />
                  Quick Reference Card
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Desktop sticky sidebar */}
      <aside className="hidden lg:block w-[260px] flex-shrink-0">
        <div className="sticky top-[96px] bg-[#111111] border border-[#1F1F1F] rounded-xl p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
          <h3 className="text-[1.25rem] font-semibold text-white mb-4 pb-3 border-b border-[#1F1F1F]">
            Contents
          </h3>
          <nav className="space-y-1">
            {techniques.map((t) => {
              const Icon = t.icon
              const isActive = t.id === activeSection
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleClick(t.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[0.875rem] font-medium transition-all duration-150 text-left ${
                    isActive
                      ? 'bg-[rgba(227,6,20,0.08)] text-white border-l-2 border-[#E30614]'
                      : 'text-[#8A8A8A] hover:bg-[rgba(255,255,255,0.03)] hover:text-white'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-[#C9A86C]' : 'text-[#555555]'} />
                  <span className="truncate">{t.title}</span>
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => handleClick('quick-reference')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[0.875rem] font-medium transition-all duration-150 text-left ${
                activeSection === 'quick-reference'
                  ? 'bg-[rgba(227,6,20,0.08)] text-white border-l-2 border-[#E30614]'
                  : 'text-[#8A8A8A] hover:bg-[rgba(255,255,255,0.03)] hover:text-white'
              }`}
            >
              <BookOpen size={16} className={activeSection === 'quick-reference' ? 'text-[#C9A86C]' : 'text-[#555555]'} />
              Quick Reference Card
            </button>
          </nav>
        </div>
      </aside>
    </>
  )
}
/* ─────────────────────── StrategySection ─────────────────────── */
function StrategySection() {
  const steps = [
    { q: 'Is it a basic form?', a: 'Power rule, exponential, or trig basic forms' },
    { q: 'Is it a composite function?', a: 'Try u-substitution' },
    { q: 'Is it a product of different types?', a: 'Integration by parts (LIATE)' },
    { q: 'Does it involve trig functions?', a: 'Trigonometric integrals' },
    { q: 'Does it have sqrt(a²±x²) or sqrt(x²-a²)?', a: 'Trigonometric substitution' },
    { q: 'Is it a rational function?', a: 'Partial fractions' },
    { q: 'Infinite limits or discontinuity?', a: 'Improper integrals (use limits)' },
  ]
  return (
    <section id="strategy" className="scroll-mt-[96px]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
      >
        <motion.div variants={staggerItem} className="mb-8">
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.8rem)] text-white leading-tight tracking-[-0.01em] mb-3">
            Choosing the Right Technique
          </h2>
          <p className="text-[1.125rem] text-[#8A8A8A] leading-[1.7] max-w-[680px]">
            A decision guide to help you select the best integration method for any problem. Start from the top and work your way down.
          </p>
        </motion.div>
        <motion.div variants={staggerItem} className="space-y-3 mb-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="flex items-start gap-4 p-4 bg-[#111111] border border-[#1F1F1F] rounded-xl hover:border-[#333333] transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgba(227,6,20,0.1)] border border-[rgba(227,6,20,0.2)] flex items-center justify-center">
                <span className="text-[0.75rem] font-semibold text-[#E30614]">{i + 1}</span>
              </div>
              <div className="flex-1">
                <p className="text-white text-[0.9375rem] font-medium mb-1">{step.q}</p>
                <p className="text-[#8A8A8A] text-[0.875rem]">{step.a}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight size={16} className="text-[#555555] mt-2 flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </motion.div>
        <motion.div variants={staggerItem} className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={20} className="text-[#C9A86C]" />
            <h3 className="text-[1.25rem] font-semibold text-white">General Tips</h3>
          </div>
          <div className="space-y-3">
            {[
              'Practice pattern recognition — after solving enough problems, you will instinctively know which technique to use.',
              'Always check your answer by differentiating the result — you should get back the original integrand.',
              'Do not forget the +C on every indefinite integral.',
              'Sometimes multiple techniques apply; choose the one that leads to the simplest algebra.',
              'When stuck, try rewriting the integrand using identities or algebraic manipulation.',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[rgba(201,168,108,0.03)]">
                <span className="text-[#C9A86C] mt-0.5 select-none">•</span>
                <p className="text-[0.875rem] text-[#8A8A8A] leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      <div className="flex items-center gap-6 py-8">
        <div className="flex-1 h-px bg-[#1F1F1F]" />
        <span className="text-[#555555] text-[1rem] select-none">∫</span>
        <div className="flex-1 h-px bg-[#1F1F1F]" />
      </div>
    </section>
  )
}
/* ─────────────────────── QuickReferenceInline ─────────────────────── */
function QuickReferenceInline() {
  return (
    <section id="quick-reference" className="scroll-mt-[96px]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
      >
        <motion.div variants={staggerItem} className="mb-8">
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.8rem)] text-white leading-tight tracking-[-0.01em] mb-3">
            Quick Reference Card
          </h2>
          <p className="text-[1.125rem] text-[#8A8A8A] leading-[1.7] max-w-[680px]">
            A compact table of the most commonly used integration formulas. Bookmark this page for quick access during practice.
          </p>
        </motion.div>
        <motion.div
          variants={staggerItem}
          className="bg-[#111111] border border-[#1F1F1F] rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1F1F1F]">
                  <th className="text-left px-6 py-4 text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[#C9A86C]">
                    Rule
                  </th>
                  <th className="text-left px-6 py-4 text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[#C9A86C]">
                    Formula
                  </th>
                  <th className="text-left px-6 py-4 text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[#C9A86C]">
                    Condition / Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Power Rule', latex: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C', note: 'n \\neq -1' },
                  { name: 'Constant', latex: '\\int k \\, dx = kx + C', note: 'k is constant' },
                  { name: 'Sum/Diff', latex: '\\int (f \\pm g) \\, dx = \\int f \\, dx \\pm \\int g \\, dx', note: 'Linearity' },
                  { name: 'Exponential', latex: '\\int e^x \\, dx = e^x + C', note: 'Base e' },
                  { name: 'General Exp', latex: '\\int a^x \\, dx = \\frac{a^x}{\\ln a} + C', note: 'a > 0, a \\neq 1' },
                  { name: 'Natural Log', latex: '\\int \\frac{1}{x} \\, dx = \\ln|x| + C', note: 'Special case n = -1' },
                  { name: 'Sine', latex: '\\int \\sin(x) \\, dx = -\\cos(x) + C', note: '' },
                  { name: 'Cosine', latex: '\\int \\cos(x) \\, dx = \\sin(x) + C', note: '' },
                  { name: 'Tangent', latex: '\\int \\tan(x) \\, dx = \\ln|\\sec(x)| + C', note: '' },
                  { name: 'Sec²', latex: '\\int \\sec^2(x) \\, dx = \\tan(x) + C', note: '' },
                  { name: 'Csc²', latex: '\\int \\csc^2(x) \\, dx = -\\cot(x) + C', note: '' },
                  { name: 'Sec·Tan', latex: '\\int \\sec(x)\\tan(x) \\, dx = \\sec(x) + C', note: '' },
                  { name: 'By Parts', latex: '\\int u \\, dv = uv - \\int v \\, du', note: 'LIATE rule' },
                  { name: 'u-Sub', latex: 'u = g(x), \\; du = g\'(x)dx', note: 'Chain rule reverse' },
                ].map((row, i, arr) => (
                  <tr
                    key={i}
                    className={`border-b border-[#1F1F1F] hover:bg-[rgba(255,255,255,0.02)] transition-colors ${
                      i === arr.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-6 py-3.5 text-[0.875rem] text-white font-medium whitespace-nowrap">
                      {row.name}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-white text-[0.875rem]">
                      <MathDisplay latex={row.latex} displayMode />
                    </td>
                    <td className="px-6 py-3.5 text-[0.875rem] text-[#8A8A8A]">
                      {row.note && <MathDisplay latex={row.note} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
/* ─────────────────────── applications of derivatives data ─────────────────────── */
const appDiffTechniques: TechniqueData[] = [
  {
    id: 'optimization',
    title: 'Optimization',
    icon: TrendingUp,
    description:
      'Use derivatives to find the best value — maximum area, minimum cost, maximum volume. The key skill is translating a word problem into a single-variable function, then finding its critical points.',
    keyFormula: {
      label: 'Optimization Strategy',
      formula: "f'(x) = 0 \\text{ at critical points; confirm with } f''(x)",
      explanation: 'Write the quantity to optimize as a function of one variable using the constraint, differentiate, set to zero, and verify a max or min with the second derivative test.',
    },
    whenToUse: [
      'The problem asks for a largest, smallest, cheapest, fastest, or most efficient value.',
      'There is a constraint equation relating the variables (perimeter, volume, budget).',
      'After substituting the constraint, the objective is a function of one variable.',
    ],
    examples: [
      {
        problem: '\\text{Maximize the area of a rectangle with } 240 \\text{ m of fencing on 3 sides}',
        steps: [
          { number: 1, description: 'Write the constraint and solve for one variable.', math: '2x + y = 240 \\Rightarrow y = 240 - 2x' },
          { number: 2, description: 'Write the area as a function of x.', math: 'A(x) = x(240 - 2x) = 240x - 2x^2' },
          { number: 3, description: 'Differentiate and set equal to zero.', math: "A'(x) = 240 - 4x = 0 \\Rightarrow x = 60" },
          { number: 4, description: 'Confirm a maximum with the second derivative.', math: "A''(x) = -4 < 0" },
        ],
        finalAnswer: 'x = 60 \\text{ m (max area } 7200 \\text{ m}^2\\text{)}',
      },
    ],
    tips: [
      'Always identify the constraint first — it lets you eliminate a variable.',
      'Check endpoints too if the domain is a closed interval.',
      'The second derivative test quickly confirms max vs min: negative means max.',
    ],
  },
  {
    id: 'related-rates',
    title: 'Related Rates',
    icon: Activity,
    description:
      'When two or more quantities change with time and are related by an equation, differentiating both sides with respect to t connects their rates of change.',
    keyFormula: {
      label: 'Chain Rule in Disguise',
      formula: '\\frac{d}{dt}[f(x)] = f\'(x) \\cdot \\frac{dx}{dt}',
      explanation: 'Every variable is a function of time t. Differentiate the relationship with respect to t, then substitute the known values and solve for the unknown rate.',
    },
    whenToUse: [
      'Two or more quantities are changing over time and one rate is given.',
      'Classic setups: ladders sliding, balloons inflating, tanks filling, shadows lengthening.',
      'There is a static geometric relationship (Pythagorean theorem, similar triangles, volume formulas).',
    ],
    examples: [
      {
        problem: '\\text{A 5 m ladder slides: } \\frac{dx}{dt} = 1 \\text{ m/s; find } \\frac{dy}{dt} \\text{ when } x = 3',
        steps: [
          { number: 1, description: 'Relate the variables with the Pythagorean theorem.', math: 'x^2 + y^2 = 25' },
          { number: 2, description: 'Differentiate with respect to t.', math: '2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0' },
          { number: 3, description: 'Find y at the given instant.', math: 'y = \\sqrt{25 - 9} = 4' },
          { number: 4, description: 'Substitute and solve.', math: '2(3)(1) + 2(4)\\frac{dy}{dt} = 0 \\Rightarrow \\frac{dy}{dt} = -\\frac{3}{4}' },
        ],
        finalAnswer: '\\frac{dy}{dt} = -\\frac{3}{4} \\text{ m/s}',
      },
    ],
    tips: [
      'Substitute variable values only AFTER differentiating — never before.',
      'Draw and label a diagram; rates are derivatives with respect to time.',
      'Watch signs: a decreasing quantity has a negative rate.',
    ],
  },
  {
    id: 'curve-sketching',
    title: 'Curve Sketching',
    icon: LineChart,
    description:
      'The first derivative tells you where a function increases, decreases, and has extrema; the second derivative tells you concavity and inflection points.',
    keyFormula: {
      label: 'Derivative Tests',
      formula: "f'(c) = 0: \\; f''(c) > 0 \\Rightarrow \\text{min}, \\; f''(c) < 0 \\Rightarrow \\text{max}",
      explanation: 'Find critical points from f\'(x) = 0 or undefined, then classify them with the first derivative sign chart or the second derivative test.',
    },
    whenToUse: [
      'You need critical points, local maxima/minima, or inflection points.',
      'You need intervals of increase/decrease or concavity.',
      'A problem asks how many extrema or critical points a function has.',
    ],
    examples: [
      {
        problem: '\\text{Classify the critical points of } f(x) = x^3 - 3x',
        steps: [
          { number: 1, description: 'Differentiate and factor.', math: "f'(x) = 3x^2 - 3 = 3(x - 1)(x + 1)" },
          { number: 2, description: 'Find the critical points.', math: 'x = -1, \\; x = 1' },
          { number: 3, description: 'Apply the second derivative test.', math: "f''(x) = 6x: \\; f''(-1) < 0 \\Rightarrow \\text{max}, \\; f''(1) > 0 \\Rightarrow \\text{min}" },
        ],
        finalAnswer: '\\text{local max at } x = -1, \\text{ local min at } x = 1',
      },
    ],
    tips: [
      'A critical point is only an extremum if the first derivative changes sign there.',
      'Repeated factors like x^2 in f\' never change sign — watch for non-extremum stationary points.',
      'Inflection points require a sign change in f\'\' — not just f\'\' = 0.',
    ],
  },
  {
    id: 'mvt',
    title: 'Mean Value Theorem',
    icon: Equal,
    description:
      "If f is continuous on [a, b] and differentiable on (a, b), then at some point c the instantaneous rate of change equals the average rate of change. Rolle's Theorem is the special case f(a) = f(b).",
    keyFormula: {
      label: 'Mean Value Theorem',
      formula: "f'(c) = \\frac{f(b) - f(a)}{b - a}",
      explanation: 'Compute the slope of the secant line through the endpoints, then find c in (a, b) where the tangent line has that same slope.',
    },
    whenToUse: [
      'The problem explicitly mentions the Mean Value Theorem or Rolle\'s Theorem and asks for c.',
      'You need to argue that average and instantaneous rates coincide (e.g., speed traps).',
      'Check the hypotheses first: continuity on [a, b], differentiability on (a, b).',
    ],
    examples: [
      {
        problem: '\\text{Find } c \\text{ for } f(x) = x^2 \\text{ on } [1, 3]',
        steps: [
          { number: 1, description: 'Compute the average rate of change.', math: '\\frac{f(3) - f(1)}{3 - 1} = \\frac{9 - 1}{2} = 4' },
          { number: 2, description: 'Set the derivative equal to that slope.', math: "f'(c) = 2c = 4" },
          { number: 3, description: 'Solve and verify c is inside the interval.', math: 'c = 2 \\in (1, 3)' },
        ],
        finalAnswer: 'c = 2',
      },
    ],
    tips: [
      'The c you find must lie strictly inside the open interval (a, b).',
      "For Rolle's Theorem, verify f(a) = f(b) first, then solve f'(c) = 0.",
      'Interpretation: at some instant your speed equals your average speed.',
    ],
  },
  {
    id: 'linear-approximation',
    title: 'Linear Approximation',
    icon: Minus,
    description:
      'Near a point a, a differentiable function is well approximated by its tangent line. This gives quick estimates of roots, powers, and transcendental values without a calculator.',
    keyFormula: {
      label: 'Linearization',
      formula: 'L(x) = f(a) + f\'(a)(x - a)',
      explanation: 'Choose a nearby point a where f and f\' are easy to compute exactly, then evaluate the tangent line at your target x.',
    },
    whenToUse: [
      'You need an estimate of a value like √4.1, e^0.02, or sin(0.1).',
      'There is a nearby "nice" point a where the function value is exact.',
      'The target x is close to a — the approximation degrades with distance.',
    ],
    examples: [
      {
        problem: '\\text{Estimate } \\sqrt{4.1} \\text{ using } f(x) = \\sqrt{x} \\text{ at } a = 4',
        steps: [
          { number: 1, description: 'Compute f(a) and f\'(a).', math: 'f(4) = 2, \\quad f\'(4) = \\frac{1}{4}' },
          { number: 2, description: 'Write the linearization.', math: 'L(x) = 2 + \\frac{1}{4}(x - 4)' },
          { number: 3, description: 'Evaluate at the target value.', math: 'L(4.1) = 2 + \\frac{0.1}{4} = 2.025' },
        ],
        finalAnswer: '\\sqrt{4.1} \\approx 2.025',
      },
    ],
    tips: [
      'Pick a to be the nearest point where the function is exact (perfect squares, multiples of π).',
      'Memorize the classics: sin(x) ≈ x, e^x ≈ 1 + x, ln(x) ≈ x − 1 near their base points.',
      'Concavity tells you the error direction: concave down means the estimate overshoots.',
    ],
  },
  {
    id: 'motion',
    title: 'Motion',
    icon: MoveRight,
    description:
      'Position, velocity, and acceleration are linked by differentiation. Velocity is the derivative of position; acceleration is the derivative of velocity.',
    keyFormula: {
      label: 'The Motion Chain',
      formula: 'v(t) = s\'(t), \\quad a(t) = v\'(t) = s\'\'(t)',
      explanation: 'A particle is at rest when v = 0, changes direction when v changes sign, and speeds up when v and a have the same sign.',
    },
    whenToUse: [
      'A problem gives position s(t) and asks about velocity, acceleration, or rest times.',
      'Total distance traveled requires splitting at turning points (v = 0).',
      'Projectile problems: maximum height occurs when vertical velocity is zero.',
    ],
    examples: [
      {
        problem: '\\text{Total distance for } s(t) = t^3 - 6t^2 + 9t \\text{ from } t = 0 \\text{ to } t = 4',
        steps: [
          { number: 1, description: 'Find turning points where v = 0.', math: 'v(t) = 3(t - 1)(t - 3) = 0 \\Rightarrow t = 1, \\; 3' },
          { number: 2, description: 'Evaluate s at endpoints and turning points.', math: 's(0) = 0, \\; s(1) = 4, \\; s(3) = 0, \\; s(4) = 4' },
          { number: 3, description: 'Sum the absolute distances of each leg.', math: '|4 - 0| + |0 - 4| + |4 - 0| = 12' },
        ],
        finalAnswer: '12 \\text{ meters}',
      },
    ],
    tips: [
      'Displacement ≠ total distance: split the interval wherever v changes sign.',
      'Speeding up: v and a share a sign. Slowing down: opposite signs.',
      'For projectiles, max height is at v = 0; landing time solves s(t) = 0.',
    ],
  },
  {
    id: 'economics',
    title: 'Economics & Marginal Analysis',
    icon: DollarSign,
    description:
      '"Marginal" means derivative in economics: marginal cost, revenue, and profit approximate the change from producing one more unit.',
    keyFormula: {
      label: 'Profit Maximization',
      formula: "P(x) = R(x) - C(x), \\quad P'(x) = 0 \\Rightarrow R'(x) = C'(x)",
      explanation: 'Profit is maximized where marginal revenue equals marginal cost. Average cost is minimized where average cost equals marginal cost.',
    },
    whenToUse: [
      'A problem gives cost, revenue, or demand functions and asks for an optimal production level.',
      'Marginal cost/revenue questions are straightforward derivative evaluations.',
      'Average cost minimization: differentiate C(x)/x, or set it equal to C\'(x).',
    ],
    examples: [
      {
        problem: '\\text{Maximize profit: } R(x) = 50x, \\; C(x) = 100 + 10x + x^2',
        steps: [
          { number: 1, description: 'Write the profit function.', math: 'P(x) = 40x - 100 - x^2' },
          { number: 2, description: 'Differentiate and set equal to zero.', math: "P'(x) = 40 - 2x = 0 \\Rightarrow x = 20" },
          { number: 3, description: 'Confirm a maximum.', math: "P''(x) = -2 < 0" },
        ],
        finalAnswer: 'x = 20 \\text{ units}',
      },
    ],
    tips: [
      'Revenue from a demand curve: R(x) = p · x where p is the price function.',
      'Minimum average cost occurs where average cost = marginal cost.',
      'Always confirm the optimum with the second derivative test.',
    ],
  },
];

/* ─────────────────────── applications of integration data ─────────────────────── */
const appIntTechniques: TechniqueData[] = [
  {
    id: 'area-between-curves',
    title: 'Area Between Curves',
    icon: Layers,
    description:
      'The area between two curves is the integral of (top − bottom) with vertical slices, or (right − left) with horizontal slices. Intersection points supply the bounds.',
    keyFormula: {
      label: 'Vertical Slices',
      formula: 'A = \\int_a^b [f(x) - g(x)] \\, dx \\quad (f \\ge g)',
      explanation: 'Find where the curves intersect to get the bounds, identify which function is on top, and integrate the difference.',
    },
    whenToUse: [
      'A region is enclosed by two or more curves.',
      'Find intersection points first — they give the integration bounds.',
      'If the top and bottom curves swap, split the integral at the crossing.',
      'For sideways regions (x as a function of y), use horizontal slices: right − left.',
    ],
    examples: [
      {
        problem: '\\text{Area enclosed by } y = x \\text{ and } y = x^2',
        steps: [
          { number: 1, description: 'Find the intersection points.', math: 'x = x^2 \\Rightarrow x = 0, \\; 1' },
          { number: 2, description: 'Set up top minus bottom.', math: 'A = \\int_0^1 (x - x^2) \\, dx' },
          { number: 3, description: 'Integrate.', math: 'A = \\left[ \\frac{x^2}{2} - \\frac{x^3}{3} \\right]_0^1 = \\frac{1}{6}' },
        ],
        finalAnswer: 'A = \\frac{1}{6}',
      },
    ],
    tips: [
      'Area is always positive — if the curve is below the axis, integrate (0 − f(x)).',
      'Sketch the region; a quick picture prevents sign errors.',
      'Use symmetry to halve the work when the region is even or odd.',
    ],
  },
  {
    id: 'volumes',
    title: 'Volumes of Revolution',
    icon: Rotate3d,
    description:
      'Revolving a region about an axis sweeps out a solid. Disks and washers slice perpendicular to the axis; shells use hollow cylinders parallel to it.',
    keyFormula: {
      label: 'Disk / Washer / Shell',
      formula: 'V = \\pi \\int R^2 \\, dx \\quad | \\quad V = \\pi \\int (R^2 - r^2) \\, dx \\quad | \\quad V = 2\\pi \\int x f(x) \\, dx',
      explanation: 'Disks for solid regions, washers when there is a hole (outer minus inner radius), shells when slicing parallel to the axis is easier.',
    },
    whenToUse: [
      'A region is revolved about the x-axis, y-axis, or another line.',
      'Region touches the axis of rotation → disks; gap between region and axis → washers.',
      'Shells shine when solving y = f(x) for x is hard and you revolve about the y-axis.',
    ],
    examples: [
      {
        problem: '\\text{Region between } y = x \\text{ and } y = x^2 \\text{ revolved about the } x\\text{-axis}',
        steps: [
          { number: 1, description: 'Washer: outer radius x, inner radius x^2.', math: 'V = \\pi \\int_0^1 (x^2 - x^4) \\, dx' },
          { number: 2, description: 'Integrate.', math: 'V = \\pi \\left( \\frac{1}{3} - \\frac{1}{5} \\right) = \\frac{2\\pi}{15}' },
        ],
        finalAnswer: 'V = \\frac{2\\pi}{15}',
      },
    ],
    tips: [
      'Always square the radius in disk/washer setups — (x^2)^2 = x^4, not x^4 dx forgotten.',
      'For washers about the y-axis, radii are functions of y: solve for x first.',
      'Shells: radius × height × thickness = x · f(x) · dx.',
    ],
  },
  {
    id: 'arc-length',
    title: 'Arc Length',
    icon: Spline,
    description:
      'The length of a curve is found by integrating the infinitesimal distance element. Most textbook problems are engineered so 1 + (y\')² is a perfect square.',
    keyFormula: {
      label: 'Arc Length Formula',
      formula: 'L = \\int_a^b \\sqrt{1 + (f\'(x))^2} \\, dx',
      explanation: 'Differentiate, square, add 1, take the square root, and integrate. Look for perfect-square simplifications like (x^2 + 1/(4x^2))^2.',
    },
    whenToUse: [
      'You need the length of a curve segment — not area or volume.',
      'For lines, verify with the distance formula.',
      'Curves like y = (2/3)x^{3/2} give √(1 + x), which integrates directly.',
    ],
    examples: [
      {
        problem: '\\text{Arc length of } y = \\frac{2}{3}x^{3/2} \\text{ on } [0, 3]',
        steps: [
          { number: 1, description: 'Differentiate.', math: "y' = \\sqrt{x}" },
          { number: 2, description: 'Set up the integral.', math: 'L = \\int_0^3 \\sqrt{1 + x} \\, dx' },
          { number: 3, description: 'Integrate.', math: 'L = \\frac{2}{3} \\left[ (1 + x)^{3/2} \\right]_0^3 = \\frac{2}{3}(8 - 1) = \\frac{14}{3}' },
        ],
        finalAnswer: 'L = \\frac{14}{3}',
      },
    ],
    tips: [
      'Check whether 1 + (y\')² is a perfect square before integrating.',
      'For circles, the arc length formulas (2πr, πr) are much faster.',
      'Powers like (9)^{3/2} = 27 should be computed exactly.',
    ],
  },
  {
    id: 'surface-area',
    title: 'Surface Area of Revolution',
    icon: Globe,
    description:
      'Revolving a curve about an axis sweeps out a surface. The formula adds a 2πy (or 2πx) factor to the arc length element.',
    keyFormula: {
      label: 'Surface Area Formula',
      formula: 'S = 2\\pi \\int_a^b f(x) \\sqrt{1 + (f\'(x))^2} \\, dx',
      explanation: 'It is the arc length element times the circumference of the circle traced by each point. Cones and sphere zones have shortcut formulas.',
    },
    whenToUse: [
      'A curve is revolved and you want the area of the resulting surface (not volume).',
      'Cone lateral area shortcut: S = πrℓ with slant height ℓ.',
      'Sphere zone shortcut: S = 2πrh depends only on the zone height h.',
    ],
    examples: [
      {
        problem: '\\text{Revolve } y = 2\\sqrt{x} \\text{ on } [0, 3] \\text{ about the } x\\text{-axis}',
        steps: [
          { number: 1, description: 'Differentiate and simplify the integrand.', math: "y' = \\frac{1}{\\sqrt{x}} \\Rightarrow S = 4\\pi \\int_0^3 \\sqrt{x + 1} \\, dx" },
          { number: 2, description: 'Integrate.', math: 'S = \\frac{8\\pi}{3}(8 - 1) = \\frac{56\\pi}{3}' },
        ],
        finalAnswer: 'S = \\frac{56\\pi}{3}',
      },
    ],
    tips: [
      'Multiplying radicals often simplifies: √x · √(1 + 1/x) = √(x + 1).',
      'A spherical zone\'s area depends only on its height, not its position.',
      'Do not confuse with volume — surface area has no squaring of the radius.',
    ],
  },
  {
    id: 'work',
    title: 'Work & Physics',
    icon: Weight,
    description:
      'Work is force integrated over distance. Slicing turns springs, cables, chains, and tanks into integrals.',
    keyFormula: {
      label: 'Work Integral',
      formula: 'W = \\int_a^b F(x) \\, dx',
      explanation: "Springs: F = kx (Hooke's Law). Lifting: slice the object and multiply each slice's weight by its lift distance. Pumping: weight density × slice volume × lift distance.",
    },
    whenToUse: [
      'Force varies with position (springs, gravity over long distances).',
      'Lifting ropes, cables, or chains — each slice travels a different distance.',
      'Pumping liquid from a tank — slice volume times density times lift height.',
    ],
    examples: [
      {
        problem: '\\text{Stretch a spring with } k = 20 \\text{ N/m by } 0.5 \\text{ m}',
        steps: [
          { number: 1, description: "Hooke's Law gives F = kx.", math: 'W = \\int_0^{0.5} 20x \\, dx' },
          { number: 2, description: 'Integrate.', math: 'W = 10(0.25) = 2.5 \\text{ J}' },
        ],
        finalAnswer: 'W = 2.5 \\text{ J}',
      },
    ],
    tips: [
      'Find k from given force/stretch data before integrating.',
      'For a rope or chain, the slice at depth x is lifted exactly x meters.',
      'Split combined problems (load + rope) into two pieces and add.',
    ],
  },
  {
    id: 'center-of-mass',
    title: 'Center of Mass & Centroids',
    icon: Crosshair,
    description:
      'The center of mass is the weighted average position: total moment divided by total mass (or area). For uniform regions it is called the centroid.',
    keyFormula: {
      label: 'Centroid of a Region',
      formula: '\\bar{x} = \\frac{1}{A} \\int_a^b x f(x) \\, dx, \\quad \\bar{y} = \\frac{1}{A} \\cdot \\frac{1}{2} \\int_a^b [f(x)]^2 \\, dx',
      explanation: 'Compute the area A first, then the moments. The ½ factor in the ȳ formula comes from the midpoint of each vertical strip.',
    },
    whenToUse: [
      'Discrete masses on a line: weighted average of positions.',
      'A rod with variable density: integrate xρ(x) over ρ(x).',
      'A plane region under a curve: use the centroid formulas.',
    ],
    examples: [
      {
        problem: '\\text{Centroid } \\bar{x} \\text{ of the region under } y = x^2 \\text{ on } [0, 3]',
        steps: [
          { number: 1, description: 'Area.', math: 'A = \\int_0^3 x^2 \\, dx = 9' },
          { number: 2, description: 'Moment about the y-axis.', math: 'M_y = \\int_0^3 x^3 \\, dx = \\frac{81}{4}' },
          { number: 3, description: 'Divide.', math: '\\bar{x} = \\frac{81/4}{9} = \\frac{9}{4}' },
        ],
        finalAnswer: '\\bar{x} = \\frac{9}{4}',
      },
    ],
    tips: [
      'Symmetry gives one coordinate for free — use it.',
      'Always compute the area A before the moments.',
      'For ȳ, remember the ½ factor in front of the integral of [f(x)]².',
    ],
  },
  {
    id: 'averages-probability',
    title: 'Average Value & Probability',
    icon: Percent,
    description:
      'The average value of a function is its integral divided by the interval length — the same idea that powers expected value and variance in probability.',
    keyFormula: {
      label: 'Average Value',
      formula: 'f_{\\text{avg}} = \\frac{1}{b - a} \\int_a^b f(x) \\, dx',
      explanation: 'A probability density integrates to 1; the expected value is ∫ x·f(x) dx and Var(X) = E[X²] − (E[X])².',
    },
    whenToUse: [
      'Average value of a function on an interval.',
      'The Mean Value Theorem for Integrals: find c where f(c) equals the average.',
      'Probability: normalize a pdf (find k), compute E[X] or Var(X).',
    ],
    examples: [
      {
        problem: '\\text{Expected value of } f(x) = \\frac{3}{64}x^2 \\text{ on } [0, 4]',
        steps: [
          { number: 1, description: 'Weight x by the density.', math: 'E[X] = \\frac{3}{64} \\int_0^4 x^3 \\, dx' },
          { number: 2, description: 'Integrate.', math: 'E[X] = \\frac{3}{64} \\cdot 64 = 3' },
        ],
        finalAnswer: 'E[X] = 3',
      },
    ],
    tips: [
      'A pdf must satisfy ∫ f(x) dx = 1 over its whole domain.',
      'Variance shortcut: E[X²] − (E[X])².',
      'For exponential densities, integration by parts handles the x factor.',
    ],
  },
];

/* ─────────────────────── differential equations techniques ─────────────────────── */
const diffEqTechniques: TechniqueData[] = [
  {
    id: 'separable',
    title: 'Separable Equations',
    icon: Split,
    description:
      'If the equation can be written as dy/dx = g(x)·h(y), divide by h(y) and integrate both sides. Initial conditions pin down the constant.',
    keyFormula: {
      label: 'Separation of Variables',
      formula: '\\frac{dy}{dx} = g(x)h(y) \\Rightarrow \\int \\frac{dy}{h(y)} = \\int g(x) \\, dx',
      explanation: 'Collect all y terms with dy and all x terms with dx, integrate, then solve for y if possible.',
    },
    whenToUse: [
      'The right side factors into a pure-x part times a pure-y part.',
      'Growth/decay models: dy/dx = ky gives exponentials.',
      'Watch for lost solutions: dividing by h(y) assumes h(y) ≠ 0.',
    ],
    examples: [
      {
        problem: '\\text{Solve } \\frac{dy}{dx} = 2xy\\text{, } y(0) = 3',
        steps: [
          { number: 1, description: 'Separate variables.', math: '\\frac{dy}{y} = 2x \\, dx' },
          { number: 2, description: 'Integrate both sides.', math: '\\ln(y) = x^2 + C' },
          { number: 3, description: 'Exponentiate and apply y(0) = 3.', math: 'y = 3e^{x^2}' },
        ],
        finalAnswer: 'y = 3e^{x^2}',
      },
    ],
    tips: [
      'Check your answer by differentiating it and substituting back.',
      'For IVPs, apply the condition as soon as the constant appears.',
    ],
  },
  {
    id: 'linear-first-order',
    title: 'Linear First-Order',
    icon: ArrowRight,
    description:
      'Equations of the form y′ + P(x)y = Q(x) are solved by multiplying through by an integrating factor, which collapses the left side into a single derivative.',
    keyFormula: {
      label: 'Integrating Factor',
      formula: '\\mu(x) = e^{\\int P(x) \\, dx}, \\quad (\\mu y)\' = \\mu Q(x)',
      explanation: 'Multiply both sides by μ; the left side becomes the derivative of μy, so one integration finishes the job.',
    },
    whenToUse: [
      'The equation is linear in y: y and y′ appear to the first power only.',
      'Divide through first so the coefficient of y′ is exactly 1.',
      'If Q(x) matches the homogeneous rate (resonance), expect an extra x factor.',
    ],
    examples: [
      {
        problem: '\\text{Solve } y\' + y = 2\\text{, } y(0) = 3',
        steps: [
          { number: 1, description: 'Integrating factor e^x.', math: '(y e^x)\' = 2e^x' },
          { number: 2, description: 'Integrate.', math: 'y e^x = 2e^x + C \\Rightarrow y = 2 + Ce^{-x}' },
          { number: 3, description: 'Apply y(0) = 3.', math: 'y = 2 + e^{-x}' },
        ],
        finalAnswer: 'y = 2 + e^{-x}',
      },
    ],
    tips: [
      'The steady state (if Q and P are constant) is Q/P — a quick sanity check.',
      'Sign errors in P(x) are the most common mistake; verify μ′ = Pμ.',
    ],
  },
  {
    id: 'homogeneous',
    title: 'Homogeneous Equations',
    icon: Repeat,
    description:
      'When dy/dx depends only on the ratio y/x, the substitution v = y/x turns the equation into a separable one in v and x.',
    keyFormula: {
      label: 'Ratio Substitution',
      formula: "y = vx, \\quad y' = v + xv', \\quad v + xv' = f(v)",
      explanation: 'Replace y with vx everywhere, separate v and x, integrate, then substitute back v = y/x.',
    },
    whenToUse: [
      'Every term has the same total degree (e.g., all quadratic in x and y).',
      'The right side can be written purely in terms of y/x.',
      'After solving, remember to convert back: y = vx.',
    ],
    examples: [
      {
        problem: '\\text{Solve } \\frac{dy}{dx} = \\frac{x + y}{x}\\text{, } y(1) = 0',
        steps: [
          { number: 1, description: 'Substitute v = y/x.', math: 'v + xv\' = 1 + v \\Rightarrow xv\' = 1' },
          { number: 2, description: 'Integrate.', math: 'v = \\ln(x) + C' },
          { number: 3, description: 'Apply y(1) = 0 and substitute back.', math: 'y = x \\ln(x)' },
        ],
        finalAnswer: 'y = x \\ln(x)',
      },
    ],
    tips: [
      'Test homogeneity by replacing (x, y) with (tx, ty) — the t should cancel.',
      'Answers are often implicit; solving for y² avoids sign ambiguity.',
    ],
  },
  {
    id: 'exact',
    title: 'Exact Equations',
    icon: Equal,
    description:
      'M dx + N dy = 0 is exact when My = Nx. Then a potential function F with Fx = M and Fy = N exists, and solutions are the level curves F = constant.',
    keyFormula: {
      label: 'Exactness Test & Potential',
      formula: 'M_y = N_x \\Rightarrow F(x, y) = \\int M \\, dx + g(y), \\quad F = C',
      explanation: 'Integrate M with respect to x, add an unknown g(y), differentiate with respect to y, and match against N to find g.',
    },
    whenToUse: [
      'The equation is in differential form M dx + N dy = 0.',
      'Always run the exactness test first: compare My with Nx.',
      'If not exact, look for an integrating factor (advanced).',
    ],
    examples: [
      {
        problem: '\\text{Solve } (2x + y) \\, dx + (x + 2y) \\, dy = 0',
        steps: [
          { number: 1, description: 'Test exactness.', math: 'M_y = 1 = N_x \\checkmark' },
          { number: 2, description: 'Integrate M with respect to x.', math: 'F = x^2 + xy + g(y)' },
          { number: 3, description: 'Match Fy against N.', math: 'F_y = x + g\'(y) = x + 2y \\Rightarrow g(y) = y^2' },
        ],
        finalAnswer: 'x^2 + xy + y^2 = C',
      },
    ],
    tips: [
      'The constant in F = C is found by plugging in a known point.',
      'Verify: dF should reproduce M dx + N dy exactly.',
    ],
  },
  {
    id: 'second-order',
    title: 'Second-Order Constant Coefficients',
    icon: Layers,
    description:
      'For ay″ + by′ + cy = 0, substitute y = e^{rx} to get the characteristic equation. Its two roots determine the shape of the general solution.',
    keyFormula: {
      label: 'Characteristic Equation',
      formula: 'ar^2 + br + c = 0 \\Rightarrow y = C_1 e^{r_1 x} + C_2 e^{r_2 x}',
      explanation: 'Distinct real roots give two exponentials; a repeated root adds an x factor; complex roots a ± bi give e^{ax}(C1 cos bx + C2 sin bx).',
    },
    whenToUse: [
      'The equation is linear with constant coefficients and zero right side.',
      'Repeated root r → solutions e^{rx} and xe^{rx}.',
      'Complex roots → oscillation wrapped in an exponential envelope.',
    ],
    examples: [
      {
        problem: '\\text{Solve } y\'\' - 3y\' + 2y = 0\\text{, } y(0) = 2\\text{, } y\'(0) = 3',
        steps: [
          { number: 1, description: 'Characteristic equation.', math: 'r^2 - 3r + 2 = 0 \\Rightarrow r = 1, \\; 2' },
          { number: 2, description: 'General solution.', math: 'y = C_1 e^x + C_2 e^{2x}' },
          { number: 3, description: 'Apply both initial conditions.', math: 'C_1 + C_2 = 2, \\; C_1 + 2C_2 = 3 \\Rightarrow C_1 = C_2 = 1' },
        ],
        finalAnswer: 'y = e^x + e^{2x}',
      },
    ],
    tips: [
      'y′(0) gives an equation involving the roots — differentiate before plugging in.',
      'For complex roots, the imaginary part becomes the trig frequency.',
    ],
  },
  {
    id: 'undetermined-coefficients',
    title: 'Undetermined Coefficients',
    icon: Puzzle,
    description:
      'For nonhomogeneous equations with polynomial, exponential, or trig forcing, guess a trial y_p of the same shape and solve for its coefficients.',
    keyFormula: {
      label: 'Trial Solutions',
      formula: "f(x) = e^{kx} \\Rightarrow y_p = ae^{kx}, \\quad f(x) = x^n \\Rightarrow y_p = \\text{degree-}n \\text{ polynomial}",
      explanation: 'Substitute the trial into the left side, match coefficients with the forcing term, and solve for the unknowns.',
    },
    whenToUse: [
      'Constant coefficients + forcing made of polynomials, exponentials, sines/cosines.',
      'If the trial solves the homogeneous equation (resonance), multiply it by x.',
      'For sums of forcing terms, solve each part and add.',
    ],
    examples: [
      {
        problem: '\\text{Find } y_p \\text{ for } y\'\' - y = e^{3x}',
        steps: [
          { number: 1, description: 'Try y_p = ae^{3x}.', math: 'y_p\'\' = 9ae^{3x}' },
          { number: 2, description: 'Substitute.', math: '9ae^{3x} - ae^{3x} = e^{3x}' },
          { number: 3, description: 'Solve for a.', math: '8a = 1 \\Rightarrow a = \\frac{1}{8}' },
        ],
        finalAnswer: 'y_p = \\frac{e^{3x}}{8}',
      },
    ],
    tips: [
      'Check resonance first: plug the forcing exponent into the characteristic polynomial.',
      'Include ALL lower-degree terms in a polynomial trial (bx and c, not just ax²).',
    ],
  },
  {
    id: 'variation-of-parameters',
    title: 'Variation of Parameters',
    icon: Waves,
    description:
      'A fully general method: given two homogeneous solutions y1, y2, build y_p = u1 y1 + u2 y2 where u1′ and u2′ come from the Wronskian.',
    keyFormula: {
      label: 'Wronskian Formulas',
      formula: "u_1' = -\\frac{y_2 f}{W}, \\quad u_2' = \\frac{y_1 f}{W}, \\quad W = y_1 y_2' - y_1' y_2",
      explanation: 'Divide the equation by the leading coefficient first so the forcing is f(x); integrate u1′ and u2′ (constants can be set to zero).',
    },
    whenToUse: [
      'The forcing is not polynomial/exponential/trig (e.g., 1/x, tan x, e^x/x).',
      'Undetermined coefficients does not apply.',
      'Works for any linear second-order equation with known homogeneous solutions.',
    ],
    examples: [
      {
        problem: '\\text{Solve } y\'\' - y = e^x',
        steps: [
          { number: 1, description: 'Homogeneous solutions and Wronskian.', math: 'y_1 = e^x, \\; y_2 = e^{-x}, \\; W = -2' },
          { number: 2, description: 'Integrate u1′ and u2′.', math: 'u_1 = \\frac{x}{2}, \\quad u_2 = -\\frac{e^{2x}}{4}' },
          { number: 3, description: 'Assemble y_p.', math: 'y_p = \\frac{xe^x}{2} - \\frac{e^x}{4}' },
        ],
        finalAnswer: 'y_p = \\frac{xe^x}{2} - \\frac{e^x}{4}',
      },
    ],
    tips: [
      'Set integration constants to zero — they only add homogeneous pieces.',
      'Double-check the Wronskian sign; it flips if you swap y1 and y2.',
    ],
  },
  {
    id: 'laplace',
    title: 'Laplace Transforms',
    icon: Sigma,
    description:
      'The Laplace transform converts a differential equation into an algebra equation in s. Solve for Y(s), then invert with a transform table.',
    keyFormula: {
      label: 'Transform Pair',
      formula: '\\mathcal{L}\\{y\'\\} = sY - y(0), \\quad \\mathcal{L}\\{e^{ax}\\} = \\frac{1}{s - a}',
      explanation: 'Transform both sides, use the initial conditions immediately, solve for Y(s), and invert term by term.',
    },
    whenToUse: [
      'IVPs with discontinuous or impulsive forcing (steps, deltas).',
      'Systems where algebraic manipulation is easier than calculus.',
      'Memorize the core table: powers, exponentials, sine/cosine, shifts.',
    ],
    examples: [
      {
        problem: "\\text{Solve } y' + y = 0\\text{, } y(0) = 3\\text{ via Laplace}",
        steps: [
          { number: 1, description: 'Transform both sides.', math: 'sY - 3 + Y = 0' },
          { number: 2, description: 'Solve for Y(s).', math: 'Y(s) = \\frac{3}{s + 1}' },
          { number: 3, description: 'Invert.', math: 'y = 3e^{-x}' },
        ],
        finalAnswer: 'y = 3e^{-x}',
      },
    ],
    tips: [
      'Complete the square for quadratics like s² + 2s + 5 — that signals a shift.',
      'L{x^n} = n! / s^{n+1}: the factorial is easy to forget.',
    ],
  },
];

const seriesTechniques: TechniqueData[] = [
  {
    id: 'geometric-series',
    title: 'Geometric Series',
    icon: Hash,
    description:
      'A geometric series has a constant ratio r between consecutive terms. It converges exactly when |r| < 1, and then its sum has a clean closed form.',
    keyFormula: {
      label: 'Geometric Sum',
      formula: '\\sum_{n=0}^{\\infty} ar^n = \\frac{a}{1 - r} \\quad (|r| < 1)',
      explanation: 'Identify the first term a and ratio r. If |r| ≥ 1 the series diverges; otherwise the sum is a/(1 − r).',
    },
    whenToUse: [
      'Every term is the previous term times the same constant r.',
      'Rewrite the series in standard form ar^n before reading off a and r.',
      'For |r| ≥ 1 the terms do not even tend to 0 — divergence is immediate.',
    ],
    examples: [
      {
        problem: '\\sum_{n=0}^{\\infty} 3\\left(\\frac{2}{5}\\right)^n',
        steps: [
          { number: 1, description: 'Read off a = 3 and r = 2/5. Since |r| < 1, it converges.', math: 'a = 3, \\quad r = \\frac{2}{5}' },
          { number: 2, description: 'Apply the sum formula.', math: 'S = \\frac{3}{1 - \\frac{2}{5}} = \\frac{3}{\\frac{3}{5}}' },
          { number: 3, description: 'Simplify.', math: 'S = 5' },
        ],
        finalAnswer: '5',
      },
    ],
    tips: [
      'Shifting the index changes a but not r — the first term must match the actual first term.',
      'Decimals and repeating fractions are geometric series in disguise: 0.777… = 7/9.',
    ],
  },
  {
    id: 'p-series-telescoping',
    title: 'P-Series & Telescoping',
    icon: ListOrdered,
    description:
      'P-series Σ 1/n^p converge exactly when p > 1. Telescoping series collapse when partial fractions cancel intermediate terms, leaving only the first and last pieces.',
    keyFormula: {
      label: 'P-Series Test',
      formula: '\\sum_{n=1}^{\\infty} \\frac{1}{n^p} \\text{ converges } \\iff p > 1',
      explanation: 'This is the integral test applied to 1/x^p. For telescoping sums, compute the partial sum S_N and take its limit.',
    },
    whenToUse: [
      'The term is a power of n in the denominator (p-series).',
      'The term decomposes into partial fractions like 1/n − 1/(n+1) (telescoping).',
      'For telescoping, always write S_N explicitly and cancel before taking the limit.',
    ],
    examples: [
      {
        problem: '\\sum_{n=1}^{\\infty} \\frac{1}{n(n+1)}',
        steps: [
          { number: 1, description: 'Partial fractions.', math: '\\frac{1}{n(n+1)} = \\frac{1}{n} - \\frac{1}{n+1}' },
          { number: 2, description: 'Write the Nth partial sum; inner terms cancel.', math: 'S_N = 1 - \\frac{1}{N+1}' },
          { number: 3, description: 'Take the limit.', math: '\\lim_{N \\to \\infty} S_N = 1' },
        ],
        finalAnswer: '1',
      },
    ],
    tips: [
      'Σ 1/n (harmonic, p = 1) diverges — the classic borderline case.',
      'In telescoping sums with a shift of 2, two terms survive at each end.',
    ],
  },
  {
    id: 'divergence-test',
    title: 'Divergence Test',
    icon: AlertTriangle,
    description:
      'If the terms of a series do not tend to zero, the series must diverge. This is the first test to apply — but the converse is false.',
    keyFormula: {
      label: 'Nth-Term Test',
      formula: '\\lim_{n \\to \\infty} a_n \\neq 0 \\implies \\sum a_n \\text{ diverges}',
      explanation: 'Terms tending to 0 is necessary but NOT sufficient: Σ 1/n has terms → 0 yet still diverges.',
    },
    whenToUse: [
      'Apply it first — if a_n fails to approach 0, you are done immediately.',
      'Terms that approach a nonzero constant, oscillate, or grow all give divergence.',
      'If a_n → 0, this test says nothing; move on to another test.',
    ],
    examples: [
      {
        problem: '\\sum_{n=1}^{\\infty} \\frac{n}{2n + 1}',
        steps: [
          { number: 1, description: 'Compute the limit of the terms.', math: '\\lim_{n \\to \\infty} \\frac{n}{2n + 1} = \\frac{1}{2}' },
          { number: 2, description: 'The limit is not 0.', math: '\\frac{1}{2} \\neq 0' },
          { number: 3, description: 'Conclude divergence.', math: '\\text{The series diverges}' },
        ],
        finalAnswer: 'divergent',
      },
    ],
    tips: [
      'A limit of 0 proves nothing — never write "converges by the divergence test".',
      'Oscillating terms like (−1)^n have no limit, which also implies divergence.',
    ],
  },
  {
    id: 'ratio-test',
    title: 'Ratio Test',
    icon: Divide,
    description:
      'The ratio test compares consecutive terms. It shines with factorials, exponentials, and n-th powers, where the quotient simplifies dramatically.',
    keyFormula: {
      label: 'Ratio Test',
      formula: 'L = \\lim_{n \\to \\infty} \\left| \\frac{a_{n+1}}{a_n} \\right|; \\quad L < 1 \\text{ conv.}, \\ L > 1 \\text{ div.}, \\ L = 1 \\text{ inconclusive}',
      explanation: 'Take absolute values, form the quotient a_{n+1}/a_n, simplify, and take the limit.',
    },
    whenToUse: [
      'Terms involve n! or products — factorials cancel beautifully in the ratio.',
      'Terms involve exponentials like 2^n or r^n.',
      'If L = 1, switch to comparison, integral, or another test.',
    ],
    examples: [
      {
        problem: '\\sum_{n=1}^{\\infty} \\frac{2^n}{n!}',
        steps: [
          { number: 1, description: 'Form the ratio.', math: '\\left| \\frac{a_{n+1}}{a_n} \\right| = \\frac{2^{n+1}}{(n+1)!} \\cdot \\frac{n!}{2^n} = \\frac{2}{n+1}' },
          { number: 2, description: 'Take the limit.', math: 'L = \\lim_{n \\to \\infty} \\frac{2}{n+1} = 0' },
          { number: 3, description: 'L < 1, so the series converges.', math: '\\text{convergent}' },
        ],
        finalAnswer: 'convergent',
      },
    ],
    tips: [
      '(n+1)! = (n+1)·n! is the key factorial simplification.',
      'The ratio test is inconclusive for every p-series — do not waste time there.',
    ],
  },
  {
    id: 'root-test',
    title: 'Root Test',
    icon: Sprout,
    description:
      'The root test measures the nth root of the terms. It is tailor-made for series where the entire term is raised to the nth power.',
    keyFormula: {
      label: 'Root Test',
      formula: 'L = \\lim_{n \\to \\infty} \\sqrt[n]{|a_n|}; \\quad L < 1 \\text{ conv.}, \\ L > 1 \\text{ div.}, \\ L = 1 \\text{ inconclusive}',
      explanation: 'When a_n = (something)^n, the nth root strips the exponent and leaves a simple limit.',
    },
    whenToUse: [
      'The whole term is an nth power: a_n = (f(n))^n.',
      'Products of nth powers and other factors — use n^(1/n) → 1 for polynomial extras.',
      'Same conclusion thresholds as the ratio test.',
    ],
    examples: [
      {
        problem: '\\sum_{n=1}^{\\infty} \\left( \\frac{2n}{3n + 1} \\right)^n',
        steps: [
          { number: 1, description: 'Take the nth root.', math: '\\sqrt[n]{|a_n|} = \\frac{2n}{3n + 1}' },
          { number: 2, description: 'Take the limit.', math: 'L = \\lim_{n \\to \\infty} \\frac{2n}{3n + 1} = \\frac{2}{3}' },
          { number: 3, description: 'L < 1, so the series converges.', math: '\\text{convergent}' },
        ],
        finalAnswer: 'convergent',
      },
    ],
    tips: [
      'Remember n^(1/n) → 1 and (ln n)^(1/n) → 1 for leftover factors.',
      'If both ratio and root tests work, the root test limit is often the easier one.',
    ],
  },
  {
    id: 'comparison-tests',
    title: 'Comparison Tests',
    icon: Scale,
    description:
      'Compare your series with one you already understand — usually a p-series or geometric series. Direct comparison bounds the terms; limit comparison only needs the terms to behave alike asymptotically.',
    keyFormula: {
      label: 'Limit Comparison',
      formula: 'L = \\lim_{n \\to \\infty} \\frac{a_n}{b_n}, \\quad 0 < L < \\infty \\implies \\sum a_n, \\sum b_n \\text{ share a verdict}',
      explanation: 'Pick b_n as the dominant-term approximation of a_n. A finite positive limit means both series converge or both diverge.',
    },
    whenToUse: [
      'Rational or algebraic terms: keep only the highest powers of n.',
      'Direct comparison: 0 ≤ a_n ≤ b_n with Σb_n convergent forces Σa_n convergent.',
      'Limit comparison when the inequality direction of direct comparison is awkward.',
    ],
    examples: [
      {
        problem: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2 + 1}',
        steps: [
          { number: 1, description: 'Compare with the p-series b_n = 1/n^2 (p = 2 > 1, converges).', math: 'b_n = \\frac{1}{n^2}' },
          { number: 2, description: 'Limit comparison.', math: '\\lim_{n \\to \\infty} \\frac{1/(n^2+1)}{1/n^2} = \\lim_{n \\to \\infty} \\frac{n^2}{n^2 + 1} = 1' },
          { number: 3, description: 'L = 1 is finite and positive, so both converge.', math: '\\text{convergent}' },
        ],
        finalAnswer: 'convergent',
      },
    ],
    tips: [
      'For direct comparison, divergence needs a lower bound by a divergent series.',
      'Dominant-term analysis: 1/(n^2 + 3n) behaves like 1/n^2; n/(n^3 + 5) behaves like 1/n^2.',
    ],
  },
  {
    id: 'alternating-series',
    title: 'Alternating Series',
    icon: ArrowLeftRight,
    description:
      'An alternating series converges when its absolute terms decrease monotonically to 0. Then ask the follow-up question: does the absolute version converge too (absolute) or not (conditional)?',
    keyFormula: {
      label: 'Alternating Series Test',
      formula: 'b_n \\downarrow 0 \\implies \\sum (-1)^n b_n \\text{ converges}',
      explanation: 'Check b_{n+1} ≤ b_n eventually and b_n → 0. The truncation error is at most the first omitted term b_{N+1}.',
    },
    whenToUse: [
      'Terms carry a factor (−1)^n or (−1)^{n+1}.',
      'After convergence, test Σ|a_n| separately to classify absolute vs conditional.',
      'The error bound |S − S_N| ≤ b_{N+1} is a favorite exam question.',
    ],
    examples: [
      {
        problem: '\\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n}',
        steps: [
          { number: 1, description: 'b_n = 1/n decreases to 0, so AST gives convergence.', math: '\\frac{1}{n} \\downarrow 0' },
          { number: 2, description: 'Check the absolute series: Σ 1/n is the harmonic series.', math: '\\sum \\frac{1}{n} \\text{ diverges}' },
          { number: 3, description: 'Converges but not absolutely.', math: '\\text{conditionally convergent}' },
        ],
        finalAnswer: 'conditionally convergent',
      },
    ],
    tips: [
      'The alternating harmonic series sums to ln 2.',
      'To prove b_n decreases, show f′(x) < 0 for f(n) = b_n, or compare b_{n+1}/b_n < 1.',
    ],
  },
  {
    id: 'power-series',
    title: 'Power Series',
    icon: Superscript,
    description:
      'A power series is a polynomial of infinite degree centered at c. The ratio or root test finds the radius of convergence R; endpoints must be checked separately.',
    keyFormula: {
      label: 'Radius of Convergence',
      formula: '\\sum c_n (x - c)^n, \\quad |x - c| < R \\text{ conv.}, \\quad |x - c| > R \\text{ div.}',
      explanation: 'Apply the ratio test to |c_{n+1}(x−c)^{n+1} / c_n(x−c)^n| and solve |x − c| < R. Then test x = c ± R as ordinary series.',
    },
    whenToUse: [
      'Terms contain (x − c)^n — convergence depends on x.',
      'Interval of convergence = (c − R, c + R) plus any convergent endpoints.',
      'Know the standard series: e^x, sin x, cos x, 1/(1−x), ln(1+x).',
    ],
    examples: [
      {
        problem: '\\text{Find the interval of convergence of } \\sum_{n=0}^{\\infty} \\frac{x^n}{2^n}',
        steps: [
          { number: 1, description: 'Ratio test.', math: '\\lim_{n \\to \\infty} \\left| \\frac{x^{n+1}/2^{n+1}}{x^n/2^n} \\right| = \\frac{|x|}{2}' },
          { number: 2, description: 'Converges when |x|/2 < 1, so R = 2.', math: '|x| < 2' },
          { number: 3, description: 'Endpoints x = ±2 give Σ(±1)^n, which diverge (terms ↛ 0).', math: '(-2, \\ 2)' },
        ],
        finalAnswer: '(-2, 2)',
      },
    ],
    tips: [
      'This example is just a geometric series with r = x/2 — the formula 1/(1 − x/2) matches.',
      'Endpoint verdicts are independent: check each one with AST, p-series, or comparison.',
    ],
  },
];

/* ─────────────────────── main Learn page ─────────────────────── */
export default function Learn() {
  const [subject, setSubject] = useState<Subject>('integration')
  const activeTechniques = subject === 'integration' ? techniques : subject === 'differentiation' ? diffTechniques : subject === 'limits' ? limitTechniques : subject === 'applications-derivatives' ? appDiffTechniques : subject === 'applications-integration' ? appIntTechniques : subject === 'differential-equations' ? diffEqTechniques : seriesTechniques
  const [activeSection, setActiveSection] = useState(activeTechniques[0].id)
  const mainRef = useRef<HTMLDivElement>(null)
  /* IntersectionObserver for active section tracking */
  useEffect(() => {
    const sectionIds = [...activeTechniques.map((t) => t.id), 'quick-reference']
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: '-96px 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])
  return (
    <div className="bg-[#050505] min-h-[100dvh]">
      {/* Page Header */}
      <div className="border-b border-[#1F1F1F]">
        <div className="container-mathgen pt-12 pb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="font-display text-[clamp(1.8rem,3vw,2.8rem)] text-white leading-tight tracking-[-0.01em] mb-4"
          >
            {subject === 'integration' ? 'Integration Guide' : subject === 'differentiation' ? 'Differentiation Guide' : subject === 'limits' ? 'Limits Guide' : subject === 'applications-derivatives' ? 'Applications of Derivatives Guide' : subject === 'applications-integration' ? 'Applications of Integration Guide' : subject === 'differential-equations' ? 'Differential Equations Guide' : 'Sequences & Series Guide'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.15 }}
            className="text-[1.125rem] text-[#8A8A8A] leading-[1.7] max-w-[680px]"
          >
            {subject === 'integration' ? 'A comprehensive reference for integration techniques. Review formulas, study worked examples, and understand the methods behind every problem.' : subject === 'differentiation' ? 'A comprehensive reference for differentiation techniques. Review formulas, study worked examples, and understand the methods behind every problem.' : subject === 'limits' ? 'A comprehensive reference for limits. Review formulas, study worked examples, and understand the methods behind every problem.' : subject === 'applications-derivatives' ? 'A comprehensive reference for applications of derivatives — optimization, related rates, curve sketching, and more. Study worked examples and the strategy behind every technique.' : subject === 'applications-integration' ? 'A comprehensive reference for applications of integration — area, volume, arc length, work, and more. Study worked examples and the strategy behind every technique.' : subject === 'differential-equations' ? 'A comprehensive reference for differential equations — separable, linear, exact, second-order, and Laplace methods. Study worked examples and the strategy behind every technique.' : 'A comprehensive reference for sequences and series — geometric, p-series, ratio, root, comparison, alternating, and power series. Study worked examples and the strategy behind every technique.'}
          </motion.p>
          {/* Subject Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.25 }}
            className="flex gap-2 mt-6"
          >
            {(['integration', 'differentiation', 'limits', 'applications-derivatives', 'applications-integration', 'differential-equations', 'sequences-series'] as Subject[]).map((s) => (
              <button
                key={s}
                onClick={() => { setSubject(s); setActiveSection((s === 'integration' ? techniques : s === 'differentiation' ? diffTechniques : s === 'limits' ? limitTechniques : s === 'applications-derivatives' ? appDiffTechniques : s === 'applications-integration' ? appIntTechniques : s === 'differential-equations' ? diffEqTechniques : seriesTechniques)[0].id); }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
                  ${subject === s
                    ? 'border-[#C9A86C] bg-[rgba(201,168,108,0.1)] text-[#C9A86C]'
                    : 'border-[#1F1F1F] bg-[#111111] text-[#8A8A8A] hover:border-[#333333] hover:text-white'
                  }
                `}
              >
                {s === 'integration' && <Zap size={14} />}
                {s === 'differentiation' && <Target size={14} />}
                {s === 'limits' && <Clock size={14} />}
                {s === 'applications-derivatives' && <TrendingUp size={14} />}
                {s === 'applications-integration' && <TrendingUp size={14} />}
                {s === 'differential-equations' && <Sigma size={14} />}
                {s === 'sequences-series' && <Sigma size={14} />}
                {s === 'applications-derivatives' ? 'f′ Applications' : s === 'applications-integration' ? '∫ Applications' : s === 'differential-equations' ? 'y′ DiffEq' : s === 'sequences-series' ? 'Σ Series' : s}
              </button>
            ))}
          </motion.div>
        </div>
      </div>
      {/* Main Content */}
      <div className="container-mathgen py-10">
        <div className="flex gap-10">
          {/* Sidebar */}
          <LearnSidebar activeSection={activeSection} techniques={activeTechniques} />
          {/* Main Content Area */}
          <div ref={mainRef} className="flex-1 min-w-0 max-w-[800px]">
            {activeTechniques.map((t, i) => (
              <TechniqueSection key={t.id} technique={t} isLast={i === activeTechniques.length - 1} />
            ))}
            {subject === 'integration' && (
              <>
                <StrategySection />
                <QuickReferenceInline />
              </>
            )}
            {/* Bottom spacer */}
            <div className="h-20" />
          </div>
        </div>
      </div>
      {/* Floating Quick Reference */}
      <QuickReferenceCard />
    </div>
  )
}
