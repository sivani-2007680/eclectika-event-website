// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import our modular route files
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to local MongoDB Compass database
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allows payload size for photo uploads

// Mount our routers under `/api` prefixes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// Start listening for client requests
app.listen(PORT, () => {
    console.log(`Server is running smoothly on http://localhost:${PORT}`);
});