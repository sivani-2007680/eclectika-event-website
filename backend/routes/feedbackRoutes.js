const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// Helper function to strip any HTML tags to prevent XSS (Cross-Site Scripting) script injections
const sanitizeInput = (text) => {
    if (typeof text !== 'string') return '';
    return text.replace(/<\/?[^>]+(>|$)/g, "").trim();
};

// SUBMIT FEST FEEDBACK
router.post('/submit', async (req, res) => {
    const { userId, userName, rating, message } = req.body;
    try {
        // Sanitize the user-submitted review message before saving it to MongoDB
        const cleanMessage = sanitizeInput(message);

        const newFeedback = new Feedback({ 
            userId, 
            userName, 
            rating, 
            message: cleanMessage 
        });
        
        await newFeedback.save();
        res.json({ success: true, message: "Feedback submitted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error submitting feedback" });
    }
});

module.exports = router;