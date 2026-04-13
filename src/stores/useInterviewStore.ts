import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface InterviewState {
  sessionId: string | null;
  currentQuestion: string | null;
  loading: boolean;
  transcript: string;
  feedback: string | null;
  firstQuestionAudio: string | null;
  firstQuestionAudioMime: string | null;

  // TTS State & Actions
  isTtsEnabled: boolean;
  toggleTts: () => void;

  // Voice selection
  interviewerVoice: "male" | "female";
  setInterviewerVoice: (v: "male" | "female") => void;

  setSessionId: (id: string) => void;
  setQuestion: (text: string) => void;
  setLoading: (status: boolean) => void;
  setTranscript: (text: string) => void;
  setFeedback: (text: string) => void;
  setFirstQuestionAudio: (audio: string | null, mime?: string | null) => void;
  resetSession: () => void;
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set) => ({
      sessionId: null,
      currentQuestion: null,
      loading: false,
      transcript: '',
      feedback: null,
      firstQuestionAudio: null,
      firstQuestionAudioMime: null,

      isTtsEnabled: true,
      interviewerVoice: "female" as "male" | "female",

      setSessionId: (id) => set({ sessionId: id }),
      setQuestion: (text) => set({ currentQuestion: text }),
      setLoading: (status) => set({ loading: status }),
      setTranscript: (text) => set({ transcript: text }),
      setFeedback: (text) => set({ feedback: text }),
      setFirstQuestionAudio: (audio, mime = null) =>
        set({ firstQuestionAudio: audio, firstQuestionAudioMime: mime }),

      toggleTts: () => set((state) => ({ isTtsEnabled: !state.isTtsEnabled })),
      setInterviewerVoice: (v) => set({ interviewerVoice: v }),

      resetSession: () =>
        set({
          sessionId: null,
          currentQuestion: null,
          feedback: null,
          firstQuestionAudio: null,
          firstQuestionAudioMime: null,
          transcript: "",
          loading: false,
        }),
    }),
    {
      name: 'hirely-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);