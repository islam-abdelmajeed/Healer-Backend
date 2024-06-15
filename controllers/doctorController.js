import Doctor from '../models/Doctor.js';

// Search doctors by name, specialty, or address
export const searchDoctorsForPatient = async (req, res) => {
  try {
    const { name, specialty, address } = req.query;

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
      // Use regex to perform a case-insensitive search in nested address fields
      query.$or = [
        { 'address.street': { $regex: address, $options: 'i' } },
        { 'address.city': { $regex: address, $options: 'i' } },
        { 'address.state': { $regex: address, $options: 'i' } },
        { 'address.zipCode': { $regex: address, $options: 'i' } }
      ];
    }

    // Find doctors that match the query
    const doctors = await Doctor.find(query);

    res.status(200).json({ doctors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
