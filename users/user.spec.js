const app = require('../app');
const request = require('supertest');
const should = require('should');

const usersspec = () => {
  return (
    describe('USERS', () => {
      describe('GET /users', () => {
        describe('성공케이스', () => {
          it('유저정보를 담은 배열을 반환', (done) => {
            request(app)
              .get('/users')
              .end((err, res) => {
                res.body.should.be.instanceOf(Array);
                done();
              });
          });
          it('limit 갯수만큼 반환', (done) => {
            request(app)
              .get('/users?limit=1')
              .end((err, res) => {
                res.body.should.be.lengthOf(1);
                done();
              });
          });
        });
        describe('실패케이스', () => {
          it('limit 이 숫자형이 아니면 400을 응답한다', (done) => {
            request(app)
              .get('/users?limit=one')
              .expect(400)
              .end(done);
          });
        });
      });
      describe('GET /users/:id', () => {
        describe('성공케이스', () => {
          it('id가 2인 유저 객체를 반환한다', (done) => {
            request(app)
              .get('/users/2')
              .end((err, res) => {
                res.body.should.have.property('USER_ID', 2);
                done();
              });
          });
        });
      });
    }) 
  )
}
  

module.exports = usersspec;