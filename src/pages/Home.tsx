import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Calculator,
  Target,
  ChevronDown,
  RefreshCw,
  ChevronRight,
  Zap,
  BookOpen,
  BarChart3,
  Infinity as InfinityIcon,
  Shuffle,
  Split,
  ArrowRight,
  Triangle,
  GitBranch,
} from 'lucide-react'
import MathDisplay from '@/components/MathDisplay'
import DifficultySelector from '@/components/DifficultySelector'
import TechniqueBadge from '@/components/TechniqueBadge'
import { generateProblem, getTechniques } from '@/lib/problemGenerator'
import type { IntegrationTechnique, Difficulty, Problem } from '@/lib/problemGenerator'

/* ─────────────────────────── easing helpers ─────────────────────────── */
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]
const easeOutQuart = [0.25, 1, 0.5, 1] as [number, number, number, number]

/* ─────────────────────────── Section wrapper ─────────────────────────── */
function ScrollReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: easeOutQuart, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 1: HERO
   ═══════════════════════════════════════════════════════════════════════ */
const floatingSymbols = [
  { symbol: '∫', size: 120, left: '8%', top: '15%', delay: 0, duration: 10 },
  { symbol: 'Σ', size: 100, left: '85%', top: '20%', delay: 2, duration: 12 },
  { symbol: 'π', size: 80, left: '75%', top: '65%', delay: 1, duration: 11 },
  { symbol: 'dx', size: 60, left: '15%', top: '70%', delay: 3, duration: 9 },
  { symbol: '∫', size: 150, left: '90%', top: '80%', delay: 0.5, duration: 13 },
  { symbol: 'dθ', size: 70, left: '5%', top: '40%', delay: 1.5, duration: 10 },
  { symbol: '∞', size: 90, left: '50%', top: '10%', delay: 2.5, duration: 12 },
  { symbol: '√', size: 85, left: '30%', top: '85%', delay: 1, duration: 11 },
]

