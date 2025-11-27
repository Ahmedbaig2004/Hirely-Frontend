import { create } from "zustand";

interface InterviewState {
  sessionId: string | null;
  currentQuestion: string | null;
  loading: boolean;
  transcript: string;
  feedback: string | null;

  // Actions
  setSessionId: (id: string) => void;
  setQuestion: (text: string) => void;
  setLoading: (status: boolean) => void;
  setTranscript: (text: string) => void;
  setFeedback: (text: string) => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  sessionId: null,
  currentQuestion: null,
  loading: false,
  transcript: "",
  feedback: null,

  setSessionId: (id) => set({ sessionId: id }),
  setQuestion: (text) => set({ currentQuestion: text }),
  setLoading: (status) => set({ loading: status }),
  setTranscript: (text) => set({ transcript: text }),
  setFeedback: (text) => set({ feedback: text }),
}));
