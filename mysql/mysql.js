var mysql = require('mysql');
var config = require('./config.json')
var db = mysql.createConnection({ config });
db.connect();
module.exports = db;