import { motion, AnimatePresence } from 'framer-motion'
import { Flame } from 'lucide-react'

interface StreakIndicatorProps {
  streak: number
  bestStreak?: number
  size?: 'sm' | 'md' | 'lg'
  showFlames?: boolean
}

export default function StreakIndicator({
  streak,
  bestStreak,
  size = 'md',
  showFlames = true,
}: StreakIndicatorProps) {
  const sizeMap = {
    sm: { icon: 14, text: 'text-[0.75rem]', gap: 'gap-1' },
    md: { icon: 16, text: 'text-[0.875rem]', gap: 'gap-1.5' },
    lg: { icon: 24, text: 'text-[1.125rem]', gap: 'gap-2' },
  }
  const s = sizeMap[size]

  // Cap displayed flames at 5 for visual clarity
  const flameCount = Math.min(streak, 5)
  const flames = Array.from({ length: flameCount }, (_, i) => i)

  return (
    <div className="flex items-center gap-2">
      {showFlames && streak > 0 && (
        <div className={`flex items-center ${s.gap}`}>
          <AnimatePresence>
            {flames.map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 15,
                  delay: i * 0.05,
                }}
              >
                <Flame
                  size={s.icon}
                  className="text-[#C9A86C]"
                  fill={i === flameCount - 1 ? '#C9A86C' : 'rgba(201,168,108,0.4)'}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      <motion.span
        key={streak}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 12 }}
        className={`${s.text} font-semibold ${streak > 0 ? 'text-[#C9A86C]' : 'text-[#555555]'}`}
      >
        {streak > 0 ? `Streak: ${streak}` : 'No streak'}
      </motion.span>
      {bestStreak !== undefined && bestStreak > 0 && (
        <span className="text-[0.75rem] text-[#555555]">
          (best: {bestStreak})
        </span>
      )}
    </div>
  )
}
