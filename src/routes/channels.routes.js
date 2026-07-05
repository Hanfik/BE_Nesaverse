const express = require('express');
const router = express.Router();
const { getChannels } = require('../controllers/channels.controller');

router.get('/', getChannels);

module.exports = router;
