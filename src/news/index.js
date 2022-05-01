const express = require('express');
const router = express.Router();
const ctrl = require('./news.ctrl');

router.get('/', ctrl.index);
router.get('/mk/rss/headline', ctrl.mkRssHeadline);

module.exports = router;