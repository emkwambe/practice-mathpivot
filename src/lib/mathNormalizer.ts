/** Normalize a math answer for comparison — accepts both LaTeX and plain text. */
export function normalizeMathAnswer(s: string): string {
  return (
    s
      .toLowerCase()
      // Strip LaTeX constructs first (while braces are still intact)
      .replace(/\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)')
      .replace(/\sqrt\{([^}]*)\}/g, 'sqrt($1)')
      // Remove backslash commands
      .replace(/\\(sin|cos|tan|cot|sec|csc|ln|log|pi|infty|cdot|times|pm|mp|left|right|big|Big|bigg|Bigg|quad|qquad|displaystyle|textstyle|scriptstyle|scriptscriptstyle|int|sum|lim)/g, '$1')
      // Remove remaining stray backslashes
      .replace(/\\/g, '')
      // Remove braces, parens, bars, quotes
      .replace(/[{}()|""]/g, '')
      // Normalise operators
      .replace(/cdot|times/g, '*')
      .replace(/pm/g, '+')
      .replace(/mp/g, '-')
      .replace(/infty|infinity/g, 'inf')
      // Remove integration constant
      .replace(/\+\s*c$/g, '')
      .replace(/\+\s*c\b/g, '')
      .replace(/constant/g, '')
      // Collapse whitespace
      .replace(/\s+/g, '')
      .trim()
  )
}

/**
 * Convert plain-text math (e.g.  x^3/3 + C ) into LaTeX for
 * the live preview.  Handles the most common high-school forms.
 */
export function plainToLatex(raw: string): string {
  if (!raw.trim()) return ''

  // If the user already typed LaTeX, pass through
  if (raw.includes('\\')) return raw

  let s = raw

  // 1. Wrap multi-character exponents:  x^12 -> x^{12}
  s = s.replace(/([a-zA-Z0-9])\^([a-zA-Z0-9]{2,})/g, '$1^{$2}')
  // Single-char exponents already work in KaTeX without braces

  // 2. sqrt(x) -> \sqrt{x}
  s = s.replace(/\bsqrt\s*\(([^)]+)\)/g, (_, inner) => `\\sqrt{${inner}}`)
  s = s.replace(/\bsqrt\s*\{([^}]+)\}/g, (_, inner) => `\\sqrt{${inner}}`)

  // 3. Common functions & constants  (word boundaries so we don't break "since")
  const cmds: Array<[RegExp, string]> = [
    [/\bsin\b(?!h)/g, '\\sin'],
    [/\bcos\b(?!h)/g, '\\cos'],
    [/\btan\b(?!h)/g, '\\tan'],
    [/\bcot\b(?!h)/g, '\\cot'],
    [/\bsec\b(?!h)/g, '\\sec'],
    [/\bcsc\b(?!h)/g, '\\csc'],
    [/\bln\b/g, '\\ln'],
    [/\blog\b/g, '\\log'],
    [/\bpi\b/g, '\\pi'],
    [/\binf\b/g, '\\infty'],
    [/\binfinity\b/g, '\\infty'],
    [/\bint\b/g, '\\int'],
  ]
  for (const [re, repl] of cmds) {
    s = s.replace(re, repl)
  }

  // 4. Fractions:  a/b  ->  \frac{a}{b}
  //    We avoid converting things that already look like exponents or commands
  s = s.replace(/([a-zA-Z0-9^]+)\/([a-zA-Z0-9^]+)/g, '\\frac{$1}{$2}')

  // 5. e^x -> e^{x} (always give e a brace for readability)
  s = s.replace(/e\^([a-zA-Z0-9^{}]+)/g, 'e^{$1}')

  return s
}
