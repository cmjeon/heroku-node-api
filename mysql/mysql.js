var config = require('./config.json')
var mysql = require('mysql');
var mysql2 = require('mysql2');
var db = mysql.createConnection(config);
const db2 = mysql2.createPool(config);
db.connect();
const db2Promise = db2.promise();

module.exports = {
  db,
  db2Promise
};