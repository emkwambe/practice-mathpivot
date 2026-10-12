import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface MathDisplayProps {
  latex: string
  displayMode?: boolean
}

export default function MathDisplay({ latex, displayMode = false }: MathDisplayProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        trust: true,
        strict: false,
      })
    } catch {
      return `<span style="color: #EF4444;">Error rendering math</span>`
    }
  }, [latex, displayMode])

  return (
    <span
      className={displayMode ? 'katex-display-wrapper' : 'katex-inline-wrapper'}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
