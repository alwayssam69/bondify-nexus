
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProfileData } from "../Step2ProfileSchema";

interface LoadingAnimationProps {
  profileData: ProfileData;
  onLoadComplete: () => void;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  profileData, 
  onLoadComplete 
}) => {
  const [typingText, setTypingText] = useState("");
  
  useEffect(() => {
    // Simulate typing effect
    const phrases = [
      "Analyzing your profile...",
      "Finding professionals that match your interests...",
      "Discovering connections in " + profileData.location + "...",
      "Looking for experts in " + profileData.industry + "...",
      "Finalizing your personalized recommendations...",
    ];
    
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let timeoutId: NodeJS.Timeout;
    
    const type = () => {
      if (currentPhraseIndex >= phrases.length) {
        // Finished typing all phrases, load matches
        onLoadComplete();
        return;
      }
      
      const currentPhrase = phrases[currentPhraseIndex];
      
      if (currentCharIndex < currentPhrase.length) {
        setTypingText(currentPhrase.substring(0, currentCharIndex + 1));
        currentCharIndex++;
        timeoutId = setTimeout(type, 50);
      } else {
        // Move to the next phrase after a delay
        timeoutId = setTimeout(() => {
          currentPhraseIndex++;
          currentCharIndex = 0;
          timeoutId = setTimeout(type, 100);
        }, 800);
      }
    };
    
    timeoutId = setTimeout(type, 300);
    
    return () => clearTimeout(timeoutId);
  }, [profileData, onLoadComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-16 h-16 mb-6">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary border-opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <motion.div
        className="text-lg font-medium text-center mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {typingText}
      </motion.div>
    </div>
  );
};

export default LoadingAnimation;
