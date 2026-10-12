import { useMemo } from 'react'
import { motion } from 'framer-motion'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import type { SolutionStep } from '@/lib/problemGenerator'

interface SolutionStepsProps {
  steps: SolutionStep[]
  finalAnswer: string
}

function renderMath(latex: string): string {
  try {
    return katex.renderToString(latex, {
      displayMode: false,
      throwOnError: false,
      trust: true,
      strict: false,
    })
  } catch {
    return '<span style="color: #EF4444;">Error</span>'
  }
}

export default function SolutionSteps({ steps, finalAnswer }: SolutionStepsProps) {
  const answerHtml = useMemo(() => {
    try {
      return katex.renderToString(finalAnswer, {
        displayMode: true,
        throwOnError: false,
        trust: true,
        strict: false,
      })
    } catch {
      return '<span style="color: #EF4444;">Error rendering answer</span>'
    }
  }, [finalAnswer])

  return (
    <div className="mt-8">
      <h3 className="text-[1.5rem] font-semibold text-white mb-4">Step-by-Step Solution</h3>
      <div className="border-t border-[#1F1F1F] pt-6" />

      <div className="space-y-5">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.12,
              ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
            }}
            className="flex gap-4"
          >
            {/* Step number with connecting line */}
            <div className="flex flex-col items-center shrink-0">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.12,
                  ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
                }}
                className="w-8 h-8 rounded-full bg-[#C9A86C] flex items-center justify-center text-[#050505] font-mono text-[0.875rem] font-semibold"
              >
                {step.number}
              </motion.div>
              {index < steps.length - 1 && (
                <div className="w-px flex-1 min-h-[24px] bg-[#1F1F1F]" />
              )}
            </div>

            {/* Step content */}
            <div className="pb-5">
              <p className="text-white mb-2">{step.description}</p>
              <span
                className="font-mono text-[1.125rem] text-[#8A8A8A] katex-inline-wrapper"
                dangerouslySetInnerHTML={{ __html: renderMath(step.math) }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Final Answer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: steps.length * 0.12,
          ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
        }}
        className="mt-6 px-4 py-4 rounded-lg border border-[rgba(201,168,108,0.3)] bg-[rgba(201,168,108,0.05)]"
      >
        <span className="text-[0.75rem] font-medium uppercase tracking-wider text-[#C9A86C]">
          Final Answer
        </span>
        <div className="mt-2" dangerouslySetInnerHTML={{ __html: answerHtml }} />
      </motion.div>
    </div>
  )
}
