const app = require('../app');
const request = require('supertest');
const should = require('should');

const loginspec = () => {
  return (
    describe('LOGIN', () => {
      describe('GET /login', () => {
        describe('성공시', () => {
          it('Login! 를 반환한다', (done) => { // done
            request(app)
              .get('/login')
              .end((err, res) => {
                res.body.should.be.equal('Login!');
                done();
              });
          });
        });
      });
      describe('POST /login', () => {
        describe('성공시', () => {
          it('토큰을 를 반환한다', (done) => { // done
            request(app)
              .get('/login')
              .end((err, res) => {
                res.body.should.be.equal('Login!');
                done();
              });
          });
        });
      });
    })
  )
}

module.exports = loginspec;