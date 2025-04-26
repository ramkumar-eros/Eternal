// src/components/Auth/SignupStyles.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Container and Background
export const SignupContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #050b14;
  overflow: hidden;
  position: relative;
`;

export const CosmicBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
  background: radial-gradient(ellipse at bottom, #0d1423 0%, #020307 100%);
`;

export const StarField = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(2px 2px at 20px 30px, #eef 100%, transparent),
                    radial-gradient(2px 2px at 40px 70px, #fff 100%, transparent),
                    radial-gradient(1px 1px at 90px 40px, #ddf 100%, transparent),
                    radial-gradient(2px 2px at 160px 120px, #fff 100%, transparent);
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.3;
  animation: twinkle 5s infinite;
  
  @keyframes twinkle {
    0% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 0.3;
    }
  }
`;

export const OrbFloat = styled.div`
  position: absolute;
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: 50%;
  top: ${props => props.top};
  left: ${props => props.left};
  background: radial-gradient(circle, ${props => props.color}20 0%, ${props => props.color}05 60%, transparent 70%);
  filter: blur(20px);
  opacity: 0.6;
  z-index: 1;
  animation: float 15s infinite ease-in-out;
  
  @keyframes float {
    0% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-20px) scale(1.05);
    }
    100% {
      transform: translateY(0) scale(1);
    }
  }
`;

// Left Section
export const LeftSection = styled.div`
  flex: 1.2;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
`;

export const LogoContainer = styled.div`
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 3;
  
  img {
    height: 40px;
    width: auto;
  }
`;

export const LogoText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #4AA5FF, #4ADEDE);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
`;

export const SignupImageWrapper = styled.div`
  position: relative;
  width: 85%;
  max-width: 550px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
`;

export const SignupImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 20px;
  transform: scale(1.02);
  transition: transform 1s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const PortalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, transparent 30%, rgba(0, 12, 24, 0.7) 100%);
  border-radius: 20px;
`;

export const WelcomeText = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 3rem 2rem 2rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const WelcomeHeading = styled.h2`
  color: white;
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
`;

export const WelcomeSubtext = styled.p`
  color: #a9d8ff;
  font-size: 1rem;
  margin: 0;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.7);
`;

// Right Section
export const RightSection = styled.div`
  flex: 0.8;
  background: linear-gradient(135deg, rgba(26, 51, 42, 0.8) 0%, rgba(22, 70, 96, 0.8) 100%);
  backdrop-filter: blur(10px);
  border-radius: 40px 0 0 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
`;

export const SignupForm = styled.form`
  width: 85%;
  max-width: 450px;
  padding: 2.5rem 2rem;
`;

export const SignupHeader = styled.h2`
  color: white;
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  background: linear-gradient(90deg, #FFFFFF, #4ADEDE);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const SignupSubheader = styled.p`
  color: #a9d8ff;
  font-size: 1rem;
  margin-bottom: 2rem;
  font-weight: 300;
`;

// Progress Bar
export const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
`;

export const ProgressLine = styled.div`
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, #4AA5FF, #4ADEDE);
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: ${props => props.width};
  transition: width 0.5s ease;
  z-index: 1;
`;

export const ProgressDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#4ADEDE' : '#2A3F57'};
  border: 3px solid ${props => props.active ? '#4ADEDE' : '#2A3F57'};
  z-index: 2;
  transition: all 0.3s ease;
  ${props => props.current && `
    box-shadow: 0 0 0 4px rgba(74, 222, 222, 0.3);
    transform: scale(1.2);
  `}
`;

export const StepContainer = styled.div`
  animation: fadeIn 0.5s ease-out;
  
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

// Form Elements
export const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const InputLabel = styled.label`
  display: block;
  color: #d1e9ff;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
`;

export const IconInput = styled.div`
  position: relative;
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #4ADEDE;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 2.8rem;
  border-radius: 12px;
  border: 1px solid rgba(74, 222, 222, 0.2);
  background-color: rgba(14, 26, 47, 0.5);
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4AA5FF;
    box-shadow: 0 0 0 2px rgba(74, 165, 255, 0.2);
  }
  
  &::placeholder {
    color: #6d90b9;
  }
`;

export const PasswordToggle = styled.span`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #4ADEDE;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

// Buttons
export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
`;

export const NextButton = styled.button`
  flex: 1;
  padding: 1rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #4AA5FF, #4ADEDE);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(90deg, #3994f0, #3bc9c9);
    box-shadow: 0 5px 15px rgba(74, 165, 255, 0.4);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const BackButton = styled.button`
  flex: 0.4;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(74, 222, 222, 0.3);
  background-color: transparent;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(74, 222, 222, 0.1);
  }
