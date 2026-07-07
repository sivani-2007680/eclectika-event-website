const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// REGISTER FOR AN EVENT
router.post('/register', async (req, res) => {
    const { userId, eventName } = req.body;
    try {
        const ticketId = `EC-${eventName.replace(/\s+/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
        const newReg = new Registration({ ticketId, userId, eventName });
        await newReg.save();
        res.json({ success: true, registration: newReg });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error registering for event" });
    }
});

// UNREGISTER FROM AN EVENT
router.post('/unregister', async (req, res) => {
    const { userId, eventName } = req.body;
    try {
        await Registration.findOneAndDelete({ userId, eventName });
        res.json({ success: true, message: "Successfully unregistered" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error unregistering" });
    }
});

// GET LOGGED IN USER'S TICKETS
router.get('/my-registrations/:userId', async (req, res) => {
    try {
        const regs = await Registration.find({ userId: req.params.userId });
        res.json({ success: true, registrations: regs });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching registrations" });
    }
});

module.exports = router;