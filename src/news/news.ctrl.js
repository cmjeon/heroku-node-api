const { parse } = require('rss-to-json');

const index = (req, res) => {
  res.json('News!');
}

const rssHeadline = async (req, res) => {
  const path = 'https://www.yonhapnewstv.co.kr/browse/feed/';

  const rssData = await parse(path);
  res.json(rssData);
  res.status(200).end();
}

module.exports = {
  index,
  mkRssHeadline: rssHeadline
}