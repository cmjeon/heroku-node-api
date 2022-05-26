const { pool } = require('../postgresql/postgresql');
// var { getTodayDateWithHypen } = require('../utils/util');
var { getTodayDateWithHypen } = require('../utils/util.js');

const list = async (req, res) => {
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
  try {
    const resultt = await pool.query(`SELECT TASK_ID, TASK_DATE, DISP_SEQ, SUBJECT, TASK_DESC, STATUS, DUE_DTIME, ALARM_DTIME, CRET_DTIME, CRET_ID, MOD_DTIME, MOD_ID FROM TASK_BASE_INFO WHERE TASK_OWN_USER_ID = '${taskOwnUserId}' AND TASK_DATE='${taskDate}'`);
    console.log('###resultt', resultt)
    if (err1) {
      return res.status(500).send('Internal Server Error');
    }
    res.json(rows1);
    return res.status(200).end();
  } catch (err) {
    console.log('### SQL ERROR ###\n', err, '\n### SQL ERROR ###');
    return res.status(500).send('Internal Server Error');
  }
}

const show = async (req, res) => {
  if (!req.headers.userid) {
    return res.status(403).end();
  }
  let taskOwnUserId = req.headers.userid;
  const taskId = parseInt(req.params.taskId);
  // console.log('taskId:', taskId);
  if (Number.isNaN(taskId)) {
    return res.status(400).end();
  }
  try {
    const [rows1, defs1, err1] = await pool.query(`SELECT TASK_ID, TASK_DATE, DISP_SEQ, SUBJECT, TASK_DESC, STATUS, DUE_DTIME, ALARM_DTIME, CRET_DTIME, CRET_ID, MOD_DTIME, MOD_ID FROM TASK_BASE_INFO WHERE TASK_OWN_USER_ID = '${taskOwnUserId}' AND TASK_ID='${taskId}'`);
    if (err1) {
      return res.status(500).send('Internal Server Error');
    }
    let task = rows1[0];
    if (!task) return res.status(404).end();
    res.json(task);
    return res.status(200).end();
  } catch (err) {
    console.log('### SQL ERROR ###\n', err, '\n### SQL ERROR ###');
    return res.status(500).send('Internal Server Error');
  }
}

const destroy = async (req, res) => {
  if (!req.headers.userid) {
    return res.status(403).end();
  }
  let taskOwnUserId = req.headers.userid;
  const taskId = parseInt(req.params.taskId);
  if (Number.isNaN(taskId)) {
    return res.status(400).end();
  }

  try {
    const [rows1, defs1, err1] = await pool.query(`DELETE FROM TASK_BASE_INFO WHERE TASK_OWN_USER_ID = '${taskOwnUserId}' AND TASK_ID='${taskId}'`);
    if (err1) {
      return res.status(500).send('Internal Server Error');
    }
    return res.status(204).end();
  } catch (err) {
    console.log('### SQL ERROR ###\n', err, '\n### SQL ERROR ###');
    return res.status(500).send('Internal Server Error');
  }
}

