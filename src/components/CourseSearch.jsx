import React, { useState } from 'react';
import { Button, Form, ListGroup } from 'react-bootstrap';
import './style.css'; 

const CourseSearch = () => {
  const [courseName, setCourseName] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);

  const courseData = [
    {
      category: 'Web Development',
      courses: [
        { name: 'React for Beginners' },
        { name: 'Introduction to HTML & CSS' },
        { name: 'JavaScript Essentials' },
      ],
    },
    {
      category: 'Data Science',
      courses: [
        { name: 'Advanced Data Science' },
        { name: 'Data Analysis with Python' },
        { name: 'Machine Learning A-Z' },
      ],
    },
    
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const filteredCourses = courseData
      .flatMap(category => 
        category.courses
          .filter(course => 
            course.name.toLowerCase().includes(courseName.toLowerCase())
          )
          .map(course => ({ ...course, category: category.category }))
      );

    setFilteredCourses(filteredCourses);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Course Search</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formCourseSearch">
          <Form.Label>Search for a Course</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter course name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>

      <h4 className="mt-4">Results</h4>
      <ListGroup>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => (
            <ListGroup.Item key={index}>
              <strong>{course.category}:</strong> {course.name}
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>No results found</ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
};

export default CourseSearch;
