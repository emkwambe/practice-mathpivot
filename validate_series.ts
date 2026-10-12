// Validates the sequences-series problem bank:
// 1. Every question/answer/step/hint renders in KaTeX without error
// 2. Every answer round-trips through the real answerChecker as correct
// 3. generateProblem works for every technique/difficulty + mixed
import katex from 'katex'
import { seriesProblemBank } from './src/lib/problems/sequencesSeries'
import { generateProblem, getTechniquesForSubject, getProblemCount } from './src/lib/problemGenerator'
import { checkAnswer } from './src/lib/answerChecker'

let failures = 0
let checked = 0

for (const [tech, diffs] of Object.entries(seriesProblemBank)) {
  if (tech === 'mixed-series') continue
  for (const [diff, templates] of Object.entries(diffs)) {
    for (const [i, t] of templates.entries()) {
      checked++
      const tag = `${tech}/${diff}[${i}]`
      // KaTeX render check (strict: throw on error)
      const strings = [t.question, t.answer, ...t.hints, ...t.steps.map((s) => s.math)]
      for (const s of strings) {
        try {
          katex.renderToString(s, { throwOnError: true, displayMode: false, strict: false })
        } catch (e) {
          failures++
          console.log(`KATEX FAIL ${tag}: ${JSON.stringify(s).slice(0, 90)} -> ${String(e).slice(0, 120)}`)
        }
      }
      // Answer checker round-trip
      const res = checkAnswer(t.answer, t.answer)
      if (!res.correct) {
        failures++
        console.log(`CHECKER FAIL ${tag}: answer ${JSON.stringify(t.answer)} does not round-trip (type=${res.type})`)
      }
    }
  }
}

// generateProblem smoke test for all techniques incl. mixed
const techs = getTechniquesForSubject('sequences-series')
for (const tech of techs) {
  for (const diff of ['easy', 'medium', 'hard']) {
    try {
      const p = generateProblem('sequences-series', tech.id, diff, 42)
      if (!p.question || !p.answer) {
        failures++
        console.log(`GENERATE FAIL ${tech.id}/${diff}: empty question/answer`)
      }
    } catch (e) {
      failures++
      console.log(`GENERATE FAIL ${tech.id}/${diff}: ${String(e).slice(0, 150)}`)
    }
  }
}

console.log(`\n${checked} templates validated | total problems: ${getProblemCount('sequences-series')} | techniques: ${techs.length} | failures: ${failures}`)
process.exit(failures > 0 ? 1 : 0)
