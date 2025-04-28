// src/components/Questions/QuestionFlow.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import Question from './Question';
import { generateGPTResponse } from '../../services/gpt';
import CosmicJourney from '../common/CosmicJourney';
import SparkleService from '../../services/SparkleService';
import './QuestionFlow.css';

// Array of questions with their options
const questions = [
  {
    question: 'What time do you usually wake up and go to bed?',
    options: [
      'Early sleeper, early riser (Sleep before 10 PM, wake up before 7 AM)',
      'Early sleeper, riser (Sleep before 12 AM, up before 9 AM)',
      'Early sleeper, riser (Sleep before 10-12 PM, up before 7-9 AM)',
      'Irregular sleeper (sleep and wake times vary daily)',
    ],
  },
  {
    question: 'How would you describe your sleep quality?',
    options: ['Excellent', 'Good', 'Average', 'Poor'],
  },
  {
    question: 'How often do you engage in physical activity or exercise per week?',
    options: ['Never', '1-2 Days', '3-5 Days', 'Daily'],
  },
  {
    question: 'How would you rate your overall food habits?',
    options: ['Very healthy', 'Mostly healthy', 'Average', 'Unhealthy'],
  },
  {
    question: 'How many meals do you eat per day?',
    options: ['One', 'Two', 'Three', 'More than three'], 
  },
  {
    question: 'How do you remember your childhood most clearly?',
    options: ['Through images', 'Through sounds', 'Both equally', "I don't remember clearly"],
  },
  {
    question: 'After spending time with a group of people, how do you usually feel?',
    options: ['Energized and uplifted', 'Drained and needing time alone', 'It depends on the situation', 'Neutral'],
  },
  {
    question: 'Do you enjoy trying new and unfamiliar experiences?',
    options: ['Yes, I actively seek them out', 'Sometimes, if it feels safe', 'No, I prefer familiar routines', 'Only with someone I trust'],
  },
  {
    question: 'Does music strongly affect your mood or bring back memories?',
    options: ['Yes, very strongly', 'Sometimes', 'Rarely', 'Not at all'],
  },
  {
    question: 'When you try to remember something, what comes to mind first?',
    options: ['Clear mental pictures', 'Sounds or conversations', 'A mix of both', 'Nothing very vivid'],
  },
];

// Group questions into pairs (2 questions per page)
const questionPairs = [];
for (let i = 0; i < questions.length; i += 2) {
  questionPairs.push(i < questions.length - 1 ? [i, i + 1] : [i]);
}

