import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext'; // Import ThemeContext
import './Navbar.css'; // Import the external CSS file

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { darkMode, toggleDarkMode } = useContext(ThemeContext); // Access dark mode state
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the menu

    // Handle logout
    const handleLogout = () => {
        logout(); // Clear user data from context
        navigate('/login'); // Redirect to login page
    };

    return (
        <nav className={`navbar ${darkMode ? 'dark-mode' : ''}`}>
            {/* Logo on the Left */}
            <div className="navbar-logo">
                <NavLink to="/">
                    <img src="/logo.png" alt="Артист Буудал" />
                </NavLink>
            </div>

            {/* Hamburger Menu Icon for Smaller Screens */}
            <div className="hamburger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                ☰ {/* Unicode hamburger icon */}
            </div>

            {/* Navigation Links */}
            <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                {/* Public Links */}
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? 'active-link' : '')}
                        onClick={() => setIsMenuOpen(false)} // Close menu on link click
                    >
                        Эхлэл
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/about"
                        className={({ isActive }) => (isActive ? 'active-link' : '')}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Бидний тухай
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/artists"
                        className={({ isActive }) => (isActive ? 'active-link' : '')}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Уран бүтээлчид
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/place-order"
                        className={({ isActive }) => (isActive ? 'active-link' : '')}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Захиалга өгөх
                    </NavLink>
                </li>
                {user && (
    <li>
        <NavLink
            to="/user/orders"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
            onClick={() => setIsMenuOpen(false)}
        >
            Миний захиалгууд
        </NavLink>
    </li>
)}
                <li>
                    <NavLink
                        to="/contact"
                        className={({ isActive }) => (isActive ? 'active-link' : '')}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Холбоо барих
                    </NavLink>
                </li>

                {/* Artist Login Link */}
                {!user && (
                    <li>
                        <NavLink
                            to="/artist/login"
                            className={({ isActive }) => (isActive ? 'active-link' : '')}
                            onClick={() => setIsMenuOpen(false)} // Close menu on link click
                        >
                            Артист нэвтрэх
                        </NavLink>
                    </li>
                )}

                {/* Conditional Rendering for Login/Logout */}
                {user ? (
                    <>
                        {/* Admin-Specific Link */}
                        {user.isAdmin && (
                            <li>
                                <NavLink
                                    to="/admin"
                                    className={({ isActive }) => (isActive ? 'active-link' : '')}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Админ панель
                                </NavLink>
                            </li>
                        )}

                        {/* User Info and Logout Button */}
                        <li className="auth-link">
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            >
                                <span className="user-name">Сайн уу, {user?.name || 'Хэрэглэгч'}</span>
                                <button onClick={handleLogout} className="logout-button">
                                    Гарах
                                </button>
                            </div>
                        </li>
                    </>
                ) : (
                    <li className="auth-link">
                        <NavLink
                            to="/login"
                            className={({ isActive }) => (isActive ? 'active-link' : '')}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Нэвтрэх
                        </NavLink>
                    </li>
                )}
            </ul>

            {/* Dark Mode Toggle Button */}
            <div className="dark-mode-container">
                <button
                    className="dark-mode-toggle"
                    onClick={toggleDarkMode}
                    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {darkMode ? '☀️' : '🌙'} {/* Sun/Moon icons for light/dark mode */}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;