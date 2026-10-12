// Re-probe answer forms after the checker fix + negative/equivalence checks.
import { checkAnswer, toMathjs } from './src/lib/answerChecker'

const mustPass: [string, string][] = [
  ['x^3 + 1', 'x^3 + 1'],
  ['x^2 - 2', 'x^2 - 2'],
  ['e^x + e^{2x}', 'e^x + e^{2x}'],
  ['e^{2x} + e^{-2x}', 'e^{2x} + e^{-2x}'],
  ['(x+1)e^{-x}', '(x+1)e^{-x}'],
  ['x e^{x}', 'x e^{x}'],
  ['e^x \\cos(x)', 'e^x \\cos(x)'],
  ['-e^{\\pi}', '-e^{\\pi}'],
  ['e^2', 'e^2'],
  ['\\frac{e^{3x}}{8}', '\\frac{e^{3x}}{8}'],
  ['\\frac{x^2}{2} - x', '\\frac{x^2}{2} - x'],
  ['x^2 + 3x + \\frac{7}{2}', 'x^2 + 3x + \\frac{7}{2}'],
  ['\\frac{e^{-\\pi/4}}{2}', '\\frac{e^{-\\pi/4}}{2}'],
  ['x^2 + 3 + C', 'x^2 + 3 + C'],
  ['x^2 + C', 'x^2 + C'],
  // equivalent-form acceptance (the real grading improvement)
  ['\\frac{1}{2}', '0.5'],
  ['\\frac{8}{3}', '\\frac{8}{3}'],
  ['2x^2', '2x^2'],
  ['\\sqrt{2}', '\\sqrt{2}'],
  ['\\ln(x)', '\\ln(x)'],
  ['x^{1/2}', 'x^{1/2}'],
  ['-2e', '-2e'],
  ['3e^3', '3e^3'],
  ['(2+x)e^{3x}', '(2+x)e^{3x}'],
]

const mustFail: [string, string][] = [
  ['x^2 + 1', 'x^3 + 1'],
  ['e^{2x}', 'e^{3x}'],
  ['x^2', 'x^2 + 1'],
  ['x^2 + C', 'x^2 + 3 + C'],
  ['\\sin(x)', '\\cos(x)'],
  ['2', '3'],
]

let fails = 0
for (const [u, c] of mustPass) {
  const r = checkAnswer(u, c)
  if (!r.correct) fails++
  console.log(`${r.correct ? 'PASS' : 'FAIL'}  (want correct)  "${u}" vs "${c}"  -> ${toMathjs(c)}`)
}
console.log('---')
for (const [u, c] of mustFail) {
  const r = checkAnswer(u, c)
  if (r.correct) fails++
  console.log(`${!r.correct ? 'PASS' : 'FAIL'}  (want wrong)     "${u}" vs "${c}"`)
}
console.log(`\n${mustPass.length + mustFail.length} assertions, ${fails} failures`)
process.exit(fails > 0 ? 1 : 0)
