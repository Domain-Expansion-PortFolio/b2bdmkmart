const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const seedDatabase = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dmkmart";

  console.log(`[DMK Mart] Connecting to MongoDB: ${mongoUri}`);

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log("[DMK Mart] Connected to MongoDB successfully.");

    const hashedPassword = await bcrypt.hash("Password@123", 10);

    const accounts = [
      {
        username: "prateek",
        email: "prateektandon2003@gmail.com",
        mobile: "9876543210",
        password: hashedPassword,
        businessName: "Tandon Enterprises",
        gstNumber: "07AAAAA0000A1Z5",
        role: "customer",
        accountStatus: "approved",
        isActive: true,
      },
      {
        username: "admin",
        email: "admin@mail.com",
        mobile: "9999999999",
        password: hashedPassword,
        businessName: "DMK Mart Headquarters",
        role: "admin",
        accountStatus: "approved",
        isActive: true,
      },
      {
        username: "customer",
        email: "customer@dmkmart.com",
        mobile: "9123456789",
        password: hashedPassword,
        businessName: "Standard Retail Partner",
        role: "customer",
        accountStatus: "approved",
        isActive: true,
      },
      {
        username: "salesman",
        email: "sales@dmkmart.com",
        mobile: "9888888888",
        password: hashedPassword,
        businessName: "DMK Sales Field Team",
        role: "salesman",
        accountStatus: "approved",
        isActive: true,
      },
    ];

    for (const acc of accounts) {
      await User.findOneAndUpdate(
        { email: acc.email },
        { $set: acc },
        { upsert: true, new: true }
      );
      console.log(`[DMK Mart] Seeded account: ${acc.email} (${acc.role})`);
    }

    console.log("\nAll demo accounts seeded successfully!");
    console.log("-----------------------------------------");
    console.log("Customer: prateektandon2003@gmail.com  / Password@123  (Mobile: 9876543210)");
    console.log("Admin:    admin@mail.com               / Password@123  (Mobile: 9999999999)");
    console.log("Sales:    sales@dmkmart.com            / Password@123  (Mobile: 9888888888)");
    console.log("-----------------------------------------");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("[DMK Mart] Seeding error:", err.message);
    process.exit(1);
  }
};

seedDatabase();

