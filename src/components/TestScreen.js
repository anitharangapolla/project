import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TestScreen.css'; // Separate CSS file for custom styles

const COHERE_API_KEY = '4DXFsPiFWGRBusJhGMRWSw6VO848SKbliQ09CCz0';
const COHERE_API_URL = 'https://api.cohere.ai/v1/generate';

function TestScreen() {
  const { courseName } = useParams();
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
          max_tokens: 800, // Increased token limit
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

      // Log the generated text for debugging
      console.log('Generated Quiz Text:', generatedText);

      const parsedQuiz = parseQuiz(generatedText); // Parse the text into JSON format
      setQuiz(parsedQuiz);

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
      // Check for a new question without the prefix
      if (line.match(/^[0-9]+\. /)) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          question: line.replace(/^[0-9]+\. /, ''), // Remove the number prefix
          options: [],
          correctAnswers: [],
          isMultipleChoice: false,
        };
      } else if (line.match(/^[a-d]\)/)) {
        currentQuestion.options.push(line.trim()); // Add options
      } else if (line.startsWith('Answer:')) {
        const answers = line.split(':')[1].trim().split(',').map(answer => answer.trim());
        currentQuestion.correctAnswers = answers; // Set correct answers
      } else if (line.startsWith('Multiple choice:')) {
        currentQuestion.isMultipleChoice = line.split(':')[1].trim().toLowerCase() === 'true'; // Set multiple choice flag
      }
    });

    if (currentQuestion) {
      questions.push(currentQuestion); // Add the last question
    }

    // Log parsed questions for debugging
    console.log('Parsed Questions:', questions);

    return questions; // Return the structured quiz
  };

  const handleAnswerChange = (questionIndex, selectedOption) => {
    setUserAnswers((prevAnswers) => {
      if (quiz[questionIndex].isMultipleChoice) {
        // For multiple choice, add or remove selected option
        const selectedAnswers = prevAnswers[questionIndex] || [];
        if (selectedAnswers.includes(selectedOption)) {
          return { ...prevAnswers, [questionIndex]: selectedAnswers.filter(ans => ans !== selectedOption) };
        } else {
          return { ...prevAnswers, [questionIndex]: [...selectedAnswers, selectedOption] };
        }
      } else {
        // For single choice, just set the selected option
        return { ...prevAnswers, [questionIndex]: selectedOption };
      }
    });
  };

  const handleSubmit = () => {
    let calculatedScore = 0;

    quiz.forEach((q, index) => {
      const userAnswersForQuestion = userAnswers[index] || [];
      const correctAnswers = q.correctAnswers;

      // Check if user's answers match the correct answers
      const isCorrect = correctAnswers.every(answer => userAnswersForQuestion.includes(answer));
      if (isCorrect) {
        calculatedScore++; // Increment score for each correct answer
      }
      // No need to penalize for incorrect answers, so do nothing here
    });

    setScore(calculatedScore);
  };

  useEffect(() => {
    if (courseName) {
      handleModelResponse();
    }
  }, [courseName]);

  // Function to detect and wrap code in <code> blocks
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
                  {renderWithCodeBlocks(q.question)} {/* Render question with code blocks */}
                </h5>
                <div className="options-list">
                  {q.options.map((option, optIndex) => (
                    <div key={optIndex} className="form-check option-item mb-2">
                      {q.isMultipleChoice ? (
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`question-${index}-option-${optIndex}`}
                          onChange={() => handleAnswerChange(index, option.charAt(0))}
                          checked={userAnswers[index]?.includes(option.charAt(0)) || false}
                        />
                      ) : (
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`question-${index}`} // Ensure the name is unique per question
                          id={`question-${index}-option-${optIndex}`}
                          value={option.charAt(0)} // Set the value to the option's character
                          onChange={() => handleAnswerChange(index, option.charAt(0))}
                          checked={userAnswers[index] === option.charAt(0)} // Ensure checked state is managed
                        />
                      )}
                      <label
                        className="form-check-label"
                        htmlFor={`question-${index}-option-${optIndex}`}
                      >
                        {renderWithCodeBlocks(option)} {/* Render options with code blocks */}
                      </label>
                    </div>
                  ))}
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
