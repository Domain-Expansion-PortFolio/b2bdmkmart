const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyMobileOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and OTP are required"
      });
    }

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Mobile number is not registered"
      });
    }

    if (user.otpAttempts >= 5) {
  return res.status(429).json({
    success: false,
    message: "Too many incorrect OTP attempts. Please request a new OTP."
  });
}

    if (!user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP not requested"
      });
    }

    if (new Date() > user.otpExpiresAt) {
      user.otpHash = undefined;
      user.otpExpiresAt = undefined;
      user.otpAttempts = 0;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired"
      });
    }

    const otpMatch = await bcrypt.compare(otp, user.otpHash);

    if (!otpMatch) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(401).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // OTP is valid — clear it so it cannot be reused
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    user.otpAttempts = 0;
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
      }
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        accountStatus: user.accountStatus
      }
    });

  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  verifyMobileOtp
};