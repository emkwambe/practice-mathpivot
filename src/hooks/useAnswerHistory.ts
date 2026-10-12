import { useCallback, useEffect, useReducer, useRef } from 'react'

export interface HistoryEntry {
  value: string
  cursor: number
}

const HISTORY_LIMIT = 20
// Consecutive keystrokes within this window collapse into one history entry
const TYPING_GROUP_MS = 800

/**
 * Undo/redo history for the answer input.
 *
 * Wraps the (value, onChange) pair owned by the parent component:
 * - `recordTyping` — call for manual keystrokes (time-grouped)
 * - `recordInsert` — call for palette inserts (always a new entry)
 * - `undo` / `redo` — pop/restore entries; they call onChange internally
 *   and return the entry so the caller can restore the cursor position.
 *
 * If the parent replaces the value externally (e.g. moving to a new
 * problem), the history resets automatically to that value.
 */
export function useAnswerHistory(value: string, onChange: (v: string) => void) {
  const historyRef = useRef<HistoryEntry[]>([{ value, cursor: 0 }])
  const indexRef = useRef(0)
  const lastTypePushRef = useRef(0)
  const [, forceRender] = useReducer((x: number) => x + 1, 0)

  const push = useCallback((entry: HistoryEntry) => {
    const hist = historyRef.current.slice(0, indexRef.current + 1)
    if (hist[hist.length - 1]?.value === entry.value) {
      hist[hist.length - 1] = entry
    } else {
      hist.push(entry)
      if (hist.length > HISTORY_LIMIT) hist.shift()
    }
    historyRef.current = hist
    indexRef.current = hist.length - 1
    forceRender()
  }, [])

  const recordTyping = useCallback(
    (newValue: string, cursor: number) => {
      const now = Date.now()
      if (now - lastTypePushRef.current > TYPING_GROUP_MS) {
        push({ value: newValue, cursor })
      } else {
        historyRef.current[indexRef.current] = { value: newValue, cursor }
      }
      lastTypePushRef.current = now
    },
    [push],
  )

  const recordInsert = useCallback(
    (newValue: string, cursor: number) => {
      push({ value: newValue, cursor })
      lastTypePushRef.current = 0
    },
    [push],
  )

  const undo = useCallback((): HistoryEntry | null => {
    if (indexRef.current <= 0) return null
    indexRef.current -= 1
    const entry = historyRef.current[indexRef.current]
    lastTypePushRef.current = 0
    onChange(entry.value)
    forceRender()
    return entry
  }, [onChange])

  const redo = useCallback((): HistoryEntry | null => {
    if (indexRef.current >= historyRef.current.length - 1) return null
    indexRef.current += 1
    const entry = historyRef.current[indexRef.current]
    lastTypePushRef.current = 0
    onChange(entry.value)
    forceRender()
    return entry
  }, [onChange])

  const canUndo = indexRef.current > 0
  const canRedo = indexRef.current < historyRef.current.length - 1

  // Reset when the value is replaced externally (new problem, cleared form)
  useEffect(() => {
    if (historyRef.current[indexRef.current]?.value !== value) {
      historyRef.current = [{ value, cursor: value.length }]
      indexRef.current = 0
      forceRender()
    }
  }, [value])

  return { recordTyping, recordInsert, undo, redo, canUndo, canRedo }
}
