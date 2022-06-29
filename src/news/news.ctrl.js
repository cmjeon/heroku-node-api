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
    const headers = {
      'Content-Type': 'euc-kr',
      'Encoding': null
    };
    const resp = await axios({
      url: 'https://news.naver.com/main/main.naver?mode=LSD&mid=shm&sid1=100',
      method: "GET",
      responseType: "arraybuffer"
    });
    // console.log('###', resp.data);
    // const $ = cheerio.load(resp.data);
    // const elements = $('.cluster .cluster_text a');
    // elements.each((idx, el) => {
    //   console.log('###', iconv.decode($(el).text(), 'euc-kr'));
    // });

    const decoded = iconv.decode(resp.data,'EUC-KR');
    // console.log('###', decoded);
    const $ = cheerio.load(decoded);
    const elements = $('.cluster .cluster_text a').get().map(x => $(x).text());
    const hrefs = $('.cluster .cluster_text a').get().map(x => $(x).attr('href'));
    const descs = $('.cluster_text_lede').get().map(x => $(x).text());
    // TODO 설명이나 기타 정보들이 있어야 함
    // elements.each((idx, el) => {
    //   console.log('###', $(el).text());
    // });
    // console.log('### elements', elements);
    // console.log('### hrefs', hrefs);
    let newArray = [];
    elements.forEach((el, i) => {
      let obj = {};
      obj['text'] = el;
      obj['href'] = hrefs[i];
      obj['desc'] = descs[i];
      newArray.push(obj);
    });
    console.log(newArray);
    // const decoded = iconv.decode(resp.data,'EUC-KR');
    // console.log('###', decoded);
    // console.log('####', resp.data.substring(14000, 18000));
    // let det = jschardet.detect(resp);
    // console.log('###', det);
    // const test1 = resp.data.substring(14000, 18000);
    // const deResp = iconv.decode(test1, 'EUC-KR');
    // console.log(deResp);
    // console.log('####', deResp);
    // const $ = cheerio.load(deResp.data);
    // const elements = $('.cluster .cluster_text a');
    // console.log('###', elements);
    // console.log(iconv.decode(elements, 'euc-kr'));
    // elements.each((idx, el) => {
    // console.log('###', $(el).text());
    // });
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