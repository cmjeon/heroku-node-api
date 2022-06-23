const { Pool } = require('pg');

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
}
const pool = new Pool(config)

module.exports = {
  pool
};