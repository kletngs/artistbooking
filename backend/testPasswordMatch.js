const bcrypt = require('bcrypt');

// Replace these values with the actual data
const plainTextPassword = 'test1234'; // The password entered by the user
const hashedPasswordFromDatabase = '$2b$10$PazFovnluV3U9SK6HQGR1uHZSXLZALt53Kq90hLjymNkW48fLs4BW'; // The hashed password from the database

bcrypt.compare(plainTextPassword, hashedPasswordFromDatabase, (err, isMatch) => {
    if (err) throw err;
    console.log('Password Match:', isMatch);
});