const express = require('express');
const router = express.Router();
const { getPlatforms, getAllPlatforms, getTypes, createPlatform, updatePlatform, deletePlatform, submitFanart } = require('../controllers/platforms.controller');
const { verifyToken } = require('../middleware/authMiddleware');
const { rateLimit } = require('../middleware/rateLimit');

router.get('/types', getTypes);
router.get('/all', verifyToken, getAllPlatforms);
router.get('/', getPlatforms);

// Public fanart submission — rate limited: 5 per IP per hour
router.post('/submit', rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: 'Terlalu banyak submission. Coba lagi dalam 1 jam.' }), submitFanart);

router.post('/', verifyToken, createPlatform);
router.put('/:id', verifyToken, updatePlatform);
router.delete('/:id', verifyToken, deletePlatform);

module.exports = router;
