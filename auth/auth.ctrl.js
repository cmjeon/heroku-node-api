var { db, db2Promise, connection3 } = require('../mysql/mysql');
var bcrypt = require('bcrypt');
var { newToken } = require('../utils/auth.js');
var { getRandomID } = require('../utils/util.js');

const index = (req, res) => {
  res.json('Auth!');
}

const saltRounds = 10;

const login = async (req, res) => {
  const email = req.body.email;
  const pw = req.body.pw;
  // console.log(email, pw);
  // console.log('###db2###')
  const [rows, fields, err1] = await db2Promise.execute(`SELECT * FROM USER_BASE_INFO WHERE EMAIL = '${email}'`);
  // console.log('###db2###', rows);
  if (err1) {
    return res.status(500).json('Internal Server Error');
  }
  const user = rows[0];
  // console.log('users', user);
  if (!user) {
    // console.log('dddddd');
    return res.status(401).send('Authentication failed. User not found.');
  }
  // const [result, err2] = await bcrypt.compare(pw, user.PW);
  // console.log('result');
  const match = await bcrypt.compare(pw, user.PW);
  console.log('match', match);

  if (match) {
    // create token with user info
    const token = newToken(user);

    // current logged-in user
    const loggedInUser = {
      userId: user.USER_ID,
      email: user.EMAIL,
      name: user.NAME,
      profile: user.PROFILE
    };

    // return the information including token as JSON
    res.status(200).json({
      success: true,
      user: loggedInUser,
      message: 'Login Success',
      token: token,
    });
  } else {
    res.status(401).json('Authentication failed. Wrong password.');
  }
}

const logout = (req, res) => {

}

const signup = (req, res) => {
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
}

const checkDuplEmail = (req, res) => {
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
}

module.exports = {
  index,
  login,
  logout,
  signup,
  checkDuplEmail
}