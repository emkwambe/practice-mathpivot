import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Pause,
  X,
  ChevronRight,
  Lightbulb,
  BookOpen,
  CheckCircle,
  Flame,
  Target,
  Clock,
} from 'lucide-react'
import { checkAnswer } from '@/lib/answerChecker'
import type { Problem } from '@/lib/problemGenerator'
import MathDisplay from '@/components/MathDisplay'
import TechniqueBadge from '@/components/TechniqueBadge'
import SessionTimer from './SessionTimer'
import StreakIndicator from './StreakIndicator'
import AnswerFeedback from './AnswerFeedback'
import PauseOverlay from './PauseOverlay'
import MathPalette from '@/components/MathPalette'
import McChoices from '@/components/generator/McChoices'
import { useAnswerHistory } from '@/hooks/useAnswerHistory'

interface SessionAnswer {
  problemId: string
  correct: boolean
  timeSpent: number
  technique: string
}

interface ActiveSessionProps {
  problems: Problem[]
  timePerProblem: number // 0 = unlimited
  onComplete: (results: {
    answers: SessionAnswer[]
    score: number
    bestStreak: number
    totalTime: number
  }) => void
  onExit: () => void
}

export default function ActiveSession({
  problems,
  timePerProblem,
  onComplete,
  onExit,
}: ActiveSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [mcSelected, setMcSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [answers, setAnswers] = useState<SessionAnswer[]>([])
  const [showSolution, setShowSolution] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(timePerProblem)
  const [problemStartTime, setProblemStartTime] = useState(Date.now())
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right
  const inputRef = useRef<HTMLInputElement>(null)
  const sessionStartTime = useRef(Date.now())
  const history = useAnswerHistory(answer, setAnswer)

  const restoreCursor = useCallback((pos: number) => {
    requestAnimationFrame(() => {
      const input = inputRef.current
      if (!input) return
      input.setSelectionRange(pos, pos)
      input.focus()
    })
  }, [])

  const handleUndo = useCallback(() => {
    const entry = history.undo()
    if (entry) restoreCursor(entry.cursor)
  }, [history, restoreCursor])

  const handleRedo = useCallback(() => {
    const entry = history.redo()
    if (entry) restoreCursor(entry.cursor)
  }, [history, restoreCursor])

  const currentProblem = problems[currentIndex]
  const hasUnlimitedTime = timePerProblem <= 0
  const totalProblems = problems.length

  // Timer
  useEffect(() => {
    if (isPaused || feedback || hasUnlimitedTime) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - auto-submit as wrong
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, feedback, hasUnlimitedTime, currentIndex])

  // Reset timer on new problem
  useEffect(() => {
    if (!hasUnlimitedTime) {
      setTimeRemaining(timePerProblem)
    }
    setProblemStartTime(Date.now())
    setFeedback(null)
    setShowSolution(false)
    setShowHint(false)
    setAnswer('')
    setMcSelected(null)
    setDirection(1)

    // Focus input after transition
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 400)
    return () => clearTimeout(timer)
  }, [currentIndex, timePerProblem, hasUnlimitedTime])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (feedback) {
        if (e.key === 'Enter') {
          e.preventDefault()
          if (feedback === 'correct') {
            goToNextProblem()
          } else {
            clearFeedback()
          }
        }
        return
      }

      if (e.key === ' ' && !isPaused && document.activeElement !== inputRef.current) {
        e.preventDefault()
        handleSkip()
      }
      if (e.key === 'Escape' && !isPaused) {
        setIsPaused(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [feedback, isPaused])

  const handleTimeUp = useCallback(() => {
    if (feedback) return
    const timeSpent = (Date.now() - problemStartTime) / 1000
    setFeedback('incorrect')
    setStreak(0)
    setAnswers((prev) => [
      ...prev,
      {
        problemId: currentProblem.id,
        correct: false,
        timeSpent,
        technique: currentProblem.technique,
      },
    ])
  }, [feedback, currentProblem, problemStartTime])

  const handleInsert = useCallback((insert: string, cursorOffset: number) => {
    const input = inputRef.current
    if (!input) return
    const start = input.selectionStart ?? answer.length
    const end = input.selectionEnd ?? answer.length
    const newValue = answer.slice(0, start) + insert + answer.slice(end)
    const pos = start + insert.length + cursorOffset
    history.recordInsert(newValue, pos)
    setAnswer(newValue)
    requestAnimationFrame(() => {
      input.setSelectionRange(pos, pos)
      input.focus()
    })
  }, [answer, history])

  const handleSubmit = useCallback((override?: string) => {
    const value = (override ?? answer).trim()
    if (!value || feedback) return

    const timeSpent = (Date.now() - problemStartTime) / 1000
    const result = checkAnswer(value, currentProblem.answer)
    const isCorrect = result.correct

    setAnswers((prev) => [
      ...prev,
      {
        problemId: currentProblem.id,
        correct: isCorrect,
        timeSpent,
        technique: currentProblem.technique,
      },
    ])

    if (isCorrect) {
      setFeedback('correct')
      const newScore = score + 1
      setScore(newScore)
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak > bestStreak) {
        setBestStreak(newStreak)
      }
    } else {
      setFeedback('incorrect')
      setStreak(0)
    }
  }, [answer, feedback, currentProblem, problemStartTime, score, streak, bestStreak])

  const goToNextProblem = useCallback(() => {
    if (currentIndex + 1 >= totalProblems) {
      // Session complete
      const totalTime = (Date.now() - sessionStartTime.current) / 1000
      onComplete({
        answers,
        score: feedback === 'correct' ? score + 1 : score,
        bestStreak,
        totalTime,
      })
    } else {
      setDirection(-1)
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex, totalProblems, answers, score, bestStreak, feedback, onComplete])

  const clearFeedback = useCallback(() => {
    setFeedback(null)
    setAnswer('')
    setMcSelected(null)
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  const handleSkip = useCallback(() => {
    if (feedback) return
    const timeSpent = (Date.now() - problemStartTime) / 1000
    setAnswers((prev) => [
      ...prev,
      {
        problemId: currentProblem.id,
        correct: false,
        timeSpent,
        technique: currentProblem.technique,
      },
    ])
    setStreak(0)
    setCurrentIndex((prev) => {
      if (prev + 1 >= totalProblems) {
        const totalTime = (Date.now() - sessionStartTime.current) / 1000
        onComplete({
          answers: [...answers, {
            problemId: currentProblem.id,
            correct: false,
            timeSpent,
            technique: currentProblem.technique,
          }],
          score,
          bestStreak,
          totalTime,
        })
        return prev
      }
      return prev + 1
    })
  }, [feedback, currentProblem, problemStartTime, answers, score, bestStreak, totalProblems, onComplete])

  const accuracy = answers.length > 0 ? Math.round((score / answers.length) * 100) : 0
  const avgTime = answers.length > 0
    ? answers.reduce((sum, a) => sum + a.timeSpent, 0) / answers.length
    : 0

  if (!currentProblem) return null

  return (
    <div className="relative flex flex-col w-full" style={{ height: 'calc(100dvh - 72px)' }}>
      {/* Top Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-[#1F1F1F] bg-[#111111] shrink-0"
      >
        {/* Left group */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
                onExit()
              }
            }}
            className="flex items-center gap-1.5 text-[0.75rem] text-[#555555] hover:text-white transition-colors"
          >
            <X size={16} />
            <span className="hidden sm:inline">Exit</span>
          </button>
          <span className="text-[0.875rem] text-[#8A8A8A]">
            Problem {currentIndex + 1} of {totalProblems}
          </span>
        </div>

        {/* Center - Timer */}
        {!hasUnlimitedTime ? (
          <SessionTimer seconds={timeRemaining} isPaused={isPaused} />
        ) : (
          <div className="font-mono text-[1.5rem] font-medium text-white">
            Unlimited
          </div>
        )}

        {/* Right group */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPaused(true)}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#1F1F1F] bg-[#111111] text-[#8A8A8A] hover:text-white hover:border-[#333333] transition-all duration-200"
          >
            <Pause size={18} />
          </button>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="w-full h-[3px] bg-[#1A1A1A] shrink-0">
        <motion.div
          className="h-full rounded-r-full"
          style={{
            background: 'linear-gradient(90deg, #E30614 0%, #C9A86C 100%)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + (feedback ? 1 : 0)) / totalProblems) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Main Problem Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="w-full max-w-[800px] flex flex-col items-center"
          >
            {/* Technique badge */}
            <div className="mb-4">
              <TechniqueBadge technique={currentProblem.technique} />
            </div>

            {/* Problem display */}
            {currentProblem.context ? (
              <p className="text-[1rem] text-[#C9C9C9] leading-[1.7] max-w-[640px] mb-4 text-left">
                {currentProblem.context}
              </p>
            ) : (
              <p className="text-[0.875rem] text-[#8A8A8A] mb-4">
                Evaluate the integral:
              </p>
            )}
            <div className="py-8 sm:py-12 max-w-full overflow-x-auto">
              <span className="font-mono text-[1.5rem] leading-relaxed">
                <MathDisplay latex={currentProblem.question} displayMode />
              </span>
            </div>
            {currentProblem.stemSvg && (
              <div
                className="mb-6 w-fit max-w-full text-white"
                // SVGs are built by our own generators (svg.ts), not user input
                dangerouslySetInnerHTML={{ __html: currentProblem.stemSvg }}
              />
            )}

            {/* Streak indicator */}
            <div className="mb-6">
              <StreakIndicator streak={streak} size="md" />
            </div>

            {/* Answer input */}
            <div className="w-full max-w-[600px]">
              {currentProblem.itemType === 'MC' && currentProblem.choices ? (
                <McChoices
                  choices={currentProblem.choices}
                  svgChoices={currentProblem.svgChoices}
                  onSelect={(c) => {
                    if (feedback) return
                    setMcSelected(c)
                    setAnswer(c)
                    handleSubmit(c)
                  }}
                  disabled={!!feedback}
                  selected={feedback ? mcSelected : null}
                  correctAnswer={feedback ? currentProblem.answer : null}
                />
              ) : (
              <>
              <input
                ref={inputRef}
                type="text"
                value={answer}
                onChange={(e) => {
                  let newValue = e.target.value
                  if (currentProblem.itemType === 'GR') {
                    newValue = newValue.replace(/[^0-9.\-/ ]/g, '')
                  }
                  history.recordTyping(newValue, e.target.selectionStart ?? newValue.length)
                  setAnswer(newValue)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
                placeholder={currentProblem.itemType === 'GR' ? 'Enter a number (e.g. 4, -3.3, 3/2)...' : 'Type your answer (e.g., x^2/2 + C)...'}
                disabled={!!feedback}
                className="w-full px-5 py-4 rounded-xl border-2 border-[#1F1F1F] bg-[#111111] text-white font-mono text-[1.25rem] placeholder:text-[#555555] focus:border-[#E30614] focus:outline-none transition-all duration-200 disabled:opacity-50"
                style={{ boxShadow: 'none' }}
              />

              {/* Math palette */}
              {currentProblem.itemType !== 'GR' && (
                <div className="mt-3">
                  <MathPalette
                    inputRef={inputRef}
                    onInsert={handleInsert}
                    subject={currentProblem.subject}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    canUndo={history.canUndo}
                    canRedo={history.canRedo}
                  />
                </div>
              )}

              {/* Submit button */}
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!answer.trim() || !!feedback}
                className="w-full mt-4 flex items-center justify-center gap-2 px-5 py-4 rounded-lg bg-[#E30614] text-white text-[1.25rem] font-semibold hover:bg-[#FF1A2E] hover:scale-[1.01] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                Submit Answer
                <span className="text-[0.75rem] font-normal text-white/60 bg-white/10 px-1.5 py-0.5 rounded">
                  Enter
                </span>
              </button>
              </>
              )}

              {/* Quick actions */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowHint((prev) => !prev)}
                  disabled={!!feedback}
                  className="flex items-center gap-1.5 text-sm text-[#8A8A8A] hover:text-white disabled:opacity-40 transition-colors"
                >
                  <Lightbulb size={16} />
                  Hint
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={!!feedback}
                  className="flex items-center gap-1.5 text-sm text-[#8A8A8A] hover:text-white disabled:opacity-40 transition-colors"
                >
                  <ChevronRight size={16} />
                  Skip
                  <span className="text-[0.7rem] text-[#555555] bg-[#1A1A1A] px-1 py-0.5 rounded">
                    Space
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSolution((prev) => !prev)}
                  disabled={!!feedback}
                  className="flex items-center gap-1.5 text-sm text-[#8A8A8A] hover:text-white disabled:opacity-40 transition-colors"
                >
                  <BookOpen size={16} />
                  Solution
                </button>
              </div>

              {/* Hint display */}
              <AnimatePresence>
                {showHint && currentProblem.hints.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 p-4 rounded-lg bg-[#1A1A1A]">
                      <p className="text-sm text-[#F59E0B] font-medium mb-1">Hint:</p>
                      <span className="font-mono text-sm text-[#8A8A8A]">
                        <MathDisplay latex={currentProblem.hints[0]} />
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Solution display */}
              <AnimatePresence>
                {showSolution && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 p-4 rounded-lg bg-[#1A1A1A] border border-[#22C55E]/20">
                      <p className="text-sm text-[#22C55E] font-medium mb-1">Answer:</p>
                      <span className="font-mono text-sm text-white">
                        <MathDisplay latex={currentProblem.answer} displayMode />
                      </span>
                      {currentProblem.steps.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-[#555555] font-medium uppercase tracking-wider">
                            Steps:
                          </p>
                          {currentProblem.steps.map((step) => (
                            <div key={step.number} className="flex gap-3">
                              <span className="text-[#C9A86C] text-xs font-medium shrink-0 mt-0.5">
                                {step.number}.
                              </span>
                              <div>
                                <p className="text-xs text-[#8A8A8A]">{step.description}</p>
                                <span className="font-mono text-xs text-white">
                                  <MathDisplay latex={step.math} />
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedback && (
            <AnswerFeedback
              isCorrect={feedback === 'correct'}
              streak={streak}
              timeTaken={(Date.now() - problemStartTime) / 1000}
              onContinue={goToNextProblem}
              onTryAgain={clearFeedback}
              onShowSolution={() => {
                setShowSolution(true)
                clearFeedback()
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Stats Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        className="flex items-center justify-around h-14 px-4 sm:px-6 border-t border-[#1F1F1F] bg-[#111111] shrink-0"
      >
        <div className="flex items-center gap-1.5">
          <CheckCircle size={16} className="text-[#22C55E]" />
          <span className="text-sm text-white font-semibold">{score}</span>
          <span className="text-xs text-[#555555]">/ {answers.length}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Target size={16} className="text-[#8A8A8A]" />
          <span className="text-sm text-white font-semibold">{accuracy}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Flame size={16} className="text-[#C9A86C]" />
          <span className="text-sm text-white font-semibold">{streak}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <Clock size={16} className="text-[#8A8A8A]" />
          <span className="text-sm text-white font-semibold">
            {avgTime > 0 ? `${Math.round(avgTime)}s` : '—'}
          </span>
        </div>
      </motion.div>

      {/* Pause Overlay */}
      <AnimatePresence>
        {isPaused && (
          <PauseOverlay
            currentProblem={currentIndex + 1}
            totalProblems={totalProblems}
            timeRemaining={timeRemaining}
            onResume={() => setIsPaused(false)}
            onRestart={() => {
              if (window.confirm('Restart this session?')) {
                setIsPaused(false)
                setCurrentIndex(0)
                setScore(0)
                setStreak(0)
                setBestStreak(0)
                setAnswers([])
                setFeedback(null)
                setAnswer('')
                sessionStartTime.current = Date.now()
              }
            }}
            onEndSession={() => {
              setIsPaused(false)
              onExit()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Answer checking — uses the hybrid math.js checker from answerChecker.ts
 */
