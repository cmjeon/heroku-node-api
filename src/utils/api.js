const axios = require('axios')

const naverInstance = axios.create({
  baseURL: 'https://openapi.naver.com/',
  timeout: 3000,
  headers: {
    'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
    'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
  }
});

const openweatherInstance = axios.create({
  baseURL: 'https://api.openweathermap.org/',
  timeout: 1000,
});

const yonhapnewstvInstance = axios.create({
  baseURL: 'http://www.yonhapnewstv.co.kr/',
  timeout: 1000,
});

module.exports = {
  naverInstance: naverInstance,
  openweatherInstance: openweatherInstance,
  yonhapnewstvInstance: yonhapnewstvInstance
}