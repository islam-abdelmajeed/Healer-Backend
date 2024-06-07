const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { bookAppointment, getAppointments } = require('../controllers/bookingController');

const router = express.Router();

router.post('/book', authMiddleware('patient'), bookAppointment);
router.get('/appointments', authMiddleware('patient'), getAppointments);

module.exports = router;
