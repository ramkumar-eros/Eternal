// src/components/Onboarding/Onboarding.jsx
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import CosmicJourney from '../common/CosmicJourney';
import SparkleService from '../../services/SparkleService';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showInitialSparkles, setShowInitialSparkles] = useState(true);
  const { currentUser } = useAuth();
  const { startAudio } = useAudio();
  const navigate = useNavigate();

  // Start audio and create initial journey effect when the onboarding component mounts
  useEffect(() => {
    // Start the audio ONLY on the onboarding page
    if (startAudio) {
      startAudio();
    }
    
    // Create an initial burst of sparkles when the component mounts
    // This creates the sensation of journey beginning with audio
    const createInitialSparkles = () => {
      if (!showInitialSparkles) return;
      
      // Create 50 sparkles across the screen in a pattern (increased from 30)
      for (let i = 0; i < 50; i++) {
        setTimeout(() => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          
          // Create sparkle paths that converge toward the center
          const angle = (i / 50) * Math.PI * 2;
          const distance = Math.min(width, height) * 0.5 * Math.random();
          const centerX = width / 2;
          const centerY = height / 2;
          
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;
          
          if (SparkleService.createSparkle) {
            SparkleService.createSparkle(x, y);
          } else {
            // Fallback if SparkleService is not available
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;
            document.body.appendChild(sparkle);
            
            // Remove sparkle after animation completes
            setTimeout(() => {
              if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
              }
            }, 3000);
          }
        }, i * 50); // Faster staggering (reduced from 100ms)
      }
      
      setShowInitialSparkles(false);
    };
    
    createInitialSparkles();
    
    // Create continuous streams of sparkles
    const sparkleInterval = setInterval(() => {
      // Create 20 sparkles every 3 seconds (more frequent than before)
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          
          // Create random positions for ongoing sparkle effects
          const x = Math.random() * width;
          const y = Math.random() * height;
          
          if (SparkleService.createSparkle) {
            SparkleService.createSparkle(x, y);
          }
        }, i * 30); // Faster staggering
      }
    }, 3000); // More frequent bursts
    
    // Add more sparkles on mouse movement
    const handleMouseMove = (e) => {
      if (Math.random() < 0.1) { // Increased chance (from 0.05 to 0.1)
        if (SparkleService.createSparkle) {
          SparkleService.createSparkle(e.clientX, e.clientY);
        } else {
          const sparkle = document.createElement('div');
          sparkle.className = 'sparkle';
          sparkle.style.left = `${e.clientX}px`;
          sparkle.style.top = `${e.clientY}px`;
          document.body.appendChild(sparkle);
          
          setTimeout(() => {
            if (sparkle.parentNode) {
              sparkle.parentNode.removeChild(sparkle);
            }
          }, 3000);
        }
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(sparkleInterval);
    };
  }, [startAudio, showInitialSparkles]);

  const onboardingSteps = [
    {
      title: "Welcome to Eternal",
      subtitle: "Your journey to cosmic discovery begins now",
      description: "Eternal helps you discover your cosmic identity and unveil the mysteries of your spiritual aura. Listen to the meditation music as you embark on this journey.",
      image: "1.jpg"
    },
    {
      title: "Discover Your Aura",
      subtitle: "Uncover the energy that surrounds you",
      description: "By analyzing your responses and energy patterns, we'll reveal your unique aura signature and spiritual path. Our advanced system translates your essence into visual energy.",
      image: "2.jpg"
    },
    {
      title: "Your Cosmic Connection",
      subtitle: "Find your place in the universal energy",
      description: "Learn how your energy connects with others and influences your path through life's journey. We'll guide you toward alignment with your true spiritual essence.",
      image: "3.jpg"
    }
  ];
  
  const handleNext = () => {
    // Create burst of sparkles on transition
    for (let i = 0; i < 30; i++) { // Increased from 15
      setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const x = Math.random() * width;
        const y = Math.random() * height;
        
        if (SparkleService.createSparkle) {
          SparkleService.createSparkle(x, y);
        }
      }, i * 30); // Faster staggering
    }
    
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      // On last step, navigate to questions
      navigate('/questions');
    }
  };
  
  const handleSkip = () => {
    navigate('/questions');
  };

  return (
    <OnboardingContainer>
      {/* Animated cosmic journey background */}
      <CosmicJourney currentStep={currentStep} totalSteps={onboardingSteps.length} />
      
      {/* Rich background elements */}
      <BackgroundElements>
        {/* More floating orbs */}
        <FloatingOrb className="orb-1" />
        <FloatingOrb className="orb-2" />
        <FloatingOrb className="orb-3" />
        <FloatingOrb className="orb-4" />
        <FloatingOrb className="orb-5" />
        
        {/* Travel path elements */}
        <FloatingPath className="path-1" />
        <FloatingPath className="path-2" />
        <FloatingPath className="path-3" />
        <FloatingPath className="path-4" />
        <FloatingPath className="path-5" />
        
        {/* Static stars */}
        <StarField />
        
        {/* Animated stars */}
        {Array.from({ length: 20 }).map((_, index) => (
          <AnimatedStar 
            key={index}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
        
        {/* Shooting stars */}
        <ShootingStar className="shooting-1" />
        <ShootingStar className="shooting-2" />
        <ShootingStar className="shooting-3" />
        
        {/* Travel stars */}
        {Array.from({ length: 12 }).map((_, index) => (
          <TravelStar 
            key={index}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${index * 0.5}s`
            }}
          />
        ))}
      </BackgroundElements>
      
      <Content>
        <ProgressIndicator>
          {onboardingSteps.map((_, index) => (
            <ProgressDot 
              key={index} 
              active={index <= currentStep}
              current={index === currentStep}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </ProgressIndicator>

        <AnimatedCard key={currentStep}>
          <CardImage>
            <img src={`/images/${onboardingSteps[currentStep].image}`} alt={onboardingSteps[currentStep].title} />
            <GlowingOverlay />
          </CardImage>
          
          <CardContent>
            <StepTitle>{onboardingSteps[currentStep].title}</StepTitle>
            <StepSubtitle>{onboardingSteps[currentStep].subtitle}</StepSubtitle>
            <StepDescription>{onboardingSteps[currentStep].description}</StepDescription>
            
            <ButtonContainer>
              {currentStep < onboardingSteps.length - 1 ? (
                <>
                  <SkipButton onClick={handleSkip}>Skip</SkipButton>
                  <NextButton onClick={handleNext}>
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  </NextButton>
                </>
              ) : (
                <BeginButton onClick={handleNext}>
                  Begin Your Journey
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </BeginButton>
              )}
            </ButtonContainer>
          </CardContent>
        </AnimatedCard>
      </Content>
    </OnboardingContainer>
  );
};

// Background elements container
const BackgroundElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
`;

// Star field (like in other pages)
const StarField = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, #eef 100%, transparent),
    radial-gradient(2px 2px at 40px 70px, #fff 100%, transparent),
    radial-gradient(1px 1px at 90px 40px, #ddf 100%, transparent),
    radial-gradient(2px 2px at 160px 120px, #fff 100%, transparent),
    radial-gradient(1.5px 1.5px at 200px 40px, #eef 100%, transparent),
    radial-gradient(1.5px 1.5px at 300px 90px, #fff 100%, transparent),
    radial-gradient(1px 1px at 400px 150px, #ddf 100%, transparent),
    radial-gradient(2px 2px at 500px 30px, #fff 100%, transparent),
    radial-gradient(1.5px 1.5px at 50px 200px, #eef 100%, transparent),
    radial-gradient(1px 1px at 150px 300px, #ddf 100%, transparent),
    radial-gradient(2px 2px at 250px 250px, #fff 100%, transparent),
    radial-gradient(1.5px 1.5px at 350px 350px, #eef 100%, transparent);
  background-repeat: repeat;
  background-size: 500px 500px;
  opacity: 0.4;
  animation: twinkle 5s infinite;
  
  @keyframes twinkle {
    0% { opacity: 0.3; }
    50% { opacity: 0.5; }
    100% { opacity: 0.3; }
  }
`;

// Animations
const floatOrb = keyframes`
  0% { transform: translate(0, 0) scale(1); opacity: 0.15; }
  50% { transform: translate(30px, -20px) scale(1.1); opacity: 0.25; }
  100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
`;

const floatPath = keyframes`
  0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.3; }
  50% { transform: translateY(-30px) translateX(20px) rotate(1deg); opacity: 0.5; }
  100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.3; }
`;

const twinkleAnimation = keyframes`
  0% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
  100% { opacity: 0.2; transform: scale(1); }
`;

const shootingStarAnimation = keyframes`
  0% { transform-origin: right; transform: translateX(-100px) rotate(45deg); opacity: 0; }
  10% { opacity: 1; }
  20% { transform-origin: left; transform: translateX(100px) rotate(45deg); opacity: 0; }
  100% { opacity: 0; }
`;

const travelStarAnimation = keyframes`
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  10% { transform: scale(1.2) rotate(20deg); opacity: 1; }
  20% { transform: scale(1) rotate(0deg); opacity: 0.8; }
  100% { transform: scale(0) rotate(-20deg); opacity: 0; }
`;

// Background element components
const FloatingOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.15;
  animation: ${floatOrb} 15s infinite ease-in-out;
  
  &.orb-1 {
    width: 300px;
    height: 300px;
    background-color: #4B8FD5;
    top: 10%;
    right: 10%;
    animation-delay: 0s;
  }
  
  &.orb-2 {
    width: 250px;
    height: 250px;
    background-color: #5BC0BE;
    bottom: 20%;
    left: 5%;
    animation-delay: 3s;
  }
  
  &.orb-3 {
    width: 200px;
    height: 200px;
    background-color: #78D672;
    top: 60%;
    right: 15%;
    animation-delay: 6s;
  }
  
  &.orb-4 {
    width: 350px;
    height: 350px;
    background-color: rgba(147, 112, 219, 0.2);
    bottom: 10%;
    right: 20%;
    animation-delay: 2s;
  }
  
  &.orb-5 {
    width: 280px;
    height: 280px;
    background-color: rgba(75, 143, 213, 0.3);
    top: 30%;
    left: 15%;
    animation-delay: 4s;
  }
`;

const FloatingPath = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
  background: linear-gradient(135deg, rgba(74, 222, 222, 0.2), rgba(75, 143, 213, 0.2));
  animation: ${floatPath} 8s infinite ease-in-out;
  
  &.path-1 {
    top: 20%;
    left: 50%;
    width: 500px;
    height: 80px;
    animation-delay: 0s;
  }
  
  &.path-2 {
    top: 40%;
    left: 40%;
    width: 600px;
    height: 60px;
    animation-delay: 2s;
  }
  
  &.path-3 {
    top: 60%;
    left: 45%;
    width: 700px;
    height: 70px;
    animation-delay: 4s;
  }
  
  &.path-4 {
    top: 30%;
    left: 35%;
    width: 450px;
    height: 50px;
    animation-delay: 1s;
  }
  
  &.path-5 {
    top: 70%;
    left: 55%;
    width: 550px;
    height: 65px;
    animation-delay: 3s;
  }
`;

const AnimatedStar = styled.div`
  position: absolute;
  width: 2px;
  height: 2px;
  background-color: white;
  border-radius: 50%;
  animation: ${twinkleAnimation} 4s infinite;
`;

const ShootingStar = styled.div`
  position: absolute;
  width: 100px;
  height: 1px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
  transform-origin: left;
  z-index: 1;
  opacity: 0;
  animation: ${shootingStarAnimation} 8s infinite ease-out;
  
  &.shooting-1 {
    top: 20%;
    left: 30%;
    transform: rotate(45deg);
    animation-delay: 1s;
  }
  
  &.shooting-2 {
    top: 60%;
    left: 70%;
    transform: rotate(-30deg);
    animation-delay: 4s;
  }
  
  &.shooting-3 {
    top: 40%;
    left: 50%;
    transform: rotate(15deg);
    animation-delay: 7s;
  }
`;

const TravelStar = styled.div`
  position: absolute;
  width: 15px;
  height: 15px;
  background: radial-gradient(circle, white 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  opacity: 0;
  animation: ${travelStarAnimation} 6s infinite;
`;

// Main container
const OnboardingContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #050b14;
  overflow: hidden;
`;

// Rest of the styled components remain the same as before
const Content = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProgressIndicator = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ProgressDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active ? '#4ADEDE' : 'rgba(255, 255, 255, 0.2)'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  ${props => props.current && `
    transform: scale(1.3);
    box-shadow: 0 0 0 4px rgba(74, 222, 222, 0.3);
  `}
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: transparent;
    border: 2px solid rgba(74, 222, 222, 0.5);
    opacity: 0;
    transition: all 0.5s ease;
  }
  
  ${props => props.current && `
    &::after {
      animation: pulse-ring 2s infinite;
    }
  `}
  
  @keyframes pulse-ring {
    0% {
      opacity: 0.8;
      width: 12px;
      height: 12px;
    }
    100% {
      opacity: 0;
      width: 30px;
      height: 30px;
    }
  }
`;

const AnimatedCard = styled.div`
  display: flex;
  width: 100%;
  max-width: 900px;
  background: rgba(10, 20, 35, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  animation: fadeIn 0.8s ease-out;
  border: 1px solid rgba(74, 222, 222, 0.2);
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CardImage = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.8s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
  
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const GlowingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, transparent, rgba(10, 20, 35, 0.7));
  pointer-events: none;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 3px solid transparent;
    border-image: linear-gradient(135deg, rgba(74, 222, 222, 0.8), rgba(75, 143, 213, 0), rgba(74, 222, 222, 0.8));
    border-image-slice: 1;
    opacity: 0;
    animation: border-glow 5s infinite alternate;
  }
  
  @keyframes border-glow {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
`;

const CardContent = styled.div`
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(10, 20, 35, 0.6), rgba(20, 40, 70, 0.3));
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 70%, rgba(74, 222, 222, 0.05), transparent 70%);
    pointer-events: none;
  }
`;

const StepTitle = styled.h2`
  font-size: 2.5rem;
  color: white;
  margin: 0 0 0.5rem;
  background: linear-gradient(90deg, #FFFFFF, #4ADEDE);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 50px;
    height: 2px;
    background: linear-gradient(90deg, #4ADEDE, transparent);
  }
  
  animation: title-reveal 1s forwards;
  
  @keyframes title-reveal {
    from { 
      opacity: 0;
      transform: translateY(-10px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StepSubtitle = styled.h3`
  font-size: 1.2rem;
  color: #4AA5FF;
  margin: 0 0 1.5rem;
  font-weight: 400;
  animation: subtitle-reveal 1s 0.2s forwards;
  opacity: 0;
  
  @keyframes subtitle-reveal {
    from { 
      opacity: 0;
      transform: translateY(-5px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StepDescription = styled.p`
  font-size: 1.1rem;
  color: #d1e9ff;
  line-height: 1.7;
  margin: 0 0 2rem;
  animation: desc-reveal 1s 0.4s forwards;
  opacity: 0;
  
  @keyframes desc-reveal {
    from { 
      opacity: 0;
      transform: translateY(-5px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: auto;
  animation: buttons-reveal 1s 0.6s forwards;
  opacity: 0;
  
  @keyframes buttons-reveal {
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

const NextButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: linear-gradient(90deg, #4AA5FF, #4ADEDE);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
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
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 165, 255, 0.4);
    
    &::before {
      opacity: 1;
      animation: shine 1.5s infinite;
    }
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
`;

const BeginButton = styled(NextButton)`
  padding: 1rem 2rem;
  font-size: 1.1rem;
  background: linear-gradient(90deg, #4AA5FF, #805AD5);
  
  &:hover {
    background: linear-gradient(90deg, #3994f0, #6a48b6);
  }
`;

const SkipButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: transparent;
  color: #a9d8ff;
  border: 1px solid rgba(74, 222, 222, 0.3);
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(74, 222, 222, 0.1);
    color: white;
  }
`;

export default Onboarding;