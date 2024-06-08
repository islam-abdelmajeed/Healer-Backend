import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getDoctorAppointments } from '../controllers/bookingController.js';

const router = express.Router();

router.get('/appointments', authMiddleware('doctor'), getDoctorAppointments);

export default router;
