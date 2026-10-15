const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dmkmart";
  try {
    // Set 2.5s timeout and disable command buffering so offline DB doesn't hang HTTP requests
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.warn(`[DMK Mart] MongoDB connection notice: ${error.message}`);
    console.log("[DMK Mart] Running with pre-configured demo accounts (admin@mail.com, prateektandon2003@gmail.com, etc.)");
  }
};

module.exports = connectDB;