import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/orders/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching user orders:', err.response?.data || err.message);
                setError('Failed to fetch your orders. Please try again.');
                setLoading(false);
            }
        };
        fetchUserOrders();
    }, [token]);

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Миний захиалгууд</h2>

            {/* Display error message */}
            {error && <p style={styles.errorMessage}>{error}</p>}

            {/* Loading State */}
            {loading ? (
                <p style={styles.loadingMessage}>Loading your orders...</p>
            ) : (
                <>
                    {orders.length > 0 ? (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Artist</th>
                                    <th style={styles.th}>Date</th>
                                    <th style={styles.th}>Location</th>
                                    <th style={styles.th}>Total Price (₮)</th>
                                    <th style={styles.th}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} style={styles.tr}>
                                        <td style={styles.td}>{order.artistId?.name || 'Unknown Artist'}</td>
                                        <td style={styles.td}>
                                            {order.date ? new Date(order.date).toLocaleDateString() : 'Unknown Date'}
                                        </td>
                                        <td style={styles.td}>{order.location || 'Unknown Location'}</td>
                                        <td style={styles.td}>₮{order.totalPrice || 'N/A'}</td>
                                        <td style={styles.td}>
                                            <span
                                                style={{
                                                    ...styles.status,
                                                    backgroundColor:
                                                        order.status === 'Pending'
                                                            ? '#FFB400'
                                                            : order.status === 'Completed'
                                                            ? '#28A745'
                                                            : '#DC3545',
                                                }}
                                            >
                                                {order.status || 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={styles.noDataContainer}>
                            <p style={styles.noDataMessage}>No orders found.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: 'var(--bg-color)',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        margin: '20px auto',
        maxWidth: '1200px',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: 'var(--text-color)',
        marginBottom: '20px',
        textAlign: 'center',
    },
    errorMessage: {
        color: '#dc3545',
        fontSize: '1rem',
        textAlign: 'center',
        marginBottom: '10px',
    },
    loadingMessage: {
        textAlign: 'center',
        fontSize: '1rem',
        color: 'var(--secondary-text-color)',
        marginTop: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    },
    th: {
        backgroundColor: 'var(--primary-color)',
        color: '#fff',
        padding: '12px 15px',
        textAlign: 'left',
        fontSize: '1rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    tr: {
        borderBottom: '1px solid var(--border-color)',
        transition: 'background-color 0.3s ease',
    },
    td: {
        padding: '12px 15px',
        fontSize: '1rem',
        color: 'var(--text-color)',
        verticalAlign: 'middle',
    },
    status: {
        padding: '5px 10px',
        borderRadius: '5px',
        color: '#fff',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    noDataContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        border: '1px dashed var(--border-color)',
        borderRadius: '10px',
    },
    noDataMessage: {
        fontSize: '1.2rem',
        color: 'var(--secondary-text-color)',
        textAlign: 'center',
    },
};

export default UserOrders;