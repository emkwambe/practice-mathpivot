import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Target } from 'lucide-react'
import type { Subject, Technique, Difficulty, Problem } from '@/lib/problemGenerator'
import { generateProblem } from '@/lib/problemGenerator'
import { MIXED_TECHNIQUE } from '@/lib/courses'
import SetupScreen from '@/components/practice/SetupScreen'
import ActiveSession from '@/components/practice/ActiveSession'
import ResultsScreen from '@/components/practice/ResultsScreen'

type ViewState = 'setup' | 'active' | 'results'

interface SessionConfig {
  subject: Subject
  techniques: Technique[]
  difficulty: Difficulty
  problemCount: number
  timePerProblem: number
}

interface SessionAnswer {
  problemId: string
  correct: boolean
  timeSpent: number
  technique: string
}

interface SessionResults {
  answers: SessionAnswer[]
  score: number
  bestStreak: number
  totalTime: number
}

interface StoredStats {
  bestStreak: number
  bestAccuracy: number
}

function loadStoredStats(): StoredStats {
  try {
    const data = localStorage.getItem('mathgen_practice_stats')
    if (data) return JSON.parse(data)
  } catch {
    // ignore
  }
  return { bestStreak: 0, bestAccuracy: 0 }
}

function saveStoredStats(stats: StoredStats) {
  try {
    localStorage.setItem('mathgen_practice_stats', JSON.stringify(stats))
  } catch {
    // ignore
  }
}

