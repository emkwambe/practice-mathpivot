// ─────────────────────────────────────────────────────────────────────────────
// SEQUENCES & SERIES PROBLEM BANK (Phase 3 — EXPANSION_PLAN.md)
//
// Geometric series, p-series & telescoping, divergence test, ratio test,
// root test, comparison tests, alternating series, and power series.
// Answers are numeric, simple expressions, or categorical text verdicts
// (convergent / divergent / conditionally convergent / ...) that the hybrid
// checker's text-synonym mapping verifies. All LaTeX backslashes are doubled.
// ─────────────────────────────────────────────────────────────────────────────

import type { Difficulty, SeriesTechnique, ProblemTemplate } from '../problemGenerator';

// ═══════════════════════════════════════════════════════════════════════════
// GEOMETRIC SERIES
// ═══════════════════════════════════════════════════════════════════════════

const geometricEasy: ProblemTemplate[] = [
  {
    question: "\\text{Find the sum of the series } \\sum_{n=0}^{\\infty} \\left(\\frac{1}{2}\\right)^n\\text{.}",
    answer: "2",
    steps: [
      { number: 1, description: "Identify first term and ratio", math: "a = 1, \\quad r = \\frac{1}{2}" },
      { number: 2, description: "Apply the geometric sum formula", math: "S = \\frac{a}{1 - r} = \\frac{1}{1 - \\frac{1}{2}} = 2" },
    ],
    hints: ["The series converges since |r| < 1"],
    timeEstimate: 90,
  },
  {
    question: "\\text{Find the sum of } 3 + 1 + \\frac{1}{3} + \\frac{1}{9} + \\cdots\\text{.}",
    answer: "\\frac{9}{2}",
    steps: [
      { number: 1, description: "Identify first term and ratio", math: "a = 3, \\quad r = \\frac{1}{3}" },
      { number: 2, description: "Apply the geometric sum formula", math: "S = \\frac{3}{1 - \\frac{1}{3}} = \\frac{3}{\\frac{2}{3}} = \\frac{9}{2}" },
    ],
    hints: ["Each term is one third of the previous one"],
    timeEstimate: 90,
  },
  {
    question: "\\text{Find the sum of } 5 - 1 + \\frac{1}{5} - \\frac{1}{25} + \\cdots\\text{.}",
    answer: "\\frac{25}{6}",
    steps: [
      { number: 1, description: "Identify first term and ratio (note the alternating signs)", math: "a = 5, \\quad r = -\\frac{1}{5}" },
      { number: 2, description: "Apply the geometric sum formula", math: "S = \\frac{5}{1 - \\left(-\\frac{1}{5}\\right)} = \\frac{5}{\\frac{6}{5}} = \\frac{25}{6}" },
    ],
    hints: ["The ratio is negative"],
    timeEstimate: 120,
  },
];

const geometricMedium: ProblemTemplate[] = [
  {
    question: "\\text{Find the sum of } \\sum_{n=1}^{\\infty} 4\\left(\\frac{2}{3}\\right)^n\\text{.}",
    answer: "8",
    steps: [
      { number: 1, description: "The series starts at n = 1, so the first term is 4·(2/3)", math: "a = \\frac{8}{3}, \\quad r = \\frac{2}{3}" },
      { number: 2, description: "Apply the geometric sum formula", math: "S = \\frac{\\frac{8}{3}}{1 - \\frac{2}{3}} = \\frac{\\frac{8}{3}}{\\frac{1}{3}} = 8" },
    ],
    hints: ["Check the starting index — the first term is not 4"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Write the repeating decimal } 0.\\overline{7} = 0.777\\ldots\\text{ as a fraction using a geometric series.}",
    answer: "\\frac{7}{9}",
    steps: [
      { number: 1, description: "Expand as a geometric series", math: "0.\\overline{7} = \\frac{7}{10} + \\frac{7}{100} + \\cdots = \\sum_{n=1}^{\\infty} \\frac{7}{10^n}" },
      { number: 2, description: "Apply the geometric sum formula", math: "S = \\frac{\\frac{7}{10}}{1 - \\frac{1}{10}} = \\frac{7}{9}" },
    ],
    hints: ["First term 7/10, ratio 1/10"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Find the sum of } \\sum_{n=0}^{\\infty} \\frac{3^n}{4^{n+1}}\\text{.}",
    answer: "1",
    steps: [
      { number: 1, description: "Factor out the constant 4", math: "\\frac{3^n}{4^{n+1}} = \\frac{1}{4}\\left(\\frac{3}{4}\\right)^n" },
      { number: 2, description: "Apply the geometric sum formula", math: "S = \\frac{1}{4} \\cdot \\frac{1}{1 - \\frac{3}{4}} = \\frac{1}{4} \\cdot 4 = 1" },
    ],
    hints: ["Rewrite as a constant times (3/4)^n"],
    timeEstimate: 180,
  },
];

