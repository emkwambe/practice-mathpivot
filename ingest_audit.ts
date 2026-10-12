// Ingest a reviewing model's verdicts and compare against the hidden keys
// through the real checkAnswer pipeline.
//
// Usage:
//   1. tsx export_audit_pack.ts            (creates audit/<date>/ packs)
//   2. Give audit/<date>/<subject>_worksheet.md + audit/AUDIT_PROMPT.md to a
//      second model (Kimi CLI, Claude Code, web chat — anything); save its JSON
//      block as audit/<date>/<subject>_review.json
//   3. tsx ingest_audit.ts <date> <subject>
//
// Output: agreement stats + a mismatch report. Mismatches are reviewed by a
// human (or a third model) to decide whether the KEY or the REVIEWER is wrong.

import { readFileSync, existsSync } from 'fs'
import { checkAnswer } from './src/lib/answerChecker'

const [date, subject] = process.argv.slice(2)
if (!date || !subject) {
  console.error('usage: tsx ingest_audit.ts <date> <subject>')
  process.exit(2)
}

/** Loose string compare for "does the reviewer's letter and value point at the same card". */
const squashCmp = (s: string) =>
  s.replace(/\\text\{([^}]*)\}/g, '$1').replace(/\\left|\\right|\\,|\\;/g, '').replace(/\s+/g, '').toLowerCase()

const keyPath = `audit/${date}/${subject}_key.json`
const reviewPath = `audit/${date}/${subject}_review.json`
for (const p of [keyPath, reviewPath]) {
  if (!existsSync(p)) {
    console.error(`missing: ${p}`)
    process.exit(2)
  }
}

interface KeyEntry { n: number; technique: string; itemType: string; answer: string; choices?: string[]; svgChoices?: boolean }
interface ReviewEntry { n: number; letter: string | null; value: string | null; flags?: string[] }

const keys: KeyEntry[] = JSON.parse(readFileSync(keyPath, 'utf-8'))
const review: { answers: ReviewEntry[] } = JSON.parse(readFileSync(reviewPath, 'utf-8'))
const byN = new Map(review.answers.map((a) => [a.n, a]))

let agree = 0
let disagree = 0
let skipped = 0
const mismatches: string[] = []

for (const k of keys) {
  const r = byN.get(k.n)
  if (!r || (r.value === null && r.letter === null)) {
    skipped++
    mismatches.push(`Q${k.n} [${k.technique}] reviewer could not solve | key: ${k.answer}`)
    continue
  }
  if (k.svgChoices) {
    // figure choices: the letter IS the answer — compare letters directly
    if (r.letter === k.answer) agree++
    else {
      disagree++
      mismatches.push(`Q${k.n} [${k.technique}/MC-fig] reviewer letter="${r.letter}" key="${k.answer}"` +
        (r.flags?.length ? ` flags=${r.flags.join(',')}` : ''))
    }
    continue
  }
  // MC with a letter: map the worksheet letter back to its choice string, then
  // grade that value — letter AND value must agree with the key.
  let reviewerValue = r.value
  if (k.itemType === 'MC' && r.letter && k.choices) {
    const idx = 'ABCD'.indexOf(r.letter)
    const byLetter = idx >= 0 ? k.choices[idx] : null
    if (byLetter && reviewerValue && squashCmp(byLetter) !== squashCmp(reviewerValue)) {
      // letter and value disagree — trust the letter (it points at a real card)
      reviewerValue = byLetter
    } else if (byLetter && !reviewerValue) {
      reviewerValue = byLetter
    }
  }
  const res = checkAnswer(reviewerValue ?? '', k.answer)
  if (res.correct) agree++
  else {
    disagree++
    mismatches.push(
      `Q${k.n} [${k.technique}/${k.itemType}] reviewer="${r.value ?? r.letter}" key="${k.answer}"` +
      (r.flags?.length ? ` flags=${r.flags.join(',')}` : '')
    )
  }
}

console.log(`${subject} @ ${date}: agree=${agree} disagree=${disagree} skipped=${skipped} / ${keys.length}`)
if (mismatches.length) {
  console.log('\nMISMATCHES (human review needed):')
  for (const m of mismatches) console.log('  ' + m)
}
process.exit(disagree > 0 ? 1 : 0)
