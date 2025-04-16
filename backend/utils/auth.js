import axios from 'axios';

export const handleLogin = async (credentials) => {
    try {
        const response = await axios.post('/api/login', credentials);
        const { token, user } = response.data;

        // Store token and user data in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect to the admin dashboard if the user is an admin
        if (user.role === 'admin') {
            window.location.href = '/admin';
        } else {
            window.location.href = '/';
        }
    } catch (err) {
        console.error(err);
        throw new Error('Invalid credentials. Please try again.');
    }
};