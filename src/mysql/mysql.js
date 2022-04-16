const config = require('../config/config.json');
const mysql1 = require('mysql');
const mysql2 = require('mysql2');
let mysqlConnection, db2Promise;

mysqlConnection = mysql1.createConnection(config);
mysqlConnection.connect(function(err) {              // The server is either down
  if(err) {                                     // or restarting (takes a while sometimes).
    console.log('DB Connection ERROR1:', err);
  }
});
const mysql2pool = mysql2.createPool(config);
db2Promise = mysql2pool.promise(function(err) {
  if(err) {                                     // or restarting (takes a while sometimes).
    console.log('DB Connection ERROR2:', err);
  }
});


module.exports = {
  db: mysqlConnection,
  db2Promise
};