`;

export const SubmitButton = styled.button`
  flex: 0.6;
  padding: 1rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #4AA5FF, #4ADEDE);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: linear-gradient(90deg, #3994f0, #3bc9c9);
    box-shadow: 0 5px 15px rgba(74, 165, 255, 0.4);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(45deg);
    animation: shine 3s infinite;
  }
  
  @keyframes shine {
    0% {
      left: -50%;
      top: -50%;
    }
    100% {
      left: 150%;
      top: 150%;
    }
  }
  
  &:disabled {
    background: #2a3f57;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
    
    &:before {
      display: none;
    }
  }
`;

export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Gender Selection
export const GenderGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const GenderOptions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const RadioCard = styled.div`
  flex: 1;
  min-width: 100px;
`;

export const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + label {
    background: linear-gradient(135deg, rgba(74, 165, 255, 0.2), rgba(74, 222, 222, 0.2));
    border-color: #4ADEDE;
    color: white;
    
    span {
      color: #4ADEDE;
    }
  }
`;

export const RadioLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background-color: rgba(14, 26, 47, 0.5);
  border: 1px solid rgba(74, 222, 222, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #d1e9ff;
  font-weight: 500;
  gap: 0.5rem;
  
  &:hover {
    background-color: rgba(74, 222, 222, 0.1);
  }
`;

export const GenderIcon = styled.span`
  color: #4AA5FF;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Date and Time
export const DateTimeContainer = styled.div`
  margin-bottom: 1.5rem;
`;


export const DateIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #4ADEDE;
  z-index: 1;
`;


export const TimeOption = styled.div`
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
  background-color: ${props => props.active ? 'rgba(74, 165, 255, 0.5)' : 'transparent'};
  color: ${props => props.active ? 'white' : '#a9d8ff'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? 'rgba(74, 165, 255, 0.5)' : 'rgba(74, 165, 255, 0.2)'};
  }
`;

// Additional Data Section
export const AdditionalDataContainer = styled.div`
  margin-bottom: 1rem;
`;

export const OptionalTag = styled.span`
  font-size: 0.75rem;
  color: #a9d8ff;
  font-weight: normal;
  opacity: 0.7;
  margin-left: 0.5rem;
`;

// Voice recording
export const VoiceRecordButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 1px solid ${props => props.isRecording ? 'rgba(255, 107, 107, 0.5)' : 'rgba(74, 222, 222, 0.2)'};
  background-color: ${props => props.isRecording ? 'rgba(255, 107, 107, 0.1)' : 'rgba(14, 26, 47, 0.5)'};
  color: ${props => props.isRecording ? '#ff6b6b' : '#d1e9ff'};
  font-size: 1rem;
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.isRecording ? 'rgba(255, 107, 107, 0.2)' : 'rgba(74, 222, 222, 0.1)'};
  }
`;

export const MicIcon = styled.span`
  color: #4AA5FF;
  display: flex;
  align-items: center;
`;

export const PulsingDot = styled.div`
  width: 12px;
  height: 12px;
  background-color: #ff6b6b;
  border-radius: 50%;
  animation: pulse-red 1.5s infinite;
  
  @keyframes pulse-red {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(255, 107, 107, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
    }
  }
`;

export const PlayIcon = styled.span`
  color: #4ADEDE;
  display: flex;
  align-items: center;
`;

