const app = require('../app');
const request = require('supertest');
const should = require('should');
const { getNowTime } = require('../src/utils/util');
const authspec = require('./auth/auth.spec');
const tasksspec = require('./tasks/tasks.spec');
const usersspec = require('./users/users.spec');
const weathersspec = require('./weathers/weathers.spec');
const newsspec = require('./news/news.spec');
const utilsauthspec = require('./utils/auth.spec');

// before(function () {
//    console.log("---");
// });

describe("ROOT", function () {
  describe('GET /', () => {
    describe('성공시', () => {
      it('Hello! 를 반환한다', (done) => { // done
        request(app)
          .get('/')
          .end((err, res) => {
            res.body.should.be.equal('Hello!');
            done();
          });
      });
    });
  });
});
authspec();
usersspec();
tasksspec();
weathersspec();
newsspec();
utilsauthspec();

let nowDate = getNowTime();

after(function () {
  console.log("### Test ends when :", nowDate, "###");
});