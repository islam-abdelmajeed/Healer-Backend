import Patient from '../models/Patient.js';
import multer from 'multer';
import path from 'path';

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter for photos
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
  fileFilter,
}).array('photos', 5); // Up to 5 photos

export const updatePatientDocument = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { idNumber } = req.body;
      const patientId = req.user.id; // Assuming user ID is set in req.user by authMiddleware

      if (!idNumber) {
        return res.status(400).json({ message: 'ID number is required' });
      }

      const patient = await Patient.findById(patientId);

      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      const photoPaths = req.files.map(file => file.path);

      patient.idNumber = idNumber;
      patient.photos = photoPaths;
      await patient.save();

      res.status(200).json({ message: 'Patient document updated successfully', patient });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};
