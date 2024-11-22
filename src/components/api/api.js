// src/api/api.js
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/auth'; // Adjust based on your backend URL

// Login API
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    // Assuming the response contains the token
    return response.data.token;
  } catch (error) {
    throw error.response?.data?.message || 'An error occurred during login.';
  }
};

// Signup API
export const signup = async (name,email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, { name , email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'An error occurred during signup.';
  }
};
