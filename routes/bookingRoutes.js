import express from 'express';
import { bookAppointment, updateAppointmentStatus, getAppointmentById } from '../controllers/bookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to book an appointment
router.post('/book', authMiddleware('patient'), bookAppointment);

// Route to update appointment status
router.put('/status/:id', authMiddleware(), updateAppointmentStatus);

// Route to get appointment by ID
router.get('/:id', authMiddleware(), getAppointmentById);

export default router;
