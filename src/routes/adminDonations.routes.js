const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getDonations, getDonationStats, exportDonations, updateDonationStatus, deleteDonation } = require('../controllers/adminDonations.controller');

router.get('/stats', verifyToken, getDonationStats);
router.get('/export', verifyToken, exportDonations);
router.get('/', verifyToken, getDonations);
router.patch('/:id/status', verifyToken, updateDonationStatus);
router.delete('/:id', verifyToken, deleteDonation);

module.exports = router;