function HeroSection() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.15]"
        style={{ backgroundImage: 'url(/hero-math-bg.png)' }}
      />

      {/* Floating symbols */}
      {floatingSymbols.map((s, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none font-display"
          style={{
            left: s.left,
            top: s.top,
            fontSize: s.size,
            color: 'rgba(255,255,255,0.03)',
          }}
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: s.delay,
          }}
        >
          {s.symbol}
        </motion.div>
      ))}

      {/* Vignette overlay */}
      <div className="absolute inset-0 hero-vignette pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-[900px]">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.3 }}
          className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[#C9A86C] mb-4"
        >
          Calculus Practice Tool
        </motion.p>

        {/* Headline */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.5 }}
            className="font-display text-[clamp(3.5rem,8vw,7rem)] leading-[0.95] tracking-[-0.02em] text-white"
          >
            Master
          </motion.h1>
        </div>
        <div className="overflow-hidden mt-2">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.62 }}
            className="font-display text-[clamp(3.5rem,8vw,7rem)] leading-[0.95] tracking-[-0.02em] text-white"
          >
            <span className="text-[#C9A86C]">∫</span>ntegration
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutQuart, delay: 1.0 }}
          className="mt-6 text-[1.125rem] leading-[1.7] text-[#8A8A8A] max-w-[640px]"
        >
          Generate unlimited practice problems across every integration technique.
          From u-substitution to partial fractions, build your calculus confidence
          one problem at a time.
        </motion.p>

        {/* CTA Group */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo, delay: 1.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/generator"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[8px] bg-[#E30614] text-white text-[0.9375rem] font-semibold hover:bg-[#FF1A2E] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(227,6,20,0.3)]"
          >
            <Calculator size={18} />
            Start Generating
          </Link>
          <Link
            to="/practice"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[8px] border border-[#333333] text-white text-[0.9375rem] font-semibold hover:bg-[rgba(255,255,255,0.05)] hover:border-white transition-all duration-200"
          >
            <Target size={18} />
            Practice Mode
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.3, delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={24} className="text-[#555555]" />
        </motion.div>
        <span className="text-[0.75rem] font-medium uppercase tracking-[0.05em] text-[#555555]">
          Scroll to explore
        </span>
      </motion.div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 2: LIVE PROBLEM PREVIEW
   ═══════════════════════════════════════════════════════════════════════ */
function ProblemPreviewSection() {
  const [problem, setProblem] = useState<Problem | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateNew = useCallback(() => {
    setIsGenerating(true)
    setShowSolution(false)
    setTimeout(() => {
      const techniques: IntegrationTechnique[] = ['basic', 'u-substitution', 'parts', 'trigonometric']
      const tech = techniques[Math.floor(Math.random() * techniques.length)]
      const difficulties: Difficulty[] = ['easy', 'medium']
      const diff = difficulties[Math.floor(Math.random() * difficulties.length)]
      const newProblem = generateProblem('integration', tech, diff, Math.floor(Math.random() * 10000))
      setProblem(newProblem)
      setIsGenerating(false)
    }, 300)
  }, [])

  useEffect(() => {
    generateNew()
  }, [generateNew])

  return (
    <section className="bg-[#111111] py-24 md:py-32">
      <div className="container-mathgen max-w-[960px]">
        <ScrollReveal className="text-center">
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.12em] text-[#C9A86C] mb-4">
            See It In Action
          </p>
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.1] tracking-[-0.01em] text-white mb-4">
            Try a Problem Right Now
          </h2>
          <p className="text-[1rem] leading-[1.6] text-[#8A8A8A] mb-10 max-w-[600px] mx-auto">
            Click generate to see a new integration problem instantly rendered in beautiful LaTeX.
          </p>
        </ScrollReveal>

        {/* Problem Card */}
        <ScrollReveal delay={0.2}>
          <div className="relative max-w-[800px] mx-auto rounded-[12px] border border-[#1F1F1F] card-gradient p-6 md:p-8 transition-all duration-300 hover:border-[#333333]">
            {/* Card header */}
            <div className="flex items-center justify-between mb-8">
              {problem && (
                <>
                  <TechniqueBadge technique={problem.technique} />
                  <DifficultySelector difficulty={problem.difficulty} />
                </>
              )}
            </div>

            {/* Problem statement */}
            <div className="min-h-[80px] flex items-center justify-center mb-8">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="w-48 h-8 rounded bg-[#1A1A1A]"
                  />
                ) : problem ? (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: easeOutExpo }}
                    className="font-mono text-[1.5rem] leading-[1.5] text-white"
                  >
                    <MathDisplay latex={problem.question} displayMode />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Action row */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
              <button
                onClick={generateNew}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-[#E30614] text-white text-[0.875rem] font-semibold hover:bg-[#FF1A2E] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} />
                Generate New
              </button>
              <button
                onClick={() => setShowSolution(!showSolution)}
                disabled={!problem || isGenerating}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[8px] text-[#8A8A8A] text-[0.875rem] font-medium hover:text-white transition-colors duration-200 disabled:opacity-50"
              >
                {showSolution ? 'Hide' : 'View'} Solution
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-300 ${showSolution ? 'rotate-90' : ''}`}
                />
              </button>
            </div>

            {/* Solution area */}
            <AnimatePresence>
              {showSolution && problem && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.45, 0.05, 0.55, 0.95] as [number, number, number, number] }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 border-t border-[#1F1F1F] space-y-4">
                    {problem.steps.map((step, i) => (
                      <motion.div
                        key={step.number}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: easeOutQuart, delay: i * 0.15 }}
                        className="flex gap-4"
                      >
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[rgba(201,168,108,0.15)] border border-[rgba(201,168,108,0.3)] flex items-center justify-center">
                          <span className="text-[0.75rem] font-medium text-[#C9A86C]">
                            {step.number}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-[0.875rem] text-[#8A8A8A] mb-1">{step.description}</p>
                          <div className="font-mono text-[1rem] text-white">
                            <MathDisplay latex={step.math} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <div className="pt-4 border-t border-[#1F1F1F]">
                      <p className="text-[0.875rem] text-[#8A8A8A] mb-1">Final Answer:</p>
                      <div className="font-mono text-[1.125rem] text-[#22C55E]">
                        <MathDisplay latex={problem.answer} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>

        {/* Problem counter */}
        <ScrollReveal delay={0.3}>
          <p className="text-center mt-8 text-[0.875rem] text-[#555555] flex items-center justify-center gap-2">
            <Zap size={16} className="text-[#C9A86C]" />
            Over 10,000 unique problems generated
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 3: TECHNIQUES GRID
   ═══════════════════════════════════════════════════════════════════════ */
const iconMap: Record<string, React.ElementType> = {
  Zap,
  ArrowRight,
  GitBranch,
  RefreshCw,
  Triangle,
  Split,
  InfinityIcon,
  Shuffle,
}

function TechniquesGridSection() {
  const techniques = getTechniques()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })

  return (
    <section className="bg-[#050505] py-24 md:py-32">
      <div className="container-mathgen">
        <ScrollReveal>
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.12em] text-[#C9A86C] mb-4">
            Techniques Covered
          </p>
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.1] tracking-[-0.01em] text-white mb-4">
            Every Method You Need
          </h2>
          <p className="text-[1.125rem] leading-[1.7] text-[#8A8A8A] max-w-[640px] mb-12">
            From the fundamental power rule to advanced partial fraction decomposition —
            comprehensive coverage of all major integration techniques.
          </p>
        </ScrollReveal>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techniques.map((tech, i) => {
            const Icon = iconMap[tech.icon] || Zap
            return (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, ease: easeOutQuart, delay: i * 0.08 }}
                className="group relative rounded-[12px] border border-[#1F1F1F] bg-[#111111] p-6 transition-all duration-300 hover:border-[#333333] hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
              >
                <Icon size={32} className="text-[#C9A86C] mb-4" />
                <h3 className="text-[1.25rem] font-semibold text-white mb-1">{tech.name}</h3>
                <p className="text-[0.875rem] text-[#8A8A8A] mb-3">{tech.description}</p>
                <div className="font-mono text-[0.875rem] text-[#555555] mb-3">
                  {tech.id === 'mixed' ? (
                    <span>Random selection</span>
                  ) : (
                    <MathDisplay latex={tech.example} />
                  )}
                </div>
                <div className="opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-250">
                  <ul className="flex flex-wrap gap-1.5">
                    {tech.subtopics.slice(0, 3).map((st) => (
                      <li
                        key={st}
                        className="text-[0.6875rem] text-[#8A8A8A] bg-[rgba(255,255,255,0.05)] px-2 py-0.5 rounded"
                      >
                        {st}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 4: HOW IT WORKS
   ═══════════════════════════════════════════════════════════════════════ */
const steps = [
  {
    number: 1,
    title: 'Choose Your Technique',
    description: 'Select from 8 integration categories or go random. Pick a difficulty that matches your skill level.',
  },
  {
    number: 2,
    title: 'Solve the Problem',
    description: 'Work through the problem at your own pace. Write your answer and check whenever you\'re ready.',
  },
  {
    number: 3,
    title: 'Learn from Solutions',
    description: 'View detailed step-by-step solutions with full LaTeX explanations. Track your progress over time.',
  },
]

function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <section className="bg-[#111111] py-24 md:py-32">
      <div className="container-mathgen max-w-[1080px]">
        <ScrollReveal className="text-center mb-14">
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.12em] text-[#C9A86C] mb-4">
            How It Works
          </p>
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.1] tracking-[-0.01em] text-white">
            Three Steps to Mastery
          </h2>
        </ScrollReveal>

        <div ref={ref} className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-7 left-[20%] right-[20%] h-[1px] bg-[#1F1F1F]" />

          {steps.map((step, i) => (
            <div key={step.number} className="flex flex-col items-center text-center relative z-10">
              {/* Number circle */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
                  delay: i * 0.3,
                }}
                className="w-14 h-14 rounded-full border-2 border-[#E30614] flex items-center justify-center bg-[#111111]"
              >
                <span className="font-display text-[1.25rem] text-[#E30614]">{step.number}</span>
              </motion.div>

              {/* Title & description */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: easeOutQuart, delay: i * 0.3 + 0.15 }}
                className="mt-5 text-[1.25rem] font-semibold text-white"
              >
                {step.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.5, ease: easeOutQuart, delay: i * 0.3 + 0.25 }}
                className="mt-2 text-[1rem] leading-[1.6] text-[#8A8A8A] max-w-[280px]"
              >
                {step.description}
              </motion.p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 5: STATS BAR
   ═══════════════════════════════════════════════════════════════════════ */
const stats = [
  { value: '10,000+', numericValue: 10000, label: 'Unique Problems', isNumeric: true },
  { value: '8', numericValue: 8, label: 'Integration Methods', isNumeric: true },
  { value: 'Step-by-Step', numericValue: 0, label: 'Detailed Solutions', isNumeric: false },
  { value: '100% Free', numericValue: 0, label: 'No Account Required', isNumeric: false },
]

function useCountUp(end: number, duration: number, inView: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let startTime: number | null = null
    let raf: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      // ease-out-expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.floor(eased * end))
      if (progress < 1) {
        raf = requestAnimationFrame(animate)
      }
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [end, duration, inView])

  return count
}

function StatsBarSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const count1 = useCountUp(10000, 1.5, inView)
  const count2 = useCountUp(8, 1.5, inView)

  return (
    <section className="bg-[#050505] border-y border-[#1F1F1F] py-12 md:py-16">
      <div className="container-mathgen max-w-[960px]" ref={ref}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-[2rem] text-[#C9A86C]"
            >
              {count1.toLocaleString()}+
            </motion.p>
            <p className="text-[0.875rem] text-[#8A8A8A] uppercase tracking-[0.05em] mt-1">
              {stats[0].label}
            </p>
          </div>
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-[2rem] text-[#C9A86C]"
            >
              {count2}
            </motion.p>
            <p className="text-[0.875rem] text-[#8A8A8A] uppercase tracking-[0.05em] mt-1">
              {stats[1].label}
            </p>
          </div>
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-display text-[2rem] text-[#C9A86C]"
            >
              {stats[2].value}
            </motion.p>
            <p className="text-[0.875rem] text-[#8A8A8A] uppercase tracking-[0.05em] mt-1">
              {stats[2].label}
            </p>
          </div>
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-display text-[2rem] text-[#C9A86C]"
            >
              {stats[3].value}
            </motion.p>
            <p className="text-[0.875rem] text-[#8A8A8A] uppercase tracking-[0.05em] mt-1">
              {stats[3].label}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 6: FEATURE HIGHLIGHTS
   ═══════════════════════════════════════════════════════════════════════ */

function LatexPulseVisual() {
  return (
    <motion.div
      className="mt-4 font-mono text-[0.875rem] text-[#555555]"
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <MathDisplay latex="\\int_0^{\\infty} e^{-x^2} \\, dx = \\frac{\\sqrt{\\pi}}{2}" />
    </motion.div>
  )
}

function StepsPulseVisual() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mt-4 flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.625rem] font-medium transition-all duration-300 ${
              i === activeStep
                ? 'bg-[rgba(201,168,108,0.3)] text-[#C9A86C] shadow-[0_0_8px_rgba(201,168,108,0.2)]'
                : 'bg-[#1A1A1A] text-[#555555]'
            }`}
          >
            {i + 1}
          </div>
          {i < 2 && <div className="w-4 h-[1px] bg-[#1F1F1F]" />}
        </div>
      ))}
    </div>
  )
}

