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
  console.log('### login')
  const email = req.body.email;
  const pw = req.body.pw;
  if (!pw) return res.status(401).json('Authentication failed. Wrong password.');
  try {
    const { rows } = await pool.query(`SELECT * FROM USER_BASE_INFO WHERE EMAIL = '${email}'`);
    if (!rows[0]) {
      return res.status(500).json('Internal Server Error');
    }
    const user = rows[0];
    console.log('### user', user)
    if (!user) {
      return res.status(401).send('Authentication failed. User not found.');
    }
    const pwMatch = await bcrypt.compare(pw, user.pw);

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

const signup = async (req, res) => {
  try {
    const isEmailDupl = await getIsEmailDupl(req.body.email, res)
    if(isEmailDupl) {
      return res.status(409).json({
        success: 'Conflict',
        user: { email: req.body.email },
        message: 'duplEmail'
      }).end();
    }
    const userId = await createUserInfo(req.body)
    const user = await getUserInfo(userId, res)
    return res.status(201).json({
      success: 'true',
      user: user,
      message: 'Signup Success'
    });
  } catch(err) {
    console.log(err);
    return res.status(500).json('Internal Server Error');
  }
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

const hashPassword = async (pw) => {
  const saltRounds = 10;
  return await bcrypt.hash(pw, saltRounds);
}

const getUserInfo = async (condition) => {
  try {
    queryResult2 = await pool.query(`SELECT USER_ID, EMAIL, NAME, PROFILE FROM USER_BASE_INFO WHERE USER_ID = '${ id }'`);
    const user = queryResult2.rows[0];
    if (!user) return res.status(404).end();
    return user
  } catch(err) {
    console.log(err);
    throw err;
  }
}

const createUserInfo = async (body) => {
  const id = getRandomID(16);
  const hashedPw = await hashPassword(body.pw);
  const statement = {
    text: 'INSERT INTO USER_BASE_INFO (USER_ID, EMAIL, NAME, PW, PROFILE, CRET_DTIME, CRET_ID, MOD_DTIME, MOD_ID) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING USER_ID',
    values: [id, body.email, body.name, hashedPw, body.profile, new Date(), id, new Date(), id]
  }
  const result = await pool.query(statement);
  return result.rows[0].user_id;
}

module.exports = {
  index,
  login,
  logout,
  signup,
  checkDuplEmail
}