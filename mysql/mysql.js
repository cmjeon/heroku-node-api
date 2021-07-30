
var mysql = require('mysql');
var db = mysql.createConnection({
  host : 'ymjm.iptime.org',
  port : '5307',
  user : 'heroku-user',
  password : 'Heroku1234!',
  database : 'heroku-node-api'
});
db.connect();
module.exports = db;