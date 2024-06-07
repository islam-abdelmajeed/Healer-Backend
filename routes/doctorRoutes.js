const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { manageAppointments } = require('../controllers/bookingController');

const router = express.Router();

router.get('/appointments', authMiddleware('doctor'), manageAppointments);

module.exports = router;
