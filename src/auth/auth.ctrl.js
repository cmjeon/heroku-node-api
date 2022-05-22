// var { db2Promise } = require('../mysql/mysql');
const { pool } = require('../postgresql/postgresql');
const users = require('../users/users.ctrl')
var bcrypt = require('bcrypt');
var { newToken } = require('../utils/auth.js');
var { getRandomID } = require('../utils/util.js');
const { sendEmail } = require('../utils/emailSender.js');

const index = (req, res) => {
  res.json('Auth!');
}

const login = async (req, res) => {
  const email = req.body.email;
  const pw = req.body.pw;
  if (!pw) return res.status(401).json('Authentication failed. Wrong password.');
  try {
    const executeResult = await pool.query(`SELECT * FROM USER_BASE_INFO WHERE EMAIL = '${email}'`);
    const rows1 = executeResult[0];
    const defs1 = executeResult[1];
    const err1 = executeResult[2];
    if (err1) {
      return res.status(500).json('Internal Server Error');
    }
    const user = rows1[0];
    if (!user) {
      return res.status(401).send('Authentication failed. User not found.');
    }
    const pwMatch = await bcrypt.compare(pw, user.PW);

    if (pwMatch) {
      const token = newToken(user);

      // current logged-in user
      const loggedInUser = {
        userId: user.USER_ID,
        email: user.EMAIL,
        name: user.NAME,
        profile: user.PROFILE
      };

      // return the information including token as JSON
      return res.status(200).json({
        success: true,
        user: loggedInUser,
        message: 'Login Success',
        token: token,
      });
    } else {
      return res.status(401).json('Authentication failed. Wrong password.');
    }
  } catch (err) {
    console.log('### SQL ERROR ###\n', err, '\n### SQL ERROR ###');
    return res.status(500).send('Internal Server Error');
  }
}

const logout = (req, res) => {

}

async function isEmailDupl(email, res) {
  let queryResult1
  try {
    queryResult1 = await pool.query(`SELECT * FROM USER_BASE_INFO WHERE EMAIL = '${email}'`);
    if (queryResult1.rows.user_id) {
      console.log('### 있다?');
      return res.status(409).json({
        success: 'true',
        user: { email: email },
        message: 'duplEmail'
      }).end();
    }
    return queryResult1.rows[0];
  } catch(err) {
    console.log(err);
    throw err;
  }
}

async function hashPassword(pw) {
  const saltRounds = 10;
  return await bcrypt.hash(pw, saltRounds);
}

async function getUserInfo(id, res) {
  console.log('### auth.ctrl:getUserInfo', id);
  let queryResult2
  try {
    queryResult2 = await pool.query(`SELECT USER_ID, EMAIL, NAME, PROFILE FROM USER_BASE_INFO WHERE USER_ID = '${id}'`);
    console.log('### auth.ctrl:getUserInfo:queryResult2', queryResult2);
    const user = queryResult2.rows[0];
    if (!user) return res.status(404).end();
    return user
  } catch(err) {
    console.log(err);
    throw err;
  }
}

async function createUserInfo(body) {
  const id = getRandomID(16);
  const hashedpw = await hashPassword(body.pw);
  const statement = {
    text: 'INSERT INTO USER_BASE_INFO (USER_ID, EMAIL, NAME, PW, PROFILE, CRET_DTIME, CRET_ID, MOD_DTIME, MOD_ID) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING USER_ID',
    values: [id, body.email, body.name, hashedpw, body.profile, new Date(), id, new Date(), id]
  }
  return await pool.query(statement);
}

const signup = async (req, res) => {
  console.log('### auth.ctrl:signup');
  const email = req.body.email;
  const name = req.body.name;
  const pw = req.body.pw;
  const profile = req.body.profile;

  let queryResult1
  try {
    queryResult1 = await isEmailDupl(email, res);
  } catch(err) {
    return res.status(500).send('Internal Server Error');
  }

  let excuteResult;
  try {
    excuteResult = await createUserInfo(req.body)
  } catch(err) {
    console.log(err);
    return res.status(500).json('Internal Server Error');
  }
  console.log('### excuteResult', excuteResult);

  let queryResult2
  try {
    queryResult2 = await getUserInfo(excuteResult.rows[0].user_id, res)
  } catch(err) {
    console.log(err);
    return res.status(500).json('Internal Server Error');
  }
  console.log('### queryResult2', queryResult2);

  return res.status(201).json({
    success: 'true',
    user: queryResult2,
    message: 'Signup Success'
  });

}

const checkDuplEmail = async (req, res) => {
  let success, message, result;
  const email = req.body.email;
  const queryResult1 = await db2Promise.query(`SELECT * FROM USER_BASE_INFO WHERE EMAIL = '${email}'`);
  const rows1 = queryResult1[0];
  const defs1 = queryResult1[1];
  const err1 = queryResult1[2];
  if (err1) {
    return res.status(500).send('Internal Server Error');
  }
  const user = rows1[0];
  if (user) {
    success = 'true';
    message = 'duplEmail';
    result = {
      success: success,
      message: message,
      user: { email: email },
    };
    return res.status(200).json(result);
  }
}

module.exports = {
  index,
  login,
  logout,
  signup,
  checkDuplEmail
}