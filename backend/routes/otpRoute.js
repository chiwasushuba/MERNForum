const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, getCurrentOtp } = require('../controllers/otpController');

router.post('/send', sendOtp);
router.post('/verify', verifyOtp);
router.get('/', getCurrentOtp )

module.exports = router;
