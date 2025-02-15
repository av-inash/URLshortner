const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    url: { type: mongoose.Schema.Types.ObjectId, ref: 'Url', required: true },
    userAgent: String,
    ipAddress: String,
    deviceType: String,
    browser: String,
    os: String,
    createdAt: { type: Date, default: Date.now },
});

const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics;
