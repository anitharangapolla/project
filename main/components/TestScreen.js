import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TestScreen.css';

const COHERE_API_KEY = '4DXFsPiFWGRBusJhGMRWSw6VO848SKbliQ09CCz0';  // Replace with your Cohere API Key
const COHERE_API_URL = 'https://api.cohere.ai/v1/generate';

function TestScreen() {
  const { courseName } = useParams(); // Get courseName from URL
  const [quiz, setQuiz] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (courseName) {
      handleModelResponse(); // Fetch quiz when courseName is available
    }
  }, [courseName]);

  const handleModelResponse = async () => {
    try {
      setIsLoading(true);

      const prompt = `
        You are an AI designed to generate a multiple-choice quiz. Create a quiz with 10 questions for the course: ${courseName}.
        Each question should have four options and only one correct answer.
        Format the output as:
        1. Question
           a) Option 1
           b) Option 2
           c) Option 3
           d) Option 4
           Answer: (correct answer letter)
      `;

      const response = await fetch(COHERE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${COHERE_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 800,
          temperature: 0.7,
          stop_sequences: [],
          return_likelihoods: 'NONE',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.generations[0]?.text.trim();
      const parsedQuiz = parseQuiz(generatedText);
      setQuiz(parsedQuiz);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const parseQuiz = (text) => {
    const questions = text.split('\n\n');
    return questions.map((questionBlock) => {
      const lines = questionBlock.split('\n');
      const questionText = lines[0].trim();
      const options = lines.slice(1, 5).map((line) => line.trim());
      const answerLine = lines.find((line) => line.startsWith('Answer:'));
      const correctAnswer = answerLine ? answerLine.split(':')[1].trim() : '';
      return {
        questionText,
        options,
        correctAnswer,
      };
    });
  };

  const handleAnswerChange = (questionIndex, selectedOption) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: selectedOption,
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quiz.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Quiz for {courseName}</h2>
      {isLoading ? (
        <div>Loading quiz...</div>
      ) : (
        <form onSubmit={(e) => e.preventDefault()}>
          {quiz.map((q, index) => (
            <div key={index} className="mb-4">
              <h4>{q.questionText}</h4>
              {q.options.map((option, optIndex) => (
                <div key={optIndex}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    onChange={() => handleAnswerChange(index, option)}
                  />
                  <label>{option}</label>
                </div>
              ))}
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            Submit Quiz
          </button>
        </form>
      )}
      {score !== null && <h4>Your Score: {score}/{quiz.length}</h4>}
    </div>
  );
}


function TestScreen1({ quiz, calculateScore, score }) {
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAnswer) {
      calculateScore(selectedAnswer);
    }
  };

  return (
    <div className="container">
      <h2>{quiz.question}</h2>
      <form onSubmit={handleSubmit}>
        {quiz.options.map((option, index) => (
          <div key={index}>
            <input
              type="radio"
              name="answer"
              value={option}
              checked={selectedAnswer === option}
              onChange={() => setSelectedAnswer(option)}
            />
            <label>{option}</label>
          </div>
        ))}
        <button type="submit">Submit Answer</button>
      </form>

      {score !== null && (
        <h4 className="score">
          {score === 1 ? 'Correct!' : 'Incorrect! The correct answer was ' + quiz.correctAnswer}
        </h4>
      )}
    </div>
  );
}



export default TestScreen;
