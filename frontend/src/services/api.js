import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig'; // Import the base URL

// Login artist
export const loginArtist = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/artist/login`, { email, password });
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: 'Login failed.' };
    }
};

// Login user or admin
export const loginUserOrAdmin = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: 'Login failed.' };
    }
};

// Fetch artist profile
export const fetchArtistProfile = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/artist/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to fetch artist profile.' };
    }
};

// Update artist availability
export const updateArtistAvailability = async (token, availability) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/artist/availability`, { availability }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to update availability.' };
    }
};

// Check availability
export const checkAvailability = async (artistId, date, startTime, endTime) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/artist/check-availability`, { artistId, date, startTime, endTime });
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to check availability.' };
    }
};