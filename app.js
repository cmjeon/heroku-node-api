
const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const db = require('./mysql/mysql');
// var bodyParser = require('body-parser');
const auth = require('./auth/index');
const users = require('./users/index');
const tasks = require('./tasks/index');
const docs = require('./docs/api-doc.js');

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

app.use('/auth', auth);
app.use('/users', authenticateUser, users);
app.use('/tasks', authenticateUser, tasks);
// app.use('/users', users);
// app.use('/api', docs);
app.use('/docs', docs);

module.exports = app;