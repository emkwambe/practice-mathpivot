// Course registry — groups subjects into courses so the UI can demarcate
// between product lines (Calculus practice vs NC EOC/EOG prep).
// Adding a course (e.g. Math 3 EOC, Math 6 EOG) = one entry here plus the
// subject's generators; every picker in the app picks it up automatically.

import type { Subject, Technique } from './problemGenerator'

export interface Course {
  id: string
  /** Full display name, e.g. "Math 1 EOC" */
  name: string
  subjects: Subject[]
}

export const COURSES: Course[] = [
  {
    id: 'calculus',
    name: 'Calculus',
    subjects: [
      'integration',
      'differentiation',
      'limits',
      'applications-derivatives',
      'applications-integration',
      'differential-equations',
      'sequences-series',
    ],
  },
  {
    id: 'math1-eoc',
    name: 'Math 1 EOC',
    subjects: ['math1-eoc'],
  },
  {
    id: 'math3-eoc',
    name: 'Math 3 EOC',
    subjects: ['math3-eoc'],
  },
  {
    id: 'math7-eog',
    name: 'Math 7 EOG',
    subjects: ['math7-eog'],
  },
  {
    id: 'math6-eog',
    name: 'Math 6 EOG',
    subjects: ['math6-eog'],
  },
  {
    id: 'math8-eog',
    name: 'Math 8 EOG',
    subjects: ['math8-eog'],
  },
]

export function courseForSubject(subject: Subject): Course {
  return COURSES.find((c) => c.subjects.includes(subject)) ?? COURSES[0]
}

/** Short pill labels (with math glyph) used in subject button rows. */
export const SUBJECT_LABELS: Record<Subject, string> = {
  integration: '∫ Integration',
  differentiation: 'd/dx Differentiation',
  limits: 'lim Limits',
  'applications-derivatives': 'f′ Applications',
  'applications-integration': '∫ Applications',
  'differential-equations': 'y′ DiffEq',
  'sequences-series': 'Σ Series',
  'math1-eoc': 'Math 1 EOC',
  'math3-eoc': 'Math 3 EOC',
  'math6-eog': 'Math 6 EOG',
  'math7-eog': 'Math 7 EOG',
  'math8-eog': 'Math 8 EOG',
}

/** Full names used in headings and worksheet headers. */
export const SUBJECT_NAMES: Record<Subject, string> = {
  integration: 'Integration',
  differentiation: 'Differentiation',
  limits: 'Limits',
  'applications-derivatives': 'Applications of Derivatives',
  'applications-integration': 'Applications of Integration',
  'differential-equations': 'Differential Equations',
  'sequences-series': 'Sequences & Series',
  'math1-eoc': 'Math 1 EOC',
  'math3-eoc': 'Math 3 EOC',
  'math6-eog': 'Math 6 EOG',
  'math7-eog': 'Math 7 EOG',
  'math8-eog': 'Math 8 EOG',
}

/** Technique selected by default when the user switches to a subject. */
export const DEFAULT_TECHNIQUE: Record<Subject, Technique> = {
  integration: 'basic',
  differentiation: 'basic-diff',
  limits: 'direct-substitution',
  'applications-derivatives': 'optimization',
  'applications-integration': 'area-between-curves',
  'differential-equations': 'separable',
  'sequences-series': 'geometric-series',
  'math1-eoc': 'm1-linear-equations',
  'math3-eoc': 'm3-polynomials',
  'math6-eog': 'g6-ratios',
  'math7-eog': 'g7-ratios-proportions',
  'math8-eog': 'g8-functions',
}

/** The "all techniques" mixed key per subject. */
export const MIXED_TECHNIQUE: Record<Subject, Technique> = {
  integration: 'mixed',
  differentiation: 'mixed-diff',
  limits: 'mixed-limits',
  'applications-derivatives': 'mixed-appdiff',
  'applications-integration': 'mixed-appint',
  'differential-equations': 'mixed-diffeq',
  'sequences-series': 'mixed-series',
  'math1-eoc': 'mixed-m1',
  'math3-eoc': 'mixed-m3',
  'math6-eog': 'mixed-g6',
  'math7-eog': 'mixed-g7',
  'math8-eog': 'mixed-g8',
}