const geometricHard: ProblemTemplate[] = [
  {
    question: "\\text{Find the sum of } \\sum_{n=0}^{\\infty} \\frac{2^{n+1}}{5^n}\\text{.}",
    answer: "\\frac{10}{3}",
    steps: [
      { number: 1, description: "Factor out the constant 2", math: "\\frac{2^{n+1}}{5^n} = 2\\left(\\frac{2}{5}\\right)^n" },
      { number: 2, description: "Apply the geometric sum formula", math: "S = 2 \\cdot \\frac{1}{1 - \\frac{2}{5}} = 2 \\cdot \\frac{5}{3} = \\frac{10}{3}" },
    ],
    hints: ["Separate the extra factor of 2 from the ratio"],
    timeEstimate: 180,
  },
  {
    question: "\\text{The series } \\sum_{n=0}^{\\infty} x^n\\text{ converges for } |x| < 1\\text{ to } \\frac{1}{1-x}\\text{.} \\\\ \\text{Find its sum when } x = \\frac{1}{4}\\text{.}",
    answer: "\\frac{4}{3}",
    steps: [
      { number: 1, description: "Substitute x = 1/4 into the sum formula", math: "S = \\frac{1}{1 - \\frac{1}{4}}" },
      { number: 2, description: "Simplify", math: "S = \\frac{1}{\\frac{3}{4}} = \\frac{4}{3}" },
    ],
    hints: ["Just plug x into 1/(1 - x)"],
    timeEstimate: 120,
  },
  {
    question: "\\text{A ball is dropped from 10 m and rebounds to } \\frac{3}{4}\\text{ of its previous height} \\\\ \\text{each bounce. Find the total vertical distance it travels.}",
    answer: "70",
    steps: [
      { number: 1, description: "First drop, then pairs of up-and-down trips", math: "D = 10 + 2 \\sum_{n=1}^{\\infty} 10\\left(\\frac{3}{4}\\right)^n" },
      { number: 2, description: "Sum the series (first term 15/2)", math: "\\sum_{n=1}^{\\infty} 10\\left(\\frac{3}{4}\\right)^n = \\frac{\\frac{15}{2}}{1 - \\frac{3}{4}} = 30" },
      { number: 3, description: "Total distance", math: "D = 10 + 2(30) = 70 \\text{ m}" },
    ],
    hints: ["Every rebound counts twice: up and down", "The initial drop happens only once"],
    timeEstimate: 300,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// P-SERIES & TELESCOPING
// ═══════════════════════════════════════════════════════════════════════════

const pSeriesEasy: ProblemTemplate[] = [
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{1}{n^2}\\text{ converge or diverge?}",
    answer: "convergent",
    steps: [
      { number: 1, description: "Identify as a p-series with p = 2", math: "\\sum \\frac{1}{n^p} \\text{ converges iff } p > 1" },
      { number: 2, description: "Since 2 > 1, the series converges", math: "p = 2 > 1 \\Rightarrow \\text{convergent}" },
    ],
    hints: ["This is a p-series — compare p to 1"],
    timeEstimate: 60,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{1}{\\sqrt{n}}\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Rewrite as a p-series", math: "\\frac{1}{\\sqrt{n}} = \\frac{1}{n^{1/2}} \\Rightarrow p = \\frac{1}{2}" },
      { number: 2, description: "Since p ≤ 1, the series diverges", math: "p = \\frac{1}{2} \\le 1 \\Rightarrow \\text{divergent}" },
    ],
    hints: ["sqrt(n) is n to the power 1/2"],
    timeEstimate: 60,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{1}{n^{3/2}}\\text{ converge or diverge?}",
    answer: "convergent",
    steps: [
      { number: 1, description: "Identify as a p-series with p = 3/2", math: "p = \\frac{3}{2} > 1" },
      { number: 2, description: "The series converges", math: "p > 1 \\Rightarrow \\text{convergent}" },
    ],
    hints: ["Fractional exponents work the same way"],
    timeEstimate: 60,
  },
];

const pSeriesMedium: ProblemTemplate[] = [
  {
    question: "\\text{Find the sum of the telescoping series } \\sum_{n=1}^{\\infty} \\frac{1}{n(n+1)}\\text{.}",
    answer: "1",
    steps: [
      { number: 1, description: "Decompose with partial fractions", math: "\\frac{1}{n(n+1)} = \\frac{1}{n} - \\frac{1}{n+1}" },
      { number: 2, description: "Write the partial sum — everything cancels except the first term", math: "S_N = 1 - \\frac{1}{N+1}" },
      { number: 3, description: "Take the limit", math: "S = \\lim_{N \\to \\infty} \\left(1 - \\frac{1}{N+1}\\right) = 1" },
    ],
    hints: ["Use partial fractions first"],
    timeEstimate: 210,
  },
  {
    question: "\\text{Find the sum of } \\sum_{n=1}^{\\infty} \\frac{1}{n(n+2)}\\text{.}",
    answer: "\\frac{3}{4}",
    steps: [
      { number: 1, description: "Decompose with partial fractions", math: "\\frac{1}{n(n+2)} = \\frac{1}{2}\\left(\\frac{1}{n} - \\frac{1}{n+2}\\right)" },
      { number: 2, description: "Write the partial sum — two terms survive", math: "S_N = \\frac{1}{2}\\left(1 + \\frac{1}{2} - \\frac{1}{N+1} - \\frac{1}{N+2}\\right)" },
      { number: 3, description: "Take the limit", math: "S = \\frac{1}{2} \\cdot \\frac{3}{2} = \\frac{3}{4}" },
    ],
    hints: ["With a gap of 2, two initial terms survive the cancellation"],
    timeEstimate: 270,
  },
  {
    question: "\\text{Find the sum of } \\sum_{n=1}^{\\infty} \\left(\\frac{1}{n} - \\frac{1}{n+3}\\right)\\text{.}",
    answer: "\\frac{11}{6}",
    steps: [
      { number: 1, description: "The series telescopes with a gap of 3", math: "S_N = 1 + \\frac{1}{2} + \\frac{1}{3} - \\frac{1}{N+1} - \\frac{1}{N+2} - \\frac{1}{N+3}" },
      { number: 2, description: "Take the limit", math: "S = 1 + \\frac{1}{2} + \\frac{1}{3} = \\frac{11}{6}" },
    ],
    hints: ["With a gap of 3, three initial terms survive"],
    timeEstimate: 270,
  },
];

