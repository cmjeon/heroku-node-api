const { pool } = require('../postgresql/postgresql');
const bcrypt = require('bcrypt');
const { newToken } = require('../utils/auth.js');
const { getRandomID } = require('../utils/util.js');
const { sendEmail } = require('../utils/emailSender.js');

const index = (req, res) => {
  res.json('Auth!');
}

const login = async (req, res) => {
  const email = req.body.email;
  const pw = req.body.pw;
  if (!email || !pw) return res.status(401).json('Authentication failed. Wrong email or password.');
  try {
    const user = await getUserInfo({ email });
    if (!user) {
      return res.status(401).json('Authentication failed. Wrong email or password.');
    }
    const pwMatch = await bcrypt.compare(pw, user.pw);
    if (!pwMatch) {
      return res.status(401).json('Authentication failed. Wrong password.');
    }
    const loginUser = {
      userId: user.user_id,
      email: user.email,
      name: user.name,
      profile: user.profile
    };
    const token = newToken(user);

    return res.status(200).json({
      success: true,
      user: loginUser,
      message: 'Login Success',
      token: token,
    });
  } catch (err) {
    console.log(err)
    return res.status(500).send('Internal Server Error');
  }
}

const logout = (req, res) => {

}

const signup = async (req, res) => {
  try {
    const email = req.body.email;
    const existUser = await getUserInfo({ email })
    if(existUser) {
      return res.status(409).json({
        success: false,
        user: { email: email },
        message: 'Exist Email'
      }).end();
    }
    const userId = await createUserInfo(req.body)
    const newUser = await getUserInfo({ userId })
    if (!newUser) return res.status(404).end();
    return res.status(201).json({
      success: true,
      user: newUser,
      message: 'Signup Success'
    });
  } catch(err) {
    console.log(err);
    return res.status(500).json('Internal Server Error');
  }
}

const checkDuplEmail = async (req, res) => {
  const email = req.body.email;
  const existUser = await getUserInfo({ email })
  if(existUser) {
    console.log('### Exist Email')
    return res.status(409).json({
      success: false,
      user: { email: email },
      message: 'Exist Email'
    }).end();
  }
  const result = {
    success : true,
    user: { email: email },
    message: 'NotExist Email'
  }
  return res.status(200).json(result);
}

const hashPassword = async (pw) => {
  const saltRounds = 10;
  return await bcrypt.hash(pw, saltRounds);
}

const getUserInfo = async (condition) => {
  try {
    let where
    if(condition.userId) {
      where = `USER_ID = '${ condition.userId }'`
    } else if(condition.email) {
      where = `EMAIL = '${ condition.email }'`
    }

    let { rows } = await pool.query(`SELECT USER_ID, PW, EMAIL, NAME, PROFILE FROM USER_BASE_INFO WHERE ${ where }`);
    return rows[0]
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
  const { rows } = await pool.query(statement);
  return rows[0].user_id;
}

module.exports = {
  index,
  login,
  logout,
  signup,
  checkDuplEmail
}