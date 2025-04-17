const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const Artist = require('../models/Artist');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        console.log('Access denied. Admins only.');
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

// Helper function to validate password
const validatePassword = (password) => {
    if (!password || password.length < 3) {
        throw new Error('Password must be at least 3 characters long.');
    }
};

// Get all artists (Admin Only)
router.get('/', async (req, res) => {
    try {
        console.log('Fetching artists...');
        const artists = await Artist.find().select('-password');
        console.log('Artists fetched:', artists);
        res.json(artists);
    } catch (err) {
        console.error('Error fetching artists:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a new artist (Admin Only)
router.post('/', authMiddleware, isAdmin, upload.single('profilePicture'), async (req, res) => {
    try {
        const { name, email, bio, category, pricePerHour, password, availability } = req.body;
        const profilePicture = req.file ? `/uploads/${req.file.filename}` : '';

        console.log('Request Body:', req.body);
        console.log('Uploaded File:', req.file);

        // Validate required fields
        if (!name || !email || !category || !password || !pricePerHour) {
            return res.status(400).json({ message: 'Name, email, category, pricePerHour, and password are required.' });
        }

        validatePassword(password);

        const existingArtist = await Artist.findOne({ email: email.toLowerCase() });
        if (existingArtist) {
            return res.status(400).json({ message: 'An artist with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed Password (Artist Creation):", hashedPassword);

        const newArtist = new Artist({
            name,
            email: email.toLowerCase(),
            bio,
            category,
            profilePicture,
            pricePerHour,
            password: hashedPassword,
            availability: availability || [], // Default to empty array if not provided
        });

        await newArtist.save();
        console.log('Artist added:', newArtist);
        res.status(201).json({ message: 'Artist added successfully', artist: newArtist });
    } catch (err) {
        console.error('Error adding artist:', err.message);
        res.status(500).json({ message: 'Failed to add artist' });
    }
});

// Update an artist (Admin Only)
router.put('/:id', authMiddleware, isAdmin, upload.single('profilePicture'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, bio, category, pricePerHour, password, availability } = req.body;

        console.log('Request Body:', req.body);
        console.log('Uploaded File:', req.file);

        // Find the artist by ID
        const artist = await Artist.findById(id);
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        const updateData = {
            name,
            email: email.toLowerCase(),
            bio,
            category,
            pricePerHour,
            availability, // Include availability here
        };

        if (req.file) {
            // Delete the old profile picture if it exists
            if (artist.profilePicture) {
                const filePath = path.join(__dirname, '..', 'public', 'uploads', artist.profilePicture.split('/').pop());
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            updateData.profilePicture = `/uploads/${req.file.filename}`;
        }

        if (password) {
            validatePassword(password);
            const hashedPasswordForUpdate = await bcrypt.hash(password, 10);
            console.log("Hashed Password for Update:", hashedPasswordForUpdate);
            updateData.password = hashedPasswordForUpdate;
        }

        const updatedArtist = await Artist.findByIdAndUpdate(id, updateData, { new: true });

        console.log('Artist updated:', updatedArtist);
        res.json({ message: 'Artist updated successfully', artist: updatedArtist });
    } catch (err) {
        console.error('Error updating artist:', err.message);
        res.status(400).json({ message: err.message || 'Failed to update artist' });
    }
});

// Delete an artist (Admin Only)
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        console.log('Deleting artist with ID:', id);
        const artist = await Artist.findByIdAndDelete(id);
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        console.log('Artist deleted:', artist);
        res.json({ message: 'Artist deleted successfully' });
    } catch (err) {
        console.error('Delete error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;