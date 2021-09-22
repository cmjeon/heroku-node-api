const index = (req, res) => {
  res.json('Weather!');
}
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
  db.query(`SELECT TASK_ID, TASK_DATE, DISP_SEQ, SUBJECT, TASK_DESC, STATUS, DUE_DTIME, ALARM_DTIME, CRET_DTIME, CRET_ID, MOD_DTIME, MOD_ID FROM TASK_BASE_INFO WHERE TASK_OWN_USER_ID = '${taskOwnUserId}' AND TASK_DATE='${taskDate}'`, (err, tasks) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    res.json(tasks);
    res.status(200).end();
  });
}

module.exports = {
  index,
}