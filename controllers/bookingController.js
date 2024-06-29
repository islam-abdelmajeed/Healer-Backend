import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, appointmentType } = req.body;
    const patientId = req.user.id;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (appointmentType === 'Clinic' && !doctor.clinicAvailability) {
      return res.status(400).json({ message: 'Doctor not available for clinic visits' });
    }

    if (appointmentType === 'Home' && !doctor.homeVisitAvailability) {
      return res.status(400).json({ message: 'Doctor not available for home visits' });
    }

    const timeFormatRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
    if (!timeFormatRegex.test(time)) {
      return res.status(400).json({ message: 'Time must be in the format "HH:MM AM/PM"' });
    }

    if (doctor.availableTimes.length > 0 && !doctor.availableTimes.includes(time)) {
      return res.status(400).json({ message: 'Doctor not available at the requested time' });
    }

    const existingAppointment = await Appointment.findOne({ doctor: doctorId, date, time });
    if (existingAppointment) {
      return res.status(400).json({ message: 'Appointment slot already booked' });
    }

    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      date,
      time,
      appointmentType,
      status: 'Pending'
    });

    await appointment.save();
    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    console.log('User ID from token:', userId);
    console.log('User role from token:', req.user.role);

    // Validate the status
    if (!['Pending', 'Done', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find the appointment
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Convert userId to string if it's an ObjectId
    const userIdString = userId.toString();

    // Check if the user is either the patient or the doctor associated with the appointment
    if (appointment.patient.toString() !== userIdString && appointment.doctor.toString() !== userIdString) {
      console.log('Authorization failed: User is not the patient or doctor associated with the appointment.');
      return res.status(403).json({ message: 'You are not authorized to update this appointment' });
    }

    // Update the appointment status
    appointment.status = status;
    await appointment.save();

    console.log('Appointment status updated to:', status);

    res.status(200).json({ message: 'Appointment status updated', appointment });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: error.message });
  }
};


export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id).populate('patient').populate('doctor');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;

    const appointments = await Appointment.find({ patient: patientId })
      .populate('doctor')
      .sort({ date: -1 });

    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const appointments = await Appointment.find({ doctor: doctorId })
      .populate('patient')
      .sort({ date: -1 });

    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
