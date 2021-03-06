const express = require('express');
const router = express.Router();
const ctrl = require('./auth.ctrl');

// const { newToken } = require('../utils/auth');

router.get('/', ctrl.index);
router.post('/login', ctrl.login);
router.get('/logout', ctrl.logout);
router.post('/signup', ctrl.signup);
router.get('/checkDuplEmail', ctrl.checkDuplEmail);

module.exports = router;