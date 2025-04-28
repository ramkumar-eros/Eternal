// src/components/Results/AuraResult.jsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import './AuraResult.css';
import logo from './logo.png'; // Ensure you have the logo image in this path

const AuraResult = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('aura');
  const [processedResult, setProcessedResult] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResult = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const resultDoc = await getDoc(doc(db, 'userResults', currentUser.uid));
        
        if (resultDoc.exists()) {
          const rawResult = resultDoc.data().result;
          setResult(rawResult);
          
          // Process the result to clean formatting
          const processed = processGPTResponse(rawResult);
          setProcessedResult(processed);
        } else {
          // No results found, redirect to questions
          navigate('/questions');
        }
      } catch (error) {
        console.error('Error fetching result:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500); // Add a small delay to ensure the loading screen is visible
      }
    };

    fetchResult();
  }, [currentUser, navigate]);

  // Function to process and clean up GPT response
  const processGPTResponse = (rawResult) => {
    if (!rawResult) return null;
    
    // Create a clean copy of the result
    const processed = { ...rawResult };
    
    // Define all possible sections to process
    const sections = [
      'auraColors', 'fullReading', 'personality', 'spiritualProfile', 
      'energyBoosters', 'energyDrains', 'alignment', 'dailyPractice'
    ];
    
    // Clean each section by removing markdown and formatting issues
    sections.forEach(section => {
      if (processed[section]) {
        // Remove markdown formatting
        processed[section] = processed[section]
          .replace(/\*\*/g, '') // Remove bold formatting
          .replace(/##/g, '') // Remove headings
          .replace(/\n\n+/g, '\n\n') // Normalize line breaks
          .trim();
      }
    });
    
    return processed;
  };

  // Function to handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Function to determine which colors to display in the aura visualization
  const getAuraColors = () => {
    if (!processedResult || (!processedResult.auraColors && !processedResult.fullReading)) {
      return ['#4B8FD5', '#5BC0BE', '#78D672']; // Default colors
    }

    // Map text color names to hex colors with transparency for layering
    const colorMap = {
      blue: 'rgba(75, 143, 213, 0.8)',
      purple: 'rgba(147, 112, 219, 0.8)',
      violet: 'rgba(147, 112, 219, 0.8)',
      indigo: 'rgba(75, 0, 130, 0.8)',
      red: 'rgba(255, 87, 87, 0.8)',
      orange: 'rgba(255, 165, 0, 0.8)',
      yellow: 'rgba(255, 255, 0, 0.8)',
      green: 'rgba(120, 214, 114, 0.8)',
      pink: 'rgba(255, 105, 180, 0.8)',
      white: 'rgba(255, 255, 255, 0.8)',
      gold: 'rgba(255, 215, 0, 0.8)',
      silver: 'rgba(192, 192, 192, 0.8)',
      bronze: 'rgba(205, 127, 50, 0.8)',
      brown: 'rgba(160, 82, 45, 0.8)',
      turquoise: 'rgba(64, 224, 208, 0.8)'
    };

    // Extract colors from result
    const extractedColors = Array.isArray(processedResult.auraColors) 
      ? processedResult.auraColors 
      : extractColorsFromText(processedResult.auraColors || processedResult.fullReading || '');

    // Map to hex values - use the first three colors or pad with defaults
    const mappedColors = extractedColors
      .map(color => colorMap[color.toLowerCase()] || 'rgba(75, 143, 213, 0.8)');
    
    // Ensure we have at least 2 colors for the gradient
    if (mappedColors.length < 2) {
      mappedColors.push('rgba(91, 192, 190, 0.8)');
    }
    
    return mappedColors.slice(0, 3); // Use up to 3 colors
  };

  // Function for inner glow color (use the first dominant color)
  const getInnerGlowColor = () => {
    const colors = getAuraColors();
    return colors[0].replace('0.8', '0.9'); // Make inner glow slightly more opaque
  };

  // Helper function to extract color names from text
  const extractColorsFromText = (text) => {
    const colorNames = [
      'blue', 'purple', 'violet', 'indigo', 'red', 'orange',
      'yellow', 'green', 'pink', 'white', 'gold', 'silver',
      'turquoise'
    ];
    
    const foundColors = [];
    
    colorNames.forEach(color => {
      if (new RegExp(`\\b${color}\\b`, 'i').test(text)) {
        foundColors.push(color);
      }
    });
    
    return foundColors.length > 0 ? foundColors : ['blue', 'purple']; // Default fallback
  };

  // Function to extract energy boosters and format them
  const formatEnergyBoosters = (boostersText) => {
    if (!boostersText) return [];
    
    // Try to find list items or numbered items
    const listItems = boostersText.match(/[\d\.]+\s*(.*?)(?=[\r\n]|$)/g) ||
                      boostersText.match(/[-•]\s*(.*?)(?=[\r\n]|$)/g);
    
    if (listItems && listItems.length > 0) {
      return listItems.map(item => 
        item.replace(/^[\d\.•-]+\s*/, '').trim() // Remove numbers/bullets
      );
    }
    
    // Fallback to sentences if list items not found
    return boostersText
      .split(/\.(?=\s|$)/)
      .filter(sentence => sentence.trim().length > 10)
      .map(sentence => sentence.trim())
      .slice(0, 5);
  };

  // Function to extract energy drains and format them
  const formatEnergyDrains = (drainsText) => {
    if (!drainsText) return [];
    
    // Similar to boosters extraction
    const listItems = drainsText.match(/[\d\.]+\s*(.*?)(?=[\r\n]|$)/g) ||
                      drainsText.match(/[-•]\s*(.*?)(?=[\r\n]|$)/g);
    
    if (listItems && listItems.length > 0) {
      return listItems.map(item => 
        item.replace(/^[\d\.•-]+\s*/, '').trim()
      );
    }
    
    return drainsText
      .split(/\.(?=\s|$)/)
      .filter(sentence => sentence.trim().length > 10)
      .map(sentence => sentence.trim())
      .slice(0, 5);
  };

  // Function to extract alignment tips
  const formatAlignmentTips = (alignmentText) => {
    if (!alignmentText) return [];
    
    // Try to find list items or numbered recommendations
    const listItems = alignmentText.match(/[\d\.]+\s*(.*?)(?=[\r\n]|$)/g) ||
                      alignmentText.match(/[-•]\s*(.*?)(?=[\r\n]|$)/g);
    
    if (listItems && listItems.length > 0) {
      return listItems.map(item => 
        item.replace(/^[\d\.•-]+\s*/, '').trim()
      );
    }
    
    // Fallback to sentences
    return alignmentText
      .split(/\.(?=\s|$)/)
      .filter(sentence => sentence.trim().length > 15)
      .map(sentence => sentence.trim())
      .slice(0, 7);
  };

  // Function to format text by splitting into paragraphs
  const formatTextContent = (text) => {
    if (!text) return [];
    
    // Split by paragraph breaks
    return text.split(/\n\n+/)
      .filter(para => para.trim().length > 0)
      .map(para => para.trim());
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-container">
          <div className="loading-aura"></div>
          <div className="loading-spinner"></div>
          <img src={logo} alt="ETERNAL" className="loading-logo" />
        </div>
        <p className="loading-text">Materializing Your Eternal Aura...</p>
      </div>
    );
  }

  return (
    <div className="aura-result-container">
      {/* Cosmic background elements */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
      
      <div className="cosmic-star star-1"></div>
      <div className="cosmic-star star-2"></div>
      <div className="cosmic-star star-3"></div>
      <div className="cosmic-star star-4"></div>
      <div className="cosmic-star star-5"></div>

      <div className="results-header">
        <img src={logo} alt="ETERNAL" className="eternal-logo" />
        <h2 className="result-title">Your Eternal Aura Reading</h2>
      </div>

      <div className="aura-visualization">
        <div className="aura-circle">
          <div 
            className="aura-glow" 
            style={{
              background: `radial-gradient(circle, ${getAuraColors().join(', ')})`
            }}
          ></div>
          <div 
            className="aura-inner-glow" 
            style={{
              background: getInnerGlowColor()
            }}
          ></div>
          <div className="silhouette" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='200' viewBox='0 0 100 200' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0C40 0 35 10 35 20C35 30 40 35 40 40C40 45 37.5 50 35 55C32.5 60 30 65 30 70C30 75 32.5 80 35 85C37.5 90 40 95 40 100C40 105 35 115 35 125C35 135 40 145 45 155C50 165 55 175 50 185C45 195 40 200 40 200H60C60 200 55 195 50 185C45 175 50 165 55 155C60 145 65 135 65 125C65 115 60 105 60 100C60 95 62.5 90 65 85C67.5 80 70 75 70 70C70 65 67.5 60 65 55C62.5 50 60 45 60 40C60 35 65 30 65 20C65 10 60 0 50 0Z' fill='black'/%3E%3C/svg%3E")`
          }}></div>
        </div>
      </div>

      <div className="result-tabs">
        <button 
          className={`tab-button ${activeTab === 'aura' ? 'active' : ''}`}
          onClick={() => handleTabChange('aura')}
        >
          Aura Colors
        </button>
        <button 
          className={`tab-button ${activeTab === 'personality' ? 'active' : ''}`}
          onClick={() => handleTabChange('personality')}
        >
          Personality
        </button>
        <button 
          className={`tab-button ${activeTab === 'spiritual' ? 'active' : ''}`}
          onClick={() => handleTabChange('spiritual')}
        >
          Spiritual Profile
        </button>
        <button 
          className={`tab-button ${activeTab === 'energy' ? 'active' : ''}`}
          onClick={() => handleTabChange('energy')}
        >
          Energy Plan
        </button>
      </div>

      <div className="result-content">
        {processedResult && (
          <>
            {activeTab === 'aura' && (
              <div className="aura-section">
                <h3>Your Aura Colors</h3>
                <div className="section-content">
                  {formatTextContent(processedResult.auraColors || processedResult.fullReading).map((para, index) => (
                    <p key={`aura-${index}`}>{para}</p>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'personality' && (
              <div className="personality-section">
                <h3>Your Personality Profile</h3>
                <div className="section-content">
                  {formatTextContent(processedResult.personality || processedResult.fullReading).map((para, index) => (
                    <p key={`personality-${index}`}>{para}</p>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'spiritual' && (
              <div className="spiritual-section">
                <h3>Your Spiritual Journey</h3>
                <div className="section-content">
                  {formatTextContent(processedResult.spiritualProfile || processedResult.fullReading).map((para, index) => (
                    <p key={`spiritual-${index}`}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'energy' && (
              <div className="energy-plan-section">
                <h3>Your Personal Energy Plan</h3>
                
                <div className="energy-plan-container">
                  <div className="energy-box boost">
                    <h4>What's Boosting Your Vibe ↑</h4>
                    {processedResult.energyBoosters ? (
                      <ul className="energy-list">
                        {formatEnergyBoosters(processedResult.energyBoosters).map((item, index) => (
                          <li key={`boost-${index}`}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-data">Energy boosters not available in your reading.</p>
                    )}
                  </div>
                  
                  <div className="energy-box drain">
                    <h4>What's Draining Your Energy ↓</h4>
                    {processedResult.energyDrains ? (
                      <ul className="energy-list">
                        {formatEnergyDrains(processedResult.energyDrains).map((item, index) => (
                          <li key={`drain-${index}`}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-data">Energy drains not available in your reading.</p>
                    )}
                  </div>
                </div>
                
                <div className="alignment-section">
                  <h4>How to Stay Aligned</h4>
                  {processedResult.alignment ? (
                    <ol className="alignment-list">
                      {formatAlignmentTips(processedResult.alignment).map((tip, index) => (
                        <li key={`align-${index}`}>{tip}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="no-data">Alignment recommendations not available in your reading.</p>
                  )}
                </div>
                
                <div className="daily-practice">
                  <h4>Your Daily Practice</h4>
                  {processedResult.dailyPractice ? (
                    <div className="practice-content">
                      {formatTextContent(processedResult.dailyPractice).map((para, index) => (
                        <p key={`practice-${index}`}>{para}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">Daily practice not available in your reading.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="action-buttons">
        <button className="share-button">
          Go to Next Phase
        </button>
        <button className="retake-button" onClick={() => navigate('/questions')}>
          Retake Quiz
        </button>
      </div>
    </div>
  );
};

export default AuraResult;