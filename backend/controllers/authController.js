const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { getPortalByRole } = require("../utils/portal");

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // 1. Validate input
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/username and password are required"
      });
    }

    // 2. Find user by email OR username
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password"
      });
    }

    // 3. Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive"
      });
    }

    // 4. Check password exists
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Password login is not available for this account"
      });
    }

    // 5. Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password"
      });
    }

    // 6. Get portal based on user's role
    const portal = getPortalByRole(user.role);

    if (!portal) {
      return res.status(403).json({
        success: false,
        message: "Invalid account role"
      });
    }

    // 7. Create JWT
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

    // 8. Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",

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
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  login
};