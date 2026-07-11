const express = require('express');
const router = express.Router();
const { getYouTube, createYouTube, updateYouTube, deleteYouTube } = require('../controllers/youtube.controller');

/**
 * @swagger
 * /api/youtube:
 *   get:
 *     summary: Get all YouTube channels
 *     tags: [YouTube]
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
 *         description: Search by channel name
 *     responses:
 *       200:
 *         description: List of YouTube channels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/YouTubeChannel'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getYouTube);

/**
 * @swagger
 * /api/youtube:
 *   post:
 *     summary: Create a new YouTube channel
 *     tags: [YouTube]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/YouTubeCreate'
 *     responses:
 *       201:
 *         description: YouTube channel created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YouTubeChannel'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createYouTube);

/**
 * @swagger
 * /api/youtube/{id}:
 *   put:
 *     summary: Update a YouTube channel
 *     tags: [YouTube]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Channel ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/YouTubeCreate'
 *     responses:
 *       200:
 *         description: Channel updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YouTubeChannel'
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
router.put('/:id', updateYouTube);

/**
 * @swagger
 * /api/youtube/{id}:
 *   delete:
 *     summary: Delete a YouTube channel
 *     tags: [YouTube]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Channel ID
 *     responses:
 *       200:
 *         description: Channel deleted
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
router.delete('/:id', deleteYouTube);

module.exports = router;
