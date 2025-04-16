import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { logout } = useAuth(); // Get the logout function from AuthContext
    const navigate = useNavigate(); // Use navigate for redirection

    // Handle logout
    const handleLogout = () => {
        logout(); // Call the logout function to clear session
        navigate('/login'); // Redirect to the login page
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <aside style={styles.sidebar}>
                <h2 style={styles.sidebarTitle}>Admin Panel</h2>
                <nav>
                    <ul style={styles.navList}>
                        <li style={styles.navItem}>
                            <Link
                                to="/admin/artists"
                                style={styles.navLink}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = '#555')}
                                onMouseLeave={(e) => (e.target.style.backgroundColor = '#444')}
                            >
                                Manage Artists
                            </Link>
                        </li>
                        <li style={styles.navItem}>
                            <Link
                                to="/admin/add-artist"
                                style={styles.navLink}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = '#555')}
                                onMouseLeave={(e) => (e.target.style.backgroundColor = '#444')}
                            >
                                Add Artist
                            </Link>
                        </li>
                        <li style={styles.navItem}>
                            <Link
                                to="/admin/orders"
                                style={styles.navLink}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = '#555')}
                                onMouseLeave={(e) => (e.target.style.backgroundColor = '#444')}
                            >
                                Manage Orders
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main style={styles.mainContent}>
                <header style={styles.header}>
                    <h1 style={styles.headerTitle}>Welcome, Admin!</h1>
                    <button
                        style={styles.logoutButton}
                        onClick={handleLogout} // Add the logout handler here
                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#c0392b')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#e74c3c')}
                    >
                        Logout
                    </button>
                </header>
                <div style={styles.content}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

// Inline Styles for AdminLayout
const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-color)', // Use CSS variable for background
        fontFamily: 'Arial, sans-serif',
        // border: '1px solid var(--border-color)', // Use CSS variable for border color
    },
    sidebar: {
        width: '250px',
        backgroundColor: '#333',
        color: '#fff',
        padding: '20px',
        boxSizing: 'border-box',
    },
    sidebarTitle: {
        fontSize: '1.5rem',
        marginBottom: '20px',
        textAlign: 'center',
    },
    navList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    navItem: {
        marginBottom: '10px',
    },
    navLink: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '1rem',
        padding: '10px',
        display: 'block',
        borderRadius: '5px',
        backgroundColor: '#444',
        transition: 'background-color 0.3s',
        cursor: 'pointer',
    },
    mainContent: {
        flex: 1,
        padding: '10px',
        boxSizing: 'border-box',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    headerTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    logoutButton: {
        padding: '10px 20px',
        backgroundColor: '#e74c3c',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    content: {
        backgroundColor: 'var(--input-bg-color)', // Use CSS variable for content background
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
};

export default AdminLayout;