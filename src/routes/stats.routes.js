const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getStats, recordVisit, getChartData } = require('../controllers/stats.controller');

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get platform statistics
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Platform stats with member counts, velocity, viral index, etc.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stats'
 *       404:
 *         description: Stats not found
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
router.get('/', getStats);

/**
 * @swagger
 * /api/stats/visit:
 *   post:
 *     summary: Record a page visit
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Visit recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/visit', verifyToken, recordVisit);

/**
 * @swagger
 * /api/stats/chart:
 *   get:
 *     summary: Get chart data for dashboard
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Platform distribution, visitor trend, and donation trend data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChartData'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/chart', getChartData);

module.exports = router;
