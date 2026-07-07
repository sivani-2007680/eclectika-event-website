const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    ticketId: { type: String, required: true, unique: true }, // e.g. EC-ALLURE-4829
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Links to the User model
    eventName: { type: String, required: true },
    verified: { type: Boolean, default: false } // Starts as false (turns true when Admin scans the QR)
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);