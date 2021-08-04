const app = require('./app');
const request = require('supertest');
const should = require('should');
const userspec = require('./users/user.spec');
const loginspec = require('./login/login.spec');

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

function nowDate() {
  var today = new Date();
  var hh = String(today.getHours()).padStart(2, '0')+':';
  var mm = String(today.getMinutes()).padStart(2, '0')+':';
  var ss = String(today.getSeconds()).padStart(2, '0')+':';
  var mills = String(today.getMilliseconds()).padStart(3, '0');
  
  today = hh+mm+ss+mills
  return today;
}

after(function () {
  console.log("Test ends when :", nowDate());
});