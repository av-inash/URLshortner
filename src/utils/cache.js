const redisClient = require('../config/redis');

const CACHE_EXPIRATION = 3600; // 1 hour

const cacheSet = async (key, value, expiration = CACHE_EXPIRATION) => {
    try {
        await redisClient.setEx(key, expiration, JSON.stringify(value));
    } catch (error) {
        console.error('Redis Cache Set Error:', error);
    }
};

const cacheGet = async (key) => {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Redis Cache Get Error:', error);
        return null;
    }
};

module.exports = { cacheSet, cacheGet };
