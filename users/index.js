const express = require('express');
const router = express.Router();
const ctrl = require('./user.ctrl');

router.get('/', ctrl.list);
router.get('/:id', ctrl.show);

module.exports = router;