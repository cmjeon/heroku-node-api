const app = require('../app');
const request = require('supertest');
const should = require('should');
const { getTodayDateWithHypen } = require('../utils/util.js');

const taskspec = () => {
  return (
    describe('TASK', () => {
      // login 처리
      let token;
      let userId;
      let taskId;
      before((done) => {
        request(app)
          .post('/login/login')
          .send({ email: 'test@testDupl.com', pw: '1234' })
          .expect(200)
          .end((err, res) => {
            token = res.body.token;
            userId = res.body.user.userId;
            done();
          });
      });
      describe('GET /tasks', () => {
        describe('성공케이스', () => {
          it(`오늘자(${getTodayDateWithHypen()}) 할일정보를 담은 배열을 반환`, (done) => {
            request(app)
              .get('/tasks')
              .set('Authorization', token)
              .end((err, res) => {
                res.body.should.be.instanceOf(Array);
                for (let task of res.body) {
                  task.TASK_DATE.should.eql(getTodayDateWithHypen());
                }
                done();
              });
          });
          it('날짜에 맞는 할일 배열을 반환', (done) => {
            let taskDate = '2021-08-21';
            request(app)
              .get(`/tasks?taskDate=${taskDate}`)
              .set('Authorization', token)
              .end((err, res) => {
                for (let task of res.body) task.TASK_DATE.should.eql(taskDate);
                done();
              });
          });
        });
        describe('실패케이스', () => {
          it('taskDate 의 포맷이 YYYY-MM-DD 이 아니면 400을 응답한다', (done) => {
            let taskDate = '2021/08/21';
            request(app)
              .get(`/tasks?taskDate=${taskDate}`)
              .set('Authorization', token)
              .expect(400)
              .end(done);
          });
          it('taskDate 의 값이 날짜포맷이지만 날짜가 아니면 400을 응답한다', (done) => {
            let taskDate = '2011-30-50';
            request(app)
              .get(`/tasks?taskDate=${taskDate}`)
              .set('Authorization', token)
              .expect(400)
              .end(done);
          });
          it('taskDate 의 값이 날짜가 아니면 400을 응답한다', (done) => {
            let taskDate = 'something';
            request(app)
              .get(`/tasks?taskDate=${taskDate}`)
              .set('Authorization', token)
              .expect(400)
              .end(done);
          });
        });
      });
      describe('GET /tasks/:taskId', () => {
        describe('성공케이스', () => {
          let taskId = 3;
          it(`taskId 가 ${taskId}인 유저 객체를 반환한다`, (done) => {
            request(app)
              .get(`/tasks/${taskId}`)
              .set('Authorization', token)
              .end((err, res) => {
                res.body.should.have.property('TASK_ID', taskId);
                done();
              });
          });
        });
        describe('실패케이스', () => {
          it('id 가 숫자가 아닐 경우 400으로 응답한다', (done) => {
            request(app)
              .get('/tasks/one')
              .set('Authorization', token)
              .expect(400)
              .end(done);
          });
          it('taskId 로 할일을 찾을 수 없을 경우 404으로 응답한다', (done) => {
            request(app)
              .get('/tasks/1')
              .set('Authorization', token)
              .expect(404)
              .end(done);
          });
        });
      });
      describe('POST /tasks', () => {
        // let token;
        // let body;
        // let userId;
        let taskDate;
        let subject;
        let status;
        describe('성공케이스', () => {
          // let token;
          // let userId;
          // before((done) => {
          //   request(app)
          //     .post('/login/login')
          //     .send({ email: 'test@testDupl.com', pw: '1234' })
          //     .expect(200)
          //     .end((err, res) => {
          //       // console.log('### LOGIN ###');
          //       token = res.body.token;
          //       userId = res.body.user.userId;
          //       // console.log('userId###', userId)
          //       done();
          //     });
          // });
          before((done) => {
            taskDate = getTodayDateWithHypen();
            subject = '할일의 제목';
            status = 'OPEN';
            // console.log('id:', id);
            // console.log('token:', token);
            request(app)
              .post('/tasks')
              .set('Authorization', token)
              .send({
                userId: userId,
                taskDate: taskDate,
                subject: subject,
                status: status
              })
              .expect(201)
              .end((err, res) => {
                body = res.body;
                taskId = body.task.TASK_ID;
                // console.log('body:', body);
                // console.log('taskId', taskId);
                done();
              });
          });
          it('할일등록에 성공하면 할일 객체를 반환한다', (done) => { // done
            // console.log('token222', token);
            // console.log('userId222', userId);
            body.task.should.have.property('TASK_ID');
            done();
          });
        })
      });
      describe('DELETE /tasks/:taskId', () => {
        before((done) => {
          // console.log('taskId:::', taskId);
          done();
          // taskDate = getTodayDateWithHypen();
          // subject = '할일의 제목';
          // status = 'OPEN';
          // // console.log('id:', id);
          // // console.log('token:', token);
          // request(app)
          //   .post('/tasks')
          //   .set('Authorization', token)
          //   .send({
          //     userId: userId,
          //     taskDate: taskDate,
          //     subject: subject,
          //     status: status
          //   })
          //   .expect(201)
          //   .end((err, res) => {
          //     body = res.body;
          //     taskId = body.task.TASK_ID;
          //     console.log('body:', body);
          //     console.log('taskId', taskId);
          //     done();
          //   });
        });
        describe('성공케이스', () => {
          it('204를 응답한다', (done) => {
            // console.log('ajdslfkjaslf', taskId);
            request(app)
              .delete(`/tasks/${taskId}`)
              .set('Authorization', token)
              .expect(204)
              .end(done);
          });
        });
        describe('실패케이스', () => {
          it('taskId 가 숫자가 아닐경우 400으로 응답한다', (done) => {
            request(app)
              .delete('/tasks/one')
              .set('Authorization', token)
              .expect(400)
              .end(done);
          });
        });
      });
      describe('PUT /users/:taskId', () => {
        describe('성공케이스', () => {
          it('변경된 할일객체를 반환한다', (done) => {
            const subject = '변경된 할일 제목';
            request(app)
              .put('/tasks/3')
              .set('Authorization', token)
              .send({
                userId: userId,
                subject: subject
              })
              .end((err, res) => {
                res.body.should.have.property('SUBJECT', subject);
                done();
              })
          });
        });
        describe('실패케이스', () => {
          it('정수가 아닌 taskId 일 경우 400 을 반환한다.', (done) => {
            request(app)
              .put('/tasks/one')
              .set('Authorization', token)
              .send({
                subject: '아무말'
              })
              .expect(400)
              .end(done);
          });
          // it('name 이 없을 경우 400을 반환한다', (done) => {
          //   request(app)
          //     .put('/tasks/1')
          //     .send({})
          //     .expect(400)
          //     .end(done);
          // });
          it('없는 taskId 일 경우 404 을 반환한다', (done) => {
            request(app)
              .put('/tasks/1')
              .set('Authorization', token)
              .send({
                subject: '아무말'
              })
              .expect(404)
              .end(done);
          });
          // it('이름이 중복일 경우 409 을 반환한다', (done) => {
          //   request(app)
          //     .put('/tasks/3')
          //     .send({ name: 'beck' })
          //     .expect(409)
          //     .end(done);
          // });
        })
      });
    })
  )
}


module.exports = taskspec;
