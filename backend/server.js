import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { v2 as cloudinary } from 'cloudinary';
import { app, server } from './socket/socket.js';
import path, { dirname } from 'path';

dotenv.config(); // to read .env file

connectDB();

const PORT = process.env.PORT || 6000; // backup the port with 6000 if PORT is not specified in the config

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(express.json({ limit: '50mb' })); // parse json data in req.body
app.use(express.urlencoded({ extended: true })); // parse form data in req.body
app.use(cookieParser()); // to access cookie

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);

// console.log(path.join(__dirname, '/frontend/dist'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    // react app
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
    });
}
server.listen(PORT, () => console.log(`server started at http://localhost:${PORT} heyy`));
