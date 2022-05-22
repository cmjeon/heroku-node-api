const { Pool } = require('pg');

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
}
const pool = new Pool(config)
// pool.connect(err => {
//   if (err) {
//     console.log('Failed to connect db ' + err)
//   } else {
//     console.log('Connect to db done!')
//   }
// })

module.exports = {
  pool
};