const express = require('express');
const router = express.Router();
const ctrl = require('./user.ctrl');

router.get('/', ctrl.list);
router.get('/:id', ctrl.show);
router.delete('/:id', ctrl.destroy);

module.exports = router;