var { db2Promise } = require('../mysql/mysql');
var bcrypt = require('bcrypt');
var { newToken } = require('../utils/auth.js');
var { getRandomID } = require('../utils/util.js');
const config = require('../config/config.json')
const nodemailer = require('nodemailer');// const smtpTransport = require('nodemailer-smtp-transport');

const index = (req, res) => {
  res.json('Auth!');
}

const login = async (req, res) => {
  const email = req.body.email;
  const pw = req.body.pw;
  if (!pw) return res.status(401).json('Authentication failed. Wrong password.');
  try {
    const executeResult = await db2Promise.execute(`SELECT * FROM USER_BASE_INFO WHERE EMAIL = '${email}'`);
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

const signup = async (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const pw = req.body.pw;
  const saltRounds = 10;
  let hashedpw;
  const profile = req.body.profile;
  let id = getRandomID(16);

  const queryResult1 = await db2Promise.query(`SELECT * FROM USER_BASE_INFO WHERE EMAIL = '${email}'`);
  const rows1 = queryResult1[0];
  const defs1 = queryResult1[1];
  const err1 = queryResult1[2];
  if (err1) {
    return res.status(500).send('Internal Server Error');
  }
  const user1 = rows1[0];
  // console.log('user1', user1);
  if (user1) {
    return res.status(409).json({
      success: 'true',
      user: { email: email },
      message: 'duplEmail'
    }).end();
  }
  // console.log('dddddd3');
  const _hashedpw = await bcrypt.hash(pw, saltRounds);
  // console.log('_hashedpw', _hashedpw)
  hashedpw = _hashedpw;
  // console.log('dddddd4');
  // console.log('dddddd5');
  const excuteResult = await db2Promise.execute('INSERT INTO USER_BASE_INFO (USER_ID, EMAIL, NAME, PW, PROFILE, CRET_DTIME, CRET_ID, MOD_DTIME, MOD_ID) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, email, name, hashedpw, profile, new Date(), id, new Date(), id]);
  // console.log('result', result)
  const rows2 = excuteResult[0];
  const err2 = excuteResult[1];
  if (err2) {
    console.log(err2);
    return res.status(500).json('Internal Server Error');
  }
  // console.log('dddddd6');

  const queryResult2 = await db2Promise.query(`SELECT USER_ID, EMAIL, NAME, PROFILE FROM USER_BASE_INFO WHERE USER_ID = '${id}'`);
  // console.log('dddddd7');
  const rows3 = queryResult2[0];
  const defs3 = queryResult2[1];
  const err3 = queryResult2[2];
  if (err3) {
    return res.status(500).send('Internal Server Error');
  }
  const user = rows3[0];
  // console.log(user);
  if (!user) return res.status(404).end();

  sendEmail(user);

  return res.status(201).json({
    success: 'true',
    user: user,
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

const sendEmail = async (user) => {
  console.log('### sendEmail', config.email.user, config.email.pass, user.EMAIL)
  // nodemailer Transport 생성
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.email.user,
      pass: config.email.pass
    }
  });

  const emailOptions = { // 옵션값 설정    
    from: config.email.user,
    to: 'chmin82@gmail.com',
    subject: 'Sending Email using Node.js[nodemailer]',
    text: 'That was easy!'
  };

  const result = await transporter.sendMail(emailOptions);

  console.log('Message sent: %s', result);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

module.exports = {
  index,
  login,
  logout,
  signup,
  checkDuplEmail
}