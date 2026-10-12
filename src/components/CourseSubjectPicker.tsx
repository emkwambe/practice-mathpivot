// Shared course + subject picker: a course dropdown (Calculus / Math 1 EOC / …)
// with the course's subjects as pills beneath. Single-subject courses
// auto-select their subject and hide the redundant pill row.

import { COURSES, SUBJECT_LABELS, courseForSubject } from '@/lib/courses'
import type { Subject } from '@/lib/problemGenerator'

interface CourseSubjectPickerProps {
  subject: Subject
  onSubjectChange: (subject: Subject) => void
  /** red = Generator/Worksheets accent, gold = Practice setup accent */
  accent?: 'red' | 'gold'
  /** show the "Course" / "Subject" labels above each control */
  showLabels?: boolean
}

export default function CourseSubjectPicker({
  subject,
  onSubjectChange,
  accent = 'red',
  showLabels = true,
}: CourseSubjectPickerProps) {
  const course = courseForSubject(subject)

  const activeCls =
    accent === 'gold'
      ? 'border-[#C9A86C] bg-[rgba(201,168,108,0.1)] text-[#C9A86C]'
      : 'border-[#E30614] bg-[rgba(227,6,20,0.08)] text-white'
  const idleCls =
    accent === 'gold'
      ? 'border-[#1F1F1F] bg-[#111111] text-[#8A8A8A] hover:border-[#333333] hover:text-white'
      : 'border-[#1F1F1F] text-[#8A8A8A] hover:border-[#333333]'

  return (
    <div>
      {showLabels && (
        <label className="block text-sm text-[#8A8A8A] mb-2">Course</label>
      )}
      <select
        aria-label="Course"
        value={course.id}
        onChange={(e) => {
          const next = COURSES.find((c) => c.id === e.target.value)
          if (next) onSubjectChange(next.subjects[0])
        }}
        className="w-full mb-3 px-4 py-2.5 rounded-lg bg-[#050505] border border-[#1F1F1F] text-white text-[0.875rem] font-medium focus:outline-none focus:border-[#333333] cursor-pointer"
      >
        {COURSES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {course.subjects.length > 1 && (
        <>
          {showLabels && (
            <label className="block text-sm text-[#8A8A8A] mb-2">Subject</label>
          )}
          <div className="flex gap-2 flex-wrap">
            {course.subjects.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSubjectChange(s)}
                className={`px-4 py-2 rounded-lg text-[0.875rem] font-medium border transition-all duration-200 ${
                  subject === s ? activeCls : idleCls
                }`}
              >
                {SUBJECT_LABELS[s]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
