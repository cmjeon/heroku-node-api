// import swaggerUi from 'swagger-ui-express';
var swaggerUi = require('swagger-ui-express');
// import swaggerDocument from './api-spec.json';
var swaggerDocument = require('./api-spec.json')
// import { Router } from 'express';
// const router = Router();
const express = require('express');
const router = express.Router();

router.use('/api/v1', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// router.use('/api/v1', router);

module.exports = router;
