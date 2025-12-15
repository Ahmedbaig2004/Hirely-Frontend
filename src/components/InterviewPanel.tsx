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
  
  // 1. Get State
  const { 
    sessionId, 
    currentQuestion, 
    setQuestion, 
    setFeedback, 
    firstQuestionAudio, 
    setFirstQuestionAudio,
    isTtsEnabled,   
    toggleTts       
  } = useInterviewStore();
  
  // 2. Local State
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  
  // 🎵 Audio State
  const [currentAudioData, setCurrentAudioData] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 3. Hooks
  const { isRecording, volume, getAudioBlob, resetRecorder, stopRecordingManual } = useVoiceActivity(isAIThinking);
  const prevRecordingState = useRef(false);

  // ─────────────────────────────────────────────────────────────
  // LOGIC SECTIONS (Startup, Audio, Submission)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (firstQuestionAudio && isTtsEnabled) {
        setIsAIThinking(true);
        setCurrentAudioData(firstQuestionAudio); 
        playAudio(firstQuestionAudio);
    } else {
        setFirstQuestionAudio(null);
        setCurrentAudioData(null);
    }
  }, []);

  useEffect(() => {
    if (isRecording) setHasSpoken(true);
  }, [isRecording]);

  useEffect(() => {
    if (!isAIThinking && prevRecordingState.current === true && isRecording === false) {
      handleSubmission();
    }
    prevRecordingState.current = isRecording;
  }, [isRecording]);

  const playAudio = async (base64String: string) => {
    if (!audioRef.current || !isTtsEnabled) return;

    try {
      // 1. Force stop any previous audio
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      // 2. Set new source
      audioRef.current.src = `data:audio/mp3;base64,${base64String}`;
      
      // 3. Setup Listeners
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

      // 4. Play with Promise Handling (The Fix)
      setIsPlaying(true); // Optimistic UI update
      
      try {
        await audioRef.current.play();
      } catch (err: any) {
        // Ignore "Interrupted" errors (common in React Strict Mode)
        if (err.name === "AbortError" || err.message.includes("interrupted")) {
             console.log("Audio playback interrupted (harmless)");
        } else {
             console.error("Playback failed:", err);
             setIsPlaying(false);
        }
      }

    } catch (e) {
      console.error("Audio setup error", e);
      setIsAIThinking(false);
      setIsPlaying(false);
    }
  };

  const handleSubmission = async (manualBlob?: Blob) => {
    const audioBlob = manualBlob || getAudioBlob();
    if (audioBlob.size < 3000) { resetRecorder(); return; }

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
      if (isFinished) { router.replace(`/dashboard/${sessionId}`); return; }

      setQuestion(nextQuestion?.question);
      setQuestionCount(prev => prev + 1); 

      if (audio) setCurrentAudioData(audio);
      else setCurrentAudioData(null);

      if (audio && isTtsEnabled) {
          playAudio(audio); 
      } else {
          resetRecorder();
          setIsAIThinking(false);
          setIsPlaying(false);
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
  // RENDER LOGIC
  // ─────────────────────────────────────────────────────────────
  
  // Only show Karaoke if enabled + audio exists
  const showKaraokeMode = isTtsEnabled && currentAudioData;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl p-6 min-h-[70vh] relative">
      
      {/* ────────────────────────────────────────────────── */}
      {/* TOP: Question Number & Toggle */}
      {/* ────────────────────────────────────────────────── */}
      <div className="w-full flex justify-between items-center mb-10 px-2">
        <div className="flex flex-col">
            <span className="text-slate-500 text-sm font-semibold tracking-wider uppercase">Question</span>
            <h2 className="text-3xl font-bold text-slate-100">#{questionCount}</h2>
        </div>

        <button 
            onClick={toggleTts}
            className={`p-3 rounded-full transition-all border ${
                isTtsEnabled 
                ? "bg-slate-800 text-cyan-400 border-cyan-500/50 shadow-lg shadow-cyan-900/20" 
                : "bg-slate-900 text-slate-500 border-slate-700 hover:border-slate-500"
            }`}
        >
            {isTtsEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>

      {/* ────────────────────────────────────────────────── */}
      {/* CENTER: Question Text (Karaoke OR Clean Text) */}
      {/* ────────────────────────────────────────────────── */}
      <div className="w-full flex-grow flex items-center justify-center mb-10">
        {currentQuestion && (
            showKaraokeMode ? (
                // ✅ KARAOKE MODE (Has its own box styling in component)
                <div className="w-full">
                    <KaraokeText 
                        text={currentQuestion} 
                        isPlaying={isPlaying} 
                        audioRef={audioRef} 
                    />
                </div>
            ) : (
                // ✅ STATIC MODE (Box Removed - Just Text)
                <div className="w-full px-4">
                    <p className="text-xl md:text-2xl leading-relaxed text-slate-200 font-medium text-center">
                        {currentQuestion}
                    </p>
                </div>
            )
        )}
      </div>

      {/* ────────────────────────────────────────────────── */}
      {/* BOTTOM: Visualizer & Button */}
      {/* ────────────────────────────────────────────────── */}
      <div className="w-full flex flex-col items-center justify-end space-y-6">
        
        {/* Visualizer */}
        <div className="h-24 flex items-center justify-center">
            {isAIThinking ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-blue-400">
                <BrainCircuit size={60} />
                <p className="mt-2 text-sm font-bold animate-pulse tracking-widest">ANALYZING</p>
            </motion.div>
            ) : isRecording ? (
            <div className="flex flex-col items-center text-red-500">
                <div className="relative">
                    <Mic size={60} />
                    <motion.div 
                        className="absolute inset-0 rounded-full border-4 border-red-500" 
                        animate={{ scale: [1, 1.4], opacity: [1, 0] }} 
                        transition={{ repeat: Infinity, duration: 1 }} 
                    />
                </div>
                <p className="mt-2 text-sm font-bold tracking-widest">LISTENING</p>
            </div>
            ) : (
            <div className="flex flex-col items-center text-slate-500 opacity-60">
                <MicOff size={60} />
                <p className="mt-2 text-sm font-medium">Ready</p>
            </div>
            )}
        </div>

        {/* Volume Bar */}
        <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <motion.div 
            className={`h-full ${isAIThinking ? 'bg-blue-500' : 'bg-green-500'}`}
            animate={{ width: isAIThinking ? "100%" : `${Math.min(volume * 2, 100)}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
            />
        </div>

        {/* Done Button */}
        <button
            onClick={handleManualStop}
            disabled={!hasSpoken || isAIThinking}
            className={`flex items-center gap-2 px-10 py-4 rounded-full font-bold text-lg transition-all shadow-lg ${
                hasSpoken && !isAIThinking 
                ? "bg-green-600 text-white hover:bg-green-500 hover:scale-105 shadow-green-900/20" 
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
        >
            <CheckCircle size={22} />
            I'm Done Speaking
        </button>

      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
}