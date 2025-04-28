// src/components/Questions/Question.jsx
import React from 'react';
import './Question.css';

const Question = ({
  questionNumber,
  totalQuestions,
  questionText,
  options,
  selectedOption,
  onSelectOption,
  isHighlighted,
}) => {
  return (
    <div className={`question-wrapper ${isHighlighted ? 'highlighted' : ''}`}>
      <div className="glow-orb glow-blue"></div>
      <div className="glow-orb glow-teal"></div>
      
      <div className="question">
        <h3 className="question-number-text">
          <span className="question-number">{questionNumber}</span> {questionText}
        </h3>

        <div className="options-grid">
          {options.map((option, index) => {
            // Handle both formats: string or object with text/index
            const optionText = typeof option === 'string' ? option : option.text;
            const optionIndex = typeof option === 'string' ? index : option.index;
            
            return (
              <button
                key={index}
                className={`option-button ${selectedOption === optionIndex ? 'selected' : ''}`}
                onClick={() => onSelectOption(optionIndex)}
                data-index={optionIndex}
              >
                <span className="option-text">{optionText}</span>
                <span className="option-ripple"></span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Question;