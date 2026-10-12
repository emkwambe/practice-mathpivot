import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Plus, Hash, BookOpen, Calendar, Clock, AlertCircle } from 'lucide-react'
import { trpc } from '@/providers/trpc'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type StudentAssignment = {
  id: number
  classId: number
  subject: string
  technique: string
  difficulty: string
  problemCount: number
  dueDate: Date | null
  createdAt: Date | null
  className: string
  studentProgress: { problemsCompleted: number } | null
}

function formatDueDate(date: string | Date | null | undefined): string {
  if (!date) return 'No due date'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function isPending(progress: { problemsCompleted: number } | null | undefined, problemCount: number): boolean {
  if (!progress) return true
  return progress.problemsCompleted < problemCount
}

export default function StudentClasses() {
  const navigate = useNavigate()
  const [joinOpen, setJoinOpen] = useState(false)
  const [code, setCode] = useState('')
  const [joinError, setJoinError] = useState('')

  const { data: classes, isLoading: classesLoading } = trpc.teacher.getMyClasses.useQuery()
  const { data: rawAssignments, isLoading: assignmentsLoading } = trpc.teacher.getAssignments.useQuery()
  const assignments = rawAssignments as StudentAssignment[] | undefined

  const utils = trpc.useUtils()
  const joinClass = trpc.teacher.joinClass.useMutation({
    onSuccess: () => {
      utils.teacher.getMyClasses.invalidate()
      utils.teacher.getAssignments.invalidate()
      setJoinOpen(false)
      setCode('')
      setJoinError('')
    },
    onError: (err) => {
      setJoinError(err.message || 'Could not join class. Please check the code and try again.')
    },
  })

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    setJoinError('')
    if (!/^\d{6}$/.test(code)) {
      setJoinError('Please enter a valid 6-digit code.')
      return
    }
    joinClass.mutate({ code })
  }

  const pendingAssignments = assignments?.filter((a) => isPending(a.studentProgress, a.problemCount)) ?? []

  return (
    <div className="min-h-screen bg-[#050505] pb-16">
      {/* Header */}
      <div className="w-full border-b border-[#1F1F1F] pt-12 pb-8 px-6">
        <div className="container-mathgen flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="font-display text-[clamp(1.8rem,3vw,2.8rem)] text-white mb-2"
            >
              My Classes
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[#8A8A8A] max-w-[560px]"
            >
              View your enrolled classes and tackle pending assignments.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#E30614] hover:bg-[#FF1A2E] text-white border-none">
                  <Plus size={18} />
                  Join Class
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#111111] border-[#1F1F1F] text-white">
                <DialogHeader>
                  <DialogTitle className="text-[#C9A86C]">Join a Class</DialogTitle>
                  <DialogDescription className="text-[#8A8A8A]">
                    Enter the 6-digit join code from your teacher.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleJoin} className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="join-code" className="text-[#8A8A8A]">
                      Join Code
                    </Label>
                    <Input
                      id="join-code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      inputMode="numeric"
                      className="bg-[#050505] border-[#1F1F1F] text-white placeholder:text-[#555555] focus-visible:border-[#E30614] focus-visible:ring-[#E30614]/20 font-mono text-center text-2xl tracking-[0.3em] py-6"
                    />
                  </div>
                  {joinError && (
                    <p className="text-sm text-[#EF4444] flex items-center gap-1.5">
                      <AlertCircle size={14} />
                      {joinError}
                    </p>
                  )}
                  <DialogFooter className="mt-4">
                    <Button
                      type="submit"
                      disabled={joinClass.isPending || code.length !== 6}
                      className="bg-[#E30614] hover:bg-[#FF1A2E] text-white border-none disabled:opacity-50"
                    >
                      {joinClass.isPending ? 'Joining...' : 'Join Class'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </div>

      <div className="container-mathgen pt-10 space-y-10">
        {/* Enrolled Classes */}
        <section>
          <h2 className="text-[#C9A86C] text-[1.25rem] font-semibold mb-4 flex items-center gap-2">
            <BookOpen size={20} />
            Enrolled Classes
          </h2>
          {classesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-36 rounded-xl bg-[#111111] border border-[#1F1F1F] animate-pulse" />
              ))}
            </div>
          ) : classes && classes.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {classes.map((cls) => (
                <motion.div
                  key={cls.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-[#111111] border-[#1F1F1F] hover:border-[#333333] transition-colors duration-200 h-full">
                    <CardHeader>
                      <CardTitle className="text-white text-[1.25rem]">{cls.name}</CardTitle>
                      <CardDescription className="text-[#8A8A8A]">
                        {cls.subject || 'No subject'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-[#8A8A8A]">
                        <Hash size={16} className="text-[#C9A86C]" />
                        <span className="font-mono text-white tracking-wider">{cls.code}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#8A8A8A]">
                        <Calendar size={16} className="text-[#C9A86C]" />
                        Joined {formatDueDate(cls.joinedAt)}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 border border-dashed border-[#1F1F1F] rounded-xl bg-[#111111]/50">
              <p className="text-[#8A8A8A] mb-4">You haven't joined any classes yet.</p>
              <Button
                onClick={() => setJoinOpen(true)}
                className="bg-[#E30614] hover:bg-[#FF1A2E] text-white border-none"
              >
                <Plus size={18} />
                Join Your First Class
              </Button>
            </div>
          )}
        </section>

        {/* Pending Assignments */}
        <section>
          <h2 className="text-[#C9A86C] text-[1.25rem] font-semibold mb-4 flex items-center gap-2">
            <Clock size={20} />
            Pending Assignments
          </h2>
          {assignmentsLoading ? (
            <div className="h-32 rounded-xl bg-[#111111] border border-[#1F1F1F] animate-pulse" />
          ) : pendingAssignments.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {pendingAssignments.map((a) => (
                <motion.div
                  key={a.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className="bg-[#111111] border-[#1F1F1F] hover:border-[#333333] cursor-pointer transition-colors duration-200 h-full"
                    onClick={() => navigate(`/student/assignment/${a.id}`)}
                  >
                    <CardHeader>
                      <CardDescription className="text-[#8A8A8A]">{a.className}</CardDescription>
                      <CardTitle className="text-white text-[1.1rem]">
                        {a.subject} · {a.technique}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-[#8A8A8A]">
                        <BookOpen size={16} className="text-[#C9A86C]" />
                        {a.problemCount} problems · {a.difficulty}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#8A8A8A]">
                        <Calendar size={16} className="text-[#C9A86C]" />
                        Due {formatDueDate(a.dueDate)}
                      </div>
                      {a.studentProgress && (
                        <div className="text-sm text-[#8A8A8A]">
                          Progress:{' '}
                          <span className="text-white">
                            {a.studentProgress.problemsCompleted} / {a.problemCount}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 border border-dashed border-[#1F1F1F] rounded-xl bg-[#111111]/50">
              <p className="text-[#8A8A8A]">No pending assignments. You're all caught up!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
