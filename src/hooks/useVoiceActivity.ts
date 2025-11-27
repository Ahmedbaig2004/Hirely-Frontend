import { useState, useEffect, useRef } from "react";

export const useVoiceActivity = (isAIThinking: boolean) => {
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 1. REF TRACKING (Fixes the Stale Closure bug)
  const isAIThinkingRef = useRef(isAIThinking);

  // Sync the Ref whenever the prop changes
  useEffect(() => {
    isAIThinkingRef.current = isAIThinking;
  }, [isAIThinking]);

  // ⚙️ CONFIG
  const SILENCE_DURATION = 3000;
  const MIN_VOLUME = 15;

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      const checkVolume = () => {
        // 2. USE REF HERE (Reads the LIVE value, not the old one)
        if (isAIThinkingRef.current) {
          setVolume(0); // Zero out volume on UI
          requestAnimationFrame(checkVolume);
          return;
        }

        // Safety: Resume audio context if browser suspended it
        if (audioContext.state === "suspended") {
          audioContext.resume();
        }

        analyzer.getByteFrequencyData(dataArray);
        const currentVol = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(currentVol);

        // A. TALKING
        if (currentVol > MIN_VOLUME) {
          if (mediaRecorder.state === "inactive") {
            console.log("🎤 Started Recording...");
            mediaRecorder.start();
            setIsRecording(true);
          }
          if (silenceTimer.current) {
            clearTimeout(silenceTimer.current);
            silenceTimer.current = null;
          }
        }
        // B. SILENCE
        else if (mediaRecorder.state === "recording") {
          if (!silenceTimer.current) {
            silenceTimer.current = setTimeout(() => {
              stopAndReturnAudio();
            }, SILENCE_DURATION);
          }
        }

        requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      console.error("Mic Error:", err);
    }
  };

  const stopAndReturnAudio = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      console.log("🛑 3s Silence -> Stopping.");
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
  };

  const getAudioBlob = () => {
    return new Blob(audioChunksRef.current, { type: "audio/webm" });
  };

  const resetRecorder = () => {
    audioChunksRef.current = [];
    setIsRecording(false);
  };

  // Force stop if AI starts thinking (Safety Valve)
  useEffect(() => {
    if (isAIThinking) {
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    }
  }, [isAIThinking]);

  useEffect(() => {
    startListening();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return { isRecording, volume, getAudioBlob, resetRecorder };
};
