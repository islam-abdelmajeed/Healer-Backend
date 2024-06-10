import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { updatePatientInfo, updateDoctorInfo, updatePassword } from '../controllers/userController.js';

const router = express.Router();

// Route to update patient information
router.put('/patient', authMiddleware('patient'), updatePatientInfo);

// Route to update doctor information
router.put('/doctor', authMiddleware('doctor'), updateDoctorInfo);

// Route to update user password
router.put('/password', authMiddleware(), updatePassword);

export default router;
