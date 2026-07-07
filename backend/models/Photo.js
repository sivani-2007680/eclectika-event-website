const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true }, // Base64 or link to the image
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Photo', photoSchema);