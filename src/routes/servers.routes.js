const express = require('express');
const router = express.Router();
const { getServers } = require('../controllers/servers.controller');

router.get('/', getServers);

module.exports = router;
