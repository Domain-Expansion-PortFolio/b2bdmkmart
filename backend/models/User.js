const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic account information
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true
    },

    mobile: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },

    password: {
      type: String
    },

    // Wholesale business information
    businessName: {
      type: String,
      trim: true
    },

    gstNumber: {
      type: String,
      trim: true,
      uppercase: true
    },

    // Account type
   role: {
  type: String,
  enum: ["customer", "salesman", "admin"],
  default: "customer"
},

    // Wholesale account approval
    accountStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    isActive: {
      type: Boolean,
      default: true
    },

    // OTP information
    otpHash: {
      type: String
    },

    otpExpiresAt: {
      type: Date
    },

    otpAttempts: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);