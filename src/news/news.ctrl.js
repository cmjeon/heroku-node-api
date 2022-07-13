const { parse } = require('rss-to-json');
const { naverInstance, yonhapnewstvInstance, kostatInstance } = require('../utils/api.js');
const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const { pool } = require("../postgresql/postgresql");

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
    /**
     * TODO DB 에 해당키워드로 검색결과가 있는지 조회한다.
     */
    const url =  `v1/search/news.json?query=${query}&display=${display}&start=${start}&sort=${sort}`
    /**
     * TODO 없으면 검색결과를 DB 에 저장한다
     */
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
  /**
   * TODO 키워드는 매주 화요일에 그 전주 일요일부터 토요일까지로 바뀌는 듯 하다
    */

  console.log('### naverNewsKeywords')
  try {
    const yearList = await kostatInstance({
      url: `social/getYearList.do`,
      method: 'GET'
    })
    const startYear = getLastObjOfYearList(yearList.data.startYearList);
    const endYear = getLastObjOfYearList(yearList.data.endYearList);
    const monthDayList = await kostatInstance({
      url: `social/getMonthDayList.do?startyear=${startYear}&endyear=${endYear}`,
      method: 'GET'

    });
    const fromDate = getSearchDate(startYear, monthDayList.data.startMMDD);
    const toDate = getSearchDate(startYear, monthDayList.data.endMMDD);
    let newsKeywords;
    const statement = {
      text: 'SELECT KEYWORD_ID, FROM_DATE, TO_DATE, SN, KEYWORD, CRET_DTIME, CRET_ID FROM NEWS_KEYWORD WHERE FROM_DATE = $1 AND TO_DATE = $2 ORDER BY SN ASC',
      values: [fromDate, toDate]
    }
    const { rows } = await pool.query(statement);
    newsKeywords = rows.map((keyword) => {
      return { sn:keyword.sn, keyword: keyword.keyword }
    });
    if (newsKeywords.length === 0) {
      const pointKeywordList = await kostatInstance({
        url: `social/getPointKeywordList.do?fromdate=${fromDate}&todate=${toDate}&categoryCd=ECO_KWD&termDicCd=1`,
        method: 'GET',
      });
      newsKeywords = pointKeywordList.data.dataList.map((keyword) => {
        return { sn: keyword.sn, keyword: keyword.text };
      }).slice(0, 10);
      newsKeywords.forEach((keyword) => {
        const statement = {
          text: 'INSERT INTO NEWS_KEYWORD (FROM_DATE, TO_DATE, SN, KEYWORD, CRET_DTIME, CRET_ID) VALUES ($1, $2, $3, $4, $5, $6)',
          values: [fromDate, toDate, keyword.sn, keyword.keyword, new Date(), 'SYSTEM']
        }
        const { rows } = pool.query(statement);
      })
    }

    const result = {
      newsKeywords
    }
    return res.status(200).json(result).end();
  } catch(e) {
    console.log(e)
    return res.status(500).send('Internal Server Error');
  }
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

    const response = await axios({
      url: `https://news.naver.com/main/main.naver?mode=LSD&mid=shm&sid1=${topic.sid1}`,
      method: "GET",
      responseType: "arraybuffer"
    });
    const decoded = iconv.decode(response.data,'EUC-KR');
    const $ = cheerio.load(decoded);
    const elements = $('.cluster_item .cluster_text a').get().map(x => $(x).text());
    const hrefs = $('.cluster_item .cluster_text a').get().map(x => $(x).attr('href'));
    // const descs = $('.cluster_item .cluster_text div').get().map(x => $(x).text());
    let newsList = [];
    elements.forEach((el, i) => {
      let obj = {};
      obj['text'] = el;
      obj['href'] = hrefs[i];
      // obj['desc'] = descs[i];
      newsList.push(obj);
    });
    res.json({ newsList });
    return res.status(200).end();
  } catch(e) {
    console.log(e)
    return res.status(500).send('Internal Server Error');
  }
}

const getLastObjOfYearList = (yearList) => {
  return yearList[yearList.length-1].year
}

function getSearchDate(startYear, mmdd) {
  return startYear + mmdd[mmdd.length-1].mm + mmdd[mmdd.length-1].dd;
}

module.exports = {
  index,
  yhRssNewest: yhRssNewest,
  yhRssHeadline: yhRssHeadline,
  naverSearch: naverSearch,
  naverNewsKeywords,
  naverCrawl
}