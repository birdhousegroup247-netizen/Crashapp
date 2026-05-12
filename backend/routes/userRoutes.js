const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');

// Get user profile and their reports
router.get('/:id', getUserProfile);

module.exports = router;