export const AudioPreview = styled.div`
  margin-top: 0.7rem;
  background-color: rgba(14, 26, 47, 0.5);
  border-radius: 12px;
  padding: 0.5rem;
  border: 1px solid rgba(74, 222, 222, 0.2);
  
  audio {
    width: 100%;
    height: 35px;
    outline: none;
  }
  
  audio::-webkit-media-controls-panel {
    background-color: rgba(14, 26, 47, 0.8);
  }
  
  audio::-webkit-media-controls-current-time-display,
  audio::-webkit-media-controls-time-remaining-display {
    color: white;
  }
`;

// Profile Upload
export const ProfileUploadContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const UploadButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
`;

export const ProfilePreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #4ADEDE;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), 0 0 0 5px rgba(74, 222, 222, 0.2);
  transition: all 0.3s ease;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4), 0 0 0 5px rgba(74, 222, 222, 0.3);
  }
`;

export const UploadPlaceholder = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(14, 26, 47, 0.5), rgba(14, 26, 47, 0.7));
  border: 2px dashed rgba(74, 222, 222, 0.4);
  color: #d1e9ff;
  transition: all 0.3s ease;
  gap: 0.5rem;
  
  &:hover {
    background: linear-gradient(135deg, rgba(14, 26, 47, 0.7), rgba(14, 26, 47, 0.9));
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

export const UploadIcon = styled.div`
  color: #4ADEDE;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UploadText = styled.span`
  font-size: 0.8rem;
  color: #a9d8ff;
`;

// Login link and messages
export const LoginText = styled.div`
  text-align: center;
  color: #a9d8ff;
  font-size: 0.9rem;
  margin-top: 1.5rem;
`;

export const LoginLink = styled(Link)`
  color: #4ADEDE;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    text-decoration: underline;
    color: white;
  }
`;

export const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border-left: 3px solid #ff6b6b;
  padding: 0.8rem 1rem;
  margin-bottom: 1.5rem;
  border-radius: 0 8px 8px 0;
  font-size: 0.9rem;
`;

export const SuccessMessage = styled.div`
  color: #4ADEDE;
  background: rgba(74, 222, 222, 0.1);
  border-left: 3px solid #4ADEDE;
  padding: 0.8rem 1rem;
  margin-bottom: 1.5rem;
  border-radius: 0 8px 8px 0;
  font-size: 0.9rem;
`;

// Add these styles to your SignupStyles.js file

// Updated DateTimeGrid for vertical layout
export const DateTimeGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

