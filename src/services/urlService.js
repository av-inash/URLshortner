const Url = require('../models/Url');
const shortid = require('shortid');
const redisClient = require('../config/redis');

const createShortUrl = async (longUrl, userId, customAlias, topic) => {
    let shortCode = customAlias || shortid.generate();

    // Check if the custom alias is already taken
    if (customAlias) {
        const existingUrl = await Url.findOne({ shortCode });
        if (existingUrl) throw new Error('Custom alias already taken');
    }

    const newUrl = await Url.create({ longUrl, shortCode, user: userId, topic });
    await redisClient.setEx(shortCode, 86400, longUrl); // Cache for 24 hours

    return newUrl;
};

const getLongUrl = async (shortCode) => {
    const cachedUrl = await redisClient.get(shortCode);
    if (cachedUrl) return cachedUrl;

    const urlDoc = await Url.findOne({ shortCode });
    if (!urlDoc) throw new Error('Short URL not found');

    await redisClient.setEx(shortCode, 86400, urlDoc.longUrl);
    return urlDoc.longUrl;
};

const incrementClick = async (shortCode) => {
    await Url.updateOne({ shortCode }, { $inc: { clicks: 1 } });
};

module.exports = { createShortUrl, getLongUrl, incrementClick };
