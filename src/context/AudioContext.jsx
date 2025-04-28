// src/context/AudioContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// Create a global audio element to ensure it persists between renders
let globalAudio = null;

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Create the audio element only once globally
    if (!globalAudio) {
      globalAudio = new Audio('/audio/meditation.mp3');
      globalAudio.loop = true;
      globalAudio.volume = 0.3;
      
      // Try to play on first load
      const playPromise = globalAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Autoplay prevented:', error);
          
          // Add one-time event listener to enable audio on first user interaction
          const enableAudio = () => {
            globalAudio.play().catch(e => console.error('Play error:', e));
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('touchstart', enableAudio);
          };
          
          document.addEventListener('click', enableAudio, { once: true });
          document.addEventListener('touchstart', enableAudio, { once: true });
        });
      }
    }
    
    // Store reference to the global audio
    audioRef.current = globalAudio;
    
    // Apply current mute state
    audioRef.current.muted = isMuted;
    
    // Clean up function doesn't pause audio to maintain continuity
    return () => {};
  }, []);

  // Ensure mute state is applied whenever it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Toggle mute state
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // For compatibility with existing components
  const startAudio = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(e => console.error('Play error:', e));
    }
  };

  const value = {
    isMuted,
    toggleMute,
    startAudio
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContext;