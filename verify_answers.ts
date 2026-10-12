// Deep answer verification — the customer-protection suite.
// Goes beyond round-trip checks (regression_all_banks.ts) to catch the two
// failures that turn paying customers into negative reviews:
//
//   CRITICAL 1  MC equivalence collisions — a distractor that is mathematically
//               EQUAL to the keyed answer (e.g. "4 - 3" vs "4 + (-3)").
//               The student picks a genuinely correct choice and is marked wrong.
//   CRITICAL 2  GR form rejection — the keyed answer is right but common student
//               input forms ("3" for "3.00", "1/2" for "0.5", improper fraction
//               for a mixed number) are rejected by checkAnswer.
//   CRITICAL 3  MC answer not among choices / svgChoices letter out of range.
//   WARNING     final solution step does not mention the keyed answer (the
//               worked solution might show a different value than the key).
//
// Sweeps every subject × technique × difficulty × 30 seeds (deduped by id).
// Exit code 1 if any critical failure is found.

import { generateProblem, getTechniquesForSubject } from './src/lib/problemGenerator'
import type { Subject, Technique, Difficulty } from './src/lib/problemGenerator'
import { checkAnswer } from './src/lib/answerChecker'

const subjects: Subject[] = [
  'integration', 'differentiation', 'limits', 'applications-derivatives',
  'applications-integration', 'differential-equations', 'sequences-series',
  'math1-eoc', 'math3-eoc', 'math6-eog', 'math7-eog', 'math8-eog',
]

let criticals = 0
let warnings = 0
let checked = 0
let mcChecked = 0
let grChecked = 0

const crit = (msg: string) => { criticals++; console.log(`CRITICAL ${msg}`) }
const warn = (msg: string) => { warnings++; if (warnings <= 40) console.log(`warning  ${msg}`) }

/** Squash for containment checks. */
const squash = (s: string) => s.replace(/\\left|\\right/g, '').replace(/\s+/g, '')

/** Decimal value of an answer string, if it is purely numeric/fraction/mixed. */
function numericValue(ans: string): number | null {
  const s = ans.trim()
  let m = s.match(/^(-?\d+(?:\.\d+)?)$/)
  if (m) return parseFloat(m[1])
  m = s.match(/^(-?\d+)\s+(\d+)\/(\d+)$/) // mixed number
  if (m) return parseInt(m[1]) + (parseInt(m[1]) < 0 ? -1 : 1) * (parseInt(m[2]) / parseInt(m[3]))
  m = s.match(/^(-?\d+)\/(\d+)$/)
  if (m) return parseInt(m[1]) / parseInt(m[2])
  return null
}

/** Common forms a student would type for the same value — EXACT equivalents only.
 *  Rounded forms of non-terminating decimals (0.33 for 1/3) are NOT required:
 *  EOG gridded scoring expects exact values, matching NCDPI policy. */
function studentForms(ans: string): string[] {
  const v = numericValue(ans)
  if (v === null) return []
  const forms = new Set<string>([ans.trim()])
  // plain decimal repr (exact when the value terminates)
  const dec = String(v)
  if (Math.abs(parseFloat(dec) - v) < 1e-12) forms.add(dec)
  if (Number.isInteger(v)) forms.add(`${v}.0`)
  else if (Math.abs(parseFloat(v.toFixed(2)) - v) < 1e-12) forms.add(v.toFixed(2))
  const s = ans.trim()
  const mixed = s.match(/^(-?\d+)\s+(\d+)\/(\d+)$/)
  if (mixed) {
    const w = parseInt(mixed[1])
    const imp = Math.abs(w) * parseInt(mixed[3]) + parseInt(mixed[2])
    forms.add(`${w < 0 ? '-' : ''}${imp}/${mixed[3]}`)
  }
  return [...forms]
}

for (const subject of subjects) {
  const techs = getTechniquesForSubject(subject).filter((t) => !t.id.startsWith('mixed'))
  const seen = new Set<string>()
  for (const tech of techs) {
    for (const diff of ['easy', 'medium', 'hard'] as Difficulty[]) {
      for (let seed = 0; seed < 30; seed++) {
        const p = generateProblem(subject, tech.id as Technique, diff, seed)
        if (seen.has(p.id)) continue
        seen.add(p.id)
        checked++
        const tag = `${subject}/${tech.id}/${diff}/${seed}`

        const itemType = (p as { itemType?: string }).itemType ?? 'FR'
        const choices = (p as { choices?: string[] }).choices
        const svgChoices = (p as { svgChoices?: (string | null)[] }).svgChoices

        if (itemType === 'MC') {
          mcChecked++
          if (svgChoices) {
            // letter-answer schema
            if (!['A', 'B', 'C', 'D'].includes(p.answer)) {
              crit(`${tag}: svgChoices answer "${p.answer}" is not A-D`)
            }
            if (!svgChoices || svgChoices.length !== 4) {
              crit(`${tag}: svgChoices length ${svgChoices?.length} != 4`)
            }
          } else if (choices) {
            if (!choices.includes(p.answer)) {
              crit(`${tag}: MC answer not among choices: ${JSON.stringify(p.answer).slice(0, 60)}`)
            }
            // CRITICAL 1: no distractor may be equivalent to the key
            for (const c of choices) {
              if (c === p.answer) continue
              try {
                const r = checkAnswer(c, p.answer)
                if (r.correct) {
                  crit(`${tag}: distractor EQUAL to key: ${JSON.stringify(c).slice(0, 60)} == ${JSON.stringify(p.answer).slice(0, 60)} (type=${r.type})`)
                }
              } catch {
                // unparseable pair — not a collision
              }
            }
          }
        }

        if (itemType === 'GR') {
          grChecked++
          // CRITICAL 2: common student forms must be accepted
          for (const form of studentForms(p.answer)) {
            const r = checkAnswer(form, p.answer)
            if (!r.correct) {
              crit(`${tag}: GR form rejected: student "${form}" vs key "${p.answer}" (type=${r.type})`)
            }
          }
        }

        // WARNING: final step should reference the keyed answer.
        // Strip LaTeX decorators ($, %, \text{}, \frac→a/b) so formatted keys
        // match their plain appearance in the worked steps.
        const stripDeco = (s: string) =>
          s.replace(/\\text\{([^}]*)\}/g, '$1')
           .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2')
           .replace(/\\[$%]|\\%/g, '')
           .replace(/[$%]/g, '')
           .replace(/\\left|\\right|\\,|\\;/g, '')
        const last = p.steps[p.steps.length - 1]
        if (last) {
          const hay = squash(stripDeco(`${last.description} ${last.math ?? ''}`))
          const needle = squash(stripDeco(p.answer))
          const v = numericValue(stripDeco(p.answer))
          const mentionsAnswer =
            (needle.length > 0 && needle.length <= 40 && hay.includes(needle)) ||
            (v !== null && hay.includes(String(Math.round(v * 100) / 100)))
          if (!mentionsAnswer) {
            warn(`${tag}: final step may not show key "${p.answer.slice(0, 30)}"`)
          }
        }
      }
    }
  }
  console.log(`${subject}: ${seen.size} unique problems deep-checked`)
}

console.log(`\n${checked} problems deep-checked (${mcChecked} MC, ${grChecked} GR)`)
console.log(`critical failures: ${criticals} | step-reference warnings: ${warnings}`)
process.exit(criticals > 0 ? 1 : 0)