function ProgressPulseVisual() {
  return (
    <div className="mt-4 w-full">
      <div className="h-1.5 rounded-full bg-[#1A1A1A] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #E30614 0%, #C9A86C 100%)',
          }}
          animate={{ width: ['0%', '100%', '0%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}

const featureCards = [
  {
    icon: BookOpen,
    title: 'Beautiful LaTeX Rendering',
    description:
      'Every problem and solution is beautifully typeset with KaTeX. Read mathematical notation exactly as it appears in textbooks and exams.',
    visual: <LatexPulseVisual />,
  },
  {
    icon: ChevronRight,
    title: 'Step-by-Step Solutions',
    description:
      'Not just answers — detailed breakdowns showing every substitution, every identity applied, and every simplification along the way.',
    visual: <StepsPulseVisual />,
  },
  {
    icon: BarChart3,
    title: 'Track Your Progress',
    description:
      'Monitor your accuracy, streaks, and technique mastery over time. Identify your weak spots and focus your practice where it matters.',
    visual: <ProgressPulseVisual />,
  },
]

function FeatureHighlightsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <section className="bg-[#050505] py-24 md:py-32">
      <div className="container-mathgen max-w-[1080px]">
        <ScrollReveal>
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.12em] text-[#C9A86C] mb-4">
            Why MathPivot
          </p>
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.1] tracking-[-0.01em] text-white mb-12">
            Built for Serious Practice
          </h2>
        </ScrollReveal>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureCards.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.7, ease: easeOutQuart, delay: i * 0.1 }}
                className="rounded-[12px] border border-[#1F1F1F] bg-[#111111] p-6 transition-all duration-300 hover:border-[#333333] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              >
                <Icon size={40} className="text-[#E30614] mb-4" />
                <h3 className="text-[1.25rem] font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-[0.875rem] leading-[1.5] text-[#8A8A8A]">{card.description}</p>
                {card.visual}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 7: CTA FOOTER
   ═══════════════════════════════════════════════════════════════════════ */
