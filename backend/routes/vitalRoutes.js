
const express = require('express');
const router = express.Router();
const {
  addVital,
  getVitals,
  getVital,
  updateVital,
  deleteVital
} = require('../controllers/vitalController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getVitals)
  .post(protect, addVital);

router.route('/:id')
  .get(protect, getVital)
  .put(protect, updateVital)
  .delete(protect, deleteVital);

module.exports = router;