// Updated DatePickerContainer with improved full view
export const DatePickerContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 16px;
  
  .react-datepicker-wrapper {
    width: 100%;
  }
  
  .react-datepicker-popper {
    z-index: 10;
  }
  
  .react-datepicker {
    font-family: 'Inter', sans-serif;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border: 1px solid #4ADEDE;
    background-color: #1a242d;
    width: 100%;
    min-width: 320px;
  }
  
  .react-datepicker__month-container {
    background-color: #1a242d;
    color: white;
    width: 100%;
  }
  
  .react-datepicker__header {
    background-color: #1a242d;
    border-bottom: 1px solid #4AA5FF;
    color: white;
    padding: 12px 0;
  }
  
  .react-datepicker__current-month {
    color: white;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  .react-datepicker__navigation {
    top: 12px;
  }
  
  .react-datepicker__day-names {
    display: flex;
    justify-content: space-around;
    margin-top: 8px;
  }
  
  .react-datepicker__day-name, 
  .react-datepicker__day, 
  .react-datepicker__time-name {
    color: white;
    width: 40px;
    height: 40px;
    line-height: 40px;
    margin: 0;
    border-radius: 50%;
  }
  
  .react-datepicker__month {
    margin: 0;
    padding: 8px;
  }
  
  .react-datepicker__week {
    display: flex;
    justify-content: space-around;
  }
  
  .react-datepicker__month-select,
  .react-datepicker__year-select {
    background-color: #2a3a4a;
    color: white;
    border-radius: 6px;
    padding: 8px;
    border: 1px solid #4ADEDE;
    cursor: pointer;
    font-size: 14px;
    width: 100%;
    margin: 0 4px;
    max-width: 120px;
  }
  
  .react-datepicker__month-dropdown-container,
  .react-datepicker__year-dropdown-container {
    margin: 0 4px;
  }
  
  .react-datepicker__year-dropdown {
    background-color: #2a3a4a;
    color: white;
    border: 1px solid #4ADEDE;
    border-radius: 8px;
    max-height: 300px;
    overflow-y: auto;
    width: 100%;
    padding: 8px 0;
  }
  
  .react-datepicker__year-option {
    padding: 8px 16px;
    color: white;
    &:hover {
      background-color: rgba(74, 222, 222, 0.2);
    }
  }
  
  .react-datepicker__day:hover {
    background-color: rgba(74, 222, 222, 0.2);
    border-radius: 50%;
  }
  
  .react-datepicker__day--selected {
    background-color: #4ADEDE;
    color: #0a1622;
    border-radius: 50%;
  }
  
  .react-datepicker__day--keyboard-selected {
    background-color: rgba(74, 165, 255, 0.3);
    border-radius: 50%;
  }
  
  .react-datepicker-year-header {
    color: white;
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  /* Navigation styling */
  .react-datepicker__navigation-icon::before {
    border-color: #4ADEDE;
  }
  
  .react-datepicker__navigation:hover *::before {
    border-color: white;
  }
`;

// Updated DatePickerWrapper for better styling
export const DatePickerWrapper = styled.div`
  position: relative;
  width: 100%;
  
  .react-datepicker__input-container input {
    background-color: rgba(255, 255, 255, 0.05);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 16px 16px 16px 48px;
    width: 100%;
    font-size: 16px;
    height: 56px;
    outline: none;
    transition: all 0.3s ease;
    
    &:focus {
      border-color: #4ADEDE;
      box-shadow: 0 0 0 2px rgba(74, 222, 222, 0.2);
    }
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

// Updated TimePickerContainer
export const TimePickerContainer = styled.div`
  width: 100%;
  
  .react-time-picker {
    width: 100%;
  }
  
  .react-time-picker__wrapper {
    border: none;
    background-color: transparent;
    height: 100%;
    display: flex;
    align-items: center;
  }
  
  .react-time-picker__inputGroup {
    min-width: 60px;
    flex-grow: 1;
    position: relative;
    padding-left: 30px;
    padding-right: 90px;
    height: 100%;
    display: flex;
    align-items: center;
  }
  
  .react-time-picker__inputGroup__input {
    color: white;
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 16px;
    height: 30px;
    padding: 0;
    margin: 0;
  }
  
  .react-time-picker__inputGroup__divider {
    color: white;
  }
  
  .react-time-picker__inputGroup__leadingZero {
    color: white;
  }
  
  /* Clock styling */
  .react-clock {
    margin: 10px;
    background-color: #2a3a4a;
    border-radius: 50%;
  }
  
  .react-time-picker__clock {
    background-color: #1a242d;
    border: 1px solid #4ADEDE;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 100;
    margin-top: 10px;
    padding: 10px;
  }
  
  .react-clock__face {
    border: 1px solid #4ADEDE;
    background-color: #2a3a4a;
  }
  
  .react-clock__mark__body {
    background-color: white;
  }
  
  .react-clock__hand__body {
    background-color: #4ADEDE;
  }
  
  .react-clock__second-hand__body {
    background-color: #4AA5FF;
  }
`;

// Updated TimeInput
export const TimeInput = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  height: 56px; /* Match date picker height */
  
  &:focus-within {
    border-color: #4ADEDE;
    box-shadow: 0 0 0 2px rgba(74, 222, 222, 0.2);
  }
`;

// Label styling for separate date and time fields
export const DateTimeLabel = styled(InputLabel)`
  margin-top: 16px;
  margin-bottom: 8px;
  display: block;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
`;

// Updated TimeIcon positioning
export const TimeIcon = styled.span`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

// Updated TimeToggle positioning
export const TimeToggle = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 2px;
  z-index: 2;
`;