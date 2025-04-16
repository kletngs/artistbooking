const Order = require('../models/Order');
const Artist = require('../models/Artist');

exports.createOrder = async (req, res) => {
    try {
        const { artistId, date, location, totalPrice } = req.body;

        // Log incoming request data
        console.log('Incoming Request Data:', { artistId, date, location, totalPrice });

        // Check if artist exists
        const artist = await Artist.findById(artistId);
        if (!artist) {
            console.log(`Artist with ID ${artistId} not found`);
            return res.status(404).json({ error: 'Artist not found' });
        }

        // Log artist's availability for debugging
        console.log('Artist Availability:', artist.availability);

        // Check artist availability
        if (!artist.availability.includes(date)) {
            console.log(`Requested date ${date} not found in artist's availability`);
            return res.status(400).json({ error: 'Artist is not available on the requested date' });
        }

        // Create the order
        const order = new Order({
            userId: req.user._id, // Logged-in user's ID
            artistId,
            date,
            location,
            totalPrice,
        });

        // Save the order to the database
        await order.save();
        console.log('Order saved successfully:', order);

        // Add booking to artist's bookings
        artist.bookings.push({
            orderId: order._id,
            date,
            location,
            totalPrice,
        });

        // Remove the booked date from availability
        artist.availability = artist.availability.filter((availableDate) => availableDate !== date);
        await artist.save();
        console.log('Artist updated successfully:', artist);

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (err) {
        console.error('Error creating order:', err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).populate('artistId', 'name');
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email') // Populate user details
            .populate('artistId', 'name') // Populate artist details
            .exec();

        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching all orders:', err.message);
        res.status(500).json({ error: err.message });
    }
};