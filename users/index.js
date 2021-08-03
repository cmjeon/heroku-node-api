var db = require('../mysql/mysql');// node-api/api/user/index.js
const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  console.log(':::/user/index');
  req.query.limit = req.query.limit || 10;
  db.query(`SELECT * FROM USER_INFO`, (err, users) => {
    if (err) {
      console.log('*****', err);
      throw err;
    }
    console.log(users);
    res.json(users);
    res.status(200).end();
  });
});
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.query(`SELECT * FROM USER_INFO WHERE USER_ID = ${id}`, (err, users) => {
    if (err) {
      console.log('*****', err);
      throw err;
    }
    console.log(users[0]);
    res.json(users[0]);
    res.status(200).end();
  });
})
module.exports = router;