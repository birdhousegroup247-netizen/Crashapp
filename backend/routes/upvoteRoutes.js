const express = require('express');
const router = express.Router();
const { upvoteReport, removeUpvote } = require('../controllers/upvoteController');
const authMiddleware = require('../middleware/authMiddleware');

// Upvote a report
router.post('/:id/upvote', authMiddleware, upvoteReport);

// Remove upvote
router.delete('/:id/upvote', authMiddleware, removeUpvote);

module.exports = router;