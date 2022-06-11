const { pool } = require('../postgresql/postgresql');
var { db2Promise } = require('../mysql/mysql');

const list = (req, res) => {
  try {
    req.query.limit = req.query.limit || 10;
    const limit = parseInt(req.query.limit, 10);
    if (Number.isNaN(limit)) {
      return res.status(400).end();
    }
    const {rows} = db2Promise.query(`SELECT USER_ID, EMAIL, NAME, PROFILE FROM USER_BASE_INFO limit ${limit}`);
    const users = rows;
    res.json(users);
    res.status(200).end();
  } catch (err) {
    return res.status(500).send('Internal Server Error');
  }
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
  const [rows1, defs1, err1] = db2Promise.query(`SELECT USER_ID, EMAIL, NAME, PROFILE FROM USER_BASE_INFO WHERE USER_ID = '${id}'`);
  // console.log('users', users);
  if (err1) {
    console.log('err1');
    throw err1;
  }
  const user = rows1[0];
  if (!user) return res.status(404).end();
  res.json(user);
}

const destroy = (req, res) => {
  const id = req.params.id;
  const [rows1, defs1, err1] = db2Promise.query(`DELETE FROM USER_BASE_INFO WHERE USER_ID = '${id}'`)
  // console.log('users', users);
  if (err1) {
    console.log('err1');
    throw err1;
  }
  res.status(204).end();
}

module.exports = {
  list,
  show,
  destroy
}