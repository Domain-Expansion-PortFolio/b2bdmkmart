const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const generateAndStoreOtp = async (mobile) => {
  const cleanMobile = mobile.toString().replace(/\D/g, "").slice(-10);

  // Search user by 10-digit number or with +91 country code prefix
  const user = await User.findUser({
    $or: [
      { mobile: cleanMobile },
      { mobile: `+91${cleanMobile}` },
      { mobile: mobile }
    ]
  });

  if (!user) {
    throw new Error("Mobile number is not registered");
  }

  // 60-second cooldown check between OTP requests
  if (
    user.otpExpiresAt &&
    user.otpHash &&
    Date.now() < user.otpExpiresAt.getTime() - 4 * 60 * 1000
  ) {
    const secondsRemaining = Math.ceil(
      (user.otpExpiresAt.getTime() - 4 * 60 * 1000 - Date.now()) / 1000
    );
    throw new Error(`Please wait ${secondsRemaining}s before requesting a new OTP`);
  }

  // Generate 6-digit random OTP
  const otp = crypto.randomInt(100000, 1000000).toString();

  // Hash OTP before storing
  const otpHash = await bcrypt.hash(otp, 10);

  user.otpHash = otpHash;
  user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity
  user.otpAttempts = 0;

  await user.save();

  console.log(`[DMK Mart] Verification OTP for ${cleanMobile}: ${otp}`);

  return otp;
};

module.exports = {
  generateAndStoreOtp
};