const setRateLimit = require("express-rate-limit");

const rateLimitMiddleware = setRateLimit({
  windowMs: 1000,
  max: 3,
  message: "You have exceeded your 2 requests per second limit.",
  headers: true,
});

module.exports = rateLimitMiddleware;