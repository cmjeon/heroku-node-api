var { mysql } = require('../config/config.json')
var mysql1 = require('mysql');
var mysql2 = require('mysql2');
var db = mysql1.createConnection(mysql);
const db2 = mysql2.createPool(mysql);
db.connect();
const db2Promise = db2.promise();

module.exports = {
  db,
  db2Promise
};