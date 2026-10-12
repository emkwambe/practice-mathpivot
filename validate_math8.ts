// Validates the Math 8 EOG procedural generators:
// For every technique x difficulty x 100 seeds:
// 1. Factory never throws; question/answer non-empty
// 2. All strings render in KaTeX without error
// 3. MC: answer is one of 4 unique choices; GR: answer round-trips checkAnswer
// 4. Mixed mode works
import katex from 'katex'
import { generateProblem, getTechniquesForSubject } from './src/lib/problemGenerator'
import { checkAnswer } from './src/lib/answerChecker'

let failures = 0
let checked = 0

function katexCheck(s: string, tag: string, what: string) {
  try {
    katex.renderToString(s, { throwOnError: true, displayMode: false, strict: false })
  } catch (e) {
    failures++
    console.log(`KATEX FAIL ${tag} ${what}: ${JSON.stringify(s).slice(0, 90)} -> ${String(e).slice(0, 120)}`)
  }
}

const techs = getTechniquesForSubject('math8-eog')
for (const tech of techs) {
  for (const diff of ['easy', 'medium', 'hard'] as const) {
    for (let seed = 0; seed < 100; seed++) {
      const tag = `${tech.id}/${diff}/seed${seed}`
      try {
        const p = generateProblem('math8-eog', tech.id, diff, seed)
        checked++
        if (!p.question || !p.answer) {
          failures++
          console.log(`EMPTY FAIL ${tag}`)
          continue
        }
        katexCheck(p.question, tag, 'question')
        for (const s of p.steps) katexCheck(s.math, tag, 'step')
        for (const h of p.hints) if (h.includes('\\')) katexCheck(h, tag, 'hint')

        if (p.itemType === 'MC') {
          if (!p.choices || p.choices.length !== 4) {
            failures++
            console.log(`MC FAIL ${tag}: ${p.choices?.length ?? 0} choices`)
            continue
          }
          const uniq = new Set(p.choices)
          if (uniq.size !== 4) {
            failures++
            console.log(`MC FAIL ${tag}: duplicate choices ${JSON.stringify(p.choices).slice(0, 120)}`)
          }
          if (!p.choices.includes(p.answer)) {
            failures++
            console.log(`MC FAIL ${tag}: answer not in choices ${JSON.stringify(p.answer).slice(0, 80)}`)
          }
          // The correct choice must round-trip through the real checker
          const res = checkAnswer(p.answer, p.answer)
          if (!res.correct) {
            failures++
            console.log(`MC CHECKER FAIL ${tag}: ${JSON.stringify(p.answer).slice(0, 90)} (type=${res.type})`)
          }
          for (const c of p.choices) if (c.includes('\\') || c.includes('^')) katexCheck(c, tag, 'choice')
          if (p.svgChoices) {
            if (p.svgChoices.length !== p.choices.length) {
              failures++
              console.log(`SVG FAIL ${tag}: svgChoices length ${p.svgChoices.length} != choices ${p.choices.length}`)
            }
            for (const svg of p.svgChoices) {
              if (svg !== null && !svg.startsWith('<svg')) {
                failures++
                console.log(`SVG FAIL ${tag}: malformed svg ${JSON.stringify(svg).slice(0, 60)}`)
              }
            }
          }
        } else {
          // GR/FR: answer must round-trip through the real checker
          const res = checkAnswer(p.answer, p.answer)
          if (!res.correct) {
            failures++
            console.log(`CHECKER FAIL ${tag}: ${JSON.stringify(p.answer)} (type=${res.type})`)
          }
          if (p.answer.includes('\\')) katexCheck(p.answer, tag, 'answer')
        }
      } catch (e) {
        failures++
        console.log(`THROW ${tag}: ${String(e).slice(0, 200)}`)
      }
    }
  }
}

console.log(`\n${checked} generated problems validated | techniques: ${techs.length} | failures: ${failures}`)
process.exit(failures > 0 ? 1 : 0)
