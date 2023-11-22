const setRateLimit = require("express-rate-limit");

const rateLimitMiddleware = setRateLimit({
  windowMs: 1000,
  max: 10000,
  message: "You have exceeded your 10 requests per second limit.",
  headers: true,
});

module.exports = rateLimitMiddleware;