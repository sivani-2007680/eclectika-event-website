const mongoose = require('mongoose');

// This defines the "User" blueprint in our database
const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true }, // Unique Google ID
    name: { type: String, required: true },                  // User's name
    email: { type: String, required: true, unique: true },    // User's Gmail
    phone: { type: String, default: "" },                     // Mobile number (we collect this on first login)
    profilePic: { type: String }                              // Google profile photo URL
}, { timestamps: true }); // Automatically logs when the user was created

module.exports = mongoose.model('User', userSchema);