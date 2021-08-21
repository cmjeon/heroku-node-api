const app = require('./app');
const request = require('supertest');
const should = require('should');
const userspec = require('./users/user.spec');
const loginspec = require('./login/login.spec');
const taskspec = require('./task/task.spec');
const { getNowTime } = require('./utils/util');

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
userspec();
loginspec();
taskspec();

let nowDate = getNowTime();

after(function () {
  console.log("###### Test ends when :", nowDate, "######");
});