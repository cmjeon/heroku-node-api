const jwt = require('jsonwebtoken')
const { SECRET_KEY, EXPIRATION_DATE, APPKEY } = process.env
const { pool } = require('../postgresql/postgresql')

// modules
// import UserModel from '../models/UserModel.js';

const newToken = (user) => {
  const payload = {
    email: user.email,
    userid: user.user_id,
  }
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: EXPIRATION_DATE,
  })
}

const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    // console.log('### verifyToken', token, SECRET_KEY)
    jwt.verify(token, SECRET_KEY, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

// middleware
const authenticateUser = async (req, res, next) => {
  // if (!req.headers.appkey || req.headers.appkey !== APPKEY) {
  //   return res.status(401).json({ message: 'appkey must be included or is wrong' })
  // }

  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'token must be included' })
  }

  const token = req.headers.authorization
  let payload
  try {
    payload = await verifyToken(token)
  } catch (e) {
    return res.status(401).json({ message: 'token is invalid' })
  }
  const { rows } = await pool.query(`SELECT * FROM USER_BASE_INFO WHERE USER_ID = '${payload.userid}'`)
  const user = rows[0]

  if (!user) {
    return res.status(401).json({ message: 'user is not found' })
  }

  req.user = user
  next()
}
module.exports = {
  newToken,
  verifyToken,
  authenticateUser,
}
