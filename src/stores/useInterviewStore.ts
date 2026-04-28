import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type InterviewType = "job-specific" | "technical" | "behavioral";
export type InterviewMode = "chat" | "audio" | "video";

export interface InterviewConfig {
  stack?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  questionCount?: number;
}

interface InterviewState {
  sessionId: string | null;
  currentQuestion: string | null;
  questionCount: number;
  loading: boolean;
  transcript: string;
  feedback: string | null;
  firstQuestionAudio: string | null;
  firstQuestionAudioMime: string | null;

  // Interview type + config
  interviewType: InterviewType;
  config: InterviewConfig;
  setInterviewType: (type: InterviewType) => void;
  setConfig: (config: InterviewConfig) => void;

  // TTS State & Actions
  isTtsEnabled: boolean;
  toggleTts: () => void;

  // Voice selection
  interviewerVoice: "male" | "female";
  setInterviewerVoice: (v: "male" | "female") => void;

  // Interview mode + device selection
  interviewMode: InterviewMode;
  setInterviewMode: (mode: InterviewMode) => void;
  selectedMicId: string | null;
  setSelectedMicId: (id: string | null) => void;
  selectedCameraId: string | null;
  setSelectedCameraId: (id: string | null) => void;

  setSessionId: (id: string) => void;
  setQuestion: (text: string) => void;
  setQuestionCount: (count: number) => void;
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
      questionCount: 1,
      loading: false,
      transcript: '',
      feedback: null,
      firstQuestionAudio: null,
      firstQuestionAudioMime: null,

      interviewType: "job-specific" as InterviewType,
      config: {} as InterviewConfig,
      setInterviewType: (type) => set({ interviewType: type, config: {} }),
      setConfig: (config) => set({ config }),

      isTtsEnabled: true,
      interviewerVoice: "female" as "male" | "female",

      interviewMode: "audio" as InterviewMode,
      setInterviewMode: (mode) => set({ interviewMode: mode }),
      selectedMicId: null,
      setSelectedMicId: (id) => set({ selectedMicId: id }),
      selectedCameraId: null,
      setSelectedCameraId: (id) => set({ selectedCameraId: id }),

      // New session → current-question index must start at 1 (not a stale persisted value).
      setSessionId: (id) => set({ sessionId: id, questionCount: 1 }),
      setQuestion: (text) => set({ currentQuestion: text }),
      setQuestionCount: (count) => set({ questionCount: count }),
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
          questionCount: 1,
          feedback: null,
          firstQuestionAudio: null,
          firstQuestionAudioMime: null,
          transcript: "",
          loading: false,
          selectedMicId: null,
          selectedCameraId: null,
        }),
    }),
    {
      name: 'hirely-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);