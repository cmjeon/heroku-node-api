const express = require('express');
const router = express.Router();
const ctrl = require('./login.ctrl');

// const { newToken } = require('../utils/auth');

router.get('/', ctrl.index);
router.post('/login', ctrl.login);
router.get('/logout', ctrl.logout);

module.exports = router;