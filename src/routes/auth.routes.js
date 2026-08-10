const express = require('express');
const router = express.Router();
const { getGitHubAuthURL, handleGitHubCallback } = require('../controllers/auth.github.controller');
const { rateLimit } = require('../middleware/rateLimit');

/**
 * @swagger
 * /api/auth/github:
 *   get:
 *     summary: Get GitHub OAuth authorization URL
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Returns GitHub OAuth URL
 *       500:
 *         description: Failed to generate URL
 */
router.get(
  '/github',
  rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' }),
  getGitHubAuthURL
);

/**
 * @swagger
 * /api/auth/github/callback:
 *   get:
 *     summary: GitHub OAuth callback handler
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects to frontend with token or error
 */
router.get('/github/callback', handleGitHubCallback);

module.exports = router;
