const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
require('dotenv').config();

console.log('### env.TEST' , process.env.TEST);
// const db = require('./mysql/mysql');
// var bodyParser = require('body-parser');
const auth = require('./src/auth/index');
const users = require('./src/users/index');
const tasks = require('./src/tasks/index');
const weathers = require('./src/weathers/index');
const news = require('./src/news/index');
const corona = require('./src/corona/index');
const docs = require('./src/docs/api-doc.js');

const { authenticateUser } = require('./src/utils/auth');

if (process.env.NODE_ENV === 'debug') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.json('Hello!');
});

// const ttt = async () => {
//   try {
//     const { pool } = require('./src/postgresql/postgresql');
//     const { rows } = await pool.query('SELECT NOW()');
//     console.log('### pg rows ###', rows)
//   } catch(e) {
//     console.log('### e', e);
//   }
// }
//
// ttt();

app.use('/auth', auth);
app.use('/users', authenticateUser, users);
app.use('/tasks', authenticateUser, tasks);
app.use('/weathers', weathers);
app.use('/news', news);
app.use('/corona', corona);
// app.use('/users', users);
// app.use('/api', docs);
app.use('/docs', docs);

module.exports = app;