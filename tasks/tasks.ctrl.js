var db = require('../mysql/mysql');
// var { getTodayDateWithHypen } = require('../utils/util');
var { getTodayDateWithHypen } = require('../utils/util.js');

const list = (req, res) => {
  // console.log(req.headers);
  if (!req.headers.userid) {
    return res.status(403).end();
  }
  let taskOwnUserId = req.headers.userid;
  let todayDate = getTodayDateWithHypen();
  if (req.query.taskDate) {
    var dateReg = /^(19|20|21)\d{2}[-](0[1-9]|1[0-2])[-](0[1-9]|1\d|2\d|3[01])$/;
    if (!req.query.taskDate.match(dateReg)) return res.status(400).end();
  }
  const taskDate = req.query.taskDate || todayDate;
  // console.log('taskOwnUserId:', taskOwnUserId);
  // console.log('taskDate:', taskDate);
  db.query(`SELECT TASK_ID, TASK_DATE, DISP_SEQ, SUBJECT, TASK_DESC, STATUS, DUE_DATE, ALARM_DTIME, CRET_DTIME, CRET_ID, MOD_DTIME, MOD_ID FROM TASK_BASE_INFO WHERE TASK_OWN_USER_ID = '${taskOwnUserId}' AND TASK_DATE='${taskDate}'`, (err, tasks) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    res.json(tasks);
    res.status(200).end();
  });
}

const show = (req, res) => {
  if (!req.headers.userid) {
    return res.status(403).end();
  }
  let taskOwnUserId = req.headers.userid;
  const taskId = parseInt(req.params.taskId);
  // console.log('taskId:', taskId);
  if (Number.isNaN(taskId)) {
    return res.status(400).end();
  }
  db.query(`SELECT TASK_ID, TASK_DATE, DISP_SEQ, SUBJECT, TASK_DESC, STATUS, DUE_DATE, ALARM_DTIME, CRET_DTIME, CRET_ID, MOD_DTIME, MOD_ID FROM TASK_BASE_INFO WHERE TASK_OWN_USER_ID = '${taskOwnUserId}' AND TASK_ID='${taskId}'`, (err, tasks) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    let task = tasks[0];
    if (!task) return res.status(404).end();
    res.json(task);
  });
}

const destroy = (req, res) => {
  if (!req.headers.userid) {
    return res.status(403).end();
  }
  let taskOwnUserId = req.headers.userid;
  const taskId = parseInt(req.params.taskId);
  if (Number.isNaN(taskId)) {
    return res.status(400).end();
  }
  db.query(`DELETE FROM TASK_BASE_INFO WHERE TASK_OWN_USER_ID = '${taskOwnUserId}' AND TASK_ID='${taskId}'`, (err, result) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    // console.log(result);
    res.status(204).end();
  });
}

const create = (req, res) => {
  if (!req.headers.userid) {
    return res.status(403).end();
  }
  const taskOwnUserId = req.headers.userid;
  const taskDate = req.body.taskDate;
  let dispSeq;
  const subject = req.body.subject;
  const taskDesc = req.body.taskDesc;
  const status = req.body.status;
  const dueDate = req.body.dueDate;
  const alarmDtime = req.body.alarmDtime;
  // console.log('alarmDtime')
  if (!taskOwnUserId || !taskDate || !subject || !status) {
    return res.status(400).end();
  }
  db.query(`SELECT MAX(DISP_SEQ) + 1 AS DISP_SEQ FROM TASK_BASE_INFO WHERE TASK_OWN_USER_ID = '${taskOwnUserId}' AND TASK_DATE = '${taskDate}'`, (err, result) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    dispSeq = result[0].DISP_SEQ;
    db.query('INSERT INTO TASK_BASE_INFO (TASK_ID, TASK_DATE, DISP_SEQ, SUBJECT, TASK_DESC, STATUS, DUE_DATE, ALARM_DTIME, CRET_DTIME, CRET_ID, MOD_DTIME, MOD_ID, TASK_OWN_USER_ID) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [null, taskDate, dispSeq, subject, taskDesc, status, dueDate, alarmDtime, new Date(), taskOwnUserId, new Date(), taskOwnUserId, taskOwnUserId], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json('Internal Server Error');
        }
        db.query(`SELECT TASK_ID, TASK_DATE, DISP_SEQ, SUBJECT, TASK_DESC, STATUS, DUE_DATE, ALARM_DTIME, CRET_DTIME, CRET_ID, MOD_DTIME, MOD_ID, TASK_OWN_USER_ID FROM TASK_BASE_INFO WHERE TASK_ID = '${result.insertId}'`, (err, tasks) => {
          if (err) {
            console.log(err);
            return res.status(500).json('Internal Server Error');
          }
          const task = tasks[0];
          if (!task) return res.status(404).end();
          res.status(201).json({
            success: 'true',
            task: task,
            message: 'Success'
          });
        });
      });
  });
}

const update = (req, res) => {
  let taskOwnUserId = req.body.userId;
  let taskId = parseInt(req.params.taskId);
  // console.log('taskId:', taskId);
  if (Number.isNaN(taskId)) {
    return res.status(400).end();
  }
  let taskDate = req.body.taskDate;
  let dispSeq = req.body.dispSeq;
  let subject = req.body.subject;
  // console.log('subject', subject);
  let taskDesc = req.body.taskDesc;
  let status = req.body.status;
  let dueDate = req.body.dueDate;
  let alarmDtime = req.body.alarmDtime;
  db.query(`SELECT TASK_ID, TASK_DATE, DISP_SEQ, SUBJECT, TASK_DESC, STATUS, DUE_DATE, ALARM_DTIME, CRET_DTIME, CRET_ID, MOD_DTIME, MOD_ID FROM TASK_BASE_INFO WHERE TASK_ID='${taskId}'`, (err, tasks) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    let task = tasks[0];
    if (!task) return res.status(404).end();
    // console.log('task', task);
    if (taskDate) task.TASK_DATE = taskDate;
    if (dispSeq) task.DISP_SEQ = dispSeq;
    if (subject) task.SUBJECT = subject;
    if (taskDesc) task.TASK_DESC = taskDesc;
    if (status) task.STATUS = status;
    if (dueDate) task.DUE_DATE = dueDate;
    if (alarmDtime) task.ALARM_DTIME = alarmDtime;
    // console.log(subject);
    db.query(`UPDATE TASK_BASE_INFO SET TASK_DATE=?, DISP_SEQ=?, SUBJECT=?, TASK_DESC=?, STATUS=?, DUE_DATE=?, ALARM_DTIME=?, MOD_DTIME=?, MOD_ID=? WHERE TASK_ID = '${taskId}'`,
      [task.TASK_DATE, task.dispSeq, task.subject, task.taskDesc, task.status, task.dueDate, task.alarmDtime, new Date(), taskOwnUserId], (err, result) => {
        // console.log('result:::', result);
        if (err) {
          return res.status(500).send('Internal Server Error');
        }
        // console.log('task', task);
        res.json(task);
      });
  });
}

module.exports = {
  list,
  show,
  destroy,
  create,
  update
}