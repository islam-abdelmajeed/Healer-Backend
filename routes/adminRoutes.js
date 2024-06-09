import express from 'express';
import { acceptDoctorDocuments, rejectDoctorDocuments } from '../controllers/adminController.js';

const router = express.Router();

router.post('/doctors/:doctorId/accept', acceptDoctorDocuments);

router.post('/doctors/:doctorId/reject', rejectDoctorDocuments);

export default router;
