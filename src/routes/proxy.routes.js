const express = require('express');
const router = express.Router();
const { imageProxy } = require('../controllers/proxy.controller');

router.get('/image', imageProxy);

module.exports = router;
