const app = require('../app');
const request = require('supertest');

const weatherspec = () => {
  return (
    describe('WEATHER', () => {
      describe('GET /weathers', () => {
        describe('성공케이스', () => {
          it('Weather! 를 반환한다', (done) => { // done
            request(app)
              .get('/weathers')
              .end((err, res) => {
                res.body.should.be.equal('Weather!');
                done();
              });
          });
        });
      })
      describe('GET /weather/current', () => {
        describe('성공케이스', () => {
          it('오늘의 날씨 객체를 반환한다', (done) => {
            let lat = '37.4954';
            let lon = '127.029';
            // let appid = '363b9090b9fee032857eb62d43b83921';
            request(app)
              .get('/weathers/current')
              .query({ lat: lat, lon: lon })
              .end((err, res) => {
                // console.log('RES!!!', res.body);
                res.body.should.have.property('cod', 200);
                res.body.should.have.property('id', 1846735);
                done();
              });
          });
        });
      })
    })
  )
}

module.exports = weatherspec;