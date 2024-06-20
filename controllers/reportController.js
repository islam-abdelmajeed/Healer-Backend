import Report from '../models/Report.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

export const submitReport = async (req, res) => {
  try {
    const { reporterId, reporterModel, reportedId, reportedModel, reason, details } = req.body;

    if (!reporterId || !reporterModel || !reportedId || !reportedModel || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['Patient', 'Doctor'].includes(reporterModel) || !['Patient', 'Doctor'].includes(reportedModel)) {
      return res.status(400).json({ message: 'Invalid reporter or reported model' });
    }

    // Ensure reporter exists
    const reporterExists = await (reporterModel === 'Patient' ? Patient : Doctor).findById(reporterId);
    if (!reporterExists) {
      return res.status(404).json({ message: 'Reporter not found' });
    }

    // Ensure reported exists
    const reportedExists = await (reportedModel === 'Patient' ? Patient : Doctor).findById(reportedId);
    if (!reportedExists) {
      return res.status(404).json({ message: 'Reported not found' });
    }

    const newReport = new Report({
      reporter: reporterId,
      reporterModel,
      reported: reportedId,
      reportedModel,
      reason,
      details,
    });
    await newReport.save();

    res.status(201).json({ message: 'Report submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name email')
      .populate('reported', 'name email');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
