const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    longUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, enum: ['acquisition', 'activation', 'retention'], default: 'acquisition' },
    createdAt: { type: Date, default: Date.now },
    clicks: { type: Number, default: 0 },
});

const Url = mongoose.model('Url', urlSchema);
module.exports = Url;