const pSeriesHard: ProblemTemplate[] = [
  {
    question: "\\text{The series } \\sum_{n=1}^{\\infty} \\frac{1}{n^p}\\text{ converges for real } p > 1\\text{.} \\\\ \\text{What is the smallest integer } p\\text{ for which it converges?}",
    answer: "2",
    steps: [
      { number: 1, description: "Recall the p-series test", math: "\\sum \\frac{1}{n^p} \\text{ converges iff } p > 1" },
      { number: 2, description: "p = 1 diverges (harmonic), p = 2 converges", math: "p_{\\min} = 2" },
    ],
    hints: ["p = 1 is the harmonic series, which diverges"],
    timeEstimate: 90,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\ln\\!\\left(\\frac{n}{n+1}\\right)\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Use the log property to telescope", math: "\\ln\\!\\left(\\frac{n}{n+1}\\right) = \\ln(n) - \\ln(n+1)" },
      { number: 2, description: "Write the partial sum", math: "S_N = \\ln(1) - \\ln(N+1) = -\\ln(N+1)" },
      { number: 3, description: "Take the limit", math: "S_N \\to -\\infty \\Rightarrow \\text{divergent}" },
    ],
    hints: ["Rewrite the log of a quotient as a difference"],
    timeEstimate: 240,
  },
  {
    question: "\\text{Find the sum of } \\sum_{n=1}^{\\infty} \\left(\\frac{1}{n+1} - \\frac{1}{n+3}\\right)\\text{.}",
    answer: "\\frac{5}{6}",
    steps: [
      { number: 1, description: "The series telescopes with a gap of 2, starting from n = 1", math: "S_N = \\frac{1}{2} + \\frac{1}{3} - \\frac{1}{N+2} - \\frac{1}{N+3}" },
      { number: 2, description: "Take the limit", math: "S = \\frac{1}{2} + \\frac{1}{3} = \\frac{5}{6}" },
    ],
    hints: ["List the first few terms to see what survives"],
    timeEstimate: 240,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// DIVERGENCE TEST (NTH TERM TEST)
// ═══════════════════════════════════════════════════════════════════════════

const divergenceEasy: ProblemTemplate[] = [
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{n}{n+1}\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Compute the limit of the nth term", math: "\\lim_{n \\to \\infty} \\frac{n}{n+1} = 1" },
      { number: 2, description: "The limit is not zero, so the series diverges", math: "\\lim a_n = 1 \\neq 0 \\Rightarrow \\text{divergent}" },
    ],
    hints: ["If the terms don't shrink to zero, the sum cannot converge"],
    timeEstimate: 90,
  },
  {
    question: "\\text{What does the divergence test conclude about } \\sum_{n=1}^{\\infty} \\frac{1}{n}\\text{?} \\\\ \\text{Answer: divergent or inconclusive.}",
    answer: "inconclusive",
    steps: [
      { number: 1, description: "Compute the limit of the nth term", math: "\\lim_{n \\to \\infty} \\frac{1}{n} = 0" },
      { number: 2, description: "A zero limit tells the test nothing", math: "\\text{the divergence test is inconclusive (the p-test shows it diverges)}" },
    ],
    hints: ["The divergence test only detects divergence, never convergence"],
    timeEstimate: 90,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{3n + 2}{n + 5}\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Compute the limit of the nth term", math: "\\lim_{n \\to \\infty} \\frac{3n + 2}{n + 5} = 3" },
      { number: 2, description: "The limit is not zero", math: "\\lim a_n = 3 \\neq 0 \\Rightarrow \\text{divergent}" },
    ],
    hints: ["Divide numerator and denominator by n"],
    timeEstimate: 90,
  },
];

const divergenceMedium: ProblemTemplate[] = [
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{n^2}{2n^2 + 1}\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Compute the limit of the nth term", math: "\\lim_{n \\to \\infty} \\frac{n^2}{2n^2 + 1} = \\frac{1}{2}" },
      { number: 2, description: "The limit is not zero", math: "\\lim a_n = \\frac{1}{2} \\neq 0 \\Rightarrow \\text{divergent}" },
    ],
    hints: ["Leading coefficients give the limit"],
    timeEstimate: 90,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\cos\\!\\left(\\frac{1}{n}\\right)\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Compute the limit of the nth term", math: "\\lim_{n \\to \\infty} \\cos\\!\\left(\\frac{1}{n}\\right) = \\cos(0) = 1" },
      { number: 2, description: "The limit is not zero", math: "\\lim a_n = 1 \\neq 0 \\Rightarrow \\text{divergent}" },
    ],
    hints: ["1/n approaches 0, and cos(0) = 1"],
    timeEstimate: 120,
  },
  {
    question: "\\text{What does the divergence test conclude about } \\sum_{n=1}^{\\infty} \\frac{1}{n^2}\\text{?} \\\\ \\text{Answer: convergent or inconclusive.}",
    answer: "inconclusive",
    steps: [
      { number: 1, description: "Compute the limit of the nth term", math: "\\lim_{n \\to \\infty} \\frac{1}{n^2} = 0" },
      { number: 2, description: "A zero limit tells the test nothing", math: "\\text{inconclusive (the p-test shows it converges)}" },
    ],
    hints: ["Zero limit = no information from this test"],
    timeEstimate: 90,
  },
];

