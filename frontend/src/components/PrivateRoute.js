import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, isAdminOnly = false }) => {
    const { token, user } = useAuth();

    // Redirect to login if no token is found
    if (!token) {
        console.log('No token found. Redirecting to login.');
        return <Navigate to="/login" />;
    }

    // Check admin role if required
    if (isAdminOnly && (!user || !user.isAdmin)) {
        console.log('User is not an admin. Redirecting to home.');
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;