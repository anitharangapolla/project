import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TestScreen.css';

const COHERE_API_KEY = '4DXFsPiFWGRBusJhGMRWSw6VO848SKbliQ09CCz0';
const COHERE_API_URL = 'https://api.cohere.ai/v1/generate';

function TestScreen() {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);

  const handleModelResponse = async () => {
    try {
      setIsLoading(true);

      const prompt = `
        You are an AI designed to generate a multiple-choice quiz. Create a quiz with 10 questions for the course: ${courseName}.
        Each question should have four options and only one correct answer. If a question requires multiple answers, indicate that.
        Format the output as:
        1. Question
           a) Option 1
           b) Option 2
           c) Option 3
           d) Option 4
           Multiple choice: true or false
           Answer: (correct answer letters)
        If the question or answer contains any code, display it inside code blocks.
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
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.generations[0]?.text.trim();

      const parsedQuiz = parseQuiz(generatedText);
      setQuiz(parsedQuiz);

      console.log('Parsed Quiz:', parsedQuiz);

    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const parseQuiz = (text) => {
    const lines = text.split('\n');
    const questions = [];
    let currentQuestion = null;

    lines.forEach((line) => {
      line = line.trim();
      if (line.match(/^[0-9]+\. /)) {
        if (currentQuestion) questions.push(currentQuestion);
        currentQuestion = {
          question: line.replace(/^[0-9]+\. /, ''),
          options: [],
          correctAnswers: [],
          isMultipleChoice: false,
        };
      } else if (line.match(/^[a-d]\)/)) {
        currentQuestion.options.push(line.trim());
      } else if (line.startsWith('Answer:')) {
        const answers = line.split(':')[1].trim().split(',').map(answer => answer.trim());
        currentQuestion.correctAnswers = answers;
      } else if (line.startsWith('Multiple choice:')) {
        currentQuestion.isMultipleChoice = line.split(':')[1].trim().toLowerCase() === 'true';
      }
    });

    if (currentQuestion) questions.push(currentQuestion);
    return questions;
  };

  const handleAnswerChange = (questionIndex, selectedOption) => {
    setUserAnswers((prevAnswers) => {
      let updatedAnswers;

      if (quiz[questionIndex].isMultipleChoice) {
        const selectedAnswers = prevAnswers[questionIndex] || [];
        if (selectedAnswers.includes(selectedOption)) {
          updatedAnswers = { ...prevAnswers, [questionIndex]: selectedAnswers.filter(ans => ans !== selectedOption) };
        } else {
          updatedAnswers = { ...prevAnswers, [questionIndex]: [...selectedAnswers, selectedOption] };
        }
      } else {
        updatedAnswers = { ...prevAnswers, [questionIndex]: selectedOption };
      }

      console.log('User Answers:', updatedAnswers);

      return updatedAnswers;
    });
  };

  const handleSubmit = () => {
    let calculatedScore = 0;

    quiz.forEach((q, index) => {
      const userAnswersForQuestion = Array.isArray(userAnswers[index]) ? userAnswers[index] : [userAnswers[index]];
      const correctAnswers = q.correctAnswers;

      const isCorrect = correctAnswers.every(answer => userAnswersForQuestion.includes(answer));
      const hasAllCorrectAnswers = userAnswersForQuestion.every(answer => correctAnswers.includes(answer));

      if (isCorrect && hasAllCorrectAnswers) {
        calculatedScore++;
      }

      console.log(`Question ${index + 1}:`);
      console.log('User answers:', userAnswersForQuestion);
      console.log('Correct answers:', correctAnswers);
      console.log('Is correct:', isCorrect && hasAllCorrectAnswers);
    });

    setScore(calculatedScore);

    let level = '';
    if (calculatedScore <= 4) {
      level = 'beginner';
    } else if (calculatedScore <= 7) {
      level = 'intermediate';
    } else {
      level = 'advanced';
    }

    navigate(`/path/${courseName}/${level}`);
  };

  useEffect(() => {
    if (courseName) {
      handleModelResponse();
    }
  }, [courseName]);

  const renderWithCodeBlocks = (text) => {
    const codePattern = /```([^`]+)```/g;
    const parts = text.split(codePattern);

    return parts.map((part, index) =>
      index % 2 === 1 ? <code key={index} className="bg-light px-2 py-1">{part}</code> : part
    );
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Quiz for {courseName}</h2>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : (
        <>
          {quiz.length > 0 ? (
            quiz.map((q, index) => (
              <div key={index} className="quiz-question mb-5 p-3 border rounded">
                <h5 className="question-title">
                  {renderWithCodeBlocks(q.question)}
                </h5>
                <div className="options-list">
                  {q.options.map((option, optIndex) => {
                    // Check if option is defined before rendering
                    const optionValue = option || ''; // Default to empty string if option is undefined
                    const optionId = `question-${index}-option-${optIndex}`;
                    
                    return (
                      <div key={optIndex} className="form-check option-item mb-2">
                        {q.isMultipleChoice ? (
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={optionId}
                            onChange={() => handleAnswerChange(index, optionValue.charAt(0))}
                            checked={userAnswers[index]?.includes(optionValue.charAt(0)) || false}
                          />
                        ) : (
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`question-${index}`}
                            id={optionId}
                            value={optionValue.charAt(0)}
                            onChange={() => handleAnswerChange(index, optionValue.charAt(0))}
                            checked={userAnswers[index] === optionValue.charAt(0)}
                          />
                        )}
                        <label className="form-check-label" htmlFor={optionId}>
                          {renderWithCodeBlocks(optionValue)}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No quiz available. Please try again.</p>
          )}
          {quiz.length > 0 && (
            <div className="text-center">
              <button className="btn btn-primary mt-4" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          )}
          {score !== null && (
            <div className="alert alert-info text-center mt-4">
              Your score: {score} / {quiz.length}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TestScreen;
