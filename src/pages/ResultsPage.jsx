// src/pages/ResultsPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuraResult from '../components/Results/AuraResult';
import './ResultsPage.css';

const ResultsPage = () => {
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