const express = require('express');
const router = express.Router();
const { getDonations, getTopDonors, createDonation } = require('../controllers/donations.controller');

/**
 * @swagger
 * /api/donations:
 *   get:
 *     summary: Get all donations
 *     tags: [Donations]
 *     responses:
 *       200:
 *         description: List of recent donations (max 50)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Donation'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/top', getTopDonors);

/**
 * @swagger
 * /api/donations:
 *   post:
 *     summary: Create a new donation
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donation'
 *       400:
 *         description: Invalid amount
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
router.post('/', createDonation);

module.exports = router;
