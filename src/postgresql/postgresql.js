const { Pool } = require('pg');

const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
}
const pool = new Pool(config)

module.exports = {
  pool
};