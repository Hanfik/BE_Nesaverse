const express = require('express');
const router = express.Router();
const { getInstagram, createInstagram, updateInstagram, deleteInstagram } = require('../controllers/instagram.controller');
router.get('/', getInstagram);
router.post('/', createInstagram);
router.put('/:id', updateInstagram);
router.delete('/:id', deleteInstagram);
module.exports = router;
