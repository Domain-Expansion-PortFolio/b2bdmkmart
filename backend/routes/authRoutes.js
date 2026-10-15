const express = require("express");
const { login, register } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");
const { sendOtp } = require("../controllers/mobileOtpController");
const { verifyMobileOtp } = require("../controllers/verifyMobileOtpController");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyMobileOtp);

router.get("/me", authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;