const express = require('express');
const { shortenUrl, redirectUrl } = require('../controllers/urlController');
const { logClick } = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/shorten', authMiddleware, shortenUrl);
router.get('/:alias', logClick, redirectUrl); // Track clicks before redirecting

module.exports = router;




// const express = require('express');
// const { shortenUrl, redirectUrl } = require('../controllers/urlController');
// const authMiddleware = require('../middlewares/authMiddleware');
// const cacheMiddleware = require('../middlewares/cacheMiddleware');

// const router = express.Router();

// router.post('/shorten', authMiddleware, shortenUrl);
// router.get('/:alias', cacheMiddleware, redirectUrl);

// module.exports = router;
