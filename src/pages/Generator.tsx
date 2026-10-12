import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RefreshCw,
  Lightbulb,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react'

import { generateProblem, getTechniquesForSubject } from '@/lib/problemGenerator'
import type {
  Problem,
  Subject,
  Technique,
  Difficulty,
} from '@/lib/problemGenerator'
import MathDisplay from '@/components/MathDisplay'
import DifficultySelector from '@/components/DifficultySelector'
import TechniqueBadge from '@/components/TechniqueBadge'
import CourseSubjectPicker from '@/components/CourseSubjectPicker'
import { SUBJECT_NAMES, DEFAULT_TECHNIQUE } from '@/lib/courses'
import SessionStats from '@/components/generator/SessionStats'
import TechniqueSelector from '@/components/generator/TechniqueSelector'
import AnswerInput from '@/components/generator/AnswerInput'
import McChoices from '@/components/generator/McChoices'
import AnswerFeedback from '@/components/generator/AnswerFeedback'
import SolutionSteps from '@/components/generator/SolutionSteps'
import ProblemHistory from '@/components/generator/ProblemHistory'
import type { HistoryEntry } from '@/components/generator/ProblemHistory'

import { checkAnswer } from '@/lib/answerChecker'

type FeedbackState = 'idle' | 'correct' | 'incorrect'

const generateProblemId = (() => {
  let counter = 0
  return () => `prob-${Date.now()}-${counter++}`
})()

