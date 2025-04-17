import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Artists.css'; // Import the CSS file

const Artists = () => {
    const [artists, setArtists] = useState([]); // All artists fetched from the backend
    const [filteredArtists, setFilteredArtists] = useState([]); // Artists after filtering
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch artists from the backend
    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios.get('/api/artists'); // Replace with your API endpoint
                console.log('Fetched artists:', response.data); // Log the fetched data
                setArtists(response.data); // Set the fetched artists
                setFilteredArtists(response.data); // Initialize filtered artists with all artists
                setLoading(false); // Stop loading
            } catch (err) {
                console.error('Error fetching artists:', err.response?.data || err.message);
                setError('Failed to load artists. Please try again later.');
                setLoading(false); // Stop loading on error
            }
        };

        fetchArtists(); // Call the function to fetch artists
    }, []);

    // Filter artists based on the selected category
    const filterArtists = (category) => {
        if (category === 'all') {
            setFilteredArtists(artists); // Show all artists
        } else {
            const filtered = artists.filter((artist) => artist.category === category);
            setFilteredArtists(filtered); // Show only artists in the selected category
        }
    };

    // Render loading state
    if (loading) {
        return <p className="loading-message">Loading artists...</p>;
    }

    // Render error state
    if (error) {
        return <p className="error-message">{error}</p>;
    }

    // Get unique categories dynamically with safeguards
    const uniqueCategories = [
        ...new Set(
            artists
                .map((artist) => artist.category)
                .filter((category) => typeof category === 'string' && category.trim() !== '')
        ),
    ];

    return (
        <div className="artists-container">
            {/* Heading */}
            <h2 className="artists-heading">Уран бүтээлчид</h2>

            {/* Filter Dropdown */}
            <div className="filter-container">
                <label htmlFor="category-filter" className="filter-label">
                    Filter by Category:
                </label>
                <select id="category-filter" onChange={(e) => filterArtists(e.target.value)}>
                    <option value="all">All</option>
                    {uniqueCategories.map((category) => (
                        <option key={category} value={category}>
                            {typeof category === 'string' && category.trim() !== ''
                                ? category.charAt(0).toUpperCase() + category.slice(1)
                                : 'Uncategorized'} {/* Fallback for invalid categories */}
                        </option>
                    ))}
                </select>
            </div>

            {/* Artist Cards */}
            <div className="artist-grid">
                {filteredArtists.length > 0 ? (
                    filteredArtists.map((artist) => (
                        <div key={artist._id} className="artist-card">
                            <img
                                src={
                                    artist.profilePicture
                                        ? `http://localhost:5000${artist.profilePicture}`
                                        : '/default-avatar.png'
                                }
                                alt={`${artist.name}'s profile`}
                                onError={(e) => {
                                    e.target.src = '/default-avatar.png'; // Fallback image
                                }}
                                className="artist-image"
                            />
                            <h3>{artist.name}</h3>
                            <p><strong>Category:</strong> {artist.category || 'Uncategorized'}</p>
                            <p><strong>Price Per Hour:</strong> ₮{artist.pricePerHour || 'N/A'}</p>
                            <p>{artist.bio || 'No bio available.'}</p>
                        </div>
                    ))
                ) : (
                    <p className="no-artists-message">No artists found.</p>
                )}
            </div>
        </div>
    );
};

export default Artists;