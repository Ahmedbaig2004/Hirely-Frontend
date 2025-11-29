import { useState, useEffect, useRef } from "react";

export const useVoiceActivity = (isAIThinking: boolean) => {
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Ref to track state inside the loop
  const isAIThinkingRef = useRef(isAIThinking);

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

      // ✅ GLOBAL LISTENER: Always update UI state on stop
      // We do not overwrite this in manual stop anymore.
      mediaRecorder.onstop = () => {
        setIsRecording(false);
      };

      const checkVolume = () => {
        if (isAIThinkingRef.current) {
           setVolume(0); 
           requestAnimationFrame(checkVolume);
           return;
        }

        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        analyzer.getByteFrequencyData(dataArray);
        const currentVol = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(currentVol);

        // A. TALKING
        if (currentVol > MIN_VOLUME) {
          if (mediaRecorder.state === "inactive") {
            console.log("🎤 Started Recording...");
            
            // ✅ FIX 1: Always clear buffer before starting new recording
            audioChunksRef.current = []; 
            
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
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      console.log("🛑 Silence Timer -> Stopping.");
      mediaRecorderRef.current.stop();
      // setIsRecording(false) triggers automatically via onstop above
    }
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
  };

  // ✅ FIX 2: Use Event Listener instead of overwriting onstop
  const stopRecordingManual = (): Promise<Blob> => {
    return new Promise((resolve) => {
        if (silenceTimer.current) {
            clearTimeout(silenceTimer.current);
            silenceTimer.current = null;
        }

        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            // Add a one-time listener just for this specific stop event
            mediaRecorderRef.current.addEventListener("stop", () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                resolve(blob);
            }, { once: true });

            mediaRecorderRef.current.stop();
        } else {
            resolve(new Blob([], { type: "audio/webm" }));
        }
    });
  };

  const getAudioBlob = () => {
    return new Blob(audioChunksRef.current, { type: "audio/webm" });
  };

  const resetRecorder = () => {
    audioChunksRef.current = [];
    setIsRecording(false);
  };

  // Safety Valve
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

  return { isRecording, volume, getAudioBlob, resetRecorder, stopRecordingManual };
};