import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './QuizPage.css';

const QuizPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const categories = [
    { name: 'Full Stack Web Development', courses: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'] },
    { name: 'Data Science', courses: ['Python', 'Pandas', 'Machine Learning', 'Deep Learning'] },
    { name: 'Programming Languages', courses: ['Java', 'Python', 'C++', 'Go'] },
    { name: 'Databases', courses: ['MySQL', 'MongoDB', 'PostgreSQL'] },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/quiz/${searchTerm}`);
    }
  };

  const handleCourseClick = (course) => {
    navigate(`/quiz/${course}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Search for a Course</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter course name (e.g., JavaScript)"
            required
            className="form-control"
            style={{ fontSize: '1.2em' }}
          />
          <button type="submit" className="btn btn-primary ml-2">Search</button>
        </div>
      </form>

      <h2 className="text-center mb-3" style={{ backgroundColor: '#f8f9fa', padding: '10px' }}>Categories</h2>
      {categories.map((category) => (
        <div key={category.name} className="mb-4">
          <h3 className="text-center">{category.name}</h3>
          <ul className="list-group">
            {category.courses.map((course) => (
              <li
                key={course}
                className="list-group-item list-group-item-action text-center"
                style={{ cursor: 'pointer' }}
                onClick={() => handleCourseClick(course)}
              >
                {course}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default QuizPage;
