import { useState, useCallback, useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { plainToLatex } from '@/lib/mathNormalizer'
import { Info } from 'lucide-react'
import MathPalette from '@/components/MathPalette'
import { useAnswerHistory } from '@/hooks/useAnswerHistory'
import type { Subject } from '@/lib/problemGenerator'

interface AnswerInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  feedbackState: 'idle' | 'correct' | 'incorrect'
  subject?: Subject
  /** EOC gridded response: digits, '.', '-', '/' and spaces only; no palette. */
  gridded?: boolean
}

export default function AnswerInput({ value, onChange, onSubmit, feedbackState, subject = 'integration', gridded = false }: AnswerInputProps) {
  const [previewHtml, setPreviewHtml] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const history = useAnswerHistory(value, onChange)

  const restoreCursor = (pos: number) => {
    requestAnimationFrame(() => {
      const input = inputRef.current
      if (!input) return
      input.setSelectionRange(pos, pos)
      input.focus()
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    if (gridded) {
      // EOC gridded response: only 0-9 . - / and one space allowed
      newValue = newValue.replace(/[^0-9.\-/ ]/g, '')
    }
    history.recordTyping(newValue, e.target.selectionStart ?? newValue.length)
    onChange(newValue)
  }

  const handleUndo = () => {
    const entry = history.undo()
    if (entry) restoreCursor(entry.cursor)
  }

  const handleRedo = () => {
    const entry = history.redo()
    if (entry) restoreCursor(entry.cursor)
  }

  const renderPreview = useCallback((raw: string) => {
    if (!raw.trim()) {
      setPreviewHtml('')
      return
    }
    const latex = plainToLatex(raw)
    try {
      const html = katex.renderToString(latex, {
        displayMode: true,
        throwOnError: false,
        trust: true,
        strict: false,
      })
      setPreviewHtml(html)
    } catch {
      setPreviewHtml(
        `<span style="color: #8A8A8A; font-family: monospace; font-size: 1rem;">${raw.replace(/</g, '&lt;')}</span>`
      )
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      renderPreview(value)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [value, renderPreview])

  useEffect(() => {
    if (feedbackState === 'idle') {
      inputRef.current?.focus()
    }
  }, [feedbackState])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSubmit()
    }
  }

  const handleInsert = (insert: string, cursorOffset: number) => {
    const input = inputRef.current
    if (!input) return
    const start = input.selectionStart ?? value.length
    const end = input.selectionEnd ?? value.length
    const newValue = value.slice(0, start) + insert + value.slice(end)
    const pos = start + insert.length + cursorOffset
    history.recordInsert(newValue, pos)
    onChange(newValue)
    requestAnimationFrame(() => {
      input.setSelectionRange(pos, pos)
      input.focus()
    })
  }

  const borderColor =
    feedbackState === 'correct'
      ? 'border-[#22C55E] focus:border-[#22C55E] focus:ring-[rgba(34,197,94,0.15)]'
      : feedbackState === 'incorrect'
        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[rgba(239,68,68,0.15)]'
        : 'border-[#1F1F1F] focus:border-[#E30614] focus:ring-[rgba(227,6,20,0.15)]'

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="answer-input" className="text-[0.875rem] text-[#8A8A8A]">
          Your Answer
        </label>
        <button
          type="button"
          onClick={() => setShowHelp((v) => !v)}
          className="flex items-center gap-1 text-[0.75rem] text-[#555555] hover:text-[#8A8A8A] transition-colors"
        >
          <Info size={12} />
          {showHelp ? 'Hide tips' : 'How to type'}
        </button>
      </div>

      {showHelp && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#1F1F1F] text-[0.75rem] text-[#8A8A8A] leading-relaxed">
          <p className="mb-1">Type answers naturally — no LaTeX required:</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 font-mono text-[#555555]">
            <span>x^3/3 + C</span> <span>fractions &amp; powers</span>
            <span>sqrt(x)</span>   <span>square root</span>
            <span>sin(x), ln(x)</span> <span>trig &amp; log</span>
            <span>pi, inf</span>     <span>constants</span>
            <span>e^(x^2)</span>    <span>exponents</span>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        id="answer-input"
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setShowPreview(true)}
        onBlur={() => setShowPreview(false)}
        onKeyDown={handleKeyDown}
        placeholder={gridded ? 'Enter a number (e.g. 4, -3.3, 3/2)...' : 'e.g. x^3/3 + C  or  sin(x^2) + C'}
        disabled={feedbackState === 'correct'}
        className={`w-full px-4 py-3 rounded-lg bg-[#111111] text-white font-mono text-[1.125rem] border ${borderColor} placeholder:text-[#555555] focus:outline-none focus:ring-[3px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
        autoComplete="off"
        spellCheck={false}
      />
      {showPreview && !gridded && previewHtml && (
        <div
          className="mt-2 px-4 py-3 rounded-lg bg-[#1A1A1A] border border-[#1F1F1F] min-h-[60px] flex items-center justify-center overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      )}

      {!gridded && (
        <div className="mt-3">
          <MathPalette
            inputRef={inputRef}
            onInsert={handleInsert}
            subject={subject}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={history.canUndo}
            canRedo={history.canRedo}
          />
        </div>
      )}
    </div>
  )
}
