// src/pages/ResultsPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Fixed import
import AuraResult from '../components/Results/AuraResult';
import './ResultsPage.css';

const ResultsPage = () => {
  const { currentUser } = useAuth(); // Using useAuth hook
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
      <AuraResult />
    </div>
  );
};

export default ResultsPage;