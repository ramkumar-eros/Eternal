// src/components/Results/AuraResult.jsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import './AuraResult.css';
import logo from './logo.png';


const AuraResult = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('aura');
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
          setResult(resultDoc.data().result);
        } else {
          // No results found, redirect to questions
          navigate('/questions');
        }
      } catch (error) {
        console.error('Error fetching result:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [currentUser, navigate]);

  // Function to handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Function to determine which colors to display in the aura visualization
  const getAuraColors = () => {
    if (!result || !result.auraColors) {
      return ['#4B8FD5', '#5BC0BE', '#78D672']; // Default colors
    }

    // Map text color names to hex colors
    const colorMap = {
      blue: '#4B8FD5',
      purple: '#9370DB',
      violet: '#9370DB',
      indigo: '#4B0082',
      red: '#FF5757',
      orange: '#FFA500',
      yellow: '#FFFF00',
      green: '#78D672',
      pink: '#FF69B4',
      white: '#FFFFFF',
      gold: '#FFD700',
      silver: '#C0C0C0',
      bronze: '#CD7F32',
      brown: '#A0522D',
      black: '#000000',
      gray: '#808080',
      turquoise: '#40E0D0'
    };

    // Extract colors from result
    const extractedColors = Array.isArray(result.auraColors) 
      ? result.auraColors 
      : extractColorsFromText(result.auraColors || result.fullReading || '');

    // Map to hex values
    return extractedColors.map(color => colorMap[color.toLowerCase()] || '#4B8FD5');
  };

  // Helper function to extract color names from text
  const extractColorsFromText = (text) => {
    const colorNames = [
      'blue', 'purple', 'violet', 'indigo', 'red', 'orange',
      'yellow', 'green', 'pink', 'white', 'gold', 'silver',
      'bronze', 'brown', 'black', 'gray', 'turquoise'
    ];
    
    const foundColors = [];
    
    colorNames.forEach(color => {
      if (new RegExp(`\\b${color}\\b`, 'i').test(text)) {
        foundColors.push(color);
      }
    });
    
    return foundColors.length > 0 ? foundColors : ['blue', 'purple']; // Default fallback
  };

  // Function to extract energy boosters
  const formatEnergyBoosters = (boostersText) => {
    if (!boostersText) return [];
    
    // Try to find list items
    const listItems = boostersText.match(/[\d\.]+\s*(.*?)(?=[\r\n]|$)/g);
    
    if (listItems && listItems.length > 0) {
      return listItems.map(item => 
        item.replace(/^[\d\.]+\s*/, '').trim() // Remove numbers/bullets
      );
    }
    
    // Fallback to sentences if list items not found
    return boostersText
      .split(/\.(?=\s|$)/)
      .filter(sentence => sentence.trim().length > 10)
      .map(sentence => sentence.trim())
      .slice(0, 5);
  };

  // Function to extract energy drains
  const formatEnergyDrains = (drainsText) => {
    if (!drainsText) return [];
    
    // Similar to boosters extraction
    const listItems = drainsText.match(/[\d\.]+\s*(.*?)(?=[\r\n]|$)/g);
    
    if (listItems && listItems.length > 0) {
      return listItems.map(item => 
        item.replace(/^[\d\.]+\s*/, '').trim()
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
    const listItems = alignmentText.match(/[\d\.]+\s*(.*?)(?=[\r\n]|$)/g);
    
    if (listItems && listItems.length > 0) {
      return listItems.map(item => 
        item.replace(/^[\d\.]+\s*/, '').trim()
      );
    }
    
    // Fallback to sentences
    return alignmentText
      .split(/\.(?=\s|$)/)
      .filter(sentence => sentence.trim().length > 15)
      .map(sentence => sentence.trim())
      .slice(0, 7);
  };

  const cleanText = (text) => {
    return text.replace(/(\*\*|##)/g, ''); // Remove markdown formatting
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your Eternal Aura...</p>
      </div>
    );
  }

  return (
    <div className="aura-result-container">
      <img src={logo} alt="ETERNAL Logo" className="eternal-logo" />

      <h2 className="result-title">Your Aura Reading</h2>

      {/* <div className="aura-visualization">
        <div 
          className="aura-glow" 
          style={{
            background: `radial-gradient(circle, ${getAuraColors().join(', ')})`
          }}
        ></div>
        <div className="silhouette"></div>
      </div> */}

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
        {result && (
          <>
            {activeTab === 'aura' && (
              <div className="aura-section">
                <h3>Your Aura Colors</h3>
                {result.auraColors ? (
                  <div className="section-content" dangerouslySetInnerHTML={{ __html: cleanText(result.auraColors) }} />
                ) : (
                  <div className="section-content" dangerouslySetInnerHTML={{ __html: result.fullReading }} />
                )}
              </div>
            )}
            
            {activeTab === 'personality' && (
              <div className="personality-section">
                <h3>Your Personality Profile</h3>
                {result.personality ? (
                  <div className="section-content" dangerouslySetInnerHTML={{ __html: result.personality }} />
                ) : (
                  <div className="section-content" dangerouslySetInnerHTML={{ __html: result.fullReading }} />
                )}
              </div>
            )}
            
            {activeTab === 'spiritual' && (
              <div className="spiritual-section">
                <h3>Your Spiritual Journey</h3>
                {result.spiritualProfile ? (
                  <div className="section-content" dangerouslySetInnerHTML={{ __html: result.spiritualProfile }} />
                ) : (
                  <div className="section-content" dangerouslySetInnerHTML={{ __html: result.fullReading }} />
                )}
              </div>
            )}

            {activeTab === 'energy' && (
              <div className="energy-plan-section">
                <h3>Your Personal Energy Plan</h3>
                
                <div className="energy-plan-container">
                  <div className="energy-box boost">
                    <h4>What's Boosting Your Vibe ↑</h4>
                    {result.energyBoosters ? (
                      <ul className="energy-list">
                        {formatEnergyBoosters(result.energyBoosters).map((item, index) => (
                          <li key={`boost-${index}`}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-data">Energy boosters not available.</p>
                    )}
                  </div>
                  
                  <div className="energy-box drain">
                    <h4>What's Draining Your Energy ↓</h4>
                    {result.energyDrains ? (
                      <ul className="energy-list">
                        {formatEnergyDrains(result.energyDrains).map((item, index) => (
                          <li key={`drain-${index}`}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-data">Energy drains not available.</p>
                    )}
                  </div>
                </div>
                
                <div className="alignment-section">
                  <h4>How to Stay Aligned</h4>
                  {result.alignment ? (
                    <ol className="alignment-list">
                      {formatAlignmentTips(result.alignment).map((tip, index) => (
                        <li key={`align-${index}`}>{tip}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="no-data">Alignment recommendations not available.</p>
                  )}
                </div>
                
                <div className="daily-practice">
                  <h4>Your Daily Practice</h4>
                  {result.dailyPractice ? (
                    <div className="practice-content" dangerouslySetInnerHTML={{ __html: result.dailyPractice }} />
                  ) : (
                    <p className="no-data">Daily practice not available.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="action-buttons">
        <button className="share-button">
          Go to next phase
        </button>
        <button className="retake-button" onClick={() => navigate('/questions')}>
          Retake Quiz
        </button>
      </div>
    </div>
  );
};

export default AuraResult;