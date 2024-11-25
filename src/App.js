
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import SignUpPage from './components/SignUpPage';
import LoginPage from './components/LoginPage'; 
import DashboardPage from './components/DashboardPage'; 
import QuizPage from './components/QuizPage'; 
import TestScreen from './components/TestScreen';
import NotFound from './components/NotFound';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} /> 
                <Route path="/dashboard" element={<DashboardPage />} /> 
                <Route path="/quiz/:courseName" element={<QuizPage />} />  
                <Route path="/" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
