import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QuizCategories = () => {
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const COHERE_API_KEY = '4DXFsPiFWGRBusJhGMRWSw6VO848SKbliQ09CCz0';
  const COHERE_API_URL = 'https://api.cohere.ai/v1/generate';

  const handleGenerateQuiz = async () => {
    try {
      const response = await axios.post(COHERE_API_URL, {
        prompt: `Generate a quiz on ${category}`,
        model: 'xlarge',
        max_tokens: 100,
        temperature: 0.7,
      }, {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const generatedQuiz = response.data.generations[0].text;
      // Navigate to the TestScreen page and pass the generated quiz data
      navigate('/test-screen', { state: { quiz: generatedQuiz } });
    } catch (error) {
      console.error('Error generating quiz:', error);
    }
  };

  return (
    <div className="quiz-container">
      <h2>Select a Category to Generate a Quiz</h2>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter category (e.g., JavaScript, Python)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleGenerateQuiz}>Generate Quiz</button>
    </div>
  );
};

export default QuizCategories;
