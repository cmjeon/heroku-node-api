var express = require('express');
var morgan = require('morgan');
var app = express();
var db = require('./mysql/mysql');
const port = process.env.PORT||3000;

var users = [
  {id: 1, name: 'alice'},
  {id: 2, name: 'beck'},
  {id: 3, name: 'chris'},
];

app.use(morgan('dev'));

app.get('/', function(req, res) {
  res.json('Hello! You can use /users');
  res.status(200).end();
})

app.get('/login', (req, res) => {
  res.json('This is Login');
  res.status(200).end();
})

app.get('/users', function(req, res) {
  req.query.limit = req.query.limit || 10;
  console.log('***receive param***', req.query.limit);
  db.query(`SELECT * FROM USER_INFO`, (err, users) => {
    if(err) {
      console.log('*****',err);
      throw err;
    }
    res.json(users);
    res.status(200).end();
  });
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`);
})

module.exports = app;