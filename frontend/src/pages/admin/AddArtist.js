import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddArtist = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        category: '',
        pricePerHour: '', // Price per hour field
        profilePicture: null,
        password: '', // New password field
    });
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, profilePicture: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (
            !formData.name ||
            !formData.email ||
            !formData.category ||
            !formData.pricePerHour ||
            !formData.profilePicture ||
            !formData.password
        ) {
            alert('All fields are required.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (formData.password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('bio', formData.bio);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('pricePerHour', formData.pricePerHour); // Add pricePerHour
            formDataToSend.append('profilePicture', formData.profilePicture);
            formDataToSend.append('password', formData.password); // Add password

            await axios.post('/api/admin/artists', formDataToSend, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert('Artist added successfully!');
            navigate('/admin/artists');
        } catch (err) {
            console.error('Error adding artist:', err.response?.data || err.message);
            alert('Failed to add artist. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Add New Artist</h2>

            <form onSubmit={handleSubmit} encType="multipart/form-data" style={styles.form}>
                {/* Name */}
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                />

                {/* Email */}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                />

                {/* Password */}
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                />

                {/* Bio */}
                <textarea
                    name="bio"
                    placeholder="Bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    style={styles.textarea}
                />

                {/* Category */}
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                />

                {/* Price Per Hour */}
                <input
                    type="number"
                    name="pricePerHour"
                    placeholder="Price Per Hour (₮)"
                    value={formData.pricePerHour}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                />

                {/* Profile Picture */}
                <label htmlFor="profilePicture" style={styles.label}>
                    Profile Picture:
                </label>
                <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    onChange={handleFileChange}
                    required
                    style={styles.fileInput}
                />

                {/* Submit Button */}
                <button type="submit" style={styles.button}>
                    Add Artist
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
    },
    heading: {
        fontSize: '2rem',
        marginBottom: '20px',
        color: 'var(--text-color)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '300px',
        gap: '15px',
    },
    input: {
        padding: '10px',
        fontSize: '1rem',
        border: '1px solid var(--border-color)',
        borderRadius: '5px',
        backgroundColor: 'var(--input-bg-color)',
        color: 'var(--text-color)',
    },
    textarea: {
        padding: '10px',
        fontSize: '1rem',
        border: '1px solid var(--border-color)',
        borderRadius: '5px',
        resize: 'vertical',
        minHeight: '80px',
        backgroundColor: 'var(--input-bg-color)',
        color: 'var(--text-color)',
    },
    label: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: 'var(--text-color)',
    },
    fileInput: {
        padding: '10px',
        fontSize: '1rem',
        border: '1px solid var(--border-color)',
        borderRadius: '5px',
        backgroundColor: 'var(--input-bg-color)',
        color: 'var(--text-color)',
    },
    button: {
        padding: '10px',
        backgroundColor: 'var(--primary-color)',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'background-color 0.3s ease',
    },
};

export default AddArtist;