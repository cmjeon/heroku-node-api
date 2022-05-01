const { parse } = require('rss-to-json');

const index = (req, res) => {
  res.json('News!');
}


const yhRssNewest = async (req, res) => {
  const path = 'http://www.yonhapnewstv.co.kr/browse/feed/';

  const rssData = await parse(path);
  res.json(rssData);
  res.status(200).end();
}

const yhRssHeadline = async (req, res) => {
  const path = 'http://www.yonhapnewstv.co.kr/category/news/headline/feed/';

  const rssData = await parse(path);
  res.json(rssData);
  res.status(200).end();
}

module.exports = {
  index,
  yhRssNewest: yhRssNewest,
  yhRssHeadline: yhRssHeadline
}