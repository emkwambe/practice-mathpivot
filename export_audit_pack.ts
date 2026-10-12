// Export an audit pack for independent AI review.
// For every subject × technique: 3 problems (easy/medium/hard), rendered as a
// student-view worksheet (NO answers) plus a separate machine-readable key.
// A second model solves the worksheet blind; ingest_audit.ts then compares
// its answers to the keys through the real checkAnswer pipeline.
//
// Usage: tsx export_audit_pack.ts [subject]   (default: all subjects)
// Output: audit/<date>/<subject>_worksheet.md  (give THIS to the reviewer)
//         audit/<date>/<subject>_key.json     (KEEP HIDDEN from reviewer)

import { mkdirSync, writeFileSync } from 'fs'
import { generateProblem, getTechniquesForSubject } from './src/lib/problemGenerator'
import type { Subject, Technique, Difficulty } from './src/lib/problemGenerator'

const onlySubject = process.argv[2] as Subject | undefined

const subjects: Subject[] = [
  'integration', 'differentiation', 'limits', 'applications-derivatives',
  'applications-integration', 'differential-equations', 'sequences-series',
  'math1-eoc', 'math3-eoc', 'math6-eog', 'math7-eog', 'math8-eog',
]

const date = new Date().toISOString().slice(0, 10)
const dir = `audit/${date}`
mkdirSync(dir, { recursive: true })

interface KeyEntry {
  n: number
  subject: string
  technique: string
  difficulty: string
  itemType: string
  answer: string
  choices?: string[]
}

const strip = (s: string) => s.replace(/\$\$/g, '').trim()

for (const subject of onlySubject ? [onlySubject] : subjects) {
  const techs = getTechniquesForSubject(subject).filter((t) => !t.id.startsWith('mixed'))
  const lines: string[] = [`# ${subject} — independent audit worksheet`, '']
  const keys: KeyEntry[] = []
  let n = 0

  for (const tech of techs) {
    const diffs: Difficulty[] = ['easy', 'medium', 'hard']
    diffs.forEach((diff, i) => {
      const p = generateProblem(subject, tech.id as Technique, diff, 1000 + i)
      n++
      const itemType = (p as { itemType?: string }).itemType ?? 'FR'
      const choices = (p as { choices?: string[] }).choices
      const svgChoices = (p as { svgChoices?: (string | null)[] }).svgChoices
      const context = (p as { context?: string }).context

      lines.push(`## Q${n} (${tech.name} — ${diff})`)
      if (context) lines.push('', strip(context))
      lines.push('', `$$${p.question}$$`)
      const stemSvg = (p as { stemSvg?: string }).stemSvg
      if (stemSvg) {
        const f = `${dir}/${subject}_q${n}_stem.svg`
        writeFileSync(f, stemSvg)
        lines.push('', `**FIGURE (stem):** \`${f}\` — open this SVG to see the diagram.`)
      }
      if (svgChoices) {
        lines.push('', '*(4 answer choices are figures — open each SVG file)*')
        svgChoices.forEach((s, k) => {
          if (s) {
            const f = `${dir}/${subject}_q${n}_choice_${'ABCD'[k]}.svg`
            writeFileSync(f, s)
            lines.push(`- ${'ABCD'[k]}: \`${f}\``)
          } else {
            lines.push(`- ${'ABCD'[k]}: (no figure)`)
          }
        })
      } else if (choices) {
        lines.push('')
        choices.forEach((c, k) => lines.push(`- ${'ABCD'[k]}. ${strip(c)}`))
      }
      lines.push('')
      keys.push({
        n, subject, technique: tech.id, difficulty: diff, itemType,
        answer: p.answer,
        ...(choices ? { choices } : {}),
        ...(svgChoices ? { svgChoices: true } : {}),
      })
    })
  }

  writeFileSync(`${dir}/${subject}_worksheet.md`, lines.join('\n'))
  writeFileSync(`${dir}/${subject}_key.json`, JSON.stringify(keys, null, 2))
  console.log(`${subject}: ${n} items -> ${dir}/${subject}_worksheet.md`)
}

console.log(`\nAudit pack written to ${dir}/`)
console.log(`Next: give each *_worksheet.md to the reviewing model with audit/AUDIT_PROMPT.md`)
console.log(`Then: tsx ingest_audit.ts ${date} <subject>`)
