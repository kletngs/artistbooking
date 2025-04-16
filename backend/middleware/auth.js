const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Middleware to protect routes
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        console.log('Decoded token:', decoded);

        // Check if the user exists in the User or Admin model
        const user = await User.findById(decoded.id);
        const admin = await Admin.findById(decoded.id);

        if (!user && !admin) {
            console.log('User not found for ID:', decoded.id);
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach the user or admin to the request object
        req.user = user || admin;
        req.user.isAdmin = !!admin; // Set isAdmin flag based on the model

        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;