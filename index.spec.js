const app = require('./index.js');
const request = require('supertest');
const should = require('should');

describe('GET /', () => {
  describe('성공시', () => {
    it('Hello! 를 반환한다', (done) => { // done
      request(app)
        .get('/')
        .end((err, res) => {
          res.body.should.equal('Hello!');
          done();
        });
    });
  });
});
describe('GET /users', () => {
  describe('성공시', () => {
    it('사용자목록을 반환한다', (done) => {
      request(app)
        .get('/users')
        .end((err, res) => {
          res.body.should.be.instanceOf(Array);
          done();
        })
    })
  })
})