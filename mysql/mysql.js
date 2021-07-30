var mysql = require('mysql');
var db = mysql.createConnection({

});
db.connect();
module.exports = db;