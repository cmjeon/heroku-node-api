require('dotenv').config()

const { host, port, USER, PASSWORD, DATABASE } = process.env
const mysql1 = require('mysql')
const mysql2 = require('mysql2')

const db = mysql1.createConnection({
  host: host,
  port: port,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  dateStrings: 'date',
})

const db2 = mysql2.createPool({
  host: host,
  port: port,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  dateStrings: 'date',
})

db.connect()
const db2Promise = db2.promise()

module.exports = {
  db,
  db2Promise,
}
