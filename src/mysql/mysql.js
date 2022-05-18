const config = require('../config/config.json');
const mysql1 = require('mysql');
const mysql2 = require('mysql2');
const db = mysql1.createConnection(config);
const [errConn, db2] = mysql2.createPool(config);
if(errConn) {
  console.log('### errConn', errConn);
};
db.connect();
const db2Promise = db2.promise();

module.exports = {
  db,
  db2Promise
};