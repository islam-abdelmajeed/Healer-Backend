import Doctor from '../models/Doctor.js';

// Search and filter doctors by various criteria
export const searchAndFilterDoctors = async (req, res) => {
  try {
    const { name, specialty, address, priceMin, priceMax, place, date, time } = req.query;

    // Build the search query object
    const query = {};

    if (name) {
      // Use regex to perform a case-insensitive search
      query.name = { $regex: name, $options: 'i' };
    }

    if (specialty) {
      // Use regex to perform a case-insensitive search
      query.specialty = { $regex: specialty, $options: 'i' };
    }

    if (address) {
      query.address = { $regex: address, $options: 'i' };  
    }

    if (priceMin || priceMax) {
      // Filter by price range
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    if (place) {
      // Filter by place availability (Clinic or Home)
      if (place.toLowerCase() === 'clinic') {
        query.clinicAvailability = true;
      } else if (place.toLowerCase() === 'home') {
        query.homeVisitAvailability = true;
      }
    }

    if (date && time) {
      // Filter by availability on a specific date and time
      const timeFormatRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
      if (!timeFormatRegex.test(time)) {
        return res.status(400).json({ message: 'Time must be in the format "HH:MM AM/PM"' });
      }
      query.availableTimes = time;
      // Note: Here we're assuming doctors have fixed available times regardless of date.
      // To filter by specific dates, you would need to include a more complex scheduling system in your model.
    }

    // Find doctors that match the query
    const doctors = await Doctor.find(query);

    res.status(200).json({ doctors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
