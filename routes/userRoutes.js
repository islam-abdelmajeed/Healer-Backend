import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { updatePatientInfo, updateDoctorInfo } from '../controllers/userController.js';

const router = express.Router();

router.put('/patient', authMiddleware('patient'), updatePatientInfo);

router.put('/doctor', authMiddleware('doctor'), updateDoctorInfo);

export default router;
