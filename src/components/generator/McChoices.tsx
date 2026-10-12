import { motion } from 'framer-motion'
import MathDisplay from '@/components/MathDisplay'

interface McChoicesProps {
  choices: string[]
  onSelect: (choice: string) => void
  disabled?: boolean
  /** After feedback, highlight the correct/incorrect choice. */
  selected?: string | null
  correctAnswer?: string | null
  /** Per-choice inline SVG (index-aligned); null = text-only choice. */
  svgChoices?: (string | null)[]
}

/** Renders a string as KaTeX when it contains LaTeX markup, else as prose. */
function ChoiceContent({ text }: { text: string }) {
  if (text.includes('\\') || text.includes('^') || text.includes('_{')) {
    return <MathDisplay latex={text} displayMode={false} />
  }
  return <span>{text}</span>
}

export default function McChoices({ choices, onSelect, disabled, selected, correctAnswer, svgChoices }: McChoicesProps) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
      {choices.map((c, i) => {
        const letter = 'ABCD'[i]
        const svg = svgChoices?.[i] ?? null
        const showText = c !== '' && c !== letter
        const isSelected = selected === c
        const isCorrectChoice = correctAnswer != null && c === correctAnswer
        const showState = selected != null && correctAnswer != null
        return (
          <motion.button
            key={`${letter}-${i}`}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
            onClick={() => onSelect(c)}
            disabled={disabled}
            className={`
              flex items-start gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-200
              ${showState && isCorrectChoice
                ? 'border-[#22C55E] bg-[rgba(34,197,94,0.12)] text-white'
                : showState && isSelected && !isCorrectChoice
                  ? 'border-[#E30614] bg-[rgba(227,6,20,0.10)] text-white'
                  : isSelected
                    ? 'border-[#C9A86C] bg-[rgba(201,168,108,0.12)] text-white'
                    : 'border-[#1F1F1F] bg-[#111111] text-[#D4D4D4] hover:border-[#C9A86C] hover:bg-[rgba(201,168,108,0.06)]'
              }
              disabled:opacity-70 disabled:cursor-not-allowed
            `}
          >
            <span
              className={`
                shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold
                ${showState && isCorrectChoice
                  ? 'bg-[#22C55E] text-black'
                  : showState && isSelected && !isCorrectChoice
                    ? 'bg-[#E30614] text-white'
                    : 'bg-[#1F1F1F] text-[#C9A86C]'
                }
              `}
            >
              {letter}
            </span>
            <span className="text-[1rem] leading-snug pt-0.5 break-words min-w-0 flex-1">
              {svg && (
                <span
                  className="block mb-1 text-current"
                  // SVGs are built by our own generators (svg.ts), not user input
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              )}
              {showText && <ChoiceContent text={c} />}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
