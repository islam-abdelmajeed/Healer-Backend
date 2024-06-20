import express from 'express';
import { submitReport, getReports } from '../controllers/reportController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/submit', authMiddleware(), submitReport);
router.get('/all', authMiddleware(), getReports);

export default router;
