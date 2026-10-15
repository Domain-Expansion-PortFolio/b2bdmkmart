const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { getPortalByRole } = require("../utils/portal");
const { generateToken } = require("../utils/generateToken");

const verifyMobileOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and OTP are required"
      });
    }

    const cleanMobile = mobile.toString().replace(/\D/g, "").slice(-10);
    const user = await User.findUser({
      $or: [
        { mobile: cleanMobile },
        { mobile: `+91${cleanMobile}` },
        { mobile: mobile }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Mobile number is not registered"
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact support."
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
        message: "OTP not requested or has already been used"
      });
    }

    if (new Date() > user.otpExpiresAt) {
      user.otpHash = undefined;
      user.otpExpiresAt = undefined;
      user.otpAttempts = 0;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP."
      });
    }

    const otpMatch = await bcrypt.compare(otp.toString().trim(), user.otpHash);

    if (!otpMatch) {
      user.otpAttempts += 1;
      await user.save();

      const remaining = 5 - user.otpAttempts;
      return res.status(401).json({
        success: false,
        message: remaining > 0
          ? `Invalid OTP. ${remaining} attempts remaining.`
          : "Invalid OTP. Too many failed attempts. Please request a new OTP."
      });
    }

    // OTP verified: clear OTP credentials
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    user.otpAttempts = 0;
    await user.save();

    const portal = getPortalByRole(user.role) || "customer";

    const token = generateToken(user);

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
      },
      portal
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