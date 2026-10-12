import { useCallback } from 'react'
import {
  Zap,
  ArrowRight,
  GitBranch,
  RefreshCw,
  Triangle,
  Split,
  Infinity,
  Shuffle,
  Target,
  TrendingUp,
  Activity,
  LineChart,
  Equal,
  Minus,
  MoveRight,
  DollarSign,
  Layers,
  Rotate3d,
  Spline,
  Globe,
  Weight,
  Crosshair,
  Percent,
  Repeat,
  Puzzle,
  Waves,
  Sigma,
  Hash,
  ListOrdered,
  AlertTriangle,
  Divide,
  Sprout,
  Scale,
  ArrowLeftRight,
  Superscript,
} from 'lucide-react'
import type { Subject, Technique } from '@/lib/problemGenerator'
import { getTechniquesForSubject } from '@/lib/problemGenerator'

const iconMap: Record<string, React.ElementType> = {
  Zap, ArrowRight, GitBranch, RefreshCw, Triangle, Split, Infinity, Shuffle, Target,
  TrendingUp, Activity, LineChart, Equal, Minus, MoveRight, DollarSign,
  Layers, Rotate3d, Spline, Globe, Weight, Crosshair, Percent,
  Repeat, Puzzle, Waves, Sigma,
  Hash, ListOrdered, AlertTriangle, Divide, Sprout, Scale, ArrowLeftRight, Superscript,
}

interface TechniqueSelectorProps {
  subject: Subject
  selected: Technique
  onChange: (t: Technique) => void
}

export default function TechniqueSelector({ subject, selected, onChange }: TechniqueSelectorProps) {
  const techniques = getTechniquesForSubject(subject)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onChange(techniques[index].id as Technique)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        const next = (index + 1) % techniques.length
        document.getElementById(`tech-btn-${next}`)?.focus()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        const prev = (index - 1 + techniques.length) % techniques.length
        document.getElementById(`tech-btn-${prev}`)?.focus()
      }
    },
    [onChange, techniques],
  )

  return (
    <div className="grid grid-cols-2 gap-2">
      {techniques.map((tech, index) => {
        const isSelected = selected === tech.id
        const Icon = iconMap[tech.icon] || Zap
        return (
          <button
            key={tech.id}
            id={`tech-btn-${index}`}
            type="button"
            onClick={() => onChange(tech.id as Technique)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`
              flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left text-[0.8125rem] font-medium
              transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E30614] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]
              ${
                isSelected
                  ? 'border-[#E30614] bg-[rgba(227,6,20,0.08)] text-white'
                  : 'border-[#1F1F1F] text-[#8A8A8A] hover:border-[#333333] hover:text-white'
              }
            `}
          >
            <Icon size={14} className={isSelected ? 'text-[#E30614]' : 'text-[#555555]'} />
            <span className="truncate">{tech.name}</span>
          </button>
        )
      })}
    </div>
  )
}
