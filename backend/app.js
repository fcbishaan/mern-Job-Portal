import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import userRouter from './routes/userRouter.js';
import applicationRouter from './routes/applicationRouter.js';
import jobRouter from './routes/jobRouter.js';
import { dbConnection } from './database/dbConnection.js';
import { errorMiddleware } from './middlewares/error.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import mongoose from 'mongoose';
import { User } from './models/userSchema.js'; // Import User model

const app = express();
dotenv.config({ path: './config/config.env' });

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
 })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
 })
);

app.use('/api/v1/user', userRouter);
app.use('/api/v1/application', applicationRouter);
app.use('/api/v1/job', jobRouter);
app.use('/api/v1/feedback', feedbackRoutes);

dbConnection();

// Create Admin User Logic
const createAdminUser = async () => {
    try {
        // Check if the admin user already exists
        const existingAdmin = await User.findOne({ email: 'admin@mail.com' });
        if (existingAdmin) {
            console.log('Admin user already exists.');
            return;
        }

        // Create the admin user
        const adminUser = new User({
            name: 'Admin',
            email: 'admin@mail.com',
            phone: 1234567890,
            password: 'admin123', // This will be hashed automatically by the pre-save hook in the schema
            role: 'Admin',
        });

        await adminUser.save();
        console.log('Admin user created successfully.');
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

// Call createAdminUser on server start
createAdminUser();

app.use(errorMiddleware);
export default app;
