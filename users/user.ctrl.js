var db = require('../mysql/mysql');

const list = (req, res) => {
  req.query.limit = req.query.limit || 10;
  const limit = parseInt(req.query.limit, 10);
  if (Number.isNaN(limit)) {
    return res.status(400).end();
  }
  db.query(`SELECT USER_ID, EMAIL, NAME, PROFILE FROM USER_BASE_INFO limit ${limit}`, (err, users) => {
    if (err) {
      console.log('err');
      throw err;
    }
    res.json(users);
    res.status(200).end();
  });
}

const show = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).end();
  }
  // if (Number.isNaN(id)) {
  //   return res.status(400).end();
  // }
  // console.log('id', id);
  db.query(`SELECT USER_ID, EMAIL, NAME, PROFILE FROM USER_BASE_INFO WHERE USER_ID = '${id}'`, (err, users) => {
    // console.log('users', users);
    const user = users[0];
    if (!user) return res.status(404).end();
    res.json(user);
  });
}
module.exports = {
  list,
  show
}