const divergenceHard: ProblemTemplate[] = [
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{n^3 + 1}{2n^3 + n}\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Compute the limit of the nth term", math: "\\lim_{n \\to \\infty} \\frac{n^3 + 1}{2n^3 + n} = \\frac{1}{2}" },
      { number: 2, description: "The limit is not zero", math: "\\Rightarrow \\text{divergent}" },
    ],
    hints: ["Same-degree numerator and denominator"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{n!}{100^n}\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Factorials eventually outgrow any exponential", math: "\\lim_{n \\to \\infty} \\frac{n!}{100^n} = \\infty" },
      { number: 2, description: "The terms do not approach zero", math: "\\Rightarrow \\text{divergent}" },
    ],
    hints: ["Once n > 100, each new factor n/100 exceeds 1 and keeps growing"],
    timeEstimate: 180,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\left(1 + \\frac{1}{n}\\right)^n\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Recognize the classic limit", math: "\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n = e" },
      { number: 2, description: "The limit is not zero", math: "\\lim a_n = e \\neq 0 \\Rightarrow \\text{divergent}" },
    ],
    hints: ["This is the definition of e"],
    timeEstimate: 180,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// RATIO TEST
// ═══════════════════════════════════════════════════════════════════════════

const ratioEasy: ProblemTemplate[] = [
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{1}{n!}\\text{ converge or diverge?}",
    answer: "convergent",
    steps: [
      { number: 1, description: "Compute the ratio", math: "\\frac{a_{n+1}}{a_n} = \\frac{n!}{(n+1)!} = \\frac{1}{n+1}" },
      { number: 2, description: "Take the limit", math: "L = 0 < 1 \\Rightarrow \\text{convergent}" },
    ],
    hints: ["Factorials are ideal for the ratio test"],
    timeEstimate: 120,
  },
  {
    question: "\\text{For } \\sum_{n=1}^{\\infty} \\frac{3^n}{n!}\\text{, compute } L = \\lim_{n \\to \\infty} \\left| \\frac{a_{n+1}}{a_n} \\right|\\text{.}",
    answer: "0",
    steps: [
      { number: 1, description: "Compute the ratio", math: "\\frac{a_{n+1}}{a_n} = \\frac{3^{n+1}}{(n+1)!} \\cdot \\frac{n!}{3^n} = \\frac{3}{n+1}" },
      { number: 2, description: "Take the limit", math: "L = \\lim_{n \\to \\infty} \\frac{3}{n+1} = 0" },
    ],
    hints: ["The 3^n factors cancel down to a single 3"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\left(\\frac{2}{3}\\right)^n\\text{ converge or diverge (use the ratio test)?}",
    answer: "convergent",
    steps: [
      { number: 1, description: "Compute the ratio", math: "\\frac{a_{n+1}}{a_n} = \\frac{2}{3}" },
      { number: 2, description: "Take the limit", math: "L = \\frac{2}{3} < 1 \\Rightarrow \\text{convergent}" },
    ],
    hints: ["For a geometric series the ratio is exactly r"],
    timeEstimate: 90,
  },
];

const ratioMedium: ProblemTemplate[] = [
  {
    question: "\\text{For } \\sum_{n=1}^{\\infty} \\frac{n^2}{3^n}\\text{, compute } L = \\lim_{n \\to \\infty} \\left| \\frac{a_{n+1}}{a_n} \\right|\\text{.}",
    answer: "\\frac{1}{3}",
    steps: [
      { number: 1, description: "Compute the ratio", math: "\\frac{a_{n+1}}{a_n} = \\frac{(n+1)^2}{3^{n+1}} \\cdot \\frac{3^n}{n^2} = \\frac{1}{3}\\left(\\frac{n+1}{n}\\right)^2" },
      { number: 2, description: "Take the limit", math: "L = \\frac{1}{3} \\cdot 1 = \\frac{1}{3}" },
    ],
    hints: ["The polynomial factor's ratio approaches 1"],
    timeEstimate: 180,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{5^n}{n!}\\text{ converge or diverge?}",
    answer: "convergent",
    steps: [
      { number: 1, description: "Compute the ratio", math: "\\frac{a_{n+1}}{a_n} = \\frac{5}{n+1}" },
      { number: 2, description: "Take the limit", math: "L = 0 < 1 \\Rightarrow \\text{convergent}" },
    ],
    hints: ["The factorial dominates any fixed exponential"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{n!}{10^n}\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Compute the ratio", math: "\\frac{a_{n+1}}{a_n} = \\frac{n+1}{10}" },
      { number: 2, description: "Take the limit", math: "L = \\infty > 1 \\Rightarrow \\text{divergent}" },
    ],
    hints: ["The ratio grows without bound"],
    timeEstimate: 150,
  },
];

const ratioHard: ProblemTemplate[] = [
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{4^n}{n \\cdot 3^n}\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Compute the ratio", math: "\\frac{a_{n+1}}{a_n} = \\frac{4^{n+1}}{(n+1)3^{n+1}} \\cdot \\frac{n \\cdot 3^n}{4^n} = \\frac{4}{3} \\cdot \\frac{n}{n+1}" },
      { number: 2, description: "Take the limit", math: "L = \\frac{4}{3} > 1 \\Rightarrow \\text{divergent}" },
    ],
    hints: ["The factor n/(n+1) approaches 1"],
    timeEstimate: 210,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{(2n)!}{(n!)^2}\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Compute the ratio", math: "\\frac{a_{n+1}}{a_n} = \\frac{(2n+2)(2n+1)}{(n+1)^2}" },
      { number: 2, description: "Take the limit", math: "L = \\lim_{n \\to \\infty} \\frac{4n^2 + 6n + 2}{n^2 + 2n + 1} = 4 > 1 \\Rightarrow \\text{divergent}" },
    ],
    hints: ["(2n+2)!/(2n)! = (2n+2)(2n+1)"],
    timeEstimate: 270,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{(n!)^2}{(2n)!}\\text{ converge or diverge?}",
    answer: "convergent",
    steps: [
      { number: 1, description: "Compute the ratio", math: "\\frac{a_{n+1}}{a_n} = \\frac{(n+1)^2}{(2n+2)(2n+1)} = \\frac{n+1}{2(2n+1)}" },
      { number: 2, description: "Take the limit", math: "L = \\frac{1}{4} < 1 \\Rightarrow \\text{convergent}" },
    ],
    hints: ["This is the reciprocal of the previous series' terms"],
    timeEstimate: 270,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// ROOT TEST
