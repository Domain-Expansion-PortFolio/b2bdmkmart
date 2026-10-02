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

    await generateAndStoreOtp(mobile);

    return res.status(200).json({
      success: true,
      message: "OTP generated successfully"
    });

  } catch (error) {
    console.error("Send OTP error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  sendOtp
};