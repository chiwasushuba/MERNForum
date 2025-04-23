// otpController.js
const User = require("../models/userModel")
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const UserOTP = require("../models/userOTPModel"); // Create a Mongoose model for OTPs

const sendOtp = async (req, res) => {
    const {email } = req.body;
    const exists = await User.findOne({ email });

    if(exists){
        return res.status(400).json({ message: "Email already used by other user choose another!" });
    }

  // this generates the otp
  const otp = otpGenerator.generate(6, { upperCaseAlphabets: true, specialChars: false }).toUpperCase();

  try {
    
    let userOtp = await UserOTP.findOne({ email });
    
    // console.log(userOtp) //debug user di ko makita kanina


    // Save OTP in the database with expiry time (optional)
    if (!userOtp) {
        userOtp = await UserOTP.create({email, otp, otpExpires: Date.now() + 300000 });
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
      text: `Use this OTP to verify your account: ${otp}. It expires in 15 minutes.`
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
        console.error("sendOtp error:", error);
        res.status(500).json({ success: false, message: "Error sending OTP" });
  }
};


// verify the otp that changes the user's verified to true
const verifyOtp = async (req, res) => {
    
    // EMAILS are unique
    const {username, email, otp } = req.body;

    const user = await User.findOne({username});

    const sentOtp = await UserOTP.findOne({ email });

    if(!user){
        return res.status(400).json({message: "User doesn't exists"})
    }

    if (!sentOtp || sentOtp.otp !== otp || Date.now() > sentOtp.otpExpires) {
        return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // OTP is correct, proceed with authentication

    
    const emailUser = await User.findOneAndUpdate(
        {username}, 
        { $set: { email: email, verified: true } }, // Update the verified field and add the email now to the user
        { new: true }
    );

    

    res.json({ success: true, message: "OTP verified!", user: emailUser}); // checks the user if it is now verified
};



// get the existing otps
const getCurrentOtp = async (req, res) => {
    const otps = await UserOTP.find()

    try{
        res.status(200).json(otps)
      }catch(error){
        res.status(404).json(error)
      }
}

module.exports = {sendOtp, verifyOtp, getCurrentOtp}