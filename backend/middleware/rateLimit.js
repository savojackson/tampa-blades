// Rate limiting middleware
const rateLimits = new Map();

// Simple in-memory rate limiter
function createRateLimit(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // Maximum requests per window
    message = "Too many requests, please try again later",
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = options;

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    // Clean up old entries
    for (const [ip, data] of rateLimits.entries()) {
      if (now - data.resetTime > windowMs) {
        rateLimits.delete(ip);
      }
    }

    let limit = rateLimits.get(key);

    if (!limit) {
      limit = {
        count: 0,
        resetTime: now,
      };
      rateLimits.set(key, limit);
    }

    // Reset counter if window has passed
    if (now - limit.resetTime > windowMs) {
      limit.count = 0;
      limit.resetTime = now;
    }

    // Check if limit exceeded
    if (limit.count >= max) {
      return res.status(429).json({
        error: message,
        retryAfter: Math.ceil((limit.resetTime + windowMs - now) / 1000),
      });
    }

    // Increment counter
    limit.count++;

    // Add rate limit headers
    res.set({
      "X-RateLimit-Limit": max,
      "X-RateLimit-Remaining": Math.max(0, max - limit.count),
      "X-RateLimit-Reset": new Date(limit.resetTime + windowMs).toISOString(),
    });

    next();
  };
}

// Specific rate limiters for different endpoints
const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: "Too many authentication attempts, please try again in 15 minutes",
});

const apiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: "Too many requests, please try again later",
});

const uploadRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  message: "Too many file uploads, please try again later",
});

module.exports = {
  createRateLimit,
  authRateLimit,
  apiRateLimit,
  uploadRateLimit,
};
