const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, getCurrentOtp } = require('../controllers/otpController');

// Sends the OTP
router.post('/send', sendOtp);

// Verifies the OTP
router.post('/verify', verifyOtp);

// Get all the existing OTPS
router.get('/', getCurrentOtp )

module.exports = router;
