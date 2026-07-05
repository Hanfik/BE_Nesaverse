const express = require('express');
const router = express.Router();
const { getCommunities } = require('../controllers/communities.controller');

router.get('/', getCommunities);

module.exports = router;
