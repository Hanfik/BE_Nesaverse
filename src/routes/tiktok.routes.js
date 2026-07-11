const express = require('express');
const router = express.Router();
const { getTikTok, createTikTok, updateTikTok, deleteTikTok } = require('../controllers/tiktok.controller');

/**
 * @swagger
 * /api/tiktok:
 *   get:
 *     summary: Get all TikTok accounts
 *     tags: [TikTok]
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
 *         description: Search by title or creator
 *     responses:
 *       200:
 *         description: List of TikTok accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TikTokAccount'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getTikTok);

/**
 * @swagger
 * /api/tiktok:
 *   post:
 *     summary: Create a new TikTok account
 *     tags: [TikTok]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TikTokCreate'
 *     responses:
 *       201:
 *         description: TikTok account created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TikTokAccount'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createTikTok);

/**
 * @swagger
 * /api/tiktok/{id}:
 *   put:
 *     summary: Update a TikTok account
 *     tags: [TikTok]
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
 *             $ref: '#/components/schemas/TikTokCreate'
 *     responses:
 *       200:
 *         description: Account updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TikTokAccount'
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
router.put('/:id', updateTikTok);

/**
 * @swagger
 * /api/tiktok/{id}:
 *   delete:
 *     summary: Delete a TikTok account
 *     tags: [TikTok]
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
router.delete('/:id', deleteTikTok);

module.exports = router;
