import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/quiz/${searchQuery.trim()}`); // Navigate to QuizPage with the search query
        } else {
            alert('Please enter a course to search.');
        }
    };

    const handleLogout = () => {
        navigate('/'); // Navigate back to the home page
    };

    return (
        <div
            style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Full page height
                padding: '20px',
            }}
        >
            <h1 style={{ marginBottom: '20px' }}>Welcome to PathGen AI</h1>
            <p style={{ marginBottom: '30px' }}>
                Unlock the Future of Learning with PathGen AI! Start searching for courses and grow your knowledge today.
            </p>

            <form
                onSubmit={handleSearch}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    maxWidth: '500px',
                }}
            >
                <input
                    type="text"
                    placeholder="Search for a course..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        flex: '1', // Take up available space
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '5px 0 0 5px', // Rounded left side only
                        outline: 'none',
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#000',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '0 5px 5px 0', // Rounded right side only
                        cursor: 'pointer',
                    }}
                >
                    Search
                </button>
            </form>

            <button
                onClick={handleLogout}
                style={{
                    marginTop: '30px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default DashboardPage;
