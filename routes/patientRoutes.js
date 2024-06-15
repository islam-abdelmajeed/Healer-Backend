import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { bookAppointment, getPatientAppointments } from '../controllers/bookingController.js';
import { searchDoctorsForPatient } from '../controllers/doctorController.js'; // Import the search controller for patients


const router = express.Router();

router.post('/book', authMiddleware('patient'), bookAppointment);
router.get('/appointments', authMiddleware('patient'), getPatientAppointments);
router.get('/search/doctors', authMiddleware('patient'), searchDoctorsForPatient);

export default router;
