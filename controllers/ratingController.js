import Rating from '../models/Rating.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

export const submitRating = async (req, res) => {
  try {
    const { raterId, raterModel, rateeId, rateeModel, rating, comment } = req.body;

    if (!raterId || !raterModel || !rateeId || !rateeModel || rating === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['Patient', 'Doctor'].includes(raterModel) || !['Patient', 'Doctor'].includes(rateeModel)) {
      return res.status(400).json({ message: 'Invalid rater or ratee model' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Ensure rater exists
    const raterExists = await (raterModel === 'Patient' ? Patient : Doctor).findById(raterId);
    if (!raterExists) {
      return res.status(404).json({ message: 'Rater not found' });
    }

    // Ensure ratee exists
    const rateeExists = await (rateeModel === 'Patient' ? Patient : Doctor).findById(rateeId);
    if (!rateeExists) {
      return res.status(404).json({ message: 'Ratee not found' });
    }

    const newRating = new Rating({
      rater: raterId,
      raterModel,
      ratee: rateeId,
      rateeModel,
      rating,
      comment,
    });
    await newRating.save();

    // Recalculate the average rating for the ratee
    const ratings = await Rating.find({ ratee: rateeId, rateeModel });
    const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
    rateeExists.rate = averageRating;
    await rateeExists.save();

    res.status(201).json({ message: 'Rating submitted successfully', rating: newRating });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRatings = async (req, res) => {
  try {
    const { rateeId, rateeModel } = req.params;

    if (!['Patient', 'Doctor'].includes(rateeModel)) {
      return res.status(400).json({ message: 'Invalid ratee model' });
    }

    const ratings = await Rating.find({ ratee: rateeId, rateeModel })
      .populate('rater', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
