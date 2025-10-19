
const express = require('express');
const router = express.Router();
const {
  uploadReport,
  getReports,
  getReport,
  deleteReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(protect, getReports)
  .post(protect, upload.single('file'), uploadReport);

router.route('/:id')
  .get(protect, getReport)
  .delete(protect, deleteReport);

module.exports = router;
