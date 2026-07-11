const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getRoblox, createRoblox, updateRoblox, deleteRoblox } = require('../controllers/roblox.controller');

/**
 * @swagger
 * /api/roblox:
 *   get:
 *     summary: Get all Roblox games
 *     tags: [Roblox]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by game name
 *     responses:
 *       200:
 *         description: List of Roblox games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RobloxGame'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getRoblox);

/**
 * @swagger
 * /api/roblox:
 *   post:
 *     summary: Create a new Roblox game
 *     tags: [Roblox]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RobloxCreate'
 *     responses:
 *       201:
 *         description: Roblox game created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RobloxGame'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', verifyToken, createRoblox);

/**
 * @swagger
 * /api/roblox/{id}:
 *   put:
 *     summary: Update a Roblox game
 *     tags: [Roblox]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Game ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RobloxCreate'
 *     responses:
 *       200:
 *         description: Game updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RobloxGame'
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
router.put('/:id', verifyToken, updateRoblox);

/**
 * @swagger
 * /api/roblox/{id}:
 *   delete:
 *     summary: Delete a Roblox game
 *     tags: [Roblox]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Game ID
 *     responses:
 *       200:
 *         description: Game deleted
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
router.delete('/:id', verifyToken, deleteRoblox);

module.exports = router;
