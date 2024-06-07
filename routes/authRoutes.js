const express = require('express');
const { registerPatient, registerDoctor, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register/patient', registerPatient);
router.post('/register/doctor', registerDoctor);
router.post('/login', login);

module.exports = router;
