const express = require("express");

const { login } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { sendOtp } = require("../controllers/mobileOtpController");
const { verifyMobileOtp } = require("../controllers/verifyMobileOtpController");

const router = express.Router();

router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyMobileOtp);

router.get("/me", authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;