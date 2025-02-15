const express = require('express');
const { fetchAnalytics } = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/:alias', authMiddleware, fetchAnalytics);

module.exports = router;
