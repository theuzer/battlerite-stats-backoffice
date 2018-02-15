const express = require('express');

const statsController = require('../controllers/statsController');
const characterController = require('../controllers/characterController');

const router = express.Router();

router.get('/stats', statsController.getStats);
router.get('/player', characterController.getCharacterHistory);

module.exports = router;
