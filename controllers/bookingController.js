import Appointment from '../models/Appointment.js';

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const appointment = new Appointment({
      patient: req.user.id,
      doctor: doctorId,
      date,
      time,
      status: 'Pending',
    });
    await appointment.save();
    res.status(201).json({ appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id }).populate('doctor');
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id }).populate('patient');
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Appointment canceled', appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
