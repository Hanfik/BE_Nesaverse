const express = require('express');
const router = express.Router();
const { getPlatforms, getAllPlatforms, getTypes, createPlatform, updatePlatform, deletePlatform } = require('../controllers/platforms.controller');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/types', getTypes);
router.get('/all', verifyToken, getAllPlatforms);
router.get('/', getPlatforms);
router.post('/', verifyToken, createPlatform);
router.put('/:id', verifyToken, updatePlatform);
router.delete('/:id', verifyToken, deletePlatform);

module.exports = router;
