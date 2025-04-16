import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('/api/bookings');
                setBookings(response.data);
            } catch (err) {
                console.error('Error fetching bookings:', err.response?.data || err.message);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div>
            <h2>Manage Bookings</h2>
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>Artist</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking._id}>
                            <td>{booking.artistName}</td>
                            <td>{booking.date}</td>
                            <td>{booking.status}</td>
                            <td>
                                <button>Edit</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageBookings;