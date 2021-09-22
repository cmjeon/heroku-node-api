const express = require('express');
const router = express.Router();
const ctrl = require('./weathers.ctrl');

router.get('/', ctrl.index);

module.exports = router;