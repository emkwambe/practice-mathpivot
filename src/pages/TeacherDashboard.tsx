import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Plus, Users, BookOpen, Hash } from 'lucide-react'
import { trpc } from '@/providers/trpc'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')

  const { data: classes, isLoading } = trpc.teacher.getClasses.useQuery()
  const utils = trpc.useUtils()
  const createClass = trpc.teacher.createClass.useMutation({
    onSuccess: () => {
      utils.teacher.getClasses.invalidate()
      setOpen(false)
      setName('')
      setSubject('')
    },
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    createClass.mutate({ name: name.trim(), subject: subject.trim() || undefined })
  }

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
              Teacher Dashboard
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[#8A8A8A] max-w-[560px]"
            >
              Manage your classes, create assignments, and track student progress.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#E30614] hover:bg-[#FF1A2E] text-white border-none">
                  <Plus size={18} />
                  Create Class
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#111111] border-[#1F1F1F] text-white">
                <DialogHeader>
                  <DialogTitle className="text-[#C9A86C]">Create New Class</DialogTitle>
                  <DialogDescription className="text-[#8A8A8A]">
                    Create a class and share the 6-digit join code with your students.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="class-name" className="text-[#8A8A8A]">
                      Class Name <span className="text-[#E30614]">*</span>
                    </Label>
                    <Input
                      id="class-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. AP Calculus BC"
                      required
                      className="bg-[#050505] border-[#1F1F1F] text-white placeholder:text-[#555555] focus-visible:border-[#E30614] focus-visible:ring-[#E30614]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class-subject" className="text-[#8A8A8A]">
                      Subject <span className="text-[#555555]">(optional)</span>
                    </Label>
                    <Input
                      id="class-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Calculus"
                      className="bg-[#050505] border-[#1F1F1F] text-white placeholder:text-[#555555] focus-visible:border-[#E30614] focus-visible:ring-[#E30614]/20"
                    />
                  </div>
                  <DialogFooter className="mt-4">
                    <Button
                      type="submit"
                      disabled={createClass.isPending || !name.trim()}
                      className="bg-[#E30614] hover:bg-[#FF1A2E] text-white border-none disabled:opacity-50"
                    >
                      {createClass.isPending ? 'Creating...' : 'Create Class'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="container-mathgen pt-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-[#111111] border border-[#1F1F1F] animate-pulse" />
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
                <Card
                  className="bg-[#111111] border-[#1F1F1F] hover:border-[#333333] cursor-pointer transition-colors duration-200"
                  onClick={() => navigate(`/teacher/class/${cls.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="text-white text-[1.25rem]">{cls.name}</CardTitle>
                    <CardDescription className="text-[#8A8A8A]">
                      {cls.subject || 'No subject'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-[#8A8A8A]">
                        <Users size={16} className="text-[#C9A86C]" />
                        <span>{cls.studentCount} students</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#8A8A8A]">
                        <BookOpen size={16} className="text-[#C9A86C]" />
                        <span>{cls.assignmentCount} assignments</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-[#1F1F1F]">
                      <Hash size={16} className="text-[#8A8A8A]" />
                      <span className="text-[#555555] text-xs uppercase tracking-wider">Join code</span>
                      <span className="ml-auto font-mono text-[#C9A86C] text-lg tracking-wider">{cls.code}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 border border-dashed border-[#1F1F1F] rounded-xl bg-[#111111]/50">
            <p className="text-[#8A8A8A] mb-4">You haven't created any classes yet.</p>
            <Button
              onClick={() => setOpen(true)}
              className="bg-[#E30614] hover:bg-[#FF1A2E] text-white border-none"
            >
              <Plus size={18} />
              Create Your First Class
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
