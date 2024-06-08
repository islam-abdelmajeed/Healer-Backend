import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { bookAppointment, getPatientAppointments } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/book', authMiddleware('patient'), bookAppointment);
router.get('/appointments', authMiddleware('patient'), getPatientAppointments);

export default router;
