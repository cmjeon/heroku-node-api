const express = require('express');
const router = express.Router();
const ctrl = require('./news.ctrl');

router.get('/', ctrl.index);
// 미사용
// router.get('/yh/rss/newest', ctrl.yhRssNewest)
// 미사용
// router.get('/yh/rss/headline', ctrl.yhRssHeadline);
router.get('/naver/search', ctrl.naverSearch);
router.get('/naver/news-keywords', ctrl.naverNewsKeywords);
// 미사용
// router.get('/naver/crawl', ctrl.naverCrawl);

module.exports = router;