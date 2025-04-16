import React, { useState } from 'react';
import axios from 'axios';

const ArtistProfile = ({ artistId }) => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('profilePicture', profilePicture);

        try {
            const response = await axios.post(`/api/artists/upload-profile-picture/${artistId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Profile picture uploaded successfully!');
            console.log(response.data);
        } catch (err) {
            console.error(err.response?.data || err.message);
            setMessage('Failed to upload profile picture.');
        }
    };

    return (
        <div>
            <h2>Upload Profile Picture</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleFileChange} required />
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ArtistProfile;