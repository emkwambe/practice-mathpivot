import type { Difficulty } from '@/lib/problemGenerator'

interface DifficultySelectorProps {
  difficulty: Difficulty
  onChange?: (d: Difficulty) => void
  interactive?: boolean
}

const difficultyConfig: Record<Difficulty, { color: string; label: string }> = {
  easy: { color: 'bg-[#22C55E]', label: 'Easy' },
  medium: { color: 'bg-[#F59E0B]', label: 'Medium' },
  hard: { color: 'bg-[#E30614]', label: 'Hard' },
}

export default function DifficultySelector({ difficulty, onChange, interactive = false }: DifficultySelectorProps) {
  const diffOrder: Difficulty[] = ['easy', 'medium', 'hard']
  const diffIndex = diffOrder.indexOf(difficulty)

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {diffOrder.map((d, i) => (
          <button
            key={d}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(d)}
            className={`
              w-2.5 h-2.5 rounded-full transition-all duration-200
              ${i <= diffIndex ? difficultyConfig[d].color : 'bg-[#1A1A1A]'}
              ${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'}
            `}
            aria-label={`Difficulty: ${d}`}
          />
        ))}
      </div>
      <span className={`text-xs font-medium uppercase tracking-wider ${interactive ? 'text-[#8A8A8A]' : 'text-[#8A8A8A]'}`}>
        {difficultyConfig[difficulty].label}
      </span>
    </div>
  )
}
