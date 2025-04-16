import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/orders/admin/all', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching orders:', err.response?.data || err.message);
                setError('Failed to fetch orders. Please try again.');
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    return (
        <div style={styles.container}>
            <h2>Manage All Orders</h2>

            {/* Display error message */}
            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

            {/* Loading State */}
            {loading ? (
                <p style={styles.loadingMessage}>Loading orders...</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>User</th>
                            <th style={styles.th}>Artist</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Location</th>
                            <th style={styles.th}>Total Price (₮)</th>
                            <th style={styles.th}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order._id} style={styles.tr}>
                                    <td style={styles.td}>
                                        {order.userId ? `${order.userId.name} (${order.userId.email})` : 'Unknown User'}
                                    </td>
                                    <td style={styles.td}>{order.artistId?.name || 'Unknown Artist'}</td>
                                    <td style={styles.td}>
                                        {order.date ? new Date(order.date).toLocaleDateString() : 'Unknown Date'}
                                    </td>
                                    <td style={styles.td}>{order.location || 'Unknown Location'}</td>
                                    <td style={styles.td}>₮{order.totalPrice || 'N/A'}</td>
                                    <td style={styles.td}>{order.status || 'Pending'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={styles.noData}>
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: 'var(--bg-color)',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 5px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    },
    th: {
        backgroundColor: 'var(--primary-color)',
        color: '#fff',
        padding: '10px',
        textAlign: 'left',
    },
    tr: {
        borderBottom: '1px solid var(--border-color)',
    },
    td: {
        padding: '10px',
        color: 'var(--text-color)',
    },
    noData: {
        textAlign: 'center',
        padding: '20px',
        color: 'var(--secondary-text-color)',
    },
    loadingMessage: {
        textAlign: 'center',
        marginTop: '20px',
        color: 'var(--secondary-text-color)',
    },
};

export default ManageOrders;