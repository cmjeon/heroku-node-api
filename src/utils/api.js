const axios = require('axios')

const instance = axios.create({
  baseURL: 'https://openapi.naver.com/',
  timeout: 1000,
  headers: {
    'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
    'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
  }
});

module.exports = {
  instance
}가