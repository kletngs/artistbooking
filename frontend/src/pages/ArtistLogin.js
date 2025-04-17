import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginArtist } from '../services/api'; // Centralized API function
import './ArtistLogin.css'; // Import the external CSS file

const ArtistLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // Validate input
        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            console.log('Submitting artist login form...');
            console.log('Request Payload:', { email, password });

            // Call the centralized API function
            const response = await loginArtist(email, password);
            console.log('Backend Response:', response);

            const { token, artist } = response;

            // Save token and artist data
            login({ token, artist });

            // Redirect to artist dashboard
            console.log('Redirecting artist to /artist/dashboard');
            navigate('/artist/dashboard');
        } catch (err) {
            console.error('Login error:', err.message);

            // Set a user-friendly error message
            if (err.response?.status === 400) {
                setError('Invalid credentials. Please check your email and password.');
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-heading">Artist Login</h2>

                {/* Error Message */}
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label className="input-label">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login as Artist'}
                    </button>
                </form>

                {/* Registration Link */}
                <p className="login-link">
                    Don't have an account?{' '}
                    <a href="/artist/register" className="login-anchor">
                        Register here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default ArtistLogin;