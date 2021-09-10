const express = require('express');
const router = express.Router();
const ctrl = require('./users.ctrl');

router.get('/', ctrl.list);
router.get('/:id', ctrl.show);
router.delete('/:id', ctrl.destroy);
// router.post('/', ctrl.create);
// router.put('/:id', ctrl.update);

module.exports = router;