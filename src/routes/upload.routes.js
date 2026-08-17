const express = require('express');
const router = express.Router();
const { requestPresign, requestDonationProofPresign } = require('../controllers/upload.controller');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/presign', verifyToken, requestPresign);
router.post('/donation-proof', requestDonationProofPresign);

module.exports = router;