export default function Generator() {
  // ── Core State ──────────────────────────────────────────
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<Subject>('integration')
  const [selectedTechnique, setSelectedTechnique] = useState<Technique>('basic')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy')
  const [userAnswer, setUserAnswer] = useState('')
  const [mcSelected, setMcSelected] = useState<string | null>(null)
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('idle')
  const [solutionShown, setSolutionShown] = useState(false)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [problemCount, setProblemCount] = useState(0)
  const [copied, setCopied] = useState(false)

  // ── Session State ───────────────────────────────────────
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionAttempted, setSessionAttempted] = useState(0)
  const [sessionStreak, setSessionStreak] = useState(0)
  const [history, setHistory] = useState<HistoryEntry[]>([])

  // ── Refs ────────────────────────────────────────────────
  const problemKeyRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // ── Keyboard Shortcuts ──────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (e.key === 'Enter') {
          e.preventDefault()
          handleCheckAnswer()
        }
        return
      }

      if (e.key === ' ') {
        e.preventDefault()
        handleGenerateProblem()
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault()
        if (currentProblem) setSolutionShown(true)
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault()
        if (currentProblem && hintsRevealed < currentProblem.hints.length) {
          setHintsRevealed((prev) => prev + 1)
        }
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        handleGenerateProblem()
      } else if (e.key === 'e' || e.key === 'E') {
        setSelectedDifficulty('easy')
      } else if (e.key === 'm' || e.key === 'M') {
        setSelectedDifficulty('medium')
      } else if (e.key >= '1' && e.key <= '9') {
        const techniques = getTechniquesForSubject(selectedSubject)
        const idx = parseInt(e.key) - 1
        if (idx < techniques.length) {
          setSelectedTechnique(techniques[idx].id as Technique)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  // ── Problem Generation ──────────────────────────────────
  const handleGenerateProblem = useCallback(async () => {
    if (isGenerating) return
    setIsGenerating(true)
    setFeedbackState('idle')
    setSolutionShown(false)
    setHintsRevealed(0)
    setUserAnswer('')
    setMcSelected(null)
    setCopied(false)

    // Brief delay for transition animation
    await new Promise((r) => setTimeout(r, 200))

    const problem = generateProblem(selectedSubject, selectedTechnique, selectedDifficulty)
    const problemWithId = { ...problem, id: generateProblemId() }

    setCurrentProblem(problemWithId)
    setProblemCount((prev) => prev + 1)
    problemKeyRef.current += 1

    // Add to history as "skipped" entry for the previous problem if unsolved
    setHistory((prev) => {
      if (prev.length > 0 && prev[0].correct === null) {
        // Leave as skipped (null = skipped)
      }
      return [
        {
          problemId: problemWithId.id,
          technique: problemWithId.technique,
          question: problemWithId.question,
          correct: null,
          timestamp: Date.now(),
        },
        ...prev,
      ].slice(0, 50)
    })

    setIsGenerating(false)
  }, [isGenerating, selectedSubject, selectedTechnique, selectedDifficulty])

  // ── Answer Checking ─────────────────────────────────────
  const handleCheckAnswer = useCallback((override?: string) => {
    const value = (override ?? userAnswer).trim()
    if (!currentProblem || !value || feedbackState !== 'idle') return

    const result = checkAnswer(value, currentProblem.answer)
    const isCorrect = result.correct
    setFeedbackState(isCorrect ? 'correct' : 'incorrect')
    setSessionAttempted((prev) => prev + 1)

    if (isCorrect) {
      setSessionCorrect((prev) => prev + 1)
      setSessionStreak((prev) => prev + 1)
      setSolutionShown(true)
    } else {
      setSessionStreak(0)
    }

    // Update history entry
    setHistory((prev) =>
      prev.map((entry, i) =>
        i === 0 && entry.problemId === currentProblem.id
          ? { ...entry, correct: isCorrect }
          : entry,
      ),
    )
  }, [currentProblem, userAnswer, feedbackState])

  // ── Try Again ───────────────────────────────────────────
  const handleTryAgain = useCallback(() => {
    setFeedbackState('idle')
    setUserAnswer('')
    setMcSelected(null)
    setHintsRevealed(0)
  }, [])

  // ── Show Solution ───────────────────────────────────────
  const handleShowSolution = useCallback(() => {
    setSolutionShown(true)
    if (feedbackState === 'idle' && currentProblem) {
      // Mark as incorrect if they view solution without answering
      setSessionAttempted((prev) => prev + 1)
      setSessionStreak(0)
      setFeedbackState('incorrect')
      setHistory((prev) =>
        prev.map((entry, i) =>
          i === 0 && entry.problemId === currentProblem.id
            ? { ...entry, correct: false }
            : entry,
        ),
      )
    }
  }, [currentProblem, feedbackState])

  // ── Hint ────────────────────────────────────────────────
  const handleShowHint = useCallback(() => {
    if (currentProblem && hintsRevealed < currentProblem.hints.length) {
      setHintsRevealed((prev) => prev + 1)
    }
  }, [currentProblem, hintsRevealed])

  // ── Copy Problem ────────────────────────────────────────
  const handleCopyProblem = useCallback(async () => {
    if (!currentProblem) return
    const text = `Problem: ${currentProblem.question}\nAnswer: ${currentProblem.answer}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [currentProblem])

  // ── Clear History ───────────────────────────────────────
  const handleClearHistory = useCallback(() => {
    setHistory([])
    setSessionCorrect(0)
    setSessionAttempted(0)
    setSessionStreak(0)
    setProblemCount(0)
  }, [])

  // ── Difficulty Pills ────────────────────────────────────
  const difficultyPills: { value: Difficulty; label: string; border: string; text: string; bg: string }[] = [
    {
      value: 'easy',
      label: 'Easy',
      border: 'border-[#22C55E]',
      text: 'text-[#22C55E]',
      bg: 'bg-[rgba(34,197,94,0.05)]',
    },
    {
      value: 'medium',
      label: 'Medium',
      border: 'border-[#F59E0B]',
      text: 'text-[#F59E0B]',
      bg: 'bg-[rgba(245,158,11,0.05)]',
    },
    {
      value: 'hard',
      label: 'Hard',
      border: 'border-[#E30614]',
      text: 'text-[#E30614]',
      bg: 'bg-[rgba(227,6,20,0.05)]',
    },
  ]

  // ── Animation variants ──────────────────────────────────
  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  }

  const problemVariants = {
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
    enter: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  }

  return (
    <div className="min-h-[100dvh] bg-[#050505]">
      {/* ── Page Header ──────────────────────────────────── */}
      <section className="border-b border-[#1F1F1F]">
        <div className="container-mathgen pt-12 pb-8 px-6 lg:px-12 xl:px-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
                className="font-display text-[clamp(1.8rem,3vw,2.8rem)] text-white mb-2"
              >
                Problem Generator
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
                className="text-[#8A8A8A]"
              >
                Select a subject, technique, and difficulty, then generate problems to practice.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <SessionStats
                correct={sessionCorrect}
                attempted={sessionAttempted}
                streak={sessionStreak}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Main Content: Two-Panel Layout ───────────────── */}
      <section className="container-mathgen py-8 px-6 lg:px-12 xl:px-16">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Right Panel: Controls (reordered on mobile) ─ */}
          <motion.aside
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-[45%] xl:w-[40%] shrink-0 space-y-6"
          >
            {/* Control Panel */}
            <div className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-6 space-y-6">
              {/* Technique Selector */}
              <div>
                <div className="mb-4">
                <h3 className="text-[1.25rem] font-semibold text-white mb-3">
                  {SUBJECT_NAMES[selectedSubject]} Technique
                </h3>
                <div className="mb-3">
                  <CourseSubjectPicker
                    subject={selectedSubject}
                    showLabels={false}
                    onSubjectChange={(s) => {
                      setSelectedSubject(s)
                      setSelectedTechnique(DEFAULT_TECHNIQUE[s])
                    }}
                  />
                </div>
              </div>
                <TechniqueSelector
                  subject={selectedSubject}
                  selected={selectedTechnique}
                  onChange={setSelectedTechnique}
                />
              </div>

              {/* Difficulty Selector */}
              <div>
                <h3 className="text-[1.25rem] font-semibold text-white mb-3">
                  Difficulty Level
                </h3>
                <div className="flex gap-3">
                  {difficultyPills.map((pill) => {
                    const isSelected = selectedDifficulty === pill.value
                    return (
                      <button
                        key={pill.value}
                        type="button"
                        onClick={() => setSelectedDifficulty(pill.value)}
                        className={`
                          flex-1 px-6 py-3 rounded-lg border text-center text-[0.875rem] font-medium
                          transition-all duration-200
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E30614] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]
                          ${
                            isSelected
                              ? `${pill.border} ${pill.text} ${pill.bg}`
                              : 'border-[#1F1F1F] text-[#8A8A8A] hover:border-[#333333] hover:text-white'
                          }
                        `}
                      >
                        {pill.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={handleGenerateProblem}
                disabled={isGenerating}
                className={`
                  w-full flex items-center justify-center gap-2
                  px-6 py-4 rounded-lg bg-[#E30614] text-white
                  text-[1.125rem] font-semibold
                  hover:bg-[#FF1A2E] hover:scale-[1.02]
                  active:scale-[0.97]
                  transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E30614] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]
                  disabled:opacity-70 disabled:cursor-not-allowed
                `}
              >
                <RefreshCw
                  size={20}
                  className={isGenerating ? 'animate-spin' : ''}
                />
                {isGenerating ? 'Generating...' : 'Generate Problem'}
              </button>
            </div>

            {/* Action Buttons (post-generation) */}
            <AnimatePresence>
              {currentProblem && feedbackState === 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  {currentProblem.itemType !== 'MC' && (
                  <button
                    type="button"
                    onClick={() => handleCheckAnswer()}
                    className="flex-1 px-6 py-3 rounded-lg bg-[#E30614] text-white text-[0.9375rem] font-semibold hover:bg-[#FF1A2E] active:scale-[0.97] transition-all duration-200"
                  >
                    Check Answer
                  </button>
                  )}
                  <button
                    type="button"
                    onClick={handleShowHint}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[#333333] text-[#8A8A8A] hover:bg-[rgba(255,255,255,0.05)] hover:text-white transition-all duration-200"
                  >
                    <Lightbulb size={16} />
                    <span className="text-[0.875rem] font-medium">Hint</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateProblem}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-[#8A8A8A] hover:text-white transition-colors duration-200"
                  >
                    <ChevronRight size={16} />
                    <span className="text-[0.875rem]">Skip</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint Display */}
            <AnimatePresence>
              {currentProblem && hintsRevealed > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2">
                    {currentProblem.hints.slice(0, hintsRevealed).map((hint, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="px-4 py-3 rounded-lg border border-[rgba(59,130,246,0.2)] bg-[rgba(59,130,246,0.05)]"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Lightbulb size={12} className="text-[#3B82F6]" />
                          <span className="text-[0.75rem] font-medium uppercase tracking-wider text-[#3B82F6]">
                            Hint {index + 1}
                          </span>
                        </div>
                        <div className="font-mono text-[0.875rem] text-white">
                          <MathDisplay latex={hint} />
                        </div>
                      </motion.div>
                    ))}
                    {hintsRevealed < currentProblem.hints.length && (
                      <button
                        type="button"
                        onClick={handleShowHint}
                        className="text-[0.875rem] text-[#3B82F6] hover:underline"
                      >
                        Show another hint...
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Problem History */}
            <ProblemHistory
              entries={history}
              onSelect={() => {}}
              onClear={handleClearHistory}
            />

            {/* Keyboard Shortcuts Reference */}
            <div className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-4">
              <h4 className="text-[0.75rem] font-medium uppercase tracking-wider text-[#555555] mb-3">
                Keyboard Shortcuts
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'Space', action: 'New Problem' },
                  { key: 'Enter', action: 'Check Answer' },
                  { key: 'S', action: 'Show Solution' },
                  { key: 'H', action: 'Show Hint' },
                  { key: 'E / M', action: 'Easy / Medium' },
                  { key: '1-9', action: 'Select Technique' },
                ].map((shortcut) => (
                  <div key={shortcut.key} className="flex items-center gap-2">
                    <kbd className="px-1.5 py-0.5 rounded bg-[#1A1A1A border border-[#333333] text-[0.7rem] text-[#8A8A8A] font-mono shrink-0 min-w-[2rem] text-center">
                      {shortcut.key}
                    </kbd>
                    <span className="text-[0.75rem] text-[#555555]">{shortcut.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* ── Left Panel: Problem Display ────────────────── */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            className="flex-1 min-w-0"
          >
            <div
              ref={containerRef}
              className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-6 lg:p-8 min-h-[500px] relative"
            >
              <AnimatePresence mode="wait">
                {!currentProblem ? (
                  /* ── Empty State ────────────────────────── */
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full min-h-[400px]"
                  >
                    <span className="font-display text-[120px] leading-none text-[rgba(255,255,255,0.04)] select-none">
                      {selectedSubject === 'integration' ? '\u222B' : selectedSubject === 'differentiation' ? 'd/dx' : selectedSubject === 'limits' ? 'lim' : selectedSubject === 'applications-derivatives' ? 'f′' : selectedSubject === 'applications-integration' ? '∫A' : selectedSubject === 'differential-equations' ? 'y′' : selectedSubject === 'sequences-series' ? 'Σ' : selectedSubject === 'math1-eoc' ? 'M1' : 'M3'}
                    </span>
                    <p className="text-[#555555] text-[1.125rem] mt-4">
                      Select a technique and click Generate to start
                    </p>
                    <p className="text-[#555555] text-[0.875rem] mt-2">
                      Your problem will appear here
                    </p>
                  </motion.div>
                ) : (
                  /* ── Problem State ──────────────────────── */
                  <motion.div
                    key={`problem-${problemKeyRef.current}`}
                    variants={problemVariants}
                    initial="enter"
                    animate="visible"
                    exit="exit"
                  >
                    {/* Problem Header Bar */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3 flex-wrap">
                        <TechniqueBadge technique={currentProblem.technique} />
                        <DifficultySelector
                          difficulty={currentProblem.difficulty}
                          interactive={false}
                        />
                      </div>
                      <span className="text-[0.75rem] text-[#555555] font-medium uppercase tracking-wider">
                        Problem #{problemCount}
                      </span>
                    </div>

                    {/* Problem Statement */}
                    <div className="text-center my-10 lg:my-16">
                      {currentProblem.context ? (
                        <p className="text-[1.05rem] text-[#C9C9C9] leading-[1.7] max-w-[640px] mx-auto mb-6 text-left">
                          {currentProblem.context}
                        </p>
                      ) : (
                        <p className="text-[0.875rem] text-[#8A8A8A] mb-4">Evaluate:</p>
                      )}
                      <div className="font-mono text-[1.5rem] lg:text-[1.75rem] overflow-x-auto">
                        <MathDisplay latex={currentProblem.question} displayMode />
                      </div>
                      {currentProblem.stemSvg && (
                        <div
                          className="mt-8 mx-auto w-fit max-w-full text-white"
                          // SVGs are built by our own generators (svg.ts), not user input
                          dangerouslySetInnerHTML={{ __html: currentProblem.stemSvg }}
                        />
                      )}
                    </div>

                    {/* Answer Input Area */}
                    <AnimatePresence mode="wait">
                      {feedbackState === 'idle' ? (
                        <motion.div
                          key="input"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="mb-8"
                        >
                          {currentProblem.itemType === 'MC' && currentProblem.choices ? (
                            <McChoices
                              choices={currentProblem.choices}
                              svgChoices={currentProblem.svgChoices}
                              onSelect={(c) => { setMcSelected(c); setUserAnswer(c); handleCheckAnswer(c) }}
                            />
                          ) : (
                            <AnswerInput
                              value={userAnswer}
                              onChange={setUserAnswer}
                              onSubmit={() => handleCheckAnswer()}
                              feedbackState={feedbackState}
                              subject={currentProblem?.subject}
                              gridded={currentProblem?.itemType === 'GR'}
                            />
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="feedback"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="mb-8"
                        >
                          {currentProblem.itemType === 'MC' && currentProblem.choices && (
                            <div className="mb-6">
                              <McChoices
                                choices={currentProblem.choices}
                                svgChoices={currentProblem.svgChoices}
                                onSelect={() => {}}
                                disabled
                                selected={mcSelected}
                                correctAnswer={currentProblem.answer}
                              />
                            </div>
                          )}
                          <AnswerFeedback
                            state={feedbackState}
                            onTryAgain={handleTryAgain}
                            onShowSolution={handleShowSolution}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Solution Reveal */}
                    <AnimatePresence>
                      {solutionShown && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
                          className="overflow-hidden"
                        >
                          <SolutionSteps
                            steps={currentProblem.steps}
                            finalAnswer={currentProblem.answer}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Next Actions (after solution shown) */}
                    <AnimatePresence>
                      {solutionShown && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.4 }}
                          className="flex items-center justify-center gap-4 mt-8"
                        >
                          <button
                            type="button"
                            onClick={handleGenerateProblem}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#E30614] text-white text-[0.9375rem] font-semibold hover:bg-[#FF1A2E] active:scale-[0.97] transition-all duration-200"
                          >
                            <RefreshCw size={18} />
                            Next Problem
                          </button>
                          <button
                            type="button"
                            onClick={handleCopyProblem}
                            className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#1F1F1F] text-[#8A8A8A] hover:bg-[#111111] hover:border-[#333333] hover:text-white transition-all duration-200"
                            title="Copy LaTeX"
                          >
                            {copied ? <Check size={16} className="text-[#22C55E]" /> : <Copy size={16} />}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
