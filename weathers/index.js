const express = require('express');
const router = express.Router();
const ctrl = require('./weathers.ctrl');

router.get('/', ctrl.index);
router.get('/current', ctrl.current);

module.exports = router;