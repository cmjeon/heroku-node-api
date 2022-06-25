const app = require('../../app');
const request = require('supertest');
const should = require('should');

const usersspec = () => {
  return (
    describe('USERS', () => {
      // login 처리
      let token;
      let userId;
      before(async() => {
        const res = await request(app)
          .post('/auth/login')
          .send({ email: 'test@testDupl.com', pw: '1234' })
          .expect(200);
        token = res.body.token;
        userId = res.body.user.userId;
      });
      describe('GET /users', () => {
        describe('성공케이스', () => {
          it('유저정보를 담은 배열을 반환', (done) => {
            request(app)
              .get('/users')
              .set({
                'authorization': token,
                'userid': userId
              })
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
              .set({
                'authorization': token,
                'userid': userId
              })
              .expect(400)
              .end(done);
          });
        });
      });
      describe('GET /users/:id', () => {
        describe('성공케이스', () => {
          const id = 'UOLWN5IFYGHKUGHK'
          it(`id가 ${id} 인 유저 객체를 반환한다`, (done) => {
            request(app)
              .get(`/users/${id}`)
              .set({
                'authorization': token,
                'userid': userId
              })
              .end((err, res) => {
                res.body.should.have.property('user_id', id);
                done();
              });
          });
        });
      });
      describe.only('DELETE /users/:id', () => {
        describe.only('성공케이스', () => {
          let body;
          let email = getRandomEmailForTest();
          let name = '삭제테스트유저';
          let pw = '1234';
          let profile = '유저 프로파일';
          let id;
          before(async () => {
            const res = await request(app)
              .post('/auth/signup')
              .send({
                email: email,
                name: name,
                pw: pw,
                profile: profile
              })
              .expect(201);
            id = res.body.user.user_id;
          });
          it('204를 응답한다', (done) => {
            request(app)
              .delete(`/users/${id}`)
              .set({
                'authorization': token,
                'userid': userId
              })
              .expect(204)
              .end(done);
          });
        });
        describe('실패케이스', () => {
          it('userId 가 숫자가 아닐경우 400으로 응답한다', (done) => {
            request(app)
              .delete('/users/one')
              .set({
                'authorization': token,
                'userid': userId
              })
              .expect(400)
              .end(done);
          });
        });
      });
    })
  )
}

const getRandomEmailForTest = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let emailString = '';
  for (let i = 0; i < 10; i++) {
    emailString += chars[Math.floor(Math.random() * chars.length)];
  }
  return emailString + '@test.com';
}

module.exports = usersspec;