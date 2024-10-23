import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import QuizCategories from './components/QuizCategories';
import Login from './components/Login';
import Signup from './components/Signup';
import TestScreen from './components/TestScreen'; // Import TestScreen
import QuizSearch from './components/QuizSearch'; // This will be your search component
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [score, setScore] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setQuiz(null); // Reset quiz on logout
    setScore(null); // Reset score on logout
  };

  const generateQuiz = async (language) => {
    try {
      // Make your API call to generate a quiz based on the input language
      const response = await fetch(`YOUR_API_URL?category=${language}&limit=10`); // Adjust the URL accordingly
      const data = await response.json();

      // Assuming the API returns an array of questions
      const generatedQuiz = data.questions.map((q) => ({
        question: q.question,
        options: q.options, // Ensure this structure matches your API
        correctAnswer: q.correctAnswer, // Ensure this structure matches your API
      }));

      setQuiz(generatedQuiz);
      setScore(null); // Reset score when a new quiz is generated
      setShowQuiz(true); // Show quiz after generation
    } catch (error) {
      console.error("Error generating quiz:", error);
    }
  };

  const calculateScore = (userAnswer) => {
    if (quiz) {
      const correctAnswers = quiz.filter(q => q.correctAnswer === userAnswer);
      setScore(correctAnswers.length); // Calculate score based on correct answers
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quiz-categories" element={<QuizCategories />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />
          <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />
          <Route path="/test-screen/:courseName" element={<TestScreen />} /> 
          
          <Route path="/quiz-search" element={
            <QuizSearch generateQuiz={generateQuiz} />
          } />
          {/* Add any other routes you need */}
        </Routes>

        {showQuiz && (
          <div className="quiz-container">
            {quiz.map((q, index) => (
              <div key={index}>
                <h3>{q.question}</h3>
                {q.options.map((option, i) => (
                  <label key={i}>
                    <input
                      type="radio"
                      name={`question${index}`}
                      value={option}
                      onChange={() => calculateScore(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            ))}
            {score !== null && <h4>Your Score: {score}/{quiz.length}</h4>}
          </div>
        )}
      </div>
    </Router>
  ); 
}

export default App;