// ═══════════════════════════════════════════════════════════════════════════

const rootEasy: ProblemTemplate[] = [
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\left(\\frac{2}{3}\\right)^n\\text{ converge or diverge (use the root test)?}",
    answer: "convergent",
    steps: [
      { number: 1, description: "Take the nth root", math: "\\sqrt[n]{\\left(\\frac{2}{3}\\right)^n} = \\frac{2}{3}" },
      { number: 2, description: "Take the limit", math: "L = \\frac{2}{3} < 1 \\Rightarrow \\text{convergent}" },
    ],
    hints: ["The nth root undoes the nth power"],
    timeEstimate: 90,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\left(\\frac{n}{2n+1}\\right)^n\\text{ converge or diverge?}",
    answer: "convergent",
    steps: [
      { number: 1, description: "Take the nth root", math: "\\sqrt[n]{a_n} = \\frac{n}{2n+1}" },
      { number: 2, description: "Take the limit", math: "L = \\frac{1}{2} < 1 \\Rightarrow \\text{convergent}" },
    ],
    hints: ["The outer nth power disappears with the root"],
    timeEstimate: 120,
  },
  {
    question: "\\text{For } \\sum_{n=1}^{\\infty} \\frac{1}{2^n}\\text{, compute } L = \\lim_{n \\to \\infty} \\sqrt[n]{|a_n|}\\text{.}",
    answer: "\\frac{1}{2}",
    steps: [
      { number: 1, description: "Take the nth root", math: "\\sqrt[n]{\\frac{1}{2^n}} = \\frac{1}{2}" },
      { number: 2, description: "The limit is immediate", math: "L = \\frac{1}{2}" },
    ],
    hints: ["The nth root of 1/2^n is exactly 1/2"],
    timeEstimate: 90,
  },
];

const rootMedium: ProblemTemplate[] = [
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\left(\\frac{3n+1}{n+4}\\right)^n\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Take the nth root", math: "\\sqrt[n]{a_n} = \\frac{3n+1}{n+4}" },
      { number: 2, description: "Take the limit", math: "L = 3 > 1 \\Rightarrow \\text{divergent}" },
    ],
    hints: ["Divide numerator and denominator by n"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\left(\\frac{n}{5}\\right)^n\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Take the nth root", math: "\\sqrt[n]{a_n} = \\frac{n}{5}" },
      { number: 2, description: "Take the limit", math: "L = \\infty > 1 \\Rightarrow \\text{divergent}" },
    ],
    hints: ["The nth root grows without bound"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\left(\\frac{2n}{n+1}\\right)^n\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Take the nth root", math: "\\sqrt[n]{a_n} = \\frac{2n}{n+1}" },
      { number: 2, description: "Take the limit", math: "L = 2 > 1 \\Rightarrow \\text{divergent}" },
    ],
    hints: ["The ratio inside approaches 2"],
    timeEstimate: 120,
  },
];

