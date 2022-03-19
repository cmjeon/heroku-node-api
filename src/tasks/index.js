const express = require('express');
const router = express.Router();
const ctrl = require('./tasks.ctrl');

router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.get('/:taskId', ctrl.show);
router.delete('/:taskId', ctrl.destroy);
router.patch('/:taskId', ctrl.update);

module.exports = router;