// json related
// import jwt from 'jsonwebtoken';
const jwt = require('jsonwebtoken')
// import { SECRET_KEY, EXPIRATION_DATE } from '../config';
const { SECRET_KEY, EXPIRATION_DATE } = process.env
// const { db2Promise } = require('../mysql/mysql')
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
    console.log('### verifyToken', token, SECRET_KEY)
    jwt.verify(token, SECRET_KEY, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

// middleware
const authenticateUser = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'token must be included' })
  }

  const token = req.headers.authorization
  // console.log('token::::', token);
  let payload
  try {
    payload = await verifyToken(token)
  } catch (e) {
    return res.status(401).json({ message: 'token is invalid' })
  }
  console.log('payload', payload)
  const { rows } = await pool.query(`SELECT * FROM USER_BASE_INFO WHERE USER_ID = '${payload.userid}'`)
  const user = rows[0]
  console.log('user ### ', user)
  // const user = await UserModel.findById(payload._id)
  //   .select('-password')
  //   .lean()
  //   .exec();

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
