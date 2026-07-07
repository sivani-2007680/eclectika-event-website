const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GOOGLE AUTHENTICATION LOGIN
router.post('/google', async (req, res) => {
    const { token } = req.body;
    try {
        const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!googleResponse.ok) {
            throw new Error("Failed to fetch user info from Google");
        }

        const payload = await googleResponse.json();
        const { sub: googleId, name, email, picture: profilePic } = payload;
        
        let user = await User.findOne({ googleId });
        if (!user) {
            user = new User({ googleId, name, email, profilePic });
            await user.save();
        }

        res.json({ success: true, user });
    } catch (err) {
        console.error(err);
        res.status(401).json({ success: false, message: "Invalid Google token" });
    }
});

// SAVE PHONE NUMBER ON FIRST SIGN-IN
router.put('/update-phone', async (req, res) => {
    const { userId, phone } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, { phone }, { new: true });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating phone number" });
    }
});

module.exports = router;