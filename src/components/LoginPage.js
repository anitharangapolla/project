// src/components/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Logging in with:', { email, password });
        alert('Login Successful!');
        navigate('/dashboard');
    };

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Login Page</h1>
            <form onSubmit={handleLogin} style={{ maxWidth: '300px', margin: 'auto' }}>
                {/* Email and Password Inputs */}
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
                <button type="submit" style={{ padding: '10px', width: '100%' }}>Login</button>
            </form>
            <Link to="/signup">Sign Up</Link>
        </div>
    );
};

export default LoginPage;
