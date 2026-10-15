const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorMiddleware");

const app = express();

// Connect to MongoDB (or enable dev fallback)
connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "DMK Mart API is running",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// 404 & Global error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error(`Server error on port ${PORT}:`, err.message);
});