const errorHandler = (err, req, res, _next) => {
  console.error("Server Error:", err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};

