import React, { useState,  } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/apiConfig'; // Import the base URL

const ArtistLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Submitting login form...');
            console.log('Request Payload:', { email, password });
    
            // Ensure the password is plain text
            const response = await axios.post(`${API_BASE_URL}/auth/artist/login`, { email, password });
            console.log('Backend Response:', response.data); // Log the response
    
            const { token, artist } = response.data;
    
            // Call the login function from AuthContext
            login({ token, artist });
    
            // Redirect to artist dashboard
            navigate('/artist/dashboard');
        } catch (err) {
            console.error('Error during login:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Login failed.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-heading">Artist Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label htmlFor="email" className="input-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password" className="input-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Login as Artist
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ArtistLogin;