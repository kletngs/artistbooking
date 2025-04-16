import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
    return (
        <nav style={{
            backgroundColor: '#2c3e50',
            color: '#fff',
            padding: '10px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>
            <h3>Admin Dashboard</h3>
            <ul style={{
                listStyle: 'none',
                display: 'flex',
                gap: '20px',
                margin: 0,
                padding: 0,
            }}>
                <li><Link to="/admin" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link></li>
                <li><Link to="/admin/artists" style={{ color: '#fff', textDecoration: 'none' }}>Manage Artists</Link></li>
                <li><Link to="/admin/add-artist" style={{ color: '#fff', textDecoration: 'none' }}>Add Artist</Link></li>
            </ul>
        </nav>
    );
};

export default AdminNavbar;