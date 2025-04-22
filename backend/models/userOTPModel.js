// models/UserOTP.js
const mongoose = require('mongoose');

const userOTPSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User"
  },

  email: { 
    type: String, 
    required: true 
  },

  otp: { 
    type: String, 
    required: true 
  },

  createdAt: { type: Date, default: Date.now, expires: 300 }, // Auto-delete after 5 minutes
});

module.exports = mongoose.model('UserOTP', userOTPSchema);
