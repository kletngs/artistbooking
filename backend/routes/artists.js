const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');
const authMiddleware = require('../middleware/auth'); // Ensure this path is correct
const upload = require('../middleware/upload'); // Ensure this path is correct

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        console.log('Access denied. Admins only.');
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

// Get All Artists
router.get('/', async (req, res) => {
    try {
        const artists = await Artist.find();
        console.log('Artists fetched:', artists); // Log the fetched artists
        res.json(artists);
    } catch (err) {
        console.error('Error fetching artists:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a New Artist (Admin Only)
router.post('/', authMiddleware, isAdmin, upload.single('profilePicture'), async (req, res) => {
    try {
        const { name, email, bio, category } = req.body;
        const profilePicture = req.file ? `/uploads/${req.file.filename}` : ''; // Get the uploaded file path

        console.log('Request Body:', req.body); // Log the request body
        console.log('Uploaded File:', req.file); // Log the uploaded file

        // Validate required fields
        if (!name || !email || !category) {
            return res.status(400).json({ message: 'Name, email, and category are required.' });
        }

        const newArtist = new Artist({
            name,
            email,
            bio,
            category,
            profilePicture,
        });

        await newArtist.save();
        console.log('Artist added:', newArtist); // Log the added artist
        res.status(201).json(newArtist);
    } catch (err) {
        console.error('Error adding artist:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete an Artist (Admin Only)
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const artistId = req.params.id;

        console.log('Deleting artist with ID:', artistId); // Log the artist ID

        // Find and delete the artist
        const artist = await Artist.findByIdAndDelete(artistId);
        if (!artist) {
            console.log('Artist not found:', artistId);
            return res.status(404).json({ message: 'Artist not found' });
        }

        console.log('Artist deleted:', artist); // Log the deleted artist
        res.json({ message: 'Artist deleted successfully' });
    } catch (err) {
        console.error('Delete error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;