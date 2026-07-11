const express = require('express');
const router = express.Router();
const { getRoblox, createRoblox, updateRoblox, deleteRoblox } = require('../controllers/roblox.controller');
router.get('/', getRoblox);
router.post('/', createRoblox);
router.put('/:id', updateRoblox);
router.delete('/:id', deleteRoblox);
module.exports = router;
