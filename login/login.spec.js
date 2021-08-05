const app = require('../app');
const request = require('supertest');
const should = require('should');

const loginspec = () => {
  return (
    describe.only('LOGIN', () => {
      describe('GET /login', () => {
        describe('성공케이스', () => {
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
      describe('POST /login/login', () => {
        describe('성공케이스', () => {
          let body;
          before((done) => {
            request(app)
              .post('/login/login')
              .send({ email: 'chmin82@gmail.com', pw: '1111' })
              .expect(200)
              .end((err, res) => {
                body = res.body;
                done();
              });
          });
          it('로그인에 성공하면 토큰을 반환한다', (done) => { // done
            body.should.have.property('token');
            done();
          });
        });
        describe('실패케이스', () => {
          it('없는 정보로 로그인하면 401를 반환한다', (done) => { // done
            request(app)
              .post('/login/login')
              .send({})
              .expect(401)
              .end(done);
          });
          it('없는 사용자로 로그인하면 401를 반환한다', (done) => { // done
            request(app)
              .post('/login/login')
              .send({ email: 'nullid@email.com', pw: '1111' })
              .expect(401)
              .end(done);
          });
        });
      });
      describe('POST /login/signup', () => {
        describe('성공케이스', () => {
          let email = 'test@test.com';
          let name = '테스트유저';
          let pw = '1234';
          let profile = '유저 프로파일';
          before((done) => {
            request(app)
              .post('/login/signup')
              .send({ 
                email: email, 
                name: name,
                pw: pw,
                profile: profile
              })
              .expect(201)
              .end((err, res) => {
                body = res.body;
                done();
              });
          });
          it('회원가입에 성공하면 유저 객체를 반환한다', (done) => { // done
            body.should.have.property('USER_ID');
            done();
          });
          it('생성된 유저 객체를 반환한다', (done) => {
            body.should.have.property('id');
            done();
          });
          it('입력한 name을 반환한다', (done) => {
            body.should.have.property('name', name);
            done();
          });
        });
      })
    })
  )
}

module.exports = loginspec;