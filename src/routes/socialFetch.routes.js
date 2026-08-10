const express = require('express');
const router = express.Router();
const { fetchSocialData } = require('../controllers/socialFetch.controller');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/fetch', verifyToken, fetchSocialData);

module.exports = router;
