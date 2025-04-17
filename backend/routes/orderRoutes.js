const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders } = require('../controllers/orderController'); // Import controller functions
const authMiddleware = require('../middleware/auth'); // Import auth middleware

// Middleware alias for protecting routes
const protect = authMiddleware;

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        console.log('Access denied. Admins only.');
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

// Create an order (protected route)
router.post('/', protect, createOrder);

// Get logged-in user's orders (protected route)
router.get('/user', protect, getUserOrders);

// Get all orders (Admin Only)
router.get('/admin/all', protect, isAdmin, getAllOrders);

module.exports = router;
