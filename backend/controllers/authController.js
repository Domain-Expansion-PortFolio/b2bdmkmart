const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { getPortalByRole } = require("../utils/portal");
const { generateToken } = require("../utils/generateToken");

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // 1. Validate input fields
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/username and password are required"
      });
    }

    const cleanId = identifier.toString().trim();
    const cleanMobile = cleanId.replace(/\D/g, "").slice(-10);

    // 2. Find user by email, username, mobile number, or employee ID
    const user = await User.findUser({
      $or: [
        { email: cleanId.toLowerCase() },
        { username: cleanId },
        { employeeId: cleanId.toUpperCase() },
        ...(cleanMobile.length === 10 ? [{ mobile: cleanMobile }, { mobile: `+91${cleanMobile}` }, { mobile: cleanId }] : [])
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password"
      });
    }

    // 3. Verify account active state
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact support."
      });
    }

    // 4. Verify password exists for account
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Password login is not enabled for this account. Please use Mobile OTP."
      });
    }

    // 5. Compare password hash
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
    const portal = getPortalByRole(user.role) || "customer";

    // 7. Create JWT token
    const token = generateToken(user);

    // 8. Return successful response
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

const register = async (req, res) => {
  try {
    const { username, email, mobile, password, businessName, gstNumber, role } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and password are required"
      });
    }

    const cleanMobile = mobile.toString().replace(/\D/g, "").slice(-10);
    if (cleanMobile.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // Check if account already exists
    const existing = await User.findUser({
      $or: [
        { mobile: cleanMobile },
        { mobile: `+91${cleanMobile}` },
        ...(email ? [{ email: email.toLowerCase().trim() }] : []),
        ...(username ? [{ username: username.trim() }] : [])
      ]
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this mobile number or email already exists. Please sign in."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = ["customer", "salesman", "admin"].includes(role) ? role : "customer";

    let newUser;
    const mongoose = require("mongoose");
    if (mongoose.connection.readyState === 1) {
      newUser = await User.create({
        username: username ? username.trim() : `user_${cleanMobile.slice(-4)}`,
        email: email ? email.toLowerCase().trim() : undefined,
        mobile: cleanMobile,
        password: hashedPassword,
        businessName: businessName ? businessName.trim() : undefined,
        gstNumber: gstNumber ? gstNumber.trim().toUpperCase() : undefined,
        role: assignedRole,
        accountStatus: gstNumber ? "approved" : "approved",
        isActive: true
      });
    } else {
      newUser = {
        _id: `user_${Date.now()}`,
        username: username ? username.trim() : `user_${cleanMobile.slice(-4)}`,
        email: email ? email.toLowerCase().trim() : `${cleanMobile}@dmkmart.com`,
        mobile: cleanMobile,
        password: hashedPassword,
        businessName: businessName ? businessName.trim() : "",
        gstNumber: gstNumber ? gstNumber.trim().toUpperCase() : "",
        role: assignedRole,
        accountStatus: "approved",
        isActive: true,
        save: async function () { return this; }
      };
      User.demoUsers.push(newUser);
    }

    const portal = getPortalByRole(newUser.role) || "customer";
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: "Account registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role,
        accountStatus: newUser.accountStatus
      },
      portal
    });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during registration"
    });
  }
};

module.exports = {
  login,
  register
};