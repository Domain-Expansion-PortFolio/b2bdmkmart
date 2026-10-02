const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const generateAndStoreOtp = async (mobile) => {
  const user = await User.findOne({ mobile });

  if (!user) {
    throw new Error("Mobile number is not registered");
  }

  if (
  user.otpExpiresAt &&
  user.otpHash &&
  Date.now() < user.otpExpiresAt.getTime() - 4 * 60 * 1000
) {
  throw new Error("Please wait before requesting another OTP");
}

  const otp = crypto.randomInt(100000, 1000000).toString();

  const otpHash = await bcrypt.hash(otp, 10);

  user.otpHash = otpHash;
  user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  user.otpAttempts = 0;

  await user.save();

  console.log(`OTP for ${mobile}: ${otp}`);

  return otp;
};

module.exports = {
  generateAndStoreOtp
};