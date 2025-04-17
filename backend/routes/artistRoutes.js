const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');
const authMiddleware = require('../middleware/auth');

// Middleware to ensure only artists can access these routes
const protectArtist = (req, res, next) => {
    if (!req.user || req.user.role !== 'artist') {
        return res.status(403).json({ message: 'Access denied. Only artists can access this route.' });
    }
    next();
};

// Fetch artist's profile
router.get('/me', authMiddleware, protectArtist, async (req, res) => {
    try {
        const artist = await Artist.findById(req.user._id).select('-password'); // Exclude password
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found.' });
        }
        res.status(200).json(artist);
    } catch (err) {
        console.error('Error fetching artist profile:', err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Update artist's availability
router.put('/availability', authMiddleware, protectArtist, async (req, res) => {
    try {
        const { availability } = req.body;
        const updatedArtist = await Artist.findByIdAndUpdate(
            req.user._id,
            { availability },
            { new: true }
        );
        res.status(200).json(updatedArtist);
    } catch (err) {
        console.error('Error updating availability:', err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Fetch artist's bookings
router.get('/bookings', authMiddleware, protectArtist, async (req, res) => {
    try {
        const artist = await Artist.findById(req.user._id).populate('bookings.orderId');
        res.status(200).json(artist.bookings);
    } catch (err) {
        console.error('Error fetching bookings:', err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Fetch artist availability by ID
router.get('/:id/availability', async (req, res) => {
    try {
        const artistId = req.params.id;

        // Find the artist by ID
        const artist = await Artist.findById(artistId, 'availability');
        if (!artist) {
            return res.status(404).json({ error: 'Artist not found' });
        }

        // Return the artist's availability
        res.status(200).json({ availability: artist.availability });
    } catch (err) {
        console.error('Error fetching artist availability:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Check availability and booking conflicts
router.post('/check-availability', async (req, res) => {
    try {
        const { artistId, date, startTime, endTime } = req.body;

        // Find the artist
        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(404).json({ error: 'Artist not found' });
        }

        // Check if the selected date/time is in the artist's availability
        const isAvailable = artist.availability.some(
            (slot) =>
                slot.date.toISOString().split('T')[0] === date &&
                slot.startTime <= startTime &&
                slot.endTime >= endTime
        );

        if (!isAvailable) {
            return res.status(400).json({ error: 'Selected date is not available.' });
        }

        // Check for booking conflicts
        const isBooked = artist.bookings.some(
            (booking) =>
                booking.date.toISOString().split('T')[0] === date &&
                booking.startTime <= startTime &&
                booking.endTime >= endTime
        );

        if (isBooked) {
            return res.status(400).json({ error: 'The selected time slot is already booked.' });
        }

        // If no conflicts, return success
        res.status(200).json({ message: 'The selected date and time are available.' });
    } catch (err) {
        console.error('Error checking availability:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;