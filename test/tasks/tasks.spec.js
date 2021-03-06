const app = require('../../app');
const request = require('supertest');
const { getTodayDateWithHypen } = require('../../src/utils/util.js');

const taskspec = () => {
  return (
    describe('TASK', () => {
      // login 처리
      let token;
      let userId;
      // let taskId;
      before(async () => {
        const res = await request(app)
          .post('/auth/login')
          .send({ email: 'test@testDupl.com', pw: '1234' })
          .expect(200);
        token = res.body.token;
        userId = res.body.user.userId;
      });
      describe('POST /tasks', () => {
        describe('성공케이스', () => {
          let taskDate;
          let subject;
          let status;
          let taskId;
          let body;
          before(async () => {
            taskDate = getTodayDateWithHypen();
            subject = '할일의 제목';
            status = 'OPEN';
            const res = await request(app)
              .post('/tasks')
              .set({
                'authorization': token,
                'userid': userId
              })
              .send({
                taskDate: taskDate,
                subject: subject,
                status: status
              })
              .expect(201);
            body = res.body;
            taskId = body.task.task_id;
          });
          it('할일등록에 성공하면 할일 객체를 반환한다', async () => { // done
            body.task.should.have.property('task_id');
            body.task.task_id.should.be.equal(taskId)
            body.task.should.have.property('subject', subject);
          });
        })
      });
      describe('GET /tasks', () => {
        describe('성공케이스', () => {
          it(`오늘자(${getTodayDateWithHypen()}) 할일정보를 담은 배열을 반환`, (done) => {
            request(app)
              .get('/tasks')
              .set({
                'authorization': token,
                'userid': userId
              })
              .end((err, res) => {
                res.body.should.be.instanceOf(Array);
                for (let task of res.body) {
                  task.task_date.should.eql(getTodayDateWithHypen());
                }
                done();
              });
          });
          it('날짜에 맞는 할일 배열을 반환', (done) => {
            let taskDate = '2021-08-21';
            request(app)
              .get(`/tasks?taskDate=${taskDate}`)
              .set({
                'authorization': token,
                'userid': userId
              })
              .end((err, res) => {
                // console.log('###', res)
                for (let task of res.body) task.task_date.should.eql(taskDate);
                done();
              });
          });
        });
        describe('실패케이스', () => {
          it('taskDate 의 포맷이 YYYY-MM-DD 이 아니면 400을 응답한다', (done) => {
            let taskDate = '2021/08/21';
            request(app)
              .get(`/tasks?taskDate=${taskDate}`)
              .set({
                'authorization': token,
                'userid': userId
              })
              .expect(400)
              .end(done);
          });
          it('taskDate 의 값이 날짜포맷이지만 날짜가 아니면 400을 응답한다', (done) => {
            let taskDate = '2011-30-50';
            request(app)
              .get(`/tasks?taskDate=${taskDate}`)
              .set({
                'authorization': token,
                'userid': userId
              })
              .expect(400)
              .end(done);
          });
          it('taskDate 의 값이 날짜가 아니면 400을 응답한다', (done) => {
            let taskDate = 'something';
            request(app)
              .get(`/tasks?taskDate=${taskDate}`)
              .set({
                'authorization': token,
                'userid': userId
              })
              .expect(400)
              .end(done);
          });
        });
      });
      describe('GET /tasks/:taskId', () => {
        describe('성공케이스', () => {
          let taskId = 1;
          it(`taskId 가 ${taskId}인 할일 객체를 반환한다`, (done) => {
            request(app)
              .get(`/tasks/${taskId}`)
              .set({
                'authorization': token,
                'userid': userId
              })
              .end((err, res) => {
                res.body.should.have.property('task_id', taskId);
                done();
              });
          });
        });
        describe('실패케이스', () => {
          it('id 가 숫자가 아닐 경우 400으로 응답한다', (done) => {
            request(app)
              .get('/tasks/one')
              .set({
                'authorization': token,
                'userid': userId
              })
              .expect(400)
              .end(done);
          });
          it('taskId 로 할일을 찾을 수 없을 경우 404으로 응답한다', (done) => {
            request(app)
              .get('/tasks/2')
              .set({
                'authorization': token,
                'userid': userId
              })
              .expect(404)
              .end(done);
          });
        });
      });
      describe('DELETE /tasks/:taskId', () => {
        describe('성공케이스', () => {
          let taskDate;
          let subject;
          let status;
          let taskId;
          before(async () => {
            taskDate = getTodayDateWithHypen();
            subject = '할일의 제목';
            status = 'OPEN';
            const res = await request(app)
              .post('/tasks')
              .set({
                'authorization': token,
                'userid': userId
              })
              .send({
                taskDate: taskDate,
                subject: subject,
                status: status
              })
              .expect(201);
            body = res.body;
            taskId = body.task.task_id;
            // console.log('BEFORE END')
          });
          it('204를 응답한다', (done) => {
            // console.log('ajdslfkjaslf', taskId);
            request(app)
              .delete(`/tasks/${taskId}`)
              .set({
                'authorization': token,
                'userid': userId
              })
              .expect(204)
              .end(done);
          });
        });
        describe('실패케이스', () => {
          it('taskId 가 숫자가 아닐경우 400으로 응답한다', (done) => {
            request(app)
              .delete('/tasks/one')
              .set({
                'authorization': token,
                'userid': userId
              })
              .expect(400)
              .end(done);
          });
        });
      });
      describe('PATCH /tasks/:taskId', () => {
        describe('성공케이스', () => {
          let body;
          const taskId = 1;
          const subject = '변경된 할일 제목';
          const dispSeq = 1;
          const taskDate = '2021-08-22';
          const taskDesc = '변경된 할일의 설명';
          const status = 'COMPLETED';
          const dueDtime = '2021-08-31 09:00:00';
          const alarmDtime = '2021-08-30 10:00:00';
          before((done) => {
            request(app)
              .patch(`/tasks/${taskId}`)
              .set({
                'authorization': token,
                'userid': userId
              })
              .send({
                userId: userId,
                subject: subject,
                taskDate: taskDate,
                dispSeq: dispSeq,
                taskDesc: taskDesc,
                status: status,
                dueDtime: dueDtime,
                alarmDtime: alarmDtime
              })
              .end((err, res) => {
                body = res.body;
                done();
              });
          });
          it('제목을 바꾸면 변경된 할일객체를 반환한다', (done) => {
            body.task.should.have.property('subject', subject);
            done();
          });
          it('할일일자, 설명, 상태, 마감일, 알림일시를 변경하면 변경된 할일객체를 반환한다.', (done) => {
            body.task.should.have.property('task_date', taskDate);
            body.task.should.have.property('task_desc', taskDesc);
            body.task.should.have.property('status', status);
            // body.task.should.have.property('due_dtime', dueDtime);
            // body.task.should.have.property('alarm_dtime', alarmDtime);
            done();
          })
        });
        describe('실패케이스', () => {
          it('정수가 아닌 taskId 일 경우 400 을 반환한다.', (done) => {
            request(app)
              .patch('/tasks/one')
              .set({
                'authorization': token,
                'userid': userId
              })
              .send({
                subject: '아무말'
              })
              .expect(400)
              .end(done);
          });
          it('authorization 이 없을 경우 400을 반환한다', (done) => {
            request(app)
              .patch('/tasks/${taskId}')
              .send({})
              .expect(401)
              .end(done);
          });
          it('없는 taskId 일 경우 404 을 반환한다', (done) => {
            request(app)
              .patch('/tasks/2')
              .set({
                'authorization': token,
                'userid': userId
              })
              .send({
                subject: '아무말'
              })
              .expect(404)
              .end(done);
          });
        })
      });
    })
  )
}


module.exports = taskspec;
