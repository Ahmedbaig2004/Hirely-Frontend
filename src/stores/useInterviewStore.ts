import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface InterviewState {
  sessionId: string | null;
  currentQuestion: string | null;
  loading: boolean;
  transcript: string;
  feedback: string | null;
  firstQuestionAudio: string | null; // <--- 1. NEW FIELD
  
  setSessionId: (id: string) => void;
  setQuestion: (text: string) => void;
  setLoading: (status: boolean) => void;
  setTranscript: (text: string) => void;
  setFeedback: (text: string) => void;
  setFirstQuestionAudio: (audio: string | null) => void; // <--- 2. NEW ACTION
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set) => ({
      sessionId: null,
      currentQuestion: null,
      loading: false,
      transcript: '',
      feedback: null,
      firstQuestionAudio: null, // <--- 3. INITIAL VALUE

      setSessionId: (id) => set({ sessionId: id }),
      setQuestion: (text) => set({ currentQuestion: text }),
      setLoading: (status) => set({ loading: status }),
      setTranscript: (text) => set({ transcript: text }),
      setFeedback: (text) => set({ feedback: text }),
      setFirstQuestionAudio: (audio) => set({ firstQuestionAudio: audio }), // <--- 4. SETTER
    }),
    {
      name: 'hirely-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);