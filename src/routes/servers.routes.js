const express = require('express');
const router = express.Router();
const { getServers, createServer, updateServer, deleteServer } = require('../controllers/servers.controller');

router.get('/', getServers);
router.post('/', createServer);
router.put('/:id', updateServer);
router.delete('/:id', deleteServer);

module.exports = router;
