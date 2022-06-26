const app = require('../../app');
const request = require('supertest');

const coronaspec = () => {
  return (
    describe.only('CORONA', () => {
      describe('GET /corona', () => {
        describe('성공케이스', () => {
          it('Conona! 를 반환한다', (done) => { // done
            request(app)
              .get('/corona')
              .end((err, res) => {
                res.body.should.be.equal('Corona!');
                done();
              });
          });
        });
      });
      describe('GET /corona/korea/beta', () => {
        describe('성공케이스', () => {
          it('국내 전체를 반환한다', (done) => { // done
            request(app)
              .get('/corona/korea/beta')
              .end((err, res) => {
                res.body.should.has.property('API').has.properties(['apiName','updateTime','topCountries']);
                done();
              });
          });
        });
      });
      describe('GET /corona/korea/vaccine', () => {
        describe('성공케이스', () => {
          it('국내 예방접종현황을 반환한다', (done) => { // done
            request(app)
              .get('/corona/korea/vaccine')
              .end((err, res) => {
                res.body.should.be.equal('Corona!');
                // TODO 테스트케이스 추가
                done();
              });
          });
        });
      });
      describe('GET /corona/korea/counter', () => {
        describe('성공케이스', () => {
          it('국내 카운터를 반환한다', (done) => { // done
            request(app)
              .get('/corona/korea/counter')
              .end((err, res) => {
                res.body.should.be.equal('Corona!');
                // TODO 테스트케이스 추가
                done();
              });
          });
        });
      });
      describe('GET /corona/korea/country', () => {
        describe('성공케이스', () => {
          it('시도별 발생동향을 반환한다', (done) => { // done
            request(app)
              .get('/corona/korea/country')
              .end((err, res) => {
                res.body.should.be.equal('Corona!');
                // TODO 테스트케이스 추가
                done();
              });
          });
        });
      });
    })
  )
}
module.exports = coronaspec;