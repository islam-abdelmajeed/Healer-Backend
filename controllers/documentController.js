import Doctor from '../models/Doctor.js';
import cloudinary from '../utils/cloudinary.js';

export const uploadDocuments = async (req, res) => {
  try {
    const { id } = req.user; // Assuming user ID is set in req.user by authMiddleware
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Save file paths to the doctor's document fields
    if (req.files.license) {
      doctor.licenseDocument = req.files.license[0].path;
    }
    if (req.files.insurance) {
      doctor.insuranceDocument = req.files.insurance[0].path;
    }

    doctor.isDocumentsUploaded = !!(doctor.licenseDocument && doctor.insuranceDocument);
    await doctor.save();

    res.status(200).json({ message: 'Documents uploaded successfully', doctor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const uploadDocumentsV2 = async (req, res) => {
  try {
    const { id } = req.user; // Assuming user ID is set in req.user by authMiddleware
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Save file paths to the doctor's document fields
    if (req.files.license) {
      const { secure_url } = await cloudinary.uploader.upload(
        req.files.license[0].path,);    
        doctor.licenseDocument = secure_url;
      }
    if (req.files.insurance) {
      const { secure_url } = await cloudinary.uploader.upload(
        req.files.insurance[0].path,);   
      doctor.insuranceDocument = secure_url


    }

    doctor.isDocumentsUploaded = !!(doctor.licenseDocument && doctor.insuranceDocument);
    await doctor.save();

    res.status(200).json({ message: 'Documents uploaded successfully', doctor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
