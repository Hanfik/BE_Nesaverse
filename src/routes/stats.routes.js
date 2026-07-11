const express = require('express');
const router = express.Router();
const { getStats, recordVisit, getChartData } = require('../controllers/stats.controller');

router.get('/',        getStats);
router.post('/visit',  recordVisit);
router.get('/chart',   getChartData);

module.exports = router;
