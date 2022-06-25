const { parse } = require('rss-to-json');
const { naverInstance, yonhapnewstvInstance } = require('../utils/api.js');

const index = (req, res) => {
  res.json('News!');
}


const yhRssNewest = async (req, res) => {
  try {
    const path = 'http://www.yonhapnewstv.co.kr/browse/feed/';

    const rssData = await parse(path);
    res.json(rssData);
    res.status(200).end();
  } catch (e) {
    console.log(e)
    return res.status(500).send('Internal Server Error');
  }
}

const yhRssHeadline = async (req, res) => {
  try {
    const path = 'http://www.yonhapnewstv.co.kr/category/news/headline/feed/';

    const rssData = await parse(path);
    res.json(rssData);
    res.status(200).end();
  } catch(e) {
    console.log(e)
    return res.status(500).send('Internal Server Error');
  }
}

const naverSearch = async (req, res) => {
  try {
    const query = encodeURIComponent(req.query.query);
    const url =  `v1/search/news.json?query=${query}`

    const result = await naverInstance({
      method : 'get',
      url : url
    })

    res.status(200).json(result.data).end();
  } catch(e) {
    console.log(e)
    return res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  index,
  yhRssNewest: yhRssNewest,
  yhRssHeadline: yhRssHeadline,
  naverSearch: naverSearch,
}