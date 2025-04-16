import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ArtistDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch artist profile
                const profileResponse = await axios.get('/api/artists/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(profileResponse.data);

                // Fetch artist's availability
                setAvailability(profileResponse.data.availability);

                // Fetch artist's bookings
                const bookingsResponse = await axios.get('/api/artists/bookings', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookings(bookingsResponse.data);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err.response?.data || err.message);
                setError('Failed to load data. Please try again.');
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const handleUpdateAvailability = async (newAvailability) => {
        try {
            await axios.put(
                '/api/artists/availability',
                { availability: newAvailability },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setAvailability(newAvailability);
            alert('Availability updated successfully!');
        } catch (err) {
            console.error('Error updating availability:', err.response?.data || err.message);
            alert('Failed to update availability. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Миний Dashboard</h2>

            {/* Error Message */}
            {error && <p style={styles.errorMessage}>{error}</p>}

            {/* Loading State */}
            {loading ? (
                <p style={styles.loadingMessage}>Loading data...</p>
            ) : (
                <>
                    {/* Profile Section */}
                    <div style={styles.section}>
                        <h3 style={styles.subHeading}>Миний Профайл</h3>
                        <p><strong>Нэр:</strong> {profile.name}</p>
                        <p><strong>Категори:</strong> {profile.category}</p>
                        <p><strong>Цагийн үнэ:</strong> ₮{profile.pricePerHour}</p>
                        <p><strong>Био:</strong> {profile.bio || 'No bio available.'}</p>
                    </div>

                    {/* Availability Section */}
                    <div style={styles.section}>
                        <h3 style={styles.subHeading}>Боломжит Цаг</h3>
                        <div style={styles.availabilityContainer}>
                            {availability.length > 0 ? (
                                availability.map((date, index) => (
                                    <div key={index} style={styles.availabilityItem}>
                                        {new Date(date).toLocaleDateString()}
                                    </div>
                                ))
                            ) : (
                                <p style={styles.noData}>Боломжит цаг байхгүй байна.</p>
                            )}
                        </div>
                        <button
                            onClick={() =>
                                handleUpdateAvailability([
                                    ...availability,
                                    new Date().toISOString(),
                                ])
                            }
                            style={styles.addButton}
                        >
                            Add New Availability
                        </button>
                    </div>

                    {/* Bookings Section */}
                    <div style={styles.section}>
                        <h3 style={styles.subHeading}>Миний Захиалгууд</h3>
                        {bookings.length > 0 ? (
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Огноо</th>
                                        <th style={styles.th}>Газар</th>
                                        <th style={styles.th}>Нийт үнэ (₮)</th>
                                        <th style={styles.th}>Статус</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((order) => (
                                        <tr key={order._id} style={styles.tr}>
                                            <td style={styles.td}>
                                                {new Date(order.date).toLocaleDateString()}
                                            </td>
                                            <td style={styles.td}>{order.location}</td>
                                            <td style={styles.td}>₮{order.totalPrice}</td>
                                            <td style={styles.td}>{order.status || 'Pending'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={styles.noData}>Захиалга байхгүй байна.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ArtistDashboard;