import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface KaraokeTextProps {
  text: string;
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export const KaraokeText = ({ text, isPlaying, audioRef }: KaraokeTextProps) => {
  const words = text.split(" ");
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    // 1. If Audio is NOT playing, reset to show ALL text immediately.
    // This fixes the "Black Box" issue when toggling TTS on manually.
    if (!isPlaying) {
      setCurrentIndex(words.length); 
      return;
    }

    // 2. If Audio IS playing, sync text to audio time
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
        const duration = audio.duration || 1;
        const currentTime = audio.currentTime;
        const progress = currentTime / duration;
        
        // Map progress to word index
        const index = Math.floor(progress * words.length);
        setCurrentIndex(index);
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, [isPlaying, words.length]); // Re-run when play state changes

  return (
    <div className="w-full px-4"> 
      {/* Kept wrapper consistent with Static Text padding */}
      <p className="text-xl md:text-2xl leading-relaxed font-medium flex flex-wrap justify-center gap-x-2 gap-y-1">
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ 
              // 🚨 THE FIX:
              // If not playing (currentIndex = length), show full text (1).
              // If playing, follow the index logic.
              opacity: i <= currentIndex ? 1 : 0, 
              y: i <= currentIndex ? 0 : 5,
              scale: (isPlaying && i === currentIndex) ? 1.05 : 1, // Only pop if actually playing
              color: (isPlaying && i === currentIndex) ? "#22d3ee" : "#e2e8f0" // Cyan active, Slate inactive
            }}
            transition={{ duration: 0.2 }}
            className="transition-colors duration-200"
          >
            {word}
          </motion.span>
        ))}
      </p>
    </div>
  );
};