// ─────────────────────────────────────────────────────────────────────────────
// APPLICATIONS OF DERIVATIVES PROBLEM BANK (Phase 2 — EXPANSION_PLAN.md)
//
// Word problems with context: optimization, related rates, curve sketching,
// mean value theorem, linear approximation, motion, and economics.
// Answers are numeric or simple expressions so the hybrid math.js checker
// can verify them. All LaTeX backslashes are doubled for JS strings.
// ─────────────────────────────────────────────────────────────────────────────

import type { Difficulty, AppDerivativesTechnique, ProblemTemplate } from '../problemGenerator';

// ═══════════════════════════════════════════════════════════════════════════
// OPTIMIZATION
// ═══════════════════════════════════════════════════════════════════════════

const optimizationEasy: ProblemTemplate[] = [
  {
    question: "\\text{A farmer has } 240 \\text{ m of fencing and wants to enclose a rectangular field} \\\\ \\text{against a straight river, using fencing on only 3 sides. Let } x \\text{ be the length} \\\\ \\text{of each side perpendicular to the river. Find } x \\text{ that maximizes the area.}",
    answer: "60",
    steps: [
      { number: 1, description: "Write the constraint: two perpendicular sides and one parallel side use 240 m", math: "2x + y = 240 \\Rightarrow y = 240 - 2x" },
      { number: 2, description: "Write the area as a function of x", math: "A(x) = x(240 - 2x) = 240x - 2x^2" },
      { number: 3, description: "Differentiate and set equal to zero", math: "A'(x) = 240 - 4x = 0 \\Rightarrow x = 60" },
      { number: 4, description: "Confirm it is a maximum using the second derivative", math: "A''(x) = -4 < 0 \\Rightarrow \\text{maximum at } x = 60" },
    ],
    hints: ["Express the parallel side y using the fencing constraint, then write area as a function of x only", "A(x) = 240x - 2x^2 — set A'(x) = 0"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Two positive numbers have a sum of } 36. \\text{ What should each number be} \\\\ \\text{so that their product is as large as possible?}",
    answer: "18",
    steps: [
      { number: 1, description: "Let the numbers be x and y, with the constraint", math: "x + y = 36 \\Rightarrow y = 36 - x" },
      { number: 2, description: "Write the product as a function of one variable", math: "P(x) = x(36 - x) = 36x - x^2" },
      { number: 3, description: "Differentiate and solve", math: "P'(x) = 36 - 2x = 0 \\Rightarrow x = 18" },
      { number: 4, description: "Verify with the second derivative", math: "P''(x) = -2 < 0 \\Rightarrow \\text{maximum}" },
    ],
    hints: ["If x + y = 36, write the product as P(x) = x(36 - x)", "Set P'(x) = 0 and solve for x"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Two real numbers add up to } 20. \\text{ Find the value of } x \\text{ (one of the numbers)} \\\\ \\text{that minimizes the sum of their squares.}",
    answer: "10",
    steps: [
      { number: 1, description: "Let the numbers be x and 20 - x", math: "S(x) = x^2 + (20 - x)^2" },
      { number: 2, description: "Expand", math: "S(x) = x^2 + 400 - 40x + x^2 = 2x^2 - 40x + 400" },
      { number: 3, description: "Differentiate and set equal to zero", math: "S'(x) = 4x - 40 = 0 \\Rightarrow x = 10" },
      { number: 4, description: "Confirm minimum", math: "S''(x) = 4 > 0 \\Rightarrow \\text{minimum at } x = 10" },
    ],
    hints: ["Write the sum of squares using x and (20 - x)", "S(x) = 2x^2 - 40x + 400 — minimize"],
    timeEstimate: 120,
  },
];

const optimizationMedium: ProblemTemplate[] = [
  {
    question: "\\text{An open-top box is made from a } 24 \\text{ cm square sheet of cardboard by cutting} \\\\ \\text{equal squares of side } x \\text{ from each corner and folding up the sides.} \\\\ \\text{Find } x \\text{ that maximizes the volume.}",
    answer: "4",
    steps: [
      { number: 1, description: "After cutting, the base is (24 - 2x) by (24 - 2x) and the height is x", math: "V(x) = x(24 - 2x)^2" },
      { number: 2, description: "Expand", math: "V(x) = x(576 - 96x + 4x^2) = 4x^3 - 96x^2 + 576x" },
      { number: 3, description: "Differentiate", math: "V'(x) = 12x^2 - 192x + 576 = 12(x^2 - 16x + 48) = 12(x - 4)(x - 12)" },
      { number: 4, description: "Set V'(x) = 0 and pick the physically valid root", math: "x = 4 \\text{ or } x = 12; \\quad x = 12 \\text{ leaves no base, so } x = 4" },
    ],
    hints: ["Volume = x(24 - 2x)^2 — expand before differentiating", "V'(x) = 12(x - 4)(x - 12); one root is not physically possible"],
    timeEstimate: 240,
  },
  {
    question: "\\text{A rectangular garden must have an area of } 100 \\text{ m}^2\\text{. What should the length} \\\\ \\text{of one side be (the garden is square at the optimum) to minimize the fencing} \\\\ \\text{needed around all four sides?}",
    answer: "10",
    steps: [
      { number: 1, description: "Constraint: the area is fixed", math: "xy = 100 \\Rightarrow y = \\frac{100}{x}" },
      { number: 2, description: "Write the fencing (perimeter) as a function of x", math: "F(x) = 2x + 2y = 2x + \\frac{200}{x}" },
      { number: 3, description: "Differentiate and set equal to zero", math: "F'(x) = 2 - \\frac{200}{x^2} = 0 \\Rightarrow x^2 = 100 \\Rightarrow x = 10" },
      { number: 4, description: "Confirm minimum", math: "F''(x) = \\frac{400}{x^3} > 0 \\text{ for } x > 0 \\Rightarrow \\text{minimum}" },
    ],
    hints: ["Perimeter F(x) = 2x + 200/x", "Set F'(x) = 0: 2 = 200/x^2"],
    timeEstimate: 180,
  },
  {
    question: "\\text{One positive number plus twice a second positive number equals } 48. \\\\ \\text{Find the first number } x \\text{ that maximizes the product of the two numbers.}",
    answer: "24",
    steps: [
      { number: 1, description: "Write the constraint", math: "x + 2y = 48 \\Rightarrow y = \\frac{48 - x}{2}" },
      { number: 2, description: "Write the product as a function of x", math: "P(x) = x \\cdot \\frac{48 - x}{2} = 24x - \\frac{x^2}{2}" },
      { number: 3, description: "Differentiate and solve", math: "P'(x) = 24 - x = 0 \\Rightarrow x = 24" },
      { number: 4, description: "Confirm maximum", math: "P''(x) = -1 < 0 \\Rightarrow \\text{maximum at } x = 24" },
    ],
    hints: ["Solve x + 2y = 48 for y, then write the product P(x)", "P(x) = 24x - x^2/2"],
    timeEstimate: 180,
  },
];

