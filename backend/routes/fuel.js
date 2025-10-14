const express = require('express');
const router = express.Router();
const {
  getFuelRecords,
  getFuelRecord,
  createFuelRecord,
  updateFuelRecord,
  deleteFuelRecord,
  getFuelStats
} = require('../controllers/fuelController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getFuelRecords)
  .post(createFuelRecord);

router.get('/stats', getFuelStats);

router.route('/:id')
  .get(getFuelRecord)
  .put(authorize('admin', 'gestionnaire'), updateFuelRecord)
  .delete(authorize('admin'), deleteFuelRecord);

module.exports = router;