const create = async (req, res) => {
  if (!req.headers.userid) {
    return res.status(403).end();
  }
  const taskOwnUserId = req.headers.userid;
  const taskDate = req.body.taskDate;
  let dispSeq;
  const subject = req.body.subject;
  const taskDesc = req.body.taskDesc ? req.body.taskDesc : null;
  const status = req.body.status ? req.body.status : '';
  const dueDtime = req.body.dueDtime ? req.body.dueDtime : null;
  const alarmDtime = req.body.alarmDtime ? req.body.dueDtime : null;
  if (!taskOwnUserId || !taskDate || !subject || !status) {
    return res.status(400).end();
  }

  try {
    const [rows1, defs1, err1] = await db2Promise.query(`SELECT IFNULL(MAX(DISP_SEQ) + 1, 1) AS DISP_SEQ FROM TASK_BASE_INFO WHERE TASK_OWN_USER_ID = '${taskOwnUserId}' AND TASK_DATE = '${taskDate}'`);
    if (err1) {
      return res.status(500).send('Internal Server Error');
    }
    dispSeq = rows1[0].DISP_SEQ;
    const excuteResult2 = await db2Promise.execute('INSERT INTO TASK_BASE_INFO (TASK_DATE, DISP_SEQ, SUBJECT, TASK_DESC, STATUS, DUE_DTIME, ALARM_DTIME, CRET_DTIME, CRET_ID, MOD_DTIME, MOD_ID, TASK_OWN_USER_ID) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [taskDate, dispSeq, subject, taskDesc, status, dueDtime, alarmDtime, new Date(), taskOwnUserId, new Date(), taskOwnUserId, taskOwnUserId]);
    const rows2 = excuteResult2[0];
    const err2 = excuteResult2[1];
    const insertId = excuteResult2[0].insertId;
    if (err2) {
      return res.status(500).json('Internal Server Error');
    }

    const queryResult2 = await db2Promise.query(`SELECT TASK_ID, TASK_DATE, DISP_SEQ, SUBJECT, TASK_DESC, STATUS, DUE_DTIME, ALARM_DTIME, CRET_DTIME, CRET_ID, MOD_DTIME, MOD_ID, TASK_OWN_USER_ID FROM TASK_BASE_INFO WHERE TASK_ID = '${insertId}'`);
    const tasks3 = queryResult2[0];
    const defs3 = queryResult2[1];
    const err3 = queryResult2[2];
    if (err3) {
      return res.status(500).json('Internal Server Error');
    }
    const task = tasks3[0];
    if (!task) return res.status(404).end();

    return res.status(201).json({
      success: 'true',
      task: task,
      message: 'Success'
    });
  } catch (err) {
    console.log('### SQL ERROR ###\n', err, '\n### SQL ERROR ###');
    return res.status(500).json('Internal Server Error');
  }
}

const update = async (req, res) => {
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
  let dueDtime = req.body.dueDtime;
  let alarmDtime = req.body.alarmDtime;

  try {
    const queryResult1 = await pool.query(`SELECT TASK_ID, TASK_DATE, DISP_SEQ, SUBJECT, TASK_DESC, STATUS, DUE_DTIME, ALARM_DTIME, CRET_DTIME, CRET_ID, MOD_DTIME, MOD_ID FROM TASK_BASE_INFO WHERE TASK_ID='${taskId}'`);
    const tasks1 = queryResult1[0];
    const defs1 = queryResult1[1];
    const err1 = queryResult1[2];

    if (err1) {
      return res.status(500).send('Internal Server Error');
    }
    let task = tasks1[0];
    if (!task) return res.status(404).end();
    // console.log('TASK!!!', task);
    if (taskDate) task.TASK_DATE = taskDate;
    if (dispSeq) task.DISP_SEQ = dispSeq;
    if (subject) task.SUBJECT = subject;
    if (taskDesc) task.TASK_DESC = taskDesc;
    if (status) task.STATUS = status;
    if (dueDtime) task.DUE_DTIME = dueDtime;
    if (alarmDtime) task.ALARM_DTIME = alarmDtime;
    // console.log(subject);
    const excuteResult1 = await pool.execute(`UPDATE TASK_BASE_INFO SET TASK_DATE=?, DISP_SEQ=?, SUBJECT=?, TASK_DESC=?, STATUS=?, DUE_DTIME=?, ALARM_DTIME=?, MOD_DTIME=?, MOD_ID=? WHERE TASK_ID = '${taskId}'`,
      [task.TASK_DATE, task.DISP_SEQ, task.SUBJECT, task.TASK_DESC, task.STATUS, task.DUE_DTIME, task.ALARM_DTIME, new Date(), taskOwnUserId]);

    const result2 = excuteResult1[0];
    const err2 = excuteResult1[1];
    if (err2) {
      return res.status(500).send('Internal Server Error');
    }
    // console.log('modified task', task);
    res.json(task);
    return res.status(200).end();
  } catch (err) {
    console.log('### SQL ERROR ###\n', err, '\n### SQL ERROR ###');
    return res.status(500).json('Internal Server Error');
  }
}

module.exports = {
  list,
  show,
  destroy,
  create,
  update
}