const app = require('../app');
const request = require('supertest');
const should = require('should');

const usersspec = () => {
  return (
    describe('USERS', () => {
      // login 처리
      let token;
      before((done) => {
        request(app)
          .post('/login/login')
          .send({ email: 'chmin82@gmail.com', pw: '1111' })
          .expect(200)
          .end((err, res) => {
            token = res.body.token;
            // console.log('token:', token);
            done();
          });
      });
      describe('GET /users', () => {
        describe('성공케이스', () => {
          it('유저정보를 담은 배열을 반환', (done) => {
            request(app)
              .get('/users')
              .set('Authorization', token)
              .end((err, res) => {
                res.body.should.be.instanceOf(Array);
                done();
              });
          });
          it('limit 갯수만큼 반환', (done) => {
            request(app)
              .get('/users?limit=1')
              .set('Authorization', token)
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
              .set('Authorization', token)
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
              .set('Authorization', token)
              .end((err, res) => {
                res.body.should.have.property('USER_ID', '2');
                done();
              });
          });
        });
      });
    })
  )
}


module.exports = usersspec;
