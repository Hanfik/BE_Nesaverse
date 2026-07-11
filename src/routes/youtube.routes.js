const express = require('express');
const router = express.Router();
const { getYouTube, createYouTube, updateYouTube, deleteYouTube } = require('../controllers/youtube.controller');
router.get('/', getYouTube);
router.post('/', createYouTube);
router.put('/:id', updateYouTube);
router.delete('/:id', deleteYouTube);
module.exports = router;
