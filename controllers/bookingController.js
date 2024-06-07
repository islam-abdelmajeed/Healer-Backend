const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

exports.bookAppointment = async (req, res) => {
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

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id }).populate('doctor');
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.manageAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id }).populate('patient');
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
