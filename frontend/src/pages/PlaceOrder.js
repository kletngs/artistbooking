import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
    const [artists, setArtists] = useState([]); // List of all artists
    const [selectedArtist, setSelectedArtist] = useState(null); // Selected artist details
    const [availability, setAvailability] = useState([]); // Artist's availability
    const [formData, setFormData] = useState({
        artistId: '',
        date: '',
        location: '',
        totalPrice: 0,
    });
    const [error, setError] = useState(''); // Error message
    const { token } = useAuth();
    const navigate = useNavigate();

    // Fetch available artists
    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios.get('/api/artists');
                setArtists(response.data);
            } catch (err) {
                console.error('Error fetching artists:', err.response?.data || err.message);
                setError('Failed to fetch artists. Please try again.');
            }
        };
        fetchArtists();
    }, []);

    // Fetch artist availability when a new artist is selected
    useEffect(() => {
        if (!formData.artistId) return;

        const fetchAvailability = async () => {
            try {
                const response = await axios.get(`/api/artists/${formData.artistId}/availability`);
                setAvailability(response.data.availability);

                // Find the selected artist details
                const artist = artists.find((a) => a._id === formData.artistId);
                setSelectedArtist(artist);
            } catch (err) {
                console.error('Error fetching availability:', err.response?.data || err.message);
                setError('Failed to fetch artist availability. Please try again.');
            }
        };

        fetchAvailability();
    }, [formData.artistId, artists]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Reset date selection if artist changes
        if (name === 'artistId') {
            setFormData({ ...formData, artistId: value, date: '' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handle placing an order
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!availability.includes(formData.date)) {
            setError('Selected date is not available. Please choose another date.');
            return;
        }

        try {
            await axios.post(
                '/api/orders',
                { ...formData, totalPrice: parseFloat(formData.totalPrice) }, // Ensure totalPrice is a number
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert('Order placed successfully!');
            navigate('/user/orders'); // Redirect to user's orders page
        } catch (err) {
            console.error('Error placing order:', err.response?.data || err.message);
            setError('Failed to place order. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Place an Order</h2>

            {/* Display error message */}
            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Artist Selection */}
                <label htmlFor="artistId" style={styles.label}>
                    Select Artist:
                </label>
                <select
                    id="artistId"
                    name="artistId"
                    value={formData.artistId}
                    onChange={handleChange}
                    required
                    style={styles.select}
                >
                    <option value="">-- Select an Artist --</option>
                    {artists.map((artist) => (
                        <option key={artist._id} value={artist._id}>
                            {artist.name} - ₮{artist.pricePerHour}/hour
                        </option>
                    ))}
                </select>

                {/* Display Availability */}
                {formData.artistId && (
                    <div style={{ marginBottom: '15px' }}>
                        <label style={styles.label}>Available Dates:</label>
                        {availability.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {availability.map((date) => (
                                    <li key={date}>{date}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No availability found for this artist.</p>
                        )}
                    </div>
                )}

                {/* Date */}
                <label htmlFor="date" style={styles.label}>
                    Date:
                </label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />

                {/* Location */}
                <label htmlFor="location" style={styles.label}>
                    Location:
                </label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Enter location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />

                {/* Total Price */}
                <label htmlFor="totalPrice" style={styles.label}>
                    Total Price (₮):
                </label>
                <input
                    type="number"
                    id="totalPrice"
                    name="totalPrice"
                    placeholder="Enter total price"
                    value={formData.totalPrice}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />

                {/* Submit Button */}
                <button type="submit" style={styles.button}>
                    Place Order
                </button>
            </form>
        </div>
    );
};

// Inline Styles
const styles = {
    container: {
        padding: '100px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    label: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: 'var(--text-color)',
    },
    select: {
        padding: '10px',
        fontSize: '1rem',
        border: '1px solid var(--border-color)',
        borderRadius: '5px',
        backgroundColor: 'var(--input-bg-color)',
        color: 'var(--text-color)',
    },
    input: {
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
        transition: 'background-color 0.3s',
    },
};

export default PlaceOrder;