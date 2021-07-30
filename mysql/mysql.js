
var mysql = require('mysql');
var db = mysql.createConnection({
  host : '192.168.0.2',
  port : '3307',
  user : 'heroku-user',
  password : 'Heroku1234!',
  database : 'heroku-node-api'
});
db.connect();
module.exports = db;