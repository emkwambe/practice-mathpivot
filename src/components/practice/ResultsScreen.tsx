import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Flame, Clock, Timer, RefreshCw, Calculator, Share2, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router'
import confetti from 'canvas-confetti'
import type { Technique } from '@/lib/problemGenerator'

interface TechniqueStat {
  technique: Technique
  attempted: number
  correct: number
}

interface ResultsScreenProps {
  score: number
  totalProblems: number
  correctCount: number
  bestStreak: number
  avgTime: number
  totalTime: number
  techniqueBreakdown: TechniqueStat[]
  onPracticeAgain: () => void
}

function getGrade(accuracy: number): { letter: string; color: string; borderColor: string; bgColor: string } {
  if (accuracy >= 90) return { letter: 'A', color: 'text-[#22C55E]', borderColor: 'border-[#22C55E]', bgColor: 'bg-[rgba(34,197,94,0.1)]' }
  if (accuracy >= 80) return { letter: 'B', color: 'text-[#3B82F6]', borderColor: 'border-[#3B82F6]', bgColor: 'bg-[rgba(59,130,246,0.1)]' }
  if (accuracy >= 70) return { letter: 'C', color: 'text-[#F59E0B]', borderColor: 'border-[#F59E0B]', bgColor: 'bg-[rgba(245,158,11,0.1)]' }
  if (accuracy >= 60) return { letter: 'D', color: 'text-[#F97316]', borderColor: 'border-[#F97316]', bgColor: 'bg-[rgba(249,115,22,0.1)]' }
  return { letter: 'F', color: 'text-[#EF4444]', borderColor: 'border-[#EF4444]', bgColor: 'bg-[rgba(239,68,68,0.1)]' }
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}m ${s}s`
}

const displayNames: Record<Technique, string> = {
  basic: 'Basic',
  'u-substitution': 'U-Substitution',
  parts: 'By Parts',
  trigonometric: 'Trig Integrals',
  'trig-substitution': 'Trig Sub',
  'partial-fractions': 'Partial Fractions',
  improper: 'Improper',
  mixed: 'Mixed',
  'basic-diff': 'Basic Diff',
  'product-rule': 'Product Rule',
  'quotient-rule': 'Quotient Rule',
  'chain-rule': 'Chain Rule',
  'implicit': 'Implicit',
  'logarithmic': 'Logarithmic',
  'trig-derivatives': 'Trig Derivatives',
  'higher-order': 'Higher-Order',
  'mixed-diff': 'Mixed Diff',
  'direct-substitution': 'Direct Substitution',
  'factoring': 'Factoring',
  'rationalizing': 'Rationalizing',
  'special-trig': 'Special Trig',
  'lhopital': "L'Hôpital",
  'infinite-limits': 'Infinite Limits',
  'limits-at-infinity': 'Limits at Infinity',
  'mixed-limits': 'Mixed Limits',
  'optimization': 'Optimization',
  'related-rates': 'Related Rates',
  'curve-sketching': 'Curve Sketching',
  'mvt': 'Mean Value Thm',
  'linear-approximation': 'Linear Approx',
  'motion': 'Motion',
  'economics': 'Economics',
  'mixed-appdiff': 'Mixed Apps',
  'area-between-curves': 'Area Between',
  'volumes': 'Volumes',
  'arc-length': 'Arc Length',
  'surface-area': 'Surface Area',
  'work': 'Work',
  'center-of-mass': 'Center of Mass',
  'averages-probability': 'Avg & Prob',
  'mixed-appint': 'Mixed Apps',
  'separable': 'Separable',
  'linear-first-order': 'Linear 1st Order',
  'homogeneous': 'Homogeneous',
  'exact': 'Exact',
  'second-order': 'Second Order',
  'undetermined-coefficients': 'Undetermined',
  'variation-of-parameters': 'Variation',
  'laplace': 'Laplace',
  'mixed-diffeq': 'Mixed DiffEq',
  'geometric-series': 'Geometric',
  'p-series-telescoping': 'P-Series',
  'divergence-test': 'Divergence Test',
  'ratio-test': 'Ratio Test',
  'root-test': 'Root Test',
  'comparison-tests': 'Comparison',
  'alternating-series': 'Alternating',
  'power-series': 'Power Series',
  'mixed-series': 'Mixed Series',
  'm1-linear-equations': 'Linear Equations',
  'm1-systems': 'Systems',
  'm1-functions': 'Functions',
  'm1-quadratics-polynomials': 'Quadratics',
  'm1-exponentials': 'Exponentials',
  'm1-exponents-geometry': 'Exp & Geometry',
  'm1-statistics': 'Statistics',
  'mixed-m1': 'Mixed Math 1',
  'm3-polynomials': 'Polynomials',
  'm3-rational-expressions': 'Rational Expr.',
  'm3-exponential-logs': 'Exp & Logs',
  'm3-functions-transformations': 'Functions & Transf.',
  'm3-geometry': 'Geometry',
  'm3-statistics': 'Statistics',
  'mixed-m3': 'Mixed Math 3',
  'g7-ratios-proportions': 'Ratios & Proportions',
  'g7-expressions-equations': 'Expressions & Eq.',
  'g7-numbers-operations': 'Number Operations',
  'g7-geometry': 'Geometry',
  'g7-statistics': 'Statistics',
  'g7-probability': 'Probability',
  'mixed-g7': 'Mixed Math 7',
  'g6-ratios': 'Ratios & Percents',
  'g6-expressions-equations': 'Expressions & Eq.',
  'g6-number-system': 'Number System',
  'g6-geometry': 'Geometry',
  'g6-statistics': 'Statistics',
  'mixed-g6': 'Mixed Math 6',
  'g8-functions': 'Functions',
  'g8-expressions-equations': 'Expressions & Eq.',
  'g8-geometry': 'Geometry',
  'g8-statistics-probability': 'Statistics & Prob.',
  'g8-number-system': 'Number System',
  'mixed-g8': 'Mixed Math 8',
}

export default function ResultsScreen({
  totalProblems,
  correctCount,
  bestStreak,
  avgTime,
  totalTime,
  techniqueBreakdown,
  onPracticeAgain,
}: ResultsScreenProps) {
  const navigate = useNavigate()
  const accuracy = totalProblems > 0 ? Math.round((correctCount / totalProblems) * 100) : 0
  const grade = getGrade(accuracy)
  const [animatedAccuracy, setAnimatedAccuracy] = useState(0)
  const [showGrade, setShowGrade] = useState(false)

  // Heavy confetti celebration on load
  useEffect(() => {
    const end = Date.now() + 3000
    const colors = ['#E30614', '#C9A86C', '#FFFFFF', '#22C55E']

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
        disableForReducedMotion: true,
      })
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
        disableForReducedMotion: true,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    // Start confetti after a short delay
    const timer = setTimeout(() => {
      requestAnimationFrame(frame)
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  // Animate accuracy counter
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGrade(true)
      let current = 0
      const step = Math.ceil(accuracy / 30)
      const interval = setInterval(() => {
        current += step
        if (current >= accuracy) {
          setAnimatedAccuracy(accuracy)
          clearInterval(interval)
        } else {
          setAnimatedAccuracy(current)
        }
      }, 30)
      return () => clearInterval(interval)
    }, 800)
    return () => clearTimeout(timer)
  }, [accuracy])

  const stats = [
    { icon: CheckCircle, label: 'Correct', value: `${correctCount} of ${totalProblems}`, color: 'text-[#22C55E]' },
    { icon: Flame, label: 'Best Streak', value: `${bestStreak}`, color: 'text-[#C9A86C]' },
    { icon: Clock, label: 'Avg Time', value: formatDuration(avgTime), color: 'text-[#8A8A8A]' },
    { icon: Timer, label: 'Total Time', value: formatDuration(totalTime), color: 'text-[#8A8A8A]' },
  ]

  return (
    <div
      className="w-full flex items-start justify-center overflow-y-auto"
      style={{
        minHeight: 'calc(100dvh - 72px)',
        background: 'radial-gradient(circle, rgba(201,168,108,0.06) 0%, transparent 70%)',
      }}
    >
      <div className="w-full max-w-[640px] mx-auto px-6 py-12 flex flex-col items-center">
        {/* Trophy */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <Trophy size={48} className="text-[#C9A86C] mb-4" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="font-display text-[clamp(1.8rem,3vw,2.8rem)] text-white mb-8"
        >
          Session Complete!
        </motion.h2>

        {/* Grade Circle */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={showGrade ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className={`w-[120px] h-[120px] rounded-full border-2 ${grade.borderColor} ${grade.bgColor} flex items-center justify-center mb-3`}
        >
          <motion.span
            className={`font-display text-[clamp(2.5rem,5vw,4.5rem)] ${grade.color} leading-none`}
          >
            {grade.letter}
          </motion.span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-[1.5rem] font-semibold text-white mb-8"
        >
          Accuracy: {animatedAccuracy}%
        </motion.p>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="w-full grid grid-cols-2 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-5 flex flex-col items-center gap-1"
            >
              <stat.icon size={20} className={stat.color} />
              <span className="text-[1.5rem] font-semibold text-white">{stat.value}</span>
              <span className="text-[0.75rem] text-[#555555]">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Technique Breakdown */}
        {techniqueBreakdown.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="w-full mb-8"
          >
            <h3 className="text-[1.25rem] font-semibold text-white mb-4">
              By Technique
            </h3>
            <div className="flex flex-col gap-3">
              {techniqueBreakdown.map((t) => {
                const pct = t.attempted > 0 ? Math.round((t.correct / t.attempted) * 100) : 0
                return (
                  <div key={t.technique} className="flex items-center gap-3">
                    <span className="text-sm text-[#8A8A8A] w-[140px] shrink-0 text-right">
                      {displayNames[t.technique]}
                    </span>
                    <div className="flex-1 h-[6px] rounded-full bg-[#1A1A1A] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 1.8, duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full bg-[#22C55E]"
                      />
                    </div>
                    <span className="text-sm text-white font-medium w-[48px]">
                      {t.correct}/{t.attempted}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-6"
        >
          <button
            type="button"
            onClick={onPracticeAgain}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#E30614] text-white text-[0.9375rem] font-semibold hover:bg-[#FF1A2E] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <RefreshCw size={18} />
            Practice Again
          </button>
          <button
            type="button"
            onClick={() => navigate('/generator')}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[#333333] text-white text-[0.9375rem] font-medium hover:bg-[rgba(255,255,255,0.05)] hover:border-white transition-all duration-200"
          >
            <Calculator size={18} />
            Back to Generator
          </button>
          <button
            type="button"
            onClick={() => {
              const text = `I scored ${grade.letter} (${accuracy}%) on MathPivot Practice Mode! ${correctCount}/${totalProblems} correct with a best streak of ${bestStreak}.`
              if (navigator.share) {
                navigator.share({ title: 'MathPivot Practice Results', text })
              } else {
                navigator.clipboard.writeText(text)
              }
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-[#8A8A8A] text-[0.9375rem] font-medium hover:text-white transition-colors duration-200"
          >
            <Share2 size={18} />
            Share Results
          </button>
        </motion.div>
      </div>
    </div>
  )
}
