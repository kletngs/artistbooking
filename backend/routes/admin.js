const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const fs = require('fs'); // Import fs module for file operations
const path = require('path'); // Import path module for file paths
const Artist = require('../models/Artist');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload'); // Middleware for file uploads

// Middleware to ensure only admins can access these routes
router.use(authMiddleware);

// Helper function to validate password
const validatePassword = (password) => {
    if (!password || password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
    }
};

// Get all artists
router.get('/artists', async (req, res) => {
    try {
        console.log('Fetching artists...');
        const artists = await Artist.find().select('-password'); // Exclude passwords from response
        console.log('Artists fetched:', artists);
        res.json(artists);
    } catch (err) {
        console.error('Error fetching artists:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a new artist with profile picture upload and password hashing
router.post('/artists', upload.single('profilePicture'), async (req, res) => {
    try {
        const { name, email, bio, category, pricePerHour, password } = req.body;
        const profilePicture = req.file ? `/uploads/${req.file.filename}` : '';

        // Validate password (ensure it meets minimum length requirements)
        if (!password || password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }

        // Check if the artist already exists
        const existingArtist = await Artist.findOne({ email });
        if (existingArtist) {
            return res.status(400).json({ message: 'An artist with this email already exists.' });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new artist
        const newArtist = new Artist({
            name,
            email:email.toLowerCase(),
            bio,
            category,
            profilePicture,
            pricePerHour,
            password: hashedPassword, // Save the hashed password
        });

        // Save the artist to the database
        await newArtist.save();

        console.log(`Artist created successfully: ${email}`);
        res.status(201).json({ message: 'Artist added successfully', artist: newArtist });
    } catch (err) {
        console.error('Error adding artist:', err.message);
        res.status(500).json({ message: 'Failed to add artist' });
    }
});

// Update an artist
router.put('/artists/:id', upload.single('profilePicture'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, bio, category, pricePerHour, password } = req.body;

        // Find the artist by ID
        const artist = await Artist.findById(id);
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        // Prepare update data
        const updateData = { name, email, bio, category, pricePerHour };
        if (req.file) {
            // Delete the old profile picture if it exists
            if (artist.profilePicture) {
                const filePath = path.join(__dirname, '..', 'public', 'uploads', artist.profilePicture.split('/').pop());
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); // Delete the old file
                }
            }

            // Add the new profile picture
            updateData.profilePicture = `/uploads/${req.file.filename}`;
        }

        // If a new password is provided, hash it
        if (password) {
            validatePassword(password); // Validate the new password
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Update the artist
        const updatedArtist = await Artist.findByIdAndUpdate(id, updateData, { new: true });

        res.json({ message: 'Artist updated successfully', artist: updatedArtist });
    } catch (err) {
        console.error('Error updating artist:', err.message);
        res.status(400).json({ message: err.message || 'Failed to update artist' });
    }
});

// Delete an artist
router.delete('/artists/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the artist by ID
        const artist = await Artist.findById(id);
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        // Delete the profile picture if it exists
        if (artist.profilePicture) {
            const filePath = path.join(__dirname, '..', 'public', 'uploads', artist.profilePicture.split('/').pop());
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Delete the file
            }
        }

        // Delete the artist from the database
        await Artist.findByIdAndDelete(id);

        res.json({ message: 'Artist deleted successfully' });
    } catch (err) {
        console.error('Error deleting artist:', err.message);
        res.status(500).json({ message: 'Failed to delete artist' });
    }
});

module.exports = router;