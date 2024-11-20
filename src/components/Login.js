import React, { useState } from 'react';
import { login } from './api/api'; 
import { useNavigate,Link } from 'react-router-dom'; // Import useNavigate from react-router-dom

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Added error state
  const [message, setMessage] = useState(''); // Added message state
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state
    setMessage(''); // Reset success message

    try {
      const token = await login(email, password); // API call to login function
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      
      setMessage('Login successful!');
      
      // Redirect to home page (or dashboard) after successful login
      navigate('/'); // Redirect to the home page or dashboard
    } catch (err) {
      setError(err || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login to PathGen</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit" className="btn">Login</button>
      </form>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>} {/* Display error if any */}
      {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>} {/* Display success message */}
      <p style={{ textAlign: 'center' }}>
        Don't have an account? <Link to="/signup">Sign up</Link> {/* Link to signup page */}
      </p>
    </div>
  );
};

export default Login;
