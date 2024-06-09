import express from 'express';
import multer from 'multer';
import authMiddleware from '../middleware/authMiddleware.js';
import { uploadDocuments } from '../controllers/documentController.js';

const router = express.Router();

// Multer setup for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

const upload = multer({ storage });

// Route for uploading license and insurance documents
router.post('/upload', authMiddleware('doctor'), upload.fields([{ name: 'license' }, { name: 'insurance' }]), uploadDocuments);

export default router;
