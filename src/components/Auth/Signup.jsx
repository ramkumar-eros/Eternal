// src/components/Auth/Signup.jsx
import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import logo from './logo.png';
import signupImage from './signup.png';
import { 
  SignupContainer, CosmicBackground, OrbFloat, StarField,
  LeftSection, LogoContainer, LogoText, SignupImageWrapper, SignupImage, 
  PortalOverlay, WelcomeText, WelcomeHeading, WelcomeSubtext,
  RightSection, SignupForm, SignupHeader, SignupSubheader,
  ProgressBar, ProgressDot, ProgressLine, StepContainer,
  InputGroup, InputLabel, IconInput, StyledInput, InputIcon,
  PasswordToggle, ButtonRow, NextButton, BackButton, SubmitButton,
  LoadingSpinner, GenderGroup, GenderOptions, RadioCard, RadioInput,
  RadioLabel, GenderIcon, DateTimeContainer, DateTimeGrid,
  DatePickerContainer, DatePickerWrapper, DateIcon, TimePickerContainer,
  TimeInput, TimeIcon, TimeToggle, TimeOption, AdditionalDataContainer,
  OptionalTag, VoiceRecordButton, MicIcon, PulsingDot, PlayIcon,
  AudioPreview, ProfileUploadContainer, UploadButton, ProfilePreview,
  UploadPlaceholder, UploadIcon, UploadText, LoginText, LoginLink,
  ErrorMessage, SuccessMessage, DateTimeLabel
} from './SignupStyles';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    emailPhone: '',
    gender: '',
    birthdate: null,
    birthTime: '',
    timeFormat: 'AM',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const fileInputRef = useRef(null);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRadioChange = (e) => {
    setFormData({
      ...formData,
      gender: e.target.value
    });
  };

  const handleTimeFormatChange = (format) => {
    setFormData({
      ...formData,
      timeFormat: format
    });
  };

  // Function to handle date change
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      birthdate: date
    });
  };
  
  // Time input handler with auto-colon formatting
  const handleTimeInputChange = (e) => {
    let value = e.target.value;
    
    // Remove all non-digit characters
    value = value.replace(/[^\d]/g, '');
    
    // Auto-format with colon
    if (value.length > 2) {
      value = `${value.substring(0, 2)}:${value.substring(2, 4)}`;
    }
    
    // Validate hours (00-12)
    if (value.length >= 2) {
      const hours = parseInt(value.substring(0, 2), 10);
      if (hours > 12) {
        value = `12${value.substring(2)}`;
      }
      if (hours === 0) {
        value = `12${value.substring(2)}`;
      }
    }
    
    // Validate minutes (00-59)
    if (value.length > 3) {
      const minutes = parseInt(value.substring(3, 5), 10);
      if (minutes > 59) {
        value = `${value.substring(0, 3)}59`;
      }
    }
    
    // Update form data
    setFormData({
      ...formData,
      birthTime: value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setSuccess('');
  
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
  
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.emailPhone, 
        formData.password
      );
      
      // Update profile with full name
      await updateProfile(userCredential.user, {
        displayName: formData.fullName
      });
      
      // Instead of uploading to Firebase Storage, store file references locally
      if (profileImage) {
        // Save reference to local storage with user ID
        localStorage.setItem(`profile_image_${userCredential.user.uid}`, profileImageURL);
      }
      
      if (audioBlob) {
        // Save reference to local storage with user ID
        localStorage.setItem(`voice_recording_${userCredential.user.uid}`, audioURL);
      }
      
      // Create user document reference
      const userDocRef = doc(db, "users", userCredential.user.uid);
      
      // Prepare user data object
      const userData = {
        fullName: formData.fullName,
        emailPhone: formData.emailPhone,
        gender: formData.gender || "",
        birthdate: formData.birthdate,
        birthTime: formData.birthTime ? `${formData.birthTime} ${formData.timeFormat}` : "",
        createdAt: new Date(),
      };
      
      // Save user data to Firestore
      await setDoc(userDocRef, userData);
      
      setIsLoading(false);
      setSuccess('Account created successfully!');
      
      // Navigate to onboarding after a small delay to show success message
      setTimeout(() => {
        navigate('/onboarding');
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      setError('Failed to create account: ' + error.message);
    }
  };

  // Voice recording functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };
      
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioURL(audioUrl);
      };
      
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      setError("Microphone access denied. Please enable microphone permissions.");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const handleVoiceRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  // Image upload functionality
  const handleImageUpload = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImageURL(URL.createObjectURL(file));
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <SignupContainer>
      <CosmicBackground>
        <OrbFloat top="10%" left="20%" size="200px" color="#4ADEDE" />
        <OrbFloat top="70%" left="10%" size="150px" color="#4AA5FF" />
        <OrbFloat top="30%" left="40%" size="100px" color="#805AD5" />
        <StarField />
      </CosmicBackground>
      
      <LeftSection>
        <LogoContainer>
          <img src={logo} alt="Eternal Logo" />
        </LogoContainer>
        <SignupImageWrapper>
          <SignupImage src={signupImage} alt="Spiritual journey" />
          <PortalOverlay />
          <WelcomeText>
            <WelcomeHeading>Begin Your Spiritual Journey</WelcomeHeading>
            <WelcomeSubtext>Explore your cosmic connection and discover your true self</WelcomeSubtext>
          </WelcomeText>
        </SignupImageWrapper>
      </LeftSection>
      
      <RightSection>
        <SignupForm onSubmit={handleSignup}>
          <SignupHeader>Create Your Account</SignupHeader>
          <SignupSubheader>Your gateway to cosmic discovery</SignupSubheader>
          
          <ProgressBar>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <ProgressDot key={index} active={currentStep > index} current={currentStep === index + 1} />
            ))}
            <ProgressLine width={`${((currentStep - 1) / (totalSteps - 1)) * 100}%`} />
          </ProgressBar>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          {currentStep === 1 && (
            <StepContainer>
              <InputGroup>
                <InputLabel>Full Name</InputLabel>
                <IconInput>
                  <StyledInput
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                  <InputIcon>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </InputIcon>
                </IconInput>
              </InputGroup>

              <InputGroup>
                <InputLabel>Email or Phone</InputLabel>
                <IconInput>
                  <StyledInput
                    type="text"
                    name="emailPhone"
                    placeholder="Enter email or phone number"
                    value={formData.emailPhone}
                    onChange={handleChange}
                    required
                  />
                  <InputIcon>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </InputIcon>
                </IconInput>
              </InputGroup>
              
              <InputGroup>
                <InputLabel>Password</InputLabel>
                <IconInput>
                  <StyledInput
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <PasswordToggle 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    )}
                  </PasswordToggle>
                </IconInput>
              </InputGroup>
              
              <InputGroup>
                <InputLabel>Confirm Password</InputLabel>
                <IconInput>
                  <StyledInput
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </IconInput>
              </InputGroup>
              
              <ButtonRow>
                <NextButton type="button" onClick={nextStep}>
                  Continue
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </NextButton>
              </ButtonRow>
            </StepContainer>
          )}
          
          {currentStep === 2 && (
            <StepContainer>
              <GenderGroup>
                <InputLabel>Gender</InputLabel>
                <GenderOptions>
                  <RadioCard>
                    <RadioInput 
                      type="radio" 
                      name="gender" 
                      id="male" 
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={handleRadioChange}
                    />
                    <RadioLabel htmlFor="male">
                      <GenderIcon>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="5" r="3"></circle>
                          <line x1="12" y1="8" x2="12" y2="21"></line>
                          <line x1="8" y1="16" x2="16" y2="16"></line>
                        </svg>
                      </GenderIcon>
                      Male
                    </RadioLabel>
                  </RadioCard>
                  
                  <RadioCard>
                    <RadioInput 
                      type="radio" 
                      name="gender" 
                      id="female" 
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={handleRadioChange}
                    />
                    <RadioLabel htmlFor="female">
                      <GenderIcon>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="3"></circle>
                          <path d="M12 21v-9"></path>
                          <path d="M9 18h6"></path>
                        </svg>
                      </GenderIcon>
                      Female
                    </RadioLabel>
                  </RadioCard>
                  
                  <RadioCard>
                    <RadioInput 
                      type="radio" 
                      name="gender" 
                      id="other" 
                      value="other"
                      checked={formData.gender === 'other'}
                      onChange={handleRadioChange}
                    />
                    <RadioLabel htmlFor="other">
                      <GenderIcon>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 8v8"></path>
                          <path d="M8 12h8"></path>
                        </svg>
                      </GenderIcon>
                      Other
                    </RadioLabel>
                  </RadioCard>
                </GenderOptions>
              </GenderGroup>
              
              <DateTimeContainer>
                <InputLabel>Birth Information</InputLabel>
                <DateTimeGrid>
                  {/* Date Field */}
                  <div>
  <DateTimeLabel>Birth Date</DateTimeLabel>
  <DatePickerContainer>
    <DatePickerWrapper>
      <DateIcon>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </DateIcon>
      <DatePicker
        selected={formData.birthdate}
        onChange={handleDateChange}
        placeholderText="MM / DD / YYYY"
        dateFormat="MM / dd / yyyy"
        showMonthDropdown
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        dropdownMode="select"
        // Remove popperModifiers that are causing the error
        popperProps={{
          positionFixed: true // Use a simple positioning strategy
        }}
        customInput={
          <StyledInput placeholder="MM / DD / YYYY" />
        }
      />
    </DatePickerWrapper>
  </DatePickerContainer>
</div>         
                  {/* Time Field with auto-colon formatting */}
                  <div>
                    <DateTimeLabel>Birth Time</DateTimeLabel>
                    <TimePickerContainer>
                      <TimeInput>
                        <TimeIcon>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        </TimeIcon>
                        <StyledInput 
                          type="text" 
                          name="birthTime"
                          placeholder="HH:MM"
                          value={formData.birthTime}
                          onChange={handleTimeInputChange}
                          maxLength={5}
                        />
                        <TimeToggle>
                          <TimeOption 
                            active={formData.timeFormat === 'AM'}
                            onClick={() => handleTimeFormatChange('AM')}
                          >
                            AM
                          </TimeOption>
                          <TimeOption 
                            active={formData.timeFormat === 'PM'}
                            onClick={() => handleTimeFormatChange('PM')}
                          >
                            PM
                          </TimeOption>
                        </TimeToggle>
                      </TimeInput>
                    </TimePickerContainer>
                  </div>
                </DateTimeGrid>
              </DateTimeContainer>
              
              <AdditionalDataContainer>
                <InputLabel>Voice Recording <OptionalTag>(optional)</OptionalTag></InputLabel>
                <VoiceRecordButton 
                  type="button" 
                  onClick={handleVoiceRecord}
                  isRecording={isRecording}
                >
                  {isRecording ? (
                    <>
                      Recording in progress... Tap to stop
                      <PulsingDot />
                    </>
                  ) : audioURL ? (
                    <>
                      Recording saved - Tap to re-record
                      <PlayIcon>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polygon points="10 8 16 12 10 16 10 8"></polygon>
                        </svg>
                      </PlayIcon>
                    </>
                  ) : (
                    <>
                      Tap to record your voice
                      <MicIcon>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                          <line x1="12" y1="19" x2="12" y2="23"></line>
                          <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                      </MicIcon>
                    </>
                  )}
                </VoiceRecordButton>
                {audioURL && (
                  <AudioPreview>
                    <audio controls src={audioURL} />
                  </AudioPreview>
                )}
                
                <InputLabel style={{ marginTop: '1.5rem' }}>Upload Profile Picture <OptionalTag>(optional)</OptionalTag></InputLabel>
                <ProfileUploadContainer>
                  <UploadButton type="button" onClick={handleImageUpload}>
                    {profileImageURL ? (
                      <ProfilePreview>
                        <img src={profileImageURL} alt="Profile Preview" />
                      </ProfilePreview>
                    ) : (
                      <UploadPlaceholder>
                        <UploadIcon>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                        </UploadIcon>
                        <UploadText>Upload Photo</UploadText>
                      </UploadPlaceholder>
                    )}
                  </UploadButton>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                  />
                </ProfileUploadContainer>
              </AdditionalDataContainer>
              
              <ButtonRow>
                <BackButton type="button" onClick={prevStep}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5"></path>
                    <path d="M12 19l-7-7 7-7"></path>
                  </svg>
                  Back
                </BackButton>
                <SubmitButton type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Begin Journey
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                      </svg>
                    </>
                  )}
                </SubmitButton>
              </ButtonRow>
            </StepContainer>
          )}
          
          <LoginText>
            Already have an account? <LoginLink to="/login">Login</LoginLink>
          </LoginText>
        </SignupForm>
      </RightSection>
    </SignupContainer>
  );
};

export default Signup;