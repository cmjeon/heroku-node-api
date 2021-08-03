var express = require('express');
var morgan = require('morgan');
var app = express();
var db = require('./mysql/mysql');
var bodyParser = require('body-parser');
var user = require('./users/index');

const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use('/users', user);
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
  res.json('Hello!');
  res.status(200).end();
})

app.get('/login', (req, res) => {
  res.json('This is Login');
  res.status(200).end();
})

app.get('/users', function (req, res) {
  if (req.url === '/users') {
    console.log('index.js::index.js:/users')
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
})

module.exports = app;