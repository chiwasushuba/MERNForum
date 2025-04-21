const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userOTPSchema = Schema({
  userId: String,
  otp: String,
  createdAt: Date,
  expiresAt: Date,
})

module.exports('UserOTP', userOTPSchema)