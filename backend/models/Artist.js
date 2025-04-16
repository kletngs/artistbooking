const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const artistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    category: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    bio: { type: String, default: '' },
    profilePicture: { type: String, default: '' },
    availability: { type: [Date], default: [] },
    bookings: [
        {
            orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
            date: Date,
            location: String,
            totalPrice: Number,
            status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
        },
    ],
});

// Pre-save hook to hash the password
artistSchema.pre('save', async function (next) {
    console.log('Pre-save hook triggered');
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
artistSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Artist', artistSchema);