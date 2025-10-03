// src/stores/useInterviewStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type Question = { id: string; text: string }
export type Answer = { id: string; questionId: string; text?: string }

type InterviewState = {
  sessionId: string | null
  questions: Question[]
  answers: Answer[]
  addQuestion: (q: Question) => void
  addAnswer: (a: Answer) => void
  clearSession: () => void
}

export const useInterviewStore = create<InterviewState>()(
  devtools(
    persist(
      (set, get) => ({
        sessionId: null,
        questions: [],
        answers: [],
        addQuestion: (q) =>
          set((state) => {
            // Prevent duplicate ids
            if (state.questions.some((x) => x.id === q.id)) {
              return state
            }
            return { questions: [...state.questions, q] }
          }),
        addAnswer: (a) =>
          set((state) => {
            // Prevent duplicate answer ids
            if (state.answers.some((x) => x.id === a.id)) {
              return state
            }
            return { answers: [...state.answers, a] }
          }),
        clearSession: () => {
          // clear persisted questions/answers too
          set({ sessionId: null, questions: [], answers: [] })
        }
      }),
      { name: 'hirely-interview-v1' }
    )
  )
)
