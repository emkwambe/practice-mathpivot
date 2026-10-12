import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Pause, Play, RefreshCw, X } from 'lucide-react'
import { formatTime } from './SessionTimer'

interface PauseOverlayProps {
  currentProblem: number
  totalProblems: number
  timeRemaining: number
  onResume: () => void
  onRestart: () => void
  onEndSession: () => void
}

export default function PauseOverlay({
  currentProblem,
  totalProblems,
  timeRemaining,
  onResume,
  onRestart,
  onEndSession,
}: PauseOverlayProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault()
        onResume()
      }
    },
    [onResume]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="w-full max-w-[400px] mx-4 rounded-2xl bg-[#111111] p-8 flex flex-col items-center"
      >
        <Pause size={32} className="text-[#555555] mb-3" />
        <h2 className="font-display text-[clamp(1.8rem,3vw,2.8rem)] text-white mb-2">
          Paused
        </h2>
        <p className="text-[#8A8A8A] text-center mb-1">
          Problem {currentProblem} of {totalProblems}
        </p>
        <p className="text-white font-mono mb-8">
          Time remaining: {formatTime(timeRemaining)}
        </p>

        <div className="w-full flex flex-col gap-3">
          <button
            type="button"
            autoFocus
            onClick={onResume}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#E30614] text-white text-[0.9375rem] font-semibold hover:bg-[#FF1A2E] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Play size={18} />
            Resume
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-[#333333] text-white text-[0.9375rem] font-medium hover:bg-[rgba(255,255,255,0.05)] hover:border-white transition-all duration-200"
          >
            <RefreshCw size={18} />
            Restart Session
          </button>
          <button
            type="button"
            onClick={onEndSession}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-[#8A8A8A] text-[0.9375rem] font-medium hover:text-white transition-colors duration-200"
          >
            <X size={18} />
            End Session
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
