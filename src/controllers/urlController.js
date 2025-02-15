const Url = require('../models/Url');
const { createClient } = require('redis');

const redisClient = createClient({ url: process.env.REDIS_URI });
redisClient.connect().catch(console.error);

const shortenUrl = async (req, res) => {
    try {
        const { originalUrl, customAlias } = req.body;
        const existingUrl = await Url.findOne({ alias: customAlias });

        if (existingUrl) {
            return res.status(400).json({ message: 'Alias already taken' });
        }

        const newUrl = await Url.create({ originalUrl, alias: customAlias });

        // Cache in Redis
        await redisClient.set(customAlias, originalUrl, 'EX', 86400); // Expire in 24 hours

        res.status(201).json({ shortUrl: `${process.env.BASE_URL}/${newUrl.alias}` });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const redirectUrl = async (req, res) => {
    try {
        const { alias } = req.params;
        const urlData = await Url.findOne({ alias });

        if (!urlData) {
            return res.status(404).json({ message: 'URL not found' });
        }

        res.redirect(301, urlData.originalUrl);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { shortenUrl, redirectUrl };
