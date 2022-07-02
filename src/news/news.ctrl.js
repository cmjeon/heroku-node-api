const { parse } = require('rss-to-json');
const { naverInstance, yonhapnewstvInstance } = require('../utils/api.js');
const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

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

const naverCrawl = async (req, res) => {
  try {
    const topics = [
      { topic:'politics', sid1:100 },
      { topic:'economy', sid1:101 },
      { topic:'society', sid1:102 },
      { topic:'life', sid1:103 },
      { topic:'world', sid1:104 },
      { topic:'it', sid1:105 },
    ]
    const topic = topics.find( obj => {
      return obj.topic == req.query.topic
    })

    if(!topic) return res.status(400).end();

    const resp = await axios({
      url: `https://news.naver.com/main/main.naver?mode=LSD&mid=shm&sid1=${topic.sid1}`,
      method: "GET",
      responseType: "arraybuffer"
    });
    const decoded = iconv.decode(resp.data,'EUC-KR');
    const $ = cheerio.load(decoded);
    const elements = $('.cluster_item .cluster_text a').get().map(x => $(x).text());
    const hrefs = $('.cluster_item .cluster_text a').get().map(x => $(x).attr('href'));
    // const descs = $('.cluster_item .cluster_text div').get().map(x => $(x).text());
    let newArray = [];
    elements.forEach((el, i) => {
      let obj = {};
      obj['text'] = el;
      obj['href'] = hrefs[i];
      // obj['desc'] = descs[i];
      newArray.push(obj);
    });
    res.json(newArray);
    return res.status(200).end();
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
  naverNewsKeywords,
  naverCrawl
}