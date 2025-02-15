const { trackClick, getUrlAnalytics } = require('../services/analyticsService');

const logClick = async (req, res, next) => {
    try {
        const { alias } = req.params;
        const userAgent = req.headers['user-agent'] || 'unknown';
        const ipAddress = req.ip;

        await trackClick(alias, userAgent, ipAddress);
        next(); // Proceed with redirection
    } catch (error) {
        console.error('Analytics Error:', error.message);
        next();
    }
};

const fetchAnalytics = async (req, res) => {
    try {
        const { alias } = req.params;
        const analyticsData = await getUrlAnalytics(alias);

        res.status(200).json(analyticsData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { logClick, fetchAnalytics };
