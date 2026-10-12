import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import {
  Calculator,
  Target,
  Infinity,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Zap,
  ArrowRight,
  GitBranch,
  RefreshCw,
  Triangle,
  Split,
  Flame,
} from 'lucide-react'

/* ─────────────────────── easing ─────────────────────── */

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]
const easeOutQuart = [0.25, 1, 0.5, 1] as [number, number, number, number]

/* ─────────────────────── animation variants ─────────────────────── */

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutQuart } },
}

const staggerRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeOutQuart } },
}

/* ─────────────────────── Principle Card ─────────────────────── */

interface PrincipleCardProps {
  icon: React.ElementType
  title: string
  description: string
}

function PrincipleCard({ icon: Icon, title, description }: PrincipleCardProps) {
  return (
    <motion.div
      variants={staggerRight}
      className="bg-[#111111] border border-[#1F1F1F] rounded-[10px] p-5 hover:border-[#333333] transition-colors duration-200"
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon size={24} className="text-[#E30614]" />
        <h4 className="text-[1.25rem] font-semibold text-white">{title}</h4>
      </div>
      <p className="text-[0.875rem] text-[#8A8A8A] leading-relaxed">{description}</p>
    </motion.div>
  )
}

/* ─────────────────────── Process Step ─────────────────────── */

