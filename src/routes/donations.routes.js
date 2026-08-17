const express = require('express');
const router = express.Router();
const { getDonations, getTopDonors, createDonation, uploadProof } = require('../controllers/donations.controller');
const { rateLimit } = require('../middleware/rateLimit');

/**
 * @swagger
 * /api/donations:
 *   get:
 *     summary: Get all completed donations
 *     tags: [Donations]
 *     responses:
 *       200:
 *         description: List of recent completed donations (max 50)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Donation'
 */
router.get('/', getDonations);

/**
 * @swagger
 * /api/donations/top:
 *   get:
 *     summary: Get top donors
 *     tags: [Donations]
 *     responses:
 *       200:
 *         description: Top 5 donors by total amount
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TopDonor'
 */
router.get('/top', getTopDonors);

/**
 * @swagger
 * /api/donations:
 *   post:
 *     summary: "Create a new donation (status: pending)"
 *     tags: [Donations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DonationCreate'
 *     responses:
 *       201:
 *         description: Donation created successfully
 */
router.post('/',
  rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: 'Terlalu banyak request donasi. Coba lagi dalam 1 jam.' }),
  createDonation
);

/**
 * @swagger
 * /api/donations/{id}/proof:
 *   post:
 *     summary: Upload payment proof for a donation
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proof_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proof uploaded successfully
 */
router.post('/:id/proof',
  rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: 'Terlalu banyak upload bukti. Coba lagi dalam 1 jam.' }),
  uploadProof
);

module.exports = router;
