import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [artists, setArtists] = useState([]);
    const [newArtist, setNewArtist] = useState({
        name: '',
        email: '',
        bio: '',
        profilePicture: '',
        category: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all artists
    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios.get('/api/artists', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setArtists(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching artists:', err.response?.data || err.message);
                setError('Failed to load artists.');
                setLoading(false);
            }
        };

        fetchArtists();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewArtist((prev) => ({ ...prev, [name]: value }));
    };

    // Add a new artist
    const handleAddArtist = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/admin/artists', newArtist, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setArtists([...artists, response.data]); // Add the new artist to the list
            setNewArtist({ name: '', email: '', bio: '', profilePicture: '', category: '' }); // Reset form
        } catch (err) {
            console.error('Error adding artist:', err.response?.data || err.message);
            setError('Failed to add artist.');
        }
    };

    // Delete an artist
    const handleDeleteArtist = async (id) => {
        try {
            await axios.delete(`/api/admin/artists/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setArtists(artists.filter((artist) => artist._id !== id)); // Remove the artist from the list
        } catch (err) {
            console.error('Error deleting artist:', err.response?.data || err.message);
            setError('Failed to delete artist.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>

            {/* Add New Artist Form */}
            <form onSubmit={handleAddArtist}>
                <h2>Add New Artist</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={newArtist.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newArtist.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="bio"
                    placeholder="Bio"
                    value={newArtist.bio}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="profilePicture"
                    placeholder="Profile Picture URL"
                    value={newArtist.profilePicture}
                    onChange={handleChange}
                />
                <select name="category" value={newArtist.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    <option value="singer">Singer</option>
                    <option value="dancer">Dancer</option>
                    <option value="anchor">Anchor</option>
                    <option value="band">Band</option>
                </select>
                <button type="submit">Add Artist</button>
            </form>

            {/* List of Artists */}
            <h2>Manage Artists</h2>
            <ul>
                {artists.map((artist) => (
                    <li key={artist._id}>
                        <strong>{artist.name}</strong> - {artist.email} ({artist.category})
                        <button onClick={() => handleDeleteArtist(artist._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;