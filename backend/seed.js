require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log('MongoDB connected');

        // Hash passwords
        const hashedPassword123 = await bcrypt.hash('password123', 10);
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);

        // Insert sample users (only if they don't already exist)
        const usersToSeed = [
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: hashedPassword123,
                role: 'customer',
            },
            {
                name: 'Alice Smith',
                email: 'alice@example.com',
                password: hashedPassword123,
                role: 'artist',
            },
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashedAdminPassword,
                role: 'admin',
            }
        ];

        // Check if each user already exists before inserting
        for (const userData of usersToSeed) {
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                const newUser = new User(userData);
                await newUser.save();
                console.log(`User seeded: ${userData.email}`);
            } else {
                console.log(`User already exists: ${userData.email}`);
            }
        }
    })
    .catch(err => console.error(err))
    .finally(() => mongoose.connection.close());