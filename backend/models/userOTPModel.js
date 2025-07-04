// models/UserOTP.js
const mongoose = require('mongoose');

const userOTPSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true 
  },

  otp: { 
    type: String, 
    required: true 
  },

  createdAt: { type: Date, default: Date.now, expires: 900 }, // Auto-delete after 15 minutes
});

module.exports = mongoose.model('UserOTP', userOTPSchema);
