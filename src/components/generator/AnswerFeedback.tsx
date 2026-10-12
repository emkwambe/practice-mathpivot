import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'
import confetti from 'canvas-confetti'

interface AnswerFeedbackProps {
  state: 'correct' | 'incorrect'
  onTryAgain: () => void
  onShowSolution: () => void
}

export default function AnswerFeedback({ state, onTryAgain, onShowSolution }: AnswerFeedbackProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state === 'correct' && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = (rect.left + rect.width / 2) / window.innerWidth
      const y = (rect.top + rect.height / 2) / window.innerHeight

      const defaults = { origin: { x, y }, disableForReducedMotion: true }

      confetti({
        ...defaults,
        particleCount: 60,
        spread: 80,
        startVelocity: 45,
        colors: ['#E30614', '#C9A86C', '#FF1A2E', '#FFD700'],
        ticks: 200,
      })

      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 30,
          spread: 60,
          startVelocity: 30,
          colors: ['#C9A86C', '#FFD700'],
          ticks: 150,
        })
      }, 200)
    }
  }, [state])

  if (state === 'correct') {
    return (
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-full max-w-[600px] mx-auto rounded-xl border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.05)] p-6 text-center"
      >
        <CheckCircle size={32} className="text-[#22C55E] mx-auto mb-3" />
        <h3 className="text-[1.5rem] font-semibold text-[#22C55E] mb-2">Correct!</h3>
        <p className="text-[#8A8A8A] mb-4">Great work. View the full solution below.</p>
        <button
          type="button"
          onClick={onShowSolution}
          className="px-6 py-2.5 rounded-lg bg-[#E30614] text-white text-[0.9375rem] font-semibold hover:bg-[#FF1A2E] transition-colors duration-200"
        >
          Show Solution
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: [0, -8, 8, -4, 4, 0] }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[600px] mx-auto rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.05)] p-6 text-center"
    >
      <XCircle size={32} className="text-[#EF4444] mx-auto mb-3" />
      <h3 className="text-[1.5rem] font-semibold text-[#EF4444] mb-2">Not quite right</h3>
      <p className="text-[#8A8A8A] mb-4">Try again or view a hint.</p>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onTryAgain}
          className="px-6 py-2.5 rounded-lg bg-[#E30614] text-white text-[0.9375rem] font-semibold hover:bg-[#FF1A2E] transition-colors duration-200"
        >
          Try Again
        </button>
        <button
          type="button"
          onClick={onShowSolution}
          className="px-6 py-2.5 rounded-lg border border-[#333333] text-[#8A8A8A] text-[0.9375rem] font-semibold hover:bg-[rgba(255,255,255,0.05)] hover:text-white transition-all duration-200"
        >
          Show Solution
        </button>
      </div>
    </motion.div>
  )
}
