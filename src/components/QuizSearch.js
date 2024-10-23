import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuizSearch = () => {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      try {
        const response = await axios.post('https://api.cohere.ai/v1/generate', {
          prompt: `Generate a quiz with 10 questions on ${input}. Each question should have 4 options.`,
          model: 'xlarge',
          max_tokens: 300,
          temperature: 0.7,
        }, {
          headers: {
            Authorization: `Bearer 4DXFsPiFWGRBusJhGMRWSw6VO848SKbliQ09CCz0`, // Replace with your API key
            'Content-Type': 'application/json',
          },
        });

        const generatedQuiz = response.data.generations[0].text;
        // Navigate to the TestScreen with the quiz and course name
        navigate('/test-screen', { state: { quiz: generatedQuiz, courseName: input } });
      } catch (error) {
        console.error('Error generating quiz:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a programming language or category"
      />
      <button type="submit">Generate Quiz</button>
    </form>
  );
};

export default QuizSearch;
