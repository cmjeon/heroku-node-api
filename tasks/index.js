const express = require('express');
const router = express.Router();
const ctrl = require('./tasks.ctrl');

router.get('/', ctrl.list);
router.get('/:taskId', ctrl.show);
router.delete('/:taskId', ctrl.destroy);
router.post('/', ctrl.create);
router.put('/:taskId', ctrl.update);

module.exports = router;