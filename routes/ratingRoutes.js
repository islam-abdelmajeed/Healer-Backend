import express from 'express';
import { submitRating, getRatings } from '../controllers/ratingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/submit', authMiddleware(), submitRating);
router.get('/:rateeModel/:rateeId', authMiddleware(), getRatings);

export default router;
