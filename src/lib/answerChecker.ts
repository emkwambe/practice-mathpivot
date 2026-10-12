import { create, all } from "mathjs";

const math = create(all, {});

export type AnswerType = "text" | "numerical" | "symbolic";

const TEXT_SYNONYMS: Record<string, string[]> = {
  convergent: ["convergent", "converges", "conv", "yes", "true", "convergence"],
  divergent: ["divergent", "diverges", "div", "no", "false", "divergence"],
  infinity: ["infinity", "inf", "infinite", "dne", "does not exist"],
  "-infinity": ["-infinity", "-inf", "-infinite"],
  undefined: ["undefined", "und", "none", "nan"],
  "0": ["0", "zero"],
  "1": ["1", "one"],
};

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9+\-]/g, "");
}

function areTextEquivalent(user: string, correct: string): boolean {
  const u = normalizeText(user);
  const c = normalizeText(correct);

  if (u === c) return true;

  for (const [canonical, synonyms] of Object.entries(TEXT_SYNONYMS)) {
    const userMatches = synonyms.some((s) => normalizeText(s) === u);
    const correctMatches = synonyms.some((s) => normalizeText(s) === c);
    if (userMatches && correctMatches) return true;
    if (userMatches && normalizeText(correct) === normalizeText(canonical)) return true;
    if (correctMatches && normalizeText(user) === normalizeText(canonical)) return true;
  }

  return false;
}

function parseNumber(s: string): number | null {
  const trimmed = s.trim();

  const fracMatch = trimmed.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
  if (fracMatch) {
    return parseInt(fracMatch[1]) / parseInt(fracMatch[2]);
  }

  try {
    const result = math.evaluate(toMathjs(trimmed), { pi: Math.PI, e: Math.E, C: 0 });
    if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
      return result;
    }
  } catch {
    // Not a valid expression
  }

  const direct = parseFloat(trimmed);
  if (!isNaN(direct)) return direct;

  return null;
}

function areNumericalEquivalent(user: string, correct: string, tolerance = 1e-6): boolean {
  const u = parseNumber(user);
  const c = parseNumber(correct);

  if (u === null || c === null) return false;

  return Math.abs(u - c) < tolerance;
}

// ─────────────────────────────────────────────────────────────────────────────
// LaTeX → mathjs conversion
//
// The previous converter rewrote `^` to `**`, which mathjs cannot parse —
// every answer containing an exponent failed evaluation and the checker fell
// back to parseFloat prefix accidents. This converter keeps `^` (native to
// mathjs), handles \frac / \sqrt with balanced (possibly nested) braces, and
// turns remaining LaTeX grouping braces into parentheses.
// ─────────────────────────────────────────────────────────────────────────────

/** Extract a balanced group starting at s[start] === open. */
function extractGroup(s: string, start: number, open: string, close: string): { content: string; end: number } | null {
  let depth = 0;
  for (let i = start; i < s.length; i++) {
    if (s[i] === open) depth++;
    else if (s[i] === close) {
      depth--;
      if (depth === 0) return { content: s.slice(start + 1, i), end: i + 1 };
    }
  }
  return null;
}

/** Replace \frac{a}{b} (balanced, nestable) with ((a)/(b)). */
function replaceFracs(s: string): string {
  let out = s;
  let guard = 0;
  while (out.includes("\\frac") && guard++ < 200) {
    const i = out.indexOf("\\frac");
    let j = i + 5;
    while (out[j] === " ") j++;
    if (out[j] === "{") {
      const g1 = extractGroup(out, j, "{", "}");
      if (!g1) break;
      let k = g1.end;
      while (out[k] === " ") k++;
      if (out[k] !== "{") break;
      const g2 = extractGroup(out, k, "{", "}");
      if (!g2) break;
      out = out.slice(0, i) + "((" + g1.content + ")/(" + g2.content + "))" + out.slice(g2.end);
    } else {
      // \frac12 single-token style
      const a = out[j] ?? "";
      const b = out[j + 1] ?? "";
      out = out.slice(0, i) + "((" + a + ")/(" + b + "))" + out.slice(j + 2);
    }
  }
  return out;
}

/** Replace \sqrt{...} / \sqrt(...) with sqrt(...). */
function replaceSqrts(s: string): string {
  let out = s;
  let guard = 0;
  while (out.includes("\\sqrt") && guard++ < 100) {
    const i = out.indexOf("\\sqrt");
    let j = i + 5;
    while (out[j] === " ") j++;
    if (out[j] === "{") {
      const g = extractGroup(out, j, "{", "}");
      if (!g) break;
      out = out.slice(0, i) + "sqrt(" + g.content + ")" + out.slice(g.end);
    } else if (out[j] === "(") {
      const g = extractGroup(out, j, "(", ")");
      if (!g) break;
      out = out.slice(0, i) + "sqrt(" + g.content + ")" + out.slice(g.end);
    } else {
      const a = out[j] ?? "";
      out = out.slice(0, i) + "sqrt(" + a + ")" + out.slice(j + 1);
    }
  }
  return out;
}

