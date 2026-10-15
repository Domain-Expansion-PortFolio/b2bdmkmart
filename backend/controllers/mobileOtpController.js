const { generateAndStoreOtp } = require("../services/mobileOtpService");

const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required"
      });
    }

    const cleanedMobile = mobile.toString().replace(/\D/g, "").slice(-10);
    if (cleanedMobile.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number"
      });
    }

    const otp = await generateAndStoreOtp(cleanedMobile);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your registered mobile number",
      // Include OTP in development mode for testing without SMS provider
      ...(process.env.NODE_ENV !== "production" ? { otp } : {})
    });

  } catch (error) {
    console.error("Send OTP error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to send OTP"
    });
  }
};

module.exports = {
  sendOtp
};