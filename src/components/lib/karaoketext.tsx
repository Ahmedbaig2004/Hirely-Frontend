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
    if (!isPlaying || !audioRef.current) {
      // When not playing, show everything fully visible (or hide all if you prefer)
      // Usually, when finished, we want to see the full text.
      if (!isPlaying && currentIndex > 0) setCurrentIndex(words.length); 
      return;
    }

    const audio = audioRef.current;
    
    // Calculate duration per word (Simple estimate)
    // A better way is real timestamps, but for a simple hack:
    const updateProgress = () => {
        const duration = audio.duration || 1;
        const currentTime = audio.currentTime;
        const progress = currentTime / duration;
        
        // Map progress (0.0 to 1.0) to word index
        const index = Math.floor(progress * words.length);
        setCurrentIndex(index);
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, [isPlaying, words.length]);

  return (
    <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm min-h-[100px]">
      <p className="text-xl leading-relaxed font-medium flex flex-wrap gap-2">
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              // 1. If index is passed: Show fully (100%)
              // 2. If index is future: Hide completely (0%)
              opacity: i <= currentIndex ? 1 : 0, 
              
              // Optional: Add a subtle pop-up effect when it appears
              y: i <= currentIndex ? 0 : 5,
              scale: i === currentIndex ? 1.1 : 1, // Current word pops slightly
            }}
            transition={{ duration: 0.2 }}
            className={`transition-colors duration-200 ${
                i === currentIndex ? "text-cyan-400" : "text-slate-200"
            }`}
          >
            {word}
          </motion.span>
        ))}
      </p>
    </div>
  );
};