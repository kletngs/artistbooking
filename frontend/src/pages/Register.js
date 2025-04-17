import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import the CSS file

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State to store error messages
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!name || !email || !password) {
            setError('All fields are required.');
            return;
        }

        if (password.length < 3) {
            setError('Password must be at least 3 characters long.');
            return;
        }

        try {
            const userData = {
                name: name,
                email: email,
                password: password,
            };

            console.log('Sending registration request:', userData);

            const response = await axios.post('/api/auth/register', userData);
            console.log('Registration successful:', response.data);

            alert('Registration successful!');
            navigate('/login');
        } catch (err) {
            console.error('Registration failed:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            {/* Heading */}
            <h2>Register</h2>

            {/* Error Message */}
            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

            {/* Registration Form */}
            <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                {/* Email Field */}
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* Password Field */}
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength="3"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;