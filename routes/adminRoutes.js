import express from 'express';
import {getPendingDoctorDocuments , registerAdmin, acceptDoctorDocuments, rejectDoctorDocuments, getAllPatients,  getAllDoctors, blockUser, unblockUser, getPatientsCount, getDoctorsCount, getUnacceptedDocsCount, getReportsCount } from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/register', registerAdmin); 
router.post('/doctors/:doctorId/accept', authMiddleware('admin'), acceptDoctorDocuments);
router.post('/doctors/:doctorId/reject', authMiddleware('admin'), rejectDoctorDocuments);
router.get('/patients', getAllPatients);
router.get('/doctors', getAllDoctors);
router.get('/patients/count', getPatientsCount);
router.get('/doctors/count', getDoctorsCount);
router.get('/doctors/unaccepted/count', getUnacceptedDocsCount);
router.get('/reports/count', getReportsCount);
router.put('/block/:userType/:userId', authMiddleware('admin'), blockUser);
router.put('/unblock/:userType/:userId', authMiddleware('admin'), unblockUser);
router.get('/doctors/pending-documents',  getPendingDoctorDocuments); // New route



export default router;
