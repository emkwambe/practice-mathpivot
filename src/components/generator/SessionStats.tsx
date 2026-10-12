import { CheckCircle, XCircle, Flame, Target } from 'lucide-react'

interface SessionStatsProps {
  correct: number
  attempted: number
  streak: number
}

export default function SessionStats({ correct, attempted, streak }: SessionStatsProps) {
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0

  const stats = [
    { icon: CheckCircle, value: correct, label: 'Correct', key: 'correct' },
    { icon: XCircle, value: attempted, label: 'Attempted', key: 'attempted' },
    { icon: Flame, value: streak, label: 'Current Streak', key: 'streak' },
    { icon: Target, value: `${accuracy}%`, label: 'Accuracy', key: 'accuracy' },
  ]

  return (
    <div className="flex items-center gap-6 flex-wrap">
      {stats.map((stat) => (
        <div key={stat.key} className="flex items-center gap-2">
          <stat.icon size={16} className="text-[#555555] shrink-0" />
          <span className="text-[0.875rem] text-white font-medium">{stat.value}</span>
          <span className="text-[0.875rem] text-[#8A8A8A]">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
