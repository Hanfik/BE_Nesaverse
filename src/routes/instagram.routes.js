const express = require('express');
const router = express.Router();
const { getInstagram, createInstagram, updateInstagram, deleteInstagram } = require('../controllers/instagram.controller');

/**
 * @swagger
 * /api/instagram:
 *   get:
 *     summary: Get all Instagram accounts
 *     tags: [Instagram]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or handle
 *     responses:
 *       200:
 *         description: List of Instagram accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InstagramAccount'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getInstagram);

/**
 * @swagger
 * /api/instagram:
 *   post:
 *     summary: Create a new Instagram account
 *     tags: [Instagram]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InstagramCreate'
 *     responses:
 *       201:
 *         description: Instagram account created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstagramAccount'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createInstagram);

/**
 * @swagger
 * /api/instagram/{id}:
 *   put:
 *     summary: Update an Instagram account
 *     tags: [Instagram]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InstagramCreate'
 *     responses:
 *       200:
 *         description: Account updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstagramAccount'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', updateInstagram);

/**
 * @swagger
 * /api/instagram/{id}:
 *   delete:
 *     summary: Delete an Instagram account
 *     tags: [Instagram]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Account deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessBool'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deleteInstagram);

module.exports = router;
