const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    artist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'canceled'], 
        default: 'pending' 
    }
});

module.exports = mongoose.model('Booking', bookingSchema);