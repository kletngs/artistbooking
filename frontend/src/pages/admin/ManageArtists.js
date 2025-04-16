import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const ManageArtists = () => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios.get('/api/admin/artists', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setArtists(response.data);
            } catch (err) {
                console.error('Error fetching artists:', err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchArtists();
    }, [token]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this artist?')) return;

        try {
            await axios.delete(`/api/admin/artists/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setArtists((prevArtists) => prevArtists.filter((artist) => artist._id !== id));
        } catch (err) {
            console.error('Error deleting artist:', err.response?.data || err.message);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Manage Artists</h2>

            {/* Add New Artist Button */}
            <Link to="/admin/add-artist">
                <button style={styles.addButton}>Add New Artist</button>
            </Link>

            {/* Loading State */}
            {loading ? (
                <p style={styles.loadingMessage}>Loading artists...</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Category</th>
                            <th style={styles.th}>Price Per Hour (₮)</th> {/* New Column */}
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {artists.length > 0 ? (
                            artists.map((artist) => (
                                <tr key={artist._id} style={styles.tr}>
                                    <td style={styles.td}>{artist.name}</td>
                                    <td style={styles.td}>{artist.email}</td>
                                    <td style={styles.td}>{artist.category}</td>
                                    <td style={styles.td}>{artist.pricePerHour}</td> {/* Display Price */}
                                    <td style={styles.td}>
                                        <button
                                            onClick={() => handleDelete(artist._id)}
                                            style={styles.deleteButton}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={styles.noData}>
                                    No artists found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};


// Inline Styles for ManageArtists
const styles = {
    container: {
        backgroundColor: 'var(--bg-color)',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 5px',
    },
    heading: {
        fontSize: '2rem',
        marginBottom: '20px',
        color: 'var(--text-color)',
    },
    addButton: {
        padding: '10px 20px',
        backgroundColor: '#2ecc71',
        color: '#fff',
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer',
        marginBottom: '20px',
        transition: 'background-color 0.3s',
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
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#e74c3c',
        color: '#fff',
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
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

export default ManageArtists;