function CTAFooterSection() {
  return (
    <section className="relative bg-[#111111] py-24 md:py-32 overflow-hidden">
      {/* Subtle red glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-[600px] h-[600px] rounded-full glow-red" />
      </motion.div>

      <div className="container-mathgen max-w-[720px] text-center relative z-10">
        <ScrollReveal>
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.1] tracking-[-0.01em] text-white">
            Ready to Master Integration?
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <p className="mt-4 text-[1.125rem] leading-[1.7] text-[#8A8A8A]">
            Start generating practice problems right now. No sign-up, no paywall — just pure
            mathematical practice.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/generator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[8px] bg-[#E30614] text-white text-[0.9375rem] font-semibold hover:bg-[#FF1A2E] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(227,6,20,0.3)]"
            >
              <Calculator size={18} />
              Launch Generator
            </Link>
            <Link
              to="/practice"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[8px] border border-[#333333] text-white text-[0.9375rem] font-semibold hover:bg-[rgba(255,255,255,0.05)] hover:border-white transition-all duration-200"
            >
              <Target size={18} />
              Try Practice Mode
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div>
      <HeroSection />
      <ProblemPreviewSection />
      <TechniquesGridSection />
      <HowItWorksSection />
      <StatsBarSection />
      <FeatureHighlightsSection />
      <CTAFooterSection />
    </div>
  )
}
