// src/pages/QuestionsPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import QuestionFlow from '../components/Questions/QuestionFlow';
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
      <div className="questions-container">
        <div className="questions-header">
          <img src={logo} alt="ETERNAL" className="eternal-logo" />
          <h2 className="questions-subtitle">Questions</h2>
        </div>
        
        <div className="question-content">
          <QuestionFlow />
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;