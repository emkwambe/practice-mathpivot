import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Clock, Target } from 'lucide-react'
import type { Subject, Technique, Difficulty } from '@/lib/problemGenerator'
import { getTechniquesForSubject } from '@/lib/problemGenerator'
import TechniqueBadge from '@/components/TechniqueBadge'
import CourseSubjectPicker from '@/components/CourseSubjectPicker'
import { MIXED_TECHNIQUE } from '@/lib/courses'

const problemCounts = [5, 10, 20, 50]
const timeLimits = [
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
  { label: '90s', value: 90 },
  { label: '120s', value: 120 },
  { label: 'Unlimited', value: 0 },
]

interface SetupScreenProps {
  onStart: (config: {
    subject: Subject
    techniques: Technique[]
    difficulty: Difficulty
    problemCount: number
    timePerProblem: number
  }) => void
}

export default function SetupScreen({ onStart }: SetupScreenProps) {
  const [subject, setSubject] = useState<Subject>('integration')
  const [selectedTechniques, setSelectedTechniques] = useState<Technique[]>(['mixed'])
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [problemCount, setProblemCount] = useState(10)
  const [timePerProblem, setTimePerProblem] = useState(60)

  const allTechniques = getTechniquesForSubject(subject)
  const mixedKey = MIXED_TECHNIQUE[subject]

  const toggleTechnique = (tech: Technique) => {
    if (tech === mixedKey) {
      setSelectedTechniques([mixedKey])
      return
    }

    setSelectedTechniques((prev) => {
      // Remove mixed if present
      const withoutMixed = prev.filter((t) => t !== mixedKey)

      if (withoutMixed.includes(tech)) {
        const updated = withoutMixed.filter((t) => t !== tech)
        // If nothing selected, default to mixed
        return updated.length === 0 ? [mixedKey] : updated
      }

      return [...withoutMixed, tech]
    })
  }

  const isAllSelected = selectedTechniques.includes(mixedKey)

  const handleSubjectChange = (newSubject: Subject) => {
    setSubject(newSubject)
    setSelectedTechniques([MIXED_TECHNIQUE[newSubject]])
  }

  const handleStart = () => {
    onStart({
      subject,
      techniques: selectedTechniques,
      difficulty,
      problemCount,
      timePerProblem,
    })
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  }

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  }

  return (
    <div className="w-full max-w-[720px] mx-auto px-6 py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="rounded-xl border border-[#1F1F1F] p-8 flex flex-col gap-8"
        style={{ background: 'linear-gradient(180deg, rgba(26,26,26,0.8) 0%, rgba(17,17,17,0.6) 100%)' }}
      >
        <motion.div variants={staggerVariants} initial="hidden" animate="visible">
          {/* Course & Subject Selection */}
          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="text-[1.25rem] font-semibold text-white mb-4">
              Course
            </h3>
            <CourseSubjectPicker
              subject={subject}
              onSubjectChange={handleSubjectChange}
              accent="gold"
              showLabels={false}
            />
          </motion.div>

          {/* Technique Selection */}
          <motion.div variants={itemVariants} className="mb-8">
            <h3 className="text-[1.25rem] font-semibold text-white mb-4">
              Practice Technique
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {/* All Techniques option */}
              <button
                type="button"
                onClick={() => toggleTechnique(mixedKey)}
                className={`
                  flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200
                  ${isAllSelected
                    ? 'border-[#C9A86C] bg-[rgba(201,168,108,0.1)] text-[#C9A86C]'
                    : 'border-[#1F1F1F] bg-[#111111] text-[#8A8A8A] hover:border-[#333333] hover:text-white'
                  }
                `}
              >
                <Target size={14} />
                All Techniques
              </button>
              {allTechniques.map((techInfo) => {
                const tid = techInfo.id
                const tSelected = selectedTechniques.includes(tid as Technique) && !isAllSelected
                return (
                  <button
                    key={tid}
                    type="button"
                    onClick={() => toggleTechnique(tid as Technique)}
                    className={`
                      flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200
                      ${tSelected
                        ? 'border-[#E30614] bg-[rgba(227,6,20,0.1)] text-[#E30614]'
                        : 'border-[#1F1F1F] bg-[#111111] text-[#8A8A8A] hover:border-[#333333] hover:text-white'
                      }
                    `}
                  >
                    
                    <TechniqueBadge technique={tid as Technique} />
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Difficulty Selection */}
          <motion.div variants={itemVariants} className="mb-8">
            <h3 className="text-[1.25rem] font-semibold text-white mb-4">
              Difficulty
            </h3>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium capitalize transition-all duration-200
                    ${difficulty === d
                      ? d === 'easy'
                        ? 'border-[#22C55E] bg-[rgba(34,197,94,0.1)] text-[#22C55E]'
                        : d === 'medium'
                          ? 'border-[#F59E0B] bg-[rgba(245,158,11,0.1)] text-[#F59E0B]'
                          : 'border-[#E30614] bg-[rgba(227,6,20,0.1)] text-[#E30614]'
                      : 'border-[#1F1F1F] bg-[#111111] text-[#8A8A8A] hover:border-[#333333] hover:text-white'
                    }
                  `}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      d === 'easy' ? 'bg-[#22C55E]' : d === 'medium' ? 'bg-[#F59E0B]' : 'bg-[#E30614]'
                    }`}
                  />
                  {d}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Session Settings */}
          <motion.div variants={itemVariants} className="mb-8">
            <h3 className="text-[1.25rem] font-semibold text-white mb-4">
              Session Settings
            </h3>
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Time per problem */}
              <div className="flex-1">
                <label className="flex items-center gap-1.5 text-sm text-[#8A8A8A] mb-2">
                  <Clock size={14} />
                  Time per Problem
                </label>
                <div className="flex gap-1">
                  {timeLimits.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTimePerProblem(t.value)}
                      className={`
                        flex-1 px-2 py-2 rounded-md border text-xs font-medium transition-all duration-200
                        ${timePerProblem === t.value
                          ? 'border-[#E30614] bg-[#E30614] text-white'
                          : 'border-[#1F1F1F] bg-[#111111] text-[#8A8A8A] hover:border-[#333333] hover:text-white'
                        }
                      `}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Problem count */}
              <div className="flex-1">
                <label className="flex items-center gap-1.5 text-sm text-[#8A8A8A] mb-2">
                  <Zap size={14} />
                  Number of Problems
                </label>
                <div className="flex gap-1">
                  {problemCounts.map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setProblemCount(count)}
                      className={`
                        flex-1 px-2 py-2 rounded-md border text-xs font-medium transition-all duration-200
                        ${problemCount === count
                          ? 'border-[#E30614] bg-[#E30614] text-white'
                          : 'border-[#1F1F1F] bg-[#111111] text-[#8A8A8A] hover:border-[#333333] hover:text-white'
                        }
                      `}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Start Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              type="button"
              onClick={handleStart}
              className="w-full flex items-center justify-center gap-2.5 py-5 rounded-lg bg-[#E30614] text-white text-[1.25rem] font-semibold hover:bg-[#FF1A2E] hover:scale-[1.01] active:scale-[0.98] transition-all duration-200"
              animate={{
                boxShadow: [
                  '0 0 0px rgba(227,6,20,0)',
                  '0 0 30px rgba(227,6,20,0.3)',
                  '0 0 0px rgba(227,6,20,0)',
                ],
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <Zap size={22} />
              Start Practice Session
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
