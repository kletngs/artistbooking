const express = require('express');
const router = express.Router();
const Artist = require('../../models/Artist'); // Import your Artist model
const { isAdmin } = require('../../middleware/auth'); // Middleware to check admin role

// @route   GET /api/admin/artists
// @desc    Get all artists (Admin only)
// @access  Private (Admin)
router.get('/', isAdmin, async (req, res) => {
    try {
        const artists = await Artist.find().select('-__v');
        res.status(200).json(artists);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/admin/artists
// @desc    Create a new artist (Admin only)
// @access  Private (Admin)
router.post('/', isAdmin, async (req, res) => {
    try {
        const { name, email, bio, profilePicture, category } = req.body;

        // Validate input
        if (!name || !email || !category) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const newArtist = new Artist({
            name,
            email,
            bio,
            profilePicture,
            category,
        });

        await newArtist.save();
        res.status(201).json(newArtist);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/admin/artists/:id
// @desc    Update an artist by ID (Admin only)
// @access  Private (Admin)
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const { name, email, bio, profilePicture, category } = req.body;

        const updatedArtist = await Artist.findByIdAndUpdate(
            req.params.id,
            { name, email, bio, profilePicture, category },
            { new: true, runValidators: true }
        );

        if (!updatedArtist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        res.status(200).json(updatedArtist);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/admin/artists/:id
// @desc    Delete an artist by ID (Admin only)
// @access  Private (Admin)
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const deletedArtist = await Artist.findByIdAndDelete(req.params.id);

        if (!deletedArtist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        res.status(200).json({ message: 'Artist deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;