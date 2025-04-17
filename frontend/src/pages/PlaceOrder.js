import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
    const [artists, setArtists] = useState([]); // List of all artists
    const [availability, setAvailability] = useState([]); // Artist's availability (with time slots)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); // Selected time slot
    const [formData, setFormData] = useState({
        artistId: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        totalPrice: 0,
    });
    const [error, setError] = useState(''); // Error message
    const [loading, setLoading] = useState(false); // Loading state
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
                const response = await axios.get(`/api/artist/${formData.artistId}/availability`);
                console.log('Availability Response:', response.data); // Log the response
                setAvailability(response.data.availability || []);
            } catch (err) {
                console.error('Error fetching availability:', err.response?.data || err.message);
                setError('Failed to fetch artist availability. Please try again.');
            }
        };

        fetchAvailability();
    }, [formData.artistId]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle time slot selection
    const handleTimeSlotChange = (slot) => {
        setSelectedTimeSlot(slot);
        setFormData({
            ...formData,
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
        });
    };

    // Handle placing an order
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedTimeSlot) {
            setError('Please select a valid time slot.');
            return;
        }

        if (formData.totalPrice <= 0) {
            setError('Total price must be greater than 0.');
            return;
        }

        setLoading(true); // Start loading

        try {
            await axios.post(
                '/api/orders',
                {
                    artistId: formData.artistId,
                    date: formData.date,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    location: formData.location,
                    totalPrice: parseFloat(formData.totalPrice),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert('Order placed successfully!');
            navigate('/user/orders'); // Redirect to user's orders page

            // Reset form fields
            setFormData({
                artistId: '',
                date: '',
                startTime: '',
                endTime: '',
                location: '',
                totalPrice: 0,
            });
            setSelectedTimeSlot(null);
            setError('');
        } catch (err) {
            if (err.response?.data?.error) {
                setError(err.response.data.error); // Backend validation error
            } else {
                setError('An unexpected error occurred. Please try again.'); // Generic error
            }
            console.error('Error placing order:', err.message);
        } finally {
            setLoading(false); // Stop loading
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

                {/* Display Availability with Time Slots */}
                {formData.artistId && (
                    <div style={{ marginBottom: '15px' }}>
                        <label style={styles.label}>Available Time Slots:</label>
                        {availability.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {availability.map((slot, index) => (
                                    <li key={index}>
                                        <button
                                            type="button"
                                            onClick={() => handleTimeSlotChange(slot)}
                                            style={{
                                                padding: '5px 10px',
                                                backgroundColor:
                                                    selectedTimeSlot?.date === slot.date &&
                                                    selectedTimeSlot?.startTime === slot.startTime
                                                        ? 'var(--primary-color)'
                                                        : 'var(--input-bg-color)',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                opacity: selectedTimeSlot?.date === slot.date && selectedTimeSlot?.startTime === slot.startTime ? 1 : 0.7,
                                                transition: 'opacity 0.3s',
                                            }}
                                        >
                                            {slot.date} ({slot.startTime} - {slot.endTime})
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No availability found for this artist.</p>
                        )}
                    </div>
                )}

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
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Placing Order...' : 'Place Order'}
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