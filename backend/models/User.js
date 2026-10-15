const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic account information
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },

    mobile: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
    },

    // Wholesale business information
    businessName: {
      type: String,
      trim: true,
    },

    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },

    // Account role
    role: {
      type: String,
      enum: ["customer", "salesman", "admin"],
      default: "customer",
    },

    // Staff employee identification code
    employeeId: {
      type: String,
      trim: true,
      uppercase: true,
    },

    // Wholesale account approval
    accountStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // OTP information
    otpHash: {
      type: String,
    },

    otpExpiresAt: {
      type: Date,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-seeded demo accounts for instant local testing (even if MongoDB is offline)
const DEMO_PASSWORD_HASH = "$2b$10$YSj0.JoykGo5Ffr2arAm.Oh9e8HTE63oDvSE7FPaCCZva89Wx46lm"; // Password@123

const demoUsers = [
  {
    _id: "demo_prateek_01",
    username: "prateek",
    email: "prateektandon2003@gmail.com",
    mobile: "9876543210",
    password: DEMO_PASSWORD_HASH,
    role: "customer",
    isActive: true,
    accountStatus: "approved",
    otpHash: null,
    otpExpiresAt: null,
    otpAttempts: 0,
    save: async function () {
      return this;
    },
  },
  {
    _id: "demo_admin_01",
    username: "admin",
    email: "admin@mail.com",
    mobile: "9999999999",
    password: DEMO_PASSWORD_HASH,
    role: "admin",
    isActive: true,
    accountStatus: "approved",
    otpHash: null,
    otpExpiresAt: null,
    otpAttempts: 0,
    save: async function () {
      return this;
    },
  },
  {
    _id: "demo_customer_01",
    username: "customer",
    email: "customer@dmkmart.com",
    mobile: "9123456789",
    password: DEMO_PASSWORD_HASH,
    role: "customer",
    isActive: true,
    accountStatus: "approved",
    otpHash: null,
    otpExpiresAt: null,
    otpAttempts: 0,
    save: async function () {
      return this;
    },
  },
  {
    _id: "demo_salesman_01",
    username: "salesman",
    email: "sales@dmkmart.com",
    mobile: "9888888888",
    employeeId: "EMP-101",
    password: DEMO_PASSWORD_HASH,
    role: "salesman",
    isActive: true,
    accountStatus: "approved",
    otpHash: null,
    otpExpiresAt: null,
    otpAttempts: 0,
    save: async function () {
      return this;
    },
  },
];

function matchDemoUser(filter) {
  if (!filter) return null;

  // Direct mobile match
  if (filter.mobile) {
    const target = filter.mobile.toString().replace(/\D/g, "").slice(-10);
    return demoUsers.find((u) => u.mobile.slice(-10) === target) || null;
  }

  // $or condition match (email, username, mobile, employeeId)
  if (Array.isArray(filter.$or)) {
    for (const cond of filter.$or) {
      if (cond.email) {
        const target = cond.email.toLowerCase().trim();
        const found = demoUsers.find((u) => u.email.toLowerCase() === target);
        if (found) return found;
      }
      if (cond.username) {
        const target = cond.username.trim();
        const found = demoUsers.find((u) => u.username.toLowerCase() === target.toLowerCase());
        if (found) return found;
      }
      if (cond.employeeId) {
        const target = cond.employeeId.toUpperCase().trim();
        const found = demoUsers.find((u) => (u.employeeId || "").toUpperCase() === target);
        if (found) return found;
      }
      if (cond.mobile) {
        const target = cond.mobile.toString().replace(/\D/g, "").slice(-10);
        const found = demoUsers.find((u) => u.mobile.slice(-10) === target);
        if (found) return found;
      }
    }
  }

  return null;
}

// Universal finder that queries MongoDB when connected, or falls back to demo accounts
userSchema.statics.findUser = async function (filter) {
  if (mongoose.connection.readyState === 1) {
    try {
      const user = await this.findOne(filter);
      if (user) return user;
    } catch (e) {
      console.warn("MongoDB query failed, checking demo store:", e.message);
    }
  }

  return matchDemoUser(filter);
};

const User = mongoose.model("User", userSchema);
User.demoUsers = demoUsers;

module.exports = User;
module.exports = User;