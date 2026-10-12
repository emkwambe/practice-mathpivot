import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react'
import type { Problem } from '@/lib/problemGenerator'

export interface HistoryEntry {
  problemId: string
  technique: string
  question: string
  correct: boolean | null
  timestamp: number
}

interface ProblemHistoryProps {
  entries: HistoryEntry[]
  onSelect: (problem: Problem) => void
  onClear: () => void
}

const displayNames: Record<string, string> = {
  basic: 'Basic',
  'u-substitution': 'U-Sub',
  parts: 'Parts',
  trigonometric: 'Trig',
  'trig-substitution': 'Trig Sub',
  'partial-fractions': 'Partial Frac',
  improper: 'Improper',
  mixed: 'Mixed',
}

export default function ProblemHistory({ entries, onClear }: ProblemHistoryProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  const handleClear = () => {
    if (confirmClear) {
      onClear()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
    }
  }

  return (
    <div className="rounded-xl border border-[#1F1F1F] bg-[#111111]">
      {/* Header */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#1A1A1A] transition-colors duration-200 rounded-t-xl"
      >
        <h4 className="text-[1.25rem] font-semibold text-white">Session History</h4>
        {collapsed ? (
          <ChevronRight size={18} className="text-[#8A8A8A]" />
        ) : (
          <ChevronDown size={18} className="text-[#8A8A8A]" />
        )}
      </button>

      {/* List */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3">
              {entries.length === 0 ? (
                <p className="text-[#555555] text-[0.875rem] py-4 text-center">
                  No problems attempted yet
                </p>
              ) : (
                <>
                  <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1">
                    {entries.map((entry, index) => (
                      <motion.div
                        key={`${entry.problemId}-${entry.timestamp}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index === entries.length - 1 ? 0 : index * 0.05,
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1A1A1A] transition-colors duration-200"
                        title={entry.question}
                      >
                        {/* Status dot */}
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            entry.correct === true
                              ? 'bg-[#22C55E]'
                              : entry.correct === false
                                ? 'bg-[#EF4444]'
                                : 'bg-[#555555]'
                          }`}
                        />
                        {/* Technique name */}
                        <span className="text-[0.875rem] text-[#8A8A8A] truncate flex-1">
                          {displayNames[entry.technique] || entry.technique}
                        </span>
                        {/* Time */}
                        <span className="text-[0.75rem] text-[#555555] shrink-0">
                          {new Date(entry.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Clear button */}
                  <button
                    type="button"
                    onClick={handleClear}
                    className="mt-3 flex items-center gap-1.5 text-[0.75rem] text-[#555555] hover:text-[#EF4444] transition-colors duration-200 mx-auto"
                  >
                    <Trash2 size={12} />
                    {confirmClear ? 'Are you sure?' : 'Clear Session'}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
