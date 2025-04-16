const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const Admin = require('../models/Admin');
const Artist = require('../models/Artist');


// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists in the User model
        const user = await User.findOne({ email });
        const admin = await Admin.findOne({ email });

        if (!user && !admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Determine if the login is for a user or admin
        const account = user || admin;

        // Compare passwords
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign(
            { id: account._id, isAdmin: !!admin }, // Include isAdmin flag based on the model
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        console.log('Login successful for:', account.email); // Log the email
        console.log('Generated Token:', token); // Log the token

        res.json({
            token,
            user: {
                _id: account._id,
                email: account.email,
                name: account.name || 'Unknown',
                isAdmin: !!admin, // True if admin, false if user
            },
        });
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        console.log('User created successfully:', email);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        if (err.code === 11000) {
            // Duplicate key error (e.g., duplicate email)
            console.error('Duplicate email:', err.keyValue.email);
            return res.status(400).json({ message: 'Email already in use' });
        }

        console.error('Error during registration:', err.message);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});
// Artist Login Route
router.post('/artist/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Incoming Request Body:', { email, password });

        // Find the artist by email
        const artist = await Artist.findOne({ email });
        if (!artist) {
            console.error(`Artist not found for email: ${email}`);
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        console.log('Found Artist:', artist);

        // Compare the plain-text password with the hashed password
        const isMatch = await bcrypt.compare(password, artist.password);
        if (!isMatch) {
            console.error('Password mismatch for email:', email);
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: artist._id, role: 'artist' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        console.log(`Artist login successful for: ${artist.email}`);
        console.log(`Generated Token: ${token}`);

        // Return the token and artist details
        res.json({
            token,
            artist: {
                _id: artist._id,
                name: artist.name,
                email: artist.email,
                category: artist.category,
                pricePerHour: artist.pricePerHour,
                profilePicture: artist.profilePicture,
            },
        });
    } catch (err) {
        console.error('Error during artist login:', err.message);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});
// Fetch Current User Data
// Fetch Current User Data
// Fetch Current User Data
// Fetch Current User Data
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = req.user;

        // Check if the user exists in the Admin model
        const isAdmin = await Admin.findById(user._id);

        // Return the user data
        res.json({
            _id: user._id,
            name: user.name || 'Unknown', // Ensure the name is returned
            email: user.email,
            isAdmin: !!isAdmin, // True if admin, false if user
        });
    } catch (err) {
        console.error('Error fetching user:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});
// Register Admin Route
router.post('/register-admin', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new admin
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
        });

        await newAdmin.save();
        console.log('Admin created successfully:', email);

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (err) {
        console.error('Error during admin registration:', err.message);
        res.status(500).json({ message: 'Admin registration failed. Please try again.' });
    }
});
// File: backend/routes/auth.js
router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the admin user in the database
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token, user: { email: admin.email } });
    } catch (err) {
        console.error('Error during admin login:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;