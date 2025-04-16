import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import Navbar from '../components/Navbar';
import './Login.css'; // Import the external CSS file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State for error messages
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            const response = await axios.post('/api/auth/login', { email, password });
            const { token, user } = response.data;

            console.log('Login Successful:', { token, user }); // Log the response

            // Save token and user data
            login({ token, user });

            // Redirect based on user role
            if (user.isAdmin) {
                console.log('Redirecting admin to /admin');
                navigate('/admin');
            } else {
                console.log('Redirecting regular user to /dashboard');
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err.response?.data || err.message);

            // Set a user-friendly error message
            if (err.response?.status === 400) {
                setError('Invalid credentials. Please check your email and password.');
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        }
    };

    return (
        <div>
            {/* Navbar */}
            {/* <Navbar /> */}

            {/* Login Form */}
            <div className="login-container">
                <div className="login-card">
                    <h2 className="login-heading">Login</h2>

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
                        <button type="submit" className="login-button">
                            Login
                        </button>
                    </form>

                    {/* Registration Link */}
                    <p className="login-link">
                        Don't have an account?{' '}
                        <a href="/register" className="login-anchor">
                            Register here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;