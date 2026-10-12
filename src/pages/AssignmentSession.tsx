import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { trpc } from '@/providers/trpc'
import { Button } from '@/components/ui/button'
import { generateProblem } from '@/lib/problemGenerator'
import type { Subject, Technique, Difficulty } from '@/lib/problemGenerator'
import ActiveSession from '@/components/practice/ActiveSession'

export default function AssignmentSession() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const assignmentId = id ? Number(id) : NaN

  const { data: assignment, isLoading, error } = trpc.teacher.getAssignment.useQuery(
    { id: assignmentId },
    { enabled: !Number.isNaN(assignmentId) }
  )

  const saveProgress = trpc.teacher.saveAssignmentProgress.useMutation({
    onSuccess: () => {
      navigate('/student/classes')
    },
  })

  const problems = useMemo(() => {
    if (!assignment) return []
    const subject = assignment.subject as Subject
    const technique = assignment.technique as Technique
    const difficulty = assignment.difficulty as Difficulty
    const count = assignment.problemCount

    return Array.from({ length: count }, (_, i) =>
      generateProblem(subject, technique, difficulty, i + Date.now())
    )
  }, [assignment])

  const handleComplete = (results: {
    answers: { problemId: string; correct: boolean; timeSpent: number; technique: string }[]
    score: number
    bestStreak: number
    totalTime: number
  }) => {
    saveProgress.mutate({
      assignmentId,
      problemsCompleted: results.answers.length,
      correctCount: results.score,
      timeSpentSeconds: Math.round(results.totalTime),
    })
  }

  const handleExit = () => {
    navigate('/student/classes')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-[#8A8A8A]">Loading assignment...</div>
      </div>
    )
  }

  if (error || !assignment || Number.isNaN(assignmentId)) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6">
        <AlertCircle size={48} className="text-[#E30614] mb-4" />
        <h1 className="text-2xl text-white mb-2">Assignment not found</h1>
        <p className="text-[#8A8A8A] mb-6 text-center max-w-md">
          {error?.message ?? "The assignment you're looking for doesn't exist or you don't have access."}
        </p>
        <Button onClick={() => navigate('/student/classes')} className="bg-[#E30614] hover:bg-[#FF1A2E] text-white border-none">
          <ArrowLeft size={16} className="mr-1.5" />
          Back to My Classes
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      key={assignmentId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-[#050505]"
    >
      <ActiveSession
        problems={problems}
        timePerProblem={0}
        onComplete={handleComplete}
        onExit={handleExit}
      />
    </motion.div>
  )
}