const optimizationHard: ProblemTemplate[] = [
  {
    question: "\\text{An open-top box with a square base must hold } 32 \\text{ m}^3\\text{. Let } x \\text{ be the side} \\\\ \\text{length of the base. Find } x \\text{ that minimizes the amount of material (surface area).}",
    answer: "4",
    steps: [
      { number: 1, description: "Volume constraint relates base side x and height h", math: "x^2 h = 32 \\Rightarrow h = \\frac{32}{x^2}" },
      { number: 2, description: "Surface area: base plus four sides", math: "S(x) = x^2 + 4xh = x^2 + \\frac{128}{x}" },
      { number: 3, description: "Differentiate and set equal to zero", math: "S'(x) = 2x - \\frac{128}{x^2} = 0 \\Rightarrow 2x^3 = 128 \\Rightarrow x = 4" },
      { number: 4, description: "Confirm minimum", math: "S''(x) = 2 + \\frac{256}{x^3} > 0 \\Rightarrow \\text{minimum at } x = 4" },
    ],
    hints: ["Express the height using x^2 h = 32, then S(x) = x^2 + 4xh", "S(x) = x^2 + 128/x — set S'(x) = 0"],
    timeEstimate: 300,
  },
  {
    question: "\\text{A rectangle is inscribed in a triangle with base } 12 \\text{ and height } 8\\text{, with the} \\\\ \\text{rectangle's base on the triangle's base. Find the width } w \\text{ of the rectangle} \\\\ \\text{that maximizes its area.}",
    answer: "6",
    steps: [
      { number: 1, description: "By similar triangles, the rectangle height h relates to width w", math: "\\frac{h}{8} = \\frac{12 - w}{12} \\Rightarrow h = 8 - \\frac{2w}{3}" },
      { number: 2, description: "Write the area as a function of w", math: "A(w) = w\\left(8 - \\frac{2w}{3}\\right) = 8w - \\frac{2w^2}{3}" },
      { number: 3, description: "Differentiate and solve", math: "A'(w) = 8 - \\frac{4w}{3} = 0 \\Rightarrow w = 6" },
      { number: 4, description: "Confirm maximum", math: "A''(w) = -\\frac{4}{3} < 0 \\Rightarrow \\text{maximum at } w = 6" },
    ],
    hints: ["Use similar triangles to relate the rectangle's height to its width", "A(w) = 8w - 2w^2/3"],
    timeEstimate: 300,
  },
  {
    question: "\\text{A rectangle is inscribed in a semicircle of radius } 2 \\text{ with its base on the diameter.} \\\\ \\text{Find the maximum possible area of the rectangle.}",
    answer: "4",
    steps: [
      { number: 1, description: "Place the semicircle on x^2 + y^2 = 4; the rectangle has half-width x and height y", math: "A = 2xy, \\quad x^2 + y^2 = 4" },
      { number: 2, description: "Write area as a function of x", math: "A(x) = 2x\\sqrt{4 - x^2}" },
      { number: 3, description: "Maximize A^2 to avoid the radical (valid since A > 0)", math: "A^2 = 4x^2(4 - x^2) = 16x^2 - 4x^4" },
      { number: 4, description: "Differentiate and solve", math: "\\frac{d(A^2)}{dx} = 32x - 16x^3 = 16x(2 - x^2) = 0 \\Rightarrow x = \\sqrt{2}" },
      { number: 5, description: "Compute the maximum area", math: "A = 2\\sqrt{2} \\cdot \\sqrt{4 - 2} = 2\\sqrt{2} \\cdot \\sqrt{2} = 4" },
    ],
    hints: ["Model the semicircle as x^2 + y^2 = 4 with rectangle area 2xy", "Maximize A^2 = 16x^2 - 4x^4 instead of A to avoid the square root"],
    timeEstimate: 300,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// RELATED RATES
// ═══════════════════════════════════════════════════════════════════════════

const relatedRatesEasy: ProblemTemplate[] = [
  {
    question: "\\text{The side of a square is increasing at } 3 \\text{ cm/s. How fast is the area} \\\\ \\text{increasing (in cm}^2\\text{/s) when the side length is } 4 \\text{ cm?}",
    answer: "24",
    steps: [
      { number: 1, description: "Write the area formula and identify rates", math: "A = s^2, \\quad \\frac{ds}{dt} = 3" },
      { number: 2, description: "Differentiate both sides with respect to t", math: "\\frac{dA}{dt} = 2s\\,\\frac{ds}{dt}" },
      { number: 3, description: "Substitute s = 4 and ds/dt = 3", math: "\\frac{dA}{dt} = 2(4)(3) = 24" },
    ],
    hints: ["Differentiate A = s^2 with respect to time t", "dA/dt = 2s · ds/dt"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Suppose } y = x^2 \\text{ and } x \\text{ is increasing at } 5 \\text{ units per second.} \\\\ \\text{How fast is } y \\text{ increasing when } x = 3\\text{?}",
    answer: "30",
    steps: [
      { number: 1, description: "Differentiate the relationship with respect to t", math: "\\frac{dy}{dt} = 2x\\,\\frac{dx}{dt}" },
      { number: 2, description: "Substitute x = 3 and dx/dt = 5", math: "\\frac{dy}{dt} = 2(3)(5) = 30" },
    ],
    hints: ["Use the chain rule: dy/dt = 2x · dx/dt"],
    timeEstimate: 90,
  },
  {
    question: "\\text{A spherical balloon is inflated so its radius grows at } 2 \\text{ cm/s. How fast is the} \\\\ \\text{volume increasing (in cm}^3\\text{/s) when the radius is } 5 \\text{ cm? Leave your answer in terms of } \\pi\\text{.}",
    answer: "200\\pi",
    steps: [
      { number: 1, description: "Write the volume formula for a sphere", math: "V = \\frac{4}{3}\\pi r^3" },
      { number: 2, description: "Differentiate with respect to t", math: "\\frac{dV}{dt} = 4\\pi r^2\\,\\frac{dr}{dt}" },
      { number: 3, description: "Substitute r = 5 and dr/dt = 2", math: "\\frac{dV}{dt} = 4\\pi (25)(2) = 200\\pi" },
    ],
    hints: ["dV/dt = 4\\pi r^2 · dr/dt", "Substitute r = 5"],
    timeEstimate: 150,
  },
];

const relatedRatesMedium: ProblemTemplate[] = [
  {
    question: "\\text{A } 5 \\text{ m ladder leans against a wall. The bottom slides away from the wall at} \\\\ 1 \\text{ m/s. Let } y \\text{ be the height of the top of the ladder. Find } \\frac{dy}{dt} \\text{ (in m/s)} \\\\ \\text{when the bottom is } 3 \\text{ m from the wall.}",
    answer: "-\\frac{3}{4}",
    steps: [
      { number: 1, description: "Relate the sides with the Pythagorean theorem", math: "x^2 + y^2 = 25" },
      { number: 2, description: "Differentiate with respect to t", math: "2x\\,\\frac{dx}{dt} + 2y\\,\\frac{dy}{dt} = 0" },
      { number: 3, description: "When x = 3, find y", math: "y = \\sqrt{25 - 9} = 4" },
      { number: 4, description: "Substitute x = 3, y = 4, dx/dt = 1 and solve", math: "2(3)(1) + 2(4)\\frac{dy}{dt} = 0 \\Rightarrow \\frac{dy}{dt} = -\\frac{3}{4}" },
    ],
    hints: ["Differentiate x^2 + y^2 = 25 with respect to t", "Find y when x = 3 first"],
    timeEstimate: 210,
  },
  {
    question: "\\text{Water is poured into a cone-shaped tank (point down) at } 4 \\text{ m}^3\\text{/min. The cone's} \\\\ \\text{radius is always half its height. How fast is the water level rising (in m/min)} \\\\ \\text{when the depth is } 2 \\text{ m? Leave your answer in terms of } \\pi\\text{.}",
    answer: "\\frac{4}{\\pi}",
    steps: [
      { number: 1, description: "Use the ratio r = h/2 to write volume in terms of h only", math: "V = \\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\pi \\left(\\frac{h}{2}\\right)^2 h = \\frac{\\pi h^3}{12}" },
      { number: 2, description: "Differentiate with respect to t", math: "\\frac{dV}{dt} = \\frac{\\pi h^2}{4}\\,\\frac{dh}{dt}" },
      { number: 3, description: "Substitute dV/dt = 4 and h = 2, then solve", math: "4 = \\frac{\\pi (4)}{4}\\,\\frac{dh}{dt} = \\pi\\,\\frac{dh}{dt} \\Rightarrow \\frac{dh}{dt} = \\frac{4}{\\pi}" },
    ],
    hints: ["Eliminate r using r = h/2 before differentiating", "V = \\pi h^3 / 12"],
    timeEstimate: 240,
  },
  {
    question: "\\text{Car A travels north at } 60 \\text{ km/h and car B travels east at } 80 \\text{ km/h, both} \\\\ \\text{moving away from the same intersection. When A is } 40 \\text{ km and B is } 30 \\text{ km} \\\\ \\text{from the intersection, how fast is the distance between them increasing (km/h)?}",
    answer: "96",
    steps: [
      { number: 1, description: "Relate the distance z to the legs x (east) and y (north)", math: "z^2 = x^2 + y^2" },
      { number: 2, description: "When x = 30 and y = 40, find z", math: "z = \\sqrt{30^2 + 40^2} = 50" },
      { number: 3, description: "Differentiate with respect to t", math: "2z\\,\\frac{dz}{dt} = 2x\\,\\frac{dx}{dt} + 2y\\,\\frac{dy}{dt}" },
      { number: 4, description: "Substitute and solve", math: "\\frac{dz}{dt} = \\frac{(30)(80) + (40)(60)}{50} = \\frac{4800}{50} = 96" },
    ],
    hints: ["Differentiate z^2 = x^2 + y^2", "z = 50 at the given instant"],
    timeEstimate: 240,
  },
];

const relatedRatesHard: ProblemTemplate[] = [
  {
    question: "\\text{A man } 1.8 \\text{ m tall walks away from a } 6 \\text{ m street lamp at } 1.5 \\text{ m/s.} \\\\ \\text{How fast is the length of his shadow increasing (in m/s)?}",
    answer: "\\frac{9}{14}",
    steps: [
      { number: 1, description: "Let x be his distance from the lamp and s the shadow length; use similar triangles", math: "\\frac{6}{1.8} = \\frac{x + s}{s}" },
      { number: 2, description: "Simplify the proportion", math: "6s = 1.8x + 1.8s \\Rightarrow 4.2s = 1.8x \\Rightarrow s = \\frac{3}{7}x" },
      { number: 3, description: "Differentiate with respect to t", math: "\\frac{ds}{dt} = \\frac{3}{7}\\,\\frac{dx}{dt} = \\frac{3}{7}(1.5) = \\frac{9}{14}" },
    ],
    hints: ["Set up similar triangles: lamp height / man height = (x + s) / s", "Solve for s in terms of x, then differentiate"],
    timeEstimate: 300,
  },
  {
    question: "\\text{Sand falls onto a conical pile at } 10 \\text{ m}^3\\text{/min. The radius always equals the} \\\\ \\text{height. How fast is the height increasing (in m/min) when the pile is } 1 \\text{ m high?} \\\\ \\text{Leave your answer in terms of } \\pi\\text{.}",
    answer: "\\frac{10}{\\pi}",
    steps: [
      { number: 1, description: "Use r = h to write the cone volume in terms of h", math: "V = \\frac{1}{3}\\pi r^2 h = \\frac{\\pi h^3}{3}" },
      { number: 2, description: "Differentiate with respect to t", math: "\\frac{dV}{dt} = \\pi h^2\\,\\frac{dh}{dt}" },
      { number: 3, description: "Substitute dV/dt = 10 and h = 1, then solve", math: "10 = \\pi (1)^2\\,\\frac{dh}{dt} \\Rightarrow \\frac{dh}{dt} = \\frac{10}{\\pi}" },
    ],
    hints: ["V = \\pi h^3/3 when r = h", "dV/dt = \\pi h^2 · dh/dt"],
    timeEstimate: 240,
  },
  {
    question: "\\text{A rocket rises vertically at } 200 \\text{ m/s from a pad } 400 \\text{ m from an observer.} \\\\ \\text{How fast is the distance between the rocket and the observer increasing (m/s)} \\\\ \\text{when the rocket is } 300 \\text{ m high?}",
    answer: "120",
    steps: [
      { number: 1, description: "Relate distance z to height h", math: "z^2 = h^2 + 400^2" },
      { number: 2, description: "When h = 300, find z", math: "z = \\sqrt{300^2 + 400^2} = 500" },
      { number: 3, description: "Differentiate with respect to t", math: "2z\\,\\frac{dz}{dt} = 2h\\,\\frac{dh}{dt}" },
      { number: 4, description: "Substitute and solve", math: "\\frac{dz}{dt} = \\frac{(300)(200)}{500} = 120" },
    ],
    hints: ["z^2 = h^2 + 400^2; find z when h = 300", "dz/dt = h · (dh/dt) / z"],
    timeEstimate: 240,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// CURVE SKETCHING
// ═══════════════════════════════════════════════════════════════════════════

const curveSketchingEasy: ProblemTemplate[] = [
  {
    question: "\\text{Find the } x\\text{-coordinate of the critical point of } f(x) = x^2 - 4x + 3\\text{.}",
    answer: "2",
    steps: [
      { number: 1, description: "Differentiate", math: "f'(x) = 2x - 4" },
      { number: 2, description: "Set the derivative equal to zero", math: "2x - 4 = 0 \\Rightarrow x = 2" },
    ],
    hints: ["Critical points occur where f'(x) = 0"],
    timeEstimate: 60,
  },
  {
    question: "\\text{Find the } x\\text{-coordinate where } f(x) = x^3 - 3x \\text{ has a local maximum.}",
    answer: "-1",
    steps: [
      { number: 1, description: "Differentiate and factor", math: "f'(x) = 3x^2 - 3 = 3(x - 1)(x + 1)" },
      { number: 2, description: "Find the critical points", math: "x = 1 \\text{ or } x = -1" },
      { number: 3, description: "Use the second derivative test", math: "f''(x) = 6x; \\quad f''(-1) = -6 < 0 \\Rightarrow \\text{local max at } x = -1" },
    ],
    hints: ["Solve 3x^2 - 3 = 0, then classify each critical point", "A local max has f'' < 0"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Find the } x\\text{-coordinate of the inflection point of } f(x) = x^3 - 12x\\text{.}",
    answer: "0",
    steps: [
      { number: 1, description: "Compute the second derivative", math: "f'(x) = 3x^2 - 12, \\quad f''(x) = 6x" },
      { number: 2, description: "Set f'' equal to zero and check sign change", math: "6x = 0 \\Rightarrow x = 0; \\quad f'' \\text{ changes sign at } x = 0" },
    ],
    hints: ["Inflection points occur where f'' changes sign", "f''(x) = 6x"],
    timeEstimate: 90,
  },
];

const curveSketchingMedium: ProblemTemplate[] = [
  {
    question: "\\text{Find the } x\\text{-coordinate where } f(x) = x^3 - 3x^2 - 9x + 2 \\text{ has a local maximum.}",
    answer: "-1",
    steps: [
      { number: 1, description: "Differentiate and factor", math: "f'(x) = 3x^2 - 6x - 9 = 3(x^2 - 2x - 3) = 3(x - 3)(x + 1)" },
      { number: 2, description: "Find the critical points", math: "x = 3 \\text{ or } x = -1" },
      { number: 3, description: "Classify with the first derivative sign chart", math: "f' > 0 \\text{ on } (-\\infty, -1), \\quad f' < 0 \\text{ on } (-1, 3) \\Rightarrow \\text{local max at } x = -1" },
    ],
    hints: ["Factor f'(x) = 3(x - 3)(x + 1)", "The local max is where f' changes from + to −"],
    timeEstimate: 180,
  },
  {
    question: "\\text{How many critical points does } f(x) = x^4 - 2x^2 \\text{ have?}",
    answer: "3",
    steps: [
      { number: 1, description: "Differentiate and factor", math: "f'(x) = 4x^3 - 4x = 4x(x^2 - 1) = 4x(x - 1)(x + 1)" },
      { number: 2, description: "Count the real solutions of f'(x) = 0", math: "x = 0, \\; x = 1, \\; x = -1 \\Rightarrow 3 \\text{ critical points}" },
    ],
    hints: ["Factor f'(x) = 4x(x - 1)(x + 1) completely"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Find the } x\\text{-coordinate where } f(x) = x^2 e^{-x} \\text{ has a local maximum (for } x > 0\\text{).}",
    answer: "2",
    steps: [
      { number: 1, description: "Differentiate using the product rule", math: "f'(x) = 2x e^{-x} - x^2 e^{-x} = x(2 - x)e^{-x}" },
      { number: 2, description: "Find the critical points (note e^{-x} > 0 always)", math: "x = 0 \\text{ or } x = 2" },
      { number: 3, description: "Classify using a sign chart", math: "f' < 0 \\text{ for } x > 2 \\text{ and } f' > 0 \\text{ on } (0, 2) \\Rightarrow \\text{local max at } x = 2" },
    ],
    hints: ["Factor out e^{-x} after applying the product rule", "e^{-x} is never zero, so only x(2 - x) determines the sign"],
    timeEstimate: 210,
  },
];

const curveSketchingHard: ProblemTemplate[] = [
  {
    question: "\\text{Find the } x\\text{-coordinate where } f(x) = x + \\frac{4}{x} \\text{ has a local minimum for } x > 0\\text{.}",
    answer: "2",
    steps: [
      { number: 1, description: "Differentiate", math: "f'(x) = 1 - \\frac{4}{x^2}" },
      { number: 2, description: "Set f'(x) = 0 and take the positive root", math: "1 - \\frac{4}{x^2} = 0 \\Rightarrow x^2 = 4 \\Rightarrow x = 2" },
      { number: 3, description: "Confirm with the second derivative", math: "f''(x) = \\frac{8}{x^3} > 0 \\text{ at } x = 2 \\Rightarrow \\text{local minimum}" },
    ],
    hints: ["Rewrite 4/x as 4x^{-1} before differentiating", "x^2 = 4 — take the positive root"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Find the positive } x\\text{-coordinate of an inflection point of } f(x) = x^4 - 6x^2\\text{.}",
    answer: "1",
    steps: [
      { number: 1, description: "Compute the second derivative", math: "f'(x) = 4x^3 - 12x, \\quad f''(x) = 12x^2 - 12 = 12(x^2 - 1)" },
      { number: 2, description: "Set f'' = 0", math: "x^2 = 1 \\Rightarrow x = \\pm 1" },
      { number: 3, description: "Verify sign change and select the positive value", math: "f'' \\text{ changes sign at both } x = 1 \\text{ and } x = -1; \\text{ positive: } x = 1" },
    ],
    hints: ["f''(x) = 12(x^2 - 1)", "An inflection point needs a sign change in f''"],
    timeEstimate: 150,
  },
  {
    question: "\\text{How many local extrema does } f(x) = 3x^5 - 5x^3 \\text{ have?}",
    answer: "2",
    steps: [
      { number: 1, description: "Differentiate and factor", math: "f'(x) = 15x^4 - 15x^2 = 15x^2(x - 1)(x + 1)" },
      { number: 2, description: "Find the critical points", math: "x = -1, \\; x = 0, \\; x = 1" },
      { number: 3, description: "Check the sign of f' around each critical point", math: "f' \\text{ changes sign at } x = -1 \\text{ and } x = 1, \\text{ but not at } x = 0 \\text{ (because of } x^2\\text{)}" },
      { number: 4, description: "Count the extrema", math: "2 \\text{ local extrema (a max at } x = -1 \\text{ and a min at } x = 1\\text{)}" },
    ],
    hints: ["A critical point is an extremum only if f' changes sign there", "The factor x^2 never changes sign"],
    timeEstimate: 240,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MEAN VALUE THEOREM
// ═══════════════════════════════════════════════════════════════════════════

const mvtEasy: ProblemTemplate[] = [
  {
    question: "\\text{Find the value of } c \\text{ guaranteed by the Mean Value Theorem for} \\\\ f(x) = x^2 \\text{ on the interval } [1, 3]\\text{.}",
    answer: "2",
    steps: [
      { number: 1, description: "Compute the average rate of change over the interval", math: "\\frac{f(3) - f(1)}{3 - 1} = \\frac{9 - 1}{2} = 4" },
      { number: 2, description: "Set the derivative equal to that slope", math: "f'(c) = 2c = 4 \\Rightarrow c = 2" },
    ],
    hints: ["The MVT says f'(c) equals the average rate of change over [a, b]", "Average rate = (f(3) − f(1)) / (3 − 1)"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Find the value of } c \\text{ guaranteed by Rolle's Theorem for} \\\\ f(x) = x^2 - 6x + 5 \\text{ on the interval } [1, 5]\\text{.}",
    answer: "3",
    steps: [
      { number: 1, description: "Check that the endpoint values are equal", math: "f(1) = 0, \\quad f(5) = 0" },
      { number: 2, description: "Rolle's Theorem: set the derivative equal to zero", math: "f'(c) = 2c - 6 = 0 \\Rightarrow c = 3" },
    ],
    hints: ["Rolle's Theorem applies when f(a) = f(b)", "Solve f'(c) = 0"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Find the value of } c \\text{ guaranteed by the Mean Value Theorem for} \\\\ f(x) = \\sqrt{x} \\text{ on the interval } [1, 4]\\text{.}",
    answer: "\\frac{9}{4}",
    steps: [
      { number: 1, description: "Compute the average rate of change", math: "\\frac{f(4) - f(1)}{4 - 1} = \\frac{2 - 1}{3} = \\frac{1}{3}" },
      { number: 2, description: "Set the derivative equal to 1/3", math: "f'(c) = \\frac{1}{2\\sqrt{c}} = \\frac{1}{3}" },
      { number: 3, description: "Solve for c", math: "2\\sqrt{c} = 3 \\Rightarrow \\sqrt{c} = \\frac{3}{2} \\Rightarrow c = \\frac{9}{4}" },
    ],
    hints: ["f'(x) = 1/(2\\sqrt{x})", "Set 1/(2\\sqrt{c}) = 1/3 and solve"],
    timeEstimate: 150,
  },
];

const mvtMedium: ProblemTemplate[] = [
  {
    question: "\\text{Find the value of } c \\text{ guaranteed by the Mean Value Theorem for} \\\\ f(x) = x^2 - 2x + 4 \\text{ on the interval } [0, 3]\\text{.}",
    answer: "\\frac{3}{2}",
    steps: [
      { number: 1, description: "Compute the endpoint values", math: "f(0) = 4, \\quad f(3) = 9 - 6 + 4 = 7" },
      { number: 2, description: "Compute the average rate of change", math: "\\frac{7 - 4}{3 - 0} = 1" },
      { number: 3, description: "Set the derivative equal to 1", math: "f'(c) = 2c - 2 = 1 \\Rightarrow c = \\frac{3}{2}" },
    ],
    hints: ["Average rate = (f(3) − f(0)) / 3", "Solve 2c − 2 = 1"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Find the value of } c \\text{ guaranteed by Rolle's Theorem for} \\\\ f(x) = \\sin(x) \\text{ on the interval } [0, \\pi]\\text{.}",
    answer: "\\frac{\\pi}{2}",
    steps: [
      { number: 1, description: "Check the endpoint values", math: "f(0) = 0, \\quad f(\\pi) = 0" },
      { number: 2, description: "Set the derivative equal to zero", math: "f'(c) = \\cos(c) = 0" },
      { number: 3, description: "Pick the solution inside the interval", math: "c = \\frac{\\pi}{2} \\in (0, \\pi)" },
    ],
    hints: ["cos(c) = 0 has one solution in (0, \\pi)"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Find the value of } c \\text{ guaranteed by the Mean Value Theorem for} \\\\ f(x) = 2x^2 + x \\text{ on the interval } [1, 4]\\text{.}",
    answer: "\\frac{5}{2}",
    steps: [
      { number: 1, description: "Compute the endpoint values", math: "f(1) = 3, \\quad f(4) = 32 + 4 = 36" },
      { number: 2, description: "Compute the average rate of change", math: "\\frac{36 - 3}{4 - 1} = 11" },
      { number: 3, description: "Set the derivative equal to 11", math: "f'(c) = 4c + 1 = 11 \\Rightarrow c = \\frac{5}{2}" },
    ],
    hints: ["Average rate = (f(4) − f(1)) / 3", "Solve 4c + 1 = 11"],
    timeEstimate: 150,
  },
];

const mvtHard: ProblemTemplate[] = [
  {
    question: "\\text{Find the value of } c \\text{ guaranteed by the Mean Value Theorem for} \\\\ f(x) = \\ln(x) \\text{ on the interval } [1, e]\\text{.}",
    answer: "e - 1",
    steps: [
      { number: 1, description: "Compute the average rate of change", math: "\\frac{f(e) - f(1)}{e - 1} = \\frac{1 - 0}{e - 1} = \\frac{1}{e - 1}" },
      { number: 2, description: "Set the derivative equal to that slope", math: "f'(c) = \\frac{1}{c} = \\frac{1}{e - 1}" },
      { number: 3, description: "Solve for c", math: "c = e - 1" },
    ],
    hints: ["f'(x) = 1/x", "Set 1/c = 1/(e − 1)"],
    timeEstimate: 180,
  },
  {
    question: "\\text{A car travels } 180 \\text{ km in exactly } 2 \\text{ hours. By the Mean Value Theorem,} \\\\ \\text{the car's instantaneous speed must have equaled its average speed at least once.} \\\\ \\text{What is that speed (in km/h)?}",
    answer: "90",
    steps: [
      { number: 1, description: "Let s(t) be position; the MVT applies since s is continuous and differentiable", math: "s'(c) = \\frac{s(2) - s(0)}{2 - 0}" },
      { number: 2, description: "Compute the average speed", math: "\\frac{180 - 0}{2} = 90 \\text{ km/h}" },
      { number: 3, description: "Conclusion", math: "\\text{At some instant } c \\in (0, 2), \\text{ the speed was exactly } 90 \\text{ km/h}" },
    ],
    hints: ["The MVT guarantees instantaneous rate = average rate somewhere", "Average speed = distance / time"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Find the value of } c \\text{ guaranteed by the Mean Value Theorem for} \\\\ f(x) = x^3 - 3x^2 + 3x \\text{ on the interval } [0, 3]\\text{.}",
    answer: "2",
    steps: [
      { number: 1, description: "Compute the endpoint values", math: "f(0) = 0, \\quad f(3) = 27 - 27 + 9 = 9" },
      { number: 2, description: "Compute the average rate of change", math: "\\frac{9 - 0}{3 - 0} = 3" },
      { number: 3, description: "Set the derivative equal to 3", math: "f'(c) = 3c^2 - 6c + 3 = 3 \\Rightarrow 3c^2 - 6c = 0 \\Rightarrow 3c(c - 2) = 0" },
      { number: 4, description: "Pick the solution inside the open interval", math: "c = 2 \\in (0, 3)" },
    ],
    hints: ["Average rate = 3; solve 3c^2 - 6c + 3 = 3", "One root is an endpoint — the MVT needs c strictly inside"],
    timeEstimate: 210,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// LINEAR APPROXIMATION
// ═══════════════════════════════════════════════════════════════════════════

const linearApproxEasy: ProblemTemplate[] = [
  {
    question: "\\text{Use the linear approximation of } f(x) = x^2 \\text{ at } a = 1 \\text{ to estimate } (1.1)^2\\text{.}",
    answer: "1.2",
    steps: [
      { number: 1, description: "Compute f(a) and f'(a)", math: "f(1) = 1, \\quad f'(x) = 2x \\Rightarrow f'(1) = 2" },
      { number: 2, description: "Write the linearization", math: "L(x) = f(1) + f'(1)(x - 1) = 1 + 2(x - 1) = 2x - 1" },
      { number: 3, description: "Evaluate at x = 1.1", math: "L(1.1) = 2(1.1) - 1 = 1.2" },
    ],
    hints: ["L(x) = f(a) + f'(a)(x − a)", "f'(1) = 2"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Use the linear approximation of } f(x) = \\sqrt{x} \\text{ at } a = 4 \\text{ to estimate } \\sqrt{4.1}\\text{.}",
    answer: "2.025",
    steps: [
      { number: 1, description: "Compute f(a) and f'(a)", math: "f(4) = 2, \\quad f'(x) = \\frac{1}{2\\sqrt{x}} \\Rightarrow f'(4) = \\frac{1}{4}" },
      { number: 2, description: "Write the linearization", math: "L(x) = 2 + \\frac{1}{4}(x - 4)" },
      { number: 3, description: "Evaluate at x = 4.1", math: "L(4.1) = 2 + \\frac{0.1}{4} = 2.025" },
    ],
    hints: ["f'(4) = 1/4", "L(4.1) = 2 + (1/4)(0.1)"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Use the linear approximation of } f(x) = \\frac{1}{x} \\text{ at } a = 2 \\text{ to estimate } \\frac{1}{1.9}\\text{.}",
    answer: "0.525",
    steps: [
      { number: 1, description: "Compute f(a) and f'(a)", math: "f(2) = \\frac{1}{2}, \\quad f'(x) = -\\frac{1}{x^2} \\Rightarrow f'(2) = -\\frac{1}{4}" },
      { number: 2, description: "Write the linearization", math: "L(x) = \\frac{1}{2} - \\frac{1}{4}(x - 2)" },
      { number: 3, description: "Evaluate at x = 1.9", math: "L(1.9) = 0.5 - \\frac{1}{4}(-0.1) = 0.5 + 0.025 = 0.525" },
    ],
    hints: ["f'(2) = −1/4", "x − a = 1.9 − 2 = −0.1"],
    timeEstimate: 150,
  },
];

const linearApproxMedium: ProblemTemplate[] = [
  {
    question: "\\text{Use the linear approximation of } f(x) = x^3 \\text{ at } a = 2 \\text{ to estimate } (2.01)^3\\text{.}",
    answer: "8.12",
    steps: [
      { number: 1, description: "Compute f(a) and f'(a)", math: "f(2) = 8, \\quad f'(x) = 3x^2 \\Rightarrow f'(2) = 12" },
      { number: 2, description: "Write the linearization", math: "L(x) = 8 + 12(x - 2)" },
      { number: 3, description: "Evaluate at x = 2.01", math: "L(2.01) = 8 + 12(0.01) = 8.12" },
    ],
    hints: ["f'(2) = 12", "L(2.01) = 8 + 12(0.01)"],
    timeEstimate: 150,
  },
  {
    question: "\\text{Use the linear approximation of } f(x) = \\sin(x) \\text{ at } a = 0 \\text{ to estimate } \\sin(0.1)\\text{.}",
    answer: "0.1",
    steps: [
      { number: 1, description: "Compute f(a) and f'(a)", math: "f(0) = 0, \\quad f'(x) = \\cos(x) \\Rightarrow f'(0) = 1" },
      { number: 2, description: "Write the linearization", math: "L(x) = 0 + 1 \\cdot (x - 0) = x" },
      { number: 3, description: "Evaluate at x = 0.1", math: "L(0.1) = 0.1 \\quad (\\text{true value} \\approx 0.0998)" },
    ],
    hints: ["Near x = 0, sin(x) ≈ x", "f'(0) = cos(0) = 1"],
    timeEstimate: 120,
  },
  {
    question: "\\text{Use the linear approximation of } f(x) = e^x \\text{ at } a = 0 \\text{ to estimate } e^{0.02}\\text{.}",
    answer: "1.02",
    steps: [
      { number: 1, description: "Compute f(a) and f'(a)", math: "f(0) = 1, \\quad f'(x) = e^x \\Rightarrow f'(0) = 1" },
      { number: 2, description: "Write the linearization", math: "L(x) = 1 + x" },
      { number: 3, description: "Evaluate at x = 0.02", math: "L(0.02) = 1.02" },
    ],
    hints: ["Near x = 0, e^x ≈ 1 + x"],
    timeEstimate: 120,
  },
];

const linearApproxHard: ProblemTemplate[] = [
  {
    question: "\\text{Use the linear approximation of } f(x) = \\sqrt{x} \\text{ at } a = 25 \\text{ to estimate } \\sqrt{24.6}\\text{.}",
    answer: "4.96",
    steps: [
      { number: 1, description: "Compute f(a) and f'(a)", math: "f(25) = 5, \\quad f'(x) = \\frac{1}{2\\sqrt{x}} \\Rightarrow f'(25) = \\frac{1}{10}" },
      { number: 2, description: "Write the linearization", math: "L(x) = 5 + \\frac{1}{10}(x - 25)" },
      { number: 3, description: "Evaluate at x = 24.6", math: "L(24.6) = 5 + \\frac{-0.4}{10} = 5 - 0.04 = 4.96" },
    ],
    hints: ["f'(25) = 1/10", "x − a = 24.6 − 25 = −0.4"],
    timeEstimate: 180,
  },
  {
    question: "\\text{Use the linear approximation of } f(x) = \\sqrt[3]{x} \\text{ at } a = 8 \\text{ to estimate } \\sqrt[3]{8.12}\\text{.}",
    answer: "2.01",
    steps: [
      { number: 1, description: "Compute f(a) and f'(a)", math: "f(8) = 2, \\quad f'(x) = \\frac{1}{3}x^{-2/3} \\Rightarrow f'(8) = \\frac{1}{3 \\cdot 4} = \\frac{1}{12}" },
      { number: 2, description: "Write the linearization", math: "L(x) = 2 + \\frac{1}{12}(x - 8)" },
      { number: 3, description: "Evaluate at x = 8.12", math: "L(8.12) = 2 + \\frac{0.12}{12} = 2.01" },
    ],
    hints: ["Write the cube root as x^{1/3} to differentiate", "f'(8) = 1/12"],
    timeEstimate: 210,
  },
  {
    question: "\\text{Use the linear approximation of } f(x) = \\ln(x) \\text{ at } a = 1 \\text{ to estimate } \\ln(1.05)\\text{.}",
    answer: "0.05",
    steps: [
      { number: 1, description: "Compute f(a) and f'(a)", math: "f(1) = 0, \\quad f'(x) = \\frac{1}{x} \\Rightarrow f'(1) = 1" },
      { number: 2, description: "Write the linearization", math: "L(x) = 0 + 1 \\cdot (x - 1) = x - 1" },
      { number: 3, description: "Evaluate at x = 1.05", math: "L(1.05) = 0.05 \\quad (\\text{true value} \\approx 0.0488)" },
    ],
    hints: ["Near x = 1, ln(x) ≈ x − 1", "f'(1) = 1"],
    timeEstimate: 150,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MOTION (POSITION / VELOCITY / ACCELERATION)
// ═══════════════════════════════════════════════════════════════════════════

const motionEasy: ProblemTemplate[] = [
  {
    question: "\\text{A particle moves along a line with position } s(t) = t^2 + 3t \\text{ (meters).} \\\\ \\text{Find its velocity (in m/s) at } t = 2\\text{.}",
    answer: "7",
    steps: [
      { number: 1, description: "Velocity is the derivative of position", math: "v(t) = s'(t) = 2t + 3" },
      { number: 2, description: "Evaluate at t = 2", math: "v(2) = 2(2) + 3 = 7" },
    ],
    hints: ["v(t) = s'(t)"],
    timeEstimate: 60,
  },
  {
    question: "\\text{A particle has position } s(t) = t^3 - 6t^2 + 9t\\text{. Find the smallest positive time } t \\\\ \\text{(in seconds) at which the particle is at rest.}",
    answer: "1",
    steps: [
      { number: 1, description: "At rest means velocity is zero", math: "v(t) = s'(t) = 3t^2 - 12t + 9 = 0" },
      { number: 2, description: "Factor and solve", math: "3(t^2 - 4t + 3) = 3(t - 1)(t - 3) = 0 \\Rightarrow t = 1 \\text{ or } t = 3" },
      { number: 3, description: "Choose the smallest positive time", math: "t = 1" },
    ],
    hints: ["Set v(t) = s'(t) = 0", "Factor 3t^2 - 12t + 9"],
    timeEstimate: 120,
  },
  {
    question: "\\text{A particle has position } s(t) = 2t^2 \\text{ (meters). Find its acceleration (in m/s}^2\\text{)} \\\\ \\text{at } t = 3\\text{.}",
    answer: "4",
    steps: [
      { number: 1, description: "Velocity is the first derivative", math: "v(t) = s'(t) = 4t" },
      { number: 2, description: "Acceleration is the second derivative", math: "a(t) = v'(t) = 4" },
      { number: 3, description: "Acceleration is constant, so at t = 3", math: "a(3) = 4" },
    ],
    hints: ["a(t) = s''(t)"],
    timeEstimate: 60,
  },
];

const motionMedium: ProblemTemplate[] = [
  {
    question: "\\text{A particle has position } s(t) = t^3 - 9t^2 + 24t \\text{ (meters). Find the total distance} \\\\ \\text{(in meters) traveled from } t = 0 \\text{ to } t = 3\\text{.}",
    answer: "22",
    steps: [
      { number: 1, description: "Find when the particle changes direction (v = 0)", math: "v(t) = 3t^2 - 18t + 24 = 3(t - 2)(t - 4) = 0 \\Rightarrow t = 2 \\text{ in } (0, 3)" },
      { number: 2, description: "Evaluate position at the endpoints and the turning point", math: "s(0) = 0, \\quad s(2) = 8 - 36 + 48 = 20, \\quad s(3) = 27 - 81 + 72 = 18" },
      { number: 3, description: "Add the distance of each leg (the particle reverses at t = 2)", math: "|20 - 0| + |18 - 20| = 20 + 2 = 22" },
    ],
    hints: ["Total distance accounts for direction changes — find where v(t) = 0 first", "The particle turns around at t = 2"],
    timeEstimate: 240,
  },
  {
    question: "\\text{A particle has position } s(t) = t^2 - 4t + 3\\text{. At what time } t \\text{ (in seconds)} \\\\ \\text{does the particle change direction?}",
    answer: "2",
    steps: [
      { number: 1, description: "Direction changes when velocity is zero (and changes sign)", math: "v(t) = s'(t) = 2t - 4 = 0 \\Rightarrow t = 2" },
      { number: 2, description: "Verify the sign change", math: "v < 0 \\text{ for } t < 2, \\quad v > 0 \\text{ for } t > 2 \\Rightarrow \\text{direction changes at } t = 2" },
    ],
    hints: ["Set v(t) = 0 and confirm the sign of v actually changes"],
    timeEstimate: 90,
  },
  {
    question: "\\text{A ball is launched upward with height } h(t) = -16t^2 + 64t \\text{ (feet).} \\\\ \\text{Find its maximum height (in feet).}",
    answer: "64",
    steps: [
      { number: 1, description: "Maximum height occurs when vertical velocity is zero", math: "v(t) = h'(t) = -32t + 64 = 0 \\Rightarrow t = 2" },
      { number: 2, description: "Evaluate the height at t = 2", math: "h(2) = -16(4) + 64(2) = -64 + 128 = 64" },
    ],
    hints: ["Set h'(t) = 0 to find the time, then compute h at that time"],
    timeEstimate: 120,
  },
];

const motionHard: ProblemTemplate[] = [
  {
    question: "\\text{A particle has position } s(t) = t^3 - 6t^2 + 9t \\text{ (meters). Find the total distance} \\\\ \\text{(in meters) traveled from } t = 0 \\text{ to } t = 4\\text{.}",
    answer: "12",
    steps: [
      { number: 1, description: "Find turning points where v = 0", math: "v(t) = 3t^2 - 12t + 9 = 3(t - 1)(t - 3) = 0 \\Rightarrow t = 1, \\; t = 3" },
      { number: 2, description: "Evaluate position at endpoints and turning points", math: "s(0) = 0, \\quad s(1) = 4, \\quad s(3) = 0, \\quad s(4) = 4" },
      { number: 3, description: "Sum the distances of each leg", math: "|4 - 0| + |0 - 4| + |4 - 0| = 4 + 4 + 4 = 12" },
    ],
    hints: ["The particle changes direction at t = 1 and t = 3", "Add |s(1)−s(0)| + |s(3)−s(1)| + |s(4)−s(3)|"],
    timeEstimate: 270,
  },
  {
    question: "\\text{A particle has velocity } v(t) = 3t^2 - 12t + 9 \\text{ (m/s). Find its acceleration} \\\\ \\text{(in m/s}^2\\text{) at the smallest positive time when the velocity is zero.}",
    answer: "-6",
    steps: [
      { number: 1, description: "Find when velocity is zero", math: "3t^2 - 12t + 9 = 3(t - 1)(t - 3) = 0 \\Rightarrow t = 1 \\text{ (smallest)}" },
      { number: 2, description: "Acceleration is the derivative of velocity", math: "a(t) = v'(t) = 6t - 12" },
      { number: 3, description: "Evaluate at t = 1", math: "a(1) = 6 - 12 = -6" },
    ],
    hints: ["Solve v(t) = 0 first, then compute a(t) = v'(t)"],
    timeEstimate: 150,
  },
  {
    question: "\\text{A projectile has height } h(t) = -16t^2 + 96t \\text{ (feet). Find its maximum height (feet).}",
    answer: "144",
    steps: [
      { number: 1, description: "Maximum height occurs when velocity is zero", math: "v(t) = h'(t) = -32t + 96 = 0 \\Rightarrow t = 3" },
      { number: 2, description: "Evaluate the height at t = 3", math: "h(3) = -16(9) + 96(3) = -144 + 288 = 144" },
    ],
    hints: ["Set h'(t) = 0, then evaluate h"],
    timeEstimate: 120,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// ECONOMICS (MARGINAL ANALYSIS)
// ═══════════════════════════════════════════════════════════════════════════

const economicsEasy: ProblemTemplate[] = [
  {
    question: "\\text{The cost of producing } x \\text{ units is } C(x) = 100 + 5x + 0.01x^2 \\text{ dollars.} \\\\ \\text{Find the marginal cost (in dollars per unit) at } x = 10\\text{.}",
    answer: "5.2",
    steps: [
      { number: 1, description: "Marginal cost is the derivative of the cost function", math: "C'(x) = 5 + 0.02x" },
      { number: 2, description: "Evaluate at x = 10", math: "C'(10) = 5 + 0.2 = 5.2" },
    ],
    hints: ["Marginal cost = C'(x)"],
    timeEstimate: 90,
  },
  {
    question: "\\text{A company earns revenue } R(x) = 20x \\text{ dollars from selling } x \\text{ units.} \\\\ \\text{Find the marginal revenue (in dollars per unit).}",
    answer: "20",
    steps: [
      { number: 1, description: "Marginal revenue is the derivative of revenue", math: "R'(x) = 20" },
      { number: 2, description: "The marginal revenue is constant", math: "R'(x) = 20 \\text{ for all } x" },
    ],
    hints: ["Marginal revenue = R'(x)"],
    timeEstimate: 60,
  },
  {
    question: "\\text{The cost of producing } x \\text{ units is } C(x) = x^2 + 10x \\text{ dollars.} \\\\ \\text{Find the marginal cost at } x = 5\\text{.}",
    answer: "20",
    steps: [
      { number: 1, description: "Differentiate the cost function", math: "C'(x) = 2x + 10" },
      { number: 2, description: "Evaluate at x = 5", math: "C'(5) = 10 + 10 = 20" },
    ],
    hints: ["Marginal cost = C'(x)"],
    timeEstimate: 60,
  },
];

const economicsMedium: ProblemTemplate[] = [
  {
    question: "\\text{A company has revenue } R(x) = 50x \\text{ and cost } C(x) = 100 + 10x + x^2 \\text{ (dollars)} \\\\ \\text{for } x \\text{ units. Find the production level } x \\text{ that maximizes profit.}",
    answer: "20",
    steps: [
      { number: 1, description: "Write the profit function", math: "P(x) = R(x) - C(x) = 50x - 100 - 10x - x^2 = 40x - 100 - x^2" },
      { number: 2, description: "Differentiate and set equal to zero", math: "P'(x) = 40 - 2x = 0 \\Rightarrow x = 20" },
      { number: 3, description: "Confirm maximum", math: "P''(x) = -2 < 0 \\Rightarrow \\text{maximum at } x = 20" },
    ],
    hints: ["Profit = Revenue − Cost", "Set P'(x) = 0"],
    timeEstimate: 180,
  },
  {
    question: "\\text{The cost of producing } x \\text{ units is } C(x) = 200 + 4x + 0.02x^2 \\text{ dollars.} \\\\ \\text{Find the production level } x \\text{ that minimizes the average cost per unit.}",
    answer: "100",
    steps: [
      { number: 1, description: "Write the average cost function", math: "\\bar{C}(x) = \\frac{C(x)}{x} = \\frac{200}{x} + 4 + 0.02x" },
      { number: 2, description: "Differentiate and set equal to zero", math: "\\bar{C}'(x) = -\\frac{200}{x^2} + 0.02 = 0 \\Rightarrow x^2 = 10000" },
      { number: 3, description: "Take the positive root", math: "x = 100" },
    ],
    hints: ["Average cost = C(x)/x", "Set the derivative of average cost to zero"],
    timeEstimate: 210,
  },
  {
    question: "\\text{The demand for a product is } p = 100 - 2x \\text{ dollars per unit at } x \\text{ units sold.} \\\\ \\text{Find } x \\text{ that maximizes the revenue.}",
    answer: "25",
    steps: [
      { number: 1, description: "Revenue is price times quantity", math: "R(x) = x(100 - 2x) = 100x - 2x^2" },
      { number: 2, description: "Differentiate and set equal to zero", math: "R'(x) = 100 - 4x = 0 \\Rightarrow x = 25" },
      { number: 3, description: "Confirm maximum", math: "R''(x) = -4 < 0 \\Rightarrow \\text{maximum at } x = 25" },
    ],
    hints: ["R(x) = p · x = x(100 − 2x)"],
    timeEstimate: 150,
  },
];

const economicsHard: ProblemTemplate[] = [
  {
    question: "\\text{Demand is } p = 80 - 0.5x \\text{ dollars per unit and cost is } C(x) = 20x + 100 \\text{ dollars.} \\\\ \\text{Find the production level } x \\text{ that maximizes profit.}",
    answer: "60",
    steps: [
      { number: 1, description: "Write revenue from the demand curve", math: "R(x) = x(80 - 0.5x) = 80x - 0.5x^2" },
      { number: 2, description: "Write the profit function", math: "P(x) = R(x) - C(x) = 60x - 0.5x^2 - 100" },
      { number: 3, description: "Differentiate and set equal to zero", math: "P'(x) = 60 - x = 0 \\Rightarrow x = 60" },
      { number: 4, description: "Confirm maximum", math: "P''(x) = -1 < 0 \\Rightarrow \\text{maximum at } x = 60" },
    ],
    hints: ["Profit = R(x) − C(x) where R(x) = p·x", "P(x) = 60x − 0.5x^2 − 100"],
    timeEstimate: 240,
  },
  {
    question: "\\text{The cost of producing } x \\text{ units is } C(x) = 250 + 3x + 0.1x^2 \\text{ dollars.} \\\\ \\text{Find the production level } x \\text{ that minimizes the average cost per unit.}",
    answer: "50",
    steps: [
      { number: 1, description: "Write the average cost function", math: "\\bar{C}(x) = \\frac{250}{x} + 3 + 0.1x" },
      { number: 2, description: "Differentiate and set equal to zero", math: "\\bar{C}'(x) = -\\frac{250}{x^2} + 0.1 = 0 \\Rightarrow x^2 = 2500" },
      { number: 3, description: "Take the positive root", math: "x = 50" },
    ],
    hints: ["Average cost = C(x)/x; minimize it", "x^2 = 250/0.1"],
    timeEstimate: 210,
  },
  {
    question: "\\text{The demand for a product is } p = 240 - 3x \\text{ dollars per unit. Find the number of} \\\\ \\text{units } x \\text{ that maximizes revenue, and note that at the optimum the marginal} \\\\ \\text{revenue equals zero.}",
    answer: "40",
    steps: [
      { number: 1, description: "Write the revenue function", math: "R(x) = x(240 - 3x) = 240x - 3x^2" },
      { number: 2, description: "Marginal revenue is the derivative", math: "R'(x) = 240 - 6x" },
      { number: 3, description: "Maximum revenue occurs where marginal revenue is zero", math: "240 - 6x = 0 \\Rightarrow x = 40" },
    ],
    hints: ["R(x) = x(240 − 3x)", "Set R'(x) = 0"],
    timeEstimate: 180,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// BANK EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const appDiffProblemBank: Record<AppDerivativesTechnique, Record<Difficulty, ProblemTemplate[]>> = {
  'optimization': {
    easy: optimizationEasy,
    medium: optimizationMedium,
    hard: optimizationHard,
  },
  'related-rates': {
    easy: relatedRatesEasy,
    medium: relatedRatesMedium,
    hard: relatedRatesHard,
  },
  'curve-sketching': {
    easy: curveSketchingEasy,
    medium: curveSketchingMedium,
    hard: curveSketchingHard,
  },
  'mvt': {
    easy: mvtEasy,
    medium: mvtMedium,
    hard: mvtHard,
  },
  'linear-approximation': {
    easy: linearApproxEasy,
    medium: linearApproxMedium,
    hard: linearApproxHard,
  },
  'motion': {
    easy: motionEasy,
    medium: motionMedium,
    hard: motionHard,
  },
  'economics': {
    easy: economicsEasy,
    medium: economicsMedium,
    hard: economicsHard,
  },
  'mixed-appdiff': {
    easy: [],
    medium: [],
    hard: [],
  },
};