function ProcessStep({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <motion.div variants={staggerItem} className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full border-2 border-[#E30614] bg-[#111111] flex items-center justify-center mb-5">
        <span className="text-[1.5rem] font-semibold text-[#E30614]">{number}</span>
      </div>
      <h4 className="text-[1.25rem] font-semibold text-white mb-2">{title}</h4>
      <p className="text-[0.875rem] text-[#8A8A8A] leading-relaxed max-w-[280px]">{description}</p>
    </motion.div>
  )
}

/* ─────────────────────── Coverage Data ─────────────────────── */

const coverageData = [
  {
    technique: 'Basic Integration',
    icon: Zap,
    count: 6,
    topics: [
      'Power Rule',
      'Constant Multiple',
      'Sum/Difference',
      'Exponential Functions',
      'Logarithmic Functions',
      'Hyperbolic Functions',
    ],
  },
  {
    technique: 'U-Substitution',
    icon: ArrowRight,
    count: 4,
    topics: [
      'Chain Rule Reversal',
      'Change of Variables',
      'Definite Integrals with Substitution',
      'Trigonometric Substitutions within u-sub',
    ],
  },
  {
    technique: 'Integration by Parts',
    icon: GitBranch,
    count: 5,
    topics: [
      'LIATE Strategy',
      'Repeated Parts',
      'Circular Cases (e^x sin x)',
      'Definite Integrals by Parts',
      'Reduction Formulas',
    ],
  },
  {
    technique: 'Trigonometric Integrals',
    icon: RefreshCw,
    count: 5,
    topics: [
      'Powers of Sine/Cosine',
      'Powers of Tangent/Secant',
      'Product-to-Sum Identities',
      'Double Angle Formulas',
      'Half-Angle Formulas',
    ],
  },
  {
    technique: 'Trig Substitution',
    icon: Triangle,
    count: 5,
    topics: [
      'sqrt(a² - x²) Form',
      'sqrt(a² + x²) Form',
      'sqrt(x² - a²) Form',
      'Completing the Square',
      'Definite Trig Substitution',
    ],
  },
  {
    technique: 'Partial Fractions',
    icon: Split,
    count: 5,
    topics: [
      'Distinct Linear Factors',
      'Repeated Linear Factors',
      'Irreducible Quadratics',
      'Mixed Cases',
      'Long Division First',
    ],
  },
  {
    technique: 'Improper Integrals',
    icon: Infinity,
    count: 5,
    topics: [
      'Infinite Upper Limit',
      'Infinite Lower Limit',
      'Both Limits Infinite',
      'Discontinuous Integrand',
      'Comparison Test',
    ],
  },
  {
    technique: 'Mixed Practice',
    icon: Flame,
    count: 4,
    topics: [
      'Random Technique Selection',
      'Multi-Technique Problems',
      'Challenge Problems',
      'Exam-Style Problems',
    ],
  },
]

/* ─────────────────────── Coverage Accordion Item ─────────────────────── */

function CoverageAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof coverageData)[0]
  isOpen: boolean
  onToggle: () => void
}) {
  const Icon = item.icon

  return (
    <div className="border border-[#1F1F1F] rounded-[10px] overflow-hidden hover:border-[#333333] transition-colors duration-200">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#111111] text-left"
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-[#C9A86C]" />
          <span className="text-[1.25rem] font-semibold text-white">{item.technique}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[0.75rem] font-medium uppercase tracking-[0.05em] text-[#555555]">
            {item.count} topics
          </span>
          <ChevronDown
            size={18}
            className={`text-[#8A8A8A] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.45, 0.05, 0.55, 0.95] as [number, number, number, number] }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 bg-[#0e0e0e] border-t border-[#1F1F1F]">
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.topics.map((topic, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[#C9A86C] select-none">•</span>
                <span className="text-[0.875rem] text-[#8A8A8A]">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ─────────────────────── Main About Page ─────────────────────── */

export default function About() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const toggleAccordion = (name: string) => {
    setOpenAccordion((prev) => (prev === name ? null : name))
  }

  return (
    <div className="bg-[#050505] min-h-[100dvh]">
      {/* ─── Section 1: Page Header ─── */}
      <div className="border-b border-[#1F1F1F]">
        <div className="container-mathgen pt-12 pb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="font-display text-[clamp(1.8rem,3vw,2.8rem)] text-white leading-tight tracking-[-0.01em] mb-4"
          >
            About MathPivot
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.15 }}
            className="text-[1.125rem] text-[#8A8A8A] leading-[1.7] max-w-[640px]"
          >
            Born from the belief that practice is the only path to mastery. MathPivot exists to give
            every calculus student unlimited, high-quality integration problems with detailed
            solutions.
          </motion.p>
        </div>
      </div>

      {/* ─── Section 2: Mission & Story ─── */}
      <section className="py-20 lg:py-[80px]">
        <div className="container-mathgen max-w-[1080px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
          >
            {/* Story Column */}
            <motion.div variants={staggerItem}>
              <h2 className="text-[1.5rem] font-semibold text-white mb-4">Why We Built This</h2>
              <div className="space-y-5">
                <p className="text-[#8A8A8A] leading-[1.7]">
                  Integration is one of the most challenging topics in calculus. Unlike
                  differentiation, which follows straightforward rules, integration requires pattern
                  recognition, technique selection, and creative problem-solving. The only way to get
                  better is through deliberate practice — lots of it.
                </p>
                <p className="text-[#8A8A8A] leading-[1.7]">
                  MathPivot was built to solve a simple problem: there are never enough practice
                  problems. Textbooks have limited exercises. Online resources are scattered. We
                  wanted one place where students could generate unlimited, varied problems with
                  detailed, step-by-step solutions.
                </p>
                <p className="text-[#8A8A8A] leading-[1.7]">
                  Every problem is algorithmically generated and instantly rendered in beautiful
                  LaTeX. Every solution is broken down step by step. No paywalls, no sign-ups, no
                  limits — just math.
                </p>
              </div>
            </motion.div>

            {/* Principles Column */}
            <motion.div variants={staggerItem}>
              <h2 className="text-[1.5rem] font-semibold text-white mb-6">Our Principles</h2>
              <div className="space-y-4">
                <PrincipleCard
                  icon={Infinity}
                  title="Unlimited Practice"
                  description="Generate as many problems as you need. Every problem is unique, algorithmically created on demand."
                  
                />
                <PrincipleCard
                  icon={BookOpen}
                  title="Beautiful Math"
                  description="All problems and solutions are rendered in crisp, textbook-quality LaTeX. Read math the way it was meant to be read."
                  
                />
                <PrincipleCard
                  icon={ChevronRight}
                  title="Step-by-Step Learning"
                  description="Every solution is a complete walkthrough. See every substitution, every identity, every simplification — nothing is skipped."
                  
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Section 3: How It Works ─── */}
      <section className="py-20 lg:py-[80px] bg-[#111111]">
        <div className="container-mathgen max-w-[960px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.h2
              variants={staggerItem}
              className="font-display text-[clamp(1.8rem,3vw,2.8rem)] text-white leading-tight tracking-[-0.01em] mb-4"
            >
              How Problems Are Generated
            </motion.h2>
            <motion.p variants={staggerItem} className="text-[#8A8A8A] max-w-[600px] mx-auto">
              Every problem is created algorithmically using a systematic approach that ensures
              variety, correctness, and appropriate difficulty.
            </motion.p>
          </motion.div>

          {/* Process Steps */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="relative"
          >
            {/* Dotted connector line — desktop only */}
            <div className="hidden lg:block absolute top-8 left-[16.67%] right-[16.67%] border-t-2 border-dotted border-[#1F1F1F]" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-8">
              <ProcessStep
                number={1}
                title="Parameter Selection"
                description="The generator selects random coefficients, exponents, and function compositions based on the chosen technique and difficulty level. Easy problems use simpler parameters; hard problems layer multiple techniques."
              />
              <ProcessStep
                number={2}
                title="Problem Construction"
                description="Using symbolic computation, the generator constructs a valid integral problem and simultaneously computes its exact solution. Every generated problem is verified to have a clean, closed-form answer."
              />
              <ProcessStep
                number={3}
                title="Solution Generation"
                description="The solution engine breaks down the solving process into logical steps, each with explanatory text and LaTeX-rendered mathematics. Solutions mirror how a professor would work through the problem on a chalkboard."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Section 4: Coverage & Techniques ─── */}
      <section className="py-20 lg:py-[80px]">
        <div className="container-mathgen max-w-[800px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={staggerItem}
              className="font-display text-[clamp(1.8rem,3vw,2.8rem)] text-white leading-tight tracking-[-0.01em] mb-4"
            >
              What We Cover
            </motion.h2>
            <motion.p variants={staggerItem} className="text-[#8A8A8A]">
              Comprehensive coverage of all major integration techniques taught in standard calculus
              curricula.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="space-y-3"
          >
            {coverageData.map((item) => (
              <motion.div key={item.technique} variants={staggerItem}>
                <CoverageAccordionItem
                  item={item}
                  isOpen={openAccordion === item.technique}
                  onToggle={() => toggleAccordion(item.technique)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Section 5: CTA ─── */}
      <section className="relative py-20 lg:py-[80px] bg-[#111111] overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(227,6,20,0.04) 0%, transparent 70%)',
            }}
          />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="relative container-mathgen max-w-[640px] text-center"
        >
          <motion.h2
            variants={staggerItem}
            className="font-display text-[clamp(1.8rem,3vw,2.8rem)] text-white leading-tight tracking-[-0.01em] mb-4"
          >
            Start Practicing Now
          </motion.h2>
          <motion.p variants={staggerItem} className="text-[1.125rem] text-[#8A8A8A] mb-10">
            No account required. No limits. Just pick a technique and start solving.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/generator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#E30614] text-white text-[0.9375rem] font-semibold hover:bg-[#FF1A2E] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(227,6,20,0.3)]"
            >
              <Calculator size={18} />
              Open Generator
            </Link>
            <Link
              to="/practice"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#333333] text-white text-[0.9375rem] font-semibold hover:bg-[rgba(255,255,255,0.05)] hover:border-white transition-all duration-200"
            >
              <Target size={18} />
              Practice Mode
            </Link>
          </motion.div>

          <motion.p
            variants={staggerItem}
            className="mt-12 text-[0.875rem] text-[#555555]"
          >
            MathPivot is open source. Contributions, bug reports, and feature suggestions are always
            welcome.{" "}
            <a
              href="#"
              className="text-[#C9A86C] hover:underline transition-all duration-200"
              onClick={(e) => e.preventDefault()}
            >
              View on GitHub
            </a>
          </motion.p>
        </motion.div>
      </section>
    </div>
  )
}