const rootHard: ProblemTemplate[] = [
  {
    question: "\\text{For } \\sum_{n=1}^{\\infty} \\frac{n}{2^n}\\text{, compute } L = \\lim_{n \\to \\infty} \\sqrt[n]{|a_n|}\\text{.}",
    answer: "\\frac{1}{2}",
    steps: [
      { number: 1, description: "Take the nth root", math: "\\sqrt[n]{a_n} = \\frac{n^{1/n}}{2}" },
      { number: 2, description: "Use the fact that n^(1/n) approaches 1", math: "L = \\frac{1}{2} \\cdot 1 = \\frac{1}{2}" },
    ],
    hints: ["n^(1/n) → 1 is a standard limit"],
    timeEstimate: 210,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\left(\\frac{n+1}{2n}\\right)^n\\text{ converge or diverge?}",
    answer: "convergent",
    steps: [
      { number: 1, description: "Take the nth root", math: "\\sqrt[n]{a_n} = \\frac{n+1}{2n}" },
      { number: 2, description: "Take the limit", math: "L = \\frac{1}{2} < 1 \\Rightarrow \\text{convergent}" },
    ],
    hints: ["(n+1)/(2n) approaches 1/2"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\left(1 + \\frac{1}{n}\\right)^{n^2}\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Take the nth root", math: "\\sqrt[n]{a_n} = \\left(1 + \\frac{1}{n}\\right)^n" },
      { number: 2, description: "Take the limit — the classic definition of e", math: "L = e > 1 \\Rightarrow \\text{divergent}" },
    ],
    hints: ["(1 + 1/n)^n → e ≈ 2.718"],
    timeEstimate: 210,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPARISON TESTS
// ═══════════════════════════════════════════════════════════════════════════

const comparisonEasy: ProblemTemplate[] = [
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{1}{n^2 + 1}\\text{ converge or diverge?}",
    answer: "convergent",
    steps: [
      { number: 1, description: "Compare directly with the convergent p-series (p = 2)", math: "\\frac{1}{n^2 + 1} < \\frac{1}{n^2}" },
      { number: 2, description: "Larger convergent series dominates", math: "\\sum \\frac{1}{n^2} \\text{ converges} \\Rightarrow \\text{convergent}" },
    ],
    hints: ["A bigger denominator makes a smaller term"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{1}{n + 1}\\text{ converge or diverge (compare with the harmonic series)?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Limit comparison with 1/n", math: "\\lim_{n \\to \\infty} \\frac{\\frac{1}{n+1}}{\\frac{1}{n}} = \\lim_{n \\to \\infty} \\frac{n}{n+1} = 1" },
      { number: 2, description: "Same fate as the harmonic series", math: "\\sum \\frac{1}{n} \\text{ diverges} \\Rightarrow \\text{divergent}" },
    ],
    hints: ["Limit comparison: a finite positive limit means same behavior"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{1}{n^3 + 5}\\text{ converge or diverge?}",
    answer: "convergent",
    steps: [
      { number: 1, description: "Compare with the convergent p-series (p = 3)", math: "\\frac{1}{n^3 + 5} < \\frac{1}{n^3}" },
      { number: 2, description: "Larger convergent series dominates", math: "\\Rightarrow \\text{convergent}" },
    ],
    hints: ["p = 3 > 1"],
    timeEstimate: 120,
  },
];

const comparisonMedium: ProblemTemplate[] = [
  {
    question: "\\text{Does } \\sum_{n=2}^{\\infty} \\frac{1}{n^2 - 3}\\text{ converge or diverge?}",
    answer: "convergent",
    steps: [
      { number: 1, description: "Limit comparison with 1/n^2", math: "\\lim_{n \\to \\infty} \\frac{n^2}{n^2 - 3} = 1" },
      { number: 2, description: "Same fate as the p-series (p = 2)", math: "\\Rightarrow \\text{convergent}" },
    ],
    hints: ["The constant -3 is negligible for large n"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{n + 1}{n^3}\\text{ converge or diverge?}",
    answer: "convergent",
    steps: [
      { number: 1, description: "Split the fraction", math: "\\frac{n + 1}{n^3} = \\frac{1}{n^2} + \\frac{1}{n^3}" },
      { number: 2, description: "Both pieces are convergent p-series", math: "p = 2 \\text{ and } p = 3 \\Rightarrow \\text{convergent}" },
    ],
    hints: ["Split into two p-series"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{1}{2n + 1}\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Limit comparison with 1/n", math: "\\lim_{n \\to \\infty} \\frac{n}{2n + 1} = \\frac{1}{2}" },
      { number: 2, description: "Same fate as the harmonic series", math: "\\Rightarrow \\text{divergent}" },
    ],
    hints: ["A positive finite limit means same behavior"],
    timeEstimate: 150,
  },
];

const comparisonHard: ProblemTemplate[] = [
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{n^2 + 1}{n^4 + 3n}\\text{ converge or diverge?}",
    answer: "convergent",
    steps: [
      { number: 1, description: "Identify dominant powers: the term behaves like 1/n^2", math: "\\frac{n^2 + 1}{n^4 + 3n} \\sim \\frac{1}{n^2}" },
      { number: 2, description: "Limit comparison with 1/n^2", math: "\\lim_{n \\to \\infty} \\frac{n^2(n^2 + 1)}{n^4 + 3n} = 1 \\Rightarrow \\text{convergent}" },
    ],
    hints: ["Compare leading powers top and bottom"],
    timeEstimate: 210,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{n + 2}{n^2 + n}\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "The term behaves like 1/n for large n", math: "\\frac{n + 2}{n^2 + n} \\sim \\frac{1}{n}" },
      { number: 2, description: "Limit comparison with the harmonic series", math: "\\lim_{n \\to \\infty} \\frac{n(n+2)}{n^2 + n} = 1 \\Rightarrow \\text{divergent}" },
    ],
    hints: ["Degree difference is 1 — harmonic-like"],
    timeEstimate: 210,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{3^n}{4^n + 1}\\text{ converge or diverge?}",
    answer: "convergent",
    steps: [
      { number: 1, description: "Bound the term by a geometric series", math: "\\frac{3^n}{4^n + 1} < \\frac{3^n}{4^n} = \\left(\\frac{3}{4}\\right)^n" },
      { number: 2, description: "The geometric series converges (r = 3/4)", math: "\\Rightarrow \\text{convergent}" },
    ],
    hints: ["Dropping the +1 makes the denominator smaller and the term bigger"],
    timeEstimate: 180,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// ALTERNATING SERIES
// ═══════════════════════════════════════════════════════════════════════════

const alternatingEasy: ProblemTemplate[] = [
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n}\\text{ converge or diverge?}",
    answer: "convergent",
    steps: [
      { number: 1, description: "Check the alternating series test conditions", math: "\\frac{1}{n} \\text{ decreases and } \\frac{1}{n} \\to 0" },
      { number: 2, description: "Both conditions hold", math: "\\Rightarrow \\text{convergent (conditionally)}" },
    ],
    hints: ["Alternating series test: terms must decrease to zero"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Classify } \\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n^2}\\text{: converges absolutely,} \\\\ \\text{conditionally convergent, or divergent?}",
    answer: "converges absolutely",
    steps: [
      { number: 1, description: "Take absolute values", math: "\\sum \\left| \\frac{(-1)^n}{n^2} \\right| = \\sum \\frac{1}{n^2}" },
      { number: 2, description: "The absolute series converges (p = 2)", math: "\\Rightarrow \\text{converges absolutely}" },
    ],
    hints: ["Absolute convergence means the absolute-value series converges"],
    timeEstimate: 150,
  },
  {
    question: "\\text{The alternating series } \\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{2n - 1} = 1 - \\frac{1}{3} + \\frac{1}{5} - \\cdots \\\\ \\text{is the Leibniz series. Find its exact sum.}",
    answer: "\\frac{\\pi}{4}",
    steps: [
      { number: 1, description: "Recall the arctangent series at x = 1", math: "\\arctan(x) = x - \\frac{x^3}{3} + \\frac{x^5}{5} - \\cdots" },
      { number: 2, description: "Evaluate at x = 1", math: "\\arctan(1) = \\frac{\\pi}{4}" },
    ],
    hints: ["This is arctan(1)"],
    timeEstimate: 180,
  },
];

