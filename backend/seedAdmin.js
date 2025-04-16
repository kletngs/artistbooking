require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin'); // Use the Admin model

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if MongoDB fails to connect
});

// Function to seed the admin
const seedAdmin = async () => {
    try {
        // Check if an admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('Admin already exists:', existingAdmin.email);
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Create the admin
        const newAdmin = new Admin({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
        });
        

        await newAdmin.save();
        console.log('Admin created successfully:', newAdmin.email);
    } catch (err) {
        console.error('Error seeding admin:', err.message);
    } finally {
        mongoose.disconnect(); // Disconnect from the database
    }
};

seedAdmin();