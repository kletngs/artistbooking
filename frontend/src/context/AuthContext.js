import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
    return React.useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null); // For regular users (customers)
    const [artist, setArtist] = useState(null); // For artists

    // Load token and user/artist data from localStorage on app initialization
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            console.log('Token found in localStorage:', storedToken);
            setToken(storedToken); // Restore token

            // Fetch user or artist data from the backend
            const fetchUserData = async () => {
                try {
                    console.log('Fetching user/artist data from /api/auth/me...');
                    const response = await axios.get('/api/auth/me', {
                        headers: { Authorization: `Bearer ${storedToken}` },
                    });

                    const userData = response.data;

                    // Check if the logged-in user is an artist or a regular user
                    if (userData.role === 'artist') {
                        console.log('Artist data fetched successfully:', userData);
                        setArtist(userData); // Restore artist data
                    } else {
                        console.log('User data fetched successfully:', userData);
                        setUser(userData); // Restore user data
                    }
                } catch (err) {
                    console.error('Failed to fetch user/artist data:', err.response?.data || err.message);
                    logout(); // Clear invalid session
                }
            };

            fetchUserData();
        } else {
            console.log('No token found in localStorage.');
        }
    }, []);

    // Login function for both users and artists
    const login = (authData) => {
        console.log('Logging in:', authData);

        setToken(authData.token);
        if (authData.role === 'artist') {
            setArtist(authData.artist); // Set artist data
        } else {
            setUser(authData.user); // Set user data
        }

        localStorage.setItem('token', authData.token); // Save token to localStorage
    };

    // Logout function
    const logout = () => {
        console.log('Logging out...');
        setToken(null);
        setUser(null); // Clear user data
        setArtist(null); // Clear artist data
        localStorage.removeItem('token'); // Remove token from localStorage
    };

    return (
        <AuthContext.Provider value={{ token, user, artist, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};