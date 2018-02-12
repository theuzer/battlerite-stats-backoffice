const express = require('express');

const statsController = require('../controllers/statsController');

const router = express.Router();

router.get('/stats', statsController.getStatsByDate);
router.get('/test', statsController.getStatsByLogId);

module.exports = router;
