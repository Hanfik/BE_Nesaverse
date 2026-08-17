const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getCategories, getAllCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categories.controller');

router.get('/all', verifyToken, getAllCategories);
router.get('/', getCategories);
router.post('/', verifyToken, createCategory);
router.put('/:id', verifyToken, updateCategory);
router.delete('/:id', verifyToken, deleteCategory);

module.exports = router;
