const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');

// UPLOAD A GALLERY PHOTO (PENDING REVIEW)
router.post('/contribute', async (req, res) => {
    const { imageUrl, userId, userName } = req.body;
    try {
        const newPhoto = new Photo({ imageUrl, userId, userName });
        await newPhoto.save();
        res.json({ success: true, message: "Photo submitted for admin approval!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error uploading photo" });
    }
});

// GET APPROVED LIVE GALLERY IMAGES
router.get('/live', async (req, res) => {
    try {
        const photos = await Photo.find({ status: 'approved' });
        res.json({ success: true, photos });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error loading gallery" });
    }
});

module.exports = router;