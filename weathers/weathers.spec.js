const app = require('../app');
const request = require('supertest');

const weatherspec = () => {
  return (
    describe.only('WEATHER', () => {
      describe('GET /weather', () => {
        describe('성공케이스', () => {
          it('Weather! 를 반환한다', (done) => { // done
            request(app)
              .get('/weathers')
              .end((err, res) => {
                console.log('res.body', res.body);
                res.body.should.be.equal('Weather!');
                done();
              });
          });
        });
      });
    })
  )
}

module.exports = weatherspec;