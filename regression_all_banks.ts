// Regression: every answer in ALL subject banks must round-trip through the
// fixed checker. Sweeps generateProblem over seeds to reach every template.
import { generateProblem, getTechniquesForSubject } from './src/lib/problemGenerator'
import type { Subject, Technique, Difficulty } from './src/lib/problemGenerator'
import { checkAnswer } from './src/lib/answerChecker'

const subjects: Subject[] = ['integration', 'differentiation', 'limits', 'applications-derivatives', 'applications-integration', 'differential-equations', 'sequences-series', 'math1-eoc', 'math3-eoc', 'math6-eog', 'math7-eog', 'math8-eog']

let totalAnswers = 0
let failures = 0

for (const subject of subjects) {
  const techs = getTechniquesForSubject(subject).filter((t) => !t.id.startsWith('mixed'))
  const seen = new Set<string>()
  for (const tech of techs) {
    for (const diff of ['easy', 'medium', 'hard'] as Difficulty[]) {
      for (let seed = 0; seed < 30; seed++) {
        const p = generateProblem(subject, tech.id as Technique, diff, seed)
        if (seen.has(p.id)) continue
        seen.add(p.id)
        totalAnswers++
        const r = checkAnswer(p.answer, p.answer)
        if (!r.correct) {
          failures++
          console.log(`FAIL ${subject}/${tech.id}/${diff}: ${JSON.stringify(p.answer).slice(0, 80)} (type=${r.type})`)
        }
      }
    }
  }
  console.log(`${subject}: ${seen.size} unique problems checked`)
}

console.log(`\n${totalAnswers} problems round-tripped, ${failures} failures`)
process.exit(failures > 0 ? 1 : 0)
