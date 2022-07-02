const app = require('../../app');
const request = require('supertest');
const should = require('should');

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
          it('최신 뉴스 목록을 반환한다', (done) => {
            request(app)
              .get('/news/yh/rss/newest')
              .end((err, res) => {
                res.body.should.has.properties(['title','description','items']);
                done();
              });
          });
        });
      })
      describe('GET /news/yh/rss/headline', () => {
        describe('성공케이스', () => {
          it('헤드라인 뉴스 목록을 반환한다', (done) => {
            request(app)
              .get('/news/yh/rss/headline')
              .end((err, res) => {
                res.body.should.has.properties(['title','description','items']);
                done();
              });
          });
        });
      })
      describe('GET /news/naver', () => {
        describe('성공케이스', () => {
          it('네이버 뉴스 목록을 반환한다', (done) => {
            let query = encodeURIComponent('경제');
            request(app)
              .get(`/news/naver/search?query=${query}`)
              .end((err, res) => {
                res.body.should.has.properties(['lastBuildDate', 'total', 'items']);
                done();
              });
          });
        })
        describe('실패케이스', () => {
          it('display 값이 100이 넘으면 400 오류가 발생', (done) => {
            let query = encodeURIComponent('경제');
            let display = 101;
            request(app)
              .get(`/news/naver/search?query=${query}&display=${display}`)
              .expect(400)
              .end(done);
          });
          it('start 값이 1000이 넘으면 400 오류가 발생', (done) => {
            let query = encodeURIComponent('경제');
            let start = 1001;
            request(app)
              .get(`/news/naver/search?query=${query}&start=${start}`)
              .expect(400)
              .end(done);
          });
        });
      })
      describe('GET /news/naver/keywords', () => {
        describe('성공케이스', () => {
          it('네이버 뉴스 키워드 목록을 반환한다', (done) => {
            let query = encodeURIComponent('경제');
            request(app)
              .get(`/news/naver/keywords`)
              .end((err, res) => {
                res.body.should.has.property('newsKeywords');
                done();
              });
          });
        });
      })
      describe.only('GET /news/naver/crawl', () => {
        describe('성공케이스', () => {
          it('네이버 뉴스 목록을 반환한다', (done) => {
            request(app)
              .get(`/news/naver/crawl?topic=economy`)
              .end((err, res) => {
                res.body.should.has.property('newsList');
                done();
              });
          });
        });
        describe('성공케이스', () => {
          it('지정 외 topic 을 전달하면 에러를 반환한다', (done) => {
            request(app)
              .get(`/news/naver/crawl?topic=myjob`)
              .expect(400)
              .end(done);
          });
        });
      })
    })
  )
}
module.exports = newsspec;