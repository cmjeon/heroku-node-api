const axios = require('axios')

const naverInstance = axios.create({
  baseURL: 'https://openapi.naver.com/',
  timeout: 2000,
  headers: {
    'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
    'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
  }
});

const kostatInstance = axios.create({
  baseURL: 'https://data.kostat.go.kr/',
  timeout: 2000,
})

const openweatherInstance = axios.create({
  baseURL: 'https://api.openweathermap.org/',
  timeout: 1000,
});

const yonhapnewstvInstance = axios.create({
  baseURL: 'http://www.yonhapnewstv.co.kr/',
  timeout: 1000,
});

const coronaInstance = axios.create({
  baseURL: 'https://api.corona-19.kr/',
  timeout: 1000,
})

module.exports = {
  naverInstance,
  openweatherInstance,
  yonhapnewstvInstance,
  coronaInstance,
  kostatInstance,
}