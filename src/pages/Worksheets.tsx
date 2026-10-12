import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Printer, FileText, Check, Settings, RotateCcw } from 'lucide-react'
import { generateProblem, getTechniquesForSubject } from '@/lib/problemGenerator'
import type { Subject, Technique, Difficulty, Problem } from '@/lib/problemGenerator'
import MathDisplay from '@/components/MathDisplay'
import CourseSubjectPicker from '@/components/CourseSubjectPicker'
import { SUBJECT_NAMES, MIXED_TECHNIQUE } from '@/lib/courses'

const problemCounts = [10, 15, 20, 25, 30, 40, 50]

export default function Worksheets() {
  const [subject, setSubject] = useState<Subject>('integration')
  const [selectedTechniques, setSelectedTechniques] = useState<Technique[]>(['mixed'])
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [problemCount, setProblemCount] = useState(20)
  const [layout, setLayout] = useState<'1col' | '2col'>('2col')
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true)
  const [worksheetProblems, setWorksheetProblems] = useState<Problem[]>([])
  const [generated, setGenerated] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  // Keep the PDF title/filename in sync with the selected course
  useEffect(() => {
    document.title = `MathPivot — ${SUBJECT_NAMES[subject]} Practice Worksheet`
  }, [subject])

  const allTechniques = getTechniquesForSubject(subject)
  const mixedKey = MIXED_TECHNIQUE[subject]
  const isAllSelected = selectedTechniques.includes(mixedKey)

  const toggleTechnique = useCallback((tech: Technique) => {
    if (tech === mixedKey) {
      setSelectedTechniques([mixedKey])
      return
    }
    setSelectedTechniques((prev) => {
      const withoutMixed = prev.filter((t) => t !== mixedKey)
      if (withoutMixed.includes(tech)) {
        const updated = withoutMixed.filter((t) => t !== tech)
        return updated.length === 0 ? [mixedKey] : updated
      }
      return [...withoutMixed, tech]
    })
  }, [mixedKey])

  const handleGenerate = useCallback(() => {
    const defaultTechs = subject === 'integration'
      ? ['basic', 'u-substitution', 'parts', 'trigonometric', 'trig-substitution', 'partial-fractions', 'improper']
      : subject === 'differentiation'
        ? ['basic-diff', 'product-rule', 'quotient-rule', 'chain-rule', 'implicit', 'logarithmic', 'trig-derivatives', 'higher-order']
        : subject === 'limits'
          ? ['direct-substitution', 'factoring', 'rationalizing', 'special-trig', 'lhopital', 'infinite-limits', 'limits-at-infinity']
          : subject === 'applications-derivatives'
            ? ['optimization', 'related-rates', 'curve-sketching', 'mvt', 'linear-approximation', 'motion', 'economics']
            : subject === 'applications-integration'
              ? ['area-between-curves', 'volumes', 'arc-length', 'surface-area', 'work', 'center-of-mass', 'averages-probability']
              : subject === 'differential-equations'
                ? ['separable', 'linear-first-order', 'homogeneous', 'exact', 'second-order', 'undetermined-coefficients', 'variation-of-parameters', 'laplace']
                : subject === 'sequences-series'
                  ? ['geometric-series', 'p-series-telescoping', 'divergence-test', 'ratio-test', 'root-test', 'comparison-tests', 'alternating-series', 'power-series']
                  : subject === 'math1-eoc'
                    ? ['m1-linear-equations', 'm1-systems', 'm1-functions', 'm1-quadratics-polynomials', 'm1-exponentials', 'm1-exponents-geometry', 'm1-statistics']
                    : subject === 'math3-eoc'
                      ? ['m3-polynomials', 'm3-rational-expressions', 'm3-exponential-logs', 'm3-functions-transformations', 'm3-geometry', 'm3-statistics']
                      : subject === 'math7-eog'
                        ? ['g7-ratios-proportions', 'g7-expressions-equations', 'g7-numbers-operations', 'g7-geometry', 'g7-statistics', 'g7-probability']
                        : subject === 'math6-eog'
                          ? ['g6-ratios', 'g6-expressions-equations', 'g6-number-system', 'g6-geometry', 'g6-statistics']
                          : ['g8-functions', 'g8-expressions-equations', 'g8-geometry', 'g8-statistics-probability', 'g8-number-system']

    const techniques = selectedTechniques.includes(mixedKey)
      ? defaultTechs as Technique[]
      : selectedTechniques

    const problems: Problem[] = []
    for (let i = 0; i < problemCount; i++) {
      const tech = techniques.length > 1 ? techniques[i % techniques.length] : techniques[0] ?? mixedKey
      const seed = Math.floor(Math.random() * 10000) + i
      problems.push(generateProblem(subject, tech, difficulty, seed))
    }
    setWorksheetProblems(problems)
    setGenerated(true)
  }, [subject, selectedTechniques, difficulty, problemCount, mixedKey])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleReset = useCallback(() => {
    setGenerated(false)
    setWorksheetProblems([])
  }, [])

  const handleSubjectChange = useCallback((newSubject: Subject) => {
    setSubject(newSubject)
    setSelectedTechniques([MIXED_TECHNIQUE[newSubject]])
    setGenerated(false)
    setWorksheetProblems([])
  }, [])

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Print-only styles */}
      <style>{`
        /* Worksheet preview is a white card: force KaTeX math black on screen too
           (global index.css paints ALL .katex white for the dark theme) */
        .bg-white .katex,
        .bg-white .katex * {
          color: black !important;
        }
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; color: black !important; }
          .worksheet-page { page-break-after: always; }
          .worksheet-page:last-child { page-break-after: auto; }
          .page-break-before-always { page-break-before: always; }
          /* Force KaTeX math to render in black for print */
          .print-only .katex,
          .print-only .katex * {
            color: black !important;
          }
          .print-only .katex {
            font-size: 1.05em !important;
          }
          .print-only .katex-display {
            margin: 0 !important;
          }
          .print-only .katex-display .katex {
            font-size: 1em !important;
          }
          /* Ensure math in preview is also black */
          .bg-white .katex,
          .bg-white .katex * {
            color: black !important;
          }
        }
        @media screen {
          .print-only { display: none; }
        }
      `}</style>

      {/* Config Panel - screen only */}
      <div className="no-print">
        <div className="max-w-[900px] mx-auto px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[2.5rem] font-display font-bold text-white mb-2">Worksheet Generator</h1>
            <p className="text-[#8A8A8A] mb-8">Create printable problem sets for classroom or self-study.</p>

            <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Settings size={18} className="text-[#E30614]" />
                <h2 className="text-[1.125rem] font-semibold text-white">Configuration</h2>
              </div>

              {/* Course & Subject */}
              <div className="mb-6">
                <CourseSubjectPicker subject={subject} onSubjectChange={handleSubjectChange} />
              </div>

              {/* Techniques */}
              <div className="mb-6">
                <label className="block text-sm text-[#8A8A8A] mb-2">Techniques</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleTechnique(mixedKey)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                      isAllSelected
                        ? 'border-[#E30614] bg-[rgba(227,6,20,0.08)] text-white'
                        : 'border-[#1F1F1F] text-[#8A8A8A] hover:border-[#333333]'
                    }`}
                  >
                    All Techniques
                  </button>
                  {allTechniques.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTechnique(t.id as Technique)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                        selectedTechniques.includes(t.id as Technique) && !isAllSelected
                          ? 'border-[#E30614] bg-[rgba(227,6,20,0.08)] text-white'
                          : 'border-[#1F1F1F] text-[#8A8A8A] hover:border-[#333333]'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="mb-6">
                <label className="block text-sm text-[#8A8A8A] mb-2">Difficulty</label>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`px-4 py-2 rounded-lg text-[0.875rem] font-medium border transition-all ${
                        difficulty === d
                          ? 'border-[#E30614] bg-[rgba(227,6,20,0.08)] text-white'
                          : 'border-[#1F1F1F] text-[#8A8A8A] hover:border-[#333333]'
                      }`}
                    >
                      <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                        d === 'easy' ? 'bg-green-500' : d === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Problem Count */}
              <div className="mb-6">
                <label className="block text-sm text-[#8A8A8A] mb-2">Problems: {problemCount}</label>
                <div className="flex gap-2">
                  {problemCounts.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setProblemCount(c)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                        problemCount === c
                          ? 'border-[#E30614] bg-[#E30614] text-white'
                          : 'border-[#1F1F1F] text-[#8A8A8A] hover:border-[#333333]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout & Answer Key */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div>
                  <label className="block text-sm text-[#8A8A8A] mb-2">Layout</label>
                  <div className="flex gap-2">
                    {(['1col', '2col'] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLayout(l)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                          layout === l
                            ? 'border-[#E30614] bg-[rgba(227,6,20,0.08)] text-white'
                            : 'border-[#1F1F1F] text-[#8A8A8A] hover:border-[#333333]'
                        }`}
                      >
                        {l === '1col' ? '1 Column' : '2 Columns'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#8A8A8A] mb-2">Options</label>
                  <button
                    type="button"
                    onClick={() => setIncludeAnswerKey(!includeAnswerKey)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                      includeAnswerKey
                        ? 'border-[#E30614] bg-[rgba(227,6,20,0.08)] text-white'
                        : 'border-[#1F1F1F] text-[#8A8A8A] hover:border-[#333333]'
                    }`}
                  >
                    <Check size={14} />
                    Include Answer Key
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#E30614] text-white font-semibold hover:bg-[#FF1A2E] transition-all"
                >
                  <FileText size={18} />
                  Generate Worksheet
                </button>
                {generated && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[#1F1F1F] text-white font-semibold hover:border-[#333333] transition-all"
                    >
                      <Printer size={18} />
                      Print / Save PDF
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[#1F1F1F] text-[#8A8A8A] hover:text-white hover:border-[#333333] transition-all"
                    >
                      <RotateCcw size={16} />
                      Reset
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Worksheet Preview */}
      {generated && (
        <div className="no-print max-w-[900px] mx-auto px-6 pb-10">
          <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-6 mb-4">
            <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
            <div ref={printRef} className="bg-white text-black rounded-lg p-8">
              <WorksheetContent problems={worksheetProblems} layout={layout} subject={subject} includeAnswerKey={includeAnswerKey} />
            </div>
          </div>
        </div>
      )}

      {/* Print-only content */}
      {generated && (
        <div className="print-only">
          <WorksheetContent problems={worksheetProblems} layout={layout} subject={subject} includeAnswerKey={includeAnswerKey} />
        </div>
      )}
    </div>
  )
}

function WorksheetContent({ problems, layout, subject, includeAnswerKey }: {
  problems: Problem[]
  layout: '1col' | '2col'
  subject: Subject
  includeAnswerKey: boolean
}) {
  return (
    <div className="font-serif">
      {/* Header */}
      <div className="text-center mb-8 pb-4 border-b-2 border-black">
        <h1 className="text-2xl font-bold mb-1">
          {SUBJECT_NAMES[subject]} Practice Worksheet
        </h1>
        <p className="text-sm text-gray-600">MathPivot Worksheet Generator</p>
      </div>

      {/* Problems */}
      <div className={layout === '2col' ? 'columns-2 gap-8' : ''}>
        {problems.map((p, i) => (
          <div key={p.id} className={`mb-6 break-inside-avoid ${layout === '2col' ? 'mb-4' : ''}`}>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-bold text-sm">{i + 1}.</span>
              <div className="text-base flex-1">
                {p.context && (
                  <p className="text-sm font-sans mb-2 leading-relaxed">{p.context}</p>
                )}
                <MathDisplay latex={p.question} displayMode={false} />
                {p.stemSvg && (
                  <div
                    className="mt-3 font-sans"
                    // SVGs are built by our own generators (svg.ts), not user input
                    dangerouslySetInnerHTML={{ __html: p.stemSvg }}
                  />
                )}
                {p.itemType === 'MC' && p.choices && (
                  <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 font-sans text-sm">
                    {p.choices.map((c, ci) => {
                      const svg = p.svgChoices?.[ci] ?? null
                      const showText = c !== '' && c !== 'ABCD'[ci]
                      return (
                        <div key={ci} className="flex items-start gap-1.5">
                          <span className="font-bold pt-0.5">{('ABCD'[ci])}.</span>
                          <div>
                            {svg && (
                              <div
                                className="my-1"
                                // SVGs are built by our own generators (svg.ts), not user input
                                dangerouslySetInnerHTML={{ __html: svg }}
                              />
                            )}
                            {showText && (
                              c.includes('\\') || c.includes('^') ? (
                                <MathDisplay latex={c} displayMode={false} />
                              ) : (
                                <span>{c}</span>
                              )
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            {p.itemType === 'MC' ? (
              <div className="ml-6 text-sm font-sans text-gray-500">Answer: _______</div>
            ) : (
              <div className="ml-6 border-b border-gray-300 h-8" />
            )}
          </div>
        ))}
      </div>

      {/* Answer Key */}
      {includeAnswerKey && (
        <>
          <div className="page-break-before-always mt-8 pt-8 border-t-2 border-black">
            <h2 className="text-xl font-bold mb-6 text-center">Answer Key</h2>
            <div className={layout === '2col' ? 'columns-2 gap-8' : ''}>
              {problems.map((p, i) => (
                <div key={`ans-${p.id}`} className="mb-3 break-inside-avoid">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-sm">{i + 1}.</span>
                    <div className="text-sm">
                      {p.itemType === 'MC' && p.choices
                        ? `${'ABCD'[p.choices.indexOf(p.answer)]}. `
                        : ''}
                      {p.svgChoices ? null : p.answer.includes('\\') || p.answer.includes('^') ? (
                        <MathDisplay latex={p.answer} displayMode={false} />
                      ) : (
                        <span className="font-sans">{p.answer}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