const alternatingMedium: ProblemTemplate[] = [
  {
    question: "\\text{Classify } \\sum_{n=1}^{\\infty} \\frac{(-1)^n}{\\sqrt{n}}\\text{: converges absolutely,} \\\\ \\text{conditionally convergent, or divergent?}",
    answer: "conditionally convergent",
    steps: [
      { number: 1, description: "Alternating series test: 1/sqrt(n) decreases to 0, so it converges", math: "\\frac{1}{\\sqrt{n}} \\downarrow 0 \\Rightarrow \\text{converges}" },
      { number: 2, description: "But the absolute series diverges (p = 1/2)", math: "\\sum \\frac{1}{\\sqrt{n}} \\text{ diverges} \\Rightarrow \\text{conditionally convergent}" },
    ],
    hints: ["Converges by AST, but check the absolute series too"],
    timeEstimate: 210,
  },
  {
    question: "\\text{Does } \\sum_{n=1}^{\\infty} \\frac{(-1)^n \\, n}{n + 1}\\text{ converge or diverge?}",
    answer: "divergent",
    steps: [
      { number: 1, description: "Check the term limit", math: "\\lim_{n \\to \\infty} \\frac{(-1)^n n}{n+1} \\text{ does not exist (oscillates between } \\pm 1\\text{)}" },
      { number: 2, description: "Terms do not approach zero", math: "\\Rightarrow \\text{divergent}" },
    ],
    hints: ["The alternating series test needs the terms to shrink to zero"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Approximate } \\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n}\\text{ using its first 10 terms.} \\\\ \\text{By the alternating series estimation theorem, the error is at most } a_{11}\\text{. Find that bound.}",
    answer: "\\frac{1}{11}",
    steps: [
      { number: 1, description: "The error of an alternating partial sum is at most the first omitted term", math: "|S - S_{10}| \\le a_{11}" },
      { number: 2, description: "Compute a_11", math: "a_{11} = \\frac{1}{11}" },
    ],
    hints: ["The bound is the first term you left out"],
    timeEstimate: 150,
  },
];

