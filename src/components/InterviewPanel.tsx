"use client";

import { useEffect, useState, useRef } from "react";
import { Mic, MicOff, BrainCircuit, CheckCircle } from "lucide-react";
import { useVoiceActivity } from "../hooks/useVoiceActivity";
import { useInterviewStore } from "../stores/useInterviewStore";
import { useRouter } from "next/navigation"; 
import axios from "axios";
import { motion } from "framer-motion";

export default function InterviewPanel() {
  const router = useRouter(); 
  const { sessionId, currentQuestion, setQuestion, setFeedback,firstQuestionAudio,        // <--- GET AUDIO
    setFirstQuestionAudio  } = useInterviewStore();
  
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);

  // Hook
  const { isRecording, volume, getAudioBlob, resetRecorder, stopRecordingManual } = useVoiceActivity(isAIThinking);
  const prevRecordingState = useRef(false);

  useEffect(() => {
    if (firstQuestionAudio) {
        console.log("🔊 Found startup audio. Playing...");
        
        // 1. Lock Interface (AI is Thinking/Speaking)
        setIsAIThinking(true); 
        
        // 2. Play it
        playAudio(firstQuestionAudio);
        
        // 3. Clear it from store so it doesn't play again on refresh
        setFirstQuestionAudio(null);
    }
  }, []); // Empty dependency array = Runs once on mount
  // 1. Detect Speech for Button State
  useEffect(() => {
    if (isRecording) setHasSpoken(true);
  }, [isRecording]);

  // 2. Watch for AUTO-STOP (Silence) only
  useEffect(() => {
    if (!isAIThinking && prevRecordingState.current === true && isRecording === false) {
      console.log("🤖 Auto-Submitting due to silence...");
      handleSubmission();
    }
    prevRecordingState.current = isRecording;
  }, [isRecording]);

  // 3. Play Deepgram Audio (MP3)
  // This function locks the interface until audio finishes
  const playAudio = (base64String: string) => {
    try {
      const audio = new Audio(`data:audio/mp3;base64,${base64String}`);
      
      // 🔒 MIC REMAINS LOCKED (isAIThinking is true)
      
      audio.onended = () => {
        console.log("✅ Audio finished. Unlocking Mic.");
        // 🔓 UNLOCK MIC NOW
        resetRecorder();
        setIsAIThinking(false);
      };

      audio.onerror = (e) => {
        console.error("Audio playback error", e);
        // Safety unlock if audio fails
        resetRecorder();
        setIsAIThinking(false);
      };

      audio.play();
    } catch (e) {
      console.error("Audio setup error", e);
      setIsAIThinking(false);
    }
  };

  // 4. Unified Submission Logic
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
      
      const { evaluation, nextQuestion, isFinished, audio } = res.data;

      // Update UI Text
      setFeedback(evaluation.feedback); 

      if (isFinished) {
          // 🏁 FINISHED: Redirect to Dashboard Result
          router.replace(`/dashboard/${sessionId}`);
          return;
      }

      setQuestion(nextQuestion?.question);

      // 🔊 PLAY AUDIO IF AVAILABLE
      if (audio) {
          playAudio(audio); 
          // Note: playAudio handles unlocking setIsAIThinking(false) when done
      } else {
          // Fallback if no audio: Unlock immediately
          console.warn("No audio received from backend.");
          resetRecorder();
          setIsAIThinking(false);
      }

    } catch (err) {
      console.error(err);
      setIsAIThinking(false);
      resetRecorder();
    }
  };

  // 5. Manual Button Handler
  const handleManualStop = async () => {
    if (isAIThinking) return;
    const blob = await stopRecordingManual();
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