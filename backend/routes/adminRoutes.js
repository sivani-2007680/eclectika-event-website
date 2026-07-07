const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Registration = require('../models/Registration');
const Photo = require('../models/Photo');
const Feedback = require('../models/Feedback');

// MIDDLEWARE: Verify the secret admin API key sent from the browser
const verifyAdminKey = (req, res, next) => {
    const key = req.headers['x-admin-key'];
    if (key === process.env.ADMIN_SECRET_KEY) {
        next();
    } else {
        res.status(403).json({ success: false, message: "Access Denied: Invalid Admin Key" });
    }
};

// 1. GET ALL SIGNED-IN USERS (Protected)
router.get('/users', verifyAdminKey, async (req, res) => {
    const query = req.query.search || "";
    try {
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { phone: { $regex: query } }
            ]
        });
        
        const list = await Promise.all(users.map(async (user) => {
            const userRegs = await Registration.find({ userId: user._id });
            return { user, registrations: userRegs };
        }));

        res.json({ success: true, list });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching admin data" });
    }
});

// 2. SCAN QR TICKET & ADMIT ATTENDEE (Protected)
router.post('/verify-ticket', verifyAdminKey, async (req, res) => {
    const { ticketId } = req.body;
    try {
        const reg = await Registration.findOne({ ticketId }).populate('userId');
        if (!reg) {
            return res.json({ status: "invalid", message: "No registration record found." });
        }
        if (reg.verified) {
            return res.json({ status: "already", message: `${reg.userId.name} is already admitted.`, attendee: reg.userId });
        }
        
        reg.verified = true;
        await reg.save();

        res.json({ status: "success", message: `Access granted for ${reg.userId.name}!`, attendee: reg.userId });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Server error during verification" });
    }
});

// 3. ADMIN VIEW PENDING GALLERY PHOTOS (Protected)
router.get('/pending-photos', verifyAdminKey, async (req, res) => {
    try {
        const pending = await Photo.find({ status: 'pending' });
        res.json({ success: true, pending });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error loading pending queue" });
    }
});

// 4. APPROVE OR REJECT PENDING PHOTO (Protected)
router.post('/moderate-photo', verifyAdminKey, async (req, res) => {
    const { photoId, action } = req.body; // action: 'approved' or 'rejected'
    try {
        if (action === 'approved') {
            await Photo.findByIdAndUpdate(photoId, { status: 'approved' });
        } else {
            await Photo.findByIdAndDelete(photoId);
        }
        res.json({ success: true, message: `Photo ${action} successfully.` });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error moderating photo" });
    }
});

// 5. GET ALL USER FEEDBACKS FOR THE ADMIN LIST (Protected)
router.get('/feedbacks', verifyAdminKey, async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json({ success: true, feedbacks });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error loading feedbacks" });
    }
});

module.exports = router;