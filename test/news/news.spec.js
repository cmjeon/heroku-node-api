const app = require('../../app');
const request = require('supertest');
const should = require('should');
const { getTodayDateWithHypen } = require('../../src/utils/util.js');

const newsspec = () => {
  return (
    describe('NEWS', () => {
      describe('GET /news', () => {
        describe('성공케이스', () => {
          it('News! 를 반환한다', (done) => { // done
            request(app)
              .get('/news')
              .end((err, res) => {
                res.body.should.be.equal('News!');
                done();
              });
          });
        });
      })
      describe('GET /news/yh/rss/newest', () => {
        describe('성공케이스', () => {
          it('최신 뉴스 객체를 반환한다', (done) => {
            request(app)
              .get('/news/yh/rss/newest')
              .end((err, res) => {
                console.log('RES!!!', res.body.title);
                console.log(typeof res.body.title);
                done();
              });
          });
        });
      })
      describe('GET /news/yh/rss/headline', () => {
        describe('성공케이스', () => {
          it('헤드라인 뉴스 객체를 반환한다', (done) => {
            request(app)
              .get('/news/yh/rss/headline')
              .end((err, res) => {
                // console.log('RES!!!', res.body);
                done();
              });
          });
        });
      })
    })
  )
}
module.exports = newsspec;