// src/components/common/SimpleMuteButton.jsx
import React from 'react';
import styled from 'styled-components';
import { useAudio } from '../../context/AudioContext';

const SimpleMuteButton = () => {
  const { isMuted, toggleMute } = useAudio();

  return (
    <AudioButton onClick={toggleMute} isMuted={isMuted}>
      {isMuted ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      )}
    </AudioButton>
  );
};

// Styled Components
const AudioButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.isMuted ? 
    'rgba(20, 20, 30, 0.8)' : 
    'linear-gradient(135deg, #4B8FD5, #5BC0BE)'};
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 20px rgba(0, 0, 0, 0.4);
  }
  
  &:active {
    transform: translateY(0) scale(0.95);
  }
  
  svg {
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
  }
`;

export default SimpleMuteButton;