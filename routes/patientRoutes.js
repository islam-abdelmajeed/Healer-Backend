import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { bookAppointment, getPatientAppointments } from '../controllers/bookingController.js';
import { searchAndFilterDoctors } from '../controllers/doctorController.js'; 
import { updatePatientDocument } from '../controllers/patientController.js';


const router = express.Router();

router.post('/book', authMiddleware('patient'), bookAppointment);
router.get('/appointments', authMiddleware(), getPatientAppointments);
router.get('/search/doctors', authMiddleware(), searchAndFilterDoctors);
router.post('/update-document', authMiddleware('patient'), updatePatientDocument);

export default router;
