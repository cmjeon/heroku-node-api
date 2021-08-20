
const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const db = require('./mysql/mysql');
// var bodyParser = require('body-parser');
const login = require('./login/index');
const users = require('./users/index');
const task = require('./task/index');
const docs = require('./utils/api-doc.js');

const { authenticateUser } = require('./utils/auth');

if (process.env.NODE_ENV === 'debug') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.json('Hello!');
});

app.use('/login', login);
app.use('/users', authenticateUser, users);
app.use('/task', authenticateUser, users);
// app.use('/users', users);
// app.use('/api', docs);
app.use('/api', docs);

module.exports = app;