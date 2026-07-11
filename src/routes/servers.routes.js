const express = require('express');
const router = express.Router();
const { getServers, createServer, updateServer, deleteServer } = require('../controllers/servers.controller');

/**
 * @swagger
 * /api/servers:
 *   get:
 *     summary: Get all Discord servers
 *     tags: [Servers]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (e.g. Gaming, Tech)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by server name
 *     responses:
 *       200:
 *         description: List of servers with categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Server'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getServers);

/**
 * @swagger
 * /api/servers:
 *   post:
 *     summary: Create a new Discord server
 *     tags: [Servers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServerCreate'
 *     responses:
 *       201:
 *         description: Server created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Server'
 *       400:
 *         description: Validation error (name required)
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
router.post('/', createServer);

/**
 * @swagger
 * /api/servers/{id}:
 *   put:
 *     summary: Update a Discord server
 *     tags: [Servers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Server ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServerCreate'
 *     responses:
 *       200:
 *         description: Server updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Server'
 *       404:
 *         description: Server not found
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
router.put('/:id', updateServer);

/**
 * @swagger
 * /api/servers/{id}:
 *   delete:
 *     summary: Delete a Discord server
 *     tags: [Servers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Server ID
 *     responses:
 *       200:
 *         description: Server deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deleteServer);

module.exports = router;
