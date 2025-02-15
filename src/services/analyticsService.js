const Analytics = require('../models/Analytics');
const Url = require('../models/Url');
const uaParser = require('ua-parser-js');

const trackClick = async (shortCode, userAgent, ipAddress) => {
    const urlDoc = await Url.findOne({ shortCode });
    if (!urlDoc) throw new Error('Short URL not found');

    const parsedUA = uaParser(userAgent);
    const analyticsData = {
        url: urlDoc._id,
        userAgent,
        ipAddress,
        deviceType: parsedUA.device.type || 'unknown',
        browser: parsedUA.browser.name || 'unknown',
        os: parsedUA.os.name || 'unknown',
    };

    await Analytics.create(analyticsData);
    await Url.updateOne({ _id: urlDoc._id }, { $inc: { clicks: 1 } });
};

const getUrlAnalytics = async (shortCode) => {
    const urlDoc = await Url.findOne({ shortCode }).populate('user');
    if (!urlDoc) throw new Error('Short URL not found');

    const totalClicks = urlDoc.clicks;
    const analytics = await Analytics.find({ url: urlDoc._id });

    return { totalClicks, analytics };
};

module.exports = { trackClick, getUrlAnalytics };
