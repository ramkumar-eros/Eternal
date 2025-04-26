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
}) => {
  return (
    <div className="question-wrapper">
      <div className="question">
        <h3 className="question-number-text">
          <span className="question-number">{questionNumber}.</span> {questionText}
        </h3>

        <div className="options-grid">
          {options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${selectedOption === index ? 'selected' : ''}`}
              onClick={() => onSelectOption(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Question;