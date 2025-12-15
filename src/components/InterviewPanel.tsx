"use client";

import { useEffect, useState, useRef } from "react";
import { Mic, MicOff, BrainCircuit, CheckCircle, Volume2, VolumeX } from "lucide-react";
import { useVoiceActivity } from "../hooks/useVoiceActivity";
import { useInterviewStore } from "../stores/useInterviewStore";
import { useRouter } from "next/navigation"; 
import axios from "axios";
import { motion } from "framer-motion";
import { KaraokeText } from "../components/lib/karaoketext"; 

export default function InterviewPanel() {
  const router = useRouter(); 
  const { 
    sessionId, 
    currentQuestion, 
    setQuestion, 
    setFeedback, 
    firstQuestionAudio, 
    setFirstQuestionAudio,
    isTtsEnabled,   // <--- From Store (The User Toggle)
    toggleTts       // <--- From Store
  } = useInterviewStore();
  
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  
  // 🎵 NEW: Track if we actually have audio data from the backend
  const [currentAudioData, setCurrentAudioData] = useState<string | null>(null);

  // Karaoke Sync State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { isRecording, volume, getAudioBlob, resetRecorder, stopRecordingManual } = useVoiceActivity(isAIThinking);
  const prevRecordingState = useRef(false);

  // ─────────────────────────────────────────────────────────────
  // 1. Startup Logic
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // If we have startup audio AND the user wants TTS...
    if (firstQuestionAudio && isTtsEnabled) {
        console.log("🔊 Found startup audio.");
        setIsAIThinking(true);
        setCurrentAudioData(firstQuestionAudio); // <--- Save it!
        playAudio(firstQuestionAudio);
    } else {
        // Otherwise clear it
        setFirstQuestionAudio(null);
        setCurrentAudioData(null);
    }
  }, []);

  // 2. Detect Speech (User Logic)
  useEffect(() => {
    if (isRecording) setHasSpoken(true);
  }, [isRecording]);

  // 3. Auto-Stop (User Logic)
  useEffect(() => {
    if (!isAIThinking && prevRecordingState.current === true && isRecording === false) {
      handleSubmission();
    }
    prevRecordingState.current = isRecording;
  }, [isRecording]);

  // ─────────────────────────────────────────────────────────────
  // 4. Play Audio Logic
  // ─────────────────────────────────────────────────────────────
  const playAudio = (base64String: string) => {
    if (!audioRef.current) return;

    // 🚨 IF TTS IS DISABLED, STOP HERE.
    if (!isTtsEnabled) {
        setIsAIThinking(false);
        setIsPlaying(false);
        return;
    }

    try {
      audioRef.current.src = `data:audio/mp3;base64,${base64String}`;
      
      audioRef.current.onended = () => {
        resetRecorder();
        setIsAIThinking(false);
        setIsPlaying(false);
      };

      audioRef.current.onerror = (e) => {
        console.error("Audio playback error", e);
        resetRecorder();
        setIsAIThinking(false);
        setIsPlaying(false);
      };

      audioRef.current.play();
      setIsPlaying(true);

    } catch (e) {
      console.error("Audio setup error", e);
      setIsAIThinking(false);
      setIsPlaying(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 5. Handle Submission (The Fix)
  // ─────────────────────────────────────────────────────────────
  const handleSubmission = async (manualBlob?: Blob) => {
    const audioBlob = manualBlob || getAudioBlob();
    if (audioBlob.size < 5000) {
        resetRecorder();
        return; 
    }

    setIsAIThinking(true);
    setHasSpoken(false);

    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("sessionId", sessionId || "");
    formData.append("question", currentQuestion || "");

    try {
      const res = await axios.post("http://localhost:4000/api/submit-answer", formData);
      const { evaluation, nextQuestion, isFinished, audio } = res.data;

      setFeedback(evaluation.feedback); 

      if (isFinished) {
          router.replace(`/dashboard/${sessionId}`);
          return;
      }

      setQuestion(nextQuestion?.question);

      // 🚨 CRITICAL FIX: Save the audio state
      if (audio) {
          setCurrentAudioData(audio); // Save logic: "We have audio"
      } else {
          setCurrentAudioData(null);  // Logic: "Backend sent no audio"
      }

      // Check BOTH: Does audio exist? AND Is toggle ON?
      if (audio && isTtsEnabled) {
          playAudio(audio); 
      } else {
          // Fallback to text mode immediately
          resetRecorder();
          setIsAIThinking(false);
      }

    } catch (err) {
      console.error(err);
      setIsAIThinking(false);
      resetRecorder();
    }
  };

  const handleManualStop = async () => {
    if (isAIThinking) return;
    const blob = await stopRecordingManual();
    await handleSubmission(blob);
  };

  // ─────────────────────────────────────────────────────────────
  // 6. RENDER HELPERS
  // ─────────────────────────────────────────────────────────────
  
  // Rule: Show Karaoke ONLY if User Enabled it AND Backend provided Audio
  const showKaraokeMode = isTtsEnabled && currentAudioData;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl p-6 min-h-[80vh]">
      
      {/* 🔴 TOGGLE SWITCH */}
      <div className="absolute top-6 right-6 z-50">
        <button 
            onClick={toggleTts}
            className={`p-3 rounded-full transition-all border ${
                isTtsEnabled 
                ? "bg-slate-800 text-cyan-400 border-cyan-500/50 shadow-lg shadow-cyan-900/20" 
                : "bg-slate-900 text-slate-500 border-slate-700"
            }`}
            title={isTtsEnabled ? "Mute TTS" : "Enable TTS"}
        >
            {isTtsEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* DYNAMIC UI SWITCHING */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="mb-8 w-full">
        {currentQuestion && (
            showKaraokeMode ? (
                // ✅ MODE A: KARAOKE (Audio exists + Toggle ON)
                <KaraokeText 
                    text={currentQuestion} 
                    isPlaying={isPlaying} 
                    audioRef={audioRef} 
                />
            ) : (
                // ✅ MODE B: STANDARD TEXT (Audio missing OR Toggle OFF)
                <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                    <p className="text-lg leading-relaxed text-slate-200 font-medium">
                        {currentQuestion}
                    </p>
                </div>
            )
        )}
      </div>

      {/* Visualizer & Controls (Unchanged) */}
      <div className="mb-10 relative h-32 flex items-center justify-center">
        {isAIThinking ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-blue-400">
            <BrainCircuit size={80} />
            <p className="mt-4 text-xl font-bold animate-pulse">
                {isPlaying ? "INTERVIEWER SPEAKING..." : "ANALYZING ANSWER..."}
            </p>
          </motion.div>
        ) : isRecording ? (
           <div className="flex flex-col items-center text-red-500">
             <div className="relative">
                <Mic size={80} />
                <motion.div className="absolute inset-0 rounded-full border-4 border-red-500" animate={{ scale: [1, 1.4], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1 }} />
             </div>
             <p className="mt-4 text-xl font-bold">LISTENING...</p>
           </div>
        ) : (
          <div className="flex flex-col items-center text-slate-400 opacity-80">
            <MicOff size={80} />
            <p className="mt-4 text-lg font-medium">Speak when ready...</p>
          </div>
        )}
      </div>

      {/* Volume Bar */}
      <div className="w-96 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mb-8">
        <motion.div 
          className={`h-full ${isAIThinking ? 'bg-blue-500' : 'bg-green-500'}`}
          animate={{ width: isAIThinking ? "100%" : `${Math.min(volume * 2, 100)}%` }}
          transition={{ ease: "linear", duration: 0.1 }}
        />
      </div>

      <button
        onClick={handleManualStop}
        disabled={!hasSpoken || isAIThinking}
        className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all ${hasSpoken && !isAIThinking ? "bg-green-600 text-white" : "bg-slate-800 text-slate-500"}`}
      >
        <CheckCircle size={20} />
        I'm Done Speaking
      </button>

      {/* Audio Element */}
      <audio ref={audioRef} className="hidden" />

    </div>
  );
}