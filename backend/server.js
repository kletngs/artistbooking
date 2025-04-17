require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize Express App
const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Allow dynamic client URL via .env
})); // Enable CORS
app.use(express.json()); // Parse JSON requests

// Environment Variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MongoDB URI is not defined in the environment variables.');
    process.exit(1); // Exit if MongoDB URI is missing
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit the process if MongoDB fails to connect
    });

// Import Routes
const usersRouter = require('./routes/users');
const artistsRouter = require('./routes/artists'); // Corrected import path
const bookingsRouter = require('./routes/bookings');
const categoriesRouter = require('./routes/categories');
const authRouter = require('./routes/auth');
const orderRoutes = require('./routes/orderRoutes');
const artistRoutes = require('./routes/artistRoutes');

// Use Routes
app.use('/api/users', usersRouter);
app.use('/api/artists', artistsRouter); // Corrected route path
app.use('/api/bookings', bookingsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', orderRoutes);
app.use('/api/artist', artistRoutes);

// Serve Static Files (e.g., uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the Artist Booking API!');
});

// Handle Undefined Routes (404)
app.use((req, res) => {
    console.error(`Route not found: ${req.originalUrl}`);
    res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err.message);
    res.status(500).json({ message: 'Something went wrong on the server.' });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
