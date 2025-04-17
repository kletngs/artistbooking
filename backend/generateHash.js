// const bcrypt = require('bcrypt');

// async function generateHash(password) {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hash = await bcrypt.hash(password, salt);
//         console.log("Generated Hash:", hash);
//         return hash;
//     } catch (err) {
//         console.error("Error generating hash:", err);
//         return null;
//     }
// }

// // Replace 'new_password' with the actual new password you want to set
// generateHash('12345678');