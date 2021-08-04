const express = require('express');
const router = express.Router();
const ctrl = require('./user.ctrl');

router.get('/', ctrl.index);
router.get('/:id', ctrl.show);

module.exports = router;