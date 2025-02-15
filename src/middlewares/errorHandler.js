const rateLimit = require('express-rate-limit');
const { cacheGet, cacheSet } = require('../utils/cache');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    keyGenerator: (req) => req.ip,
    handler: (req, res) => {
        res.status(429).json({ message: 'Too many requests. Please try again later.' });
    },
});

module.exports = limiter;
