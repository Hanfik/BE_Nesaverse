const express = require('express');
const router = express.Router();
const { getDonations, getTopDonors, createDonation } = require('../controllers/donations.controller');
router.get('/', getDonations);
router.get('/top', getTopDonors);
router.post('/', createDonation);
module.exports = router;
