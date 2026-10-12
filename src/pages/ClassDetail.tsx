import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Download, Users, Target, TrendingDown, Calendar, Hash, Clock, AlertCircle } from 'lucide-react'
import { trpc } from '@/providers/trpc'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getTechniquesForSubject } from '@/lib/problemGenerator'
import type { Subject, Difficulty } from '@/lib/problemGenerator'
import { SUBJECT_NAMES } from '@/lib/courses'

const SUBJECTS: Subject[] = ['integration', 'differentiation', 'limits', 'applications-derivatives', 'applications-integration', 'differential-equations', 'sequences-series', 'math1-eoc', 'math3-eoc', 'math6-eog', 'math7-eog', 'math8-eog']
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export default function ClassDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const classId = id ? Number(id) : NaN

  const [createOpen, setCreateOpen] = useState(false)
  const [subject, setSubject] = useState<Subject>('integration')
  const [technique, setTechnique] = useState('basic')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [problemCount, setProblemCount] = useState(10)
  const [dueDate, setDueDate] = useState('')

  const { data: classes, isLoading: classesLoading } = trpc.teacher.getClasses.useQuery()
  const { data: assignments, isLoading: assignmentsLoading } = trpc.teacher.getAssignments.useQuery(
    { classId },
    { enabled: !Number.isNaN(classId) }
  )
  const { data: analytics, isLoading: analyticsLoading } = trpc.teacher.getClassAnalytics.useQuery(
    { classId },
    { enabled: !Number.isNaN(classId) }
  )

  const utils = trpc.useUtils()
  const createAssignment = trpc.teacher.createAssignment.useMutation({
    onSuccess: () => {
      utils.teacher.getAssignments.invalidate({ classId })
      setCreateOpen(false)
      resetForm()
    },
  })

  const cls = useMemo(() => classes?.find((c) => c.id === classId), [classes, classId])

  const techniques = useMemo(() => getTechniquesForSubject(subject), [subject])

  const resetForm = () => {
    setSubject('integration')
    setTechnique('basic')
    setDifficulty('medium')
    setProblemCount(10)
    setDueDate('')
  }

  const handleSubjectChange = (value: Subject) => {
    setSubject(value)
    const techs = getTechniquesForSubject(value)
    setTechnique(techs[0]?.id ?? '')
  }

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!technique) return
    createAssignment.mutate({
      classId,
      subject,
      technique,
      difficulty,
      problemCount,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    })
  }

  const handleExportCSV = async () => {
    const csv = await utils.client.teacher.exportCSV.query({ classId })
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${cls?.name ?? 'class'}-export.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (classesLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-[#8A8A8A]">Loading class...</div>
      </div>
    )
  }

  if (!cls || Number.isNaN(classId)) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6">
        <AlertCircle size={48} className="text-[#E30614] mb-4" />
        <h1 className="text-2xl text-white mb-2">Class not found</h1>
        <p className="text-[#8A8A8A] mb-6">The class you're looking for doesn't exist or you don't have access.</p>
        <Button onClick={() => navigate('/teacher')} className="bg-[#E30614] hover:bg-[#FF1A2E] text-white border-none">
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] pb-16">
      {/* Header */}
      <div className="w-full border-b border-[#1F1F1F] pt-10 pb-8 px-6">
        <div className="container-mathgen">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => navigate('/teacher')}
            className="flex items-center gap-1.5 text-[#8A8A8A] hover:text-white transition-colors mb-4 text-sm"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </motion.button>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="font-display text-[clamp(1.8rem,3vw,2.8rem)] text-white mb-2"
              >
                {cls.name}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-[#8A8A8A]"
              >
                {cls.subject || 'No subject'} · {cls.studentCount} students · {cls.assignmentCount} assignments
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <Card className="bg-[#111111] border-[#1F1F1F] flex-row items-center gap-4 px-5 py-3">
                <div className="flex items-center gap-2">
                  <Hash size={18} className="text-[#C9A86C]" />
                  <span className="text-[#8A8A8A] text-sm">Join code</span>
                </div>
                <span className="font-mono text-2xl text-[#C9A86C] tracking-[0.15em]">{cls.code}</span>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container-mathgen pt-10 space-y-10">
        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-3"
        >
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#E30614] hover:bg-[#FF1A2E] text-white border-none">
                <Plus size={18} />
                Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#111111] border-[#1F1F1F] text-white max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-[#C9A86C]">Create Assignment</DialogTitle>
                <DialogDescription className="text-[#8A8A8A]">
                  Assign practice problems to your class.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateAssignment} className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#8A8A8A]">Subject</Label>
                    <Select value={subject} onValueChange={(v) => handleSubjectChange(v as Subject)}>
                      <SelectTrigger className="bg-[#050505] border-[#1F1F1F] text-white w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111111] border-[#1F1F1F] text-white">
                        {SUBJECTS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {SUBJECT_NAMES[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#8A8A8A]">Technique</Label>
                    <Select value={technique} onValueChange={setTechnique}>
                      <SelectTrigger className="bg-[#050505] border-[#1F1F1F] text-white w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111111] border-[#1F1F1F] text-white">
                        {techniques.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#8A8A8A]">Difficulty</Label>
                    <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                      <SelectTrigger className="bg-[#050505] border-[#1F1F1F] text-white w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111111] border-[#1F1F1F] text-white">
                        {DIFFICULTIES.map((d) => (
                          <SelectItem key={d} value={d} className="capitalize">
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="problem-count" className="text-[#8A8A8A]">
                      Problem Count
                    </Label>
                    <Input
                      id="problem-count"
                      type="number"
                      min={1}
                      max={100}
                      value={problemCount}
                      onChange={(e) => setProblemCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                      className="bg-[#050505] border-[#1F1F1F] text-white focus-visible:border-[#E30614] focus-visible:ring-[#E30614]/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date" className="text-[#8A8A8A]">
                    Due Date <span className="text-[#555555]">(optional)</span>
                  </Label>
                  <Input
                    id="due-date"
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-[#050505] border-[#1F1F1F] text-white focus-visible:border-[#E30614] focus-visible:ring-[#E30614]/20"
                  />
                </div>
                <DialogFooter className="mt-4">
                  <Button
                    type="submit"
                    disabled={createAssignment.isPending || !technique}
                    className="bg-[#E30614] hover:bg-[#FF1A2E] text-white border-none disabled:opacity-50"
                  >
                    {createAssignment.isPending ? 'Creating...' : 'Create Assignment'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="border-[#1F1F1F] bg-[#111111] text-white hover:bg-[#1A1A1A] hover:text-white"
          >
            <Download size={18} />
            Export CSV
          </Button>
        </motion.div>

        {/* Assignments */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-[#C9A86C] text-[1.25rem] font-semibold mb-4 flex items-center gap-2">
            <Target size={20} />
            Assignments
          </h2>
          {assignmentsLoading ? (
            <div className="h-32 rounded-xl bg-[#111111] border border-[#1F1F1F] animate-pulse" />
          ) : assignments && assignments.length > 0 ? (
            <Card className="bg-[#111111] border-[#1F1F1F]">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#1F1F1F] hover:bg-transparent">
                    <TableHead className="text-[#8A8A8A]">Subject</TableHead>
                    <TableHead className="text-[#8A8A8A]">Technique</TableHead>
                    <TableHead className="text-[#8A8A8A]">Difficulty</TableHead>
                    <TableHead className="text-[#8A8A8A]">Problems</TableHead>
                    <TableHead className="text-[#8A8A8A]">Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((a) => (
                    <TableRow key={a.id} className="border-[#1F1F1F] hover:bg-[#1A1A1A]">
                      <TableCell className="capitalize text-white">{a.subject}</TableCell>
                      <TableCell className="text-white">{a.technique}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`capitalize ${
                            a.difficulty === 'easy'
                              ? 'border-[#22C55E] text-[#22C55E]'
                              : a.difficulty === 'medium'
                                ? 'border-[#F59E0B] text-[#F59E0B]'
                                : 'border-[#E30614] text-[#E30614]'
                          }`}
                        >
                          {a.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">{a.problemCount}</TableCell>
                      <TableCell className="text-[#8A8A8A] flex items-center gap-1.5">
                        <Calendar size={14} />
                        {formatDateTime(a.dueDate)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <div className="text-center py-12 border border-dashed border-[#1F1F1F] rounded-xl bg-[#111111]/50">
              <p className="text-[#8A8A8A]">No assignments yet.</p>
            </div>
          )}
        </motion.section>

        {/* Analytics */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-[#C9A86C] text-[1.25rem] font-semibold mb-4 flex items-center gap-2">
            <TrendingDown size={20} />
            Class Analytics
          </h2>
          {analyticsLoading ? (
            <div className="h-48 rounded-xl bg-[#111111] border border-[#1F1F1F] animate-pulse" />
          ) : analytics ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-[#111111] border-[#1F1F1F]">
                <CardHeader>
                  <CardDescription className="text-[#8A8A8A]">Class Average Score</CardDescription>
                  <CardTitle className="text-3xl text-white">{analytics.avgScore}%</CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-[#111111] border-[#1F1F1F] lg:col-span-2">
                <CardHeader>
                  <CardDescription className="text-[#8A8A8A]">Weakest Techniques</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.weakAreas.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {analytics.weakAreas.map((area) => (
                        <Badge
                          key={area.technique}
                          variant="outline"
                          className="border-[#E30614] text-[#E30614]"
                        >
                          {area.technique}: {area.accuracy}%
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#8A8A8A]">No data yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </motion.section>

        {/* Roster */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-[#C9A86C] text-[1.25rem] font-semibold mb-4 flex items-center gap-2">
            <Users size={20} />
            Student Roster
          </h2>
          {analyticsLoading ? (
            <div className="h-48 rounded-xl bg-[#111111] border border-[#1F1F1F] animate-pulse" />
          ) : analytics && analytics.students.length > 0 ? (
            <Card className="bg-[#111111] border-[#1F1F1F]">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#1F1F1F] hover:bg-transparent">
                    <TableHead className="text-[#8A8A8A]">Student</TableHead>
                    <TableHead className="text-[#8A8A8A]">Problems Completed</TableHead>
                    <TableHead className="text-[#8A8A8A]">Correct</TableHead>
                    <TableHead className="text-[#8A8A8A]">Accuracy</TableHead>
                    <TableHead className="text-[#8A8A8A]">Time Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.students.map((s) => (
                    <TableRow key={s.userId} className="border-[#1F1F1F] hover:bg-[#1A1A1A]">
                      <TableCell className="text-white font-mono text-xs">{s.userId}</TableCell>
                      <TableCell className="text-white">{s.problemsCompleted}</TableCell>
                      <TableCell className="text-white">{s.correctCount}</TableCell>
                      <TableCell className="text-white">{s.accuracy}%</TableCell>
                      <TableCell className="text-[#8A8A8A] flex items-center gap-1.5">
                        <Clock size={14} />
                        {s.timeSpent}s
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <div className="text-center py-12 border border-dashed border-[#1F1F1F] rounded-xl bg-[#111111]/50">
              <p className="text-[#8A8A8A]">No students enrolled yet.</p>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  )
}
