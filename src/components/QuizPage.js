// src/components/quizpage.js
import React, { useState } from 'react';

function QuizPage() {
  const [quizQuestions, setQuizQuestions] = useState([
    {
      question: 'What is the output of 2 + 2 in JavaScript?',
      options: ['3', '4', '22', 'undefined'],
      correctAnswer: '4',
    },
    {
      question: 'Which language is used for web development?',
      options: ['Python', 'Java', 'JavaScript', 'C++'],
      correctAnswer: 'JavaScript',
    },
    // Add more questions as needed
  ]);

  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const handleOptionClick = (option) => {
    setSelectedAnswer(option);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    setSelectedAnswer('');
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const isQuizFinished = currentQuestionIndex >= quizQuestions.length;

  return (
    <div>
      {isQuizFinished ? (
        <h2>Your Score: {score}/{quizQuestions.length}</h2>
      ) : (
        <div>
          <h2>{quizQuestions[currentQuestionIndex].question}</h2>
          <div>
            {quizQuestions[currentQuestionIndex].options.map((option, index) => (
              <button key={index} onClick={() => handleOptionClick(option)}>
                {option}
              </button>
            ))}
          </div>
          <button onClick={handleNextQuestion}>Next</button>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
