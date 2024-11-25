// src/components/SignUpPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        console.log('Signing up with:', { email, password });
        alert('Sign Up Successful!');
        navigate('/dashboard');
    };

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Sign Up Page</h1>
            <form onSubmit={handleSignUp} style={{ maxWidth: '300px', margin: 'auto' }}>
                {/* Email, Password, and Confirm Password Inputs */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ marginBottom: '15px', padding: '10px', width: '100%' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ marginBottom: '15px', padding: '10px', width: '100%' }}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ marginBottom: '15px', padding: '10px', width: '100%' }}
                />
                <button type="submit" style={{ padding: '10px', width: '100%'  }}>Sign Up</button>
            </form>
            <Link to="/login">Login</Link>
        </div>
    );
};

export default SignUpPage;