/** Strip \text{...} groups (balanced). */
function replaceText(s: string): string {
  let out = s;
  let guard = 0;
  while (out.includes("\\text") && guard++ < 100) {
    const i = out.indexOf("\\text");
    let j = i + 5;
    while (out[j] === " ") j++;
    if (out[j] !== "{") break;
    const g = extractGroup(out, j, "{", "}");
    if (!g) break;
    out = out.slice(0, i) + " " + out.slice(g.end);
  }
  return out;
}

/**
 * Convert a LaTeX-flavored answer string into a mathjs-parseable expression.
 * The arbitrary constant C is supplied by the evaluation scope (C = 0), so
 * general solutions like x^2 + C compare by their non-constant part.
 */
export function toMathjs(raw: string): string {
  // Equations/identities compare as a difference: LHS = RHS -> (LHS)-(RHS)
  const eq = raw.indexOf("=");
  if (eq > -1) {
    return `((${toMathjs(raw.slice(0, eq))})-(${toMathjs(raw.slice(eq + 1))}))`;
  }

  let s = raw;
  s = replaceText(s);
  s = s.replace(/\\left|\\right|\\Big|\\big/g, "");
  s = s.replace(/\\cdot|\\times/g, "*");
  s = s.replace(/\\[,;!: ]/g, " ");
  s = replaceFracs(s);
  s = replaceSqrts(s);
  s = s.replace(/\\pi/g, "pi");
  s = s.replace(/\\infty/g, "Infinity");
  s = s.replace(/\binfinity\b/g, "Infinity");
  s = s.replace(/\\arcsin/g, "asin").replace(/\\arccos/g, "acos").replace(/\\arctan/g, "atan");
  s = s.replace(/\\ln/g, "log");
  s = s.replace(/\\log/g, "log10");
  s = s.replace(/\\(sin|cos|tan|sec|csc|cot|sinh|cosh|tanh|exp|abs)/g, "$1");
  s = s.replace(/\\/g, "");
  // Absolute value bars: |...| -> abs(...)
  let guardBars = 0;
  while (s.includes("|") && guardBars++ < 100) {
    const next = s.replace(/\|([^|]+)\|/, "abs($1)");
    if (next === s) break;
    s = next;
  }
  // LaTeX grouping braces and square brackets become parentheses
  s = s.replace(/\{/g, "(").replace(/\}/g, ")").replace(/\[/g, "(").replace(/\]/g, ")");
  // Bare ln (no backslash) -> log
  s = s.replace(/\bln\b/g, "log");

  // Function names, longest first so "asin"/"sinh"/"log10" win over prefixes
  const FN = "asin|acos|atan|sinh|cosh|tanh|log10|sqrt|exp|abs|sin|cos|tan|sec|csc|cot|log";

  // fn|x| merge: logabs(x) -> log(abs(x)). Runs before AND after the
  // merge-token split so "2logabs(x)" (digit-glued) is caught too.
  const wrapFnAbs = (input: string): string => {
    const fnAbsRe = new RegExp(`(?<![a-z])(${FN})\\s*abs\\(`, "g");
    let out = input;
    let guard = 0;
    for (;;) {
      if (guard++ > 50) break;
      fnAbsRe.lastIndex = 0;
      const m = fnAbsRe.exec(out);
      if (!m) break;
      const parenPos = m.index + m[0].length - 1;
      const g = extractGroup(out, parenPos, "(", ")");
      if (!g) break;
      out = out.slice(0, m.index) + `${m[1]}(abs(${g.content}))` + out.slice(g.end);
    }
    return out;
  };
  s = wrapFnAbs(s);

  // Split merged tokens: xsin -> x*sin, 2log -> 2*log (digit/letter before a function name)
  s = s.replace(new RegExp(`(?<=[a-z0-9])(${FN})(?=[\\s^(\\w.])`, "g"), "*$1");
  s = wrapFnAbs(s);
  // The constant e glued to a preceding token: xe^x -> x*e^x, )e^x -> )*e^x
  s = s.replace(/(?<=[a-z0-9.)])e\^/g, "*e^");
  // The variable pair xy used by implicit-differentiation answers
  s = s.replace(/(?<![a-zA-Z])xy\b/g, "x*y");
  // Power space-form: tan^2 x  /  tan^(2) x  ->  ((tan(x))^2)
  s = s.replace(new RegExp(`\\b(${FN})\\s*\\^\\s*\\(?([\\w.]+)\\)?\\s+([\\w.]+)`, "g"), "(($1($3))^$2)");
  // Function applied to spaced parenthesis: sin (x) -> sin(x)
  s = s.replace(new RegExp(`\\b(${FN})\\s+(?=\\()`, "g"), "$1");
  // Function applied to single token: tan x / log x -> tan(x) / log(x)
  s = s.replace(new RegExp(`\\b(${FN})\\s+([\\w.]+)`, "g"), "$1($2)");
  // mathjs does NOT implicit-multiply symbol(...): x(...) -> x*(...), )(...) -> )*(...)
  s = s.replace(/\)\s*\(/g, ")*(");
  s = s.replace(/(?<=[a-z0-9])\s*\(/g, "*(");
  // ...then restore real function calls: sin*(x) -> sin(x)
  s = s.replace(new RegExp(`\\b(${FN})\\*\\(`, "g"), "$1(");
  return s;
}

