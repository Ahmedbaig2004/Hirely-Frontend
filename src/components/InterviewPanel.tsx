"use client";

import { useEffect, useState, useRef } from "react";
import { Mic, MicOff, BrainCircuit, CheckCircle } from "lucide-react";
import { useVoiceActivity } from "../hooks/useVoiceActivity";
import { useInterviewStore } from "../stores/useInterviewStore"
import { useRouter } from "next/navigation"; // <--- 1. IMPORT ROUTER;
import axios from "axios";
import { motion } from "framer-motion";

export default function InterviewPanel() {
  const router = useRouter(); // <--- 2. INITIALIZE ROUTER
  const { sessionId, currentQuestion, setQuestion, setFeedback } = useInterviewStore();
  
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);

  // Hook
  const { isRecording, volume, getAudioBlob, resetRecorder, stopRecordingManual } = useVoiceActivity(isAIThinking);
  const prevRecordingState = useRef(false);

  // 1. Detect Speech for Button State
  useEffect(() => {
    if (isRecording) setHasSpoken(true);
  }, [isRecording]);

  // 2. Watch for AUTO-STOP (Silence) only
  useEffect(() => {
    // Only trigger if we are NOT manually stopping (manual handled by click handler)
    if (!isAIThinking && prevRecordingState.current === true && isRecording === false) {
      console.log("🤖 Auto-Submitting due to silence...");
      handleSubmission();
    }
    prevRecordingState.current = isRecording;
  }, [isRecording]);

  // 3. Unified Submission Logic
  // Accepts an optional blob (from manual stop)
  const handleSubmission = async (manualBlob?: Blob) => {
    const audioBlob = manualBlob || getAudioBlob();
    
    if (audioBlob.size < 5000) {
        console.log("⚠️ Audio too short ("+audioBlob.size+"), ignoring.");
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
      
      const feedbackText = res.data.evaluation.feedback;
      const nextQ = res.data.nextQuestion?.question;
      const isDone = res.data.isFinished;

      // 1. Show Feedback immediately
      setFeedback(feedbackText); 

      // 2. Move to Next Question immediately (No Speaking)
      if (!isDone) {
          setQuestion(nextQ);
      } else {
        router.replace(`/dashboard/${sessionId}`); // <--- 3. REDIRECT TO DASHBOARD;
      }
      
      // 3. Unlock Mic immediately
      resetRecorder();
      setIsAIThinking(false);

    } catch (err) {
      console.error(err);
      setIsAIThinking(false);
      resetRecorder();
    }
  };

  // 4. Manual Button Handler (Async)
  const handleManualStop = async () => {
    // 🛑 Prevent double submission
    if (isAIThinking) return;

    // 1. Force Stop & Get Blob
    const blob = await stopRecordingManual();
    
    // 2. Submit Immediately
    console.log("👤 Manual Submit Clicked");
    await handleSubmission(blob);
  };

  

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl p-6">
      
      {/* Visualizer */}
      <div className="mb-10 relative h-32 flex items-center justify-center">
        {isAIThinking ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-blue-400">
            <BrainCircuit size={80} />
            <p className="mt-4 text-xl font-bold animate-pulse">ANALYZING...</p>
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

      {/* Manual Button */}
      <button
        onClick={handleManualStop}
        disabled={!hasSpoken || isAIThinking}
        className={`
          flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all
          ${hasSpoken && !isAIThinking 
            ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20 cursor-pointer transform hover:scale-105 active:scale-95" 
            : "bg-slate-800 text-slate-500 cursor-not-allowed"}
        `}
      >
        <CheckCircle size={20} />
        I'm Done Speaking
      </button>

      <p className="mt-4 text-slate-500 text-sm">
        {isAIThinking ? "Generating feedback..." : "Wait 3s or click 'Done' to submit."}
      </p>

    </div>
  );
}