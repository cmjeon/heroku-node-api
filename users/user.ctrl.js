var db = require('../mysql/mysql');

const index = (req, res) => {
  req.query.limit = req.query.limit || 10;
  const limit = parseInt(req.query.limit, 10);
  if (Number.isNaN(limit)) {
    return res.status(400).end();
  }
  db.query(`SELECT USER_ID, EMAIL, NAME, PROFILE FROM USER_INFO limit ${limit}`, (err, users) => {
    if (err) {
      console.log('err');
      throw err;
    }
    res.json(users);
    res.status(200).end();
  });
}

const show = (req, res) => {
  const id = parseInt(req.params.id, '10');
  // if (Number.isNaN(id)) {
  //   return res.status(400).end();
  // }
  db.query(`SELECT USER_ID, EMAIL, NAME, PROFILE FROM USER_INFO WHERE USER_ID = '${id}'`, (err, users) => {
    const user = users[0];
    if (!user) return res.status(404).end();
    res.json(user);
  });
}
module.exports = {
  index,
  show
}