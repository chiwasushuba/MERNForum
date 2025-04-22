// otpController.js
const User = require("../models/userModel")
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const UserOTP = require("../models/userOTPModel"); // Create a Mongoose model for OTPs

const sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

  try {

    let userOtp = await UserOTP.findOne({ email });
  // Save OTP in the database with expiry time (optional)
    if (!userOtp) {
        userOtp = await UserOTP.create({ email, otp, otpExpires: Date.now() + 300000 });
    } else {
        userOtp = await UserOTP.findOneAndUpdate(
            { email },
            { otp, otpExpires: Date.now() + 300000 },
            { new: true }
        );
    }

  // Send OTP via Email using Nodemailer
  const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
      }
  });

  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Use this OTP to verify your account: ${otp}. It expires in 5 minutes.`
  };

  
      await transporter.sendMail(mailOptions, (error, info) =>{
        if (error) {
            console.error("Error:", error);
        } else {
            console.log("Email sent:", info.response);
        }
      });
      res.json({ success: true, message: "OTP sent to email", otp: otp });
  } catch (error) {
      res.status(500).json({ success: false, message: "Error sending OTP" });
  }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const user = await UserOTP.findOne({ email });
    console.log("user: ", user)

    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
        return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // OTP is correct, proceed with authentication
    res.json({ success: true, message: "OTP verified!"});
};

const getCurrentOtp = async (req, res) => {
    const otps = await UserOTP.find()

    try{
        res.status(200).json(otps)
      }catch(error){
        res.status(404).json(error)
      }
}

module.exports = {sendOtp, verifyOtp, getCurrentOtp}