"use client";

import { useEffect, useState, useRef } from "react";
import { Mic, MicOff, BrainCircuit } from "lucide-react";
import { useVoiceActivity } from "../hooks/useVoiceActivity";
import { useInterviewStore } from "../stores/useInterviewStore";
import axios from "axios";
import { motion } from "framer-motion";

export default function InterviewPanel() {
  const { sessionId, currentQuestion, setQuestion, setFeedback } =
    useInterviewStore();

  // LOCK STATE
  const [isAIThinking, setIsAIThinking] = useState(false);

  // Hook
  const { isRecording, volume, getAudioBlob, resetRecorder } =
    useVoiceActivity(isAIThinking);
  const prevRecordingState = useRef(false);

  // Watch for Recording Stop
  useEffect(() => {
    if (prevRecordingState.current === true && isRecording === false) {
      handleSubmission();
    }
    prevRecordingState.current = isRecording;
  }, [isRecording]);

  const handleSubmission = async () => {
    const audioBlob = getAudioBlob();

    // Ignore garbage noise
    if (audioBlob.size < 5000) {
      resetRecorder(); // <--- WIPE IT if it's too small
      return;
    }

    // 🔒 LOCK INTERFACE
    setIsAIThinking(true);

    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("sessionId", sessionId || "");
    formData.append("question", currentQuestion || "");

    try {
      const res = await axios.post(
        "http://localhost:4000/api/submit-answer",
        formData
      );

      // 1. Get Data
      const feedbackText = res.data.evaluation.feedback;
      const nextQ = res.data.nextQuestion?.question;
      const isDone = res.data.isFinished;

      // 3. Speak -> THEN Unlock
      setFeedback(feedbackText);

      if (!isDone) {
        setQuestion(nextQ);
      } else {
        alert("Interview Finished!");
      }

      resetRecorder();
      setIsAIThinking(false);
    } catch (err) {
      console.error(err);
      setIsAIThinking(false);
      resetRecorder();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl p-6">
      {/* Visualizer Container */}
      <div className="mb-10 relative h-32 flex items-center justify-center">
        {/* State 1: AI Thinking */}
        {isAIThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-blue-400"
          >
            <BrainCircuit size={80} />
            <p className="mt-4 text-xl font-bold animate-pulse">ANALYZING...</p>
          </motion.div>
        )}

        {/* State 2: User Speaking */}
        {!isAIThinking && isRecording && (
          <div className="flex flex-col items-center text-red-500">
            <div className="relative">
              <Mic size={80} />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-red-500"
                animate={{ scale: [1, 1.4], opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            </div>
            <p className="mt-4 text-xl font-bold">LISTENING...</p>
          </div>
        )}

        {/* State 3: Waiting (The 3s Gap) */}
        {!isAIThinking && !isRecording && (
          <div className="flex flex-col items-center text-slate-400 opacity-80">
            <MicOff size={80} />
            <p className="mt-4 text-lg font-medium">Speak when ready...</p>
          </div>
        )}
      </div>

      {/* Volume Bar */}
      <div className="w-96 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
        <motion.div
          className={`h-full ${isAIThinking ? "bg-blue-500" : "bg-green-500"}`}
          animate={{
            width: isAIThinking ? "100%" : `${Math.min(volume * 2, 100)}%`,
          }}
          transition={{ ease: "linear", duration: 0.1 }}
        />
      </div>

      <p className="mt-6 text-slate-500 text-sm">
        {isAIThinking
          ? "Generating feedback..."
          : "Wait 3 seconds after speaking to submit."}
      </p>
    </div>
  );
}
