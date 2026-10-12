import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface SessionTimerProps {
  seconds: number
  isPaused: boolean
}

function formatTime(seconds: number): string {
  if (seconds <= 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function SessionTimer({ seconds, isPaused }: SessionTimerProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const isUrgent = seconds <= 10
  const isWarning = seconds <= 30 && seconds > 10
  const isTimeUp = seconds <= 0

  let colorClass = 'text-white'
  if (isTimeUp) colorClass = 'text-[#EF4444]'
  else if (isUrgent) colorClass = 'text-[#E30614]'
  else if (isWarning) colorClass = 'text-[#F59E0B]'

  return (
    <motion.div
      animate={
        isUrgent
          ? { scale: [1, 1.05, 1] }
          : isWarning
            ? { opacity: [1, 0.7, 1] }
            : {}
      }
      transition={
        isUrgent
          ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
          : isWarning
            ? { duration: 1, repeat: Infinity, ease: 'easeInOut' }
            : {}
      }
      className={`font-mono text-[1.5rem] font-medium tabular-nums ${colorClass} ${isPaused ? 'opacity-50' : ''}`}
    >
      {formatTime(seconds)}
    </motion.div>
  )
}

export { formatTime }
