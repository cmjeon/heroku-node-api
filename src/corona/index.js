const express = require('express');
const router = express.Router();
const ctrl = require('./corona.ctrl');

router.get('/', ctrl.index);
router.get('/korea/beta', ctrl.koreaBeta);
router.get('/korea/vaccine', ctrl.koreaVaccine);
router.get('/korea/counter', ctrl.koreaCounter);
router.get('/korea/country', ctrl.koreaCountry);

module.exports = router;
