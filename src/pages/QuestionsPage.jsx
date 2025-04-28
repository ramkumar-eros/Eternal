// src/pages/QuestionsPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import QuestionFlow from '../components/Questions/QuestionFlow';
import CosmicJourney from '../components/common/CosmicJourney';
import './QuestionsPage.css';
import logo from './logo.png'; // Ensure you have the logo image in this path

const QuestionsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="questions-page">
      {/* The CosmicJourney component is now handled by QuestionFlow */}
      
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
        
        {/* Floating orbs */}
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
      </div>
      
      <div className="questions-container">
        <div className="questions-header">
          <img src={logo} alt="ETERNAL" className="eternal-logo" />
          <h2 className="questions-subtitle">Discover Your Eternal Aura</h2>
        </div>
        
        <div className="question-content">
          <QuestionFlow />
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;