const { createClient } = require('redis');

const redisClient = createClient({ url: process.env.REDIS_URI });
redisClient.connect().catch(console.error);

const cacheMiddleware = async (req, res, next) => {
    const { alias } = req.params;

    try {
        const cachedUrl = await redisClient.get(alias);
        if (cachedUrl) {
            return res.redirect(301, cachedUrl);
        }
        next();
    } catch (error) {
        console.error('Redis Cache Error:', error);
        next();
    }
};

module.exports = cacheMiddleware;
