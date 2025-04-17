const { format } = require('date-fns');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Artist = require('../models/Artist');

// Normalize date to 'YYYY-MM-DD' format
const normalizeDate = (d) => format(new Date(d), 'yyyy-MM-dd'); 

// Create a new order
exports.createOrder = async (req, res) => {
    const { artistId, date, startTime, endTime, location, totalPrice } = req.body;

    // Validate missing fields
    if (!artistId || !date || !startTime || !endTime || !location || !totalPrice) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Incoming Request Data:', { artistId, date, startTime, endTime, location, totalPrice });

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        const artist = await Artist.findById(artistId).session(session);
        if (!artist) {
            console.log(`Artist with ID ${artistId} not found`);
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: 'Artist not found' });
        }

        console.log('Artist Availability:', artist.availability);

        // Check if the artist has the requested time slot in availability
        const isAvailable = artist.availability.some(
            (slot) =>
                normalizeDate(slot.date) === normalizeDate(date) && // Compare only date part
                slot.startTime === startTime &&
                slot.endTime === endTime
        );

        if (!isAvailable) {
            console.log(`Requested time slot (${date}, ${startTime}-${endTime}) not found in artist's availability`);
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: 'Selected time slot is not available' });
        }

        // Check if the requested time slot is already booked
        const isBooked = artist.bookings.some(
            (booking) =>
                normalizeDate(booking.date) === normalizeDate(date) &&
                booking.startTime === startTime &&
                booking.endTime === endTime
        );

        if (isBooked) {
            console.log(`Time slot (${date}, ${startTime}-${endTime}) is already booked`);
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: 'The selected time slot is already booked' });
        }

        // Create the order
        const order = new Order({
            userId: req.user._id, // Logged-in user's ID
            artistId,
            date,
            startTime,
            endTime,
            location,
            totalPrice,
        });

        // Save the order to the database
        await order.save({ session });
        console.log('Order saved successfully:', order);

        // Add the booking to the artist's bookings
        artist.bookings.push({
            orderId: order._id,
            date,
            startTime,
            endTime,
            location,
            totalPrice,
            status: 'Pending',
        });

        // Remove the booked time slot from availability
        artist.availability = artist.availability.filter(
            (slot) =>
                !(
                    normalizeDate(slot.date) === normalizeDate(date) &&
                    slot.startTime === startTime &&
                    slot.endTime === endTime
                )
        );

        // Save the updated artist document
        await artist.save({ session });
        console.log('Artist updated successfully:', artist);

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Respond with success
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (err) {
        console.error('Error creating order:', err.message);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: err.message });
    }
};

// Get user-specific orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate('artistId', 'name') // Include artist name
            .exec();

        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching user orders:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Get all orders (Admin Only)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email') // Include user details
            .populate('artistId', 'name') // Include artist details
            .exec();

        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching all orders:', err.message);
        res.status(500).json({ error: err.message });
    }
};
//sex