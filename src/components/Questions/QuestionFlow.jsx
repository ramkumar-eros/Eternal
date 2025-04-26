// src/components/Questions/QuestionFlow.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import Question from './Question';
import { generateGPTResponse } from '../../services/gpt';
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
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

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
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  // Handle next question button
  const handleNextPair = () => {
    if (currentPairIndex < questionPairs.length - 1) {
      setCurrentPairIndex(currentPairIndex + 1);
    } else {
      // Submit answers if all questions are answered
      handleSubmitAnswers();
    }
  };

  // Handle previous question button
  const handlePreviousPair = () => {
    if (currentPairIndex > 0) {
      setCurrentPairIndex(currentPairIndex - 1);
    }
  };

  // Submit answers to Firestore and generate GPT response
  const handleSubmitAnswers = async () => {
    if (!allQuestionsAnswered()) {
      alert('Please answer all questions before submitting.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare the data to save
      const formattedAnswers = questions.map((q, index) => ({
        question: q.question,
        answer: q.options[answers[index]],
      }));

      console.log("Saving answers to Firestore:", formattedAnswers);
      console.log("User ID:", currentUser?.uid);

      // Save answers to Firestore
      await setDoc(doc(db, 'userAnswers', currentUser.uid), {
        answers: formattedAnswers,
        timestamp: new Date().toISOString(),
      });

      console.log("Answers saved successfully");

      // Generate GPT response based on answers
      console.log("Generating GPT response");
      const gptResponse = await generateGPTResponse(formattedAnswers);
      
      console.log("GPT response generated", gptResponse);

      // Save GPT response to Firestore
      await setDoc(doc(db, 'userResults', currentUser.uid), {
        result: gptResponse,
        timestamp: new Date().toISOString(),
      });

      console.log("GPT response saved to Firestore");

      // Navigate to results page
      navigate('/results');
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('An error occurred while submitting your answers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render the current pair of questions
  const renderCurrentQuestionPair = () => {
    const currentPair = questionPairs[currentPairIndex];
    
    return (
      <div className="questions-pair">
        {currentPair.map((questionIndex) => (
          <Question
            key={questionIndex}
            questionNumber={questionIndex + 1}
            totalQuestions={questions.length}
            questionText={questions[questionIndex].question}
            options={questions[questionIndex].options}
            selectedOption={answers[questionIndex]}
            onSelectOption={(optionIndex) => handleSelectOption(questionIndex, optionIndex)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="question-flow-container">
      {isLoading ? (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Generating your Eternal Aura...</p>
        </div>
      ) : (
        <>
          {renderCurrentQuestionPair()}

          <div className="navigation-buttons">
            {currentPairIndex > 0 && (
              <button 
                className="prev-button" 
                onClick={handlePreviousPair}
              >
                Previous
              </button>
            )}
            
            <button
              className="next-button"
              onClick={handleNextPair}
              disabled={!currentPairAnswered()}
            >
              {currentPairIndex === questionPairs.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionFlow;