const express = require('express');
const router = express.Router();
const { getCommunities } = require('../controllers/communities.controller');

/**
 * @swagger
 * /api/communities:
 *   get:
 *     summary: Get all communities
 *     tags: [Communities]
 *     responses:
 *       200:
 *         description: List of communities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Community'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getCommunities);

module.exports = router;
