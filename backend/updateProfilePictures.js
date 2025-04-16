const mongoose = require('mongoose');
const Artist = require('./models/Artist');

(async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Fetch all artists
        const artists = await Artist.find();

        // Update profilePicture paths
        for (const artist of artists) {
            if (artist.profilePicture && !artist.profilePicture.startsWith('/uploads/')) {
                artist.profilePicture = `/uploads/${artist.profilePicture}`;
                await artist.save(); // Save the updated artist
            }
        }

        console.log('Updated profilePicture paths successfully.');
        mongoose.disconnect();
    } catch (err) {
        console.error('Error updating profilePicture paths:', err.message);
    }
})();