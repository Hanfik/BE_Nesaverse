const express = require('express');
const router = express.Router();
const { getChannels, createChannel, updateChannel, deleteChannel } = require('../controllers/channels.controller');

router.get('/', getChannels);
router.post('/', createChannel);
router.put('/:id', updateChannel);
router.delete('/:id', deleteChannel);

module.exports = router;
