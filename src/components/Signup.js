import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { signup } from './api/api'; // Import signup function from api.js

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Added error state
  const [message, setMessage] = useState(''); // Added message state
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state
    setMessage(''); // Reset success message

    try {
      const token = await signup(name, email, password); // API call to signup function
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      
      setMessage('Signup successful!');
      
      // Redirect to home page (or dashboard) after successful signup
      navigate('/'); // Redirect to the home page or dashboard
    } catch (err) {
      setError(err || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          className="form-control"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn">Sign Up</button>
      </form>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>} {/* Display error if any */}
      {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>} {/* Display success message */}
      <p style={{ textAlign: 'center' }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;
