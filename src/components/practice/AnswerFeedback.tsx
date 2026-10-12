import { motion } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface AnswerFeedbackProps {
  isCorrect: boolean
  streak: number
  timeTaken: number
  onContinue: () => void
  onShowSolution?: () => void
  onTryAgain?: () => void
}

export default function AnswerFeedback({
  isCorrect,
  streak,
  timeTaken,
  onContinue,
  onShowSolution,
  onTryAgain,
}: AnswerFeedbackProps) {
  useEffect(() => {
    if (isCorrect) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22C55E', '#C9A86C', '#FFFFFF', '#E30614'],
        disableForReducedMotion: true,
      })
    }

    // Auto-continue after 2 seconds for correct answers
    if (isCorrect) {
      const timer = setTimeout(() => {
        onContinue()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isCorrect, onContinue])

  useEffect(() => {
    // Keyboard handler for Enter to continue
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (isCorrect) {
          onContinue()
        } else if (onTryAgain) {
          onTryAgain()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isCorrect, onContinue, onTryAgain])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-30 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(5,5,5,0.7)', backdropFilter: 'blur(4px)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, duration: 0.4 }}
        className="flex flex-col items-center gap-4"
      >
        {isCorrect ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
            >
              <CheckCircle size={64} className="text-[#22C55E]" />
            </motion.div>
            <motion.h3
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-display text-[clamp(1.8rem,3vw,2.8rem)] text-[#22C55E]"
            >
              Correct!
            </motion.h3>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[#8A8A8A]"
            >
              Solved in {Math.round(timeTaken)}s
            </motion.p>
            {streak > 1 && (
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.4 }}
                className="text-[#C9A86C] font-semibold text-sm"
              >
                {streak}x streak!
              </motion.p>
            )}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[0.75rem] text-[#555555] mt-2"
            >
              Auto-advancing...
            </motion.p>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
            >
              <XCircle size={64} className="text-[#EF4444]" />
            </motion.div>
            <motion.h3
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-display text-[clamp(1.8rem,3vw,2.8rem)] text-[#EF4444]"
            >
              Not quite
            </motion.h3>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[0.75rem] text-[#555555]"
            >
              Streak reset
            </motion.p>
            <div className="flex gap-3 mt-4">
              {onTryAgain && (
                <button
                  type="button"
                  onClick={onTryAgain}
                  className="px-6 py-2.5 rounded-lg border border-[#333333] text-white text-sm font-medium hover:bg-[rgba(255,255,255,0.05)] hover:border-white transition-all duration-200"
                >
                  Try Again
                </button>
              )}
              {onShowSolution && (
                <button
                  type="button"
                  onClick={onShowSolution}
                  className="px-6 py-2.5 rounded-lg text-[#8A8A8A] text-sm font-medium hover:text-white transition-colors duration-200"
                >
                  Show Solution
                </button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
