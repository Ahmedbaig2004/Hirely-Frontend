import { useState, useEffect, useRef } from "react";

export const useVoiceActivity = (
  isAIThinking: boolean,
  interviewMode: string,
  selectedMicId?: string | null,
  selectedCameraId?: string | null,
) => {
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(0);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Video-specific refs
  const videoRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  const isAIThinkingRef = useRef(isAIThinking);

  useEffect(() => {
    isAIThinkingRef.current = isAIThinking;
  }, [isAIThinking]);

  const SILENCE_DURATION = 4000;
  const MIN_VOLUME = 15;

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: selectedMicId ? { exact: selectedMicId } : undefined,
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

      mediaRecorder.onstop = () => {
        setIsRecording(false);
      };

      const checkVolume = () => {
        if (isAIThinkingRef.current) {
          setVolume(0);
          requestAnimationFrame(checkVolume);
          return;
        }

        if (audioContext.state === "suspended") {
          audioContext.resume();
        }

        analyzer.getByteFrequencyData(dataArray);
        const currentVol = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(currentVol);

        if (currentVol > MIN_VOLUME) {
          if (mediaRecorder.state === "inactive") {
            audioChunksRef.current = [];
            mediaRecorder.start();
            setIsRecording(true);
          }

          if (silenceTimer.current) {
            clearTimeout(silenceTimer.current);
            silenceTimer.current = null;
          }
        } else if (mediaRecorder.state === "recording") {
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
      mediaRecorderRef.current.stop();
    }
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
  };

  const stopRecordingManual = (): Promise<Blob> => {
    return new Promise((resolve) => {
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
        silenceTimer.current = null;
      }

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.addEventListener(
          "stop",
          () => {
            const blob = new Blob(audioChunksRef.current, {
              type: "audio/webm",
            });
            resolve(blob);
          },
          { once: true },
        );
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

  // Safety valve: stop recording when AI starts thinking
  useEffect(() => {
    if (isAIThinking) {
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    }
  }, [isAIThinking]);

  // Video stream management
  const startVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedCameraId ? { exact: selectedCameraId } : undefined,
          width: 640,
          height: 480,
          facingMode: "user",
        },
        audio: false,
      });
      videoStreamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current
          .play()
          .catch((err: unknown) => {
            const name =
              err instanceof DOMException ? err.name : (err as Error)?.name;
            const msg = err instanceof Error ? err.message : "";
            if (
              name === "AbortError" ||
              msg.toLowerCase().includes("interrupted")
            )
              return;
            console.warn("Video play error:", err);
          });
      }
      setIsCameraReady(true);
    } catch (err) {
      console.error("Camera Error:", err);
    }
  };

  const startVideoRecording = () => {
    if (!videoStreamRef.current) return;
    const audioTracks = streamRef.current?.getAudioTracks() || [];
    const videoTracks = videoStreamRef.current.getVideoTracks();
    const combinedStream = new MediaStream([...videoTracks, ...audioTracks]);

    const supportedMime = MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
      ? "video/webm;codecs=vp8"
      : "video/webm";
    const recorder = new MediaRecorder(combinedStream, {
      mimeType: supportedMime,
    });
    videoRecorderRef.current = recorder;
    videoChunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) videoChunksRef.current.push(e.data);
    };
    recorder.onstop = () => {};
    recorder.start();
  };

  const stopVideoRecording = (): Promise<Blob> => {
    return new Promise((resolve) => {
      if (videoRecorderRef.current?.state === "recording") {
        videoRecorderRef.current.addEventListener(
          "stop",
          () => {
            const blob = new Blob(videoChunksRef.current, {
              type: "video/webm",
            });
            resolve(blob);
          },
          { once: true },
        );
        videoRecorderRef.current.stop();
      } else {
        resolve(new Blob([], { type: "video/webm" }));
      }
    });
  };

  const setVideoPreviewElement = (el: HTMLVideoElement | null) => {
    videoPreviewRef.current = el;

    // Check if the element exists AND if we have a stream
    if (el && videoStreamRef.current) {
      if (el.srcObject !== videoStreamRef.current) {
        el.srcObject = videoStreamRef.current;
        el.play().catch((err: unknown) => {
          const name =
            err instanceof DOMException ? err.name : (err as Error)?.name;
          const msg = err instanceof Error ? err.message : "";
          if (
            name === "AbortError" ||
            msg.toLowerCase().includes("interrupted")
          )
            return;
          console.warn("Video play error:", err);
        });
      }
      setIsCameraReady(true);
    }
  };

  // Initialize based on mode; re-run when device selection changes
  useEffect(() => {
    // Stop existing tracks before acquiring new streams
    streamRef.current?.getTracks().forEach((t) => t.stop());
    videoStreamRef.current?.getTracks().forEach((t) => t.stop());

    if (interviewMode === "audio" || interviewMode === "video") {
      startListening();
    }
    if (interviewMode === "video") {
      startVideoStream();
    }
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      videoStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [interviewMode, selectedMicId, selectedCameraId]);

  return {
    isRecording,
    volume,
    isCameraReady,
    getAudioBlob,
    resetRecorder,
    stopRecordingManual,
    startVideoRecording,
    stopVideoRecording,
    setVideoPreviewElement,
  };
};
