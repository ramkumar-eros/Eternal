// src/components/common/AudioPlayer.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAudio } from '../../context/AudioContext';

const AudioPlayer = () => {
  const { isPlaying, volume, toggleAudio, setAudioVolume } = useAudio();
  const [isControlVisible, setIsControlVisible] = useState(false);

  return (
    <AudioControlContainer>
      <AudioButton 
        onClick={() => setIsControlVisible(!isControlVisible)}
        isPlaying={isPlaying}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isPlaying ? (
            <>
              <line x1="11" y1="5" x2="11" y2="19"></line>
              <line x1="18" y1="5" x2="18" y2="19"></line>
            </>
          ) : (
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          )}
        </svg>
      </AudioButton>
      
      {isControlVisible && (
        <VolumeControl>
          <VolumeSlider 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
          />
          <VolumeButton onClick={toggleAudio}>
            {isPlaying ? 'Pause' : 'Play'} Music
          </VolumeButton>
        </VolumeControl>
      )}
    </AudioControlContainer>
  );
};

// Styled Components
const AudioControlContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const AudioButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.isPlaying ? 
    'linear-gradient(135deg, #4B8FD5, #5BC0BE)' : 
    'linear-gradient(135deg, #5BC0BE, #78D672)'};
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 7px 20px rgba(0, 0, 0, 0.4);
  }
  
  &:active {
    transform: translateY(0) scale(0.95);
  }
  
  svg {
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
  }
`;

const VolumeControl = styled.div`
  background: rgba(15, 20, 30, 0.8);
  backdrop-filter: blur(10px);
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(75, 143, 213, 0.2);
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const VolumeSlider = styled.input`
  -webkit-appearance: none;
  width: 150px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  border-radius: 2px;
  margin-bottom: 10px;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #5BC0BE;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(91, 192, 190, 0.5);
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #5BC0BE;
    cursor: pointer;
    border: none;
    box-shadow: 0 0 5px rgba(91, 192, 190, 0.5);
  }
`;

const VolumeButton = styled.button`
  background: linear-gradient(135deg, #4B8FD5, #5BC0BE);
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background: linear-gradient(135deg, #5BC0BE, #4B8FD5);
    transform: translateY(-2px);
  }
`;

export default AudioPlayer;