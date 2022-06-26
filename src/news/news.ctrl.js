const { parse } = require('rss-to-json');
const { idText } = require('typescript');
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
    let display = req.query.display;
    if(display === undefined) display = 10;
    if(display > 100) return res.status(400).end();
  
    let start = req.query.start;
    // start = 1
    if(start === undefined) start = 1;
    if(start >1000) return res.status(400).end();

    let sort = req.query.sort;
    // sort = sim
    if(sort === undefined) sort = 'sim';
    const url =  `v1/search/news.json?query=${query}&display=${display}&start=${start}&sort=${sort}`

    const result = await naverInstance({
      method : 'get',
      url : url
    })

    res.status(200).json(result.data).end();
  } catch(e) {
    console.log('###e.response.data', e.response.data)
    return res.status(500).send('Internal Server Error');
  }
}

const naverNewsKeywords = async (req, res) => {
  const result = {
    newsKeywords : ['WWDC','Apple','iPhone','개발자','판교']
  }
  return res.status(200).json(result).end();
}

module.exports = {
  index,
  yhRssNewest: yhRssNewest,
  yhRssHeadline: yhRssHeadline,
  naverSearch: naverSearch,
  naverNewsKeywords,
}