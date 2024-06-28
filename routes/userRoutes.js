import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { updatePatientInfo, updateDoctorInfo, updatePassword, requestPasswordReset, resetPassword } from '../controllers/userController.js';

const router = express.Router();

router.put('/patient', authMiddleware('patient'), updatePatientInfo);
router.put('/doctor', authMiddleware('doctor'), updateDoctorInfo);
router.put('/password', authMiddleware(), updatePassword);
router.post('/password/forgot', requestPasswordReset);
router.post('/password/reset/:code', resetPassword);

export default router;
