const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
    date: Date,
    startTime: String, // e.g., "10:00"
    endTime: String,   // e.g., "12:00"
    location: String,
    totalPrice: Number,
    status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
});

module.exports = mongoose.model('Order', orderSchema);