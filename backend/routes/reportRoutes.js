const express = require('express');
const router = express.Router();
const {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport
} = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', getReports);
router.get('/search', getReports);
router.get('/:id', getReport);

// Protected routes
router.post('/', authMiddleware, createReport);
router.put('/:id', authMiddleware, updateReport);
router.delete('/:id', authMiddleware, deleteReport);

module.exports = router;