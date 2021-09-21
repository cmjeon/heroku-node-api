var { db, db2Promise } = require('../mysql/mysql');
var bcrypt = require('bcrypt');
var { newToken } = require('../utils/auth.js');
var { getRandomID } = require('../utils/util.js');

const index = (req, res) => {
  res.json('Auth!');
}

const login = async (req, res) => {
  const email = req.body.email;
  const pw = req.body.pw;
  const [users, fields, err] = await db2Promise.execute(`SELECT * FROM USER_BASE_INFO WHERE EMAIL = '${email}'`);
  if (err) {
    return res.status(500).json('Internal Server Error');
  }
  const user = users[0];
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

  const [result1, fields1, err1] = await db2Promise.query(`SELECT * FROM USER_BASE_INFO WHERE EMAIL = '${email}'`);
  if (err1) {
    return res.status(500).send('Internal Server Error');
  }
  const user1 = result1[0];
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
  const [result, err2] = await db2Promise.execute('INSERT INTO USER_BASE_INFO (USER_ID, EMAIL, NAME, PW, PROFILE, CRET_DTIME, CRET_ID, MOD_DTIME, MOD_ID) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, email, name, hashedpw, profile, new Date(), id, new Date(), id]);
  // console.log('result', result)
  if (err2) {
    console.log(err2);
    return res.status(500).json('Internal Server Error');
  }
  // console.log('dddddd6');

  const [result3, fields3, err3] = await db2Promise.query(`SELECT USER_ID, EMAIL, NAME, PROFILE FROM USER_BASE_INFO WHERE USER_ID = '${id}'`);
  // console.log('dddddd7');
  const user = result3[0];
  // console.log(user);
  if (!user) return res.status(404).end();
  return res.status(201).json({
    success: 'true',
    user: user,
    message: 'Signup Success'
  });

}
/*
const email = req.body.email;
const name = req.body.name;
const pw = req.body.pw;
let hashedpw;
const profile = req.body.profile;
let id = getRandomID(16);

db.query(`SELECT * FROM USER_BASE_INFO WHERE EMAIL = '${email}'`, (err, users) => {
  if (err) {
    return res.status(500).send('Internal Server Error');
  }
  const user = users[0];
  if (user) {
    res.status(409).json({
      success: 'true',
      user: { email: email },
      message: 'duplEmail'
    });
  } else {
    bcrypt.hash(pw, saltRounds, function (err, _hashedpw) {
      hashedpw = _hashedpw;
      // console.log(email, pw);

      db.query('INSERT INTO USER_BASE_INFO (USER_ID, EMAIL, NAME, PW, PROFILE, CRET_DTIME, CRET_ID, MOD_DTIME, MOD_ID) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, email, name, hashedpw, profile, new Date(), id, new Date(), id], (err, result) => {
          // id = results.insertId;
          if (err) {
            console.log(err);
            return res.status(500).json('Internal Server Error');
          }
          // console.log(id);
          db.query(`SELECT USER_ID, EMAIL, NAME, PROFILE FROM USER_BASE_INFO WHERE USER_ID = '${id}'`, (err, users) => {
            // console.log(err);
            const user = users[0];
            if (!user) return res.status(404).end();
            res.status(201).json({
              success: 'true',
              user: user,
              message: 'Signup Success'
            });
          });
        });
    });
  }
});
*/

const checkDuplEmail = async (req, res) => {
  let success, message, result;
  const email = req.body.email;
  const [result1, fields1, err1] = await db2Promise.query(`SELECT * FROM USER_BASE_INFO WHERE EMAIL = '${email}'`);
  if (err1) {
    return res.status(500).send('Internal Server Error');
  }
  const user = result1[0];
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
  /*
  let success, message, result;
  const email = req.body.email;
  db.query(`SELECT * FROM USER_BASE_INFO WHERE EMAIL = '${email}'`, (err, users) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    const user = users[0];
    if (user) {
      success = 'true';
      message = 'duplEmail';
      result = {
        success: success,
        message: message,
        user: { email: email },
      };
      res.status(200).json(result);
    }
  });
  */
}

module.exports = {
  index,
  login,
  logout,
  signup,
  checkDuplEmail
}