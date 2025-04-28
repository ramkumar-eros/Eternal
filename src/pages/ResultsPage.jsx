// src/pages/ResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import AuraResult from '../components/Results/AuraResult';
import { generateGPTResponse } from '../services/gpt';
import logo from './logo.png';
import './ResultsPage.css';

const ResultsPage = () => {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're coming from the questions page with data to process
  const isLoadingFromQuestions = new URLSearchParams(location.search).get('loading') === 'true';

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    const processQuestionsData = async () => {
      try {
        // Get stored answers from sessionStorage 
        const storedAnswers = sessionStorage.getItem('userAnswers');
        
        if (storedAnswers && isLoadingFromQuestions) {
          // We have answers from the questions page to process
          const formattedAnswers = JSON.parse(storedAnswers);
          
          // Save answers to Firestore
          await setDoc(doc(db, 'userAnswers', currentUser.uid), {
            answers: formattedAnswers,
            timestamp: new Date().toISOString(),
          });
  
          // Generate GPT response
          const gptResponse = await generateGPTResponse(formattedAnswers);
          
          // Save GPT response to Firestore
          await setDoc(doc(db, 'userResults', currentUser.uid), {
            result: gptResponse,
            timestamp: new Date().toISOString(),
          });
          
          // Clear stored answers from sessionStorage
          sessionStorage.removeItem('userAnswers');
          
          // Show loading indicator for at least 2 seconds for a good UX
          setTimeout(() => {
            // Update URL to remove loading parameter without page refresh
            window.history.replaceState({}, '', '/results');
            setLoading(false);
          }, 2000);
        } else {
          // Check if user already has results
          const resultDoc = await getDoc(doc(db, 'userResults', currentUser.uid));
          
          if (resultDoc.exists()) {
            // User has results, no need to show loading screen
            setLoading(false);
          } else {
            // No results and not coming from questions - redirect to questions
            navigate('/questions');
          }
        }
      } catch (error) {
        console.error('Error in results page:', error);
        alert('An error occurred. Please try again.');
        navigate('/questions');
      }
    };

    processQuestionsData();
  }, [currentUser, navigate, isLoadingFromQuestions]);

  // Show the loading overlay if loading is true
  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-container">
          <div className="loading-aura"></div>
          <div className="loading-spinner"></div>
          <img src={logo} alt="ETERNAL" className="loading-logo" />
        </div>
        <p className="loading-text">Materializing Your Eternal Aura...</p>
        <p className="loading-subtext">Connecting to the cosmic energies</p>
      </div>
    );
  }

  return (
    <div className="results-page">
      {/* Background effects */}
      <div className="bg-effects">
        <div className="bg-gradient-1"></div>
        <div className="bg-gradient-2"></div>
        <div className="bg-gradient-3"></div>
        <div className="stars"></div>
        
        {/* Animated stars */}
        <div className="animated-star star-1"></div>
        <div className="animated-star star-2"></div>
        <div className="animated-star star-3"></div>
        <div className="animated-star star-4"></div>
        <div className="animated-star star-5"></div>
        <div className="animated-star star-6"></div>
        <div className="animated-star star-7"></div>
        
        {/* Shooting stars */}
        <div className="shooting-star shooting-1"></div>
        <div className="shooting-star shooting-2"></div>
        
        {/* Floating orbs */}
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>
      
      <div className="results-container">
        <AuraResult />
      </div>
    </div>
  );
};

export default ResultsPage;