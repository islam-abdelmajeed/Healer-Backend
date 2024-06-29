import express from 'express';
import multer from 'multer';
import authMiddleware from '../middleware/authMiddleware.js';
import { uploadDocuments, uploadDocumentsV2 } from '../controllers/documentController.js';
import { fileUpload, fileValidation } from '../utils/multerCloud.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/upload', authMiddleware('doctor'), upload.fields([{ name: 'license' }, { name: 'insurance' }]), uploadDocuments);
router.post('/uploadv2', authMiddleware('doctor'),fileUpload([...fileValidation.image]).fields([{ name: 'license' }, { name: 'insurance' }]) , uploadDocumentsV2);

export default router;
