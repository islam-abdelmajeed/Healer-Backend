import Doctor from '../models/Doctor.js';

export const acceptDoctorDocuments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.isDocumentsAccepted = true;
    await doctor.save();
    res.status(200).json({ message: 'Doctor documents accepted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const rejectDoctorDocuments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.isDocumentsAccepted = false;
    await doctor.save();
    res.status(200).json({ message: 'Doctor documents rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
