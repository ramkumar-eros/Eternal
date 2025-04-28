// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AudioProvider } from './context/AudioContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import SimpleMuteButton from './components/common/SimpleMuteButton';
import SparkleService from './services/SparkleService';

// Import styles
import './App.css';
import './styles/GlobalSparkles.css';
import './styles/responsive.css';

// Auth Pages
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

// Main Pages
import Onboarding from './pages/Onboarding';
import QuestionsPage from './pages/QuestionsPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  // Initialize sparkle service on app mount
  useEffect(() => {
    SparkleService.init();
    
    // Clean up on app unmount
    return () => {
      SparkleService.cleanup();
    };
  }, []);

  return (
    <AuthProvider>
      <AudioProvider>
        <Router>
          <div className="app overflow-fix">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/onboarding" 
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/questions" 
                element={
                  <ProtectedRoute>
                    <QuestionsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/results" 
                element={
                  <ProtectedRoute>
                    <ResultsPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
            
            {/* Global Mute Button - appears on all pages */}
            <SimpleMuteButton />
          </div>
        </Router>
      </AudioProvider>
    </AuthProvider>
  );
}

export default App;