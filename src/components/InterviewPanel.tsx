// src/components/InterviewPanel.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useInterviewStore } from '@/stores/useInterviewStore'

export default function InterviewPanel() {
  const questions = useInterviewStore((s) => s.questions)
  const addQuestion = useInterviewStore((s) => s.addQuestion)
  const clearSession = useInterviewStore((s) => s.clearSession)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Guard to prevent double fetch in React Strict Mode (dev)
  const fetchedRef = useRef(false)

  useEffect(() => {
    // If questions already exist in the store, nothing to fetch
    if (questions.length > 0) return

    // If we already started fetching during this mount cycle, bail out
    if (fetchedRef.current) return
    fetchedRef.current = true

    const fetchQuestion = async () => {
      setLoading(true)
      setError(null)
      try {
        const resp = await fetch('/api/mock/question')
        if (!resp.ok) throw new Error(`API error ${resp.status}`)
        const data = await resp.json()
        // Defensive: only add if not present (store also enforces this)
        if (!questions.some((q) => q.id === data.id)) {
          addQuestion({ id: data.id, text: data.text })
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message)
        else setError('Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestion()
    // we intentionally do not include 'questions' in deps to avoid re-running when store updates
    // addQuestion is stable (from zustand) and is safe to include
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addQuestion])

  return (
    <div>
      <h2>Interview Panel</h2>
      <button
        onClick={() => {
          clearSession()
          // reload to reflect cleared persisted state immediately
          window.location.reload()
        }}
        style={{ marginBottom: 12 }}
      >
        Reset
      </button>

      {loading && <div>Loading question…</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {!loading && !error && questions.length === 0 && <div>No questions yet.</div>}

      <div style={{ marginTop: 12 }}>
        {questions.map((q) => (
          <div
            key={q.id}
            style={{ padding: 12, border: '1px solid #ccc', borderRadius: 4, marginBottom: 8 }}
          >
            {q.text}
          </div>
        ))}
      </div>
    </div>
  )
}
