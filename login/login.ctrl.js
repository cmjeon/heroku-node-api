var db = require('../mysql/mysql');
var bcrypt = require('bcrypt');
var { newToken } = require('../utils/auth.js');

const index = (req, res) => {
  res.json('Login!');
}

const saltRounds = 10;

const login = (req, res) => {
  const email = req.body.email;
  const pw = req.body.pw;
  // console.log(email, pw);
  db.query(`SELECT * FROM USER_INFO WHERE EMAIL = '${email}'`, (err, users) => {
    if (err) {
      return res.status(500).json('Internal Server Error');
    }
    const user = users[0];
    // console.log(users);
    // non registered user
    if (!user) {
      // console.log('dddddd');
      return res.status(401).send('Authentication failed. User not found.');
    }
    // console.log('user:', user);
    // bcrypt.hash(pw, saltRounds, function(err, hash) {
    //   console.log(':::::', hash);
    // });
    bcrypt.compare(pw, user.PW, (err, result) => {
      if (err) {
        // console.log('err????', err)
        res.status(500).send('Internal Server Error');
      }
      if (result) {
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
    });
  });
}

const logout = (req, res) => {

}

const signup = (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const pw = req.body.pw;
  let hashedpw;
  const profile = req.body.profile;
  let id;

  // console.log('email', email);

  bcrypt.hash(pw, saltRounds, function (err, _hashedpw) {
    hashedpw = _hashedpw;
    // console.log(email, pw);
    db.query('INSERT INTO USER_INFO (USER_ID, EMAIL, NAME, PW, PROFILE) VALUES ( null, ?, ?, ?, ?)',
      [email, name, hashedpw, profile], (err, results) => {
        // console.log('uuuuuuuuuuuu', results.insertId); 
        id = results.insertId;
        if (err) {
          return res.status(500).json('Internal Server Error');
        }
        // console.log(id);
        db.query(`SELECT USER_ID, EMAIL, NAME, PROFILE FROM USER_INFO WHERE USER_ID = ${id}`, (err, users) => {
          // console.log(err);
          const user = users[0];
          if (!user) return res.status(404).end();
          res.status(201).json(user);
        });
      });
  });
}

module.exports = {
  index,
  login,
  logout,
  signup
}