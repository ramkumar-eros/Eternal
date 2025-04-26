// src/components/Onboarding/Onboarding.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const onboardingSteps = [
    {
      title: "Welcome to Eternal",
      subtitle: "Your journey to cosmic discovery begins now",
      description: "Eternal helps you discover your cosmic identity and unveil the mysteries of your spiritual aura.",
      image: "1.jpg" // Changed from step1.png to 1.png
    },
    {
      title: "Discover Your Aura",
      subtitle: "Uncover the energy that surrounds you",
      description: "By analyzing your responses and energy patterns, we'll reveal your unique aura signature and spiritual path.",
      image: "2.jpg" // Changed from step2.png to 2.png
    },
    {
      title: "Your Cosmic Connection",
      subtitle: "Find your place in the universal energy",
      description: "Learn how your energy connects with others and influences your path through life's journey.",
      image: "3.jpg" // Changed from step3.png to 3.png
    }
  ];
  
  const handleNext = () => {
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
      <CosmicBackground>
        <AuraGlow position={currentStep} />
        <StarField />
        <EnergyLines />
      </CosmicBackground>
      
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

// Styled Components
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

const CosmicBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background: radial-gradient(ellipse at bottom, #0d1423 0%, #020307 100%);
`;

const StarField = styled.div`
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

const EnergyLines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(0deg, transparent 24%, rgba(74, 222, 222, 0.05) 25%, 
                                    rgba(74, 222, 222, 0.05) 26%, transparent 27%, transparent 74%, 
                                    rgba(74, 222, 222, 0.05) 75%, rgba(74, 222, 222, 0.05) 76%, transparent 77%, transparent),
                    linear-gradient(90deg, transparent 24%, rgba(74, 222, 222, 0.05) 25%, 
                                    rgba(74, 222, 222, 0.05) 26%, transparent 27%, transparent 74%, 
                                    rgba(74, 222, 222, 0.05) 75%, rgba(74, 222, 222, 0.05) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
  opacity: 0.3;
`;

const AuraGlow = styled.div`
  position: absolute;
  width: 1000px;
  height: 1000px;
  border-radius: 50%;
  background: ${props => {
    if (props.position === 0) return 'radial-gradient(circle, rgba(74, 165, 255, 0.2) 0%, rgba(74, 165, 255, 0) 70%)';
    if (props.position === 1) return 'radial-gradient(circle, rgba(74, 222, 222, 0.2) 0%, rgba(74, 222, 222, 0) 70%)';
    return 'radial-gradient(circle, rgba(128, 90, 213, 0.2) 0%, rgba(128, 90, 213, 0) 70%)';
  }};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: blur(50px);
  opacity: 0.6;
  transition: background 1s ease;
  animation: pulse 8s infinite;
  
  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: 0.6;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.05);
      opacity: 0.8;
    }
    100% {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: 0.6;
    }
  }
`;

const Content = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  z-index: 1;
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
  ${props => props.current && `
    transform: scale(1.3);
    box-shadow: 0 0 0 4px rgba(74, 222, 222, 0.3);
  `}
`;

const AnimatedCard = styled.div`
  display: flex;
  width: 100%;
  max-width: 900px;
  background: rgba(10, 20, 35, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.6s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
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
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.5s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
  
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const CardContent = styled.div`
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
`;

const StepTitle = styled.h2`
  font-size: 2.5rem;
  color: white;
  margin: 0 0 0.5rem;
  background: linear-gradient(90deg, #FFFFFF, #4ADEDE);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StepSubtitle = styled.h3`
  font-size: 1.2rem;
  color: #4AA5FF;
  margin: 0 0 1.5rem;
  font-weight: 400;
`;

const StepDescription = styled.p`
  font-size: 1.1rem;
  color: #d1e9ff;
  line-height: 1.6;
  margin: 0 0 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: auto;
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
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 165, 255, 0.4);
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