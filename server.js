import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());

// Or to allow only specific origin
app.use(cors({ origin: 'http://localhost:3000' }));
app.options('*', cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/appointments', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/rating', ratingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));