const QuestionFlow = () => {
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [selectedOption, setSelectedOption] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { currentUser } = useAuth();
  const { startAudio } = useAudio();
  const navigate = useNavigate();

  // Ensure audio is playing
  useEffect(() => {
    if (typeof startAudio === 'function') {
      startAudio();
    }
    
    // Create extra sparkles on component mount
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      setTimeout(() => {
        if (SparkleService.createSparkle) {
          SparkleService.createSparkle(x, y);
        }
      }, i * 1000);
    }
  }, [startAudio]);

  // Calculate progress percentage
  const progressPercentage = ((currentPairIndex + 1) / questionPairs.length) * 100;
  
  // Get current question numbers for display
  const getCurrentQuestionNumbers = () => {
    const currentPair = questionPairs[currentPairIndex];
    if (currentPair.length === 2) {
      return `Questions ${currentPair[0] + 1}-${currentPair[1] + 1}`;
    } else {
      return `Question ${currentPair[0] + 1}`;
    }
  };

  // Check if all questions in the current pair are answered
  const currentPairAnswered = () => {
    const currentPair = questionPairs[currentPairIndex];
    return currentPair.every(questionIndex => answers[questionIndex] !== null);
  };

  // Check if all questions have been answered
  const allQuestionsAnswered = () => {
    return answers.every(answer => answer !== null);
  };

  // Handle answer selection
  const handleSelectOption = (questionIndex, optionIndex) => {
    // Create a visual effect when selecting an option
    setSelectedOption({ questionIndex, optionIndex });
    
    setTimeout(() => {
      setSelectedOption(null);
      
      const newAnswers = [...answers];
      newAnswers[questionIndex] = optionIndex;
      setAnswers(newAnswers);
      
      // Create sparkle cluster at selected option
      const element = document.querySelector(`.option-button[data-index="${optionIndex}"]`);
      if (element && SparkleService.createSparkleCluster) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        SparkleService.createSparkleCluster(x, y, 5);
      }
    }, 300);
  };

  // Handle next question button with transition animation
  const handleNextPair = () => {
    if (!currentPairAnswered()) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (currentPairIndex < questionPairs.length - 1) {
        setCurrentPairIndex(currentPairIndex + 1);
        // Smooth scroll to top of questions on page change
        const questionContent = document.querySelector('.question-content');
        if (questionContent) {
          questionContent.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      } else {
        // Submit answers if all questions are answered
        handleSubmitAnswers();
      }
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 500);
  };

  // Handle previous question button with transition animation
  const handlePreviousPair = () => {
    if (currentPairIndex <= 0) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentPairIndex(currentPairIndex - 1);
      // Smooth scroll to top of questions on page change
      const questionContent = document.querySelector('.question-content');
      if (questionContent) {
        questionContent.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 500);
  };

  // Navigate to loading page first, then handle submission logic there
  const handleSubmitAnswers = () => {
    if (!allQuestionsAnswered()) {
      alert('Please answer all questions before submitting.');
      return;
    }

    // Store answers in sessionStorage to retrieve on the loading page
    sessionStorage.setItem('userAnswers', JSON.stringify(
      questions.map((q, index) => ({
        question: q.question,
        answer: q.options[answers[index]],
      }))
    ));

    // Navigate directly to results page with a flag to show loading
    // This ensures that only the "Materializing" loading screen is shown
    navigate('/results?loading=true');
  };

  // Render the current pair of questions
  const renderCurrentQuestionPair = () => {
    const currentPair = questionPairs[currentPairIndex];
    
    return (
      <div className={`questions-pair ${isTransitioning ? 'transitioning' : ''}`}>
        {currentPair.map((questionIndex) => (
          <Question
            key={questionIndex}
            questionNumber={questionIndex + 1}
            totalQuestions={questions.length}
            questionText={questions[questionIndex].question}
            options={questions[questionIndex].options.map((option, index) => ({
              text: option,
              index: index // Include index for sparkle effects
            }))}
            selectedOption={answers[questionIndex]}
            onSelectOption={(optionIndex) => handleSelectOption(questionIndex, optionIndex)}
            isHighlighted={selectedOption?.questionIndex === questionIndex && selectedOption?.optionIndex !== null}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="question-flow-container">
      {/* Cosmic Journey Animation */}
      <CosmicJourney 
        currentStep={currentPairIndex} 
        totalSteps={questionPairs.length}
      />
      
      <div className="progress-container">
        <span className="progress-text">{getCurrentQuestionNumbers()}</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <span className="progress-text journey-text">Cosmic Journey: {currentPairIndex + 1}/{questionPairs.length}</span>
      </div>

      {renderCurrentQuestionPair()}

      <div className="navigation-buttons">
        {currentPairIndex > 0 && (
          <button 
            className="prev-button" 
            onClick={handlePreviousPair}
            disabled={isTransitioning}
          >
            <span className="button-icon prev-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5"></path>
                <path d="M12 19l-7-7 7-7"></path>
              </svg>
            </span>
            Previous
          </button>
        )}
        
        <button
          className="next-button"
          onClick={handleNextPair}
          disabled={!currentPairAnswered() || isTransitioning}
        >
          {currentPairIndex === questionPairs.length - 1 ? (
            <>
              Complete Journey
              <span className="button-icon next-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </span>
            </>
          ) : (
            <>
              Continue Journey
              <span className="button-icon next-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuestionFlow;