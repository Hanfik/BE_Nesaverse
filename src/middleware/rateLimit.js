/**
 * Simple in-memory rate limiter
 * Tracks requests per IP within a time window
 */
const attempts = new Map();

const rateLimit = ({ windowMs = 15 * 60 * 1000, max = 10, message = 'Terlalu banyak percobaan. Coba lagi nanti.' } = {}) => {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();

    if (!attempts.has(key)) {
      attempts.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    const record = attempts.get(key);

    if (now > record.resetAt) {
      record.count = 1;
      record.resetAt = now + windowMs;
      return next();
    }

    record.count++;

    if (record.count > max) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({ error: message });
    }

    next();
  };
};

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of attempts) {
    if (now > record.resetAt) attempts.delete(key);
  }
}, 5 * 60 * 1000);

module.exports = { rateLimit };