const alternatingHard: ProblemTemplate[] = [
  {
    question: "\\text{The series } \\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n^p}\\text{ converges for any real } p > 0\\text{.} \\\\ \\text{What is the smallest integer } p\\text{ for which it converges?}",
    answer: "1",
    steps: [
      { number: 1, description: "The alternating series test only needs the terms to decrease to zero", math: "\\frac{1}{n^p} \\downarrow 0 \\text{ for any } p > 0" },
      { number: 2, description: "Smallest positive integer", math: "p_{\\min} = 1" },
    ],
    hints: ["Unlike the p-series, p > 0 suffices for alternating series"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Classify } \\sum_{n=2}^{\\infty} \\frac{(-1)^n}{n \\ln(n)}\\text{: converges absolutely,} \\\\ \\text{conditionally convergent, or divergent?}",
    answer: "conditionally convergent",
    steps: [
      { number: 1, description: "Alternating series test applies", math: "\\frac{1}{n \\ln(n)} \\downarrow 0 \\Rightarrow \\text{converges}" },
      { number: 2, description: "The absolute series diverges by the integral test", math: "\\int_2^{\\infty} \\frac{dx}{x \\ln(x)} = [\\ln(\\ln(x))]_2^{\\infty} = \\infty \\Rightarrow \\text{conditionally convergent}" },
    ],
    hints: ["Use the integral test on the absolute series"],
    timeEstimate: 270,
  },
  {
    question: "\\text{Classify } \\sum_{n=1}^{\\infty} \\frac{(-1)^n (n + 1)}{n^2}\\text{: converges absolutely,} \\\\ \\text{conditionally convergent, or divergent?}",
    answer: "conditionally convergent",
    steps: [
      { number: 1, description: "The terms (n+1)/n^2 ~ 1/n decrease to 0, so AST gives convergence", math: "\\frac{n+1}{n^2} \\downarrow 0" },
      { number: 2, description: "The absolute series behaves like the harmonic series", math: "\\sum \\frac{n+1}{n^2} \\sim \\sum \\frac{1}{n} \\Rightarrow \\text{diverges} \\Rightarrow \\text{conditionally convergent}" },
    ],
    hints: ["Behaves like the alternating harmonic series"],
    timeEstimate: 240,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// POWER SERIES / TAYLOR-MACLAURIN
// ═══════════════════════════════════════════════════════════════════════════

const powerSeriesEasy: ProblemTemplate[] = [
  {
    question: "\\text{Find the radius of convergence of } \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}\\text{.}",
    answer: "infinity",
    steps: [
      { number: 1, description: "Apply the ratio test to the terms", math: "\\left| \\frac{a_{n+1}}{a_n} \\right| = \\frac{|x|}{n+1} \\to 0 \\text{ for every } x" },
      { number: 2, description: "Converges for all x", math: "R = \\infty" },
    ],
    hints: ["This is the Maclaurin series for e^x — it converges everywhere"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Find the radius of convergence of } \\sum_{n=0}^{\\infty} \\frac{x^n}{2^n}\\text{.}",
    answer: "2",
    steps: [
      { number: 1, description: "Recognize a geometric series in x/2", math: "\\sum \\left(\\frac{x}{2}\\right)^n \\text{ converges iff } \\left|\\frac{x}{2}\\right| < 1" },
      { number: 2, description: "Solve for x", math: "|x| < 2 \\Rightarrow R = 2" },
    ],
    hints: ["Treat it as geometric with ratio x/2"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Find the radius of convergence of } \\sum_{n=1}^{\\infty} n x^n\\text{.}",
    answer: "1",
    steps: [
      { number: 1, description: "Apply the ratio test", math: "\\left| \\frac{a_{n+1}}{a_n} \\right| = \\frac{n+1}{n} |x| \\to |x|" },
      { number: 2, description: "Converges when |x| < 1", math: "R = 1" },
    ],
    hints: ["The factor n contributes a ratio limit of 1"],
    timeEstimate: 120,
  },
];

const powerSeriesMedium: ProblemTemplate[] = [
  {
    question: "\\text{Find the radius of convergence of } \\sum_{n=1}^{\\infty} \\frac{x^n}{n \\cdot 3^n}\\text{.}",
    answer: "3",
    steps: [
      { number: 1, description: "Apply the ratio test", math: "\\left| \\frac{a_{n+1}}{a_n} \\right| = \\frac{n}{n+1} \\cdot \\frac{|x|}{3} \\to \\frac{|x|}{3}" },
      { number: 2, description: "Converges when |x|/3 < 1", math: "R = 3" },
    ],
    hints: ["The polynomial factor n does not change the radius"],
    timeEstimate: 180,
  },
  {
    question: "\\text{Find the radius of convergence of } \\sum_{n=1}^{\\infty} \\frac{(x - 2)^n}{n^2}\\text{.}",
    answer: "1",
    steps: [
      { number: 1, description: "Apply the ratio test", math: "\\left| \\frac{a_{n+1}}{a_n} \\right| = \\frac{n^2}{(n+1)^2} |x - 2| \\to |x - 2|" },
      { number: 2, description: "Converges when |x - 2| < 1", math: "R = 1 \\quad (\\text{centered at } x = 2)" },
    ],
    hints: ["The center shifts the interval, not the radius"],
    timeEstimate: 180,
  },
  {
    question: "\\text{Find the radius of convergence of } \\sum_{n=0}^{\\infty} n! \\, x^n\\text{.}",
    answer: "0",
    steps: [
      { number: 1, description: "Apply the ratio test", math: "\\left| \\frac{a_{n+1}}{a_n} \\right| = (n+1)|x| \\to \\infty \\text{ for any } x \\neq 0" },
      { number: 2, description: "Converges only at x = 0", math: "R = 0" },
    ],
    hints: ["Factorial coefficients shrink the radius to nothing"],
    timeEstimate: 150,
  },
];

const powerSeriesHard: ProblemTemplate[] = [
  {
    question: "\\text{In the Maclaurin series } e^x = \\sum_{n=0}^{\\infty} c_n x^n\\text{, find } c_4\\text{.}",
    answer: "\\frac{1}{24}",
    steps: [
      { number: 1, description: "Recall the Maclaurin coefficients of e^x", math: "c_n = \\frac{f^{(n)}(0)}{n!} = \\frac{1}{n!}" },
      { number: 2, description: "Evaluate at n = 4", math: "c_4 = \\frac{1}{4!} = \\frac{1}{24}" },
    ],
    hints: ["Every derivative of e^x at 0 equals 1"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Find the radius of convergence of } \\sum_{n=1}^{\\infty} \\frac{(x + 1)^n}{n \\cdot 4^n}\\text{.}",
    answer: "4",
    steps: [
      { number: 1, description: "Apply the ratio test", math: "\\left| \\frac{a_{n+1}}{a_n} \\right| = \\frac{n}{n+1} \\cdot \\frac{|x+1|}{4} \\to \\frac{|x+1|}{4}" },
      { number: 2, description: "Converges when |x + 1| < 4", math: "R = 4 \\quad (\\text{centered at } x = -1)" },
    ],
    hints: ["The center is x = -1; the radius comes from the 4^n"],
    timeEstimate: 210,
  },
  {
    question: "\\text{The interval of convergence of } \\sum_{n=1}^{\\infty} \\frac{x^n}{n}\\text{ is } [-1, 1)\\text{.} \\\\ \\text{At which endpoint does the series converge?}",
    answer: "-1",
    steps: [
      { number: 1, description: "Test x = 1", math: "\\sum \\frac{1}{n} \\text{ diverges (harmonic)}" },
      { number: 2, description: "Test x = -1", math: "\\sum \\frac{(-1)^n}{n} \\text{ converges (alternating harmonic)}" },
    ],
    hints: ["Plug each endpoint into the series separately"],
    timeEstimate: 180,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// BANK EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const seriesProblemBank: Record<SeriesTechnique, Record<Difficulty, ProblemTemplate[]>> = {
  'geometric-series': {
    easy: geometricEasy,
    medium: geometricMedium,
    hard: geometricHard,
  },
  'p-series-telescoping': {
    easy: pSeriesEasy,
    medium: pSeriesMedium,
    hard: pSeriesHard,
  },
  'divergence-test': {
    easy: divergenceEasy,
    medium: divergenceMedium,
    hard: divergenceHard,
  },
  'ratio-test': {
    easy: ratioEasy,
    medium: ratioMedium,
    hard: ratioHard,
  },
  'root-test': {
    easy: rootEasy,
    medium: rootMedium,
    hard: rootHard,
  },
  'comparison-tests': {
    easy: comparisonEasy,
    medium: comparisonMedium,
    hard: comparisonHard,
  },
  'alternating-series': {
    easy: alternatingEasy,
    medium: alternatingMedium,
    hard: alternatingHard,
  },
  'power-series': {
    easy: powerSeriesEasy,
    medium: powerSeriesMedium,
    hard: powerSeriesHard,
  },
  'mixed-series': {
    easy: [],
    medium: [],
    hard: [],
  },
};