export default function Practice() {
  const [view, setView] = useState<ViewState>('setup')
  const [config, setConfig] = useState<SessionConfig | null>(null)
  const [problems, setProblems] = useState<Problem[]>([])
  const [results, setResults] = useState<SessionResults | null>(null)
  const [storedStats, setStoredStats] = useState<StoredStats>(loadStoredStats)
  const [sessionKey, setSessionKey] = useState(0)

  const generateProblems = useCallback((cfg: SessionConfig): Problem[] => {
    const generated: Problem[] = []
    const mixedKey = MIXED_TECHNIQUE[cfg.subject]
    const defaultTechs = cfg.subject === 'integration'
      ? ['basic', 'u-substitution', 'parts', 'trigonometric', 'trig-substitution', 'partial-fractions', 'improper']
      : cfg.subject === 'differentiation'
        ? ['basic-diff', 'product-rule', 'quotient-rule', 'chain-rule', 'implicit', 'logarithmic', 'trig-derivatives', 'higher-order']
        : cfg.subject === 'limits'
          ? ['direct-substitution', 'factoring', 'rationalizing', 'special-trig', 'lhopital', 'infinite-limits', 'limits-at-infinity']
          : cfg.subject === 'applications-derivatives'
            ? ['optimization', 'related-rates', 'curve-sketching', 'mvt', 'linear-approximation', 'motion', 'economics']
            : cfg.subject === 'applications-integration'
              ? ['area-between-curves', 'volumes', 'arc-length', 'surface-area', 'work', 'center-of-mass', 'averages-probability']
              : cfg.subject === 'differential-equations'
                ? ['separable', 'linear-first-order', 'homogeneous', 'exact', 'second-order', 'undetermined-coefficients', 'variation-of-parameters', 'laplace']
                : cfg.subject === 'sequences-series'
                  ? ['geometric-series', 'p-series-telescoping', 'divergence-test', 'ratio-test', 'root-test', 'comparison-tests', 'alternating-series', 'power-series']
                  : cfg.subject === 'math1-eoc'
                    ? ['m1-linear-equations', 'm1-systems', 'm1-functions', 'm1-quadratics-polynomials', 'm1-exponentials', 'm1-exponents-geometry', 'm1-statistics']
                    : cfg.subject === 'math3-eoc'
                      ? ['m3-polynomials', 'm3-rational-expressions', 'm3-exponential-logs', 'm3-functions-transformations', 'm3-geometry', 'm3-statistics']
                      : cfg.subject === 'math7-eog'
                        ? ['g7-ratios-proportions', 'g7-expressions-equations', 'g7-numbers-operations', 'g7-geometry', 'g7-statistics', 'g7-probability']
                        : cfg.subject === 'math6-eog'
                          ? ['g6-ratios', 'g6-expressions-equations', 'g6-number-system', 'g6-geometry', 'g6-statistics']
                          : ['g8-functions', 'g8-expressions-equations', 'g8-geometry', 'g8-statistics-probability', 'g8-number-system']
    const techniques = cfg.techniques.includes(mixedKey)
      ? defaultTechs as Technique[]
      : cfg.techniques

    for (let i = 0; i < cfg.problemCount; i++) {
      const tech = techniques.length > 1
        ? techniques[i % techniques.length]
        : techniques[0] ?? mixedKey
      const seed = Math.floor(Math.random() * 10000) + i
      generated.push(generateProblem(cfg.subject, tech, cfg.difficulty, seed))
    }

    return generated
  }, [])

  const handleStart = useCallback(
    (cfg: SessionConfig) => {
      const newProblems = generateProblems(cfg)
      setConfig(cfg)
      setProblems(newProblems)
      setResults(null)
      setSessionKey((prev) => prev + 1)
      setView('active')
    },
    [generateProblems]
  )

  const handleComplete = useCallback(
    (sessionResults: SessionResults) => {
      setResults(sessionResults)

      // Update stored stats
      const accuracy = sessionResults.answers.length > 0
        ? Math.round((sessionResults.score / sessionResults.answers.length) * 100)
        : 0

      setStoredStats((prev) => {
        const updated = {
          bestStreak: Math.max(prev.bestStreak, sessionResults.bestStreak),
          bestAccuracy: Math.max(prev.bestAccuracy, accuracy),
        }
        saveStoredStats(updated)
        return updated
      })

      setView('results')
    },
    []
  )

  const handleExit = useCallback(() => {
    setView('setup')
    setConfig(null)
    setProblems([])
    setResults(null)
  }, [])

  const handlePracticeAgain = useCallback(() => {
    setView('setup')
    setConfig(null)
    setProblems([])
    setResults(null)
  }, [])

  // Build technique breakdown from results
  const techniqueBreakdown = results
    ? (() => {
        const map = new Map<string, { attempted: number; correct: number }>()
        for (const ans of results.answers) {
          const existing = map.get(ans.technique) ?? { attempted: 0, correct: 0 }
          existing.attempted++
          if (ans.correct) existing.correct++
          map.set(ans.technique, existing)
        }
        return Array.from(map.entries()).map(([technique, stats]) => ({
          technique: technique as Technique,
          attempted: stats.attempted,
          correct: stats.correct,
        }))
      })()
    : []

  return (
    <div className="w-full bg-[#050505]">
      <AnimatePresence mode="wait">
        {view === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Page Header */}
            <div className="w-full border-b border-[#1F1F1F] pt-12 pb-8 px-6">
              <div className="max-w-[720px] mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="font-display text-[clamp(1.8rem,3vw,2.8rem)] text-white mb-2"
                  >
                    Practice Mode
                  </motion.h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-[#8A8A8A] max-w-[560px]"
                  >
                    Challenge yourself with timed practice sessions. Build streaks, track accuracy, and level up your skills.
                  </motion.p>
                </div>
                {(storedStats.bestStreak > 0 || storedStats.bestAccuracy > 0) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 shrink-0"
                  >
                    <div className="flex items-center gap-1.5 text-[0.875rem] text-[#8A8A8A]">
                      <Trophy size={20} className="text-[#C9A86C]" />
                      <span>Best: <span className="text-white">{storedStats.bestStreak}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[0.875rem] text-[#8A8A8A]">
                      <Target size={20} className="text-[#8A8A8A]" />
                      <span>Acc: <span className="text-white">{storedStats.bestAccuracy}%</span></span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Setup Screen */}
            <SetupScreen onStart={handleStart} />
          </motion.div>
        )}

        {view === 'active' && config && (
          <motion.div
            key={`active-${sessionKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <ActiveSession
              problems={problems}
              timePerProblem={config.timePerProblem}
              onComplete={handleComplete}
              onExit={handleExit}
            />
          </motion.div>
        )}

        {view === 'results' && results && config && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ResultsScreen
              score={results.score}
              totalProblems={config.problemCount}
              correctCount={results.score}
              bestStreak={results.bestStreak}
              avgTime={results.answers.length > 0 ? results.totalTime / results.answers.length : 0}
              totalTime={results.totalTime}
              techniqueBreakdown={techniqueBreakdown}
              onPracticeAgain={handlePracticeAgain}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