const TEST_POINTS = [0.1, 0.5, 1, 2, 3.14, -0.5, -1, 5];

function evaluateAtPoints(expr: string, points: number[]): (number | null)[] {
  const results: (number | null)[] = [];
  const clean = toMathjs(expr);

  for (const x of points) {
    try {
      // y is sampled on a line (y = 2x + 0.3) so two-variable answers like
      // implicit-differentiation results still get genuinely varying values.
      // n and a cover general-n formulas (nth derivatives) and base-a exponentials.
      const scope = { x, y: 2 * x + 0.3, pi: Math.PI, e: Math.E, C: 0, n: 3, a: 2.5 };
      const result = math.evaluate(clean, scope);

      if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
        results.push(result);
      } else {
        results.push(null);
      }
    } catch {
      results.push(null);
    }
  }

  return results;
}

function areSymbolicEquivalent(user: string, correct: string): boolean {
  const userResults = evaluateAtPoints(user, TEST_POINTS);
  const correctResults = evaluateAtPoints(correct, TEST_POINTS);

  let matches = 0;
  let comparisons = 0;

  for (let i = 0; i < TEST_POINTS.length; i++) {
    const u = userResults[i];
    const c = correctResults[i];

    if (u !== null && c !== null) {
      comparisons++;
      if (Math.abs(u - c) < 1e-6) {
        matches++;
      }
    }
  }

  return matches >= 3 || (comparisons > 0 && matches === comparisons);
}

function detectAnswerType(answer: string): AnswerType {
  const a = answer.trim().toLowerCase();

  if (/^[a-zA-Z\s]+$/.test(a) && a.length > 0 && a.length < 30) {
    return "text";
  }

  if (["infinity", "inf", "-infinity", "-inf", "undefined", "dne", "convergent", "divergent"].includes(a)) {
    return "text";
  }

  if (!/[a-zA-Z]/.test(a)) {
    return "numerical";
  }

  return "symbolic";
}

export function checkAnswer(userAnswer: string, correctAnswer: string): {
  correct: boolean;
  type: AnswerType;
  normalizedUser: string;
  normalizedCorrect: string;
} {
  const type = detectAnswerType(correctAnswer);
  const normalizedUser = userAnswer.trim();
  const normalizedCorrect = correctAnswer.trim();

  // Identity fast-path: if the submitted string matches the correct answer
  // (ignoring whitespace and \left/\right wrappers), it is correct — full stop.
  // This covers MC choice clicks (the choice IS the answer string verbatim)
  // and multi-equation answers (systems joined by \quad;\quad) that the
  // single-equation symbolic pipeline below cannot parse.
  const squash = (s: string) =>
    s.replace(/\\left|\\right/g, "").replace(/\s+/g, "");
  if (squash(normalizedUser) === squash(normalizedCorrect)) {
    return { correct: true, type, normalizedUser, normalizedCorrect };
  }

  let correct = false;

  switch (type) {
    case "text":
      correct = areTextEquivalent(normalizedUser, normalizedCorrect);
      break;
    case "numerical":
      correct = areNumericalEquivalent(normalizedUser, normalizedCorrect);
      if (!correct) {
        correct = areTextEquivalent(normalizedUser, normalizedCorrect);
      }
      break;
    case "symbolic":
      correct = areSymbolicEquivalent(normalizedUser, normalizedCorrect);
      if (!correct) {
        correct = areNumericalEquivalent(normalizedUser, normalizedCorrect);
      }
      break;
  }

  return { correct, type, normalizedUser, normalizedCorrect };
}
