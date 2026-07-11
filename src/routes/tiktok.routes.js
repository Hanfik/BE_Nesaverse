const express = require('express');
const router = express.Router();
const { getTikTok, createTikTok, updateTikTok, deleteTikTok } = require('../controllers/tiktok.controller');
router.get('/', getTikTok);
router.post('/', createTikTok);
router.put('/:id', updateTikTok);
router.delete('/:id', deleteTikTok);
module.exports = router;
